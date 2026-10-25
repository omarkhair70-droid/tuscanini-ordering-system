-- Additive customer payment preference. This is NEVER payment verification.
-- Apply to the target Supabase DB before enabling writer's readiness flag.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method text NOT NULL DEFAULT 'cash'
  CHECK (payment_method IN ('cash','instapay_on_handoff','vodafone_cash_on_handoff'));
COMMENT ON COLUMN public.orders.payment_method IS
  'Customer-selected method at handoff. Not online payment, paid confirmation or settlement.';
