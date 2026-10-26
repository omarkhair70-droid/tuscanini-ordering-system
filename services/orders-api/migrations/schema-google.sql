-- Google account ownership uses the immutable Google 'sub', never a phone or email match.
-- This is additive: existing OTP customers and sessions remain intact.
CREATE TABLE IF NOT EXISTS tuscanini.customer_google_identities (
  google_subject varchar(255) PRIMARY KEY,
  customer_id uuid NOT NULL UNIQUE REFERENCES tuscanini.customer_accounts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ts_google_identity_customer ON tuscanini.customer_google_identities(customer_id);
