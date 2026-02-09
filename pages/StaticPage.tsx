import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicSettings } from '../services/api';
import Markdown from '../components/Markdown';

const pageMap = {
  privacy: { title: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' }, key: 'privacy' },
  contact: { title: { ar: 'تواصل معنا', en: 'Contact Us' }, key: 'contact' },
  advertise: { title: { ar: 'أعلن معنا', en: 'Advertise' }, key: 'advertise' },
  terms: { title: { ar: 'شروط الاستخدام', en: 'Terms of Use' }, key: 'terms' },
  cookies: { title: { ar: 'سياسة الكوكيز', en: 'Cookie Policy' }, key: 'cookies' },
  faq: { title: { ar: 'الأسئلة الشائعة', en: 'FAQ' }, key: 'faq' }
} as const;

type PageKey = keyof typeof pageMap;

const StaticPage: React.FC<{ slug?: PageKey }> = ({ slug: slugOverride }) => {
  const { slug } = useParams();
  const { lang } = useLang();
  const [pages, setPages] = useState<any>(null);
  const [pagesMeta, setPagesMeta] = useState<any>(null);

  useEffect(() => {
    fetchPublicSettings()
      .then((data) => {
        setPages(data?.pages_json || null);
        setPagesMeta(data?.pages_meta_json || null);
      })
      .catch(() => {
        setPages(null);
        setPagesMeta(null);
      });
  }, []);

  const activeSlug = (slugOverride || slug || '') as PageKey | '';
  const pageConfig = useMemo(() => (activeSlug ? pageMap[activeSlug] : null), [activeSlug]);
  const title = pageConfig ? pageConfig.title[lang] : '';
  const content = pageConfig ? pages?.[pageConfig.key]?.[lang] || '' : '';
  const meta = pageConfig ? pagesMeta?.[pageConfig.key] || {} : {};
  const ogImage = meta?.ogImage || '';

  const stripMarkdown = (md: string) =>
    md
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[#_*`>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  const description = stripMarkdown(content).slice(0, 160);

  if (!pageConfig) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-gray-500">
        Page not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-[#111827] dark:text-white">
      <Seo title={`${title} | Besiktas City Guide`} description={description} image={ogImage} />
      <h1 className="text-3xl md:text-4xl font-black mb-6">{title}</h1>
      <Markdown content={content} />
    </div>
  );
};

export default StaticPage;
