-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "thumbnailPublicId" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "originalUrlPubicId" TEXT,
ADD COLUMN     "thumbnailUrlPublicId" TEXT;
