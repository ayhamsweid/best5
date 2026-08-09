-- Implement the roadmap's "Immediate" internal-link relationships through
-- the existing ordered related-post system. This changes navigation only;
-- it does not rewrite article copy.

UPDATE "Post"
SET related_post_ids = ARRAY[
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-outlet-malls-you-should-visit-in-istanbul-2026-guide'),
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-traditional-markets-in-istanbul-2026-guide'),
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-shopping-streets-in-istanbul-2026-guide')
]::uuid[]
WHERE slug_en = 'best-5-shopping-malls-in-istanbul-2026-guide';

UPDATE "Post"
SET related_post_ids = ARRAY[
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-shopping-malls-in-istanbul-2026-guide')
]::uuid[]
WHERE slug_en = 'best-5-outlet-malls-you-should-visit-in-istanbul-2026-guide';

UPDATE "Post"
SET related_post_ids = ARRAY[
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-shopping-streets-in-istanbul-2026-guide'),
  (SELECT id FROM "Post" WHERE slug_en = 'grand-bazaar-vs-spice-bazaar-which-should-you-visit')
]::uuid[]
WHERE slug_en = 'best-5-traditional-markets-in-istanbul-2026-guide';

UPDATE "Post"
SET related_post_ids = ARRAY[
  (SELECT id FROM "Post" WHERE slug_en = 'top-5-international-schools-for-arab-families-in-istanbul'),
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-british-schools-in-istanbul-2026'),
  (SELECT id FROM "Post" WHERE slug_en = 'international-school-fees-in-istanbul-2026-2027'),
  (SELECT id FROM "Post" WHERE slug_en = 'meb-approved-international-schools-in-istanbul-2026')
]::uuid[]
WHERE slug_en = 'best-5-international-schools-in-istanbul';

UPDATE "Post"
SET related_post_ids = ARRAY[
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-mandi-restaurants-in-istanbul-2026'),
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-arabic-restaurants-in-istanbul-2026-guide')
]::uuid[]
WHERE slug_en = 'best-5-yemeni-restaurants-in-istanbul-authentic-mandi-guide';

UPDATE "Post"
SET related_post_ids = ARRAY[
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-yemeni-restaurants-in-istanbul-authentic-mandi-guide')
]::uuid[]
WHERE slug_en = 'best-5-arabic-restaurants-in-istanbul-2026-guide';

UPDATE "Post"
SET related_post_ids = ARRAY[
  (SELECT id FROM "Post" WHERE slug_en = 'top-5-natural-lakes-in-turkey-2026-guide')
]::uuid[]
WHERE slug_en = 'best-5-waterfalls-to-visit-in-turkey-2026-guide';

UPDATE "Post"
SET related_post_ids = ARRAY[
  (SELECT id FROM "Post" WHERE slug_en = 'best-5-waterfalls-to-visit-in-turkey-2026-guide'),
  (SELECT id FROM "Post" WHERE slug_en = 'top-5-mountain-cities-in-turkey-2026-guide')
]::uuid[]
WHERE slug_en = 'top-5-natural-lakes-in-turkey-2026-guide';
