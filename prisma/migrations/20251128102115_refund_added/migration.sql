/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Order_userId_courseId_idx" ON "Order"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
