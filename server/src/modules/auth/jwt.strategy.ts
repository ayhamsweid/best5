import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { accessSecret, jwtAudience, jwtIssuer } from '../../config/security';

const cookieExtractor = (req: any) => {
  return req?.cookies?.access_token || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: accessSecret(),
      issuer: jwtIssuer(),
      audience: jwtAudience(),
      algorithms: ['HS256']
    });
  }

  async validate(payload: any) {
    const id = typeof payload?.sub === 'string' ? payload.sub : null;
    if (!id || payload?.token_type !== 'access') {
      throw new UnauthorizedException('Invalid access token');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user?.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    };
  }
}
