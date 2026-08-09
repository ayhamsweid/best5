import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { CategoriesService } from './categories.service';
import { LogsService } from '../logs/logs.service';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categories: CategoriesService, private logs: LogsService) {}

  @Get('public')
  listPublic() {
    return this.categories.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Get()
  list() {
    return this.categories.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Post()
  async create(
    @Body() body: CreateCategoryDto,
    @CurrentUser() user: any
  ) {
    const created = await this.categories.create(body);
    await this.logs.log(user.id, 'CREATE', 'CATEGORY', created.id, null, created);
    return created;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
    @CurrentUser() user: any
  ) {
    const before = await this.categories.findOne(id);
    const updated = await this.categories.update(id, body);
    await this.logs.log(user.id, 'UPDATE', 'CATEGORY', updated.id, before, updated);
    return updated;
  }
}
