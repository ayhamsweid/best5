import { Module } from '@nestjs/common';
import { SeoRenderController } from './seo-render.controller';
import { SeoRenderService } from './seo-render.service';
import { RedirectsModule } from '../redirects/redirects.module';

@Module({
  imports: [RedirectsModule],
  controllers: [SeoRenderController],
  providers: [SeoRenderService]
})
export class SeoRenderModule {}
