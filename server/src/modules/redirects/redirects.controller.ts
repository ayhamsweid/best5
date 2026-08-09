import { Controller, Get, Query } from '@nestjs/common';
import { RedirectsService } from './redirects.service';

@Controller('redirects')
export class RedirectsController {
  constructor(private readonly redirects: RedirectsService) {}

  @Get('public/resolve')
  resolve(@Query('path') path = '/') {
    return this.redirects.resolve(path);
  }
}
