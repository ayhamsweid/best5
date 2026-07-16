type JsonRecord = Record<string, unknown>;

export type ImportedBlock = {
  id?: string;
  type?: string;
  data?: JsonRecord;
  [key: string]: unknown;
};

export type ImportedPost = {
  values: JsonRecord;
  blocks: ImportedBlock[];
  category?: JsonRecord | string | null;
  tagNames: string[];
};

const postFields = [
  'title_ar',
  'title_en',
  'excerpt_ar',
  'excerpt_en',
  'content_ar',
  'content_en',
  'cover_image_url',
  'status',
  'published_at',
  'content_reviewed_at',
  'scheduled_at',
  'category_id',
  'tag_ids',
  'seo_title_ar',
  'seo_title_en',
  'seo_desc_ar',
  'seo_desc_en',
  'canonical_url',
  'og_image_url'
];

const isRecord = (value: unknown): value is JsonRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const asRecord = (value: unknown): JsonRecord => (isRecord(value) ? value : {});

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

const localized = (ar: unknown, en: unknown) => ({
  ar: typeof ar === 'string' ? ar : '',
  en: typeof en === 'string' ? en : ''
});

const hasLocalizedText = (value: unknown) => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (!isRecord(value)) return false;
  return [value.ar, value.en].some((item) => typeof item === 'string' && item.trim().length > 0);
};

const isPlaceholderUrl = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname === 'example.com' || hostname.endsWith('.example.com');
  } catch {
    return false;
  }
};

const pickPostValues = (source: JsonRecord) =>
  postFields.reduce<JsonRecord>((values, field) => {
    const value = source[field];
    if (value !== undefined) values[field] = value;
    return values;
  }, {});

const cleanPostValues = (values: JsonRecord) => {
  const cleaned = { ...values };
  for (const field of ['canonical_url', 'cover_image_url', 'og_image_url']) {
    const value = cleaned[field];
    if (
      (typeof value === 'string' && !value.trim()) ||
      isPlaceholderUrl(value)
    ) {
      delete cleaned[field];
    }
  }
  if (Array.isArray(cleaned.tag_ids)) {
    cleaned.tag_ids = cleaned.tag_ids.filter((value) => typeof value === 'string');
  }
  return cleaned;
};

const repairUnescapedQuotes = (raw: string) => {
  let output = '';
  let inString = false;
  let escaped = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    if (!inString) {
      output += char;
      if (char === '"') inString = true;
      continue;
    }
    if (escaped) {
      output += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      output += char;
      escaped = true;
      continue;
    }
    if (char !== '"') {
      output += char;
      continue;
    }

    let cursor = index + 1;
    while (cursor < raw.length && /\s/.test(raw[cursor])) cursor += 1;
    const next = raw[cursor];
    if (next === ',' || next === '}' || next === ']' || next === ':') {
      output += char;
      inString = false;
    } else {
      output += '\\"';
    }
  }

  return output;
};

const parseJson = (raw: string): unknown => {
  const normalized = raw.replace(/^\uFEFF/, '').trim();
  try {
    return JSON.parse(normalized);
  } catch {
    try {
      return JSON.parse(repairUnescapedQuotes(normalized));
    } catch {
      throw new Error('The selected file is not valid JSON. Check commas and quotation marks.');
    }
  }
};

const firstRecord = (sections: JsonRecord, keys: string[]) => {
  for (const key of keys) {
    if (isRecord(sections[key])) return sections[key] as JsonRecord;
  }
  return undefined;
};

const firstArray = (sections: JsonRecord, keys: string[]) => {
  for (const key of keys) {
    if (Array.isArray(sections[key])) return sections[key] as unknown[];
  }
  return undefined;
};

const iconName = (value: unknown) => {
  const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
  const names: Record<string, string> = {
    award: 'BadgeCheck',
    badge: 'BadgeCheck',
    crown: 'Crown',
    leaf: 'Leaf',
    pin: 'MapPin',
    'map-pin': 'MapPin',
    sparkles: 'Sparkles',
    star: 'Star',
    trending: 'TrendingUp',
    'trending-up': 'TrendingUp',
    zap: 'Zap'
  };
  return names[normalized] || 'Star';
};

