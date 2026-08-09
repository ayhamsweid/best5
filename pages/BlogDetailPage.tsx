import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useLang } from '../hooks/useLang';
import { fetchPublicPost, fetchPublicPosts } from '../services/api';
import BlogBlocksRenderer from '../components/BlogBlocksRenderer';
import { useInitialData, useSiteUrl } from '../context/InitialDataContext';
import { safeJsonForScript, sanitizeContentHtml } from '../utils/contentSecurity';
import { useLanguageSwitch } from '../context/LanguageSwitchContext';
import { formatSeoTitle } from '../server/src/common/seo-title';

interface BlogDetailPageProps {
  overridePost?: any;
  overrideLang?: 'ar' | 'en';
  robots?: string;
}

const taxonomyKeys = (value: any) =>
  [value?.id, value?.slug_ar, value?.slug_en, value?.name_ar, value?.name_en]
    .filter(Boolean)
    .map((item) => String(item).trim().toLowerCase());

const postTagKeys = (post: any) => {
  const tags = Array.isArray(post?.tags) ? post.tags : [];
  return new Set(
    tags.flatMap((entry: any) => taxonomyKeys(entry?.tag || entry)).filter(Boolean)
  );
};

const hasIntersection = (a: Set<string>, b: Set<string>) => {
  for (const key of a) {
    if (b.has(key)) return true;
  }
  return false;
};

const viewsCount = (post: any) => {
  const views = Number(post?.views);
  return Number.isFinite(views) ? views : 0;
};

