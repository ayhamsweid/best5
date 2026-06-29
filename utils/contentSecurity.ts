import DOMPurify from 'isomorphic-dompurify';

const TRUSTED_EMBED_HOSTS = new Set([
  'www.google.com',
  'maps.google.com',
  'www.google.com.tr',
  'www.youtube.com',
  'youtube.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com'
]);

export const sanitizeContentHtml = (html: unknown) =>
  DOMPurify.sanitize(String(html ?? ''), {
    ALLOWED_TAGS: [
      'a', 'blockquote', 'br', 'code', 'div', 'em', 'figcaption', 'figure',
      'h1', 'h2', 'h3', 'h4', 'hr', 'img', 'li', 'ol', 'p', 'pre', 'span',
      'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul'
    ],
    ALLOWED_ATTR: [
      'alt', 'aria-label', 'class', 'colspan', 'height', 'href', 'loading',
      'rel', 'rowspan', 'src', 'target', 'title', 'width'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
    FORBID_TAGS: ['embed', 'form', 'iframe', 'input', 'link', 'meta', 'object', 'script', 'style']
  });

export const safeJsonForScript = (value: unknown) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

export const safeLinkUrl = (value: unknown, allowRelative = true) => {
  if (typeof value !== 'string') return '';
  const candidate = value.trim();
  if (!candidate) return '';
  if (allowRelative && candidate.startsWith('/') && !candidate.startsWith('//')) return candidate;

  try {
    const url = new URL(candidate);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
};

export const safeResourceUrl = (value: unknown) => {
  if (typeof value !== 'string') return '';
  const candidate = value.trim();
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return candidate;

  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
};

export const safeEmbedUrl = (value: unknown) => {
  const candidate = safeResourceUrl(value);
  if (!candidate || candidate.startsWith('/')) return '';

  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' && TRUSTED_EMBED_HOSTS.has(url.hostname.toLowerCase())
      ? url.toString()
      : '';
  } catch {
    return '';
  }
};
