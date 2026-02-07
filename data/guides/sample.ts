import type { GuidePageData } from '../../types/guide';

export const sampleGuideAr: GuidePageData = {
  lang: 'ar',
  slug: 'best-burger-besiktas',
  title: 'أفضل 5 خيارات للمقارنة في هذا المجال',
  trustLine: 'مقارنة موضوعية – خيارات مختارة بعناية – محدثة باستمرار',
  description: 'دليل شامل يساعدك على اتخاذ القرار بثقة عبر مقارنة واضحة ومباشرة.',
  lastUpdated: '20 فبراير 2026',
  hero: {
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
    showSearch: true,
    searchPlaceholder: 'ابحث داخل الدليل...'
  },
  filterPills: [
    { key: 'all', label: 'الكل' },
    { key: 'best-value', label: 'أفضل قيمة' },
    { key: 'premium', label: 'فاخر' },
    { key: 'family', label: 'مناسب للعائلات' },
    { key: 'fast', label: 'خدمة سريعة' }
  ],
  quickPicks: [
    { label: 'الأفضل إجمالاً', title: 'الخيار المتوازن', note: 'مزيج قوي من الجودة والسعر', itemId: 'item-1' },
    { label: 'أفضل قيمة', title: 'سعر مقابل أداء', note: 'خيار اقتصادي عملي', itemId: 'item-2' },
    { label: 'أفضل تجربة', title: 'خدمة راقية', note: 'تجربة متكاملة', itemId: 'item-3' }
  ],
  table: {
    ctaLabel: 'زيارة الموقع'
  },
  items: [
    {
      id: 'item-1',
      rank: 1,
      name: 'علامة الخيار الأول',
      imageUrl:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
      score: { value: 4.9, label: 'تقييم الخبراء' },
      priceRangeText: 'متوسط',
      bestFor: 'أفضل توازن شامل',
      whyChosen: 'نتائج قوية عبر جميع المعايير مع تجربة متسقة.',
      pros: ['جودة ثابتة', 'قيمة ممتازة', 'واجهة سهلة'],
      cons: ['خيارات محدودة في بعض الأوقات'],
      highlights: [
        { label: 'السرعة', value: 'A' },
        { label: 'الدعم', value: 'A+' },
        { label: 'المرونة', value: 'B+' }
      ],
      localInfo: {
        address: 'عنوان تجريبي 1',
        area: 'المنطقة A',
        phone: '+90 555 123 4567',
        hours: '09:00 - 23:00',
        googleRatingText: '4.8/5 (1200+)'
      },
      links: {
        website: 'https://example.com',
        maps: 'https://maps.google.com'
      },
      tags: ['all', 'premium']
    },
    {
      id: 'item-2',
      rank: 2,
      name: 'خيار القيمة',
      imageUrl:
        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?q=80&w=1200&auto=format&fit=crop',
      score: { value: 4.6, label: 'تقييم الخبراء' },
      priceRangeText: 'اقتصادي',
      bestFor: 'أفضل قيمة مقابل السعر',
      whyChosen: 'خيار عملي لمن يريد نتائج قوية دون تكلفة عالية.',
      pros: ['سعر مناسب', 'نتائج موثوقة', 'سهولة البدء'],
      cons: ['خصائص متقدمة أقل'],
      highlights: [
        { label: 'القيمة', value: 'A+' },
        { label: 'البداية', value: 'A' },
        { label: 'المرونة', value: 'B' }
      ],
      localInfo: {
        address: 'عنوان تجريبي 2',
        area: 'المنطقة B',
        phone: '+90 555 777 1010',
        hours: '10:00 - 22:00',
        googleRatingText: '4.5/5 (800+)'
      },
      links: {
        website: 'https://example.com',
        maps: 'https://maps.google.com'
      },
      tags: ['all', 'best-value', 'fast']
    },
    {
      id: 'item-3',
      rank: 3,
      name: 'الخيار الراقي',
      imageUrl:
        'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=1200&auto=format&fit=crop',
      score: { value: 4.7, label: 'تقييم الخبراء' },
      priceRangeText: 'فاخر',
      bestFor: 'أفضل تجربة متكاملة',
      whyChosen: 'خدمة احترافية وتجربة مميزة للباحثين عن الجودة العالية.',
      pros: ['تجربة ممتازة', 'خدمة احترافية', 'تفاصيل دقيقة'],
      cons: ['سعر أعلى من المتوسط'],
      highlights: [
        { label: 'التجربة', value: 'A+' },
        { label: 'التفاصيل', value: 'A' },
        { label: 'التميز', value: 'A' }
      ],
      localInfo: {
        address: 'عنوان تجريبي 3',
        area: 'المنطقة C',
        phone: '+90 555 222 3333',
        hours: '12:00 - 01:00',
        googleRatingText: '4.9/5 (600+)'
      },
      links: {
        website: 'https://example.com',
        maps: 'https://maps.google.com'
      },
      tags: ['all', 'premium']
    }
  ],
  buyingGuide: {
    heading: 'دليل الاختيار السريع',
    bullets: [
      'حدد أولويتك: قيمة أم جودة أم سرعة.',
      'راجع نقاط القوة والضعف قبل القرار.',
      'ضع احتياجك المحلي في الحسبان.'
    ],
    note: 'يمكن تعديل الدليل بسهولة لأي فئة أخرى عبر ملف البيانات.'
  },
  faq: [
    { q: 'كيف نختار القائمة؟', a: 'نعتمد على معايير واضحة وأداء قابل للمقارنة.' },
    { q: 'هل الترتيب ثابت؟', a: 'يتم تحديث الترتيب عند توفر معلومات جديدة.' }
  ]
};

