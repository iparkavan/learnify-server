/*
  Warnings:

  - The `provider` column on the `Account` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('EMAIL', 'GOOGLE', 'FACEBOOK');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "provider",
ADD COLUMN     "provider" "ProviderType" NOT NULL DEFAULT 'EMAIL';

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