const anchorArticleBlocks = (blocks: any[]) => {
  const usedIds = new Map<string, number>();
  return blocks.map((block, index) => {
    const rawId = String(block?.id || `${block?.type || 'section'}-${index + 1}`)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `section-${index + 1}`;
    const baseId = `block-${rawId}`;
    const occurrence = (usedIds.get(baseId) || 0) + 1;
    usedIds.set(baseId, occurrence);
    return {
      block,
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`
    };
  });
};

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ overridePost, overrideLang, robots }) => {
  const { slug } = useParams();
  const { lang: routeLang } = useLang();
  const lang = overrideLang || routeLang;
  const initialData = useInitialData();
  const siteUrl = useSiteUrl();
  const { setTranslatedPath } = useLanguageSwitch();
  const [post, setPost] = useState<any | null>(() => overridePost || initialData.post || null);
  const [allPosts, setAllPosts] = useState<any[]>(() => initialData.posts || []);

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

  useEffect(() => {
    fetchPublicPosts(lang)
      .then((items: any) => setAllPosts(Array.isArray(items) ? items : []))
      .catch(() => setAllPosts([]));
  }, [lang]);

  useEffect(() => {
    if (!post) {
      setTranslatedPath(undefined);
      return;
    }

    const translatedSlug = lang === 'ar' ? post.slug_en : post.slug_ar;
    const targetLang = lang === 'ar' ? 'en' : 'ar';
    setTranslatedPath(
      translatedSlug
        ? `/${targetLang}/blog/${encodeURIComponent(translatedSlug)}`
        : `/${targetLang}/blog`
    );

    return () => setTranslatedPath(undefined);
  }, [post, lang, setTranslatedPath]);

  const pills = useMemo(() => {
    const topic = [
      post?.slug_en,
      post?.category?.slug_en,
      post?.category?.name_en
    ].filter(Boolean).join(' ').toLowerCase();
    const localized = (en: string[], ar: string[]) => lang === 'ar' ? ar : en;

    if (/\b(cafe|coffee|work)\b/.test(topic)) {
      return localized(
        ['Wi-Fi', 'Noise Level', 'Location', 'Best For'],
        ['الواي فاي', 'مستوى الهدوء', 'الموقع', 'الأنسب لـ']
      );
    }
    if (/\b(school|university|education|study|medicine|business)\b/.test(topic)) {
      return localized(
        ['Curriculum', 'Fees', 'Location', 'Admissions'],
        ['المنهج', 'الرسوم', 'الموقع', 'القبول']
      );
    }
    if (/\b(hotel|resort|cabin|bungalow|stay)\b/.test(topic)) {
      return localized(
        ['Location', 'Room & Comfort', 'Value', 'Guest Fit'],
        ['الموقع', 'الغرفة والراحة', 'القيمة', 'ملاءمة الضيوف']
      );
    }
    if (/\b(restaurant|food|breakfast|steak|fish|sushi|mandi|yemeni)\b/.test(topic)) {
      return localized(
        ['Cuisine', 'Price Level', 'Location', 'Reservations'],
        ['نوع المطبخ', 'مستوى السعر', 'الموقع', 'الحجز']
      );
    }
    if (/\b(shopping|mall|market|bazaar|store|outlet)\b/.test(topic)) {
      return localized(
        ['Transport', 'Selection', 'Value', 'Opening Hours'],
        ['المواصلات', 'التنوع', 'القيمة', 'ساعات العمل']
      );
    }
    return localized(
      ['Best Season', 'Access', 'Location', 'Visitor Fit'],
      ['أفضل موسم', 'سهولة الوصول', 'الموقع', 'ملاءمة الزوار']
    );
  }, [lang, post?.slug_en, post?.category?.slug_en, post?.category?.name_en]);

  const pick = (value: any) => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value?.[lang] ?? '';
  };

  const relatedPosts = useMemo(() => {
    if (!post) return [];

    const currentCategory = new Set(taxonomyKeys(post.category || { id: post.category_id }));
    const currentTags = postTagKeys(post);
    const manualIds = [...new Set(Array.isArray(post.related_post_ids) ? post.related_post_ids : [])].slice(0, 4);
    const apiManualPosts = Array.isArray(post.related_posts) ? post.related_posts : [];
    const availableById = new Map(
      [...allPosts, ...apiManualPosts].map((item) => [item.id, item])
    );
    const manualPosts = manualIds
      .map((id) => availableById.get(id))
      .filter((item) => item && item.id !== post.id);
    const manualSet = new Set(manualPosts.map((item) => item.id));
    const automaticPosts = allPosts
      .filter((item) => item.id !== post.id && !manualSet.has(item.id))
      .map((item) => {
        const sameCategory = hasIntersection(currentCategory, new Set(taxonomyKeys(item.category || { id: item.category_id })));
        const sameTag = hasIntersection(currentTags, postTagKeys(item));
        const score = sameCategory && sameTag ? 3 : sameTag ? 2 : sameCategory ? 1 : 0;
        return { item, score };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const viewDiff = viewsCount(b.item) - viewsCount(a.item);
        if (viewDiff !== 0) return viewDiff;
        return new Date(b.item.published_at || 0).getTime() - new Date(a.item.published_at || 0).getTime();
      })
      .slice(0, 4 - manualPosts.length)
      .map(({ item }) => item);

    return [...manualPosts, ...automaticPosts].slice(0, 4);
  }, [allPosts, post]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-gray-500">Post not found.</div>
      </div>
    );
  }

  const title = lang === 'ar' ? post.title_ar : post.title_en;
  const excerpt = lang === 'ar' ? post.excerpt_ar : post.excerpt_en;
  const seoTitle = lang === 'ar' ? post.seo_title_ar : post.seo_title_en;
  const seoDesc = lang === 'ar' ? post.seo_desc_ar : post.seo_desc_en;
  const localizedSlug = lang === 'ar' ? post.slug_ar : post.slug_en;
  const canonical = `/${lang}/blog/${encodeURIComponent(localizedSlug || slug || '')}`;
  const ogImage = post.og_image_url || post.cover_image_url;
  const ogImageUrl = ogImage ? new URL(ogImage, `${siteUrl}/`).toString() : undefined;
  const canonicalUrl = canonical?.startsWith('http') ? canonical : `${siteUrl}${canonical}`;
  const authorName = post.author?.full_name || (lang === 'ar' ? 'فريق تحرير Best5' : 'Best5 Editorial Team');
  const hasPublicAuthorProfile = Boolean(
    post.author?.show_public_profile && post.author?.author_slug
  );
  const authorProfilePath = hasPublicAuthorProfile
    ? `/${lang}/author/${encodeURIComponent(post.author.author_slug)}`
    : undefined;
  const content = lang === 'ar' ? post.content_ar : post.content_en;
  const blocks = Array.isArray(post.content_blocks_json) ? post.content_blocks_json : [];
  const anchoredBlocks = anchorArticleBlocks(blocks);
  const displayedUpdateDate = post.content_reviewed_at || post.published_at;
  const publishedAt = displayedUpdateDate
    ? new Date(displayedUpdateDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { timeZone: 'UTC' })
    : '';
  const arUrl = post.slug_ar ? `${siteUrl}/ar/blog/${encodeURIComponent(post.slug_ar)}` : undefined;
  const enUrl = post.slug_en ? `${siteUrl}/en/blog/${encodeURIComponent(post.slug_en)}` : undefined;
  const rawSeoTitle = seoTitle || title;
  const finalSeoTitle = formatSeoTitle(rawSeoTitle);
  const faqItems = blocks.filter((block: any) => block.type === 'faq');
  const faqJsonLd = faqItems.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.flatMap((block: any) =>
          (block.data?.items || []).map((item: any) => ({
            '@type': 'Question',
            name: pick(item?.q) || '',
            acceptedAnswer: {
              '@type': 'Answer',
              text: pick(item?.a) || ''
            }
          }))
        )
      }
    : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'ar' ? 'الرئيسية' : 'Home',
        item: `${siteUrl}/${lang}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lang === 'ar' ? 'المدونة' : 'Blog',
        item: `${siteUrl}/${lang}/blog`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: canonicalUrl
      }
    ]
  };
  const tocItems = anchoredBlocks
    .map(({ block, id }) => {
      if (block.type === 'heading') return { id, label: pick(block.data?.text) };
      if (block.type === 'cards') return { id, label: pick(block.data?.title) || (lang === 'ar' ? 'ملخص سريع للأفضل' : 'Quick Picks') };
      if (block.type === 'comparison') return { id, label: pick(block.data?.title) || (lang === 'ar' ? 'جدول المقارنة' : 'Comparison Table') };
      if (block.type === 'restaurant') return { id, label: pick(block.data?.name) || (lang === 'ar' ? 'مطعم' : 'Restaurant') };
      if (block.type === 'map') return { id, label: lang === 'ar' ? 'خريطة المواقع' : 'Locations Map' };
      if (block.type === 'guide') return { id, label: pick(block.data?.title) || (lang === 'ar' ? 'نص الدليل' : 'Guide') };
      if (block.type === 'faq') return { id, label: pick(block.data?.title) || (lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ') };
      return null;
    })
    .filter((item): item is { id: string; label: string } => Boolean(item?.label));

  return (
    <div className="bg-[#F9FAFB] text-[#111827]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Seo
        title={finalSeoTitle}
        description={seoDesc || excerpt}
        canonical={canonicalUrl}
        image={ogImageUrl}
        type="article"
        url={canonicalUrl}
        robots={robots}
        alternates={{ ar: arUrl, en: enUrl, xDefault: enUrl || arUrl }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonForScript({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description: seoDesc || excerpt,
            image: ogImageUrl ? [ogImageUrl] : undefined,
            datePublished: post.published_at || undefined,
            dateModified: post.content_reviewed_at || post.published_at || undefined,
            author: post.author?.full_name
              ? {
                  '@type': 'Person',
                  name: authorName,
                  url: authorProfilePath ? `${siteUrl}${authorProfilePath}` : undefined
                }
              : {
                  '@type': 'Organization',
                  name: authorName,
                  url: siteUrl
                },
            publisher: {
              '@type': 'Organization',
              name: 'Best5',
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/favicon.png`
              }
            },
            inLanguage: lang,
            url: canonicalUrl,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': canonicalUrl
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonForScript(breadcrumbJsonLd)
        }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonForScript(faqJsonLd)
          }}
        />
      )}

      <section className="max-w-7xl mx-auto px-6 pt-10">
        <div className="relative overflow-hidden rounded-3xl bg-[#111827] text-white border border-white/10">
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={title}
              width={1600}
              height={900}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/70" />
          <div className="relative z-10 px-6 py-12 md:px-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#b11226]/20 text-[#ffcad2] px-4 py-1.5 text-xs font-bold border border-[#b11226]/30">
              {publishedAt
                ? post.content_reviewed_at
                  ? (lang === 'ar' ? `آخر مراجعة: ${publishedAt}` : `Last reviewed: ${publishedAt}`)
                  : (lang === 'ar' ? `تاريخ النشر: ${publishedAt}` : `Published: ${publishedAt}`)
                : (lang === 'ar' ? 'يُراجع باستمرار' : 'Continuously reviewed')}
            </div>
            <h1 className="mt-6 text-3xl md:text-6xl font-black leading-tight">{title}</h1>
            <p className="mt-4 text-white/80 text-sm md:text-lg max-w-3xl mx-auto">{excerpt}</p>
            <div className="mt-5 flex items-center justify-center gap-3 text-sm text-white/90">
              {post.author?.author_image_url && (
                <img
                  src={post.author.author_image_url}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
              )}
              <span>{lang === 'ar' ? 'إعداد' : 'By'}</span>
              {authorProfilePath ? (
                <Link className="font-bold underline decoration-white/40 underline-offset-4" to={authorProfilePath}>
                  {authorName}
                </Link>
              ) : (
                <span className="font-bold">{authorName}</span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {pills.map((pill) => (
                <span key={pill} className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold">
                  {pill}
                </span>
              ))}
              <a
                href={tocItems[0] ? `#${tocItems[0].id}` : '#article-content'}
                className="rounded-full bg-[#b11226] px-5 py-2.5 text-xs font-bold text-white"
              >
                {lang === 'ar' ? 'اكتشف القائمة' : 'Explore list'}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm">
              <div className="font-black mb-4">{lang === 'ar' ? 'محتويات الدليل' : 'Guide Contents'}</div>
              <nav className="space-y-3 text-sm">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    className="block text-gray-500 hover:text-[#b11226]"
                    href={`#${item.id}`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        <div id="article-content" className="lg:col-span-9 space-y-10">
          {!blocks.length && content ? (
            <div
              className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6"
              dangerouslySetInnerHTML={{ __html: sanitizeContentHtml(content) }}
            />
          ) : (
            anchoredBlocks.map(({ block, id }) => (
              <section key={id} id={id} className="scroll-mt-28">
                <BlogBlocksRenderer blocks={[block]} lang={lang} fallbackHtml="" />
              </section>
            ))
          )}
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-14">
          <div className="border-t border-[#E5E7EB] pt-10">
            <div className="flex items-end justify-between gap-6 mb-6">
              <div>
                <div className="text-xs font-black tracking-[0.35em] text-[#b11226] uppercase">
                  {lang === 'ar' ? 'Related' : 'Related'}
                </div>
                <h2 className="mt-3 text-3xl md:text-4xl font-black text-[#111827]">
                  {lang === 'ar' ? 'اقرأ أيضًا' : 'Read Also'}
                </h2>
              </div>
              <Link to={`/${lang}/blog`} className="hidden sm:inline-flex rounded-full border border-[#E5E7EB] bg-white px-5 py-2 text-sm font-bold text-[#4b5563] hover:text-[#b11226] transition">
                {lang === 'ar' ? 'كل المقالات' : 'All Articles'}
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedPosts.map((related) => {
                const relatedSlug = (lang === 'ar' ? related.slug_ar : related.slug_en) || related.slug_en || related.slug_ar;
                const relatedTitle = (lang === 'ar' ? related.title_ar : related.title_en) || related.title_ar || related.title_en;
                const relatedExcerpt = (lang === 'ar' ? related.excerpt_ar : related.excerpt_en) || related.excerpt_ar || related.excerpt_en;
                const categoryName = (lang === 'ar' ? related?.category?.name_ar : related?.category?.name_en) || related?.category?.name_ar || 'Best 5';
                return (
                  <Link
                    key={related.id}
                    to={`/${lang}/blog/${encodeURIComponent(relatedSlug)}`}
                    className="group overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {related.cover_image_url ? (
                      <img src={related.cover_image_url} alt={relatedTitle} width={600} height={400} loading="lazy" decoding="async" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="h-44 w-full bg-[#fff1f1]" />
                    )}
                    <div className="p-5">
                      <div className="mb-3 text-xs font-black text-[#b11226]">{categoryName}</div>
                      <h3 className="line-clamp-2 text-lg font-black leading-7 text-[#111827]">{relatedTitle}</h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">{relatedExcerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetailPage;
