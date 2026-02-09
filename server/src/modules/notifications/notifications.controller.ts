import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: any) {
    return this.notifications.list(user.id);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser() user: any) {
    return this.notifications.unreadCount(user.id);
  }

  @Patch('read-all')
  readAll(@CurrentUser() user: any) {
    return this.notifications.markAllRead(user.id);
  }

  @Patch(':id/read')
  readOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notifications.markRead(user.id, id);
  }
}
