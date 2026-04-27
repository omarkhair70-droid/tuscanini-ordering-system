# Phase 7.2 Seed Strategy (Menu Data Only)

## Scope
Phase 7.2 seeds existing Tuscanini menu data from `lib/mock-data.ts` into Supabase tables created in Phase 7.1, while keeping current runtime behavior unchanged.

## Files
- Seed SQL: `supabase/seeds/phase_7_2_menu_seed.sql`
- Verification script: `scripts/supabase/verify_menu_seed_parity.ts`

## Safety Guardrails
- No runtime Supabase integration is introduced in this phase.
- No changes to `app/*` or `components/*`.
- No changes to menu content, pricing, cart logic, or WhatsApp flow.
- No secrets are committed.
- Service role key is never referenced in client/runtime code.

## Data Mapping

### 1) `menuCategories` -> `public.menu_categories`
- `legacy_id` <- `menuCategories.id`
- `name_ar` <- `menuCategories.name`
- `slug` <- `menuCategories.slug`
- `description_ar` <- `menuCategories.description`
- `sort_order` <- array index
- `is_active` <- `true`

### 2) `featuredItems` -> `public.products`
- `legacy_id` <- `featuredItems.id`
- `category_id` <- `menu_categories.id` via `featuredItems.categorySlug = menu_categories.slug`
- `name_ar` <- `featuredItems.name`
- `description_ar` <- `featuredItems.description`
- `price_from` <- `featuredItems.priceFrom`
- `base_price` <- `featuredItems.basePrice` (nullable)
- `availability` <- `featuredItems.availability`
- `sort_order` <- array index
- `is_active` <- `true`

### 3) sizes -> `public.product_sizes`
- `product_id` <- `products.id` via `products.legacy_id`
- `legacy_id` <- `${product.id}:${size.id}` (stable per-product key)
- `label_ar` <- `size.label`
- `price` <- `size.price`
- `sort_order` <- size index
- `is_active` <- `true`

### 4) add-ons -> `public.product_addons` + `public.product_addon_links`
- `product_addons` deduplicates add-ons by source `addon.id`
  - `legacy_id` <- `addon.id`
  - `label_ar` <- `addon.label`
  - `price` <- `addon.price`
  - `is_active` <- `true`
- `product_addon_links`
  - `product_id` from `products.legacy_id`
  - `addon_id` from `product_addons.legacy_id`

### 5) `site_settings`
Seed/upsert singleton row (`id=1`) with confirmed values:
- `whatsapp_order_number = 01004747286`
- `phone_primary = 01108006463`
- `phone_secondary = 01200364848`
- `address_ar = شارع البحر - سور نادي توليب أمام النادي الرياضي`
- `facebook_url = https://www.facebook.com/share/1LHWJ9JpXZ/`

## Execution

### Seed
```bash
psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/seeds/phase_7_2_menu_seed.sql
```

### Verify parity
```bash
npx tsc --pretty false --target es2020 --module commonjs --esModuleInterop --outDir .tmp/scripts scripts/supabase/verify_menu_seed_parity.ts
node .tmp/scripts/verify_menu_seed_parity.js
```

## Verification checks
The verification script compares mock-data expectations with DB rows for:
- category count
- product count
- size count
- addon count
- product/size/addon price parity
- missing and extra `legacy_id` values

If any check fails, the script exits with non-zero status.
