import React from 'react';
import { ShieldCheck, ListChecks, History } from 'lucide-react';
import { useLang } from '../hooks/useLang';

const Features: React.FC = () => {
  const { lang } = useLang();
  const copy = {
    heading: lang === 'ar' ? 'لماذا تختار دليل بشكتاش؟' : 'Why choose Besiktas City Guide?',
    sub: lang === 'ar'
      ? 'نحن نوفر عليك عناء البحث من خلال تقديم معلومات دقيقة ومحدثة من قلب الحدث.'
      : 'We save you the hassle of searching by providing accurate, up‑to‑date insights.',
    items:
      lang === 'ar'
        ? [
            {
              title: 'اختيارات الخبراء',
              text: 'فريقنا المحلي يقوم بتجربة وتقييم كل مكان بشكل شخصي ومستقل تماماً.'
            },
            {
              title: 'مقارنات شاملة في صفحة واحدة',
              text: 'نقوم بتجميع الأسعار، الموقع، ساعات العمل، والتقييمات في جداول سهلة القراءة.'
            },
            {
              title: 'تحديثات دورية للأسعار',
              text: 'نتابع تغيرات الأسعار في اسطنبول بشكل أسبوعي لنضمن لك ميزانية دقيقة.'
            }
          ]
        : [
            {
              title: 'Expert picks',
              text: 'Our local team tests and reviews every place independently.'
            },
            {
              title: 'All comparisons in one place',
              text: 'Prices, locations, hours, and ratings in clean, easy tables.'
            },
            {
              title: 'Regular price updates',
              text: 'We track price changes weekly to keep your budget accurate.'
            }
          ]
  };
  return (
    <section className="bg-secondary py-20 px-4 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">{copy.heading}</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16">{copy.sub}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 text-primary border border-primary/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">{copy.items[0].title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{copy.items[0].text}</p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-900/50 rounded-2xl flex items-center justify-center mb-6 text-teal-400 border border-teal-500/20">
              <ListChecks className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">{copy.items[1].title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{copy.items[1].text}</p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">{copy.items[2].title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{copy.items[2].text}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
