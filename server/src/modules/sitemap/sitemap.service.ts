import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PostStatus } from '@prisma/client';

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

@Injectable()
export class SitemapService {
  constructor(private prisma: PrismaService) {}

  async generate() {
    const configuredBaseUrl = new URL(process.env.PUBLIC_SITE_URL || 'https://best5.com.tr');
    configuredBaseUrl.protocol = 'https:';
    configuredBaseUrl.hostname = configuredBaseUrl.hostname.replace(/^www\./i, '');
    configuredBaseUrl.pathname = '';
    const baseUrl = configuredBaseUrl.toString().replace(/\/+$/, '');

    const [settings, redirects, authors] = await Promise.all([
      this.prisma.settings.findUnique({
        where: { id: 'singleton' },
        select: { updated_at: true }
      }),
      this.prisma.redirect.findMany({
        where: { active: true },
        select: { old_path: true }
      }),
      this.prisma.user.findMany({
        where: {
          is_active: true,
          show_public_profile: true,
          author_slug: { not: null }
        },
        select: { author_slug: true, updated_at: true }
      })
    ]);
    const redirectedPaths = new Set(redirects.map((item) => item.old_path));
    const staticLastmod = settings?.updated_at?.toISOString();

    const staticUrls = [
      { loc: `${baseUrl}/ar`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/blog`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/blog`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/about`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/about`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/privacy`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/privacy`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/contact`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/contact`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/advertise`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/advertise`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/terms`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/terms`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/cookies`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/cookies`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/faq`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/faq`, lastmod: staticLastmod }
    ];

    const categories = await this.prisma.category.findMany({
      select: { slug_ar: true, slug_en: true, updated_at: true }
    });

    const posts = await this.prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED, published_at: { not: null } },
      select: { slug_ar: true, slug_en: true, content_reviewed_at: true, published_at: true }
    });

    const urls: Array<{ loc: string; lastmod?: string }> = [];

    staticUrls.forEach((item) => urls.push(item));

    categories.forEach((cat) => {
      if (cat.slug_ar) {
        urls.push({
          loc: `${baseUrl}/ar/category/${encodeURIComponent(cat.slug_ar)}`,
          lastmod: cat.updated_at?.toISOString()
        });
      }
      if (cat.slug_en) {
        urls.push({
          loc: `${baseUrl}/en/category/${encodeURIComponent(cat.slug_en)}`,
          lastmod: cat.updated_at?.toISOString()
        });
      }
    });

    posts.forEach((post) => {
      const lastmod = (post.content_reviewed_at || post.published_at)?.toISOString();
      if (post.slug_ar) {
        urls.push({ loc: `${baseUrl}/ar/blog/${encodeURIComponent(post.slug_ar)}`, lastmod });
      }
      if (post.slug_en) {
        urls.push({ loc: `${baseUrl}/en/blog/${encodeURIComponent(post.slug_en)}`, lastmod });
      }
    });

    authors.forEach((author) => {
      if (!author.author_slug) return;
      const slug = encodeURIComponent(author.author_slug);
      const lastmod = author.updated_at.toISOString();
      urls.push({ loc: `${baseUrl}/ar/author/${slug}`, lastmod });
      urls.push({ loc: `${baseUrl}/en/author/${slug}`, lastmod });
    });

    const finalUrls = [...new Map(
      urls
        .filter((item) => {
          const pathname = decodeURIComponent(new URL(item.loc).pathname);
          return !redirectedPaths.has(pathname);
        })
        .map((item) => [item.loc, item])
    ).values()];

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      finalUrls
        .map((u) => {
          const lastmod = u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : '';
          return `<url><loc>${escapeXml(u.loc)}</loc>${lastmod}</url>`;
        })
        .join('') +
      `</urlset>`;

    return xml;
  }
}
