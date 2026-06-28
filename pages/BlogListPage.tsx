import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { t } from '../utils/i18n';
import { fetchPublicPosts } from '../services/api';
import { useInitialData } from '../context/InitialDataContext';

const BlogListPage: React.FC = () => {
  const { lang } = useLang();
  const { posts: initialPosts } = useInitialData();
  const [posts, setPosts] = useState<any[]>(() => initialPosts || []);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchPublicPosts(lang)
      .then(setPosts)
      .catch(() => setPosts([]));
  }, [lang]);

  const filtered = useMemo(() => {
    if (!query) return posts;
    const q = query.toLowerCase();
    return posts.filter((post) => {
      const title = (lang === 'ar' ? post.title_ar : post.title_en) || '';
      const excerpt = (lang === 'ar' ? post.excerpt_ar : post.excerpt_en) || '';
      return title.toLowerCase().includes(q) || excerpt.toLowerCase().includes(q);
    });
  }, [posts, query, lang]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-[#111827]">
      <Seo
        title={`${t(lang, 'blog')} | Best5`}
        description={lang === 'ar'
          ? 'تصفح أحدث مقالات وأدلة Best5 لاكتشاف أفضل الأماكن والخدمات والتجارب في تركيا.'
          : 'Browse the latest Best5 articles and guides to discover top places, services, and experiences in Turkey.'}
        canonical={`/${lang}/blog`}
      />
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black">{t(lang, 'blog')}</h2>
          <p className="text-gray-500 mt-2">Latest stories and curated guides.</p>
        </div>
        <input
          className="border border-gray-200 bg-white rounded-full px-5 py-2 text-sm w-64 text-gray-800"
          placeholder={`${t(lang, 'search')}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((post) => {
          const slug = (lang === 'ar' ? post.slug_ar : post.slug_en) || post.slug_en || post.slug_ar;
          const title = lang === 'ar' ? post.title_ar : post.title_en;
          const excerpt = lang === 'ar' ? post.excerpt_ar : post.excerpt_en;
          const cover = post.cover_image_url;
          return (
            <Link
              key={post.id}
              to={`/${lang}/blog/${slug}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition"
            >
              {cover ? (
                <img src={cover} alt={title} loading="lazy" className="w-full h-44 object-cover" />
              ) : (
                <div className="w-full h-44 bg-gray-100" />
              )}
              <div className="p-6">
                <div className="text-xs text-gray-500 mb-3">Guide</div>
                <h3 className="font-bold text-lg text-[#111827]">{title}</h3>
                <p className="text-sm text-gray-500 mt-2">{excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BlogListPage;
