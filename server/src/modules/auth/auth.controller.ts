import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { LogsService } from '../logs/logs.service';
import { randomBytes } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private jwt: JwtService,
    private prisma: PrismaService,
    private logs: LogsService
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const access = this.auth.signAccessToken(user);
    const refresh = this.auth.signRefreshToken(user);
    const csrf = randomBytes(24).toString('hex');

    res.cookie('access_token', access, this.cookieOptions());
    res.cookie('refresh_token', refresh, { ...this.cookieOptions(), maxAge: 1000 * Number(process.env.JWT_REFRESH_TTL || 604800) });
    res.cookie('csrf_token', csrf, { ...this.cookieOptions(), httpOnly: false });

    await this.prisma.user.update({ where: { id: user.id }, data: { last_login_at: new Date() } });
    await this.logs.log(user.id, 'LOGIN', 'USER', user.id, null, { email: user.email });

    return { ok: true };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', this.cookieOptions());
    res.clearCookie('refresh_token', this.cookieOptions());
    res.clearCookie('csrf_token', { ...this.cookieOptions(), httpOnly: false });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: any) {
    const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return null;
    return {
      id: dbUser.id,
      full_name: dbUser.full_name,
      email: dbUser.email,
      role: dbUser.role
    };
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) res: Response, @Body() body: any) {
    const token = body?.refresh_token;
    const refreshToken = token || (body?.refresh && body.refresh) || null;
    const cookieRefresh = req?.cookies?.refresh_token;
    const value = refreshToken || cookieRefresh;
    if (!value) return { ok: false };
    const payload = this.jwt.verify(value, { secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh' });
    const access = this.auth.signAccessToken(payload);
    const csrf = randomBytes(24).toString('hex');
    res.cookie('access_token', access, this.cookieOptions());
    res.cookie('csrf_token', csrf, { ...this.cookieOptions(), httpOnly: false });
    return { ok: true };
  }

  private cookieOptions() {
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      secure: process.env.COOKIE_SECURE === 'true',
      domain: process.env.COOKIE_DOMAIN || undefined
    };
  }
}
