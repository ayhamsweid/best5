-- Replace timestamp fallbacks created before Arabic-aware slug generation.
UPDATE "Category" SET "slug_ar" = 'فنادق' WHERE "slug_ar" = '1771560834740' AND "slug_en" = 'hotels';
UPDATE "Category" SET "name_en" = 'Museums', "slug_ar" = 'متاحف', "slug_en" = 'museums' WHERE "slug_ar" = '1771014524393' AND "slug_en" = 'musems';
UPDATE "Category" SET "slug_ar" = 'أماكن' WHERE "slug_ar" = '1771014168963' AND "slug_en" = 'places';
UPDATE "Category" SET "name_en" = 'Restaurants', "slug_ar" = 'مطاعم', "slug_en" = 'restaurants' WHERE "slug_ar" = '1771014104954' AND "slug_en" = 'restorants';
UPDATE "Category" SET "name_en" = 'Stores', "slug_ar" = 'متاجر', "slug_en" = 'stores' WHERE "slug_ar" = '1771014576961' AND "slug_en" = 'store';
UPDATE "Category" SET "slug_ar" = 'جامعات' WHERE "slug_ar" = '1771014651001' AND "slug_en" = 'universities';
