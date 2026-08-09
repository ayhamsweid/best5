import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostStatus } from '@prisma/client';
import { normalizeRedirectPath } from '../redirects/redirects.service';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.category.findMany({ orderBy: { created_at: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  private descriptiveSlug(value: string, locale: 'ar' | 'en') {
    const slug = slugify(value);
    const hasExpectedLetters = locale === 'ar'
      ? /\p{Script=Arabic}/u.test(slug)
      : /[a-z]/.test(slug);
    if (slug.length < 2 || !hasExpectedLetters) {
      throw new BadRequestException(
        `${locale === 'ar' ? 'Arabic' : 'English'} category slug must be descriptive and contain letters.`
      );
    }
    return slug;
  }

  private optionalText(value: string | undefined) {
    return value === undefined ? undefined : value.trim() || null;
  }

  private categoryIntro(value: string | undefined, locale: 'ar' | 'en') {
    const text = this.optionalText(value);
    if (!text) return text;
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 150 || words > 250) {
      throw new BadRequestException(
        `${locale === 'ar' ? 'Arabic' : 'English'} category intro must contain 150 to 250 words.`
      );
    }
    return text;
  }

  private async ensureUniqueSlug(field: 'slug_ar' | 'slug_en', base: string, excludeId?: string) {
    let candidate = base;
    let counter = 2;
    while (await this.prisma.category.findFirst({
      where: {
        [field]: candidate,
        ...(excludeId ? { id: { not: excludeId } } : {})
      } as any
    })) {
      candidate = `${base}-${counter}`;
      counter += 1;
    }
    return candidate;
  }

  async create(data: {
    name_ar: string;
    name_en: string;
    slug_ar?: string;
    slug_en?: string;
    seo_title_ar?: string;
    seo_title_en?: string;
    seo_desc_ar?: string;
    seo_desc_en?: string;
    intro_ar?: string;
    intro_en?: string;
    icon?: string | null;
  }) {
    const nameAr = data.name_ar.trim();
    const nameEn = data.name_en.trim();
    if (!nameAr || !nameEn) throw new BadRequestException('Arabic and English category names are required.');
    const baseAr = this.descriptiveSlug(data.slug_ar || nameAr, 'ar');
    const baseEn = this.descriptiveSlug(data.slug_en || nameEn, 'en');
    const slug_ar = await this.ensureUniqueSlug('slug_ar', baseAr);
    const slug_en = await this.ensureUniqueSlug('slug_en', baseEn);
    return this.prisma.category.create({
      data: {
        name_ar: nameAr,
        name_en: nameEn,
        icon: data.icon || null,
        slug_ar,
        slug_en,
        seo_title_ar: this.optionalText(data.seo_title_ar),
        seo_title_en: this.optionalText(data.seo_title_en),
        seo_desc_ar: this.optionalText(data.seo_desc_ar),
        seo_desc_en: this.optionalText(data.seo_desc_en),
        intro_ar: this.categoryIntro(data.intro_ar, 'ar'),
        intro_en: this.categoryIntro(data.intro_en, 'en')
      }
    });
  }

  async update(id: string, data: {
    name_ar?: string;
    name_en?: string;
    slug_ar?: string;
    slug_en?: string;
    seo_title_ar?: string;
    seo_title_en?: string;
    seo_desc_ar?: string;
    seo_desc_en?: string;
    intro_ar?: string;
    intro_en?: string;
    icon?: string | null;
  }) {
    const existing = await this.findOne(id);
    if (!existing) throw new NotFoundException('Category not found');

    const nameAr = data.name_ar === undefined ? existing.name_ar : data.name_ar.trim();
    const nameEn = data.name_en === undefined ? existing.name_en : data.name_en.trim();
    if (!nameAr || !nameEn) throw new BadRequestException('Arabic and English category names are required.');
    const slugArBase = this.descriptiveSlug(data.slug_ar ?? existing.slug_ar, 'ar');
    const slugEnBase = this.descriptiveSlug(data.slug_en ?? existing.slug_en, 'en');
    const slugAr = await this.ensureUniqueSlug('slug_ar', slugArBase, id);
    const slugEn = await this.ensureUniqueSlug('slug_en', slugEnBase, id);
    const hasPublishedPosts = await this.prisma.post.count({
      where: {
        category_id: id,
        status: PostStatus.PUBLISHED,
        published_at: { not: null }
      }
    });

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id },
        data: {
          name_ar: nameAr,
          name_en: nameEn,
          slug_ar: slugAr,
          slug_en: slugEn,
          ...(data.seo_title_ar !== undefined ? { seo_title_ar: this.optionalText(data.seo_title_ar) } : {}),
          ...(data.seo_title_en !== undefined ? { seo_title_en: this.optionalText(data.seo_title_en) } : {}),
          ...(data.seo_desc_ar !== undefined ? { seo_desc_ar: this.optionalText(data.seo_desc_ar) } : {}),
          ...(data.seo_desc_en !== undefined ? { seo_desc_en: this.optionalText(data.seo_desc_en) } : {}),
          ...(data.intro_ar !== undefined ? { intro_ar: this.categoryIntro(data.intro_ar, 'ar') } : {}),
          ...(data.intro_en !== undefined ? { intro_en: this.categoryIntro(data.intro_en, 'en') } : {}),
          ...(data.icon !== undefined ? { icon: data.icon || null } : {})
        }
      });

      if (hasPublishedPosts > 0) {
        const redirects = [
          existing.slug_ar !== slugAr
            ? { old: `/ar/category/${existing.slug_ar}`, next: `/ar/category/${slugAr}` }
            : null,
          existing.slug_en !== slugEn
            ? { old: `/en/category/${existing.slug_en}`, next: `/en/category/${slugEn}` }
            : null
        ].filter(Boolean) as Array<{ old: string; next: string }>;

        for (const redirect of redirects) {
          const oldPath = normalizeRedirectPath(redirect.old);
          const newPath = normalizeRedirectPath(redirect.next);
          if (!oldPath || !newPath || oldPath === newPath) continue;
          await tx.redirect.upsert({
            where: { old_path: oldPath },
            create: {
              old_path: oldPath,
              new_path: newPath,
              status_code: 301,
              active: true
            },
            update: {
              new_path: newPath,
              status_code: 301,
              active: true
            }
          });
        }
      }
      return updated;
    });
  }
}
