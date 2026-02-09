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
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.category.findMany({ orderBy: { created_at: 'desc' } });
  }

  private async ensureUniqueSlug(field: 'slug_ar' | 'slug_en', base: string) {
    let candidate = base || `${Date.now()}`;
    let counter = 2;
    while (await this.prisma.category.findFirst({ where: { [field]: candidate } as any })) {
      candidate = `${base}-${counter}`;
      counter += 1;
    }
    return candidate;
  }

  async create(data: { name_ar: string; name_en: string; icon?: string | null }) {
    const baseAr = slugify(data.name_ar || data.name_en);
    const baseEn = slugify(data.name_en || data.name_ar);
    const slug_ar = await this.ensureUniqueSlug('slug_ar', baseAr);
    const slug_en = await this.ensureUniqueSlug('slug_en', baseEn);
    return this.prisma.category.create({
      data: {
        ...data,
        slug_ar,
        slug_en
      }
    });
  }
}
