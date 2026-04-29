UPDATE "Product"
SET "category" = 'Skincare Line'
WHERE lower("category") IN ('skin care', 'skincare', 'skin care line', 'skincare line', 'skin-care')
   OR lower("name") LIKE '%skin%'
   OR lower("description") LIKE '%skin%';
