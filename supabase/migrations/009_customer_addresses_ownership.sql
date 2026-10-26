-- Customer-account groundwork, additive and dormant until auth UI + verified
-- order association are implemented. Never link old guest orders by phone alone.
-- Do NOT expose the historic orders table to authenticated customer SELECT:
-- it contains other customers' orders and legacy RLS still needs separation.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_user_id uuid
    REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_orders_customer_user_id_placed
  ON public.orders(customer_user_id, placed_at DESC)
  WHERE customer_user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.customer_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT 'البيت'
    CHECK (char_length(label) BETWEEN 1 AND 40),
  formatted_address text NOT NULL
    CHECK (char_length(btrim(formatted_address)) BETWEEN 1 AND 300),
  latitude numeric(9,6) NOT NULL CHECK (latitude BETWEEN 22 AND 32),
  longitude numeric(9,6) NOT NULL CHECK (longitude BETWEEN 24 AND 37),
  building text CHECK (building IS NULL OR char_length(building) <= 80),
  floor text CHECK (floor IS NULL OR char_length(floor) <= 30),
  apartment text CHECK (apartment IS NULL OR char_length(apartment) <= 30),
  landmark text CHECK (landmark IS NULL OR char_length(landmark) <= 180),
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_owner
  ON public.customer_addresses(user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS one_default_address_per_customer
  ON public.customer_addresses(user_id) WHERE is_default;

-- This new table is private by default. The separate staff profile/role
-- model does not authorize access to customer addresses.
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.customer_addresses FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_addresses TO authenticated;

DROP POLICY IF EXISTS customer_addresses_select_own ON public.customer_addresses;
CREATE POLICY customer_addresses_select_own ON public.customer_addresses
 FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS customer_addresses_insert_own ON public.customer_addresses;
CREATE POLICY customer_addresses_insert_own ON public.customer_addresses
 FOR INSERT TO authenticated WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS customer_addresses_update_own ON public.customer_addresses;
CREATE POLICY customer_addresses_update_own ON public.customer_addresses
 FOR UPDATE TO authenticated USING (user_id = (SELECT auth.uid()))
 WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS customer_addresses_delete_own ON public.customer_addresses;
CREATE POLICY customer_addresses_delete_own ON public.customer_addresses
 FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

DROP TRIGGER IF EXISTS trg_customer_addresses_updated_at ON public.customer_addresses;
CREATE TRIGGER trg_customer_addresses_updated_at
 BEFORE UPDATE ON public.customer_addresses FOR EACH ROW
 EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.customer_addresses IS
  'Only the authenticated owner can access saved GPS addresses via RLS. No phone-number ownership inference.';
COMMENT ON COLUMN public.orders.customer_user_id IS
  'Verified auth.users owner only; guest history must never be claimed by matching a phone string.';
