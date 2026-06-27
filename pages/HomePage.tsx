import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock3,
  GraduationCap,
  Home,
  Hotel,
  Landmark,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Sparkles,
  Star,
  Trophy,
  Utensils,
  Users
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '../hooks/useLang';
import { fetchPopularPosts, fetchPublicCategories, fetchPublicPosts, fetchPublicSettings, fetchPublicTags } from '../services/api';
import SearchSuggestions from '../components/SearchSuggestions';
import Seo from '../components/Seo';

type CityTag = {
  id: string;
  name_ar: string;
  name_en: string;
  slug_ar: string;
  slug_en: string;
};

type PublicCategory = {
  id: string;
  name_ar: string;
  name_en: string;
  slug_ar: string;
  slug_en: string;
  icon?: string | null;
};

type HomeSettings = {
  editorPickPostIds?: string[];
};

const images = {
  istanbul:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuASCMXVa4XbxY8FRU-L4WBBf5nfd0RtIRa4y6NtCSHD74L6Hy5AMM-IDnC3UOjJvm66CPQ9zFuDSXGCyglztglP8dPWziqItqbpg0MfSCXzv_h8nlWLF3zFVLKdgZX-WxN-HkfGI1CrgNwEnrmKLHVi-ZsggATxQIWiW4C9KZ_L1U7O1gWR6sbm3Rt6LmkK0cfmXiocjP_OVn3pjNl-yk6y-0v1aeJs-h9dD9QYeNMxQm8WEtsgySr6we-M5Hophm8MfLJBkZB5PoI',
  food:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCzWdKfiT_Aq7DfNfbfdxRmyCF_o8MoT7k4dnKGvRR2YIpXK3rbevHfUXN2yadFCxA4PXZ4uxQIqZgZQlyQOB-79fTk7YUoGhHO1GcGb9it8BUUbfuewwzOuptOOYg_OZDghLvKjZ0TORiUDk4RwquKDePrXZov-a-Vm0sRujIHGrEPOF6bhOWBam9xu_CmERzA5v7Hxf5otC2HaWbKwnpm2XckpaAGT_JUJugAQJFHLfYdI_wQ-us1SkuPCROIlO-YgVdJbGGaJaY',
  coast:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDHpPM_jxMOZ-pDCgzfKF_Kc1WLmT5tkiTXcWJ8VLdGkfZOV7wCz1xrz_gzSYJnxpUTjXGp2bsZfpXbCll6vla4tMj9m963mPS7nGNDTOOdo50BbpFUYGaBITSZ96mAr5G-Bxbq9tw4As6JFIV3cf_SANzAcMHr5T0KR48qMZplKONxB4jCK0XO7tiiw-lNm8cpyCIIPJHxxS7w_PxS8C4xEPFagV9GbGUwFxfgY9yhHGhjT_gD_g4Y2aEsvfRgn1CVN8vZSMe6oE0',
  hotel:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDEASA1QKamQNp3IyFnxya-nKfv7SkNplu9LNg_RaehN2bdKm-AxABMIgY444ugBycysqZArhm1k1jKS5th-YTNzv6QFykmn1dL23bUcdVEf_Kd6sKH79BCjAl--bmD89RmgJmZW7WrjRCrbKf5mrD1S-E3LOJd8motzjxC9rM7RJiOzCS_t3mKsE8I25qdGhzssBnZ2HIWTdRTFLzJEIaqyhCF8jvPU8-XnV6yor8PybyLtg0jHeVCus0uKOucaDDpR2LVK0E16XI',
  map:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDxORYgr2fJW90jUtKjph1QQEfhuLVuSD8E7fZxD4ePqNfjcn-_QRbfpcIu89xDTjkIhN-YUsQ9fYNHIreKOCdP2GrHCZSWcuRY5KarYx1eY2RA5V4URzz_hGmqEmdOe8f0iN-ylj866kU-0_N3a2bGCrHtTjZV8DnIwUid0vNmZKVNr7sl0BMhiVNDnKxuBfR6GugqFiTQCB1YxSwn7XSId_q97AC20IhXK61mf7gk06FKPg8KXyXx8oz6p62SN_OjT_gXqJMTZ_A',
  office:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAl1xndH6C-GwWyx7paN20nWfdqYqhO_V8IULn6eK4W2qvLSpWMvZRbvLD76orSvQamrJ4yCy3xNveBkonKx9dPQreXu4meop6IpOW21hVrh1F-rhn_iOhVIN6jx7YGCitnLKSthcqvAwMujS_5usP7kKDpgwZgkqwk7zKjSZVFK07IVmrrIhWD0C4rmDr_J2QXc1hw4rWzEltNjqNn55H_CQmpsx6EdF32PW0X_-z-8Fm-zRxrOpKTEutP7vW1uFUDCqksz6u7oE4',
  spa:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBIVa8iRht3LrX8s9_YM8zEhHNgPXI0shRWVIoKO1IdCPxBaAl6MJWxv-fY-8fVjyDwm6h2i2cavv86MgOXoBoQfXzWWx-ZtxeOuUS3MQtfdlEBEqHgmuwiap6GEQS4SAE8PLQgR1rslg84uu0OgjdpVcMe7qXo1KKgU7ZRXKBVrIFzsxhTHFs2OtNqFhiKB2CdPgziHv2fJGAt1EYbnPBizltrxM3QfK9fDBwDd3PS47Lf_sbn1y9py71K7i4OzKelGHsfvzxThYw',
  charger:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCTVmj5xF5SaFBC9Dh8L1WsOpOMVxj7AdwISSgoRNqgLToGysMkjeT0v7xuHDhVrKDWBQqARKx5UoPEmGhofjdU8PABD8_Nztn4SaoKyt6kp7Ar-7kkyK0wBLa991-PdARDowOnfJHVFEtV-YY3IjqsMuU14lzDlXBXEJMqQHPEJeMnJ-luvvHaPFt4XQprnoA5NY4XVGtwB-ejfjwV82BnmDII_PIGwFy_vChidG8PzlZuDMsgHIT3nItVZI0S1OCLQHtF1K8hRPI'
};

