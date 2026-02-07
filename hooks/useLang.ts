import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

export type Lang = 'ar' | 'en';

const isLang = (value?: string): value is Lang => value === 'ar' || value === 'en';

export const useLang = () => {
  const params = useParams();
  const location = useLocation();
  const lang = isLang(params.lang) ? params.lang : 'ar';

  const otherLang: Lang = lang === 'ar' ? 'en' : 'ar';
  const basePath = location.pathname.replace(/^\/(ar|en)/, '');

  const switchPath = useMemo(() => `/${otherLang}${basePath}${location.search}`, [otherLang, basePath, location.search]);

  return { lang, otherLang, switchPath };
};
