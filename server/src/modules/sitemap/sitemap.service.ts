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
    const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://best5.com.tr').replace(/\/+$/, '');

    const settings = await this.prisma.settings.findUnique({
      where: { id: 'singleton' },
      select: { updated_at: true }
    });
    const staticLastmod = settings?.updated_at?.toISOString();

    const staticUrls = [
      { loc: `${baseUrl}/`, lastmod: staticLastmod },
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
      { loc: `${baseUrl}/en/faq`, lastmod: staticLastmod },
      { loc: `${baseUrl}/ar/search`, lastmod: staticLastmod },
      { loc: `${baseUrl}/en/search`, lastmod: staticLastmod }
    ];

    const categories = await this.prisma.category.findMany({
      select: { slug_ar: true, slug_en: true, updated_at: true }
    });

    const posts = await this.prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      select: { slug_ar: true, slug_en: true, updated_at: true, published_at: true }
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
      const lastmod = (post.published_at || post.updated_at)?.toISOString();
      if (post.slug_ar) {
        urls.push({ loc: `${baseUrl}/ar/blog/${encodeURIComponent(post.slug_ar)}`, lastmod });
      }
      if (post.slug_en) {
        urls.push({ loc: `${baseUrl}/en/blog/${encodeURIComponent(post.slug_en)}`, lastmod });
      }
    });

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
      urls
        .map((u) => {
          const lastmod = u.lastmod ? `<lastmod>${escapeXml(u.lastmod)}</lastmod>` : '';
          return `<url><loc>${escapeXml(u.loc)}</loc>${lastmod}</url>`;
        })
        .join('') +
      `</urlset>`;

    return xml;
  }
}
