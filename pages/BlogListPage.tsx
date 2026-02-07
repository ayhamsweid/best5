import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { t } from '../utils/i18n';
import { fetchPublicPosts } from '../services/api';

const BlogListPage: React.FC = () => {
  const { lang } = useLang();
  const [posts, setPosts] = useState<any[]>([]);
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
    <div className="max-w-6xl mx-auto px-6 py-20">
      <Seo title={`${t(lang, 'blog')} | Besiktas City Guide`} />
      <div className="flex items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black">{t(lang, 'blog')}</h2>
          <p className="text-gray-500 mt-2">Latest stories and curated guides.</p>
        </div>
        <input
          className="border border-gray-200 rounded-full px-5 py-2 text-sm w-64"
          placeholder={`${t(lang, 'search')}...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((post) => {
          const slug = lang === 'ar' ? post.slug_ar : post.slug_en;
          const title = lang === 'ar' ? post.title_ar : post.title_en;
          const excerpt = lang === 'ar' ? post.excerpt_ar : post.excerpt_en;
          return (
          <Link
            key={post.id}
            to={`/${lang}/blog/${slug}`}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition"
          >
            <div className="text-xs text-gray-500 mb-3">Guide</div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-gray-500 mt-2">{excerpt}</p>
          </Link>
        )})}
      </div>
    </div>
  );
};

export default BlogListPage;
