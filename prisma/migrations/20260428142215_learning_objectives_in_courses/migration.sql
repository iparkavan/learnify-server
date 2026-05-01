-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "learningObjectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "prerequisites" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "targetAudience" TEXT[] DEFAULT ARRAY[]::TEXT[];
