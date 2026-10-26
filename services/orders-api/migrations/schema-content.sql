-- Additive first-party content schema. Run on Tuscanini PostgreSQL ONLY.
-- Intentionally no seed rows: migrating public-facing settings and active offers
-- must be an explicit, verified operation, never a silent overwrite.
CREATE TABLE IF NOT EXISTS tuscanini.site_settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  is_ordering_open boolean NOT NULL DEFAULT FALSE,
  whatsapp_order_number varchar(30) NOT NULL,
  phone_primary varchar(30) NOT NULL,
  phone_secondary varchar(30),
  address_ar varchar(280) NOT NULL,
  facebook_url varchar(500),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tuscanini.offers (
  id varchar(80) PRIMARY KEY,
  title_ar varchar(180) NOT NULL,
  description_ar text,
  badge_ar varchar(100),
  price_text varchar(200),
  offer_price_cents integer CHECK (offer_price_cents IS NULL OR offer_price_cents >= 0),
  is_active boolean NOT NULL DEFAULT FALSE,
  sort_order integer NOT NULL DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ts_offer_window CHECK (starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS ts_offers_active_window_idx
  ON tuscanini.offers (is_active,sort_order,created_at DESC);
