-- Keep only key-benefit pointers on products
ALTER TABLE "Product" DROP COLUMN IF EXISTS "keyBenefitsIntro";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "premiumIngredientsIntro";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "premiumIngredientsPoints";
ALTER TABLE "Product" DROP COLUMN IF EXISTS "clinicalNote";
