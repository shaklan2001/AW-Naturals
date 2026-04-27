-- CreateEnum
CREATE TYPE "ContactInquiryStatus" AS ENUM ('pending', 'in_progress', 'contacted');

-- AlterTable
ALTER TABLE "ContactInquiry"
ADD COLUMN "status" "ContactInquiryStatus" NOT NULL DEFAULT 'pending';
