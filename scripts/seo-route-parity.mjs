const baseUrl = (process.env.SEO_TEST_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

const decodeHtml = (value = '') =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const matches = (html, pattern) => [...html.matchAll(pattern)];
const contentOf = (html, pattern) => decodeHtml(html.match(pattern)?.[1] || '');

const fetchJson = async (path) => {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
};

const fetchPage = async (path) => {
  const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
  return { path, status: response.status, html: await response.text() };
};

const inspectHead = ({ path, status, html }, expectedStatus) => {
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
  const title = contentOf(head, /<title>([\s\S]*?)<\/title>/i);
  const description = contentOf(head, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = contentOf(head, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const robots = contentOf(head, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const canonicalPath = canonical ? new URL(canonical).pathname : '';
  const errors = [];
  if (status !== expectedStatus) errors.push(`status ${status}, expected ${expectedStatus}`);
  if (matches(head, /<title>/gi).length !== 1 || !title) errors.push('title must exist exactly once');
  if (matches(head, /<link\s+rel="canonical"/gi).length !== 1) errors.push('canonical must exist exactly once');
  if (canonicalPath !== path) errors.push(`canonical path ${canonicalPath || '(missing)'} does not match ${path}`);
  if (expectedStatus === 404) {
    if (robots !== 'noindex,follow') errors.push('404 must be noindex,follow');
    if (matches(head, /hreflang=/g).length) errors.push('404 must not expose hreflang');
  } else {
    if (!description) errors.push('description is missing');
    for (const lang of ['ar', 'en', 'x-default']) {
      if (matches(head, new RegExp(`hreflang="${lang}"`, 'g')).length !== 1) {
        errors.push(`${lang} alternate must exist exactly once`);
      }
    }
  }
  return { title, description, canonical, errors };
};

const posts = await fetchJson('/api/posts/public?lang=en');
const categories = await fetchJson('/api/categories/public');
if (!posts.length || !categories.length) throw new Error('SEO fixtures require at least one published post and category');

const article = posts[0];
const category = categories.find((item) => item.slug_en === 'restaurants') || categories[0];
const routes = [
  {
    kind: 'article',
    page: await fetchPage(`/en/blog/${encodeURIComponent(article.slug_en)}`),
    expectedStatus: 200
  },
  {
    kind: 'category',
    page: await fetchPage(`/en/category/${encodeURIComponent(category.slug_en)}`),
    expectedStatus: 200
  },
  {
    kind: '404',
    page: await fetchPage('/en/seo-parity-missing-page'),
    expectedStatus: 404
  },
  {
    kind: 'noindex',
    page: await fetchPage('/en/compare/seo-parity'),
    expectedStatus: 200,
    expectedRobots: 'noindex,follow'
  }
];

let failed = false;
for (const fixture of routes) {
  const result = inspectHead(fixture.page, fixture.expectedStatus);
  const errors = [...result.errors];
  if (fixture.expectedRobots) {
    const head = fixture.page.html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
    const robots = contentOf(head, /<meta\s+name="robots"\s+content="([^"]*)"/i);
    if (robots !== fixture.expectedRobots) {
      errors.push(`robots is ${robots || '(missing)'}, expected ${fixture.expectedRobots}`);
    }
  }
  if (fixture.kind === 'article') {
    const jsonLdTypes = matches(
      fixture.page.html,
      /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi
    ).flatMap((match) => {
      try {
        const value = JSON.parse(match[1]);
        return Array.isArray(value) ? value.map((item) => item?.['@type']) : [value?.['@type']];
      } catch {
        return [];
      }
    });
    if (!jsonLdTypes.includes('BlogPosting')) errors.push('article BlogPosting JSON-LD is missing');
    if (!jsonLdTypes.includes('BreadcrumbList')) errors.push('article BreadcrumbList JSON-LD is missing');
  }
  if (fixture.kind === 'category') {
    const intro = contentOf(
      fixture.page.html,
      /<p class="mt-5 max-w-5xl text-base leading-8 text-gray-600">([\s\S]*?)<\/p>/i
    ).replace(/<[^>]+>/g, ' ');
    const words = intro.split(/\s+/).filter(Boolean).length;
    if (words < 150 || words > 250) errors.push(`category intro has ${words} words; expected 150–250`);
  }
  if (errors.length) {
    failed = true;
    console.error(`FAIL ${fixture.kind} ${fixture.page.path}: ${errors.join('; ')}`);
  } else {
    console.log(`PASS ${fixture.kind} ${fixture.page.path}`);
  }
}

const trailingSlashPath = `/en/category/${encodeURIComponent(category.slug_en)}/`;
const trailingSlash = await fetchPage(trailingSlashPath);
const expectedLocation = trailingSlashPath.replace(/\/$/, '');
const actualLocation = trailingSlash.status >= 300 && trailingSlash.status < 400
  ? new URL((await fetch(`${baseUrl}${trailingSlashPath}`, { redirect: 'manual' })).headers.get('location'), baseUrl).pathname
  : '';
if (trailingSlash.status !== 301 || actualLocation !== expectedLocation) {
  failed = true;
  console.error(
    `FAIL trailing-slash ${trailingSlashPath}: status ${trailingSlash.status}, location ${actualLocation || '(missing)'}`
  );
} else {
  console.log(`PASS trailing-slash ${trailingSlashPath}`);
}

if (failed) process.exit(1);
