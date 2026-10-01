-- AlterTable
ALTER TABLE "Publication" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- Published items stay on the home page until an admin changes the star.
UPDATE "Publication" SET "featured" = true WHERE "status" = 'PUBLISHED';

-- CreateIndex
CREATE INDEX "Publication_status_featured_publishedAt_idx" ON "Publication"("status", "featured", "publishedAt");
