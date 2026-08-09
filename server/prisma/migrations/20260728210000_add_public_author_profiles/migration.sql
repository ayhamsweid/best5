ALTER TABLE "User"
ADD COLUMN "author_slug" TEXT,
ADD COLUMN "author_title_ar" TEXT,
ADD COLUMN "author_title_en" TEXT,
ADD COLUMN "author_bio_ar" TEXT,
ADD COLUMN "author_bio_en" TEXT,
ADD COLUMN "author_expertise_ar" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "author_expertise_en" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "author_image_url" TEXT,
ADD COLUMN "author_website_url" TEXT,
ADD COLUMN "author_social_url" TEXT,
ADD COLUMN "author_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "show_public_profile" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "User_author_slug_key" ON "User"("author_slug");
