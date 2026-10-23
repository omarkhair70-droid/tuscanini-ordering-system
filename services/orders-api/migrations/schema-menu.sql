-- Additive Tuscanini schema migration; no schema drops or fixture inserts.
CREATE TABLE IF NOT EXISTS tuscanini.menu_catalog (
  product_id varchar(64) PRIMARY KEY,
  name varchar(160) NOT NULL,
  category_slug varchar(60) NOT NULL,
  price_from_cents integer NOT NULL CHECK(price_from_cents >= 0),
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  addons jsonb NOT NULL DEFAULT '[]'::jsonb,
  available boolean NOT NULL DEFAULT TRUE
);
ALTER TABLE tuscanini.orders ADD COLUMN IF NOT EXISTS customer_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE tuscanini.orders ADD COLUMN IF NOT EXISTS order_type varchar(16) NOT NULL DEFAULT 'pickup';
ALTER TABLE tuscanini.orders ADD COLUMN IF NOT EXISTS table_reference varchar(40);
ALTER TABLE tuscanini.order_line ADD COLUMN IF NOT EXISTS selection_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE tuscanini.order_line ADD COLUMN IF NOT EXISTS notes_snapshot varchar(500) NOT NULL DEFAULT '';
ALTER TABLE tuscanini.order_line ADD COLUMN IF NOT EXISTS category_snapshot varchar(60) NOT NULL DEFAULT '';
