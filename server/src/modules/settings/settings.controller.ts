import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { SettingsService } from './settings.service';
import { LogsService } from '../logs/logs.service';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private settings: SettingsService, private logs: LogsService) {}

  @Get('public')
  getPublic() {
    return this.settings.get();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  get() {
    return this.settings.get();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch()
  async update(@Body() body: any, @CurrentUser() user: any) {
    const before = await this.settings.get();
    const updated = await this.settings.update(body);
    await this.logs.log(user.id, 'UPDATE', 'SETTINGS', 'singleton', before, updated);
    return updated;
  }
}
