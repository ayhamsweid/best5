import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicPost } from '../services/api';
import BlogBlocksRenderer from '../components/BlogBlocksRenderer';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams();
  const { lang } = useLang();
  const [post, setPost] = useState<any | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetchPublicPost(lang, slug)
      .then(setPost)
      .catch(() => setPost(null));
  }, [slug, lang]);

  const pills = useMemo(
    () =>
      lang === 'ar'
        ? ['الأعلى تقييماً', 'الأفضل قيمة', 'خيار العائلات', 'الخدمة السريعة']
        : ['Top Rated', 'Best Value', 'Family Pick', 'Fast Service'],
    [lang]
  );

  

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-gray-500">Post not found.</div>
      </div>
    );
  }

  const title = lang === 'ar' ? post.title_ar : post.title_en;
  const excerpt = lang === 'ar' ? post.excerpt_ar : post.excerpt_en;
  const content = lang === 'ar' ? post.content_ar : post.content_en;
  const blocks = Array.isArray(post.content_blocks_json) ? post.content_blocks_json : [];
  const publishedAt = post.published_at ? new Date(post.published_at).toLocaleDateString() : '';

  return (
    <div className="bg-[#F9FAFB]">
      <Seo title={`${title} | Besiktas City Guide`} description={excerpt} canonical={`/${lang}/blog/${slug}`} />

      <section className="max-w-6xl mx-auto px-6 pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-[#111827] text-white">
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
          <div className="relative z-10 px-8 py-12 md:px-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              {publishedAt ? (lang === 'ar' ? `آخر تحديث: ${publishedAt}` : `Last updated: ${publishedAt}`) : (lang === 'ar' ? 'محدث باستمرار' : 'Continuously updated')}
            </div>
            <h1 className="mt-6 text-3xl md:text-5xl font-black leading-tight">{title}</h1>
            <p className="mt-4 text-white/80 text-sm md:text-base max-w-3xl">{excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {pills.map((pill) => (
                <span key={pill} className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                  {pill}
                </span>
              ))}
              <button className="rounded-full bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#0f172a]">
                {lang === 'ar' ? 'اكتشف القائمة' : 'Explore list'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
            <BlogBlocksRenderer blocks={blocks} lang={lang} fallbackHtml={content || ''} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <div className="font-black mb-3">{lang === 'ar' ? 'محتويات الدليل' : 'Guide Contents'}</div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>{lang === 'ar' ? 'ملخص سريع للأفضل' : 'Quick picks'}</li>
              <li>{lang === 'ar' ? 'جدول المقارنة' : 'Comparison table'}</li>
              <li>{lang === 'ar' ? 'نص الدليل' : 'Guide content'}</li>
              <li>{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</li>
            </ul>
          </div>
          <div className="bg-[#E8F5EC] rounded-2xl border border-[#D1E7D8] p-5">
            <div className="font-black text-[#0f172a]">{lang === 'ar' ? 'هل تبحث عن شيء محدد؟' : 'Looking for something specific?'}</div>
            <div className="text-xs text-[#0f172a]/70 mt-2">
              {lang === 'ar' ? 'أخبرنا بما تريد وسنساعدك.' : 'Tell us what you need and we will help.'}
            </div>
            <button className="mt-4 w-full rounded-full bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#0f172a]">
              {lang === 'ar' ? 'اطلب دليلاً' : 'Request a guide'}
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default BlogDetailPage;
