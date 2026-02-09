import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SitemapService } from './sitemap.service';

@Controller()
export class SitemapController {
  constructor(private sitemap: SitemapService) {}

  @Get('sitemap.xml')
  async getSitemap(@Res() res: Response) {
    const xml = await this.sitemap.generate();
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  }
}
