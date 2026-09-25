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
import { SitemapModule } from './modules/sitemap/sitemap.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SeoRenderModule } from './modules/seo-render/seo-render.module';
import { RedirectsModule } from './modules/redirects/redirects.module';

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
    UploadsModule,
    SitemapModule,
    NotificationsModule,
    RedirectsModule,
    SeoRenderModule
  ]
})
export class AppModule {}
