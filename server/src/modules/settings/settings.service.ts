import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  get() {
    return this.prisma.settings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: { id: 'singleton' }
    });
  }

  update(data: any) {
    return this.prisma.settings.update({
      where: { id: 'singleton' },
      data
    });
  }
}
