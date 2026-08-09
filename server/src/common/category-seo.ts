export type CategorySeoLanguage = 'ar' | 'en';

type CategorySeoInput = {
  name_ar?: string | null;
  name_en?: string | null;
  seo_title_ar?: string | null;
  seo_title_en?: string | null;
  seo_desc_ar?: string | null;
  seo_desc_en?: string | null;
  intro_ar?: string | null;
  intro_en?: string | null;
};

const clean = (value?: string | null) => String(value || '').trim();

export const categoryIntroWordCount = (value?: string | null) =>
  clean(value).split(/\s+/).filter(Boolean).length;

export const getCategorySeo = (category: CategorySeoInput, lang: CategorySeoLanguage) => {
  const name = clean(lang === 'ar' ? category.name_ar : category.name_en) || (lang === 'ar' ? 'الأدلة' : 'Guides');
  const customTitle = clean(lang === 'ar' ? category.seo_title_ar : category.seo_title_en);
  const customDescription = clean(lang === 'ar' ? category.seo_desc_ar : category.seo_desc_en);
  const customIntro = clean(lang === 'ar' ? category.intro_ar : category.intro_en);

  if (lang === 'ar') {
    return {
      title: customTitle || `أفضل 5 ${name}: أدلة ومقارنات موثوقة | Best5`,
      description: customDescription || `اكتشف أدلة Best5 المختارة ضمن ${name}، وقارن أفضل الخيارات والمعلومات العملية قبل أن تقرر.`,
      intro: customIntro || `يضم قسم ${name} في Best5 مجموعة من الأدلة والقوائم المختصرة التي تساعدك على فهم الخيارات المتاحة قبل اتخاذ قرارك. نركز في كل موضوع على خمسة خيارات بارزة، مع توضيح الفروق العملية بينها بدل الاكتفاء بترتيب سريع أو ادعاءات عامة. قد تشمل معايير المقارنة الجودة، الموقع، القيمة، سهولة الوصول، الخدمات، الملاءمة للعائلات، أو عوامل أخرى تختلف بحسب طبيعة الدليل. ننصحك بقراءة تفاصيل كل مقال ومراجعة التاريخ الموضح فيه، لأن الأسعار والمواعيد والتوفر والسياسات قد تتغير. كما يفضل التأكد مباشرة من الموقع الرسمي أو الجهة المعنية قبل الحجز أو الشراء أو السفر. استخدم الروابط أدناه للوصول إلى أحدث أدلة ${name}، ثم قارن المزايا والقيود بما يناسب احتياجاتك وميزانيتك. ويمكنك البدء بالمقال الأقرب إلى هدفك، ثم فتح الأدلة المرتبطة للحصول على صورة أوسع قبل الاختيار. اختيارات Best5 تحريرية وتهدف إلى تسهيل البحث، لكنها لا تعني أن خياراً واحداً سيكون الأفضل للجميع. إذا وجدت معلومة قديمة أو لديك مصدر أحدث، يمكنك إرسال التصحيح عبر صفحة التواصل لنراجعه ونحدث المحتوى عند الحاجة.`
    };
  }

  return {
    title: customTitle || `Best 5 ${name}: Practical Guides and Comparisons | Best5`,
    description: customDescription || `Explore selected Best5 ${name} guides, compare leading options, and review practical details before making your choice.`,
    intro: customIntro || `The Best5 ${name} section brings together focused guides designed to make a crowded search easier to understand. Each article concentrates on five notable options and explains practical differences instead of presenting a ranking without context. Depending on the subject, our comparison may consider quality, location, value, accessibility, available services, suitability for families, or other factors that matter to the specific decision. Read the details and review date shown on each guide, because prices, opening hours, availability, admission rules, and service policies can change. Before booking, buying, travelling, or making an important commitment, confirm the latest information with the official website or provider. Use the links below to explore current ${name} guides, compare strengths and limitations, and choose according to your own priorities and budget. Best5 selections are editorial shortcuts for research; they do not claim that one option is ideal for every reader. If you notice outdated information or have a reliable newer source, send a correction through our contact page so the editorial team can review it and update the relevant guide when appropriate.`
  };
};
