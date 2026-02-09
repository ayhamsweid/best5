import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analytics: AnalyticsService) {}

  @Post('track')
  track(@Body() body: { path?: string; lang?: string; referrer?: string }, @Req() req: Request) {
    if (!body?.path) {
      return { ok: false };
    }
    return this.analytics.track({
      path: body.path,
      lang: body.lang,
      referrer: body.referrer || req.get('referer') || null,
      user_agent: req.get('user-agent') || null,
      ip: req.ip
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  summary() {
    return this.analytics.summary();
  }

  @UseGuards(JwtAuthGuard)
  @Get('bots')
  bots() {
    return this.analytics.botStats();
  }
}
