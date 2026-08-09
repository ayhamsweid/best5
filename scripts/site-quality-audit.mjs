const baseUrl = String(process.env.SITE_AUDIT_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const productionOrigin = 'https://best5.com.tr';
const checkExternal = process.argv.includes('--external');
const timeoutMs = Number(process.env.SITE_AUDIT_TIMEOUT_MS || 12000);

const decode = (value = '') =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return decode(match?.[1] ?? match?.[2] ?? match?.[3] ?? '');
};

const request = async (url, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'Best5LocalQualityAudit/1.0 Googlebot' },
      signal: controller.signal,
      ...options
    });
  } finally {
    clearTimeout(timer);
  }
};

const runPool = async (items, limit, worker) => {
  let next = 0;
  const results = [];
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index], index);
    }
  });
  await Promise.all(runners);
  return results;
};

const productionUrl = new URL(productionOrigin);
const localOrigin = new URL(baseUrl).origin;
const toLocalUrl = (value) => {
  const url = new URL(value, productionOrigin);
  if (url.origin === productionUrl.origin) return `${baseUrl}${url.pathname}${url.search}`;
  if (url.origin === localOrigin) return url.href;
  return null;
};

const sitemapResponse = await request(`${baseUrl}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const pageUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)]
  .map((match) => toLocalUrl(decode(match[1].trim())))
  .filter(Boolean);

const errors = [];
const warnings = [];
const internalLinks = new Set();
const externalLinks = new Set();
const imageUrls = new Set();

await runPool(pageUrls, 12, async (url, index) => {
  try {
    const response = await request(url);
    if (response.status !== 200) {
      errors.push(`${url} returned ${response.status}`);
      return;
    }
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) return;
    const html = await response.text();

    for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
      const href = attr(match[0], 'href').trim();
      if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) continue;
      try {
        const local = toLocalUrl(href);
        if (local) internalLinks.add(local.split('#')[0]);
        else if (/^https?:/i.test(href)) externalLinks.add(new URL(href).href);
      } catch {
        errors.push(`${url} contains malformed link: ${href}`);
      }
    }

    for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
      const tag = match[0];
      const src = attr(tag, 'src').trim();
      const altPresent = /\salt\s*=/i.test(tag);
      const alt = attr(tag, 'alt').trim();
      if (!src) {
        errors.push(`${url} contains an image without src`);
        continue;
      }
      if (!altPresent || !alt) errors.push(`${url} contains an image without meaningful alt: ${src}`);
      try {
        const local = toLocalUrl(src);
        imageUrls.add(local || new URL(src, productionOrigin).href);
      } catch {
        errors.push(`${url} contains malformed image URL: ${src}`);
      }
    }
    if ((index + 1) % 50 === 0) console.log(`Scanned ${index + 1}/${pageUrls.length} sitemap pages`);
  } catch (error) {
    errors.push(`${url} failed: ${error.message}`);
  }
});

await runPool([...internalLinks], 12, async (url) => {
  try {
    const response = await request(url);
    if (response.status >= 400) errors.push(`Internal link ${url} returned ${response.status}`);
  } catch (error) {
    errors.push(`Internal link ${url} failed: ${error.message}`);
  }
});

await runPool([...imageUrls], 12, async (url) => {
  try {
    const response = await request(url);
    if (response.status >= 400) errors.push(`Image ${url} returned ${response.status}`);
  } catch (error) {
    errors.push(`Image ${url} failed: ${error.message}`);
  }
});

if (checkExternal) {
  await runPool([...externalLinks], 8, async (url, index) => {
    try {
      const response = await request(url);
      if (response.status === 404 || response.status === 410) {
        errors.push(`External link ${url} returned ${response.status}`);
      } else if (response.status >= 400) {
        warnings.push(`External link ${url} returned ${response.status}; manual check recommended`);
      }
    } catch (error) {
      warnings.push(`External link ${url} could not be verified: ${error.message}`);
    }
    if ((index + 1) % 50 === 0) console.log(`Checked ${index + 1}/${externalLinks.size} external links`);
  });
}

console.log(
  `Quality audit scanned ${pageUrls.length} pages, ${internalLinks.size} internal links, ` +
  `${imageUrls.size} images${checkExternal ? ` and ${externalLinks.size} external links` : ''}.`
);
for (const warning of warnings) console.warn(`WARN ${warning}`);
for (const error of errors) console.error(`FAIL ${error}`);
if (errors.length) {
  console.error(`Site quality audit failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
  process.exit(1);
}
console.log(`Site quality audit passed with ${warnings.length} warning(s).`);
