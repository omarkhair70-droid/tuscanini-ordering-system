# Tuscanini — Oracle-first full backend cutover
**2026-10-26 · PR #59 · draft-only implementation**

## Confirmed product decision
Vercel continues serving the Next.js customer UI. Oracle Cloud hosts Tuscanini's isolated API services and PostgreSQL database for customer identity, saved addresses, catalog, configuration, orders, history, operator status and future payment records. This means **Supabase is a transitional dependency, not a second permanent order ledger**. Oracle Cloud here is compute hosting PostgreSQL, not Oracle Database.

## Current code versus target
- **Current:** Supabase Auth, `/account`, `customer_addresses` and `/api/customer/orders` are Supabase-specific. Some catalog/configuration paths also read Supabase. The Oracle-targeted independent order service uses PostgreSQL and a server-only service key.
- **Current:** `ORDER_BACKEND=oracle` in Vercel is a routing choice; it does **not** establish that Oracle deployment, accepted orders, owned customer history or cashier/POS handoff are live.
- **Target:** one verified Oracle customer identity, owned addresses, and authoritative order records, history and price checks in Oracle PostgreSQL, with guest checkout retained.
- **Migration:** existing Supabase accounts/addresses/orders must be inventoried and reconciled before removing any existing providers. Do not equate equal emails or phone numbers with proven ownership.

## First source-code slice — implemented, not activated
- `services/orders-api/migrations/schema-customer.sql`: additive `customer_accounts` and `customer_addresses` tables, unique normalized-email index, one-default-address constraint, coordinate and length checks, and nullable `orders.customer_account_id` foreign key with owner index. No destructive changes or automatic backfills.
- `src/migrate.ts`: runs the new customer schema after the established order and menu schemas with the existing advisory lock.
- `src/customer-orders.ts`: bounded owner-scoped SQL history helper. **Not publicly reachable**; cannot accept a browser-asserted customer ID as proof of identity.
- Dedicated PostgreSQL CI validates private owner vs guest history and rejection of invalid location/default-address duplication.
- Preserve the current Supabase account UI and checkout until a real verified Oracle login/session is built and tested. None of the new Oracle customer tables has been applied to production by committing this code.

## Next implementation gates
1. Select and implement a proven server-side identity/session solution on Oracle. Email OTP must use a configured delivery service, rate limits, hashed/expiring challenges, server-managed secure HTTP-only cookies, session revocation and account recovery; never accept a raw account ID from the browser. Do not silently promote the existing Supabase token into an Oracle identity.
2. Expose owner-scoped address operations and history through authenticated Next.js-to-Oracle server APIs. Migrate the existing `/account` UI and verified checkout association without losing guest behavior. History must include item snapshots and a reprice-before-reorder path.
3. Move authoritative catalog, availability, store settings, and delivery zones/fees to the same Oracle domain; avoid another independent set of prices/settings. Preserve current datasets and use a controlled inventory-backed migration.
4. Independently prove the public order/intake controls, database backup/restore, merchant tablet state updates, real POS acknowledgment, provider-confirmed payments and production support.
5. Only after real migration QA on isolated staging, cut over environment flags with rollback available; remove Supabase dependencies last. PR stays Draft; `main` and merchant live intake unchanged.

**Not done:** deployed Oracle auth, OTP email service, sessions, Supabase import, Oracle account API/checkout integration, any live customer data migration, merchant POS, payment gateway or production release.
