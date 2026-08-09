CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "old_path" TEXT NOT NULL,
    "new_path" TEXT NOT NULL,
    "status_code" INTEGER NOT NULL DEFAULT 301,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Redirect_old_path_key" ON "Redirect"("old_path");
CREATE INDEX "Redirect_active_idx" ON "Redirect"("active");

-- Preserve known retired category URLs as one-hop redirects.
INSERT INTO "Redirect" ("id", "old_path", "new_path") VALUES
  ('10000000-0000-4000-8000-000000000001', '/ar/category/1771560834740', '/ar/category/فنادق'),
  ('10000000-0000-4000-8000-000000000002', '/en/category/1771560834740', '/en/category/hotels'),
  ('10000000-0000-4000-8000-000000000003', '/ar/category/1771014524393', '/ar/category/متاحف'),
  ('10000000-0000-4000-8000-000000000004', '/en/category/1771014524393', '/en/category/museums'),
  ('10000000-0000-4000-8000-000000000005', '/ar/category/1771014168963', '/ar/category/أماكن'),
  ('10000000-0000-4000-8000-000000000006', '/en/category/1771014168963', '/en/category/places'),
  ('10000000-0000-4000-8000-000000000007', '/ar/category/1771014104954', '/ar/category/مطاعم'),
  ('10000000-0000-4000-8000-000000000008', '/en/category/1771014104954', '/en/category/restaurants'),
  ('10000000-0000-4000-8000-000000000009', '/ar/category/1771014576961', '/ar/category/متاجر'),
  ('10000000-0000-4000-8000-000000000010', '/en/category/1771014576961', '/en/category/stores'),
  ('10000000-0000-4000-8000-000000000011', '/ar/category/1771014651001', '/ar/category/جامعات'),
  ('10000000-0000-4000-8000-000000000012', '/en/category/1771014651001', '/en/category/universities'),
  ('10000000-0000-4000-8000-000000000013', '/ar/category/musems', '/ar/category/متاحف'),
  ('10000000-0000-4000-8000-000000000014', '/en/category/musems', '/en/category/museums'),
  ('10000000-0000-4000-8000-000000000015', '/ar/category/restorants', '/ar/category/مطاعم'),
  ('10000000-0000-4000-8000-000000000016', '/en/category/restorants', '/en/category/restaurants'),
  ('10000000-0000-4000-8000-000000000017', '/ar/category/store', '/ar/category/متاجر'),
  ('10000000-0000-4000-8000-000000000018', '/en/category/store', '/en/category/stores');

INSERT INTO "Redirect" ("id", "old_path", "new_path")
SELECT
  '10000000-0000-4000-8000-000000000019',
  '/ar/blog/test',
  '/ar/blog/' || "slug_ar"
FROM "Post"
WHERE "id" = 'f9cac92a-e888-48be-b782-1e60d5544678'
ON CONFLICT ("old_path") DO NOTHING;

INSERT INTO "Redirect" ("id", "old_path", "new_path")
SELECT
  '10000000-0000-4000-8000-000000000020',
  '/en/blog/test',
  '/en/blog/' || "slug_en"
FROM "Post"
WHERE "id" = 'f9cac92a-e888-48be-b782-1e60d5544678'
ON CONFLICT ("old_path") DO NOTHING;
