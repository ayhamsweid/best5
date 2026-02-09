import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private safeSelect = {
    id: true,
    full_name: true,
    email: true,
    role: true,
    is_active: true,
    last_login_at: true,
    created_at: true
  } as const;

  list() {
    return this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: this.safeSelect
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: this.safeSelect
    });
  }

  async create(data: CreateUserDto) {
    const hash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        password_hash: hash,
        is_active: data.is_active ?? true
      },
      select: this.safeSelect
    });
  }

  async resetPassword(id: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password_hash: hash },
      select: this.safeSelect
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id }, select: this.safeSelect });
  }
}