const convertSectionsToBlocks = (sectionsValue: unknown): ImportedBlock[] => {
  const sections = asRecord(sectionsValue);
  if (!Object.keys(sections).length) return [];

  const blocks: ImportedBlock[] = [];
  const guide = firstRecord(sections, ['الدليل', 'guide', 'Guide']);
  if (guide) {
    const title = localized(guide.title_ar, guide.title_en);
    const content = localized(guide.content_ar, guide.content_en);
    if (hasLocalizedText(title) || hasLocalizedText(content)) {
      blocks.push({ type: 'guide', data: { title, content } });
    }
  }

  const quickPicks = firstArray(sections, [
    'ملخص سريع للأفضل',
    'quick_picks',
    'quickPicks',
    'cards'
  ]);
  if (quickPicks?.length) {
    const cards = quickPicks
      .filter(isRecord)
      .map((card) => ({ ...card, icon: iconName(card.icon) }));
    if (cards.length) {
      blocks.push({
        type: 'cards',
        data: {
          title: { ar: 'ملخص سريع للأفضل', en: 'Quick Picks' },
          cards
        }
      });
    }
  }

  const comparison = firstRecord(sections, [
    'جدول مقارنة سريع',
    'comparison',
    'comparison_table'
  ]);
  if (comparison) {
    const headers = asArray(comparison.headers);
    const rows = asArray(comparison.rows)
      .filter(Array.isArray)
      .filter((row) => row.some(hasLocalizedText));
    if (headers.length && rows.length) {
      blocks.push({
        type: 'comparison',
        data: {
          title: { ar: 'جدول مقارنة سريع', en: 'Quick Comparison' },
          headers,
          rows
        }
      });
    }
  }

  const rankedItems =
    firstArray(sections, [
      'restaurants',
      'items',
      'places',
      'hotels',
      'schools',
      'universities',
      'stores'
    ]) ||
    Object.values(sections).find(
      (value) =>
        Array.isArray(value) &&
        value.some((item) => isRecord(item) && (item.name || item.description || item.pros))
    );

  if (Array.isArray(rankedItems)) {
    rankedItems.filter(isRecord).forEach((item, index) => {
      const coverUrl =
        item.coverUrl || item.cover_url || item.cover_image_url || item.image_url || '';
      const galleryUrls =
        item.galleryUrls || item.gallery_urls || item.images || [];
      blocks.push({
        type: 'restaurant',
        data: {
          ...item,
          rank: item.rank || index + 1,
          reviews: item.reviews ?? item.reviews_count,
          mapUrl: item.mapUrl || item.map_url || '',
          coverUrl,
          galleryUrls: Array.isArray(galleryUrls) ? galleryUrls : []
        }
      });
    });
  }

  const faq = firstArray(sections, ['الأسئلة الشائعة', 'faq', 'faqs']);
  if (faq?.length) {
    const items = faq.filter(
      (item) => isRecord(item) && (hasLocalizedText(item.q) || hasLocalizedText(item.a))
    );
    if (items.length) {
      blocks.push({
        type: 'faq',
        data: {
          title: { ar: 'الأسئلة الشائعة', en: 'Frequently Asked Questions' },
          items
        }
      });
    }
  }

  return blocks;
};

const taxonomyValues = (value: unknown) => {
  if (typeof value === 'string') return [value];
  if (!isRecord(value)) return [];
  return [
    value.id,
    value.slug_ar,
    value.slug_en,
    value.name_ar,
    value.name_en
  ].filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
};

const normalizeTaxonomy = (value: string) => value.trim().toLocaleLowerCase();

export const resolveImportedPostValues = (
  imported: ImportedPost,
  categories: JsonRecord[] = [],
  tags: JsonRecord[] = []
) => {
  const values = { ...imported.values };
  const categoryKeys = new Set(taxonomyValues(imported.category).map(normalizeTaxonomy));
  if (categoryKeys.size) {
    const category = categories.find((item) =>
      taxonomyValues(item).some((value) => categoryKeys.has(normalizeTaxonomy(value)))
    );
    if (typeof category?.id === 'string') values.category_id = category.id;
    else delete values.category_id;
  }

  if (imported.tagNames.length) {
    const requested = new Set(imported.tagNames.map(normalizeTaxonomy));
    const tagIds = tags
      .filter((item) =>
        taxonomyValues(item).some((value) => requested.has(normalizeTaxonomy(value)))
      )
      .map((item) => item.id)
      .filter((id): id is string => typeof id === 'string');
    values.tag_ids = tagIds;
  }

  return values;
};

export const parseImportedPostJson = (raw: string): ImportedPost => {
  const parsed = parseJson(raw);
  const source = asRecord(parsed);
  const metadata = isRecord(source.meta) ? source.meta : source;
  const directBlocks =
    Array.isArray(parsed)
      ? parsed
      : Array.isArray(source.blocks)
      ? source.blocks
      : Array.isArray(source.content_blocks_json)
      ? source.content_blocks_json
      : [];
  const blocks = directBlocks.length
    ? directBlocks
    : convertSectionsToBlocks(source.sections);

  if (!blocks.length) {
    throw new Error(
      'The JSON file does not contain supported blocks or convertible sections.'
    );
  }

  const tagNames = Array.isArray(metadata.tags)
    ? metadata.tags.flatMap(taxonomyValues)
    : [];

  return {
    values: cleanPostValues(pickPostValues(metadata)),
    blocks: blocks as ImportedBlock[],
    category: (metadata.category as JsonRecord | string | null) || null,
    tagNames
  };
};
