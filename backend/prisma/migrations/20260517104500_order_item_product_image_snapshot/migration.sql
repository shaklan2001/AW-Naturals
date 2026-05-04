-- Order history: persist first product thumbnail per line item (fixes missing images when include/join is empty).

ALTER TABLE "OrderItem" ADD COLUMN "productImageSnapshot" TEXT;

UPDATE "OrderItem" AS oi
SET "productImageSnapshot" = (p.images)[1]
FROM "Product" AS p
WHERE oi."productId" = p.id
  AND cardinality(p.images) >= 1
  AND oi."productImageSnapshot" IS NULL;
