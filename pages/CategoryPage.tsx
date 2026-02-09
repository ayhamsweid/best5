import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicCategories, fetchPublicPosts } from '../services/api';

const CategoryPage: React.FC = () => {
  const { slug } = useParams();
  const { lang } = useLang();
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-[#111827] dark:text-white">
      <Seo title={`Category: ${title || slug}`} canonical={`/${lang}/category/${slug}`} />
      <h2 className="text-3xl font-black capitalize">{title || slug}</h2>
      <p className="text-gray-500 dark:text-gray-300 mt-2">Latest posts in this category.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {posts.map((post) => {
          const slugValue = (lang === 'ar' ? post.slug_ar : post.slug_en) || post.slug_en || post.slug_ar;
          const postTitle = lang === 'ar' ? post.title_ar : post.title_en;
          const excerpt = lang === 'ar' ? post.excerpt_ar : post.excerpt_en;
          return (
            <Link
              key={post.id}
              to={`/${lang}/blog/${slugValue}`}
              className="bg-white dark:bg-[#111827] rounded-xl p-6 border border-gray-100 dark:border-white/10 hover:shadow-lg transition"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Guide</div>
              <h3 className="font-bold text-lg">{postTitle}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{excerpt}</p>
            </Link>
          );
        })}
        {posts.length === 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">No posts yet for this category.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
