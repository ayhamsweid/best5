import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { TagsService } from './tags.service';
import { LogsService } from '../logs/logs.service';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('tags')
export class TagsController {
  constructor(private tags: TagsService, private logs: LogsService) {}

  @Get('public')
  listPublic() {
    return this.tags.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER)
  @Get()
  list() {
    return this.tags.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER)
  @Post()
  async create(@Body() body: { name_ar: string; name_en: string }, @CurrentUser() user: any) {
    const created = await this.tags.create(body);
    await this.logs.log(user.id, 'CREATE', 'TAG', created.id, null, created);
    return created;
  }
}
