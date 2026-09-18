-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- Existing published members stay on the home page until an admin unstars them.
UPDATE "TeamMember" SET "featured" = true WHERE "visibility" = 'PUBLISHED';

-- CreateIndex
CREATE INDEX "TeamMember_visibility_featured_sortOrder_idx" ON "TeamMember"("visibility", "featured", "sortOrder");
