import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  @Get('summary')
  summary() {
    return {
      kpis: [1280, 12, 87],
      topPages: ['/', '/ar/blog', '/en/blog']
    };
  }
}
