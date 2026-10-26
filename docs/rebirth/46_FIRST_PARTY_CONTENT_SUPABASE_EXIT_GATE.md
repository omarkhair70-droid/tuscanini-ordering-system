# Tuscanini first-party content cutover — staged, NOT production enabled

## Why this PR exists
Customer orders, operator queue, tracking and Google customer sessions already run through
Tuscanini's independently deployed Node API / PostgreSQL on Oracle VM. The former system is
**not yet removed**: offers, public contact details, and legacy administration still depend
on Supabase. This PR builds the missing owned tables/endpoints and an off-by-default
read adapter. Nothing here changes or deletes production offers/settings/orders.

## Additive DB migration
Run the existing service migration command (it now includes
`services/orders-api/migrations/schema-content.sql`) on the **existing**
`tuscanini_orders` PostgreSQL instance after a verified backup. It creates:
- `tuscanini.site_settings`: singleton contact, address, FB, WhatsApp, ordering
  preference (display-only; Vercel+API order safety switches remain independent)
- `tuscanini.offers`: stable IDs, optional EGP price in cents, publishing status,
  start/end dates, sort order; no invented promotions are inserted
These tables are NOT populated automatically.

## Node API (all require X-Tuscanini-Service-Key)
- `GET /v1/content/status`: whether settings are imported, total offer count,
  active-window count
- `GET /v1/content/site-settings`: 404 until imported, no invented values
- `GET /v1/content/offers`: only active, in-window, price-in-cents offers
- `POST /v1/content/site-settings/import` and `/v1/content/offers/import`:
  require **CONTENT_IMPORT_ENABLED=yes** in the existing Coolify service,
  disabled by default. Strict payload validation, transactions for offer import,
  never DELETE existing data
There is no browser-facing anonymous content-import route.

## Required before cutover
1. Export current live Supabase `site_settings` and ALL `offers` (including
   inactive/future), with original IDs, amounts and start/end dates; save an
   owner-controlled backup *outside* the public repository.
2. Compare exported rows with restaurant owner expectations and confirm the
   current public phone, WhatsApp, address, FB, schedule and real offer prices.
3. Run the new private, *read-only by default* migration check from a trusted
   shell (never commit, print or paste secrets):
   `node scripts/migrations/export-and-import-native-content.mjs`.
   It compares legacy row counts and target status without changing either
   database. The --apply path is separately protected by
   `TUSCANINI_NATIVE_CONTENT_IMPORT_CONFIRMED=yes` and a check that the
   destination has no preexisting imported content. This tool is NOT executed
   automatically in Vercel or GitHub Actions.
4. Deploy the existing Coolify API from a verified commit; apply additive
   migrations with service DB backup; enable CONTENT_IMPORT_ENABLED=yes
   only for a short supervised import window. Use service-key-authenticated
   imports. Offers import expects `offer_price_cents` integer; multiply
   verified price in EGP by 100. An unverified discount stays unpublished.
5. Compare /v1/content/status, /v1/content/site-settings and /v1/content/offers
   with exported data. Test time boundaries, no active offers, private auth,
   and public site/settings + /offers in Vercel Preview.
6. Disable CONTENT_IMPORT_ENABLED again. Set Vercel
   `TUSCANINI_NATIVE_CONTENT_ENABLED=yes` **only after verification**.
   With the switch on, fallback to Supabase is intentionally prohibited.
7. Migrate/rebuild legacy /admin/products,/admin/orders,/admin/offers,/admin/settings
   to this API or retire them as appropriate. Then remove Supabase runtime,
   old migrations/code, and Vercel secrets in a separately tested PR.
   **Do not remove credentials or disable the database before this.**

## Guardrails
- `TUSCANINI_ORACLE_LIVE_ORDERS` and Coolify `ORDER_API_ACCEPT_ORDERS` are
  unchanged. No new order intake, no change to POS behavior or customer account
  cookies. A content settings import never opens the restaurant API.
- Native read switch missing or `no` = historical behavior. Native switch
  `yes` but backend missing/unreachable = fail closed for contact settings,
  and a clear unavailable state for offers. Never silently return old
  Supabase promotions as though imported.
- Production PostgreSQL stays on its existing supported version; no DB major
  version change, no destructive SQL.
- Existing PR #65/#66 update libraries and are deliberately separate. After
  the final cutover, remove the temporary Supabase dependency from them.

## Native merchant admin cutover (additional default-off gate)
The existing authenticated `/admin/settings` and `/admin/offers` UI can
read and mutate Tuscanini PostgreSQL when:
- an **audited, complete** data export has been imported and verified
- `TUSCANINI_NATIVE_CONTENT_ENABLED=yes` in Vercel
- `TUSCANINI_CONTENT_ADMIN_ENABLED=yes` in Coolify
- the existing admin access cookie is present, and the browser POST is
  same-origin, protected by `proxy.ts`

Offers GET includes active AND inactive records for the merchant. Creation,
editing and activation do not delete old IDs or order history. Backend writes
are protected by the 32+ char service key and a separate content admin switch.
The public consumer GET only shows in-window active records.

IMPORTANT: the current Oracle order API does not accept `kind:'offer'` cart
lines. Merchant-facing offer creation/activation is **editorial display only**
until the canonical server-side offer checkout pricing and kitchen line support
have been added and validated. Do not claim an offer card is buyable merely
because its public content was imported.

The feature switch never substitutes the legacy Supabase admin silently if
native PostgreSQL fails. If a migrated endpoint fails, report the error and
leave data untouched.

## Remaining true "zero Supabase" release gates
- Verify ALL Supabase datasets actually used by pages, not only `offers`
  and `site_settings`, and back up them under merchant control.
- Complete native menu, offer ordering, settings, and any retained legacy admin
  pages before package removal.
- Delete Supabase secrets from Vercel **only after** deploying/test-driving the
  package-free bundle with the native feature flags and end-to-end checkout.
- Never drop/decommission the old Supabase project during the same deploy.
