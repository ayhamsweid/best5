const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { JwtService } = require('@nestjs/jwt');
const { Reflector } = require('@nestjs/core');
const sharp = require('sharp');
const { AuthService } = require('../dist/modules/auth/auth.service');
const { sanitizePostPayload } = require('../dist/common/content-security');
const { processUploadedImage } = require('../dist/common/image-upload');
const { csrfProtection } = require('../dist/common/csrf-protection');
const { JwtStrategy } = require('../dist/modules/auth/jwt.strategy');
const { RolesGuard } = require('../dist/modules/auth/guards/roles.guard');
const { ROLES_KEY } = require('../dist/modules/auth/decorators/roles.decorator');

process.env.JWT_ACCESS_SECRET = 'a'.repeat(64);
process.env.JWT_REFRESH_SECRET = 'b'.repeat(64);
process.env.JWT_ISSUER = 'security-test';
process.env.JWT_AUDIENCE = 'security-test-client';
process.env.JWT_REFRESH_TTL = '3600';

const fakePrisma = (user) => {
  const sessions = new Map();
  const matches = (session, where) =>
    (!where.id || session.id === where.id) &&
    (!where.family_id || session.family_id === where.family_id) &&
    (where.revoked_at !== null || session.revoked_at === null);
  const prisma = {
    sessions,
    user: {
      findUnique: async ({ where }) => where.id === user.id ? user : null
    },
    refreshSession: {
      create: async ({ data }) => {
        const value = { ...data, revoked_at: null, last_used_at: null, replaced_by_id: null };
        sessions.set(value.id, value);
        return value;
      },
      findUnique: async ({ where }) => sessions.get(where.id) || null,
      updateMany: async ({ where, data }) => {
        let count = 0;
        for (const [id, session] of sessions) {
          if (!matches(session, where)) continue;
          sessions.set(id, { ...session, ...data });
          count += 1;
        }
        return { count };
      }
    }
  };
  prisma.$transaction = async (callback) => callback(prisma);
  return prisma;
};

test('refresh tokens rotate once and replay revokes the family', async () => {
  const user = { id: 'user-1', email: 'admin@example.test', role: 'ADMIN', is_active: true };
  const prisma = fakePrisma(user);
  const auth = new AuthService(prisma, new JwtService());
  const original = await auth.issueRefreshToken(user);
  const rotated = await auth.rotateRefreshToken(original);
  assert.ok(rotated.refreshToken);
  await assert.rejects(() => auth.rotateRefreshToken(original), /Invalid refresh token/);
  await assert.rejects(() => auth.rotateRefreshToken(rotated.refreshToken), /Invalid refresh token/);
});

test('stored post content removes scripts and unsafe URL schemes', () => {
  const payload = sanitizePostPayload({
    content_ar: '<p>safe</p><script>alert(1)</script><a href="javascript:alert(2)">bad</a>',
    content_blocks_json: [{ type: 'cta', data: { url: 'javascript:alert(3)' } }]
  });
  assert.equal(payload.content_ar.includes('<script'), false);
  assert.equal(payload.content_ar.includes('javascript:'), false);
  assert.equal(payload.content_blocks_json[0].data.url, '');
});

test('uploaded images are decoded and re-encoded as metadata-free webp', async () => {
  const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'best5-upload-test-'));
  process.env.UPLOAD_DIR = uploadDir;
  const input = path.join(uploadDir, 'input.upload');
  await sharp({ create: { width: 4, height: 4, channels: 3, background: '#ff0000' } }).png().toFile(input);
  const file = { path: input, filename: 'input.upload', mimetype: 'image/png', size: fs.statSync(input).size };
  try {
    const result = await processUploadedImage(file);
    assert.equal(result.mimetype, 'image/webp');
    assert.equal(path.extname(result.filename), '.webp');
    assert.equal((await sharp(result.path).metadata()).format, 'webp');
  } finally {
    sharp.cache(false);
    fs.rmSync(uploadDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});

test('cookie-authenticated unsafe requests require a matching CSRF token', () => {
  const invoke = (overrides = {}) => {
    let nextCalled = false;
    let statusCode = 200;
    let body;
    const req = {
      path: '/api/posts',
      method: 'POST',
      headers: {},
      cookies: { access_token: 'access', csrf_token: 'csrf-value' },
      ...overrides
    };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(value) {
        body = value;
        return this;
      }
    };
    csrfProtection(req, res, () => {
      nextCalled = true;
    });
    return { nextCalled, statusCode, body };
  };

  assert.equal(invoke().statusCode, 403);
  assert.equal(invoke({ headers: { 'x-csrf-token': 'wrong' } }).statusCode, 403);
  assert.equal(invoke({ headers: { 'x-csrf-token': 'csrf-value' } }).nextCalled, true);
  assert.equal(invoke({ method: 'GET' }).nextCalled, true);
  assert.equal(invoke({ path: '/api/auth/login' }).nextCalled, true);
});

test('RBAC uses the authenticated database role', async () => {
  const databaseUser = {
    id: 'user-2',
    email: 'editor@example.test',
    full_name: 'Editor',
    role: 'EDITOR',
    is_active: true
  };
  const strategy = new JwtStrategy({
    user: { findUnique: async () => databaseUser }
  });
  const authenticated = await strategy.validate({
    sub: databaseUser.id,
    role: 'ADMIN',
    token_type: 'access'
  });
  assert.equal(authenticated.role, 'EDITOR');

  const reflector = new Reflector();
  const adminHandler = () => undefined;
  Reflect.defineMetadata(ROLES_KEY, ['ADMIN'], adminHandler);
  const guard = new RolesGuard(reflector);
  const contextFor = (user) => ({
    getHandler: () => adminHandler,
    getClass: () => class TestController {},
    switchToHttp: () => ({ getRequest: () => ({ user }) })
  });
  assert.equal(guard.canActivate(contextFor(authenticated)), false);
  assert.equal(guard.canActivate(contextFor({ ...authenticated, role: 'ADMIN' })), true);

  const inactiveStrategy = new JwtStrategy({
    user: { findUnique: async () => ({ ...databaseUser, is_active: false }) }
  });
  await assert.rejects(
    () => inactiveStrategy.validate({ sub: databaseUser.id, token_type: 'access' }),
    /Account is inactive/
  );
});
