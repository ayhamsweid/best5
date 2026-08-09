UPDATE "Post"
SET
  "content_blocks_json" = regexp_replace(
    "content_blocks_json"::text,
    '/uploads/[^"]+\.jpg',
    '/uploads/cheap-hotels.jpg',
    'g'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = '36612c9a-dfeb-4023-b8d7-7e0aefe2fbc4';

UPDATE "Post"
SET
  "cover_image_url" = '/uploads/bestHotels.jpg',
  "og_image_url" = '/uploads/bestHotels.jpg',
  "content_blocks_json" = regexp_replace(
    "content_blocks_json"::text,
    '/uploads/[^"]+\.jpg',
    '/uploads/bestHotels.jpg',
    'g'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" IN (
  '8dc4fbca-b1fb-45c2-8a21-2ba8d53f8f67',
  '00c422a1-20ec-494e-a728-a97ce2570206'
);

UPDATE "Post"
SET
  "content_blocks_json" = regexp_replace(
    "content_blocks_json"::text,
    '/uploads/[^"]+\.jpg',
    '/uploads/Best_5_Five-Star_Sea_View_Hotels_in_Be_ikta__(2026_Guide)_result.webp',
    'g'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = '69ae9eac-36ed-4de9-a844-a379dacea801';

UPDATE "Post"
SET
  "cover_image_url" = '/uploads/Best_5_Arabic_Restaurants_in_Istanbul_(2026_Guide)_result.webp',
  "og_image_url" = '/uploads/Best_5_Arabic_Restaurants_in_Istanbul_(2026_Guide)_result.webp',
  "content_blocks_json" = regexp_replace(
    "content_blocks_json"::text,
    '/uploads/[^"]+\.jpg',
    '/uploads/Best_5_Arabic_Restaurants_in_Istanbul_(2026_Guide)_result.webp',
    'g'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = 'e80d299b-8962-43f3-9808-e1978443d3c6';

UPDATE "Post"
SET
  "cover_image_url" = '/uploads/Best_5_International_Schools_in_Istanbul_result.webp',
  "og_image_url" = '/uploads/Best_5_International_Schools_in_Istanbul_result.webp',
  "content_blocks_json" = regexp_replace(
    "content_blocks_json"::text,
    '/uploads/[^"]+\.jpg',
    '/uploads/Best_5_International_Schools_in_Istanbul_result.webp',
    'g'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" IN (
  'e7d967e0-0dd4-4e45-b731-c6bc79b201f9',
  'f527402a-03a9-4445-a98d-371cdfd8faa8',
  '1438584d-1ca5-42c9-badb-63b100276977',
  '6b44e3d4-76eb-433d-99f3-996f1bcd0582'
);

UPDATE "Post"
SET
  "cover_image_url" = '/uploads/Best_5_Yemeni_Restaurants_in_Istanbul_(Authentic_Mandi_Guide)_result.webp',
  "og_image_url" = '/uploads/Best_5_Yemeni_Restaurants_in_Istanbul_(Authentic_Mandi_Guide)_result.webp',
  "content_blocks_json" = regexp_replace(
    "content_blocks_json"::text,
    '/uploads/[^"]+\.jpg',
    '/uploads/Best_5_Yemeni_Restaurants_in_Istanbul_(Authentic_Mandi_Guide)_result.webp',
    'g'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = '9a170b93-223f-4672-88ed-0530647d12ab';

UPDATE "Post"
SET
  "content_blocks_json" = replace(
    replace(
      "content_blocks_json"::text,
      '/uploads/?iya_Sofras__result.webp',
      '/uploads/Best_Traditional_Turkish_Restaurants_in_Istanbul_(2026_Guide)_result.webp'
    ),
    '/uploads/Tarihi_Sultanahmet_K?ftecisi_result.webp',
    '/uploads/Tarihi_Sultanahmet_K÷ftecisi_result.webp'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = 'df54524b-cedc-4488-af61-ecf02dee7f35';

UPDATE "Post"
SET
  "content_blocks_json" = replace(
    "content_blocks_json"::text,
    '/uploads/Uzung?l_Lake_result.webp',
    '/uploads/Uzung÷l_Lake_result.webp'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = '7c6cc96e-abd7-4e2f-b49a-3ba5bc86fbf2';

UPDATE "Post"
SET
  "content_blocks_json" = replace(
    replace(
      "content_blocks_json"::text,
      '/uploads/Tarihi_Karak?y_Bal_kt_s__result.webp',
      '/uploads/Tarihi_Karak÷y_Bal_kt_s__result.webp'
    ),
    '/uploads/Sur_Bal_k_Arnavutk?y_result.webp',
    '/uploads/Sur_Bal_k_Arnavutk÷y_result.webp'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = 'b42fa48f-a46a-49b4-897a-bca1b6a8d1df';

UPDATE "Post"
SET
  "content_blocks_json" = replace(
    "content_blocks_json"::text,
    '/uploads/Uzung?l_result.webp',
    '/uploads/Uzung÷l_result.webp'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = '15dc529f-5734-4a67-80e4-40c98da6f343';

UPDATE "Post"
SET
  "content_blocks_json" = replace(
    "content_blocks_json"::text,
    '/uploads/Karadeniz_D?ner_As_m_Usta_result.webp',
    '/uploads/Karadeniz_D÷ner_As_m_Usta_result.webp'
  )::jsonb,
  "updated_at" = NOW()
WHERE "id" = '0301fc00-d209-466c-8d38-ee85d4525280';
