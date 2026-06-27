import { Injectable } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type Lang = 'ar' | 'en';
type PageData = {
  status: number;
  title: string;
  description: string;
  canonicalPath: string;
  alternateAr?: string;
  alternateEn?: string;
  image?: string | null;
  type?: 'website' | 'article';
  robots?: string;
  body: string;
  jsonLd?: Record<string, unknown>[];
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const stripMarkup = (value: unknown) =>
  String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#_*`>~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const pick = (value: any, lang: Lang): string => {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return String(value?.[lang] ?? value?.ar ?? value?.en ?? '');
};

const absoluteUrl = (baseUrl: string, value?: string | null) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl}${value.startsWith('/') ? '' : '/'}${value}`;
};

@Injectable()
export class SeoRenderService {
  private templateCache: { html: string; expiresAt: number } | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async render(originalUri: string) {
    const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://best5.com.tr').replace(/\/+$/, '');
    const template = await this.getTemplate();
    const pathname = this.safePathname(originalUri);
    const page = await this.getPage(pathname, baseUrl);
    const head = this.renderHead(page, baseUrl);
    const html = template
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
      .replace('</head>', `${head}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);
    return { status: page.status, html };
  }

  private async getTemplate() {
    if (this.templateCache && this.templateCache.expiresAt > Date.now()) return this.templateCache.html;
    const templateUrl = process.env.SPA_TEMPLATE_URL || 'http://web/index.html';
    const response = await fetch(templateUrl, { headers: { Accept: 'text/html' } });
    if (!response.ok) throw new Error(`Unable to load SPA template: ${response.status}`);
    const html = await response.text();
    this.templateCache = { html, expiresAt: Date.now() + 60_000 };
    return html;
  }

  private safePathname(originalUri: string) {
    try {
      return new URL(originalUri, 'http://internal').pathname.replace(/\/+$/, '') || '/';
    } catch {
      return '/';
    }
  }

  private async getPage(pathname: string, baseUrl: string): Promise<PageData> {
    const parts = pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part));
    const lang: Lang = parts[0] === 'en' ? 'en' : 'ar';
    const section = parts[1] || '';
    const slug = parts.slice(2).join('/');

    if (pathname === '/') return this.homePage('ar');
    if (parts[0] !== 'ar' && parts[0] !== 'en') {
      return {
        status: 404,
        title: 'الصفحة غير موجودة | Best5',
        description: '',
        canonicalPath: pathname,
        robots: 'noindex,follow',
        body: this.shell('ar', 'الصفحة غير موجودة', '')
      };
    }
    if (!section) return this.homePage(lang);
    if (section === 'blog' && !slug) return this.blogPage(lang);
    if (section === 'blog' && slug) return this.articlePage(lang, slug, baseUrl);
    if (section === 'categories') return this.categoriesPage(lang);
    if (section === 'category' && slug) return this.categoryPage(lang, slug);
    if (['about', 'privacy', 'contact', 'advertise', 'terms', 'cookies', 'faq'].includes(section)) {
      return this.staticPage(lang, section);
    }
    if (['search', 'compare', 'guide', 'preview'].includes(section)) {
      return {
        status: 200,
        title: lang === 'ar' ? 'Best5 | دليلك الشامل' : 'Best5 | Your comprehensive guide',
        description: '',
        canonicalPath: pathname,
        robots: 'noindex,follow',
        body: this.shell(lang, '', '')
      };
    }
    return {
      status: 404,
      title: lang === 'ar' ? 'الصفحة غير موجودة | Best5' : 'Page not found | Best5',
      description: '',
      canonicalPath: pathname,
      robots: 'noindex,follow',
      body: this.shell(lang, lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found', '')
    };
  }

  private async homePage(lang: Lang): Promise<PageData> {
    const [posts, categories] = await Promise.all([
      this.prisma.post.findMany({
        where: { status: PostStatus.PUBLISHED, published_at: { not: null } },
        orderBy: { published_at: 'desc' },
        take: 12,
        select: { title_ar: true, title_en: true, slug_ar: true, slug_en: true, excerpt_ar: true, excerpt_en: true }
      }),
      this.prisma.category.findMany({ select: { name_ar: true, name_en: true, slug_ar: true, slug_en: true } })
    ]);
    const title = lang === 'ar' ? 'Best5 | دليلك لاختيار الأفضل' : 'Best5 | Your guide to the best';
    const description = lang === 'ar'
      ? 'أدلة ومقارنات عملية تساعدك على اكتشاف أفضل الأماكن والخدمات في تركيا.'
      : 'Practical guides and comparisons for discovering the best places and services in Turkey.';
    const content =
      `<section><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></section>` +
      this.postList(posts, lang) +
      `<nav aria-label="${lang === 'ar' ? 'التصنيفات' : 'Categories'}">${categories.map((category) => {
        const categorySlug = lang === 'ar' ? category.slug_ar : category.slug_en;
        return `<a href="/${lang}/category/${encodeURIComponent(categorySlug)}">${escapeHtml(lang === 'ar' ? category.name_ar : category.name_en)}</a>`;
      }).join(' ')}</nav>`;
    return { status: 200, title, description, canonicalPath: `/${lang}`, alternateAr: '/ar', alternateEn: '/en', body: this.shell(lang, '', content) };
  }

  private async blogPage(lang: Lang): Promise<PageData> {
    const posts = await this.prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED, published_at: { not: null } },
      orderBy: { published_at: 'desc' },
      select: { title_ar: true, title_en: true, slug_ar: true, slug_en: true, excerpt_ar: true, excerpt_en: true }
    });
    const title = lang === 'ar' ? 'المقالات والأدلة | Best5' : 'Articles and guides | Best5';
    const description = lang === 'ar' ? 'جميع مقالات وأدلة Best5.' : 'All Best5 articles and guides.';
    return {
      status: 200,
      title,
      description,
      canonicalPath: `/${lang}/blog`,
      alternateAr: '/ar/blog',
      alternateEn: '/en/blog',
      body: this.shell(lang, title, this.postList(posts, lang))
    };
  }

  private async articlePage(lang: Lang, slug: string, baseUrl: string): Promise<PageData> {
    const post = await this.prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        published_at: { not: null },
        ...(lang === 'ar' ? { slug_ar: slug } : { slug_en: slug })
      },
      include: { author: { select: { full_name: true } }, category: true }
    });
    if (!post) {
      return {
        status: 404,
        title: lang === 'ar' ? 'المقال غير موجود | Best5' : 'Article not found | Best5',
        description: '',
        canonicalPath: `/${lang}/blog/${encodeURIComponent(slug)}`,
        robots: 'noindex,follow',
        body: this.shell(lang, lang === 'ar' ? 'المقال غير موجود' : 'Article not found', '')
      };
    }

    const seoTitle = (lang === 'ar' ? post.seo_title_ar : post.seo_title_en) || (lang === 'ar' ? post.title_ar : post.title_en);
    const title = `${seoTitle} | Besiktas City Guide`;
    const excerpt = (lang === 'ar' ? post.seo_desc_ar : post.seo_desc_en) || (lang === 'ar' ? post.excerpt_ar : post.excerpt_en);
    const localizedTitle = lang === 'ar' ? post.title_ar : post.title_en;
    const canonicalPath = `/${lang}/blog/${encodeURIComponent(lang === 'ar' ? post.slug_ar : post.slug_en)}`;
    const blocks = Array.isArray(post.content_blocks_json) ? post.content_blocks_json as any[] : [];
    const articleBody = this.renderBlocks(blocks, lang) || `<div>${lang === 'ar' ? post.content_ar : post.content_en}</div>`;
    const body = this.shell(
      lang,
      localizedTitle,
      `<article><p>${escapeHtml(excerpt)}</p>${articleBody}</article>`
    );
    const image = absoluteUrl(baseUrl, post.og_image_url || post.cover_image_url);
    return {
      status: 200,
      title,
      description: excerpt,
      canonicalPath,
      alternateAr: `/ar/blog/${encodeURIComponent(post.slug_ar)}`,
      alternateEn: `/en/blog/${encodeURIComponent(post.slug_en)}`,
      image,
      type: 'article',
      body,
      jsonLd: [{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: localizedTitle,
        description: excerpt,
        image: image || undefined,
        datePublished: post.published_at?.toISOString(),
        dateModified: post.updated_at?.toISOString(),
        author: { '@type': 'Person', name: post.author.full_name },
        mainEntityOfPage: `${baseUrl}${canonicalPath}`
      }]
    };
  }

  private async categoriesPage(lang: Lang): Promise<PageData> {
    const categories = await this.prisma.category.findMany();
    const title = lang === 'ar' ? 'التصنيفات | Best5' : 'Categories | Best5';
    const links = categories.map((category) => {
      const slug = lang === 'ar' ? category.slug_ar : category.slug_en;
      const name = lang === 'ar' ? category.name_ar : category.name_en;
      return `<li><a href="/${lang}/category/${encodeURIComponent(slug)}">${escapeHtml(name)}</a></li>`;
    }).join('');
    return {
      status: 200,
      title,
      description: '',
      canonicalPath: `/${lang}/categories`,
      alternateAr: '/ar/categories',
      alternateEn: '/en/categories',
      body: this.shell(lang, title, `<ul>${links}</ul>`)
    };
  }

  private async categoryPage(lang: Lang, slug: string): Promise<PageData> {
    const category = await this.prisma.category.findFirst({ where: lang === 'ar' ? { slug_ar: slug } : { slug_en: slug } });
    if (!category) {
      return {
        status: 404,
        title: lang === 'ar' ? 'التصنيف غير موجود | Best5' : 'Category not found | Best5',
        description: '',
        canonicalPath: `/${lang}/category/${encodeURIComponent(slug)}`,
        robots: 'noindex,follow',
        body: this.shell(lang, lang === 'ar' ? 'التصنيف غير موجود' : 'Category not found', '')
      };
    }
    const posts = await this.prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED, published_at: { not: null }, category_id: category.id },
      orderBy: { published_at: 'desc' },
      select: { title_ar: true, title_en: true, slug_ar: true, slug_en: true, excerpt_ar: true, excerpt_en: true }
    });
    const name = lang === 'ar' ? category.name_ar : category.name_en;
    return {
      status: 200,
      title: `${name} | Best5`,
      description: lang === 'ar' ? `أفضل مقالات وأدلة ${name}.` : `The best ${name} articles and guides.`,
      canonicalPath: `/${lang}/category/${encodeURIComponent(slug)}`,
      alternateAr: `/ar/category/${encodeURIComponent(category.slug_ar)}`,
      alternateEn: `/en/category/${encodeURIComponent(category.slug_en)}`,
      body: this.shell(lang, name, this.postList(posts, lang))
    };
  }

  private async staticPage(lang: Lang, key: string): Promise<PageData> {
    const settings = await this.prisma.settings.findUnique({ where: { id: 'singleton' } });
    const labels: Record<string, Record<Lang, string>> = {
      about: { ar: 'من نحن', en: 'About us' },
      privacy: { ar: 'سياسة الخصوصية', en: 'Privacy policy' },
      contact: { ar: 'تواصل معنا', en: 'Contact us' },
      advertise: { ar: 'أعلن معنا', en: 'Advertise' },
      terms: { ar: 'شروط الاستخدام', en: 'Terms of use' },
      cookies: { ar: 'سياسة الكوكيز', en: 'Cookie policy' },
      faq: { ar: 'الأسئلة الشائعة', en: 'FAQ' }
    };
    const title = `${labels[key]?.[lang] || 'Best5'} | Best5`;
    const pages = settings?.pages_json as any;
    const content = pick(pages?.[key], lang);
    return {
      status: 200,
      title,
      description: stripMarkup(content).slice(0, 160),
      canonicalPath: `/${lang}/${key}`,
      alternateAr: `/ar/${key}`,
      alternateEn: `/en/${key}`,
      body: this.shell(lang, labels[key]?.[lang] || 'Best5', `<div>${escapeHtml(stripMarkup(content))}</div>`)
    };
  }

  private postList(posts: any[], lang: Lang) {
    return `<section><ul>${posts.map((post) => {
      const title = lang === 'ar' ? post.title_ar : post.title_en;
      const excerpt = lang === 'ar' ? post.excerpt_ar : post.excerpt_en;
      const slug = lang === 'ar' ? post.slug_ar : post.slug_en;
      return `<li><article><h2><a href="/${lang}/blog/${encodeURIComponent(slug)}">${escapeHtml(title)}</a></h2><p>${escapeHtml(excerpt)}</p></article></li>`;
    }).join('')}</ul></section>`;
  }

  private renderBlocks(blocks: any[], lang: Lang) {
    return blocks.map((block) => {
      const data = block?.data || {};
      if (block.type === 'heading') return `<h2>${escapeHtml(pick(data.text, lang))}</h2>`;
      if (block.type === 'paragraph') return `<p>${escapeHtml(pick(data.text, lang))}</p>`;
      if (block.type === 'guide') return `<section><h2>${escapeHtml(pick(data.title, lang))}</h2><p>${escapeHtml(pick(data.content, lang))}</p></section>`;
      if (block.type === 'summary') return `<section><h2>${escapeHtml(pick(data.title, lang))}</h2><ul>${(data.items || []).map((item: any) => `<li>${escapeHtml(pick(item, lang))}</li>`).join('')}</ul></section>`;
      if (block.type === 'cards') return `<section><h2>${escapeHtml(pick(data.title, lang))}</h2>${(data.cards || []).map((card: any) => `<article><h3>${escapeHtml(pick(card.title, lang))}</h3><p>${escapeHtml(pick(card.note, lang))}</p></article>`).join('')}</section>`;
      if (block.type === 'comparison') return `<section><h2>${escapeHtml(pick(data.title, lang))}</h2><table><thead><tr>${(data.headers || []).map((item: any) => `<th>${escapeHtml(pick(item, lang))}</th>`).join('')}</tr></thead><tbody>${(data.rows || []).map((row: any[]) => `<tr>${row.map((item) => `<td>${escapeHtml(pick(item, lang))}</td>`).join('')}</tr>`).join('')}</tbody></table></section>`;
      if (block.type === 'image') return `<figure>${data.url ? `<img src="${escapeHtml(data.url)}" alt="${escapeHtml(pick(data.caption, lang))}">` : ''}<figcaption>${escapeHtml(pick(data.caption, lang))}</figcaption></figure>`;
      if (block.type === 'cta') return `<p>${escapeHtml(pick(data.label, lang))}</p>`;
      if (block.type === 'restaurant') {
        const pros = (data.pros || []).map((item: any) => `<li>${escapeHtml(pick(item, lang))}</li>`).join('');
        const cons = (data.cons || []).map((item: any) => `<li>${escapeHtml(pick(item, lang))}</li>`).join('');
        return `<section><h2>${escapeHtml(pick(data.name, lang))}</h2><p>${escapeHtml(pick(data.description, lang))}</p><p>${escapeHtml(pick(data.address, lang))}</p>${pros ? `<ul>${pros}</ul>` : ''}${cons ? `<ul>${cons}</ul>` : ''}</section>`;
      }
      if (block.type === 'faq') return `<section><h2>${escapeHtml(pick(data.title, lang))}</h2>${(data.items || []).map((item: any) => `<h3>${escapeHtml(pick(item.q, lang))}</h3><p>${escapeHtml(pick(item.a, lang))}</p>`).join('')}</section>`;
      return '';
    }).join('');
  }

  private shell(lang: Lang, heading: string, content: string) {
    const home = lang === 'ar' ? 'الرئيسية' : 'Home';
    const blog = lang === 'ar' ? 'المقالات' : 'Articles';
    return `<div class="seo-initial-content" dir="${lang === 'ar' ? 'rtl' : 'ltr'}"><header><nav><a href="/${lang}">${home}</a> <a href="/${lang}/blog">${blog}</a></nav></header><main>${heading ? `<h1>${escapeHtml(heading)}</h1>` : ''}${content}</main></div>`;
  }

  private renderHead(page: PageData, baseUrl: string) {
    const canonical = `${baseUrl}${page.canonicalPath}`;
    const description = stripMarkup(page.description).slice(0, 170);
    const links = [
      `<link rel="canonical" href="${escapeHtml(canonical)}">`,
      page.alternateAr ? `<link rel="alternate" hreflang="ar" href="${escapeHtml(`${baseUrl}${page.alternateAr}`)}">` : '',
      page.alternateEn ? `<link rel="alternate" hreflang="en" href="${escapeHtml(`${baseUrl}${page.alternateEn}`)}">` : '',
      page.alternateAr ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${baseUrl}${page.alternateAr}`)}">` : ''
    ].join('');
    const jsonLd = (page.jsonLd || []).map((value) =>
      `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, '\\u003c')}</script>`
    ).join('');
    return [
      description ? `<meta name="description" content="${escapeHtml(description)}">` : '',
      `<meta name="robots" content="${escapeHtml(page.robots || 'index,follow')}">`,
      `<meta property="og:title" content="${escapeHtml(page.title)}">`,
      description ? `<meta property="og:description" content="${escapeHtml(description)}">` : '',
      `<meta property="og:url" content="${escapeHtml(canonical)}">`,
      `<meta property="og:type" content="${page.type || 'website'}">`,
      page.image ? `<meta property="og:image" content="${escapeHtml(page.image)}">` : '',
      links,
      jsonLd
    ].join('');
  }
}
