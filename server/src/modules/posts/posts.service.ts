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

const legacyPostSlugIds: Record<string, string> = {
  'best-5-kebab-restaurants-in-beşiktaş-2026-guide': '05afee3f-bc32-48f7-a146-6193fabe5111',
  'افضل-خمس-مطاعم-كباب-في-بشكتاش-2026': '05afee3f-bc32-48f7-a146-6193fabe5111',
  test: 'f9cac92a-e888-48be-b782-1e60d5544678'
};

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  private readonly viewCacheTtlMs = Math.max(5_000, Number(process.env.VIEW_COUNT_CACHE_TTL_MS) || 60_000);
  private readonly viewCountCache = new Map<number, {
    expiresAt: number;
    promise: Promise<Map<string, number>>;
  }>();

  private publicListSelect = {
    id: true,
    title_ar: true,
    title_en: true,
    slug_ar: true,
    slug_en: true,
    excerpt_ar: true,
    excerpt_en: true,
    cover_image_url: true,
    category_id: true,
    published_at: true,
    updated_at: true,
    category: true,
    tags: {
      include: {
        tag: true
      }
    }
  };

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

  private getViewCounts(days: number) {
    const cached = this.viewCountCache.get(days);
    if (cached && cached.expiresAt > Date.now()) return cached.promise;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const promise = this.prisma.pageView.groupBy({
        by: ['path'],
        where: {
          is_bot: false,
          created_at: { gte: since },
          path: { contains: '/blog/' }
        },
        _count: { path: true }
      })
      .then((rows) => {
        const slugViews = new Map<string, number>();
        for (const row of rows) {
          const path = row.path.split('?')[0];
          const match = path.match(/\/(?:ar|en)\/blog\/([^/?#]+)/);
          if (!match?.[1]) continue;
          try {
            const slug = decodeURIComponent(match[1]);
            slugViews.set(slug, (slugViews.get(slug) || 0) + row._count.path);
          } catch {
            // Ignore malformed tracked URLs.
          }
        }
        return slugViews;
      })
      .catch((error) => {
        this.viewCountCache.delete(days);
        throw error;
      });

    this.viewCountCache.set(days, {
      expiresAt: Date.now() + this.viewCacheTtlMs,
      promise
    });
    return promise;
  }

  private postViewCount(post: { slug_ar: string; slug_en: string }, views: Map<string, number>) {
    const arViews = views.get(post.slug_ar) || 0;
    if (post.slug_ar === post.slug_en) return arViews;
    return arViews + (views.get(post.slug_en) || 0);
  }

  private async attachViews<T extends { slug_ar: string; slug_en: string }>(posts: T[], days = 30) {
    if (!posts.length) return posts.map((post) => ({ ...post, views: 0 }));
    const slugViews = await this.getViewCounts(days);

    return posts.map((post) => ({
      ...post,
      views: this.postViewCount(post, slugViews)
    }));
  }

  list() {
    return this.prisma.post.findMany({ orderBy: { created_at: 'desc' } });
  }

  async publicList(lang: 'ar' | 'en' = 'ar', categorySlug?: string) {
    await this.publishDueScheduled();
    const posts = await this.prisma.post.findMany({
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
      select: this.publicListSelect,
      orderBy: { published_at: 'desc' }
    });

    return this.attachViews(posts);
  }

  async publicPopular(lang: 'ar' | 'en' = 'ar', days = 7, limit = 5) {
    await this.publishDueScheduled();
    const safeLimit = Math.min(Math.max(limit, 1), 10);
    const safeDays = Math.min(Math.max(days, 1), 30);
    const slugViews = await this.getViewCounts(safeDays);
    const slugs = [...slugViews.keys()];
    const popularPosts = slugs.length
      ? await this.prisma.post.findMany({
          where: {
            status: PostStatus.PUBLISHED,
            published_at: { not: null },
            OR: [{ slug_ar: { in: slugs } }, { slug_en: { in: slugs } }]
          },
          select: this.publicListSelect
        })
      : [];

    const sortedPopular = popularPosts
      .map((post) => ({
        ...post,
        views: this.postViewCount(post, slugViews)
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, safeLimit);

    if (sortedPopular.length >= safeLimit) return sortedPopular;

    const seenIds = new Set(sortedPopular.map((post) => post.id));
    const latest = await this.prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        published_at: { not: null },
        id: { notIn: [...seenIds] }
      },
      select: this.publicListSelect,
      orderBy: { published_at: 'desc' },
      take: safeLimit - sortedPopular.length
    });

    return [...sortedPopular, ...latest.map((post) => ({ ...post, views: 0 }))];
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
        author: { select: { full_name: true } },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
    if (primary) return primary;
    const crossLanguage = await this.prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        published_at: { not: null },
        ...(lang === 'ar' ? { slug_en: slug } : { slug_ar: slug })
      },
      include: {
        author: { select: { full_name: true } },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
    if (crossLanguage) return crossLanguage;

    const legacyId = legacyPostSlugIds[slug];
    if (!legacyId) return null;
    return this.prisma.post.findFirst({
      where: {
        id: legacyId,
        status: PostStatus.PUBLISHED,
        published_at: { not: null }
      },
      include: {
        author: { select: { full_name: true } },
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  previewById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { full_name: true } } }
    });
  }

  create(authorId: string, data: CreatePostDto) {
    const { tag_ids, ...postData } = data;
    const slugEn = slugify(data.title_en);
    const slugAr = slugify(data.title_ar);
    const publishedAt = data.published_at ? new Date(data.published_at) : undefined;
    const scheduledAt = data.scheduled_at ? new Date(data.scheduled_at) : undefined;
    const now = new Date();
    return this.prisma.post.create({
      data: {
        ...postData,
        slug_en: slugEn,
        slug_ar: slugAr,
        author_id: authorId,
        published_at: data.status === PostStatus.PUBLISHED ? publishedAt || now : publishedAt,
        scheduled_at: scheduledAt,
        content_blocks_json: data.content_blocks_json ?? undefined,
        content_ar: data.content_ar ?? '',
        content_en: data.content_en ?? '',
        tags: tag_ids?.length
          ? { create: tag_ids.map((tag_id) => ({ tag_id })) }
          : undefined
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    });
  }

  update(id: string, data: UpdatePostDto) {
    const { tag_ids, ...postData } = data;
    const publishedAt = data.published_at ? new Date(data.published_at) : undefined;
    const scheduledAt = data.scheduled_at ? new Date(data.scheduled_at) : undefined;
    const now = new Date();
    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        published_at: data.status === PostStatus.PUBLISHED ? publishedAt || now : publishedAt,
        scheduled_at: scheduledAt,
        content_blocks_json: data.content_blocks_json ?? undefined,
        ...(tag_ids
          ? {
              tags: {
                deleteMany: {},
                create: tag_ids.map((tag_id) => ({ tag_id }))
              }
            }
          : {})
      },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
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
