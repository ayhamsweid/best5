import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { accessSecret, jwtAudience, jwtIssuer, refreshSecret } from '../../config/security';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {
    accessSecret();
    refreshSecret();
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.is_active) throw new UnauthorizedException('Invalid credentials');
    if (!(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  signAccessToken(user: any) {
    return this.jwt.sign(
      { sub: user.id, id: user.id, email: user.email, role: user.role, token_type: 'access', jti: randomUUID() },
      {
        secret: accessSecret(),
        expiresIn: Number(process.env.JWT_ACCESS_TTL || 900),
        issuer: jwtIssuer(),
        audience: jwtAudience(),
        algorithm: 'HS256'
      }
    );
  }

  async issueRefreshToken(user: any, familyId = randomUUID()) {
    const jti = randomUUID();
    const ttl = this.refreshTtl();
    const token = this.signRefreshJwt(user.id, jti, familyId, ttl);
    await this.prisma.refreshSession.create({
      data: {
        id: jti,
        family_id: familyId,
        user_id: user.id,
        token_hash: this.hashToken(token),
        expires_at: new Date(Date.now() + ttl * 1000)
      }
    });
    return token;
  }

  async rotateRefreshToken(token: string) {
    try {
      const payload = this.jwt.verify(token, {
        secret: refreshSecret(),
        issuer: jwtIssuer(),
        audience: jwtAudience(),
        algorithms: ['HS256']
      });
      if (
        payload?.token_type !== 'refresh' ||
        typeof payload?.sub !== 'string' ||
        typeof payload?.jti !== 'string' ||
        typeof payload?.family_id !== 'string'
      ) throw new UnauthorizedException('Invalid refresh token');

      const now = new Date();
      const nextJti = randomUUID();
      const ttl = this.refreshTtl();
      const nextToken = this.signRefreshJwt(payload.sub, nextJti, payload.family_id, ttl);
      const user = await this.prisma.$transaction(async (tx) => {
        const session = await tx.refreshSession.findUnique({ where: { id: payload.jti } });
        if (
          !session || session.user_id !== payload.sub || session.family_id !== payload.family_id ||
          session.token_hash !== this.hashToken(token) || session.revoked_at || session.expires_at <= now
        ) {
          await tx.refreshSession.updateMany({
            where: { family_id: payload.family_id, revoked_at: null }, data: { revoked_at: now }
          });
          return null;
        }
        const activeUser = await tx.user.findUnique({ where: { id: payload.sub } });
        if (!activeUser?.is_active) {
          await tx.refreshSession.updateMany({
            where: { family_id: payload.family_id, revoked_at: null }, data: { revoked_at: now }
          });
          return null;
        }
        const consumed = await tx.refreshSession.updateMany({
          where: { id: payload.jti, revoked_at: null },
          data: { revoked_at: now, last_used_at: now, replaced_by_id: nextJti }
        });
        if (consumed.count !== 1) {
          await tx.refreshSession.updateMany({
            where: { family_id: payload.family_id, revoked_at: null }, data: { revoked_at: now }
          });
          return null;
        }
        await tx.refreshSession.create({
          data: {
            id: nextJti,
            family_id: payload.family_id,
            user_id: activeUser.id,
            token_hash: this.hashToken(nextToken),
            expires_at: new Date(Date.now() + ttl * 1000)
          }
        });
        return activeUser;
      });
      if (!user) throw new UnauthorizedException('Invalid refresh token');
      return { user, refreshToken: nextToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(token?: string) {
    if (!token) return;
    try {
      const payload = this.jwt.verify(token, {
        secret: refreshSecret(), issuer: jwtIssuer(), audience: jwtAudience(), algorithms: ['HS256']
      });
      if (payload?.token_type !== 'refresh' || typeof payload?.family_id !== 'string') return;
      await this.prisma.refreshSession.updateMany({
        where: { family_id: payload.family_id, revoked_at: null }, data: { revoked_at: new Date() }
      });
    } catch {
      // Invalid or expired cookies cannot authorize a live refresh session.
    }
  }

  private signRefreshJwt(userId: string, jti: string, familyId: string, ttl: number) {
    return this.jwt.sign(
      { sub: userId, token_type: 'refresh', jti, family_id: familyId },
      {
        secret: refreshSecret(), expiresIn: ttl, issuer: jwtIssuer(), audience: jwtAudience(), algorithm: 'HS256'
      }
    );
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private refreshTtl() {
    const value = Number(process.env.JWT_REFRESH_TTL || 604800);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 604800;
  }
}
