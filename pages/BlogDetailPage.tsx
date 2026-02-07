import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicPost } from '../services/api';

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

  const quickPicks = useMemo(
    () => [
      {
        label: lang === 'ar' ? 'الأفضل إجمالاً' : 'Best Overall',
        title: lang === 'ar' ? 'الخيار المتوازن' : 'Balanced pick',
        note: lang === 'ar' ? 'أفضل مزيج بين الجودة والسعر' : 'Strong quality-to-price ratio'
      },
      {
        label: lang === 'ar' ? 'أفضل قيمة' : 'Best Value',
        title: lang === 'ar' ? 'سعر مقابل أداء' : 'Price to performance',
        note: lang === 'ar' ? 'مناسب للميزانيات المتوسطة' : 'Ideal for mid budgets'
      },
      {
        label: lang === 'ar' ? 'أفضل تجربة' : 'Best Experience',
        title: lang === 'ar' ? 'خدمة راقية' : 'Premium service',
        note: lang === 'ar' ? 'تجربة متكاملة ومحسوبة' : 'Refined, premium experience'
      }
    ],
    [lang]
  );

  const comparisonRows = useMemo(
    () => [
      { rank: 1, name: lang === 'ar' ? 'الخيار الأول' : 'Top Choice', score: '4.9', price: '₺₺₺', bestFor: lang === 'ar' ? 'الأفضل إجمالاً' : 'Best overall' },
      { rank: 2, name: lang === 'ar' ? 'خيار القيمة' : 'Value Pick', score: '4.7', price: '₺₺', bestFor: lang === 'ar' ? 'أفضل قيمة' : 'Best value' },
      { rank: 3, name: lang === 'ar' ? 'الخيار السريع' : 'Fast Pick', score: '4.6', price: '₺₺', bestFor: lang === 'ar' ? 'الخدمة السريعة' : 'Fast service' }
    ],
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickPicks.map((pick) => (
              <div key={pick.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                <div className="text-xs text-[#22C55E] font-bold mb-2">{pick.label}</div>
                <div className="font-black text-lg text-[#111827]">{pick.title}</div>
                <div className="text-xs text-gray-500 mt-2">{pick.note}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5E7EB] font-black">
              {lang === 'ar' ? 'جدول مقارنة سريع' : 'Quick Comparison'}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F9FAFB] text-gray-500 text-xs">
                  <tr>
                    <th className="px-4 py-3 text-start">#</th>
                    <th className="px-4 py-3 text-start">{lang === 'ar' ? 'الاسم' : 'Name'}</th>
                    <th className="px-4 py-3 text-start">{lang === 'ar' ? 'التقييم' : 'Score'}</th>
                    <th className="px-4 py-3 text-start">{lang === 'ar' ? 'السعر' : 'Price'}</th>
                    <th className="px-4 py-3 text-start">{lang === 'ar' ? 'أفضل لـ' : 'Best for'}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.rank} className="border-b last:border-none">
                      <td className="px-4 py-4 font-bold">{row.rank}</td>
                      <td className="px-4 py-4">{row.name}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#166534]">
                          {row.score}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500">{row.price}</td>
                      <td className="px-4 py-4 text-gray-500">{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
            <h2 className="text-xl font-black mb-4">{lang === 'ar' ? 'نص الدليل' : 'Guide Content'}</h2>
            <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
              {blocks.length === 0 && (
                <div dangerouslySetInnerHTML={{ __html: content || '' }} />
              )}
              {blocks.map((block: any) => {
                if (block.type === 'heading') {
                  const Tag = (`h${block.data?.level || 2}` as keyof JSX.IntrinsicElements);
                  return <Tag key={block.id} className="font-black text-[#111827]">{block.data?.text}</Tag>;
                }
                if (block.type === 'paragraph') {
                  return <p key={block.id} className="text-gray-600">{block.data?.text}</p>;
                }
                if (block.type === 'image') {
                  return (
                    <figure key={block.id} className="space-y-2">
                      {block.data?.url && <img src={block.data.url} alt="" className="rounded-2xl w-full object-cover" />}
                      {block.data?.caption && <figcaption className="text-xs text-gray-500">{block.data.caption}</figcaption>}
                    </figure>
                  );
                }
                if (block.type === 'gallery') {
                  return (
                    <div key={block.id} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(block.data?.urls || []).filter(Boolean).map((url: string, idx: number) => (
                        <img key={`${block.id}-${idx}`} src={url} alt="" className="rounded-xl object-cover h-40 w-full" />
                      ))}
                    </div>
                  );
                }
                if (block.type === 'map') {
                  return (
                    <div key={block.id} className="rounded-2xl overflow-hidden border border-[#E5E7EB]">
                      {block.data?.embedUrl ? (
                        <iframe
                          src={block.data.embedUrl}
                          className="w-full h-64"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      ) : (
                        <div className="p-4 text-gray-500">Map embed URL missing</div>
                      )}
                    </div>
                  );
                }
                if (block.type === 'video') {
                  return (
                    <div key={block.id} className="rounded-2xl overflow-hidden border border-[#E5E7EB]">
                      {block.data?.embedUrl ? (
                        <iframe
                          src={block.data.embedUrl}
                          className="w-full h-64"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="p-4 text-gray-500">Video embed URL missing</div>
                      )}
                    </div>
                  );
                }
                if (block.type === 'cta') {
                  return (
                    <div key={block.id} className="rounded-2xl bg-[#E8F5EC] border border-[#D1E7D8] p-5 flex items-center justify-between gap-4">
                      <div className="font-semibold text-[#0f172a]">{block.data?.label || 'CTA'}</div>
                      {block.data?.url && (
                        <a className="rounded-full bg-[#22C55E] px-4 py-2 text-xs font-bold text-[#0f172a]" href={block.data.url} target="_blank" rel="noreferrer">
                          {lang === 'ar' ? 'اذهب' : 'Go'}
                        </a>
                      )}
                    </div>
                  );
                }
                if (block.type === 'summary') {
                  return (
                    <div key={block.id} className="rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] p-5">
                      <div className="font-black text-[#111827] mb-3">{block.data?.title || (lang === 'ar' ? 'ملخص سريع' : 'Quick Summary')}</div>
                      <ul className="list-disc ps-5 text-gray-600 space-y-1">
                        {(block.data?.items || []).filter(Boolean).map((item: string, idx: number) => (
                          <li key={`${block.id}-item-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                if (block.type === 'comparison') {
                  return (
                    <div key={block.id} className="rounded-2xl border border-[#E5E7EB] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-[#F9FAFB] text-gray-500 text-xs">
                            <tr>
                              {(block.data?.headers || []).map((h: string, idx: number) => (
                                <th key={`${block.id}-h-${idx}`} className="px-4 py-3 text-start">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {(block.data?.rows || []).map((row: string[], rowIdx: number) => (
                              <tr key={`${block.id}-r-${rowIdx}`} className="border-b last:border-none">
                                {(block.data?.headers || []).map((_h: string, colIdx: number) => (
                                  <td key={`${block.id}-r-${rowIdx}-${colIdx}`} className="px-4 py-3 text-gray-600">
                                    {row[colIdx] || '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }
                if (block.type === 'cards') {
                  return (
                    <div key={block.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(block.data?.cards || []).map((card: any, idx: number) => (
                        <div key={`${block.id}-card-${idx}`} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                          <div className="text-xs text-[#22C55E] font-bold mb-2">{lang === 'ar' ? 'تقييم' : 'Rating'}</div>
                          <div className="font-black text-lg text-[#111827]">{card.title || '—'}</div>
                          {card.score && (
                            <div className="mt-2 inline-flex items-center rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#166534]">
                              {card.score}
                            </div>
                          )}
                          {card.note && <div className="text-xs text-gray-500 mt-2">{card.note}</div>}
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="font-black mb-3">{lang === 'ar' ? 'دليل الاختيار' : 'Buying Guide'}</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>{lang === 'ar' ? 'حدد أولويتك الأساسية قبل المقارنة.' : 'Define your top priority before comparing.'}</li>
                <li>{lang === 'ar' ? 'وازن بين السعر والجودة والخدمة.' : 'Balance price, quality, and service.'}</li>
                <li>{lang === 'ar' ? 'اقرأ الملاحظات التفصيلية لكل خيار.' : 'Review the detailed notes for each option.'}</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
              <h3 className="font-black mb-3">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <div className="font-semibold text-[#111827]">{lang === 'ar' ? 'كيف تم اختيار القائمة؟' : 'How is the list selected?'}</div>
                  <div>{lang === 'ar' ? 'بناءً على جودة التجربة ومعايير واضحة.' : 'Based on experience quality and clear criteria.'}</div>
                </div>
                <div>
                  <div className="font-semibold text-[#111827]">{lang === 'ar' ? 'هل الترتيب ثابت؟' : 'Is the ranking fixed?'}</div>
                  <div>{lang === 'ar' ? 'نحدّث الترتيب باستمرار حسب البيانات.' : 'We update rankings as data changes.'}</div>
                </div>
              </div>
            </div>
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
