import type { SeoData } from '../context/SeoContext';

const cleanText = (value?: string) => value?.replace(/\s+/g, ' ').trim() || undefined;

export const absoluteSeoUrl = (value: string | undefined, siteUrl: string) => {
  if (!value) return undefined;
  try {
    return new URL(value, `${siteUrl.replace(/\/+$/, '')}/`).toString();
  } catch {
    return undefined;
  }
};

const derivedAlternates = (canonical: string | undefined, siteUrl: string, status?: number) => {
  if (!canonical || status === 404) return undefined;
  try {
    const url = new URL(canonical, `${siteUrl}/`);
    if (!/^\/(ar|en)(?:\/|$)/.test(url.pathname)) return undefined;
    const ar = new URL(url.toString());
    const en = new URL(url.toString());
    ar.pathname = url.pathname.replace(/^\/(ar|en)(?=\/|$)/, '/ar');
    en.pathname = url.pathname.replace(/^\/(ar|en)(?=\/|$)/, '/en');
    ar.search = '';
    en.search = '';
    return { ar: ar.toString(), en: en.toString(), xDefault: en.toString() };
  } catch {
    return undefined;
  }
};

export const normalizeSeoData = (data: SeoData, siteUrl: string): SeoData => {
  const canonical = absoluteSeoUrl(data.canonical || data.url, siteUrl);
  const fallbackAlternates = derivedAlternates(canonical, siteUrl, data.status);
  const alternates = data.status === 404
    ? undefined
    : {
        ar: absoluteSeoUrl(data.alternates?.ar || fallbackAlternates?.ar, siteUrl),
        en: absoluteSeoUrl(data.alternates?.en || fallbackAlternates?.en, siteUrl),
        xDefault: absoluteSeoUrl(data.alternates?.xDefault || fallbackAlternates?.xDefault, siteUrl)
      };
  return {
    ...data,
    title: cleanText(data.title) || 'Best5',
    description: cleanText(data.description),
    canonical,
    url: absoluteSeoUrl(data.url, siteUrl) || canonical,
    image: absoluteSeoUrl(data.image, siteUrl),
    type: data.type || 'website',
    robots: data.robots || (data.status === 404 ? 'noindex,follow' : 'index,follow'),
    alternates: alternates && (alternates.ar || alternates.en || alternates.xDefault)
      ? alternates
      : undefined
  };
};
