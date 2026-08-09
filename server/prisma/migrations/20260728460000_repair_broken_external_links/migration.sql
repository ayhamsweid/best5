-- Replace placeholder Google Maps short links with stable search URLs derived
-- from the real venue name already stored in each content block.
UPDATE "Post" AS post
SET content_blocks_json = (
  SELECT jsonb_agg(
    CASE
      WHEN block->'data'->>'mapUrl' LIKE 'https://maps.app.goo.gl/%' THEN
        jsonb_set(
          block,
          '{data,mapUrl}',
          to_jsonb(
            'https://www.google.com/maps/search/?api=1&query=' ||
            replace(
              COALESCE(
                NULLIF(block->'data'->'name'->>'en', ''),
                NULLIF(block->'data'->'title'->>'en', ''),
                post.title_en
              ),
              ' ',
              '%20'
            )
          )
        )
      ELSE block
    END
    ORDER BY ordinality
  )
  FROM jsonb_array_elements(post.content_blocks_json)
    WITH ORDINALITY AS item(block, ordinality)
)
WHERE jsonb_typeof(content_blocks_json) = 'array'
  AND content_blocks_json::text LIKE '%https://maps.app.goo.gl/%';

-- Two cited pages are no longer available. Keep the citation destinations
-- useful by pointing to a live official homepage and a live school inspector
-- profile, without changing article copy.
UPDATE "Post"
SET content_blocks_json = replace(
  replace(
    content_blocks_json::text,
    'https://gunaydinet.com/en/branches/butcher-steakhouse.html',
    'https://gunaydinet.com/'
  ),
  'https://www.tarabyabritishschools.com/about-a-level',
  'https://www.isi.net/institutions/bso/tarabya-british-schools-9653'
)::jsonb
WHERE content_blocks_json::text LIKE '%https://gunaydinet.com/en/branches/butcher-steakhouse.html%'
   OR content_blocks_json::text LIKE '%https://www.tarabyabritishschools.com/about-a-level%';
