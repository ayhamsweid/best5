CREATE TABLE "RefreshSession" (
  "id" TEXT NOT NULL,
  "family_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),
  "replaced_by_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_used_at" TIMESTAMP(3),
  CONSTRAINT "RefreshSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "RefreshSession_token_hash_key" ON "RefreshSession"("token_hash");
CREATE INDEX "RefreshSession_user_id_idx" ON "RefreshSession"("user_id");
CREATE INDEX "RefreshSession_family_id_idx" ON "RefreshSession"("family_id");
CREATE INDEX "RefreshSession_expires_at_idx" ON "RefreshSession"("expires_at");

ALTER TABLE "RefreshSession"
  ADD CONSTRAINT "RefreshSession_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
