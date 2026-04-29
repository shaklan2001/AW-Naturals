ALTER TABLE "Product"
ADD COLUMN "shortDescription" TEXT;

UPDATE "Product"
SET "shortDescription" = left("description", 160)
WHERE "shortDescription" IS NULL OR btrim("shortDescription") = '';
