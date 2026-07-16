import { useEffect } from 'react';
import { SeoData, useSeoCollector } from '../context/SeoContext';

type SeoProps = SeoData;

const setMeta = (name: string, content?: string) => {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const setCanonical = (href?: string) => {
  if (!href) return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
};

const setAlternate = (hreflang: string, href?: string) => {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  let link = document.querySelector(selector) as HTMLLinkElement | null;
  if (!href) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
};

const setMetaProperty = (property: string, content?: string) => {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const Seo: React.FC<SeoProps> = ({ title, description, canonical, image, type = 'website', url, status, alternates }) => {
  const collectSeo = useSeoCollector();
  if (typeof document === 'undefined' && collectSeo) {
    collectSeo({ title, description, canonical, image, type, url, status, alternates });
  }

  useEffect(() => {
    document.title = title;
    setMeta('description', description);
    setCanonical(canonical);
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:type', type);
    setMetaProperty('og:url', url || canonical);
    setMetaProperty('og:image', image);
    setMeta('twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
    setAlternate('ar', alternates?.ar);
    setAlternate('en', alternates?.en);
    setAlternate('x-default', alternates?.xDefault);
  }, [title, description, canonical, image, type, url, alternates?.ar, alternates?.en, alternates?.xDefault]);

  return null;
};

export default Seo;
