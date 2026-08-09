import React from 'react';
import { useLang } from '../hooks/useLang';
import Seo from '../components/Seo';

const AboutPage: React.FC = () => {
  const { lang } = useLang();
  const copy = {
    badge: lang === 'ar' ? 'منهجية Best5 التحريرية' : 'The Best5 editorial method',
    title: lang === 'ar' ? 'نختار لك أفضل 5' : 'We pick the Best 5',
    titleAccent: lang === 'ar' ? 'في كل شيء' : 'for everything',
    intro:
      lang === 'ar'
        ? 'منصة Best5 تجمع خمسة خيارات بارزة في مجالات مثل المطاعم والأماكن والتعليم والسفر. نوضح معايير الاختيار وحدود المعلومات حتى تتمكن من المقارنة واتخاذ قرارك بنفسك.'
        : 'Best5 brings together five notable options across restaurants, places, education, travel, and more. We explain our selection criteria and information limits so you can compare and decide for yourself.',
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
            ? 'نحدد معايير مناسبة لكل موضوع، مثل الجودة والقيمة والموقع والخدمات، ونشرح الفروق التي تؤثر في القرار.'
            : 'We define criteria suited to each topic, such as quality, value, location, and services, and explain decision-relevant differences.'
      },
      {
        title: lang === 'ar' ? 'مصادر قابلة للمراجعة' : 'Reviewable sources',
        text:
          lang === 'ar'
            ? 'نفضّل المواقع الرسمية والمصادر المباشرة للمعلومات المتغيرة، ونطلب من القارئ التحقق قبل الحجز أو الشراء.'
            : 'We prefer official and first-party sources for changing details and ask readers to verify before booking or buying.'
      },
      {
        title: lang === 'ar' ? 'تحديثات مستمرة' : 'Always updated',
        text:
          lang === 'ar'
            ? 'نعرض تاريخ المراجعة عندما يكون متاحاً، ونراجع طلبات التصحيح والمصادر الأحدث لتحديث المعلومات.'
            : 'We show review dates when available and assess correction requests and newer sources to update information.'
      }
    ],
    trustTitle: lang === 'ar' ? 'كيف نعمل' : 'How we work',
    trust: [
      {
        title: lang === 'ar' ? 'منهجية الاختيار' : 'Selection methodology',
        text: lang === 'ar'
          ? 'نبدأ بتحديد سؤال المقال والجمهور المستهدف، ثم نجمع خيارات مناسبة ونقارنها بمعايير مرتبطة بالموضوع. نختصر النتيجة إلى خمس اختيارات مفيدة مع ذكر المزايا والقيود عندما تتوفر معلومات كافية.'
          : 'We begin with the article question and intended audience, gather suitable candidates, and compare them using topic-specific criteria. We narrow the result to five useful selections and explain strengths and limitations when sufficient information is available.'
      },
      {
        title: lang === 'ar' ? 'الاستقلال التحريري والإعلانات' : 'Editorial independence and advertising',
        text: lang === 'ar'
          ? 'الدفع لا يضمن الظهور في قائمة أو ترتيباً إيجابياً. نميز المحتوى المدعوم بوضوح، وتبقى القرارات التحريرية منفصلة عن الاتفاقات الإعلانية.'
          : 'Payment does not guarantee inclusion or a positive ranking. Sponsored content is clearly labelled, and editorial decisions remain separate from advertising arrangements.'
      },
      {
        title: lang === 'ar' ? 'التصحيحات والتحديثات' : 'Corrections and updates',
        text: lang === 'ar'
          ? 'يمكن الإبلاغ عن معلومة قديمة عبر صفحة التواصل مع رابط المقال ومصدر موثوق. نراجع الطلب، ونصحح المحتوى عند ثبوت المعلومة، ونحدّث تاريخ المراجعة عند إجراء مراجعة تحريرية جوهرية.'
          : 'Outdated information can be reported through the Contact page with the article URL and a reliable source. We review the request, correct verified information, and update the review date after a substantive editorial review.'
      },
      {
        title: lang === 'ar' ? 'المؤلفون ومعايير المصادر' : 'Authors and source standards',
        text: lang === 'ar'
          ? 'يظهر اسم المؤلف في المقال عندما يكون متاحاً. نعتمد قدر الإمكان على المواقع الرسمية والجهات المقدمة للخدمة والوثائق المباشرة، ونستخدم المصادر الثانوية للسياق لا لاستبدال المعلومات الأصلية.'
          : 'An author name is shown on the article when available. We prioritize official websites, service providers, and primary documents, using secondary sources for context rather than as a substitute for original information.'
      }
    ],
    faqTitle: lang === 'ar' ? 'أسئلة شائعة' : 'FAQ',
    faqs: [
      {
        q: lang === 'ar' ? 'كيف تختارون “أفضل 5”؟' : 'How do you choose the Best 5?',
        a:
          lang === 'ar'
            ? 'نحدد معايير مرتبطة بموضوع المقال، ونقارن الخيارات المتاحة، ثم نختار خمسة خيارات مع توضيح أسباب الاختيار وحدوده.'
            : 'We set criteria relevant to the topic, compare suitable candidates, and select five options while explaining the reasoning and its limits.'
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
    <>
      <Seo
        title={lang === 'ar' ? 'من نحن | Best5' : 'About us | Best5'}
        description={lang === 'ar'
          ? 'تعرف على Best5 ومنهجنا في البحث والمقارنة واختيار أفضل خمسة خيارات في كل مجال.'
          : 'Learn about Best5 and how we research, compare, and select the top five options in every category.'}
        canonical={`/${lang}/about`}
      />
      <div className="bg-background-light text-slate-900 transition-colors duration-300">
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
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-8 bg-primary rounded-full"></div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{copy.whyTitle}</h2>
            <p className="text-slate-600 mt-2">{copy.whySubtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {copy.why.map((item) => (
            <div key={item.title} className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{copy.trustTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {copy.trust.map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-100 bg-white p-8">
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-8">{item.text}</p>
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
            <div key={faq.q} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="w-full px-6 py-5 flex items-center justify-between text-right font-bold text-lg">
                <span>{faq.q}</span>
              </div>
              <div className="px-6 pb-5 text-slate-600 border-t border-slate-50 pt-4">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </>
  );
};

export default AboutPage;
