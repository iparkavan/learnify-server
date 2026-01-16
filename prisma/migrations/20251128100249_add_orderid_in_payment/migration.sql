-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "orderId" TEXT,
ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
