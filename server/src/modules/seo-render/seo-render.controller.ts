import { Controller, Get, Headers, Res } from '@nestjs/common';
import { Response } from 'express';
import { SeoRenderService } from './seo-render.service';

@Controller('seo')
export class SeoRenderController {
  constructor(private readonly renderer: SeoRenderService) {}

  @Get('render')
  async render(@Headers('x-original-uri') originalUri: string | undefined, @Res() response: Response) {
    const page = await this.renderer.render(originalUri || '/');
    response
      .status(page.status)
      .type('html')
      .set('Cache-Control', 'no-store, max-age=0')
      .send(page.html);
  }
}
