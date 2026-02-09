import React, { useMemo } from 'react';
import { DynamicIcon, iconNames } from 'lucide-react/dynamic';
import { useLang } from '../hooks/useLang';

type Localized = { ar?: string; en?: string };
type FeatureItem = { title?: Localized; text?: Localized; icon?: string; tone?: string };
type FeaturesConfig = { heading?: Localized; sub?: Localized; items?: FeatureItem[] };

const Features: React.FC<{ config?: FeaturesConfig }> = ({ config }) => {
  const { lang } = useLang();
  const copy = useMemo(
    () => ({
      heading: config?.heading?.[lang] || (lang === 'ar' ? 'لماذا تختار دليل بشكتاش؟' : 'Why choose Besiktas City Guide?'),
      sub:
        config?.sub?.[lang] ||
        (lang === 'ar'
          ? 'نحن نوفر عليك عناء البحث من خلال تقديم معلومات دقيقة ومحدثة من قلب الحدث.'
          : 'We save you the hassle of searching by providing accurate, up‑to‑date insights.'),
      items:
        config?.items?.length
          ? config.items
          : [
              {
                title: { ar: 'اختيارات الخبراء', en: 'Expert picks' },
                text: { ar: 'فريقنا المحلي يقوم بتجربة وتقييم كل مكان بشكل شخصي ومستقل تماماً.', en: 'Our local team tests and reviews every place independently.' },
                icon: 'ShieldCheck',
                tone: 'green'
              },
              {
                title: { ar: 'مقارنات شاملة في صفحة واحدة', en: 'All comparisons in one place' },
                text: { ar: 'نقوم بتجميع الأسعار، الموقع، ساعات العمل، والتقييمات في جداول سهلة القراءة.', en: 'Prices, locations, hours, and ratings in clean, easy tables.' },
                icon: 'ListChecks',
                tone: 'teal'
              },
              {
                title: { ar: 'تحديثات دورية للأسعار', en: 'Regular price updates' },
                text: { ar: 'نتابع تغيرات الأسعار في اسطنبول بشكل أسبوعي لنضمن لك ميزانية دقيقة.', en: 'We track price changes weekly to keep your budget accurate.' },
                icon: 'History',
                tone: 'emerald'
              }
            ]
    }),
    [config, lang]
  );

  const iconSet = useMemo(() => new Set(iconNames), []);
  const normalizeIconName = (value?: string | null) => {
    const raw = (value || '').trim();
    if (!raw) return null;
    return raw
      .replace(/^Lucide/i, '')
      .replace(/Icon$/i, '')
      .replace(/[_\s]+/g, '-')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
  };
  const resolveIconName = (value?: string | null) => {
    const name = normalizeIconName(value);
    if (!name) return null;
    if (iconSet.has(name)) return name;
    return null;
  };

  const toneClasses = (tone?: string, idx = 0) => {
    const key = (tone || '').toLowerCase();
    if (key === 'teal') return 'bg-teal-900/50 text-teal-400 border-teal-500/20';
    if (key === 'emerald') return 'bg-emerald-900/50 text-emerald-400 border-emerald-500/20';
    if (key === 'green') return 'bg-green-900/50 text-primary border-primary/20';
    return idx === 1
      ? 'bg-teal-900/50 text-teal-400 border-teal-500/20'
      : idx === 2
      ? 'bg-emerald-900/50 text-emerald-400 border-emerald-500/20'
      : 'bg-green-900/50 text-primary border-primary/20';
  };

  const pick = (value?: Localized) => value?.[lang] || value?.ar || value?.en || '';

  return (
    <section className="bg-secondary py-20 px-4 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">{copy.heading}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16">{copy.sub}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {copy.items.map((item, idx) => {
            const iconName = resolveIconName(item.icon) || 'shield-check';
            return (
              <div key={`${iconName}-${idx}`} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${toneClasses(item.tone, idx)}`}>
                  <DynamicIcon name={iconName} className="w-8 h-8" fallback={() => null} />
                </div>
                <h3 className="text-xl font-bold mb-3">{pick(item.title)}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{pick(item.text)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
