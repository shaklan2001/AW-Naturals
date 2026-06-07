-- Shelve evening ritual products under their own storefront category
UPDATE "Product"
SET "category" = 'Night Ritual Line'
WHERE "id" = 'prod_008'
   OR (
     lower("name") LIKE '%release%'
     AND lower("name") LIKE '%foot%'
   );
