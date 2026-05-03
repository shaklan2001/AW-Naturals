-- Pro tip / infusion ingredient lists for the four core herbal teas (storefront product detail).
UPDATE "Product"
SET "ingredientsPoints" = ARRAY['Marigold', 'Rose petals', 'Yasthimadhu', 'Peppermint', 'Cardamom']::TEXT[]
WHERE id = 'prod_001';

UPDATE "Product"
SET "ingredientsPoints" = ARRAY['Chamomile flowers', 'Rose petals']::TEXT[]
WHERE id = 'prod_002';

UPDATE "Product"
SET "ingredientsPoints" = ARRAY['Blue pea flowers', 'Lemon peel']::TEXT[]
WHERE id = 'prod_003';

UPDATE "Product"
SET "ingredientsPoints" = ARRAY['Ginger', 'Berberis']::TEXT[]
WHERE id = 'prod_004';
