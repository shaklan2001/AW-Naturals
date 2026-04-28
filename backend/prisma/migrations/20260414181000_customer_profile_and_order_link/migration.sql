-- AlterTable
ALTER TABLE "CustomerUser"
ADD COLUMN "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN "city" TEXT NOT NULL DEFAULT '',
ADD COLUMN "pincode" TEXT NOT NULL DEFAULT '',
ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Order"
ADD COLUMN "customerUserId" TEXT;

-- CreateIndex
CREATE INDEX "Order_customerUserId_createdAt_idx" ON "Order"("customerUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_customerUserId_fkey"
FOREIGN KEY ("customerUserId") REFERENCES "CustomerUser"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