export const sampleGuideEn: GuidePageData = {
  lang: 'en',
  slug: 'best-burger-besiktas',
  title: 'Top 5 Options in This Category',
  trustLine: 'Objective comparison – Curated picks – Updated regularly',
  description: 'A practical guide to help you make confident decisions with clear comparisons.',
  lastUpdated: 'February 20, 2026',
  hero: {
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
    showSearch: true,
    searchPlaceholder: 'Search inside this guide...'
  },
  filterPills: [
    { key: 'all', label: 'All' },
    { key: 'best-value', label: 'Best Value' },
    { key: 'premium', label: 'Premium' },
    { key: 'family', label: 'Family' },
    { key: 'fast', label: 'Fast' }
  ],
  quickPicks: [
    { label: 'Best Overall', title: 'Balanced pick', note: 'Strong mix of quality and price', itemId: 'item-1' },
    { label: 'Best Value', title: 'Price to performance', note: 'Budget-friendly choice', itemId: 'item-2' },
    { label: 'Best Experience', title: 'Premium service', note: 'High-end experience', itemId: 'item-3' }
  ],
  table: {
    ctaLabel: 'Visit Website'
  },
  items: [
    {
      id: 'item-1',
      rank: 1,
      name: 'Top Choice Brand',
      imageUrl:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
      score: { value: 4.9, label: 'Expert score' },
      priceRangeText: 'Mid-range',
      bestFor: 'Best overall balance',
      whyChosen: 'Strong results across all criteria with consistent delivery.',
      pros: ['Consistent quality', 'Great value', 'Easy to use'],
      cons: ['Limited advanced options'],
      highlights: [
        { label: 'Speed', value: 'A' },
        { label: 'Support', value: 'A+' },
        { label: 'Flexibility', value: 'B+' }
      ],
      localInfo: {
        address: 'Sample address 1',
        area: 'Area A',
        phone: '+90 555 123 4567',
        hours: '09:00 - 23:00',
        googleRatingText: '4.8/5 (1200+)'
      },
      links: {
        website: 'https://example.com',
        maps: 'https://maps.google.com'
      },
      tags: ['all', 'premium']
    },
    {
      id: 'item-2',
      rank: 2,
      name: 'Value Pick',
      imageUrl:
        'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?q=80&w=1200&auto=format&fit=crop',
      score: { value: 4.6, label: 'Expert score' },
      priceRangeText: 'Budget',
      bestFor: 'Best value for money',
      whyChosen: 'A practical option for dependable results without a high price.',
      pros: ['Affordable', 'Reliable', 'Easy onboarding'],
      cons: ['Fewer advanced features'],
      highlights: [
        { label: 'Value', value: 'A+' },
        { label: 'Onboarding', value: 'A' },
        { label: 'Flexibility', value: 'B' }
      ],
      localInfo: {
        address: 'Sample address 2',
        area: 'Area B',
        phone: '+90 555 777 1010',
        hours: '10:00 - 22:00',
        googleRatingText: '4.5/5 (800+)'
      },
      links: {
        website: 'https://example.com',
        maps: 'https://maps.google.com'
      },
      tags: ['all', 'best-value', 'fast']
    },
    {
      id: 'item-3',
      rank: 3,
      name: 'Premium Choice',
      imageUrl:
        'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=1200&auto=format&fit=crop',
      score: { value: 4.7, label: 'Expert score' },
      priceRangeText: 'Premium',
      bestFor: 'Best complete experience',
      whyChosen: 'Professional service and refined experience for quality seekers.',
      pros: ['Excellent experience', 'Professional service', 'High attention to detail'],
      cons: ['Higher price point'],
      highlights: [
        { label: 'Experience', value: 'A+' },
        { label: 'Detail', value: 'A' },
        { label: 'Quality', value: 'A' }
      ],
      localInfo: {
        address: 'Sample address 3',
        area: 'Area C',
        phone: '+90 555 222 3333',
        hours: '12:00 - 01:00',
        googleRatingText: '4.9/5 (600+)'
      },
      links: {
        website: 'https://example.com',
        maps: 'https://maps.google.com'
      },
      tags: ['all', 'premium']
    }
  ],
  buyingGuide: {
    heading: 'Quick Buying Guide',
    bullets: ['Decide your priority: value, quality, or speed.', 'Review pros and cons carefully.', 'Match to your local needs.'],
    note: 'This template can be reused by editing only the data file.'
  },
  faq: [
    { q: 'How do we choose the list?', a: 'We use clear criteria and comparable performance signals.' },
    { q: 'Is the ranking fixed?', a: 'Rankings are updated as new information becomes available.' }
  ]
};
