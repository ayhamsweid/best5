import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostStatus } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.post.findMany({ orderBy: { created_at: 'desc' } });
  }

  publicList() {
    return this.prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      orderBy: { published_at: 'desc' }
    });
  }

  async publicBySlug(lang: 'ar' | 'en', slug: string) {
    const primary = await this.prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        ...(lang === 'ar' ? { slug_ar: slug } : { slug_en: slug })
      }
    });
    if (primary) return primary;
    return this.prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        ...(lang === 'ar' ? { slug_en: slug } : { slug_ar: slug })
      }
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  create(authorId: string, data: CreatePostDto) {
    const slugEn = slugify(data.title_en);
    const slugAr = slugify(data.title_ar);
    const publishedAt = data.published_at ? new Date(data.published_at) : undefined;
    const scheduledAt = data.scheduled_at ? new Date(data.scheduled_at) : undefined;
    return this.prisma.post.create({
      data: {
        ...data,
        slug_en: slugEn,
        slug_ar: slugAr,
        author_id: authorId,
        published_at: publishedAt,
        scheduled_at: scheduledAt,
        content_blocks_json: data.content_blocks_json ?? undefined,
        content_ar: data.content_ar ?? '',
        content_en: data.content_en ?? ''
      }
    });
  }

  update(id: string, data: UpdatePostDto) {
    const publishedAt = data.published_at ? new Date(data.published_at) : undefined;
    const scheduledAt = data.scheduled_at ? new Date(data.scheduled_at) : undefined;
    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        published_at: publishedAt,
        scheduled_at: scheduledAt,
        content_blocks_json: data.content_blocks_json ?? undefined
      }
    });
  }
}
