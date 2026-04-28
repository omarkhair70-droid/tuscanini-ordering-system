-- Phase 9.3: Offers Manager foundational table

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  description_ar text,
  badge_ar text,
  price_text text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint offers_title_ar_nonempty check (char_length(btrim(title_ar)) > 0),
  constraint offers_description_ar_length check (description_ar is null or char_length(description_ar) <= 600),
  constraint offers_badge_ar_length check (badge_ar is null or char_length(badge_ar) <= 60),
  constraint offers_price_text_length check (price_text is null or char_length(price_text) <= 60),
  constraint offers_date_range_valid check (
    starts_at is null
    or ends_at is null
    or ends_at > starts_at
  )
);

create index if not exists idx_offers_is_active on public.offers(is_active);
create index if not exists idx_offers_sort_order on public.offers(sort_order);
create index if not exists idx_offers_starts_at on public.offers(starts_at);
create index if not exists idx_offers_ends_at on public.offers(ends_at);

drop trigger if exists trg_offers_set_updated_at on public.offers;
create trigger trg_offers_set_updated_at
before update on public.offers
for each row execute function public.set_updated_at();
