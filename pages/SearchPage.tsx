import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';

const SearchPage: React.FC = () => {
  const [params] = useSearchParams();
  const q = params.get('q') ?? '';
  const { lang } = useLang();
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <Seo title={`Search: ${q}`} canonical={`/${lang}/search?q=${encodeURIComponent(q)}`} />
      <h2 className="text-3xl font-black">Search results</h2>
      <p className="text-gray-500 mt-2">Query: {q || '—'}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((item) => (
          <Link key={item} to={`/${lang}/blog/search-${item}`} className="bg-white rounded-xl p-6 border border-gray-100">
            Result {item}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
