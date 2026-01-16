/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'INSTRUCTOR', 'STUDENT');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('MANAGE_USERS', 'MANAGE_COURSES', 'MANAGE_QUIZZES', 'MANAGE_PAYMENTS', 'CREATE_COURSE', 'UPDATE_COURSE', 'DELETE_COURSE', 'VIEW_STUDENTS', 'CREATE_QUIZ', 'ENROLL_COURSE', 'VIEW_COURSE', 'ATTEMPT_QUIZ', 'VIEW_RESULTS');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "RoleType" NOT NULL DEFAULT 'STUDENT';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "RoleType" NOT NULL,
    "permissions" "PermissionType"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
