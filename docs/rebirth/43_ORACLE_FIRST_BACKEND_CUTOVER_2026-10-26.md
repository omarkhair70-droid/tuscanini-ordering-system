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

## 26 Oct — Oracle-owned login / customer accounts implementation

**Source built on PR #59 (not activated on real Oracle):**
- New additive `schema-auth.sql` creates hashed OTP challenges and server-side session records attached to `customer_accounts`.
- Oracle order API: `POST /v1/customer/auth/request`, `POST /v1/customer/auth/verify`, `GET /v1/customer/auth/session`, `POST /v1/customer/auth/logout`, `GET/POST/DELETE /v1/customer/addresses`, and `GET /v1/customer/orders`. All need the separate server-only service key.
- OTP: 6 digits, HMAC-hashed with a server-only pepper, 10-minute expiry, 5 wrong attempts, 60-second resend delay, maximum 5/hour per email. Resend sender is explicit; no test code is treated as a real email. The session is an unguessable random 32-byte token, SHA-256 hashed in PostgreSQL, expires in 30 days and revokes on logout.
- Next.js: `/api/customer/oracle` mediates auth and address requests; it returns *no raw session token* to the browser and uses a host-only Secure+HttpOnly+SameSite=Lax cookie in production. CSRF origin checks protect modifying routes. `/account`, owned order history, saved addresses and checkout now use the Oracle session where enabled. Guest checkout remains available. Invalid supplied sessions cannot claim a stored order.
- Browser and Node integration tests must be proven on exact HEAD. No production env, live merchant menu, real provider credentials, migration, account import, POS or public order toggle was changed.

**Required to turn on, separately (not performed):**
1. Oracle dedicated `tuscanini_orders` PostgreSQL provisioned, backups/restore proven, migrations `schema.sql`, `schema-menu.sql`, `schema-customer.sql`, `schema-auth.sql` applied in order.
2. On Oracle: set `CUSTOMER_AUTH_ENABLED=yes`, a private 32+ char `CUSTOMER_OTP_PEPPER`, `TUSCANINI_RESEND_API_KEY`, verified-sender `TUSCANINI_AUTH_FROM_EMAIL`; verify a *real* OTP delivery and anti-abuse tests on mobile. Resend uses `POST https://api.resend.com/emails` with bearer credentials (see official documentation).
3. On Vercel: configure correct server-only `ORDER_API_ORIGIN` / `ORDER_API_SERVICE_KEY`, `ORDER_BACKEND=oracle` and the explicit `TUSCANINI_ORACLE_CUSTOMER_ACCOUNTS_READY=yes` flag only after staging validation. Store no tokens in client-visible environment variables.
4. Review rate limits including cross-email/IP abuse, session invalidation, operational monitoring, email sender setup and account data handling. Do not open real restaurant ordering because customer sign-in works.
5. Catalog, site settings and admin still have Supabase dependencies. Audit them and migrate/verify independently before removing Supabase or its credentials. Actual number of current Supabase Auth users has **not** been verified.

**Caution:** Authentication ownership is not reconstructed from an order's written email or phone number. Historical guest orders remain guests until explicit, independently verified recovery is designed.
