import { Injectable } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { staticPageContent } from './static-page-content';
import { RedirectsService, encodeRedirectPath } from '../redirects/redirects.service';
import { formatSeoTitle } from '../../common/seo-title';
import { getCategorySeo } from '../../common/category-seo';

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
  return String(value?.[lang] ?? '');
};

const absoluteUrl = (baseUrl: string, value?: string | null) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl}${value.startsWith('/') ? '' : '/'}${value}`;
};

const safeHref = (value: unknown) => {
  if (typeof value !== 'string') return '';
  const candidate = value.trim();
  if (!candidate) return '';
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return candidate;
  try {
    const url = new URL(candidate);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
};

@Injectable()
export class SeoRenderService {
  private templateCache: { html: string; expiresAt: number } | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redirects: RedirectsService
  ) {}

  async render(originalUri: string) {
    const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://best5.com.tr').replace(/\/+$/, '');
    const requestSearch = this.safeSearch(originalUri);
    const pathname = this.safePathname(originalUri);
    if (pathname.length > 1 && pathname.endsWith('/')) {
      return {
        status: 301,
        location: `${pathname.replace(/\/+$/, '')}${requestSearch}`,
        html: ''
      };
    }
    const registeredRedirect = await this.redirects.resolve(pathname);
    if (registeredRedirect) {
      return {
        status: registeredRedirect.status_code,
        location: `${registeredRedirect.location}${requestSearch}`,
        html: ''
      };
    }
    const languageRedirect = await this.wrongLanguageArticleRedirect(pathname);
    if (languageRedirect) {
      return { status: 301, location: `${languageRedirect}${requestSearch}`, html: '' };
    }

    const template = await this.getTemplate();
    const page = await this.getPage(pathname, baseUrl);
    const head = this.renderHead(page, baseUrl);
    const html = template
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`)
      .replace('</head>', `${head}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);
    return { status: page.status, html };
  }

  private async wrongLanguageArticleRedirect(pathname: string) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length !== 3 || !['ar', 'en'].includes(parts[0]) || parts[1] !== 'blog') return null;
    let slug: string;
    try {
      slug = decodeURIComponent(parts[2]);
    } catch {
      return null;
    }
    const requestedLang = parts[0] as Lang;
    const post = await this.prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        published_at: { not: null },
        ...(requestedLang === 'ar' ? { slug_en: slug } : { slug_ar: slug })
      },
      select: { slug_ar: true, slug_en: true }
    });
    if (!post) return null;
    const targetLang: Lang = requestedLang === 'ar' ? 'en' : 'ar';
    const targetSlug = targetLang === 'ar' ? post.slug_ar : post.slug_en;
    return `/${targetLang}/blog/${encodeURIComponent(targetSlug)}`;
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
      const pathname = new URL(originalUri, 'http://internal').pathname.replace(/\/+$/, '') || '/';
      pathname.split('/').forEach((part) => decodeURIComponent(part));
      return pathname;
    } catch {
      return '/__invalid__';
    }
  }

  private safeSearch(originalUri: string) {
    try {
      return new URL(originalUri, 'http://internal').search;
    } catch {
      return '';
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
    if (section === 'author' && slug) return this.authorPage(lang, slug, baseUrl);
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
      ? 'اكتشف أفضل الخيارات في تركيا مع Best5: أدلة ومقارنات محدثة لأفضل المطاعم والفنادق والجامعات والمتاجر والأماكن السياحية، لتختار بثقة وسهولة.'
      : 'Discover Turkey with Best5: updated guides and practical comparisons for top restaurants, hotels, universities, shops, and attractions.';
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
      include: {
        author: {
          select: {
            full_name: true,
            author_slug: true,
            author_image_url: true,
            show_public_profile: true
          }
        },
        category: true
      }
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
    const title = formatSeoTitle(seoTitle);
    const excerpt = (lang === 'ar' ? post.seo_desc_ar : post.seo_desc_en) || (lang === 'ar' ? post.excerpt_ar : post.excerpt_en);
    const localizedTitle = lang === 'ar' ? post.title_ar : post.title_en;
    const canonicalPath = `/${lang}/blog/${encodeURIComponent(lang === 'ar' ? post.slug_ar : post.slug_en)}`;
    const blocks = Array.isArray(post.content_blocks_json) ? post.content_blocks_json as any[] : [];
    const articleBody = this.renderBlocks(blocks, lang) || `<div>${lang === 'ar' ? post.content_ar : post.content_en}</div>`;
    const authorPath = post.author.show_public_profile && post.author.author_slug
      ? `/${lang}/author/${encodeURIComponent(post.author.author_slug)}`
      : '';
    const authorByline = authorPath
      ? `<p>${lang === 'ar' ? 'إعداد' : 'By'} <a href="${authorPath}">${escapeHtml(post.author.full_name)}</a></p>`
      : `<p>${lang === 'ar' ? 'إعداد' : 'By'} ${escapeHtml(post.author.full_name)}</p>`;
    const body = this.shell(
      lang,
      localizedTitle,
      `<article><p>${escapeHtml(excerpt)}</p>${authorByline}${articleBody}</article>`
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
        image: image ? [image] : undefined,
        datePublished: post.published_at?.toISOString(),
        dateModified: (post.content_reviewed_at || post.published_at)?.toISOString(),
        author: {
          '@type': 'Person',
          name: post.author.full_name,
          url: authorPath ? `${baseUrl}${authorPath}` : undefined
        },
        publisher: {
          '@type': 'Organization',
          name: 'Best5',
          logo: { '@type': 'ImageObject', url: `${baseUrl}/favicon.png` }
        },
        inLanguage: lang,
        url: `${baseUrl}${canonicalPath}`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}${canonicalPath}`
        }
      }]
    };
  }

  private async authorPage(lang: Lang, slug: string, baseUrl: string): Promise<PageData> {
    const author = await this.prisma.user.findFirst({
      where: {
        author_slug: slug,
        is_active: true,
        show_public_profile: true
      },
      select: {
        full_name: true,
        author_slug: true,
        author_title_ar: true,
        author_title_en: true,
        author_bio_ar: true,
        author_bio_en: true,
        author_expertise_ar: true,
        author_expertise_en: true,
        author_image_url: true,
        author_website_url: true,
        author_social_url: true,
        posts: {
          where: { status: PostStatus.PUBLISHED, published_at: { not: null } },
          orderBy: { published_at: 'desc' },
          select: {
            title_ar: true,
            title_en: true,
            slug_ar: true,
            slug_en: true,
            excerpt_ar: true,
            excerpt_en: true
          }
        }
      }
    });
    const canonicalPath = `/${lang}/author/${encodeURIComponent(slug)}`;
    if (!author?.author_slug) {
      const notFoundTitle = lang === 'ar' ? 'الكاتب غير موجود | Best5' : 'Author not found | Best5';
      return {
        status: 404,
        title: notFoundTitle,
        description: '',
        canonicalPath,
        robots: 'noindex,follow',
        body: this.shell(lang, notFoundTitle, '')
      };
    }

    const authorTitle = lang === 'ar' ? author.author_title_ar : author.author_title_en;
    const bio = (lang === 'ar' ? author.author_bio_ar : author.author_bio_en) || '';
    const expertise = lang === 'ar' ? author.author_expertise_ar : author.author_expertise_en;
    const description = bio || (
      lang === 'ar'
        ? `تعرف على مقالات ${author.full_name} المنشورة في Best5.`
        : `Explore articles by ${author.full_name} published on Best5.`
    );
    const profile = [
      `<article><h1>${escapeHtml(author.full_name)}</h1>`,
      authorTitle ? `<p>${escapeHtml(authorTitle)}</p>` : '',
      bio ? `<p>${escapeHtml(bio)}</p>` : '',
      expertise.length
        ? `<h2>${lang === 'ar' ? 'مجالات الخبرة' : 'Areas of expertise'}</h2><ul>${expertise.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : '',
      `</article>`,
      `<section><h2>${lang === 'ar' ? 'المقالات المنشورة' : 'Published articles'}</h2>${this.postList(author.posts, lang)}</section>`
    ].join('');
    const sameAs = [safeHref(author.author_website_url), safeHref(author.author_social_url)].filter(Boolean);
    return {
      status: 200,
      title: `${author.full_name} | Best5`,
      description,
      canonicalPath,
      alternateAr: `/ar/author/${encodeURIComponent(author.author_slug)}`,
      alternateEn: `/en/author/${encodeURIComponent(author.author_slug)}`,
      image: absoluteUrl(baseUrl, author.author_image_url),
      body: this.shell(lang, author.full_name, profile),
      jsonLd: [{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: author.full_name,
        jobTitle: authorTitle || undefined,
        description: bio || undefined,
        image: absoluteUrl(baseUrl, author.author_image_url) || undefined,
        url: `${baseUrl}${canonicalPath}`,
        sameAs: sameAs.length ? sameAs : undefined
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
    const categorySeo = getCategorySeo(category, lang);
    const relatedCategories = await this.prisma.category.findMany({
      where: { id: { not: category.id } },
      orderBy: { name_en: 'asc' },
      take: 5
    });
    const relatedLinks = relatedCategories.map((item) => {
      const relatedSlug = lang === 'ar' ? item.slug_ar : item.slug_en;
      const relatedName = lang === 'ar' ? item.name_ar : item.name_en;
      return `<a href="/${lang}/category/${encodeURIComponent(relatedSlug)}">${escapeHtml(relatedName)}</a>`;
    }).join(' ');
    return {
      status: 200,
      title: categorySeo.title,
      description: categorySeo.description,
      canonicalPath: `/${lang}/category/${encodeURIComponent(slug)}`,
      alternateAr: `/ar/category/${encodeURIComponent(category.slug_ar)}`,
      alternateEn: `/en/category/${encodeURIComponent(category.slug_en)}`,
      body: this.shell(
        lang,
        name,
        `<p>${escapeHtml(categorySeo.intro)}</p><nav>${relatedLinks}</nav>${this.postList(posts, lang)}`
      )
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
    const content = pick(pages?.[key], lang) || staticPageContent[key]?.[lang] || '';
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
    const usedIds = new Map<string, number>();
    return blocks.map((block, index) => {
      const rawId = String(block?.id || `${block?.type || 'section'}-${index + 1}`)
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || `section-${index + 1}`;
      const baseId = `block-${rawId}`;
      const occurrence = (usedIds.get(baseId) || 0) + 1;
      usedIds.set(baseId, occurrence);
      const anchorId = occurrence === 1 ? baseId : `${baseId}-${occurrence}`;
      const html = this.renderBlock(block, lang);
      return html ? `<div id="${anchorId}">${html}</div>` : '';
    }).join('');
  }

  private renderBlock(block: any, lang: Lang) {
      const data = block?.data || {};
      if (block.type === 'heading') {
        const heading = pick(data.text, lang).trim();
        return heading ? `<h2>${escapeHtml(heading)}</h2>` : '';
      }
      if (block.type === 'paragraph') {
        const paragraph = pick(data.text, lang).trim();
        return paragraph ? `<p>${escapeHtml(paragraph)}</p>` : '';
      }
      if (block.type === 'guide') {
        const title = pick(data.title, lang).trim();
        const content = pick(data.content, lang).trim();
        return title && content ? `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(content)}</p></section>` : '';
      }
      if (block.type === 'summary') {
        const items = (data.items || []).map((item: any) => pick(item, lang).trim()).filter(Boolean);
        return items.length ? `<section><h2>${escapeHtml(pick(data.title, lang))}</h2><ul>${items.map((item: string) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>` : '';
      }
      if (block.type === 'cards') {
        const cards = (data.cards || []).filter((card: any) => pick(card.title, lang).trim() || pick(card.label, lang).trim() || pick(card.note, lang).trim());
        return cards.length ? `<section><h2>${escapeHtml(pick(data.title, lang))}</h2>${cards.map((card: any) => `<article>${pick(card.title, lang) ? `<h3>${escapeHtml(pick(card.title, lang))}</h3>` : ''}${pick(card.note, lang) ? `<p>${escapeHtml(pick(card.note, lang))}</p>` : ''}</article>`).join('')}</section>` : '';
      }
      if (block.type === 'comparison') {
        const columns = (data.headers || []).map((item: any, index: number) => ({ index, label: pick(item, lang).trim() })).filter((item: any) => item.label);
        const rows = (data.rows || []).filter((row: any[]) => columns.some((column: any) => pick(row[column.index], lang).trim()));
        return columns.length && rows.length
          ? `<section><h2>${escapeHtml(pick(data.title, lang))}</h2><table><thead><tr>${columns.map((column: any) => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr></thead><tbody>${rows.map((row: any[]) => `<tr>${columns.map((column: any) => `<td>${escapeHtml(pick(row[column.index], lang))}</td>`).join('')}</tr>`).join('')}</tbody></table></section>`
          : '';
      }
      if (block.type === 'image') {
        const caption = pick(data.caption, lang).trim();
        return data.url && caption ? `<figure><img src="${escapeHtml(data.url)}" alt="${escapeHtml(caption)}" width="1200" height="675" loading="lazy" decoding="async"><figcaption>${escapeHtml(caption)}</figcaption></figure>` : '';
      }
      if (block.type === 'cta') {
        const label = pick(data.label, lang).trim();
        return label ? `<p>${escapeHtml(label)}</p>` : '';
      }
      if (block.type === 'restaurant') {
        const pros = (data.pros || []).map((item: any) => pick(item, lang).trim()).filter(Boolean).map((item: string) => `<li>${escapeHtml(item)}</li>`).join('');
        const cons = (data.cons || []).map((item: any) => pick(item, lang).trim()).filter(Boolean).map((item: string) => `<li>${escapeHtml(item)}</li>`).join('');
        const name = pick(data.name, lang).trim();
        if (!name) return '';
        const address = pick(data.address, lang).trim();
        const mapLabel = pick(data.mapButtonLabel, lang) || (lang === 'ar' ? 'عرض على خرائط قوقل' : 'Open in Google Maps');
        const explicitMapUrl = safeHref(data.mapUrl);
        const mapUrl = explicitMapUrl || (name || address
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, address].filter(Boolean).join(' '))}`
          : '');
        const mapButton = data.mapButtonVisible !== false && mapUrl
          ? `<p><a href="${escapeHtml(mapUrl)}">${escapeHtml(mapLabel)}</a></p>`
          : '';
        const actionButtons = (Array.isArray(data.actionButtons)
          ? data.actionButtons
          : data.extraButtonVisible === true
            ? [{ label: data.extraButtonLabel, url: data.extraButtonUrl, clickable: data.extraButtonClickable, visible: true }]
            : []
        ).map((button: any) => {
          const label = pick(button.label, lang).trim();
          const url = safeHref(button.url);
          if (button.visible === false || !label) return '';
          return button.clickable !== false && url
            ? `<p><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></p>`
            : `<p>${escapeHtml(label)}</p>`;
        }).join('');
        return `<section><h2>${escapeHtml(name)}</h2><p>${escapeHtml(pick(data.description, lang))}</p><p>${escapeHtml(address)}</p>${pros ? `<ul>${pros}</ul>` : ''}${cons ? `<ul>${cons}</ul>` : ''}${mapButton}${actionButtons}</section>`;
      }
      if (block.type === 'faq') {
        const items = (data.items || []).filter((item: any) => pick(item.q, lang).trim() && pick(item.a, lang).trim());
        return items.length ? `<section><h2>${escapeHtml(pick(data.title, lang))}</h2>${items.map((item: any) => `<h3>${escapeHtml(pick(item.q, lang))}</h3><p>${escapeHtml(pick(item.a, lang))}</p>`).join('')}</section>` : '';
      }
      return '';
      return '';
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
      (page.alternateEn || page.alternateAr) ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${baseUrl}${page.alternateEn || page.alternateAr}`)}">` : ''
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
