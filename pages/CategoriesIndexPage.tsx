import React, { useEffect, useMemo, useState } from 'react';
import { Building2, GraduationCap, Hotel, Landmark, MapPin, Store, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicCategories, fetchPublicPosts } from '../services/api';

type PublicCategory = {
  id: string;
  name_ar: string;
  name_en: string;
  slug_ar: string;
  slug_en: string;
  icon?: string | null;
};

const normalize = (value = '') =>
  value
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^a-z0-9\u0600-\u06ff\s-]/g, '')
    .trim();

const categoryIcon = (category: PublicCategory) => {
  const key = normalize(`${category.icon || ''} ${category.name_ar || ''} ${category.name_en || ''}`);
  if (key.includes('hotel') || key.includes('فندق')) return Hotel;
  if (key.includes('restaurant') || key.includes('restorant') || key.includes('مطاعم')) return Utensils;
  if (key.includes('university') || key.includes('graduation') || key.includes('جامع')) return GraduationCap;
  if (key.includes('store') || key.includes('shop') || key.includes('متجر') || key.includes('متاجر')) return Store;
  if (key.includes('museum') || key.includes('musem') || key.includes('pyramid') || key.includes('متحف') || key.includes('متاحف')) return Landmark;
  if (key.includes('place') || key.includes('map') || key.includes('مكان') || key.includes('اماكن')) return MapPin;
  return Building2;
};

const CategoriesIndexPage: React.FC = () => {
  const { lang } = useLang();
  const isArabic = lang === 'ar';
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchPublicCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    fetchPublicPosts(lang)
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]));
  }, [lang]);

  const counts = useMemo(() => {
    const next: Record<string, number> = {};
    posts.forEach((post) => {
      const category = post.category || {};
      [post.category_id, category.id, category.slug_ar, category.slug_en, category.name_ar, category.name_en]
        .filter(Boolean)
        .forEach((key) => {
          next[String(key)] = (next[String(key)] || 0) + 1;
        });
    });
    return next;
  }, [posts]);

  return (
    <div className="bg-[#fbf7f2] px-4 py-16 text-[#151515] md:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <Seo title={isArabic ? 'كل الأقسام | أفضل 5' : 'All Categories | Best 5'} canonical={`/${lang}/categories`} />
      <div className="mx-auto max-w-7xl">
        <div className={isArabic ? 'text-right' : 'text-left'}>
          <div className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-[#b11226]">
            {isArabic ? 'الأقسام' : 'Categories'}
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            {isArabic ? 'كل الاهتمامات في مكان واحد' : 'All Interests in One Place'}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f6368]">
            {isArabic
              ? 'اختر القسم المناسب وشاهد كل قوائم أفضل 5 المنشورة ضمنه.'
              : 'Choose an interest and browse every published Best 5 guide inside it.'}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoryIcon(category);
            const slug = (isArabic ? category.slug_ar : category.slug_en) || category.slug_en || category.slug_ar;
            const title = (isArabic ? category.name_ar : category.name_en) || category.name_ar || category.name_en;
            const count =
              counts[category.id] ||
              counts[category.slug_ar] ||
              counts[category.slug_en] ||
              counts[category.name_ar] ||
              counts[category.name_en] ||
              0;

            return (
              <Link
                key={category.id}
                to={`/${lang}/category/${slug}`}
                className={`group min-h-[190px] rounded-3xl border border-[#e8e1db] bg-white p-6 shadow-sm transition hover:-translate-y-2 hover:border-[#b11226]/50 hover:shadow-xl ${
                  isArabic ? 'text-right' : 'text-left'
                }`}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff1f1] text-[#b11226] transition group-hover:bg-[#b11226] group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="text-2xl font-black">{title}</h2>
                <div className="mt-4 text-sm font-black text-[#b11226]">
                  {isArabic ? `${count} دليل` : `${count} ${count === 1 ? 'guide' : 'guides'}`}
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="mt-10 rounded-3xl border border-[#e8e1db] bg-white p-8 text-center text-[#5f6368]">
            {isArabic ? 'لا توجد أقسام منشورة حالياً.' : 'No public categories yet.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesIndexPage;
