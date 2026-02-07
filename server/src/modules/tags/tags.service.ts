import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.tag.findMany({ orderBy: { created_at: 'desc' } });
  }

  create(data: { name_ar: string; name_en: string }) {
    return this.prisma.tag.create({
      data: {
        ...data,
        slug_ar: slugify(data.name_ar),
        slug_en: slugify(data.name_en)
      }
    });
  }
}
