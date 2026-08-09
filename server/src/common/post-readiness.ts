type Lang = 'ar' | 'en';

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const localized = (value: unknown, lang: Lang) => {
  if (typeof value === 'string') return value.trim();
  if (!value || typeof value !== 'object') return '';
  return text((value as Record<string, unknown>)[lang]);
};

const collectStrings = (value: unknown, output: string[] = []) => {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, output));
  else if (value && typeof value === 'object') {
    Object.values(value as Record<string, unknown>).forEach((item) => collectStrings(item, output));
  }
  return output;
};

const hasLocalizedText = (value: unknown, lang: Lang): boolean => {
  if (typeof value === 'string') {
    const candidate = value.trim();
    return Boolean(candidate && !/^https?:\/\//i.test(candidate) && !candidate.startsWith('/'));
  }
  if (Array.isArray(value)) return value.some((item) => hasLocalizedText(item, lang));
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if ('ar' in record || 'en' in record) return Boolean(text(record[lang]));
  return Object.values(record).some((item) => hasLocalizedText(item, lang));
};

const blockHasLocalizedContent = (block: any, lang: Lang) => hasLocalizedText(block?.data, lang);

const internalLinkCount = (value: unknown) => {
  const links = collectStrings(value)
    .flatMap((item) => item.match(/(?:https?:\/\/(?:www\.)?best5\.com\.tr)?\/(?:ar|en)\/[^\s"'<>)]*/gi) || [])
    .map((item) => item.replace(/^https?:\/\/(?:www\.)?best5\.com\.tr/i, ''));
  return new Set(links).size;
};

const languageLeak = (lang: Lang, value: string) => {
  const arabic = (value.match(/[\u0600-\u06ff]/g) || []).length;
  const latin = (value.match(/[A-Za-z]/g) || []).length;
  if (lang === 'en') return arabic >= 12 && arabic > latin * 0.15;
  return latin >= 40 && arabic < latin * 0.35;
};

export type PostReadiness = {
  errors: string[];
  warnings: string[];
  stats: {
    seoTitleAr: number;
    seoTitleEn: number;
    seoDescriptionAr: number;
    seoDescriptionEn: number;
    internalLinks: number;
  };
};

export const getPostReadiness = (post: Record<string, any>): PostReadiness => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const blocks = Array.isArray(post.content_blocks_json) ? post.content_blocks_json : [];
  const requiredFields: Array<[string, string]> = [
    ['title_ar', 'Arabic title is required.'],
    ['title_en', 'English title is required.'],
    ['excerpt_ar', 'Arabic excerpt is required.'],
    ['excerpt_en', 'English excerpt is required.'],
    ['seo_title_ar', 'Arabic SEO title is required.'],
    ['seo_title_en', 'English SEO title is required.'],
    ['seo_desc_ar', 'Arabic meta description is required.'],
    ['seo_desc_en', 'English meta description is required.'],
    ['cover_image_url', 'Cover image is required.']
  ];

  requiredFields.forEach(([field, message]) => {
    if (!text(post[field])) errors.push(message);
  });

  const primaryEnglish = [
    post.title_en,
    post.excerpt_en,
    post.seo_title_en,
    post.seo_desc_en
  ].map(text).join(' ');
  const primaryArabic = [
    post.title_ar,
    post.excerpt_ar,
    post.seo_title_ar,
    post.seo_desc_ar
  ].map(text).join(' ');
  if (languageLeak('en', primaryEnglish)) {
    errors.push('English title, excerpt, or SEO fields contain predominantly Arabic text.');
  }
  if (languageLeak('ar', primaryArabic)) {
    errors.push('Arabic title, excerpt, or SEO fields contain predominantly English text.');
  }

  for (const lang of ['ar', 'en'] as const) {
    const legacyContent = text(post[`content_${lang}`]);
    if (!legacyContent && !blocks.some((block: any) => blockHasLocalizedContent(block, lang))) {
      errors.push(`${lang === 'ar' ? 'Arabic' : 'English'} article content is required.`);
    }
  }

  blocks.forEach((block: any, index: number) => {
    if (block?.type === 'image' && text(block?.data?.url)) {
      if (!localized(block.data?.caption, 'ar')) errors.push(`Image ${index + 1} needs Arabic alt text/caption.`);
      if (!localized(block.data?.caption, 'en')) errors.push(`Image ${index + 1} needs English alt text/caption.`);
    }
    if (block?.type === 'gallery' && (block?.data?.urls || []).some((url: unknown) => text(url))) {
      if (!localized(block.data?.title, 'ar')) errors.push(`Gallery ${index + 1} needs an Arabic title/alt text.`);
      if (!localized(block.data?.title, 'en')) errors.push(`Gallery ${index + 1} needs an English title/alt text.`);
    }
  });

  const seoTitleAr = text(post.seo_title_ar).length;
  const seoTitleEn = text(post.seo_title_en).length;
  const seoDescriptionAr = text(post.seo_desc_ar).length;
  const seoDescriptionEn = text(post.seo_desc_en).length;
  if (seoTitleAr > 60) warnings.push(`Arabic SEO title is ${seoTitleAr} characters; recommended maximum is 60.`);
  if (seoTitleEn > 60) warnings.push(`English SEO title is ${seoTitleEn} characters; recommended maximum is 60.`);
  if (seoDescriptionAr > 160) warnings.push(`Arabic meta description is ${seoDescriptionAr} characters; recommended maximum is 160.`);
  if (seoDescriptionEn > 160) warnings.push(`English meta description is ${seoDescriptionEn} characters; recommended maximum is 160.`);
  if ((text(post.seo_title_ar).match(/best5/gi) || []).length > 1 || (text(post.seo_title_en).match(/best5/gi) || []).length > 1) {
    errors.push('SEO title contains Best5 more than once.');
  }

  const searchableText = collectStrings({
    title_ar: post.title_ar,
    title_en: post.title_en,
    content_ar: post.content_ar,
    content_en: post.content_en,
    blocks
  }).join('\n');
  if (/(?:^|\n|\s)keywords\s*:/i.test(searchableText)) errors.push('Visible “Keywords:” text was detected.');
  if (collectStrings(blocks).some((value) => /^\s*[—–-]\s*$/.test(value))) {
    errors.push('An unexplained dash placeholder was detected in an article block.');
  }
  if (!blocks.some((block: any) => block?.type === 'faq' && (block?.data?.items || []).length)) warnings.push('No FAQ block found.');
  if (!blocks.some((block: any) => block?.type === 'comparison' && (block?.data?.rows || []).length)) warnings.push('No comparison table found.');

  const internalLinks = internalLinkCount({ content_ar: post.content_ar, content_en: post.content_en, blocks });
  if (internalLinks < 4) warnings.push(`Only ${internalLinks} internal links found; recommended minimum is 4.`);
  if (!post.content_reviewed_at) errors.push('Content review date is required before publishing.');

  return {
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
    stats: { seoTitleAr, seoTitleEn, seoDescriptionAr, seoDescriptionEn, internalLinks }
  };
};
