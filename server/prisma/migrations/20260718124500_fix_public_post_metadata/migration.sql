-- Replace a temporary public slug with the localized slugs already advertised in llms.txt.
UPDATE "Post"
SET "slug_ar" = 'افضل-خمس-فنادق-خمس-نجوم-في-تقسيم-2026',
    "slug_en" = 'best-five-5-star-hotels-in-taksim-2026-guide'
WHERE "id" = 'f9cac92a-e888-48be-b782-1e60d5544678'
  AND "slug_ar" = 'test'
  AND "slug_en" = 'test';

-- Ensure every published language version has a useful search-result description.
UPDATE "Post"
SET "excerpt_en" = 'Discover five of the best resorts in Antalya, with practical comparisons of location, facilities, atmosphere, and value for a memorable stay.',
    "seo_desc_en" = 'Discover five of the best resorts in Antalya, with practical comparisons of location, facilities, atmosphere, and value for a memorable stay.'
WHERE "id" = '0c0c9ff3-cda3-4f3b-98bb-834604f6027e'
  AND coalesce(trim("excerpt_en"), '') = '';

UPDATE "Post"
SET "excerpt_en" = 'Compare five top Bosphorus-view hotels in Besiktas, including location, amenities, views, and value to choose the right Istanbul stay.',
    "seo_desc_en" = 'Compare five top Bosphorus-view hotels in Besiktas, including location, amenities, views, and value to choose the right Istanbul stay.'
WHERE "id" = '69ae9eac-36ed-4de9-a844-a379dacea801'
  AND coalesce(trim("excerpt_en"), '') = '';
