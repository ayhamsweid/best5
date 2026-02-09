import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { LogsModule } from '../logs/logs.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [LogsModule, NotificationsModule],
  providers: [PostsService],
  controllers: [PostsController]
})
export class PostsModule {}