const fallbackCategoryCards = [
  {
    title_ar: 'مطاعم وكافيهات',
    title_en: 'Restaurants & Cafes',
    example_ar: 'أفضل 5 مطاعم فطور في إسطنبول',
    example_en: 'Best 5 breakfast spots in Istanbul',
    count_ar: '42 دليل',
    count_en: '42 guides',
    icon: Utensils
  },
  {
    title_ar: 'جامعات وتعليم',
    title_en: 'Universities & Education',
    example_ar: 'أفضل 5 جامعات خاصة في تركيا',
    example_en: 'Best 5 private universities in Turkey',
    count_ar: '18 دليل',
    count_en: '18 guides',
    icon: GraduationCap
  },
  {
    title_ar: 'سياحة وأماكن',
    title_en: 'Travel & Places',
    example_ar: 'أفضل 5 أماكن للعائلات في أنطاليا',
    example_en: 'Best 5 family places in Antalya',
    count_ar: '35 دليل',
    count_en: '35 guides',
    icon: Plane
  },
  {
    title_ar: 'سكن ومعيشة',
    title_en: 'Living & Housing',
    example_ar: 'أفضل 5 مناطق للسكن في إسطنبول',
    example_en: 'Best 5 neighborhoods to live in Istanbul',
    count_ar: '21 دليل',
    count_en: '21 guides',
    icon: Home
  },
  {
    title_ar: 'تسوق وخدمات',
    title_en: 'Shopping & Services',
    example_ar: 'أفضل 5 مولات في أنقرة',
    example_en: 'Best 5 malls in Ankara',
    count_ar: '27 دليل',
    count_en: '27 guides',
    icon: ShoppingBag
  },
  {
    title_ar: 'للعرب في تركيا',
    title_en: 'For Arabs in Turkey',
    example_ar: 'أفضل 5 خدمات يحتاجها العرب',
    example_en: 'Best 5 services Arabs need in Turkey',
    count_ar: '16 دليل',
    count_en: '16 guides',
    icon: Users
  }
];

const normalizeTaxonomy = (value = '') =>
  value
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const categoryIcon = (category: Partial<PublicCategory>) => {
  const key = normalizeTaxonomy(`${category.icon || ''} ${category.name_ar || ''} ${category.name_en || ''}`);
  if (key.includes('hotel') || key.includes('فندق')) return Hotel;
  if (key.includes('restaurant') || key.includes('restorant') || key.includes('utensil') || key.includes('مطاعم')) return Utensils;
  if (key.includes('university') || key.includes('graduation') || key.includes('جامع')) return GraduationCap;
  if (key.includes('store') || key.includes('shop') || key.includes('متجر') || key.includes('متاجر')) return Store;
  if (key.includes('museum') || key.includes('musem') || key.includes('pyramid') || key.includes('متحف') || key.includes('متاحف')) return Landmark;
  if (key.includes('place') || key.includes('map') || key.includes('مكان') || key.includes('اماكن')) return MapPin;
  if (key.includes('travel') || key.includes('tour') || key.includes('سياح')) return Plane;
  if (key.includes('living') || key.includes('home') || key.includes('سكن')) return Home;
  if (key.includes('service') || key.includes('خدم')) return ShoppingBag;
  return Building2;
};

const fallbackArticles = [
  {
    title_ar: 'أفضل 5 مطاعم مطلة على البوسفور',
    title_en: 'Best 5 Bosphorus View Restaurants',
    excerpt_ar: 'قائمة مختصرة لأماكن تجمع بين المنظر، الخدمة، والقيمة مقابل السعر.',
    excerpt_en: 'A short list balancing view, service, and value.',
    slug_ar: 'best-5-bosphorus-restaurants',
    slug_en: 'best-5-bosphorus-restaurants',
    cover_image_url: images.hotel,
    category: { name_ar: 'مطاعم', name_en: 'Restaurants' },
    city: 'إسطنبول',
    city_en: 'Istanbul'
  },
  {
    title_ar: 'أفضل 5 جامعات خاصة في إسطنبول',
    title_en: 'Best 5 Private Universities in Istanbul',
    excerpt_ar: 'مقارنة عملية للطلاب حسب التخصصات، الموقع، والاعتراف.',
    excerpt_en: 'A practical student comparison by majors, location, and recognition.',
    slug_ar: 'best-5-private-universities-istanbul',
    slug_en: 'best-5-private-universities-istanbul',
    cover_image_url: images.office,
    category: { name_ar: 'تعليم', name_en: 'Education' },
    city: 'إسطنبول',
    city_en: 'Istanbul'
  },
  {
    title_ar: 'أفضل 5 أماكن سياحية في أنطاليا',
    title_en: 'Best 5 Places to Visit in Antalya',
    excerpt_ar: 'خيارات تناسب الرحلة الأولى والعائلات ومحبي البحر.',
    excerpt_en: 'Options for first-time visitors, families, and beach lovers.',
    slug_ar: 'best-5-antalya-places',
    slug_en: 'best-5-antalya-places',
    cover_image_url: images.coast,
    category: { name_ar: 'سياحة', name_en: 'Travel' },
    city: 'أنطاليا',
    city_en: 'Antalya'
  },
  {
    title_ar: 'أفضل 5 حمامات عثمانية في تركيا',
    title_en: 'Best 5 Turkish Hammams',
    excerpt_ar: 'تجارب استرخاء أصيلة مع تقييم النظافة والخدمة والموقع.',
    excerpt_en: 'Authentic relaxation picks rated by cleanliness, service, and location.',
    slug_ar: 'best-5-turkish-hammams',
    slug_en: 'best-5-turkish-hammams',
    cover_image_url: images.spa,
    category: { name_ar: 'تجارب', name_en: 'Experiences' },
    city: 'تركيا',
    city_en: 'Turkey'
  },
  {
    title_ar: 'أفضل 5 كافيهات للعمل والدراسة في إسطنبول',
    title_en: 'Best 5 Cafes to Work or Study in Istanbul',
    excerpt_ar: 'أماكن هادئة ومريحة مع إنترنت جيد وأجواء مناسبة للتركيز.',
    excerpt_en: 'Quiet, comfortable places with good internet and focus-friendly atmosphere.',
    slug_ar: 'best-5-work-study-cafes-istanbul',
    slug_en: 'best-5-work-study-cafes-istanbul',
    cover_image_url: images.food,
    category: { name_ar: 'كافيهات', name_en: 'Cafes' },
    city: 'إسطنبول',
    city_en: 'Istanbul'
  }
];

