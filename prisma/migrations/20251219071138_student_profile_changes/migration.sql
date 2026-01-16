/*
  Warnings:

  - The values [COLLEGE_SEMINAR,FRIEND_REFERRAL,WHATSAPP] on the enum `ReferralSource` will be removed. If these variants are still used in the database, this will fail.
  - The values [GRADUATE_WORKING] on the enum `StudyYear` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `studyProgram` on the `StudentProfile` table. All the data in the column will be lost.
  - You are about to alter the column `phoneNumber` on the `StudentProfile` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - A unique constraint covering the columns `[userId]` on the table `StudentProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `degreeProgram` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DegreeProgram" AS ENUM ('BACHELOR_OF_TECHNOLOGY', 'BACHELOR_OF_ENGINEERING', 'BACHELOR_OF_SCIENCE', 'BACHELOR_OF_COMPUTER_APPLICATIONS', 'DIPLOMA', 'WORKING_PROFESSIONAL', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "ReferralSource_new" AS ENUM ('GOOGLE', 'LINKEDIN', 'INSTAGRAM', 'FRIEND', 'COLLEGE', 'ADVERTISEMENT', 'OTHER');
ALTER TABLE "StudentProfile" ALTER COLUMN "referralSource" TYPE "ReferralSource_new" USING ("referralSource"::text::"ReferralSource_new");
ALTER TYPE "ReferralSource" RENAME TO "ReferralSource_old";
ALTER TYPE "ReferralSource_new" RENAME TO "ReferralSource";
DROP TYPE "public"."ReferralSource_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StudyYear_new" AS ENUM ('FIRST_YEAR', 'SECOND_YEAR', 'THIRD_YEAR', 'FOURTH_YEAR', 'FINAL_YEAR', 'GRADUATED');
ALTER TABLE "StudentProfile" ALTER COLUMN "studyYear" TYPE "StudyYear_new" USING ("studyYear"::text::"StudyYear_new");
ALTER TYPE "StudyYear" RENAME TO "StudyYear_old";
ALTER TYPE "StudyYear_new" RENAME TO "StudyYear";
DROP TYPE "public"."StudyYear_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_profileId_fkey";

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "studyProgram",
ADD COLUMN     "collegeName" VARCHAR(150),
ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "degreeProgram" "DegreeProgram" NOT NULL,
ADD COLUMN     "graduationYear" INTEGER,
ADD COLUMN     "specialization" VARCHAR(100),
ALTER COLUMN "phoneNumber" SET DATA TYPE VARCHAR(20);

-- DropEnum
DROP TYPE "StudyProgram";

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
