import React, { useEffect, useMemo, useState } from 'react';
import { DynamicIcon, iconNames } from 'lucide-react/dynamic';
import { Link } from 'react-router-dom';
import { useLang } from '../hooks/useLang';
import { fetchPublicCategories } from '../services/api';

const Categories: React.FC = () => {
  const { lang } = useLang();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchPublicCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const fallback = useMemo(
    () => [
      { name_ar: 'برغر', name_en: 'Burgers', slug_ar: 'burger', slug_en: 'burger', icon: 'utensils-crossed' },
      { name_ar: 'مقاهي', name_en: 'Cafes', slug_ar: 'cafes', slug_en: 'cafes', icon: 'coffee' },
      { name_ar: 'فطور', name_en: 'Breakfast', slug_ar: 'breakfast', slug_en: 'breakfast', icon: 'croissant' },
      { name_ar: 'عشاء فاخر', name_en: 'Fine Dining', slug_ar: 'fine-dining', slug_en: 'fine-dining', icon: 'utensils' },
      { name_ar: 'أكل شعبي', name_en: 'Street Food', slug_ar: 'street-food', slug_en: 'street-food', icon: 'soup' }
    ],
    []
  );

  const list = categories.length ? categories : fallback;

  const iconSet = useMemo(() => new Set(iconNames), []);
  const normalizeIconName = (value?: string | null) => {
    const raw = (value || '').trim();
    if (!raw) return null;
    const cleaned = raw
      .replace(/^Lucide/i, '')
      .replace(/Icon$/i, '')
      .replace(/[_\s]+/g, '-')
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
    return cleaned;
  };
  const resolveIconName = (value?: string | null) => {
    const name = normalizeIconName(value);
    if (!name) return null;
    if (iconSet.has(name)) return name;
    return null;
  };

  const renderIcon = (value?: string | null) => {
    if (!value) return <DynamicIcon name="folder" className="w-6 h-6" fallback={() => null} />;
    if (value.startsWith('http') || value.startsWith('/')) {
      return <img src={value} alt="" className="w-6 h-6 object-contain" />;
    }
    const resolved = resolveIconName(value);
    if (resolved) return <DynamicIcon name={resolved} className="w-6 h-6" fallback={() => null} />;
    return <DynamicIcon name="folder" className="w-6 h-6" fallback={() => null} />;
  };

  return (
    <div className="relative -mt-14 z-20 px-4 mb-20">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#111827] rounded-2xl shadow-xl py-6 px-4 md:px-10 flex flex-wrap justify-between items-center gap-4 border border-gray-100 dark:border-white/10">
        {list.map((cat, idx) => {
          const slug = (lang === 'ar' ? cat.slug_ar : cat.slug_en) || cat.slug_en || cat.slug_ar;
          const name = (lang === 'ar' ? cat.name_ar : cat.name_en) || cat.name_en || cat.name_ar;
          return (
          <Link key={cat.id || idx} to={`/${lang}/category/${slug}`} className="flex flex-col items-center gap-3 group min-w-[60px]">
            <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
              {renderIcon(cat.icon)}
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">{name}</span>
          </Link>
        )})}
      </div>
    </div>
  );
};

export default Categories;
