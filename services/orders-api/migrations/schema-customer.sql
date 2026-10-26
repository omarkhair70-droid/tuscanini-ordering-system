-- Additive, dormant Oracle-owned customer data. No Supabase reads or writes.
-- Run only in the isolated Tuscanini PostgreSQL database after a backup.
-- Nothing here authorizes a browser account or live order association.
CREATE TABLE IF NOT EXISTS tuscanini.customer_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(254) NOT NULL,
  display_name varchar(100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ts_customer_email_nonempty CHECK (char_length(btrim(email)) BETWEEN 3 AND 254)
);
-- Unique case-insensitive addresses prevent duplicate account ownership.
CREATE UNIQUE INDEX IF NOT EXISTS ts_customer_accounts_email_ci
  ON tuscanini.customer_accounts (lower(btrim(email)));

CREATE TABLE IF NOT EXISTS tuscanini.customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES tuscanini.customer_accounts(id) ON DELETE CASCADE,
  label varchar(40) NOT NULL DEFAULT 'البيت',
  formatted_address varchar(300) NOT NULL,
  latitude numeric(9,6) NOT NULL CHECK (latitude BETWEEN 22 AND 32),
  longitude numeric(9,6) NOT NULL CHECK (longitude BETWEEN 24 AND 37),
  building varchar(80),
  floor varchar(30),
  apartment varchar(30),
  landmark varchar(180),
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ts_customer_address_label_valid CHECK (char_length(btrim(label)) BETWEEN 1 AND 40),
  CONSTRAINT ts_customer_address_text_valid CHECK (char_length(btrim(formatted_address)) BETWEEN 1 AND 300)
);
CREATE INDEX IF NOT EXISTS ts_customer_addresses_owner
  ON tuscanini.customer_addresses (customer_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS ts_customer_one_default_address
  ON tuscanini.customer_addresses (customer_id) WHERE is_default;

-- Existing guest orders remain anonymous. Never backfill by contact phone/email.
ALTER TABLE tuscanini.orders ADD COLUMN IF NOT EXISTS customer_account_id uuid
  REFERENCES tuscanini.customer_accounts(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS ts_orders_verified_owner
  ON tuscanini.orders (customer_account_id, created_at DESC)
  WHERE customer_account_id IS NOT NULL;
