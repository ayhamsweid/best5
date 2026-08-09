-- Some older blocks use the legacy snake_case field in addition to mapUrl.
-- Normalize those values too so stale placeholder links do not remain in data.
UPDATE "Post" AS post
SET content_blocks_json = (
  SELECT jsonb_agg(
    CASE
      WHEN block->'data'->>'map_url' LIKE 'https://maps.app.goo.gl/%' THEN
        jsonb_set(
          block,
          '{data,map_url}',
          to_jsonb(
            'https://www.google.com/maps/search/?api=1&query=' ||
            replace(
              replace(
                replace(
                  replace(
                    COALESCE(
                      NULLIF(block->'data'->'name'->>'en', ''),
                      NULLIF(block->'data'->'title'->>'en', ''),
                      post.title_en
                    ),
                    '%',
                    '%25'
                  ),
                  '&',
                  '%26'
                ),
                '#',
                '%23'
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
