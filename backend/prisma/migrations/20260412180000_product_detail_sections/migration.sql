-- Key benefits, premium ingredients, clinical note for product detail pages
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "keyBenefitsIntro" TEXT,
ADD COLUMN IF NOT EXISTS "keyBenefitsPoints" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "premiumIngredientsIntro" TEXT,
ADD COLUMN IF NOT EXISTS "premiumIngredientsPoints" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "clinicalNote" TEXT;
