import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  track(payload: {
    path: string;
    lang?: string;
    referrer?: string | null;
    user_agent?: string | null;
    ip?: string | null;
    is_bot?: boolean;
    bot_name?: string | null;
  }) {
    return this.prisma.pageView.create({
      data: {
        path: payload.path,
        lang: payload.lang || null,
        referrer: payload.referrer || null,
        user_agent: payload.user_agent || null,
        ip: payload.ip || null,
        is_bot: payload.is_bot || false,
        bot_name: payload.bot_name || null
      }
    });
  }

  async summary() {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [totalViews, lastDayViews, topPages] = await Promise.all([
      this.prisma.pageView.count({ where: { created_at: { gte: since } } }),
      this.prisma.pageView.count({ where: { created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
      this.prisma.pageView.groupBy({
        by: ['path'],
        where: { created_at: { gte: since } },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 8
      })
    ]);

    return {
      kpis: {
        views7d: totalViews,
        views24h: lastDayViews,
        pagesTracked: topPages.length
      },
      topPages: topPages.map((row) => ({ path: row.path, count: row._count.path }))
    };
  }

  async botStats() {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [totalBots, topBots, topPaths] = await Promise.all([
      this.prisma.pageView.count({ where: { is_bot: true, created_at: { gte: since } } }),
      this.prisma.pageView.groupBy({
        by: ['bot_name'],
        where: { is_bot: true, created_at: { gte: since } },
        _count: { bot_name: true },
        orderBy: { _count: { bot_name: 'desc' } },
        take: 8
      }),
      this.prisma.pageView.groupBy({
        by: ['path'],
        where: { is_bot: true, created_at: { gte: since } },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 10
      })
    ]);

    return {
      total: totalBots,
      topBots: topBots.map((row) => ({ bot: row.bot_name || 'Unknown', count: row._count.bot_name })),
      topPaths: topPaths.map((row) => ({ path: row.path, count: row._count.path }))
    };
  }
}
