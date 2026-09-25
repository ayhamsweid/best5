import sanitizeHtml = require('sanitize-html');

const trustedEmbedHosts = new Set([
  'www.google.com', 'maps.google.com', 'www.google.com.tr',
  'www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'
]);

export const sanitizeRichHtml = (value: unknown) => sanitizeHtml(String(value ?? ''), {
  allowedTags: [
    'a', 'blockquote', 'br', 'code', 'div', 'em', 'figcaption', 'figure',
    'h1', 'h2', 'h3', 'h4', 'hr', 'img', 'li', 'ol', 'p', 'pre', 'span',
    'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul'
  ],
  allowedAttributes: {
    a: ['href', 'rel', 'target', 'title', 'aria-label', 'class'],
    img: ['src', 'alt', 'height', 'width', 'loading', 'class'],
    '*': ['class', 'aria-label', 'colspan', 'rowspan', 'title']
  },
  allowedSchemes: ['https', 'mailto', 'tel'],
  allowProtocolRelative: false,
  allowedSchemesByTag: { img: ['https'] },
  transformTags: {
    a: (_tagName, attribs) => ({
      tagName: 'a',
      attribs: { ...attribs, rel: 'noopener noreferrer', target: '_blank' }
    })
  }
});

const safeUrl = (value: unknown, embed = false) => {
  if (typeof value !== 'string') return '';
  const candidate = value.trim();
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return embed ? '' : candidate;
  try {
    const url = new URL(candidate);
    if (url.protocol !== 'https:') return '';
    if (embed && !trustedEmbedHosts.has(url.hostname.toLowerCase())) return '';
    return url.toString();
  } catch {
    return '';
  }
};

const sanitizeBlockValue = (value: unknown, key = ''): unknown => {
  if (Array.isArray(value)) {
    if (/urls$/i.test(key)) return value.map((item) => safeUrl(item)).filter(Boolean);
    return value.map((item) => sanitizeBlockValue(item));
  }
  if (!value || typeof value !== 'object') {
    if (typeof value === 'string' && /embedurl$/i.test(key)) return safeUrl(value, true);
    if (typeof value === 'string' && /(^url$|url$)/i.test(key)) return safeUrl(value);
    return value;
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([childKey, childValue]) => [
      childKey,
      sanitizeBlockValue(childValue, childKey)
    ])
  );
};

export const sanitizePostPayload = <T extends {
  content_ar?: string;
  content_en?: string;
  content_blocks_json?: unknown;
}>(data: T): T => ({
  ...data,
  ...(data.content_ar !== undefined ? { content_ar: sanitizeRichHtml(data.content_ar) } : {}),
  ...(data.content_en !== undefined ? { content_en: sanitizeRichHtml(data.content_en) } : {}),
  ...(data.content_blocks_json !== undefined
    ? { content_blocks_json: sanitizeBlockValue(data.content_blocks_json) }
    : {})
}) as T;
