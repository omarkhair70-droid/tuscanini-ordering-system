-- Oracle PostgreSQL customer identity, additive and dormant unless CUSTOMER_AUTH_ENABLED=yes.
CREATE TABLE IF NOT EXISTS tuscanini.customer_otp_challenges (
  email varchar(254) PRIMARY KEY,
  code_hash char(64) NOT NULL,
  expires_at timestamptz NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  hourly_window timestamptz NOT NULL DEFAULT now(),
  hourly_count integer NOT NULL DEFAULT 1 CHECK (hourly_count BETWEEN 1 AND 5),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 5)
);
CREATE INDEX IF NOT EXISTS ts_customer_otp_expiry ON tuscanini.customer_otp_challenges(expires_at);
CREATE TABLE IF NOT EXISTS tuscanini.customer_sessions (
  token_hash char(64) PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES tuscanini.customer_accounts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS ts_customer_session_owner ON tuscanini.customer_sessions(customer_id,expires_at);
CREATE INDEX IF NOT EXISTS ts_customer_session_expiry ON tuscanini.customer_sessions(expires_at);
