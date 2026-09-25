const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { JwtService } = require('@nestjs/jwt');
const sharp = require('sharp');
const { AuthService } = require('../dist/modules/auth/auth.service');
const { sanitizePostPayload } = require('../dist/common/content-security');
const { processUploadedImage } = require('../dist/common/image-upload');

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
