import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    });
  }

  unreadCount(userId: string) {
    return this.prisma.notification.count({ where: { user_id: userId, is_read: false } });
  }

  markRead(userId: string, id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { is_read: true }
    });
  }

  markAllRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true }
    });
  }

  async notifyRoles(roles: UserRole[], payload: { title: string; body?: string; href?: string }) {
    const users = await this.prisma.user.findMany({
      where: { role: { in: roles }, is_active: true },
      select: { id: true }
    });
    if (!users.length) return { count: 0 };
    const data = users.map((user) => ({
      user_id: user.id,
      title: payload.title,
      body: payload.body || null,
      href: payload.href || null
    }));
    await this.prisma.notification.createMany({ data });
    return { count: data.length };
  }
}
