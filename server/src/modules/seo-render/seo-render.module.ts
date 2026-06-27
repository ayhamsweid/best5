import { Module } from '@nestjs/common';
import { SeoRenderController } from './seo-render.controller';
import { SeoRenderService } from './seo-render.service';

@Module({
  controllers: [SeoRenderController],
  providers: [SeoRenderService]
})
export class SeoRenderModule {}
