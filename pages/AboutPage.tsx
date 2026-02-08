import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../hooks/useLang';

const CountUp: React.FC<{ to: number; suffix?: string; duration?: number }> = ({ to, suffix = '', duration = 1200 }) => {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      setValue(Math.floor(progress * to));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
};

const AboutPage: React.FC = () => {
  const { lang } = useLang();
  const copy = {
    badge: lang === 'ar' ? 'خبراء التقييم في اسطنبول' : 'Local ranking experts in Istanbul',
    title: lang === 'ar' ? 'نختار لك أفضل 5' : 'We pick the Best 5',
    titleAccent: lang === 'ar' ? 'في كل شيء' : 'for everything',
    intro:
      lang === 'ar'
        ? 'منصة “Best 5” تجمع لك أفضل خمس خيارات في أي مجال تفكر فيه: أكل، قهوة، أماكن، خدمات، وتسوق. توصياتنا مبنية على التجربة، الجودة، والقيمة الحقيقية.'
        : 'Best 5 brings you the top five options in whatever you’re looking for—food, coffee, places, services, and shopping. Our picks are based on experience, quality, and real value.',
    stats: [
      { value: 500, suffix: '+', label: lang === 'ar' ? 'قائمة تم إعدادها' : 'Lists published' },
      { value: 50, suffix: 'k+', label: lang === 'ar' ? 'زائر شهري' : 'Monthly visitors' },
      { value: 4.9, suffix: '/5', label: lang === 'ar' ? 'رضا المستخدمين' : 'User satisfaction' }
    ],
    whyTitle: lang === 'ar' ? 'لماذا Best 5؟' : 'Why Best 5?',
    whySubtitle:
      lang === 'ar'
        ? 'نختصر لك البحث الطويل بقوائم قصيرة دقيقة وسهلة المقارنة.'
        : 'We cut the noise with short, accurate lists that are easy to compare.',
    why: [
      {
        title: lang === 'ar' ? 'معايير دقيقة' : 'Clear criteria',
        text:
          lang === 'ar'
            ? 'نقيّم كل اختيار بمعايير ثابتة تشمل الجودة، الخدمة، القيمة، وتجربة المستخدم.'
            : 'We score every pick using consistent criteria: quality, service, value, and overall experience.'
      },
      {
        title: lang === 'ar' ? 'خبراء محليون' : 'Local experts',
        text:
          lang === 'ar'
            ? 'فريقنا يعيش في اسطنبول ويعرف التفاصيل التي لا تظهر في التقييمات العشوائية.'
            : 'Our team lives in Istanbul and knows the details you won’t find in random reviews.'
      },
      {
        title: lang === 'ar' ? 'تحديثات مستمرة' : 'Always updated',
        text:
          lang === 'ar'
            ? 'نراجع القوائم باستمرار لضمان أن المعلومات والأسعار ما زالت دقيقة.'
            : 'We continuously refresh lists to keep information and prices accurate.'
      }
    ],
    teamTitle: lang === 'ar' ? 'فريق العمل' : 'Meet the team',
    teamSubtitle:
      lang === 'ar'
        ? 'مجموعة من الذواقة والخبراء لبناء قوائم أفضل 5 واقعية ومفيدة.'
        : 'A team of experts building practical, trustworthy Best 5 lists.',
    team: [
      { name: lang === 'ar' ? 'أحمد يوسف' : 'Ahmed Youssef', role: lang === 'ar' ? 'مؤسس ومدير المحتوى' : 'Founder & Content Lead' },
      { name: lang === 'ar' ? 'ليلى مراد' : 'Leila Mourad', role: lang === 'ar' ? 'خبيرة تجارب الطعام' : 'Food Experience Lead' },
      { name: lang === 'ar' ? 'كريم حسن' : 'Karim Hassan', role: lang === 'ar' ? 'محلل قيمة وجودة' : 'Quality & Value Analyst' },
      { name: lang === 'ar' ? 'سارة كمال' : 'Sara Kamal', role: lang === 'ar' ? 'محررة محتوى وتسويق' : 'Content & Marketing' }
    ],
    faqTitle: lang === 'ar' ? 'أسئلة شائعة' : 'FAQ',
    faqs: [
      {
        q: lang === 'ar' ? 'كيف تختارون “أفضل 5”؟' : 'How do you choose the Best 5?',
        a:
          lang === 'ar'
            ? 'نوازن بين الجودة والقيمة وتجربة المستخدم مع مراجعات واقعية وزيارات متعددة.'
            : 'We balance quality, value, and user experience with real reviews and repeat visits.'
      },
      {
        q: lang === 'ar' ? 'هل يمكنني اقتراح موضوع؟' : 'Can I suggest a topic?',
        a:
          lang === 'ar'
            ? 'بالتأكيد، أرسل اقتراحك عبر صفحة تواصل معنا وسنراجعه.'
            : 'Absolutely—send your suggestion via the Contact page and we’ll review it.'
      }
    ]
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <section
        className="relative py-24 text-center text-white overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-primary/30">
            {copy.badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {copy.title} <br />
            <span className="text-primary">{copy.titleAccent}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">{copy.intro}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {copy.stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10 min-w-[140px]">
                <div className="text-3xl font-bold text-primary">
                  {stat.value === 4.9 ? (
                    <span>
                      <CountUp to={4} suffix="" />.9{stat.suffix}
                    </span>
                  ) : (
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{copy.whyTitle}</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">{copy.whySubtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {copy.why.map((item) => (
            <div key={item.title} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.teamTitle}</h2>
            <p className="text-slate-600 dark:text-slate-400">{copy.teamSubtitle}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {copy.team.map((person) => (
              <div key={person.name} className="text-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-800 overflow-hidden shadow-lg mx-auto mb-4">
                  <img
                    alt={person.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800&auto=format&fit=crop"
                  />
                </div>
                <h4 className="text-lg font-bold">{person.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{person.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">{copy.faqTitle}</h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="space-y-4">
          {copy.faqs.map((faq) => (
            <div key={faq.q} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="w-full px-6 py-5 flex items-center justify-between text-right font-bold text-lg">
                <span>{faq.q}</span>
              </div>
              <div className="px-6 pb-5 text-slate-600 dark:text-slate-400 border-t border-slate-50 dark:border-slate-700/50 pt-4">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
