import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicCategories, fetchPublicPosts } from '../services/api';
import { useInitialData } from '../context/InitialDataContext';
import { getCategorySeo } from '../server/src/common/category-seo';

const featuredSlugsByCategory: Record<string, string[]> = {
  hotels: [
    'best-budget-hotels-in-taksim-2026-guide',
    'best-5-five-star-hotels-in-istanbul-2026-guide',
    'best-5-hotels-near-istanbul-airport',
    'best-5-hotels-in-sisli',
    'best-5-rustic-cabins-in-trabzon-2026-guide'
  ],
  museums: ['top-5-museums-you-must-visit-in-istanbul-2026-guide'],
  places: [
    'top-5-tourist-places-in-trabzon-2026-guide',
    'best-5-waterfalls-to-visit-in-turkey-2026-guide',
    'top-5-islands-near-istanbul',
    'top-5-parks-you-must-visit-in-istanbul-2026-guide',
    'top-5-natural-lakes-in-turkey-2026-guide'
  ],
  restaurants: [
    'best-budget-restaurants-in-istanbul-2026-guide',
    'best-traditional-turkish-restaurants-in-istanbul-2026-guide',
    'best-5-family-restaurants-in-istanbul-2026-guide',
    'best-5-arabic-restaurants-in-istanbul-2026-guide',
    'best-5-sea-view-cafes-in-istanbul-2026-guide'
  ],
  shopping: [
    'best-5-shopping-malls-in-istanbul-2026-guide',
    'best-5-outlet-malls-you-should-visit-in-istanbul-2026-guide',
    'best-5-shopping-streets-in-istanbul-2026-guide',
    'best-5-traditional-markets-in-istanbul-2026-guide',
    'grand-bazaar-vs-spice-bazaar-which-should-you-visit'
  ],
  'schools-education': [
    'best-5-international-schools-in-istanbul',
    'best-5-british-schools-in-istanbul-2026',
    'best-5-american-schools-in-istanbul-2026',
    'best-5-ib-schools-in-istanbul-2026',
    'international-school-fees-in-istanbul-2026-2027'
  ]
};

const CategoryPage: React.FC = () => {
  const { slug } = useParams();
  const { lang } = useLang();
  const { categoryPosts: initialCategoryPosts, categories: initialCategories } = useInitialData();
  const [posts, setPosts] = useState<any[]>(() => initialCategoryPosts || []);
  const [categories, setCategories] = useState<any[]>(() => initialCategories || []);

  useEffect(() => {
    fetchPublicCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetchPublicPosts(lang, slug)
      .then(setPosts)
      .catch(() => setPosts([]));
  }, [lang, slug]);

  const category = useMemo(() => {
    if (!slug) return null;
    return categories.find((cat) =>
      (lang === 'ar' ? cat.slug_ar : cat.slug_en) === slug ||
      cat.slug_en === slug ||
      cat.slug_ar === slug
    );
  }, [categories, lang, slug]);

  const title = category ? (lang === 'ar' ? category.name_ar : category.name_en) : slug;
  const categorySeo = getCategorySeo(category || {
    name_ar: lang === 'ar' ? title : '',
    name_en: lang === 'en' ? title : ''
  }, lang);
  const canonicalSlug = category ? (lang === 'ar' ? category.slug_ar : category.slug_en) : slug;
  const relatedCategories = categories.filter((item) => item.id !== category?.id).slice(0, 5);
  const featuredSlugs = featuredSlugsByCategory[category?.slug_en || ''] || [];
  const featuredPosts = featuredSlugs
    .map((featuredSlug) => posts.find((post) => post.slug_en === featuredSlug))
    .filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-[#111827]">
      <Seo
        title={categorySeo.title}
        description={categorySeo.description}
        canonical={`/${lang}/category/${encodeURIComponent(canonicalSlug || '')}`}
        alternates={category ? {
          ar: `/ar/category/${encodeURIComponent(category.slug_ar)}`,
          en: `/en/category/${encodeURIComponent(category.slug_en)}`,
          xDefault: `/en/category/${encodeURIComponent(category.slug_en)}`
        } : undefined}
      />
      <h1 className="text-3xl font-black capitalize">{title || slug}</h1>
      <p className="mt-5 max-w-5xl text-base leading-8 text-gray-600">{categorySeo.intro}</p>
      {relatedCategories.length > 0 && (
        <nav className="mt-6 flex flex-wrap gap-2" aria-label={lang === 'ar' ? 'تصنيفات ذات صلة' : 'Related categories'}>
          {relatedCategories.map((item) => {
            const itemSlug = lang === 'ar' ? item.slug_ar : item.slug_en;
            return (
              <Link key={item.id} to={`/${lang}/category/${encodeURIComponent(itemSlug)}`} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold hover:text-[#b11226]">
                {lang === 'ar' ? item.name_ar : item.name_en}
              </Link>
            );
          })}
        </nav>
      )}
      {featuredPosts.length > 0 && (
        <nav className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5" aria-label={lang === 'ar' ? 'أدلة فرعية مختارة' : 'Featured subtopic guides'}>
          <h2 className="text-lg font-black">
            {lang === 'ar' ? 'ابدأ حسب الموضوع' : 'Start with a subtopic'}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {featuredPosts.map((post) => {
              const postSlug = lang === 'ar' ? post.slug_ar : post.slug_en;
              const postTitle = lang === 'ar' ? post.title_ar : post.title_en;
              return (
                <Link
                  key={post.id}
                  to={`/${lang}/blog/${encodeURIComponent(postSlug)}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold hover:border-[#b11226] hover:text-[#b11226]"
                >
                  {postTitle}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
      <h2 className="mt-10 text-2xl font-black">
        {lang === 'ar' ? `أفضل أدلة ${title || ''}` : `Best ${title || ''} guides`}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {posts.map((post) => {
          const slugValue = (lang === 'ar' ? post.slug_ar : post.slug_en) || post.slug_en || post.slug_ar;
          const postTitle = lang === 'ar' ? post.title_ar : post.title_en;
          const excerpt = lang === 'ar' ? post.excerpt_ar : post.excerpt_en;
          return (
            <Link
              key={post.id}
              to={`/${lang}/blog/${encodeURIComponent(slugValue)}`}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="text-xs text-gray-500 mb-3">Guide</div>
              <h3 className="font-bold text-lg">{postTitle}</h3>
              <p className="text-sm text-gray-500 mt-2">{excerpt}</p>
            </Link>
          );
        })}
        {posts.length === 0 && (
          <div className="text-sm text-gray-500">{lang === 'ar' ? 'لا توجد مقالات في هذا التصنيف بعد.' : 'No posts yet for this category.'}</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
