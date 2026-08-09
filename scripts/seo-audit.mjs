import { writeFile } from 'node:fs/promises';

const crawlBase = (process.env.SEO_AUDIT_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const sitemapPath = process.env.SEO_AUDIT_SITEMAP_PATH || '/sitemap.xml';
const expectedHost = (process.env.SEO_AUDIT_CANONICAL_HOST || 'best5.com.tr').toLowerCase();
const concurrency = Math.max(1, Math.min(20, Number(process.env.SEO_AUDIT_CONCURRENCY) || 8));
const reportPath = process.env.SEO_AUDIT_REPORT || '';

const decodeEntities = (value = '') =>
  value
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const normalizeUrl = (value) => {
  try {
    const url = new URL(value);
    url.hash = '';
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  } catch {
    return '';
  }
};

const attr = (tag, name) => {
  const match = tag.match(new RegExp(`\\s${name}=(?:\"([^\"]*)\"|'([^']*)')`, 'i'));
  return decodeEntities(match?.[1] || match?.[2] || '');
};

const firstTag = (html, pattern) => html.match(pattern)?.[0] || '';
const textOf = (html, pattern) =>
  decodeEntities(html.match(pattern)?.[1] || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const visibleText = (html) =>
  decodeEntities(
    html
      .replace(/<head[\s\S]*?<\/head>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  ).replace(/\s+/g, ' ').trim();

const languageLeak = (lang, sample) => {
  const arabic = (sample.match(/[\u0600-\u06ff]/g) || []).length;
  const latin = (sample.match(/[A-Za-z]/g) || []).length;
  if (lang === 'en' && arabic >= 12 && arabic > latin * 0.15) {
    return `English SEO sample contains ${arabic} Arabic characters`;
  }
  if (lang === 'ar' && latin >= 40 && arabic < latin * 0.35) {
    return `Arabic SEO sample is predominantly English (${latin} Latin vs ${arabic} Arabic characters)`;
  }
  return '';
};

const requestText = async (url) => {
  const response = await fetch(url, {
    redirect: 'manual',
    headers: { Accept: 'text/html,application/xml;q=0.9,*/*;q=0.8' },
    signal: AbortSignal.timeout(20_000)
  });
  return { response, body: await response.text() };
};

const sitemapRequest = await requestText(`${crawlBase}${sitemapPath}`);
if (!sitemapRequest.response.ok) {
  throw new Error(`Sitemap returned ${sitemapRequest.response.status}`);
}

const sitemapUrls = [...sitemapRequest.body.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
  .map((match) => decodeEntities(match[1].trim()));
if (!sitemapUrls.length) throw new Error('Sitemap contains no URLs');

const auditPage = async (sitemapUrl) => {
  const errors = [];
  let expected;
  try {
    expected = new URL(sitemapUrl);
  } catch {
    return { sitemapUrl, crawlUrl: '', status: 0, canonical: '', alternates: {}, errors: ['Invalid sitemap URL'] };
  }
  if (expected.protocol !== 'https:') errors.push('Sitemap URL is not HTTPS');
  if (expected.hostname.toLowerCase() !== expectedHost || expected.hostname.toLowerCase().startsWith('www.')) {
    errors.push(`Sitemap host must be non-www ${expectedHost}`);
  }

  const crawlUrl = `${crawlBase}${expected.pathname}${expected.search}`;
  try {
    const { response, body } = await requestText(crawlUrl);
    if (response.status !== 200) errors.push(`HTTP status is ${response.status}, expected 200`);
    if (response.status >= 300 && response.status < 400) {
      errors.push(`Sitemap URL redirects to ${response.headers.get('location') || '(missing location)'}`);
    }

    const head = body.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || '';
    const htmlTag = firstTag(body, /<html\b[^>]*>/i);
    const title = textOf(head, /<title>([\s\S]*?)<\/title>/i);
    const descriptionTag = [...head.matchAll(/<meta\b[^>]*>/gi)]
      .map((match) => match[0])
      .find((tag) => attr(tag, 'name').toLowerCase() === 'description') || '';
    const description = attr(descriptionTag, 'content').trim();
    const canonicalTags = [...head.matchAll(/<link\b[^>]*>/gi)]
      .map((match) => match[0])
      .filter((tag) => attr(tag, 'rel').toLowerCase() === 'canonical');
    const canonical = normalizeUrl(attr(canonicalTags[0] || '', 'href'));
    const expectedCanonical = normalizeUrl(sitemapUrl);
    const h1Count = [...body.matchAll(/<h1\b[^>]*>/gi)].length;
    const lang = attr(htmlTag, 'lang').toLowerCase();
    const expectedLang = expected.pathname.split('/').filter(Boolean)[0];
    const alternateTags = [...head.matchAll(/<link\b[^>]*>/gi)]
      .map((match) => match[0])
      .filter((tag) => attr(tag, 'rel').toLowerCase() === 'alternate' && attr(tag, 'hreflang'));
    const alternates = Object.fromEntries(
      alternateTags.map((tag) => [attr(tag, 'hreflang').toLowerCase(), normalizeUrl(attr(tag, 'href'))])
    );

    if (!title) errors.push('Title is missing');
    if (!description) errors.push('Meta description is missing');
    if (canonicalTags.length !== 1) errors.push(`Canonical count is ${canonicalTags.length}, expected 1`);
    if (canonical !== expectedCanonical) errors.push(`Canonical is not self-referencing (${canonical || 'missing'})`);
    if (h1Count !== 1) errors.push(`H1 count is ${h1Count}, expected 1`);
    if (lang !== expectedLang) errors.push(`HTML lang is ${lang || 'missing'}, expected ${expectedLang}`);
    for (const code of ['ar', 'en', 'x-default']) {
      if (!alternates[code]) errors.push(`hreflang ${code} is missing`);
    }
    const visible = visibleText(body);
    if (/(?:\bKeywords|الكلمات\s+المفتاحية)\s*:/i.test(visible)) {
      errors.push('Visible Keywords label found');
    }
    const h1 = textOf(body, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    const leak = languageLeak(expectedLang, `${title} ${description} ${h1}`);
    if (leak) errors.push(leak);

    return {
      sitemapUrl: expectedCanonical,
      crawlUrl,
      status: response.status,
      canonical,
      alternates,
      title,
      description,
      h1Count,
      lang,
      errors
    };
  } catch (error) {
    errors.push(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    return { sitemapUrl, crawlUrl, status: 0, canonical: '', alternates: {}, errors };
  }
};

const results = new Array(sitemapUrls.length);
let cursor = 0;
let completed = 0;
const workers = Array.from({ length: Math.min(concurrency, sitemapUrls.length) }, async () => {
  while (true) {
    const index = cursor++;
    if (index >= sitemapUrls.length) return;
    results[index] = await auditPage(sitemapUrls[index]);
    completed += 1;
    if (completed % 25 === 0 || completed === sitemapUrls.length) {
      console.log(`Audited ${completed}/${sitemapUrls.length}`);
    }
  }
});
await Promise.all(workers);

const byCanonical = new Map(results.map((result) => [result.canonical, result]));
for (const result of results) {
  const currentLang = new URL(result.sitemapUrl).pathname.split('/').filter(Boolean)[0];
  for (const targetLang of ['ar', 'en']) {
    const targetUrl = result.alternates[targetLang];
    if (!targetUrl) continue;
    const target = byCanonical.get(targetUrl);
    if (!target) {
      result.errors.push(`hreflang ${targetLang} target is not present in sitemap`);
      continue;
    }
    if (target.alternates[currentLang] !== result.canonical) {
      result.errors.push(`hreflang ${targetLang} is not reciprocal`);
    }
  }
}

const failures = results.filter((result) => result.errors.length);
const report = {
  generatedAt: new Date().toISOString(),
  crawlBase,
  sitemap: `${crawlBase}${sitemapPath}`,
  total: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
  results
};

if (reportPath) {
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Report written to ${reportPath}`);
}

for (const failure of failures) {
  console.error(`FAIL ${failure.sitemapUrl}`);
  for (const error of failure.errors) console.error(`  - ${error}`);
}
console.log(`SEO audit: ${report.passed}/${report.total} passed, ${report.failed} failed`);
if (failures.length) process.exit(1);
