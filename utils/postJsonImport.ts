type ImportedBlock = {
  id?: string;
  type?: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
};

type ImportedPost = {
  values: Record<string, unknown>;
  blocks: ImportedBlock[];
};

const postFields = [
  'title_ar',
  'title_en',
  'slug_ar',
  'slug_en',
  'excerpt_ar',
  'excerpt_en',
  'content_ar',
  'content_en',
  'cover_image_url',
  'status',
  'published_at',
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

const pickPostValues = (source: Record<string, unknown>) =>
  postFields.reduce<Record<string, unknown>>((values, field) => {
    if (source[field] !== undefined) {
      values[field] = source[field];
    }
    return values;
  }, {});

export const parseImportedPostJson = (raw: string): ImportedPost => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('The selected file is not valid JSON.');
  }

  const source = parsed as Record<string, unknown>;
  const blocks =
    Array.isArray(parsed)
      ? parsed
      : Array.isArray(source.blocks)
      ? source.blocks
      : Array.isArray(source.content_blocks_json)
      ? source.content_blocks_json
      : [];

  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw new Error('The JSON file does not contain any content blocks.');
  }

  return {
    values: Array.isArray(parsed) ? {} : pickPostValues(source),
    blocks: blocks as ImportedBlock[]
  };
};
