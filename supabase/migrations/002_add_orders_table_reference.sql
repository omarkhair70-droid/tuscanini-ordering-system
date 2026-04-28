alter table public.orders
  add column if not exists table_reference text;

comment on column public.orders.table_reference is 'Optional table reference for dine-in QR table ordering.';
