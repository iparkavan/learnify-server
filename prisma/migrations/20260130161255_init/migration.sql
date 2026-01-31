/*
  Warnings:

  - The values [VIDEO,QUIZ,ASSIGNMENT,CODING] on the enum `LectureType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LectureType_new" AS ENUM ('video', 'quiz', 'assignment', 'coding');
ALTER TABLE "Lecture" ALTER COLUMN "type" TYPE "LectureType_new" USING ("type"::text::"LectureType_new");
ALTER TYPE "LectureType" RENAME TO "LectureType_old";
ALTER TYPE "LectureType_new" RENAME TO "LectureType";
DROP TYPE "public"."LectureType_old";
COMMIT;
