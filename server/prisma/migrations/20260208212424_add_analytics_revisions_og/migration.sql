-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "og_image_url" TEXT;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "pages_meta_json" JSONB;

-- CreateTable
CREATE TABLE "PostRevision" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "editor_id" TEXT,
    "snapshot_json" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostRevision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "lang" TEXT,
    "referrer" TEXT,
    "user_agent" TEXT,
    "ip" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostRevision" ADD CONSTRAINT "PostRevision_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostRevision" ADD CONSTRAINT "PostRevision_editor_id_fkey" FOREIGN KEY ("editor_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
