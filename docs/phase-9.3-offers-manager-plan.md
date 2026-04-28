# Phase 9.3 Planning (Offers Manager)

## Scope
Planning only. No runtime code changes in this phase.

## Current-State Inspection Summary
- Public offers page is currently static/empty state with local `confirmedOffers` array. (`app/offers/page.tsx`)
- Homepage offers preview is currently static/empty state with local `confirmedOffers` array. (`components/home/offers-preview.tsx`)
- Admin dashboard has section cards but no offers entry yet. (`app/admin/page.tsx`)
- Admin protection uses path-prefix checks in `isProtectedAdminPath` and currently does not include `/admin/offers`.
  (`lib/admin/admin-auth.ts`)
- Initial schema migration has no `offers` table.
  (`supabase/migrations/001_initial_schema.sql`)
- Existing server-only admin read/validate/write pattern exists for `site_settings` and can be mirrored for offers workflows.
  (`lib/admin/site-settings-queries.ts`, `lib/admin/site-settings-validation.ts`, `lib/admin/site-settings-writes.ts`, `lib/site-settings-runtime.ts`)

## Proposed DB Migration (smallest safe)
Create a new migration file:
- `supabase/migrations/0XX_offers_manager.sql`

```sql
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

create trigger trg_offers_set_updated_at
before update on public.offers
for each row execute function public.set_updated_at();
```

Notes:
- Keep `is_active default false` for safe publish workflow.
- No hard-delete requirement in schema; deactivation is enough for MVP.
- Reuse existing `set_updated_at()` helper already defined in base schema.

## Files to Create / Modify (implementation phase)

### New files
1. `supabase/migrations/0XX_offers_manager.sql`
2. `lib/admin/offers-admin-validation.ts`
3. `lib/admin/offers-admin-queries.ts`
4. `lib/admin/offers-admin-writes.ts`
5. `lib/offers-runtime.ts`
6. `app/admin/offers/page.tsx`
7. `app/admin/offers/actions.ts` (or `app/admin/offers/api/route.ts`)
8. `components/admin/offers/offers-manager.tsx` (optional split for maintainability)

### Modified files
1. `lib/admin/admin-auth.ts` (protect `/admin/offers`)
2. `app/admin/page.tsx` (add card link to `/admin/offers`)
3. `app/offers/page.tsx` (load and render active offers)
4. `components/home/offers-preview.tsx` (load top active offers; preserve empty state)

## Validation Rules (server-side)
- `title_ar`: required, trimmed, non-empty.
- `description_ar`: optional, trim, max length (proposed 600).
- `badge_ar`: optional, trim, max length (proposed 60).
- `price_text`: optional, trim, max length (proposed 60).
- `sort_order`: required numeric integer.
- `is_active`: required boolean.
- `starts_at` / `ends_at`: optional ISO datetime; if both exist => `ends_at > starts_at`.

## Admin Route Behavior (`/admin/offers`)
- Read: list all offers ordered by `sort_order asc`, then `created_at desc`.
- Create: form submit to server action/route handler.
- Edit: inline form or per-row modal pattern (Arabic-first labels/messages).
- Activate/deactivate: toggle action per row.
- Deletion strategy for MVP: **no hard delete UI**; offer deactivation only.

## Public Display Behavior
- `/offers`: show active offers only, also enforce date-window validity at read time:
  - include rows where `is_active = true`
  - and (`starts_at` is null or `starts_at <= now()`)
  - and (`ends_at` is null or `ends_at > now()`)
- Homepage preview: same filtering, limited count (e.g. top 3) sorted by `sort_order asc`.
- If no rows: keep existing premium empty states (copy can remain Arabic, polished).

## Data Access Pattern
- Server-only Supabase admin client usage in lib/actions only.
- Follow established pattern:
  - `*-queries.ts` for reads
  - `*-validation.ts` for payload parsing/guardrails
  - `*-writes.ts` for mutations
- UI components remain thin, consume typed view models.

## Out of Scope Guardrails
No changes to:
- checkout/cart
- WhatsApp flow
- order tracking
- admin order status workflows
- product editing flows
- kitchen/pro mode
- QR table logic

## Step-by-step Implementation Plan
1. Add offers schema migration with constraints + indexes + update trigger.
2. Add server-side validation module for create/update/toggle payloads.
3. Add admin queries/writes modules for offers CRUD-lite (create/update/toggle).
4. Extend admin auth protection list for `/admin/offers`.
5. Build `/admin/offers` page with Arabic-first management UI.
6. Add `/admin` dashboard card to access offers manager.
7. Build `lib/offers-runtime.ts` to fetch active/public offers safely.
8. Wire public `/offers` page to runtime offers data.
9. Wire homepage `OffersPreview` to top active offers + existing empty state.
10. Run lint/type checks and validate no unrelated modules changed.
