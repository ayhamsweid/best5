import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';

const CategoryPage: React.FC = () => {
  const { slug } = useParams();
  const { lang } = useLang();
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-[#111827] dark:text-white">
      <Seo title={`Category: ${slug}`} canonical={`/${lang}/category/${slug}`} />
      <h2 className="text-3xl font-black capitalize">{slug}</h2>
      <p className="text-gray-500 dark:text-gray-300 mt-2">Category listing placeholder wired for `/api/categories`.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((item) => (
          <Link key={item} to={`/${lang}/blog/sample-${item}`} className="bg-white dark:bg-[#111827] rounded-xl p-6 border border-gray-100 dark:border-white/10">
            Sample post {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
