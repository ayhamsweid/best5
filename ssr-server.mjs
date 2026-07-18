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
const apiCache = new Map();
const apiCacheTtlMs = Math.max(1_000, Number(process.env.SSR_API_CACHE_TTL_MS || 30_000));
const legacyCategorySlugs = new Map([
  ['1771560834740', 'فنادق'],
  ['1771014524393', 'متاحف'],
  ['1771014168963', 'أماكن'],
  ['1771014104954', 'مطاعم'],
  ['1771014576961', 'متاجر'],
  ['1771014651001', 'جامعات'],
  ['musems', 'museums'],
  ['restorants', 'restaurants'],
  ['store', 'stores']
]);

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

const decodePathParts = (pathname) => {
  try {
    return pathname.split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return null;
  }
};

const getJson = async (endpoint, fallback, cacheTtlMs = apiCacheTtlMs) => {
  const cached = apiCache.get(endpoint);
  if (cached && cached.expiresAt > Date.now()) return cached.promise;

  const promise = (async () => {
  try {
    const response = await fetch(`${apiBase}${endpoint}`, {
      headers: { Accept: 'application/json' }
    });
      if (response.status === 404) return fallback;
      if (!response.ok) {
        const error = new Error(`Internal API returned ${response.status}`);
        error.status = response.status;
        throw error;
      }
      const body = await response.text();
      if (!body.trim()) return fallback;
      try {
        return JSON.parse(body);
      } catch {
        const error = new Error('Internal API returned invalid JSON');
        error.status = 502;
        throw error;
      }
    } catch (error) {
      apiCache.delete(endpoint);
      throw error;
    }
  })();

  apiCache.set(endpoint, {
    expiresAt: Date.now() + cacheTtlMs,
    promise
  });
  return promise;
};

const localizedPostPath = (lang, post) => {
  if (!post) return null;
  const slug = lang === 'ar' ? post.slug_ar : post.slug_en;
  return slug ? `/${lang}/blog/${encodeURIComponent(slug)}` : null;
};

const redirectForAliasedPost = (url, initialData) => {
  if (!initialData.post) return null;
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts[1] !== 'blog' || parts.length !== 3) return null;
  const canonicalPath = localizedPostPath(initialData.lang, initialData.post);
  if (!canonicalPath) return null;
  let requestedSlug;
  try {
    requestedSlug = decodeURIComponent(parts[2]);
  } catch {
    return null;
  }
  const requestedPath = `/${parts[0]}/blog/${encodeURIComponent(requestedSlug)}`;
  return requestedPath === canonicalPath ? null : canonicalPath;
};

const redirectForAliasedCategory = (url, initialData) => {
  const parts = decodePathParts(url.pathname);
  if (!parts || parts[1] !== 'category' || parts.length !== 3) return null;
  const requestedSlug = parts[2];
  let category = initialData.categories?.find(
    (item) => item.slug_ar === requestedSlug || item.slug_en === requestedSlug
  );
  const replacementSlug = legacyCategorySlugs.get(requestedSlug);
  if (!category && replacementSlug) {
    category = initialData.categories?.find(
      (item) => item.slug_ar === replacementSlug || item.slug_en === replacementSlug
    );
  }
  if (!category) return null;
  const canonicalSlug = initialData.lang === 'ar' ? category.slug_ar : category.slug_en;
  if (!canonicalSlug || canonicalSlug === requestedSlug) return null;
  return `/${initialData.lang}/category/${encodeURIComponent(canonicalSlug)}`;
};

const transientStatus = (error) => {
  const status = Number(error?.status);
  return status === 429 || status >= 500 ? 503 : 500;
};

const retryAfter = (error) => {
  const status = Number(error?.status);
  return status === 429 || status >= 500 ? '30' : undefined;
};

const writeServiceError = (response, error) => {
  const status = transientStatus(error);
  const headers = {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store'
  };
  const after = retryAfter(error);
  if (after) headers['Retry-After'] = after;
  response.writeHead(status, headers);
  response.end(status === 503 ? 'Service temporarily unavailable' : 'Unable to render page');
};

const pruneApiCache = () => {
  const now = Date.now();
  for (const [key, value] of apiCache) {
    if (value.expiresAt <= now) apiCache.delete(key);
  }
};

const loadInitialData = async (url) => {
  const parts = decodePathParts(url.pathname);
  if (!parts) return { lang: 'ar', siteUrl, status: 404 };
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
  const alternateAr = absoluteUrl(seo?.alternates?.ar || alternateArPath);
  const alternateEn = absoluteUrl(seo?.alternates?.en || alternateEnPath);
  const alternateDefault = absoluteUrl(seo?.alternates?.xDefault || alternateEnPath || alternateArPath);
  const section = url.pathname.split('/').filter(Boolean)[1] || '';
  const robots = status === 404 || section === 'search' ? 'noindex,follow' : 'index,follow';
  return [
    `<title>${escapeHtml(title)}</title>`,
    description ? `<meta name="description" content="${escapeHtml(description)}">` : '',
    `<meta name="robots" content="${robots}">`,
    canonical ? `<link rel="canonical" href="${escapeHtml(canonical)}">` : '',
    status !== 404 && alternateAr ? `<link rel="alternate" hreflang="ar" href="${escapeHtml(alternateAr)}">` : '',
    status !== 404 && alternateEn ? `<link rel="alternate" hreflang="en" href="${escapeHtml(alternateEn)}">` : '',
    status !== 404 && alternateDefault ? `<link rel="alternate" hreflang="x-default" href="${escapeHtml(alternateDefault)}">` : '',
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
    pruneApiCache();
    const initialData = await loadInitialData(url);
    const aliasRedirect = redirectForAliasedPost(url, initialData);
    const categoryAliasRedirect = redirectForAliasedCategory(url, initialData);
    const canonicalRedirect = aliasRedirect || categoryAliasRedirect;
    if (canonicalRedirect) {
      response.writeHead(301, {
        Location: canonicalRedirect,
        'Cache-Control': 'public, max-age=3600'
      });
      response.end();
      return;
    }
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
    writeServiceError(response, error);
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`SSR renderer listening on ${port}`);
});
