import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('authors/public')
export class AuthorsController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list() {
    return this.users.publicList();
  }

  @Get(':slug')
  bySlug(@Param('slug') slug: string) {
    return this.users.publicBySlug(slug);
  }
}
