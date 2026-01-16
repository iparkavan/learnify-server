/*
  Warnings:

  - You are about to drop the column `paymentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayOrderId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `refundId` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_razorpayOrderId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentId",
DROP COLUMN "razorpayOrderId",
DROP COLUMN "refundId";
