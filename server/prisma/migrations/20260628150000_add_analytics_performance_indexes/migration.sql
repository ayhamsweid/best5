-- Improve published-post lookups and page-view aggregation.
CREATE INDEX "Post_status_published_at_idx" ON "Post"("status", "published_at");
CREATE INDEX "Post_category_id_status_published_at_idx" ON "Post"("category_id", "status", "published_at");
CREATE INDEX "Post_status_scheduled_at_idx" ON "Post"("status", "scheduled_at");
CREATE INDEX "PageView_created_at_idx" ON "PageView"("created_at");
CREATE INDEX "PageView_is_bot_created_at_idx" ON "PageView"("is_bot", "created_at");
