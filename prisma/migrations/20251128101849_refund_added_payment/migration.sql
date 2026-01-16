/*
  Warnings:

  - You are about to drop the column `metadata` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `Payment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_userId_courseId_idx";

-- DropIndex
DROP INDEX "Payment_transactionId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "refundId" TEXT;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "metadata",
DROP COLUMN "transactionId",
ADD COLUMN     "refundId" TEXT;
