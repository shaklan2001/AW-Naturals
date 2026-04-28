-- Normalize category names for storefront filters
UPDATE "Product"
SET "category" = 'Oral Care Line'
WHERE lower("name") LIKE '%oil%'
   OR lower("description") LIKE '%oil%'
   OR lower("category") IN ('oral care', 'oral care line', 'oral-care');

UPDATE "Product"
SET "category" = 'Herbal Infusions'
WHERE "category" IN ('Herbal Tea', 'Herbal Infusion', 'Herbal Infusions')
  AND "id" NOT IN (
    SELECT "id"
    FROM "Product"
    WHERE lower("name") LIKE '%oil%' OR lower("description") LIKE '%oil%'
  );
