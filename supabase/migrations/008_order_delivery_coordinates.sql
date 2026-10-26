-- Additive, backwards-compatible structured doorstep coordinates.
-- Deployment sequence: apply migration first, verify constraints, then set
-- TUSCANINI_SUPABASE_DELIVERY_COORDS_READY=yes in the target environment.
-- Historical orders and pickup orders remain valid without coordinates.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_latitude numeric(9,6),
  ADD COLUMN IF NOT EXISTS delivery_longitude numeric(9,6);

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_delivery_coordinate_pair;
ALTER TABLE public.orders ADD CONSTRAINT orders_delivery_coordinate_pair CHECK (
  (delivery_latitude IS NULL AND delivery_longitude IS NULL)
  OR
  (delivery_latitude IS NOT NULL AND delivery_longitude IS NOT NULL AND
   order_type = 'delivery' AND
   delivery_latitude BETWEEN 22 AND 32 AND
   delivery_longitude BETWEEN 24 AND 37)
);
COMMENT ON COLUMN public.orders.delivery_latitude IS
  'Customer-confirmed doorstep latitude; not derived from IP or restaurant map.';
COMMENT ON COLUMN public.orders.delivery_longitude IS
  'Customer-confirmed doorstep longitude; only persisted for delivery orders.';
