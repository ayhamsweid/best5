UPDATE "Settings"
SET "header_json" = jsonb_set(
  COALESCE("header_json", '{}'::jsonb),
  '{logoImageUrl}',
  '"/favicon.png"'::jsonb,
  true
),
"updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'singleton'
  AND COALESCE("header_json"->>'logoImageUrl', '') IN ('', '/uploads/favicon.webp');
