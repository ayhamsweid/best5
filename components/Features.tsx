import React from 'react';
import { ShieldCheck, ListChecks, History } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section className="bg-secondary py-20 px-4 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">لماذا تختار دليل بشكتاش؟</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-16">
          نحن نوفر عليك عناء البحث من خلال تقديم معلومات دقيقة ومحدثة من قلب الحدث.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-900/50 rounded-2xl flex items-center justify-center mb-6 text-primary border border-primary/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">اختيارات الخبراء</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              فريقنا المحلي يقوم بتجربة وتقييم كل مكان بشكل شخصي ومستقل تماماً.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-900/50 rounded-2xl flex items-center justify-center mb-6 text-teal-400 border border-teal-500/20">
              <ListChecks className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">مقارنات شاملة في صفحة واحدة</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              نقوم بتجميع الأسعار، الموقع، ساعات العمل، والتقييمات في جداول سهلة القراءة.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">تحديثات دورية للأسعار</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              نتابع تغيرات الأسعار في اسطنبول بشكل أسبوعي لنضمن لك ميزانية دقيقة.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;