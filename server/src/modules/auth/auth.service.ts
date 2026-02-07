import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';

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
      { id: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_ACCESS_SECRET || 'dev-access', expiresIn: Number(process.env.JWT_ACCESS_TTL || 900) }
    );
  }

  signRefreshToken(user: any) {
    return this.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh', expiresIn: Number(process.env.JWT_REFRESH_TTL || 604800) }
    );
  }
}
