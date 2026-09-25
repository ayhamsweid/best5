import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import { useInitialData, useSiteUrl } from '../context/InitialDataContext';
import { useLanguageSwitch } from '../context/LanguageSwitchContext';
import { useLang } from '../hooks/useLang';
import { fetchPublicAuthor } from '../services/api';
import { safeJsonForScript, safeLinkUrl, safeResourceUrl } from '../utils/contentSecurity';

const AuthorPage: React.FC = () => {
  const { slug = '' } = useParams();
  const { lang } = useLang();
  const initialData = useInitialData();
  const siteUrl = useSiteUrl();
  const { setTranslatedPath } = useLanguageSwitch();
  const initialAuthor = initialData.author?.author_slug === slug ? initialData.author : null;
  const [author, setAuthor] = useState<any | null>(initialAuthor);
  const [loading, setLoading] = useState(!initialAuthor);

  useEffect(() => {
    setLoading(true);
    fetchPublicAuthor(slug)
      .then(setAuthor)
      .catch(() => setAuthor(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    setTranslatedPath(`/${lang === 'ar' ? 'en' : 'ar'}/author/${encodeURIComponent(slug)}`);
    return () => setTranslatedPath(undefined);
  }, [lang, setTranslatedPath, slug]);

  const articles = useMemo(() => author?.posts || [], [author]);

  if (loading) {
    return <div className="min-h-[50vh] bg-[#F9FAFB]" aria-busy="true" />;
  }

  if (!author) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <Seo
          title={lang === 'ar' ? 'الكاتب غير موجود | Best5' : 'Author not found | Best5'}
          description=""
          canonical={`${siteUrl}/${lang}/author/${encodeURIComponent(slug)}`}
          status={404}
        />
        <h1 className="text-3xl font-black">
          {lang === 'ar' ? 'الكاتب غير موجود' : 'Author not found'}
        </h1>
      </div>
    );
  }

  const title = lang === 'ar' ? author.author_title_ar : author.author_title_en;
  const bio = lang === 'ar' ? author.author_bio_ar : author.author_bio_en;
  const expertise = lang === 'ar' ? author.author_expertise_ar : author.author_expertise_en;
  const canonical = `${siteUrl}/${lang}/author/${encodeURIComponent(author.author_slug)}`;
  const arUrl = `${siteUrl}/ar/author/${encodeURIComponent(author.author_slug)}`;
  const enUrl = `${siteUrl}/en/author/${encodeURIComponent(author.author_slug)}`;
  const description = bio || (
    lang === 'ar'
      ? `تعرف على مقالات ${author.full_name} المنشورة في Best5.`
      : `Explore articles by ${author.full_name} published on Best5.`
  );
  const authorImage = safeResourceUrl(author.author_image_url);
  const authorWebsite = safeLinkUrl(author.author_website_url);
  const authorSocial = safeLinkUrl(author.author_social_url);
  const sameAs = [authorWebsite, authorSocial].filter(Boolean);

  return (
    <main className="bg-[#F9FAFB] text-[#111827]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Seo
        title={`${author.full_name} | Best5`}
        description={description}
        canonical={canonical}
        image={authorImage || undefined}
        url={canonical}
        alternates={{ ar: arUrl, en: enUrl, xDefault: enUrl }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonForScript({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: author.full_name,
            jobTitle: title || undefined,
            description: bio || undefined,
            image: authorImage || undefined,
            url: canonical,
            sameAs: sameAs.length ? sameAs : undefined
          })
        }}
      />

      <section className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-7 shadow-sm md:p-10">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
            {authorImage ? (
              <img
                src={authorImage}
                alt={author.full_name}
                width={160}
                height={160}
                className="h-32 w-32 rounded-2xl object-cover"
              />
            ) : (
              <div
                className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-[#fff1f1] text-4xl font-black text-[#b11226]"
                aria-hidden="true"
              >
                {String(author.full_name).trim().charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black md:text-5xl">{author.full_name}</h1>
                {author.author_verified && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {lang === 'ar' ? 'ملف موثّق' : 'Verified profile'}
                  </span>
                )}
              </div>
              {title && <p className="mt-3 text-lg font-bold text-[#b11226]">{title}</p>}
              {bio && <p className="mt-5 whitespace-pre-line leading-8 text-gray-600">{bio}</p>}
              {Array.isArray(expertise) && expertise.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-sm font-black">
                    {lang === 'ar' ? 'مجالات الخبرة' : 'Areas of expertise'}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {expertise.map((item: string) => (
                      <span key={item} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(authorWebsite || authorSocial) && (
                <div className="mt-6 flex flex-wrap gap-4 text-sm font-bold text-[#b11226]">
                  {authorWebsite && (
                    <a href={authorWebsite} rel="noopener noreferrer" target="_blank">
                      {lang === 'ar' ? 'الموقع الشخصي' : 'Website'}
                    </a>
                  )}
                  {authorSocial && (
                    <a href={authorSocial} rel="noopener noreferrer" target="_blank">
                      {lang === 'ar' ? 'الحساب المهني' : 'Professional profile'}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-3xl font-black">
            {lang === 'ar' ? `مقالات ${author.full_name}` : `Articles by ${author.full_name}`}
          </h2>
          {articles.length ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {articles.map((post: any) => {
                const postSlug = lang === 'ar' ? post.slug_ar : post.slug_en;
                const postTitle = lang === 'ar' ? post.title_ar : post.title_en;
                const excerpt = lang === 'ar' ? post.excerpt_ar : post.excerpt_en;
                return (
                  <Link
                    key={post.id}
                    to={`/${lang}/blog/${encodeURIComponent(postSlug)}`}
                    className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {post.cover_image_url && (
                      <img
                        src={post.cover_image_url}
                        alt={postTitle}
                        width={700}
                        height={420}
                        loading="lazy"
                        className="h-52 w-full object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-black leading-8">{postTitle}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">{excerpt}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="mt-5 text-gray-500">
              {lang === 'ar' ? 'لا توجد مقالات منشورة لهذا الكاتب حاليًا.' : 'No published articles yet.'}
            </p>
          )}
        </section>
      </section>
    </main>
  );
};

export default AuthorPage;
