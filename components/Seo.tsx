import { useEffect } from 'react';
import { SeoData, useSeoCollector } from '../context/SeoContext';
import { useSiteUrl } from '../context/InitialDataContext';
import { normalizeSeoData } from '../utils/seo';

type SeoProps = SeoData;

const setMeta = (name: string, content?: string) => {
  const tags = Array.from(document.querySelectorAll(`meta[name="${name}"]`)) as HTMLMetaElement[];
  const [existing, ...duplicates] = tags;
  duplicates.forEach((tag) => tag.remove());
  if (!content) {
    existing?.remove();
    return;
  }
  let tag = existing;
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const setCanonical = (href?: string) => {
  const links = Array.from(
    document.querySelectorAll('link[rel="canonical"]')
  ) as HTMLLinkElement[];
  const [existing, ...duplicates] = links;
  duplicates.forEach((link) => link.remove());
  if (!href) {
    existing?.remove();
    return;
  }
  let link = existing;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
};

const setAlternate = (hreflang: string, href?: string) => {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  const links = Array.from(document.querySelectorAll(selector)) as HTMLLinkElement[];
  const [existing, ...duplicates] = links;
  duplicates.forEach((link) => link.remove());
  if (!href) {
    existing?.remove();
    return;
  }
  let link = existing;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
};

const setMetaProperty = (property: string, content?: string) => {
  const tags = Array.from(document.querySelectorAll(`meta[property="${property}"]`)) as HTMLMetaElement[];
  const [existing, ...duplicates] = tags;
  duplicates.forEach((tag) => tag.remove());
  if (!content) {
    existing?.remove();
    return;
  }
  let tag = existing;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const Seo: React.FC<SeoProps> = ({ title, description, canonical, image, type = 'website', url, status, robots, alternates }) => {
  const collectSeo = useSeoCollector();
  const siteUrl = useSiteUrl();
  const normalized = normalizeSeoData({ title, description, canonical, image, type, url, status, robots, alternates }, siteUrl);
  if (typeof document === 'undefined' && collectSeo) {
    collectSeo(normalized);
  }

  useEffect(() => {
    document.title = normalized.title;
    setMeta('description', normalized.description);
    setMeta('robots', normalized.robots);
    setCanonical(normalized.canonical);
    setMetaProperty('og:title', normalized.title);
    setMetaProperty('og:description', normalized.description);
    setMetaProperty('og:type', normalized.type);
    setMetaProperty('og:url', normalized.url || normalized.canonical);
    setMetaProperty('og:image', normalized.image);
    setMeta('twitter:card', normalized.image ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', normalized.title);
    setMeta('twitter:description', normalized.description);
    setMeta('twitter:image', normalized.image);
    setAlternate('ar', normalized.alternates?.ar);
    setAlternate('en', normalized.alternates?.en);
    setAlternate('x-default', normalized.alternates?.xDefault);
  }, [
    normalized.title,
    normalized.description,
    normalized.canonical,
    normalized.image,
    normalized.type,
    normalized.url,
    normalized.robots,
    normalized.alternates?.ar,
    normalized.alternates?.en,
    normalized.alternates?.xDefault
  ]);

  return null;
};

export default Seo;
