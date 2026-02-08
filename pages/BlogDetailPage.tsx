import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicPost } from '../services/api';
import BlogBlocksRenderer from '../components/BlogBlocksRenderer';

interface BlogDetailPageProps {
  overridePost?: any;
  overrideLang?: 'ar' | 'en';
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ overridePost, overrideLang }) => {
  const { slug } = useParams();
  const { lang: routeLang } = useLang();
  const lang = overrideLang || routeLang;
  const [post, setPost] = useState<any | null>(null);

  useEffect(() => {
    if (overridePost) {
      setPost(overridePost);
      return;
    }
    if (!slug) return;
    fetchPublicPost(lang, slug)
      .then(setPost)
      .catch(() => setPost(null));
  }, [slug, lang, overridePost]);

  const pills = useMemo(
    () =>
      lang === 'ar'
        ? ['الأعلى تقييماً', 'الأفضل قيمة', 'خيار العائلات', 'الخدمة السريعة']
        : ['Top Rated', 'Best Value', 'Family Pick', 'Fast Service'],
    [lang]
  );

  const pick = (value: any) => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value?.[lang] ?? value?.ar ?? value?.en ?? '';
  };

  

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
  const tocItems = blocks
    .map((block: any) => {
      if (block.type === 'cards') return { id: `block-${block.id}`, label: pick(block.data?.title) || (lang === 'ar' ? 'ملخص سريع للأفضل' : 'Quick Picks') };
      if (block.type === 'comparison') return { id: `block-${block.id}`, label: pick(block.data?.title) || (lang === 'ar' ? 'جدول المقارنة' : 'Comparison Table') };
      if (block.type === 'restaurant') return { id: `block-${block.id}`, label: pick(block.data?.name) || (lang === 'ar' ? 'مطعم' : 'Restaurant') };
      if (block.type === 'map') return { id: `block-${block.id}`, label: lang === 'ar' ? 'خريطة المواقع' : 'Locations Map' };
      if (block.type === 'guide') return { id: `block-${block.id}`, label: pick(block.data?.title) || (lang === 'ar' ? 'نص الدليل' : 'Guide') };
      if (block.type === 'faq') return { id: `block-${block.id}`, label: pick(block.data?.title) || (lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ') };
      return null;
    })
    .filter(Boolean) as Array<{ id: string; label: string }>;

  return (
    <div className="bg-[#F9FAFB] text-[#111827] dark:bg-[#0b1224] dark:text-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Seo title={`${title} | Besiktas City Guide`} description={excerpt} canonical={`/${lang}/blog/${slug}`} />

      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-[#111827] text-white border border-white/10">
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
          <div className="relative z-10 px-6 py-12 md:px-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#22C55E]/20 text-[#22C55E] px-4 py-1.5 text-xs font-bold border border-[#22C55E]/30">
              {publishedAt ? (lang === 'ar' ? `آخر تحديث: ${publishedAt}` : `Last updated: ${publishedAt}`) : (lang === 'ar' ? 'محدث باستمرار' : 'Continuously updated')}
            </div>
            <h1 className="mt-6 text-3xl md:text-6xl font-black leading-tight">{title}</h1>
            <p className="mt-4 text-white/80 text-sm md:text-lg max-w-3xl mx-auto">{excerpt}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {pills.map((pill) => (
                <span key={pill} className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                  {pill}
                </span>
              ))}
              <button className="rounded-full bg-[#22C55E] px-5 py-2.5 text-xs font-bold text-[#0f172a]">
                {lang === 'ar' ? 'اكتشف القائمة' : 'Explore list'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm dark:bg-[#111827] dark:border-white/10">
              <div className="font-black mb-4">{lang === 'ar' ? 'محتويات الدليل' : 'Guide Contents'}</div>
              <nav className="space-y-3 text-sm">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    className="block text-gray-500 hover:text-[#22C55E]"
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
            <div className="bg-[#E8F5EC] p-6 rounded-2xl border border-[#D1E7D8] dark:bg-[#0f172a] dark:border-white/10">
              <div className="font-black text-[#0f172a]">{lang === 'ar' ? 'هل تبحث عن السكن؟' : 'Looking for stays?'}</div>
              <div className="text-xs text-[#0f172a]/70 mt-2 dark:text-white/70">
                {lang === 'ar' ? 'اكتشف أفضل الفنادق القريبة من مراكز الطعام.' : 'Discover top hotels near the food hotspots.'}
              </div>
              <button className="mt-4 w-full rounded-lg bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#0f172a]">
                {lang === 'ar' ? 'عرض الفنادق' : 'View hotels'}
              </button>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-10">
          {!blocks.length && content ? (
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6 dark:bg-[#111827] dark:border-white/10" dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            blocks.map((block: any) => (
              <section key={block.id} id={`block-${block.id}`} className="scroll-mt-28">
                <BlogBlocksRenderer blocks={[block]} lang={lang} fallbackHtml="" />
              </section>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetailPage;
