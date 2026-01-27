/*
  Warnings:

  - You are about to drop the column `duration` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Lecture` table. All the data in the column will be lost.
  - Added the required column `status` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Lecture` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "LectureType" AS ENUM ('VIDEO', 'QUIZ', 'ASSIGNMENT', 'CODING');

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lecture" DROP COLUMN "duration",
DROP COLUMN "videoUrl",
ADD COLUMN     "type" "LectureType" NOT NULL;

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "originalUrl" TEXT NOT NULL,
    "streamUrl" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "size" DOUBLE PRECISION,
    "format" TEXT,
    "status" "VideoStatus" NOT NULL DEFAULT 'PROCESSING',
    "lectureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_lectureId_key" ON "Video"("lectureId");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
