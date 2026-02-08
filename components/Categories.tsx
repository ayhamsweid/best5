import React from 'react';
import { Coffee, Utensils, UtensilsCrossed, Croissant, Soup } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../hooks/useLang';

const Categories: React.FC = () => {
  const { lang } = useLang();
  const categories = [
    { name: lang === 'ar' ? 'برغر' : 'Burgers', slug: 'burger', icon: <UtensilsCrossed className="w-6 h-6" /> },
    { name: lang === 'ar' ? 'مقاهي' : 'Cafes', slug: 'cafes', icon: <Coffee className="w-6 h-6" /> },
    { name: lang === 'ar' ? 'فطور' : 'Breakfast', slug: 'breakfast', icon: <Croissant className="w-6 h-6" /> },
    { name: lang === 'ar' ? 'عشاء فاخر' : 'Fine Dining', slug: 'fine-dining', icon: <Utensils className="w-6 h-6" /> },
    { name: lang === 'ar' ? 'أكل شعبي' : 'Street Food', slug: 'street-food', icon: <Soup className="w-6 h-6" /> }
  ];

  return (
    <div className="relative -mt-14 z-20 px-4 mb-20">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#111827] rounded-2xl shadow-xl py-6 px-4 md:px-10 flex flex-wrap justify-between items-center gap-4 border border-gray-100 dark:border-white/10">
        {categories.map((cat, idx) => (
          <Link key={idx} to={`/${lang}/category/${cat.slug}`} className="flex flex-col items-center gap-3 group min-w-[60px]">
            <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-200 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
              {cat.icon}
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
