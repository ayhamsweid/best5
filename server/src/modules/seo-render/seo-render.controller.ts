import { BadRequestException, Controller, Get, Headers, Res } from '@nestjs/common';
import { Response } from 'express';
import { SeoRenderService } from './seo-render.service';

@Controller('seo')
export class SeoRenderController {
  private readonly cache = new Map<string, { expiresAt: number; page: any }>();

  constructor(private readonly renderer: SeoRenderService) {}

  @Get('render')
  async render(@Headers('x-original-uri') originalUri: string | undefined, @Res() response: Response) {
    const uri = originalUri || '/';
    if (uri.length > 2048 || /[\u0000-\u001f\u007f]/.test(uri)) {
      throw new BadRequestException('Invalid original URI');
    }
    const cached = this.cache.get(uri);
    const page = cached && cached.expiresAt > Date.now()
      ? cached.page
      : await this.renderer.render(uri);
    if (!cached || cached.expiresAt <= Date.now()) {
      if (this.cache.size >= 200) this.cache.delete(this.cache.keys().next().value as string);
      this.cache.set(uri, { expiresAt: Date.now() + 30_000, page });
    }
    if ('location' in page && page.location) {
      response
        .status(page.status)
        .set('Location', page.location)
        .set('Cache-Control', 'public, max-age=3600')
        .send();
      return;
    }
    response
      .status(page.status)
      .type('html')
      .set('Cache-Control', 'no-store, max-age=0')
      .send(page.html);
  }
}
