import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { LogsModule } from './modules/logs/logs.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    PostsModule,
    CategoriesModule,
    TagsModule,
    LogsModule,
    SettingsModule,
    AnalyticsModule,
    UploadsModule
  ]
})
export class AppModule {}
