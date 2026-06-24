import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, FileText, Search } from 'lucide-react';
import { fetchPublicCategories, fetchPublicPosts, fetchPublicTags } from '../services/api';

type Lang = 'ar' | 'en';

type Suggestion = {
  label: string;
  description: string;
  type: 'post' | 'topic';
  href?: string;
};

type SearchSuggestionsProps = {
  lang: Lang;
  query: string;
  onPick: (value: string, href?: string) => void;
  className?: string;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[أإآا]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ؤئ]/g, 'ء')
    .replace(/[\u064B-\u065F]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const allowedCityNames = new Set(
  [
    'istanbul',
    'اسطنبول',
    'إسطنبول',
    'antalya',
    'انطاليا',
    'أنطاليا',
    'trabzon',
    'طرابزون',
    'bursa',
    'بورصة',
    'izmir',
    'إزمير',
    'ازمير',
    'ankara',
    'أنقرة',
    'انقرة'
  ].map(normalize)
);

const fallbackCities = [
  { name_ar: 'إسطنبول', name_en: 'Istanbul' },
  { name_ar: 'أنطاليا', name_en: 'Antalya' },
  { name_ar: 'طرابزون', name_en: 'Trabzon' }
];

const matchesCity = (tag: any) => allowedCityNames.has(normalize(tag?.name_ar || '')) || allowedCityNames.has(normalize(tag?.name_en || ''));

let cache: Partial<Record<Lang, Promise<Suggestion[]>>> = {};

const loadSuggestions = (lang: Lang) => {
  if (!cache[lang]) {
    cache[lang] = Promise.all([fetchPublicPosts(lang), fetchPublicCategories(), fetchPublicTags()]).then(([postData, categoryData, tagData]) => {
      const isArabic = lang === 'ar';
      const posts = Array.isArray(postData) ? postData : [];
      const categories = Array.isArray(categoryData) ? categoryData.slice(0, 8) : [];
      const cityTags = Array.isArray(tagData) ? tagData.filter(matchesCity).slice(0, 6) : [];
      const cities = cityTags.length ? cityTags : fallbackCities;
      const suggestions: Suggestion[] = [];
      const seen = new Set<string>();

      const push = (suggestion: Suggestion) => {
        const key = normalize(suggestion.label);
        if (!key || seen.has(key)) return;
        seen.add(key);
        suggestions.push(suggestion);
      };

      posts.forEach((post: any) => {
        const title = (isArabic ? post.title_ar : post.title_en) || post.title_ar || post.title_en;
        if (!title) return;
        const slug = (isArabic ? post.slug_ar : post.slug_en) || post.slug_en || post.slug_ar;
        const category = (isArabic ? post?.category?.name_ar : post?.category?.name_en) || post?.category?.name_ar || 'Best 5';
        push({
          label: title,
          description: isArabic ? `مقال منشور · ${category}` : `Published guide · ${category}`,
          type: 'post',
          href: slug ? `/${lang}/blog/${slug}` : undefined
        });
      });

      categories.forEach((category: any) => {
        const categoryName = (isArabic ? category.name_ar : category.name_en) || category.name_ar || category.name_en;
        if (!categoryName) return;

        cities.slice(0, 4).forEach((city: any) => {
          const cityName = (isArabic ? city.name_ar : city.name_en) || city.name_ar || city.name_en;
          if (!cityName) return;
          push({
            label: isArabic ? `أفضل 5 ${categoryName} في ${cityName}` : `Best 5 ${categoryName} in ${cityName}`,
            description: isArabic ? 'اقتراح موضوع حسب القسم والمدينة' : 'Topic suggestion by category and city',
            type: 'topic'
          });
        });

        push({
          label: isArabic ? `أفضل 5 ${categoryName} في تركيا` : `Best 5 ${categoryName} in Turkey`,
          description: isArabic ? 'اقتراح موضوع عام' : 'General topic suggestion',
          type: 'topic'
        });
      });

      return suggestions.slice(0, 80);
    });
  }

  return cache[lang]!;
};

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ lang, query, onPick, className = '' }) => {
  const [items, setItems] = useState<Suggestion[]>([]);
  const cleanQuery = query.trim();
  const isArabic = lang === 'ar';

  useEffect(() => {
    let alive = true;
    loadSuggestions(lang)
      .then((data) => {
        if (alive) setItems(data);
      })
      .catch(() => {
        if (alive) setItems([]);
      });
    return () => {
      alive = false;
    };
  }, [lang]);

  const visibleItems = useMemo(() => {
    const q = normalize(cleanQuery);
    if (q.length < 2) return [];

    const relaxed = q.replace(/^افضل\s*5\s*/, '').replace(/^best\s*5\s*/, '').trim();
    return items
      .filter((item) => {
        const label = normalize(item.label);
        return label.includes(q) || (!!relaxed && label.includes(relaxed));
      })
      .slice(0, 6);
  }, [cleanQuery, items]);

  if (!visibleItems.length) return null;

  return (
    <div
      className={`absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-[#eadfd7] bg-white shadow-2xl ${className}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-h-80 overflow-y-auto p-2">
        {visibleItems.map((item) => {
          const Icon = item.type === 'post' ? FileText : Search;
          return (
            <button
              key={`${item.type}-${item.label}`}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => onPick(item.label, item.href)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-start transition hover:bg-[#fbf7f2]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0f2] text-[#b11226]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black text-[#151515]">{item.label}</span>
                <span className="mt-1 block truncate text-xs font-bold text-[#8a8f98]">{item.description}</span>
              </span>
              <ArrowUpRight className={`h-4 w-4 shrink-0 text-[#d99a24] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchSuggestions;
