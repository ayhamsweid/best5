import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { accessSecret, jwtAudience, jwtIssuer, refreshSecret } from '../../config/security';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.is_active) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  signAccessToken(user: any) {
    return this.jwt.sign(
      { sub: user.id, id: user.id, email: user.email, role: user.role, token_type: 'access' },
      {
        secret: accessSecret(),
        expiresIn: Number(process.env.JWT_ACCESS_TTL || 900),
        issuer: jwtIssuer(),
        audience: jwtAudience(),
        algorithm: 'HS256'
      }
    );
  }

  signRefreshToken(user: any) {
    return this.jwt.sign(
      { sub: user.id, token_type: 'refresh' },
      {
        secret: refreshSecret(),
        expiresIn: Number(process.env.JWT_REFRESH_TTL || 604800),
        issuer: jwtIssuer(),
        audience: jwtAudience(),
        algorithm: 'HS256'
      }
    );
  }

  async validateRefreshToken(token: string) {
    try {
      const payload = this.jwt.verify(token, {
        secret: refreshSecret(),
        issuer: jwtIssuer(),
        audience: jwtAudience(),
        algorithms: ['HS256']
      });
      if (payload?.token_type !== 'refresh' || typeof payload?.sub !== 'string') {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user?.is_active) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
