-- AlterTable
ALTER TABLE "Service" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- Existing published services stay on the home page until an admin unstars them.
UPDATE "Service" SET "featured" = true WHERE "visibility" = 'PUBLISHED';

-- CreateIndex
CREATE INDEX "Service_visibility_featured_sortOrder_idx" ON "Service"("visibility", "featured", "sortOrder");
