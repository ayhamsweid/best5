import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuditActionType, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LogsService } from '../logs/logs.service';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private users: UsersService, private logs: LogsService) {}

  @Get()
  list() {
    return this.users.list();
  }

  @Post()
  async create(@Body() dto: CreateUserDto, @CurrentUser() actor: any) {
    const created = await this.users.create(dto);
    await this.logs.log(actor.id, 'CREATE', 'USER', created.id, null, created);
    return created;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() actor: any) {
    const before = await this.users.list().then((all) => all.find((u) => u.id === id));
    const updated = await this.users.update(id, dto);
    const action = dto.role && before?.role !== dto.role ? AuditActionType.ROLE_CHANGE : AuditActionType.UPDATE;
    await this.logs.log(actor.id, action, 'USER', id, before, updated);
    return updated;
  }

  @Post(':id/reset-password')
  async resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto, @CurrentUser() actor: any) {
    const updated = await this.users.resetPassword(id, dto.password);
    await this.logs.log(actor.id, AuditActionType.UPDATE, 'USER', id, { password_reset: true }, updated);
    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() actor: any) {
    const before = await this.users.list().then((all) => all.find((u) => u.id === id));
    const removed = await this.users.remove(id);
    await this.logs.log(actor.id, AuditActionType.DELETE, 'USER', id, before, removed);
    return removed;
  }
}
