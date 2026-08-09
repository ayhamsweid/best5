-- Remove legacy keyword-list lines that were rendered as visible article copy.
-- The useful editorial introduction remains unchanged.
UPDATE "Post"
SET
  "content_blocks_json" = regexp_replace(
    "content_blocks_json"::text,
    E'\\\\nKeywords:[^"\\n]*',
    '',
    'gi'
  )::jsonb,
  "updated_at" = CURRENT_TIMESTAMP
WHERE "content_blocks_json"::text ~* 'Keywords[[:space:]]*:';
