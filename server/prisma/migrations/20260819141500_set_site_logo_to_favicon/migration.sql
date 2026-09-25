UPDATE "Settings"
SET "header_json" = jsonb_set(
  COALESCE("header_json", '{}'::jsonb),
  '{logoImageUrl}',
  '"/uploads/favicon.webp"'::jsonb,
  true
),
"updated_at" = CURRENT_TIMESTAMP
WHERE "id" = 'singleton';
