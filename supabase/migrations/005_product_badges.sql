-- Phase 9.4: Admin-managed visual product badges for normal products.

alter table public.products
  add column if not exists product_badge_ar text,
  add column if not exists product_badge_variant text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_product_badge_variant_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_product_badge_variant_check
      check (
        product_badge_variant is null
        or product_badge_variant in ('default', 'new', 'popular', 'recommended', 'spicy', 'offer', 'limited')
      );
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_badge_variant_requires_text_check'
      and conrelid = 'public.products'::regclass
  ) then
    alter table public.products
      add constraint products_badge_variant_requires_text_check
      check (
        product_badge_variant is null
        or nullif(btrim(product_badge_ar), '') is not null
      );
  end if;
end
$$;
