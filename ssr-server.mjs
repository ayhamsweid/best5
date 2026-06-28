import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render } from './dist-server/entry-server.js';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const template = await readFile(path.join(rootDir, 'dist', 'index.html'), 'utf8');
const apiBase = (process.env.API_INTERNAL_URL || 'http://localhost:4000/api').replace(/\/+$/, '');
const siteUrl = (process.env.PUBLIC_SITE_URL || 'https://best5.com.tr').replace(/\/+$/, '');
const port = Number(process.env.PORT || 3001);

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const safeJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

const absoluteUrl = (value) => {
  if (!value) return '';
  try {
    return new URL(value, `${siteUrl}/`).toString();
  } catch {
    return '';
  }
};

const getJson = async (endpoint, fallback) => {
  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) return fallback;
    return await response.json();
  } catch {
    return fallback;
  }
};

const loadInitialData = async (url) => {
  const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
  const lang = parts[0] === 'en' ? 'en' : 'ar';
  const section = parts[1] || '';
  const slug = parts.slice(2).join('/');
  const validLanguage = parts[0] === 'ar' || parts[0] === 'en';
  const staticSections = new Set(['about', 'privacy', 'contact', 'advertise', 'terms', 'cookies', 'faq']);
  const validRoute = validLanguage && (
    (parts.length === 1) ||
    (section === 'blog' && (parts.length === 2 || parts.length === 3)) ||
    (section === 'categories' && parts.length === 2) ||
    (section === 'category' && parts.length === 3) ||
    (section === 'search' && parts.length === 2) ||
    ((section === 'compare' || section === 'guide') && parts.length === 3) ||
    (staticSections.has(section) && parts.length === 2)
  );

  if (!validLanguage) {
    return { lang: 'ar', siteUrl, status: 404 };
  }

  const [settings, posts, categories] = await Promise.all([
    getJson('/settings/public', null),
    getJson(`/posts/public?lang=${lang}`, []),
    getJson('/categories/public', [])
  ]);

  const data = {
    lang,
    settings,
    posts,
    categories,
    siteUrl,
    status: validRoute ? 200 : 404
  };

  if (!section && validRoute) {
    const [popularPosts, tags] = await Promise.all([
      getJson(`/posts/public/popular?lang=${lang}&days=7&limit=24`, []),
      getJson('/tags/public', [])
    ]);
    data.popularPosts = popularPosts;
    data.tags = tags;
  }

  if (section === 'blog' && slug) {
    data.post = await getJson(`/posts/public/${encodeURIComponent(slug)}?lang=${lang}`, null);
    if (!data.post) data.status = 404;
  }

  if (section === 'category' && slug) {
    data.categoryPosts = await getJson(
      `/posts/public?lang=${lang}&category=${encodeURIComponent(slug)}`,
      []
    );
    const exists = categories.some((category) =>
      (lang === 'ar' ? category.slug_ar : category.slug_en) === slug
    );
    if (!exists) data.status = 404;
  }

  return data;
};

const renderHead = (seo, status, url, initialData) => {
  const title = seo?.title || (status === 404 ? 'Page not found | Best5' : 'Best5');
  const description = seo?.description || '';
  const canonical = absoluteUrl(seo?.canonical || seo?.url || `${url.pathname}${url.search}`);
  const image = absoluteUrl(seo?.image || '');
  const parts = url.pathname.split('/').filter(Boolean);
  let alternateArPath = url.pathname.replace(/^\/(ar|en)(?=\/|$)/, '/ar');
  let alternateEnPath = url.pathname.replace(/^\/(ar|en)(?=\/|$)/, '/en');
  if (parts[1] === 'blog' && initialData.post) {
    alternateArPath = `/ar/blog/${encodeURIComponent(initialData.post.slug_ar)}`;
    alternateEnPath = `/en/blog/${encodeURIComponent(initialData.post.slug_en)}`;
  }
  if (parts[1] === 'category' && parts[2]) {
    const categorySlug = decodeURIComponent(parts.slice(2).join('/'));
    const category = initialData.categories?.find((item) =>
      item.slug_ar === categorySlug || item.slug_en === categorySlug
    );
    if (category) {
      alternateArPath = `/ar/category/${encodeURIComponent(category.slug_ar)}`;
      alternateEnPath = `/en/category/${encodeURIComponent(category.slug_en)}`;
    }
  }
  const alternateAr = absoluteUrl(alternateArPath);
  const alternateEn = absoluteUrl(alternateEnPath);
  const section = url.pathname.split('/').filter(Boolean)[1] || '';
  const robots = status === 404 || section === 'search' ? 'noindex,follow' : 'index,follow';
  return [
    `<title>${escapeHtml(title)}</title>`,
    description ? `<meta name="description" content="${escapeHtml(description)}">` : '',
    `<meta name="robots" content="${robots}">`,
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : '',
    status !== 404 && alternateAr ? `<link rel="alternate" hreflang="ar" href="${escapeHtml(alternateAr)}">` : '',
    status !== 404 && alternateEn ? `<link rel="alternate" hreflang="en" href="${escapeHtml(alternateEn)}">` : '',
    status !== 404 && alternateAr ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(alternateAr)}">` : '',
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    description ? `<meta property="og:description" content="${escapeHtml(description)}">` : '',
    `<meta property="og:type" content="${escapeHtml(seo?.type || 'website')}">`,
    canonical ? `<meta property="og:url" content="${escapeHtml(canonical)}">` : '',
    image ? `<meta property="og:image" content="${escapeHtml(image)}">` : '',
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    description ? `<meta name="twitter:description" content="${escapeHtml(description)}">` : '',
    image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ''
  ].join('');
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', siteUrl);
    if (url.pathname === '/health') {
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('ok');
      return;
    }
    if (url.pathname === '/') {
      response.writeHead(301, { Location: '/ar' });
      response.end();
      return;
    }
    const initialData = await loadInitialData(url);
    const result = render(`${url.pathname}${url.search}`, initialData);
    const status = result.seo?.status || initialData.status || 200;
    const lang = initialData.lang;
    const head = renderHead(result.seo, status, url, initialData);
    const initialScript = `<script>window.__INITIAL_DATA__=${safeJson(initialData)}</script>`;
    const html = template
      .replace(/<html[^>]*>/i, `<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">`)
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace('</head>', `${head}</head>`)
      .replace(/<body class="/i, '<body class="app-ready ')
      .replace('<div id="root"></div>', `<div id="root">${result.html}</div>${initialScript}`);

    response.writeHead(status, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Vary': 'Accept-Encoding'
    });
    response.end(html);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Unable to render page');
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`SSR renderer listening on ${port}`);
});
