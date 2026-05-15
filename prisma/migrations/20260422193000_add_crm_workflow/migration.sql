CREATE TYPE "PropertyApprovalStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED');

ALTER TABLE "Property"
ADD COLUMN "approvalStatus" "PropertyApprovalStatus" NOT NULL DEFAULT 'APPROVED',
ADD COLUMN "moderationNotes" TEXT,
ADD COLUMN "publishedAt" TIMESTAMP(3),
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "ownerId" INTEGER,
ADD COLUMN "createdById" INTEGER,
ADD COLUMN "reviewedById" INTEGER;

CREATE INDEX "Property_approvalStatus_idx" ON "Property"("approvalStatus");
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");
CREATE INDEX "Property_createdById_idx" ON "Property"("createdById");
CREATE INDEX "Property_reviewedById_idx" ON "Property"("reviewedById");

ALTER TABLE "Property"
ADD CONSTRAINT "Property_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Property"
ADD CONSTRAINT "Property_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Property"
ADD CONSTRAINT "Property_reviewedById_fkey"
FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

UPDATE "Property"
SET "publishedAt" = "createdAt"
WHERE "approvalStatus" = 'APPROVED' AND "publishedAt" IS NULL;
