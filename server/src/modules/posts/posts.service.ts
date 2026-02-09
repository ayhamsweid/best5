import { Injectable, NotFoundException } from '@nestjs/common';
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

  private async publishDueScheduled() {
    const now = new Date();
    const duePosts = await this.prisma.post.findMany({
      where: {
        status: PostStatus.SCHEDULED,
        scheduled_at: { lte: now }
      },
      select: { id: true, scheduled_at: true }
    });

    await Promise.all(
      duePosts.map((post) =>
        this.prisma.post.update({
          where: { id: post.id },
          data: {
            status: PostStatus.PUBLISHED,
            published_at: post.scheduled_at || now
          }
        })
      )
    );
  }

  list() {
    return this.prisma.post.findMany({ orderBy: { created_at: 'desc' } });
  }

  async publicList(lang: 'ar' | 'en' = 'ar', categorySlug?: string) {
    await this.publishDueScheduled();
    return this.prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        published_at: { not: null },
        ...(categorySlug
          ? {
              category: {
                ...(lang === 'en' ? { slug_en: categorySlug } : { slug_ar: categorySlug })
              }
            }
          : {})
      },
      include: {
        category: true
      },
      orderBy: { published_at: 'desc' }
    });
  }

  async publicBySlug(lang: 'ar' | 'en', slug: string) {
    await this.publishDueScheduled();
    const primary = await this.prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        published_at: { not: null },
        ...(lang === 'ar' ? { slug_ar: slug } : { slug_en: slug })
      },
      include: {
        author: { select: { full_name: true } }
      }
    });
    if (primary) return primary;
    return this.prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        published_at: { not: null },
        ...(lang === 'ar' ? { slug_en: slug } : { slug_ar: slug })
      },
      include: {
        author: { select: { full_name: true } }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({ where: { id } });
  }

  previewById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { full_name: true } } }
    });
  }

  create(authorId: string, data: CreatePostDto) {
    const slugEn = slugify(data.title_en);
    const slugAr = slugify(data.title_ar);
    const publishedAt = data.published_at ? new Date(data.published_at) : undefined;
    const scheduledAt = data.scheduled_at ? new Date(data.scheduled_at) : undefined;
    const now = new Date();
    return this.prisma.post.create({
      data: {
        ...data,
        slug_en: slugEn,
        slug_ar: slugAr,
        author_id: authorId,
        published_at: data.status === PostStatus.PUBLISHED ? publishedAt || now : publishedAt,
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
    const now = new Date();
    return this.prisma.post.update({
      where: { id },
      data: {
        ...data,
        published_at: data.status === PostStatus.PUBLISHED ? publishedAt || now : publishedAt,
        scheduled_at: scheduledAt,
        content_blocks_json: data.content_blocks_json ?? undefined
      }
    });
  }

  createRevision(post: any, editorId?: string) {
    if (!post?.id) return null;
    const snapshot = {
      title_ar: post.title_ar,
      title_en: post.title_en,
      slug_ar: post.slug_ar,
      slug_en: post.slug_en,
      excerpt_ar: post.excerpt_ar,
      excerpt_en: post.excerpt_en,
      content_ar: post.content_ar,
      content_en: post.content_en,
      content_blocks_json: post.content_blocks_json,
      cover_image_url: post.cover_image_url,
      status: post.status,
      published_at: post.published_at,
      scheduled_at: post.scheduled_at,
      category_id: post.category_id,
      seo_title_ar: post.seo_title_ar,
      seo_title_en: post.seo_title_en,
      seo_desc_ar: post.seo_desc_ar,
      seo_desc_en: post.seo_desc_en,
      canonical_url: post.canonical_url,
      og_image_url: post.og_image_url
    };
    return this.prisma.postRevision.create({
      data: {
        post_id: post.id,
        editor_id: editorId || null,
        snapshot_json: snapshot
      }
    });
  }

  listRevisions(postId: string) {
    return this.prisma.postRevision.findMany({
      where: { post_id: postId },
      include: {
        editor: { select: { id: true, full_name: true, email: true } }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async restoreRevision(postId: string, revisionId: string) {
    const revision = await this.prisma.postRevision.findUnique({ where: { id: revisionId } });
    if (!revision || revision.post_id !== postId) {
      throw new NotFoundException('Revision not found');
    }
    const snapshot = revision.snapshot_json as any;
    return this.prisma.post.update({
      where: { id: postId },
      data: {
        title_ar: snapshot.title_ar,
        title_en: snapshot.title_en,
        slug_ar: snapshot.slug_ar,
        slug_en: snapshot.slug_en,
        excerpt_ar: snapshot.excerpt_ar,
        excerpt_en: snapshot.excerpt_en,
        content_ar: snapshot.content_ar,
        content_en: snapshot.content_en,
        content_blocks_json: snapshot.content_blocks_json ?? undefined,
        cover_image_url: snapshot.cover_image_url ?? null,
        status: snapshot.status,
        published_at: snapshot.published_at ? new Date(snapshot.published_at) : null,
        scheduled_at: snapshot.scheduled_at ? new Date(snapshot.scheduled_at) : null,
        category_id: snapshot.category_id ?? null,
        seo_title_ar: snapshot.seo_title_ar ?? null,
        seo_title_en: snapshot.seo_title_en ?? null,
        seo_desc_ar: snapshot.seo_desc_ar ?? null,
        seo_desc_en: snapshot.seo_desc_en ?? null,
        canonical_url: snapshot.canonical_url ?? null,
        og_image_url: snapshot.og_image_url ?? null
      }
    });
  }
}