const defaultCityTags: CityTag[] = [
  { id: 'istanbul', name_ar: 'اسطنبول', name_en: 'Istanbul', slug_ar: 'istanbul', slug_en: 'istanbul' },
  { id: 'ankara', name_ar: 'أنقرة', name_en: 'Ankara', slug_ar: 'ankara', slug_en: 'ankara' },
  { id: 'izmir', name_ar: 'إزمير', name_en: 'Izmir', slug_ar: 'izmir', slug_en: 'izmir' },
  { id: 'antalya', name_ar: 'انطاليا', name_en: 'Antalya', slug_ar: 'antalya', slug_en: 'antalya' },
  { id: 'bursa', name_ar: 'بورصة', name_en: 'Bursa', slug_ar: 'bursa', slug_en: 'bursa' },
  { id: 'trabzon', name_ar: 'طرابزون', name_en: 'Trabzon', slug_ar: 'trabzon', slug_en: 'trabzon' }
];

const cityNameOrder = [
  'اسطنبول',
  'istanbul',
  'انقرة',
  'ankara',
  'ازمير',
  'izmir',
  'انطاليا',
  'antalya',
  'بورصة',
  'bursa',
  'طرابزون',
  'trabzon',
  'غازي عنتاب',
  'gaziantep',
  'قونية',
  'konya',
  'قيصري',
  'kayseri',
  'سامسون',
  'samsun',
  'مرسين',
  'mersin',
  'اضنة',
  'adana',
  'اسكي شهير',
  'eskisehir',
  'موغلا',
  'mugla',
  'كوجالي',
  'kocaeli',
  'صقاريا',
  'sakarya'
];

const cityNameIndex = new Map(cityNameOrder.map((name, index) => [name, index]));
const allowedCityNames = new Set(cityNameOrder);

const normalizeCityName = (value = '') =>
  value
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const isCityTag = (tag: Partial<CityTag>) => {
  const names = [tag.name_ar, tag.name_en, tag.slug_ar, tag.slug_en].map((value) => normalizeCityName(value || ''));
  return names.some((name) => allowedCityNames.has(name));
};

const sortCityTags = (tags: CityTag[]) =>
  [...tags].sort((a, b) => {
    const aIndex = cityNameIndex.get(normalizeCityName(a.name_ar)) ?? cityNameIndex.get(normalizeCityName(a.name_en)) ?? 999;
    const bIndex = cityNameIndex.get(normalizeCityName(b.name_ar)) ?? cityNameIndex.get(normalizeCityName(b.name_en)) ?? 999;
    return aIndex - bIndex;
  });

