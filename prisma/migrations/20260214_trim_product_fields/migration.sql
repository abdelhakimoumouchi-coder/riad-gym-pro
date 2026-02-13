-- Supprimer d’éventuelles contraintes uniques résiduelles sur slug/sku
DROP INDEX IF EXISTS "products_slug_key";
DROP INDEX IF EXISTS "products_sku_key";

-- Supprimer les colonnes non utilisées
ALTER TABLE "products"
  DROP COLUMN IF EXISTS "sku",
  DROP COLUMN IF EXISTS "shortDesc",
  DROP COLUMN IF EXISTS "cost",
  DROP COLUMN IF EXISTS "thumbnail",
  DROP COLUMN IF EXISTS "metaTitle",
  DROP COLUMN IF EXISTS "metaDescription",
  DROP COLUMN IF EXISTS "publishedAt";
