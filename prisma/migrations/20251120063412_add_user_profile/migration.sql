/*
  Warnings:

  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[profileId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StudyProgram" AS ENUM ('BTECH_BE', 'BSC_BCA', 'DIPLOMA', 'WORKING_PROFESSIONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "StudyYear" AS ENUM ('FIRST_YEAR', 'SECOND_YEAR', 'THIRD_YEAR', 'FINAL_YEAR', 'GRADUATE_WORKING');

-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('INSTAGRAM', 'LINKEDIN', 'COLLEGE_SEMINAR', 'FRIEND_REFERRAL', 'WHATSAPP', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileId" TEXT,
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "studyProgram" "StudyProgram" NOT NULL,
    "studyYear" "StudyYear" NOT NULL,
    "referralSource" "ReferralSource" NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