const uniqueCityTags = (tags: CityTag[]) => {
  const seen = new Set<string>();
  return tags.filter((tag) => {
    const key = normalizeCityName(tag.name_en || tag.name_ar);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const cityArticleTitles = (city: string, lang: 'ar' | 'en') =>
  lang === 'ar'
    ? [`أفضل 5 مطاعم في ${city}`, `أفضل 5 أماكن للزيارة في ${city}`, `أفضل 5 تجارب في ${city}`]
    : [`Best 5 restaurants in ${city}`, `Best 5 places to visit in ${city}`, `Best 5 experiences in ${city}`];

const HomePage: React.FC = () => {
  const { lang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const isArabic = lang === 'ar';
  const [query, setQuery] = useState('');
  const [cityTags, setCityTags] = useState<CityTag[]>(defaultCityTags);
  const [selectedCity, setSelectedCity] = useState(defaultCityTags[0].name_ar);
  const [posts, setPosts] = useState<any[]>([]);
  const [homeSettings, setHomeSettings] = useState<HomeSettings>({});
  const [homeCategories, setHomeCategories] = useState<PublicCategory[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [heroIndex, setHeroIndex] = useState(0);
  const [dismissedHeroCards, setDismissedHeroCards] = useState<Set<number>>(() => new Set());
  const [heroDrag, setHeroDrag] = useState({ x: 0, y: 0, active: false, exiting: false });
  const dragStart = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const draggedDistance = useRef(0);
  const heroExitTimer = useRef<number | null>(null);

  useEffect(() => {
    fetchPublicSettings()
      .then((data: any) => setHomeSettings(data?.home_json || {}))
      .catch(() => setHomeSettings({}));
  }, []);

  useEffect(() => {
    Promise.allSettled([fetchPopularPosts(lang, 7, 24), fetchPublicPosts(lang)])
      .then(([popularResult, publicResult]) => {
        const popularPosts = popularResult.status === 'fulfilled' && Array.isArray(popularResult.value) ? popularResult.value : [];
        const publicPosts = publicResult.status === 'fulfilled' && Array.isArray(publicResult.value) ? publicResult.value : [];
        const mergedPosts = [...popularPosts, ...publicPosts];
        setPosts(mergedPosts.length ? mergedPosts : fallbackArticles);
      })
      .catch(() => setPosts(fallbackArticles));
  }, [lang]);

  useEffect(() => {
    fetchPublicTags()
      .then((data) => {
        const next = uniqueCityTags(sortCityTags((Array.isArray(data) ? data : []).filter(isCityTag) as CityTag[]));
        if (!next.length) return;
        setCityTags(next);
        setSelectedCity((current) => {
          const exists = next.some((tag) => tag.name_ar === current || tag.name_en === current);
          return exists ? current : next[0].name_ar;
        });
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    Promise.all([fetchPublicCategories(), fetchPublicPosts(lang)])
      .then(([categoryData, postData]) => {
        const nextCategories = Array.isArray(categoryData) ? (categoryData as PublicCategory[]) : [];
        const nextPosts = Array.isArray(postData) ? postData : [];
        const counts: Record<string, number> = {};

        nextPosts.forEach((post: any) => {
          const category = post.category || {};
          const keys = [post.category_id, category.id, category.slug_ar, category.slug_en, category.name_ar, category.name_en].filter(Boolean);
          keys.forEach((key) => {
            counts[String(key)] = (counts[String(key)] || 0) + 1;
          });
        });

        if (nextCategories.length) setHomeCategories(nextCategories);
        setCategoryCounts(counts);
      })
      .catch(() => undefined);
  }, [lang]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-home-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('home-reveal-visible');
          }
        });
      },
      { threshold: 0.16 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }, [location.hash]);

  const allArticles = useMemo(() => {
    const source = [...posts, ...fallbackArticles];
    const seen = new Set<string>();
    return source.filter((post: any) => {
      const key = post.id || post.slug_ar || post.slug_en || post.title_ar || post.title_en;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 100);
  }, [posts]);
  const articles = useMemo(() => allArticles.slice(0, 5), [allArticles]);

  const categoryCards = useMemo(() => {
    if (!homeCategories.length) return fallbackCategoryCards;

    return homeCategories.map((category) => {
      const count =
        categoryCounts[category.id] ||
        categoryCounts[category.slug_ar] ||
        categoryCounts[category.slug_en] ||
        categoryCounts[category.name_ar] ||
        categoryCounts[category.name_en] ||
        0;

      return {
        id: category.id,
        title_ar: category.name_ar,
        title_en: category.name_en,
        example_ar: count > 0 ? 'مقالات وقوائم منشورة ضمن هذا القسم' : 'قوائم أفضل 5 ضمن هذا القسم',
        example_en: count > 0 ? 'Published Best 5 guides in this category' : 'Best 5 lists in this category',
        count_ar: `${count} ${count === 1 ? 'دليل' : 'دليل'}`,
        count_en: `${count} ${count === 1 ? 'guide' : 'guides'}`,
        slug_ar: category.slug_ar,
        slug_en: category.slug_en,
        icon: categoryIcon(category)
      };
    });
  }, [categoryCounts, homeCategories]);

  const articleMeta = (post: any) => {
    const slug = (lang === 'ar' ? post.slug_ar : post.slug_en) || post.slug_en || post.slug_ar || '#';
    const title = (lang === 'ar' ? post.title_ar : post.title_en) || post.title_ar || post.title_en;
    const excerpt = (lang === 'ar' ? post.excerpt_ar : post.excerpt_en) || post.excerpt_ar || post.excerpt_en || '';
    const category = (lang === 'ar' ? post?.category?.name_ar : post?.category?.name_en) || post?.category?.name_ar || 'Best 5';
    const cover = post.cover_image_url || images.istanbul;
    const href = post.id ? `/${lang}/blog/${slug}` : `/${lang}/search?q=${encodeURIComponent(title || '')}`;
    const city = (isArabic ? post.city || post.city_ar : post.city_en || post.city) || (isArabic ? 'تركيا' : 'Turkey');
    return { slug, title, excerpt, category, cover, city, href };
  };

  const heroCards = useMemo(() => allArticles.map((post, index) => ({ ...articleMeta(post), views: post.views, originalIndex: index })), [allArticles, lang]);
  const visibleHeroCards = useMemo(() => heroCards.filter((card) => !dismissedHeroCards.has(card.originalIndex)), [dismissedHeroCards, heroCards]);
  const activeHeroIndex = visibleHeroCards.some((card) => card.originalIndex === heroIndex)
    ? heroIndex
    : visibleHeroCards[0]?.originalIndex ?? 0;

  useEffect(() => {
    setHeroIndex(0);
    setDismissedHeroCards(new Set());
  }, [heroCards.length, lang]);

  useEffect(
    () => () => {
      if (heroExitTimer.current) window.clearTimeout(heroExitTimer.current);
    },
    []
  );

  const dismissHeroCard = () => {
    if (!visibleHeroCards.length) return;
    const activeVisibleIndex = visibleHeroCards.findIndex((card) => card.originalIndex === activeHeroIndex);
    const nextCard = visibleHeroCards[activeVisibleIndex + 1] || visibleHeroCards[activeVisibleIndex - 1];

    setHeroDrag({ x: 0, y: 0, active: false, exiting: false });
    setDismissedHeroCards((current) => {
      const next = new Set(current);
      next.add(activeHeroIndex);
      return next;
    });
    if (nextCard) {
      setHeroIndex(nextCard.originalIndex);
    }
  };

  const startHeroExit = (x: number, y: number) => {
    if (heroDrag.exiting) return;
    const direction = x >= 0 ? 1 : -1;

    dragStart.current = null;
    setHeroDrag({ x: direction * 760, y: y + 44, active: false, exiting: true });
    if (heroExitTimer.current) window.clearTimeout(heroExitTimer.current);
    heroExitTimer.current = window.setTimeout(() => {
      heroExitTimer.current = null;
      dismissHeroCard();
    }, 380);
  };

  const handleHeroPointerDown = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (heroDrag.exiting) return;
    event.preventDefault();
    dragStart.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    draggedDistance.current = 0;
    setHeroDrag((current) => ({ ...current, active: true }));
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (heroDrag.exiting) return;
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return;
    event.preventDefault();
    const x = event.clientX - dragStart.current.x;
    const y = event.clientY - dragStart.current.y;
    draggedDistance.current = Math.max(draggedDistance.current, Math.hypot(x, y));
    setHeroDrag({ x, y, active: true });
    if (Math.abs(x) > 46 && Math.abs(x) > Math.abs(y) * 0.7) {
      startHeroExit(x, y);
    }
  };

  const handleHeroPointerUp = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return;
    const x = event.clientX - dragStart.current.x;
    const y = event.clientY - dragStart.current.y;
    dragStart.current = null;
    if (Math.abs(x) > 46 && Math.abs(x) > Math.abs(y) * 0.7) {
      startHeroExit(x, y);
      return;
    }
    setHeroDrag({ x: 0, y: 0, active: false, exiting: false });
  };

  const handleHeroPointerCancel = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return;
    dragStart.current = null;
    setHeroDrag({ x: 0, y: 0, active: false, exiting: false });
  };

  const handleHeroClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (draggedDistance.current > 8) {
      event.preventDefault();
      draggedDistance.current = 0;
    }
  };

  const selectedCityTag = cityTags.find((tag) => selectedCity === tag.name_ar || selectedCity === tag.name_en);
  const selectedCityName = isArabic
    ? selectedCityTag?.name_ar || selectedCity
    : selectedCityTag?.name_en || selectedCityTag?.name_ar || selectedCity;

  const searchChips = isArabic
    ? ['مطاعم في إسطنبول', 'جامعات خاصة', 'أماكن للعائلات', 'كافيهات في بشكتاش']
    : ['Restaurants in Istanbul', 'Private universities', 'Family places', 'Cafes in Besiktas'];

  const editorPickPosts = useMemo(() => {
    const selectedIds = Array.isArray(homeSettings.editorPickPostIds) ? homeSettings.editorPickPostIds.filter(Boolean) : [];
    const selectedPosts = selectedIds
      .map((id) =>
        allArticles.find(
          (post: any) => String(post.id) === String(id) || post.slug_ar === id || post.slug_en === id
        )
      )
      .filter(Boolean);

    return (selectedPosts.length ? selectedPosts : allArticles).slice(0, 3);
  }, [allArticles, homeSettings.editorPickPostIds]);

  const methodItems = isArabic    ? [
        [Trophy, 'التقييمات'],
        [ShieldCheck, 'التجربة'],
        [Building2, 'السعر والقيمة'],
        [MapPin, 'الموقع'],
        [Clock3, 'التحديث المستمر']
      ]
    : [
        [Trophy, 'Ratings'],
        [ShieldCheck, 'Experience'],
        [Building2, 'Price & value'],
        [MapPin, 'Location'],
        [Clock3, 'Regular updates']
      ];

  const submitSearch = (value = query, href?: string) => {
    const clean = value.trim();
    if (!clean) return;
    if (href) {
      navigate(href);
      return;
    }
    navigate(`/${lang}/search?q=${encodeURIComponent(clean)}`);
  };

  return (
    <div
      className="best5-home overflow-hidden bg-[#fbf7f2] text-[#151515]"
      dir={isArabic ? 'rtl' : 'ltr'}
      onMouseMove={(event) => {
        const x = (event.clientX - window.innerWidth / 2) / 55;
        const y = (event.clientY - window.innerHeight / 2) / 65;
        setTilt({ x, y });
      }}
    >
      <Seo title={isArabic ? 'أفضل 5 | دليلك الشامل' : 'Best 5 | Your Complete Guide'} canonical={`/${lang}`} />
      <section className="relative min-h-[calc(100vh-76px)] px-4 py-12 md:px-8 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(177,18,38,0.12),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(217,154,36,0.18),transparent_24%)]" />
        <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-l from-transparent via-[#b11226]/20 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="pt-8" data-home-reveal>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e8e1db] bg-white/80 px-4 py-2 text-sm font-bold text-[#b11226] shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#d99a24]" />
              {isArabic ? 'منصة تصنيفات ذكية ومحدثة' : 'Smart, updated ranking guides'}
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-normal text-[#151515] md:text-7xl">
              {isArabic ? 'أفضل 5 اختيارات' : 'Best 5 Picks'}
              <span className="block text-[#b11226]">{isArabic ? 'في تركيا' : 'Across Turkey'}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-[#5f6368] md:text-xl">
              {isArabic
                ? 'قوائم قصيرة، مرتبة، وسهلة المقارنة تساعدك تختار بسرعة: مطاعم، جامعات، أماكن، خدمات وتجارب.'
                : 'Short ranked guides that help you choose faster: restaurants, universities, places, services, and experiences.'}
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              className="relative mt-8 max-w-2xl rounded-2xl border border-[#e8e1db] bg-white p-2 shadow-[0_24px_70px_rgba(177,18,38,0.14)] transition focus-within:-translate-y-1 focus-within:shadow-[0_34px_90px_rgba(177,18,38,0.22)]"
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Search className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-[#b11226] ${isArabic ? 'right-4' : 'left-4'}`} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className={`h-14 w-full rounded-xl border-0 bg-[#fbf7f2] text-base font-semibold text-[#151515] placeholder:text-[#8a8f98] focus:ring-2 focus:ring-[#b11226] ${
                      isArabic ? 'pr-12 text-right' : 'pl-12 text-left'
                    }`}
                    placeholder={isArabic ? 'ابحث عن أفضل 5...' : 'Search for Best 5...'}
                  />
                </div>
                <button className="h-14 rounded-xl bg-[#b11226] px-8 font-black text-white transition hover:bg-[#7a0f1d] active:scale-[0.98]">
                  {isArabic ? 'بحث' : 'Search'}
                </button>
              </div>
              <SearchSuggestions lang={lang} query={query} onPick={submitSearch} />
            </form>

            <div className="mt-5 flex max-w-2xl flex-wrap gap-2">
              {searchChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => submitSearch(chip)}
                  className="rounded-full border border-[#e8e1db] bg-white px-4 py-2 text-sm font-bold text-[#5f6368] transition hover:-translate-y-0.5 hover:border-[#b11226] hover:text-[#b11226]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[460px] lg:min-h-[560px]" data-home-reveal>
            <div
              className="best5-stack best5-visit-stack absolute inset-0 flex items-center justify-center"
              style={{ transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0)` }}
            >
              <div className={`absolute top-7 z-40 rounded-full border border-[#e8e1db] bg-white/90 px-4 py-2 text-xs font-black text-[#b11226] shadow-lg backdrop-blur ${isArabic ? 'right-10' : 'left-10'}`}>
                {isArabic ? 'الأكثر زيارة' : 'Most Visited'}
              </div>
              {visibleHeroCards.map((card, index) => {
                const activeVisibleIndex = visibleHeroCards.findIndex((item) => item.originalIndex === activeHeroIndex);
                const offset = index - activeVisibleIndex;
                const hidden = Math.abs(offset) > 2;
                const active = card.originalIndex === activeHeroIndex;
                const side = isArabic ? -1 : 1;
                const x = offset * 48 * side + (active ? heroDrag.x : 0);
                const y = Math.abs(offset) * 38 - offset * 10 + (active ? heroDrag.y : 0);
                const rotate = offset * -7 + (active ? heroDrag.x / 18 : 0);
                const scale = active ? 1.06 : 1 - Math.abs(offset) * 0.07;
                const dragProgress = active ? Math.min(Math.abs(heroDrag.x) / 140, 1) : 0;
                const opacity = hidden ? 0 : active && heroDrag.exiting ? 0 : active ? 1 - dragProgress * 0.14 : 0.78 - Math.abs(offset) * 0.12;

                return (
                  <Link
                    key={`${card.slug}-${card.originalIndex}`}
                    to={card.href}
                    onClick={handleHeroClick}
                    draggable={false}
                    onDragStart={(event) => event.preventDefault()}
                    onPointerDown={active ? handleHeroPointerDown : undefined}
                    onPointerMove={active ? handleHeroPointerMove : undefined}
                    onPointerUp={active ? handleHeroPointerUp : undefined}
                    onPointerCancel={active ? handleHeroPointerCancel : undefined}
                    className={`stack-card visit-card absolute w-64 select-none rounded-3xl border border-[#e8e1db] bg-white p-4 shadow-2xl md:w-72 ${
                      active ? 'cursor-grab touch-none active:cursor-grabbing' : 'pointer-events-none'
                    }`}
                    style={{
                      zIndex: 30 - Math.abs(offset),
                      opacity,
                      transform: `translate3d(${x}px, ${y}px, ${active ? 38 : 0}px) rotate(${rotate}deg) scale(${scale})`,
                      transition:
                        heroDrag.active && active
                          ? 'none'
                          : heroDrag.exiting && active
                            ? 'transform 330ms cubic-bezier(0.45, 0, 0.75, 0.45), opacity 300ms ease'
                            : 'transform 420ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 260ms ease'
                    }}
                    aria-label={card.title}
                  >
                    <div className="h-44 overflow-hidden rounded-2xl bg-[#f3f4f0]">
                      <img src={card.cover} alt="" draggable={false} className="h-full w-full object-cover" />
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-3">
                      <span className="rounded-full bg-[#f59e0b]/20 px-3 py-1 text-xs font-black text-[#7f5600]">
                        {typeof card.views === 'number' && card.views > 0 ? `${card.views} ${isArabic ? 'زيارة' : 'visits'}` : isArabic ? 'الأكثر زيارة' : 'Most visited'}
                      </span>
                    </div>
                    <p className="mt-2 min-h-[56px] text-lg font-black leading-7">{card.title}</p>
                    <div className="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-[#5f6368]">
                      <span className="truncate">{card.category}</span>
                      <span className="shrink-0 text-[#b11226]">{isArabic ? 'اسحب للتخطي' : 'Drag to skip'}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="interests" className="mx-auto max-w-7xl px-4 py-20 md:px-8 scroll-mt-28">
        <SectionTitle
          eyebrow="Explore"
          title={isArabic ? 'تصفح حسب الاهتمام' : 'Browse by Interest'}
          action={
            <Link
              to={`/${lang}/categories`}
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#e8e1db] bg-white px-5 text-sm font-black text-[#b11226] shadow-sm transition hover:-translate-y-0.5 hover:border-[#b11226] hover:shadow-lg"
            >
              {isArabic ? 'اكتشف المزيد' : 'Discover More'}
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categoryCards.map((category, index) => {
            const Icon = category.icon;
            const slug = (isArabic ? category.slug_ar : category.slug_en) || category.slug_en || category.slug_ar;
            return (
              <Link
                key={category.id || category.title_en}
                data-home-reveal
                style={{ transitionDelay: `${index * 70}ms` }}
                to={slug ? `/${lang}/category/${slug}` : `/${lang}/search?q=${encodeURIComponent(isArabic ? category.title_ar : category.title_en)}`}
                className={`home-reveal-visible group min-h-[220px] rounded-3xl border border-[#e8e1db] bg-white p-5 shadow-sm transition hover:-translate-y-2 hover:border-[#b11226]/40 hover:shadow-[0_24px_55px_rgba(177,18,38,0.14)] ${
                  isArabic ? 'text-right' : 'text-left'
                }`}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#b11226] transition group-hover:rotate-3 group-hover:bg-[#b11226] group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-black">{isArabic ? category.title_ar : category.title_en}</h3>
                <p className="mt-3 min-h-[48px] text-sm leading-6 text-[#5f6368]">{isArabic ? category.example_ar : category.example_en}</p>
                <div className="mt-5 text-xs font-black text-[#b11226]">{isArabic ? category.count_ar : category.count_en}</div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="popular" className="bg-[#f3f4f0] px-4 py-20 md:px-8 scroll-mt-28">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Trending" title={isArabic ? 'الأكثر قراءة الآن' : 'Most Read Now'} centered />
          <div className="mx-auto grid max-w-5xl gap-4" data-home-reveal>
            {articles.map((post, index) => {
              const item = articleMeta(post);
              return (
                <Link
                  key={`${item.slug}-${index}`}
                  to={item.href}
                  className="group grid min-h-[112px] grid-cols-[auto_1fr] items-center gap-4 rounded-3xl border border-[#e8e1db] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#d99a24] hover:shadow-xl md:grid-cols-[auto_1fr_auto]"
                >
                  <div className="w-16 shrink-0 text-center text-4xl font-black italic text-[#e7b0aa] transition group-hover:text-[#b11226]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="line-clamp-2 text-lg font-black leading-7 transition group-hover:text-[#b11226] md:text-xl">{item.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-[#5f6368]">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.city}</span>
                      <span className="rounded-full bg-[#fff1f1] px-2 py-1 text-[#b11226]">{isArabic ? 'أفضل 5' : 'Best 5'}</span>
                      {typeof post.views === 'number' && post.views > 0 && (
                        <span className="rounded-full bg-[#f8ead2] px-2 py-1 text-[#9a6508]">
                          {post.views} {isArabic ? 'مشاهدة' : 'views'}
                        </span>
                      )}
                    </div>
                  </div>
                  <img src={item.cover} alt="" className="hidden h-24 w-32 rounded-2xl object-cover md:block" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="cities" className="mx-auto max-w-7xl px-4 py-20 md:px-8 scroll-mt-28">
        <SectionTitle eyebrow="Cities" title={isArabic ? 'استكشف حسب المدينة' : 'Explore by City'} />
        <div className="no-scrollbar mb-8 flex gap-3 overflow-x-auto" data-home-reveal>
          {cityTags.map((tag) => {
            const cityName = lang === 'ar' ? tag.name_ar : tag.name_en || tag.name_ar;
            const active = selectedCity === tag.name_ar || selectedCity === tag.name_en;
            return (
              <button
                key={tag.id || tag.slug_en || tag.slug_ar}
                onClick={() => setSelectedCity(cityName)}
                className={`shrink-0 rounded-full border px-5 py-3 font-black transition ${
                  active ? 'border-[#b11226] bg-[#b11226] text-white shadow-lg' : 'border-[#e8e1db] bg-white text-[#5f6368] hover:border-[#b11226]'
                }`}
              >
                {cityName}
              </button>
            );
          })}
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
          <div
            key={`city-map-${selectedCity}`}
            className="city-switch-panel relative min-h-[360px] overflow-hidden rounded-[2rem] border border-[#e8e1db] bg-white shadow-sm"
          >
            <img src={images.map} alt="" className="absolute inset-0 h-full w-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151515]/80 to-transparent" />
            <div className={`absolute bottom-6 text-white ${isArabic ? 'right-6 text-right' : 'left-6 text-left'}`}>
              <MapPin className="mb-3 h-8 w-8 text-[#d99a24]" />
              <h3 className="text-4xl font-black">{selectedCityName}</h3>
              <p className="mt-2 text-white/70">{isArabic ? 'قوائم مختارة ومحدثة حسب المدينة' : 'Curated, updated lists by city'}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {cityArticleTitles(selectedCityName, lang).map((title, index) => (
              <button
                key={title}
                onClick={() => submitSearch(title)}
                style={{ animationDelay: `${index * 80}ms` }}
                className={`city-switch-card group rounded-3xl border border-[#e8e1db] bg-white p-5 opacity-100 shadow-sm transition hover:-translate-y-2 hover:border-[#b11226] hover:shadow-xl ${
                  isArabic ? 'text-right' : 'text-left'
                }`}
              >
                <span className="text-5xl font-black text-[#e7b0aa] transition group-hover:text-[#b11226]">0{index + 1}</span>
                <h3 className="mt-6 text-xl font-black leading-8">{title}</h3>
                <p className="mt-3 text-sm text-[#5f6368]">
                  {isArabic ? 'دليل سريع مع مقارنة عملية واختيارات واضحة.' : 'A quick guide with practical comparisons and clear picks.'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff1f1] px-4 py-20 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Editor's Picks" title={isArabic ? 'اختيارات المحرر' : "Editor's Picks"} centered />
          <div className="grid gap-6 md:grid-cols-3">
            {editorPickPosts.map((post: any, index) => {
              const item = articleMeta(post);
              return (
                <Link
                  key={`${post.id || item.slug}-${index}`}
                  to={item.href}
                  className="home-reveal-visible group overflow-hidden rounded-[2rem] border border-[#e8e1db] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="h-56 overflow-hidden">
                    <img src={item.cover} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                  <div className={`p-6 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f59e0b]/20 px-3 py-1 text-xs font-black text-[#7f5600]">
                      <Star className="h-3.5 w-3.5" /> {isArabic ? '\u0627\u062e\u062a\u064a\u0627\u0631 \u0627\u0644\u0645\u062d\u0631\u0631' : "Editor's pick"}
                    </span>
                    <h3 className="mt-4 line-clamp-2 text-2xl font-black leading-9 transition group-hover:text-[#b11226]">{item.title}</h3>
                    <p className="mt-4 line-clamp-3 rounded-2xl bg-[#fbf7f2] p-4 text-sm font-bold leading-6 text-[#5f6368]">
                      {item.excerpt || (isArabic ? '\u062f\u0644\u064a\u0644 \u0645\u062e\u062a\u0627\u0631 \u0645\u0646 \u0627\u0644\u0645\u062d\u0631\u0631 \u0636\u0645\u0646 \u0645\u0642\u0627\u0644\u0627\u062a \u0623\u0641\u0636\u0644 5.' : 'A featured Best 5 guide selected by the editor.')}
                    </p>
                    <div className="mt-4 text-xs font-black text-[#b11226]">{item.category}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <SectionTitle eyebrow="Method" title={isArabic ? 'كيف نختار أفضل 5؟' : 'How We Pick the Best 5'} centered />
        <div className="grid gap-4 md:grid-cols-5">
          {methodItems.map(([Icon, label], index) => {
            const MethodIcon = Icon as typeof Trophy;
            return (
              <div
                key={label as string}
                data-home-reveal
                style={{ transitionDelay: `${index * 100}ms` }}
                className="relative rounded-3xl border border-[#e8e1db] bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#b11226] text-white shadow-lg shadow-[#b11226]/20">
                  <MethodIcon className="h-7 w-7" />
                </div>
                <div className="mb-2 text-sm font-black text-[#d99a24]">0{index + 1}</div>
                <h3 className="text-lg font-black">{label as string}</h3>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-9 text-[#5f6368]" data-home-reveal>
          {isArabic
            ? 'نقارن الخيارات حسب التقييمات، التجربة، السعر، الموقع، ومدى ملاءمتها للزائر العربي، ثم نراجع القوائم باستمرار حتى تبقى مفيدة وحديثة.'
            : 'We compare options by ratings, real experience, price, location, and usefulness for visitors, then review lists regularly so they stay fresh and practical.'}
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <div data-home-reveal className="relative overflow-hidden rounded-[2rem] bg-[#b11226] p-8 text-white shadow-2xl md:p-12">
          <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full border border-white/20" />
          <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-[#d99a24]/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-black text-white/85">
                <Star className="h-4 w-4 text-[#f8c75f]" />
                {isArabic ? 'مختارات المحرر' : "Editor's picks"}
              </div>
              <h2 className="text-3xl font-black md:text-5xl">{isArabic ? 'مختارات هذا الأسبوع' : 'This Week Picks'}</h2>
              <p className="mt-4 max-w-md text-white/75">
                {isArabic
                  ? 'قوائم جاهزة للقراءة الآن، اخترناها لأنها الأكثر فائدة وتنوعاً هذا الأسبوع.'
                  : 'Ready-to-read lists selected for usefulness and variety this week.'}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {articles.slice(0, 3).map((post, index) => {
                const item = articleMeta(post);
                return (
                  <Link
                    key={`weekly-bottom-${item.slug}-${index}`}
                    to={item.href}
                    className="group min-h-[150px] rounded-3xl bg-white p-4 text-[#151515] shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="mb-5 flex items-center justify-between">
                      <span className="rounded-full bg-[#fff1f1] px-3 py-1 text-xs font-black text-[#b11226]">#{index + 1}</span>
                      {isArabic ? (
                        <ArrowLeft className="h-4 w-4 text-[#b11226] transition group-hover:-translate-x-1" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-[#b11226] transition group-hover:translate-x-1" />
                      )}
                    </div>
                    <h3 className="line-clamp-2 text-base font-black leading-7">{item.title}</h3>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#5f6368]">
                      <Clock3 className="h-4 w-4 text-[#d99a24]" />
                      <span>{item.category}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionTitle: React.FC<{ eyebrow: string; title: string; centered?: boolean; action?: React.ReactNode }> = ({ eyebrow, title, centered, action }) => (
  <div className={`mb-10 ${centered ? 'text-center' : ''}`} data-home-reveal>
    <div className={`flex gap-4 ${centered ? 'justify-center' : 'items-end justify-between'}`}>
      <div>
        <div className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#b11226]">{eyebrow}</div>
        <h2 className="text-3xl font-black leading-tight md:text-5xl">{title}</h2>
        <div className={`mt-4 h-1 w-20 rounded-full bg-[#d99a24] ${centered ? 'mx-auto' : ''}`} />
      </div>
      {action && !centered && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  </div>
);

export default HomePage;
