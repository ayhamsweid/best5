import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicPosts } from '../services/api';

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

const SearchPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get('q')?.trim() ?? '';
  const { lang } = useLang();
  const isArabic = lang === 'ar';
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPublicPosts(lang)
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [lang]);

  const results = useMemo(() => {
    const clean = normalize(q);
    if (!clean) return posts.slice(0, 12);
    const relaxed = clean.replace(/^افضل\s*5\s*/, '').replace(/^best\s*5\s*/, '').trim();

    return posts
      .map((post) => {
        const title = (isArabic ? post.title_ar : post.title_en) || post.title_ar || post.title_en || '';
        const otherTitle = (isArabic ? post.title_en : post.title_ar) || '';
        const excerpt = (isArabic ? post.excerpt_ar : post.excerpt_en) || post.excerpt_ar || post.excerpt_en || '';
        const category = (isArabic ? post?.category?.name_ar : post?.category?.name_en) || post?.category?.name_ar || '';
        const haystack = normalize([title, otherTitle, excerpt, category].join(' '));
        const score = normalize(title) === clean ? 100 : haystack.includes(clean) ? 50 : relaxed && haystack.includes(relaxed) ? 25 : 0;
        return { post, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.post);
  }, [isArabic, posts, q]);

  useEffect(() => {
    if (loading || !q) return;
    const clean = normalize(q);
    const exact = results.find((post) => {
      const title = (isArabic ? post.title_ar : post.title_en) || post.title_ar || post.title_en || '';
      return normalize(title) === clean;
    });
    if (!exact) return;
    const slug = (isArabic ? exact.slug_ar : exact.slug_en) || exact.slug_en || exact.slug_ar;
    if (slug) navigate(`/${lang}/blog/${slug}`, { replace: true });
  }, [isArabic, lang, loading, navigate, q, results]);

  return (
    <div className="min-h-[60vh] bg-[#fbf7f2] px-4 py-16 text-[#111827] md:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <Seo title={`${isArabic ? 'بحث' : 'Search'}: ${q}`} canonical={`/${lang}/search?q=${encodeURIComponent(q)}`} />
      <div className="mx-auto max-w-6xl">
        <div className={isArabic ? 'text-right' : 'text-left'}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#b11226]">
            <Search className="h-4 w-4" />
            {isArabic ? 'بحث' : 'Search'}
          </div>
          <h1 className="text-4xl font-black md:text-5xl">{isArabic ? 'نتائج البحث' : 'Search Results'}</h1>
          <p className="mt-4 text-[#5f6368]">
            {q ? (isArabic ? `النتائج المطابقة لـ: ${q}` : `Results matching: ${q}`) : isArabic ? 'اكتب كلمة بحث من الأعلى.' : 'Type a search term above.'}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {loading
            ? [1, 2, 3].map((item) => <div key={item} className="h-44 animate-pulse rounded-3xl border border-[#e8e1db] bg-white" />)
            : results.map((post) => {
                const slug = (isArabic ? post.slug_ar : post.slug_en) || post.slug_en || post.slug_ar;
                const title = (isArabic ? post.title_ar : post.title_en) || post.title_ar || post.title_en;
                const excerpt = (isArabic ? post.excerpt_ar : post.excerpt_en) || post.excerpt_ar || post.excerpt_en;
                const category = (isArabic ? post?.category?.name_ar : post?.category?.name_en) || post?.category?.name_ar || 'Best 5';
                return (
                  <Link
                    key={post.id}
                    to={`/${lang}/blog/${slug}`}
                    className="group overflow-hidden rounded-3xl border border-[#e8e1db] bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#b11226] hover:shadow-xl"
                  >
                    {post.cover_image_url && <img src={post.cover_image_url} alt="" className="h-40 w-full object-cover" />}
                    <div className="p-5">
                      <div className="mb-3 text-xs font-black text-[#b11226]">{category}</div>
                      <h2 className="line-clamp-2 text-xl font-black leading-8 group-hover:text-[#b11226]">{title}</h2>
                      {excerpt && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5f6368]">{excerpt}</p>}
                    </div>
                  </Link>
                );
              })}
        </div>

        {!loading && results.length === 0 && (
          <div className="mt-10 rounded-3xl border border-[#e8e1db] bg-white p-8 text-center text-[#5f6368]">
            {isArabic ? 'لم نعثر على مقالات مطابقة لبحثك حالياً.' : 'No articles match your search at the moment.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
