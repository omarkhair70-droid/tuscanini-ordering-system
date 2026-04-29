alter table public.offers add column if not exists offer_price numeric(10,2);

do $$ begin
  alter table public.offers add constraint offers_offer_price_non_negative check (offer_price is null or offer_price >= 0);
exception when duplicate_object then null; end $$;

create index if not exists idx_offers_offer_price on public.offers(offer_price);

alter table public.order_items add column if not exists line_type text not null default 'product';
alter table public.order_items add column if not exists offer_id uuid references public.offers(id) on delete set null;
alter table public.order_items add column if not exists offer_title_snapshot text;

do $$ begin
  alter table public.order_items add constraint order_items_line_type_check check (line_type in ('product','offer'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.order_items add constraint order_items_line_type_shape_check check (
    (line_type = 'product' and offer_id is null)
    or
    (line_type = 'offer' and offer_id is not null and product_id is null)
  );
exception when duplicate_object then null; end $$;

create index if not exists idx_order_items_line_type on public.order_items(line_type);
create index if not exists idx_order_items_offer_id on public.order_items(offer_id);
