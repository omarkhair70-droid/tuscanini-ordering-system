# TUSCANINI REBIRTH — PASS 23 / Concurrent Staff Order Guard & Operations Flow
**Date:** 2026-10-22
**Repo:** omarkhair70-droid/tuscanini-ordering-system
**Branch:** `redesign/tuscanini-authored-experience-20261018`
**PR:** #59 — **DRAFT, no merge or production deployment authorized**

## Why this pass

After Pass 22 cataloged the historical restaurant backend and the Egyptian POS/ordering landscape, the nearest code-only, merchant-independent risk is a *stale admin write*: two staff users can read the same order and act on different states. Previously `applyOrderUpdateOrThrow` in `lib/admin/orders-admin-writes.ts` only selected the target by order ID when updating. The old read could overwrite another employee's later status change.

## Implemented on the existing Draft branch

1. `lib/admin/orders-admin-writes.ts`: the conditional `orders.update(...)` now requires **both** the original `status` and original `confirmation_status`, not just `id`. This is optimistic concurrency / compare-and-swap (CAS) at the database row level.
2. A mismatch returns a clear Arabic message telling staff to refresh and re-read the latest state. It does not silently overwrite the latest order status, and does not insert a new history record when the write is rejected.
3. `scripts/qa/rebirth-order-concurrency-smoke.mjs`: deterministic in-memory Supabase-adapter regression exercising the **actual compiled TypeScript source**; includes:
   - Normal preparing transition and history.
   - Stale preparing write after a concurrent cancellation — reject.
   - Stale confirmation write after another employee confirmed — reject.
   - Successful confirmation without a material order-status change.
   - Demonstration of the **still-open** non-atomic history failure (status changes but history insertion fails).
4. `.github/workflows/rebirth-home-ci.yml`: runs this test before TypeScript and Next build. No live credentials, real customer data or merchant backend accessed by this regression test.

## Exact safety boundary

**This is a partial risk reduction, NOT complete order transaction safety.**
- The transition write and `order_status_history.insert` are still separate HTTP/DB calls. Under a failed audit insert, the DB may show a new state without its timeline entry. The fifth test documents this intentionally, and the production readiness gate remains **red**.
- `create-order.ts` still creates header, lines, addons and audit history via multiple calls with best-effort cleanup; no atomic RPC, idempotency or replay protection yet. Repeat ambiguous customer submissions remain a serious launch blocker.
- Admin access still uses a shared secret, not individual staff identities or role-authorized actions.
- The manual staff business rule (whether kitchen can see unconfirmed orders and when production can begin) must be agreed on with Tuscanini's operations lead. **Do not assume an operational policy from code.**
- This change does not introduce payment, refund, gateway, POS integration, or any assumptions about actual current restaurant menu prices.
- Branch changes may trigger existing GitHub Actions and any configured automatic preview builds. No manual merge or production deploy.

## Test evidence / status

- **Verified actual-code GitHub Home CI** on code+test+CI SHA `d41b7b284c13c53a3092b0b425373269d3f8d347`: [run #39703982972](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39703982972) **completed SUCCESS**. Its job steps show regression test **success**, `npx tsc --noEmit` **success** and `npm run build` **success**. Job log contains `PASS: 5 admin order concurrency tests; no merchant database accessed`. A new docs-only head may have additional CI runs; do not conflate older and newer SHA results.
- No live Supabase connection or real order E2E was performed in this pass.
- Existing generated 100 food images, 113 historical catalog items and prices, and Rebirth customer visual direction left untouched.

## Operations map still to validate on site

Customer submitted → verified live store hours/price → `orders` row **pending** → staff review/confirm → kitchen accepted/preparing → ready → pickup or delivery handoff → delivered → reconciliation of paid/failed/refunded orders.

**Open operational questions to settle with owner/manager (collect no secrets):**
- Brand/version of cash-register POS, whether it exposes API/CSV, and who controls it.
- Payment *terminal* versus online merchant *gateway*, provider name, sandbox capability and reconciliation process.
- What event is considered acceptance of a web order by staff? Does prep ever start before `confirmation_status = confirmed`?
- Receipt printer, kitchen monitor/tablet, sound alerts, network fallback, handling repeat orders.
- How actual current prices, availability, modifiers and order totals are approved and kept in sync.

## Next implementation pass

**Pass 24** should atomically combine admin status change + history write (Postgres server-side function/RPC with a vetted migration and permission model), then add complete database transaction and idempotency for *new order creation*. Only after synthetic staging E2E and merchant integration discovery should payment wiring and live kitchen acceptance proceed. Keep design/mobile visual QA running as an independent creative track; do not let POS research stop site art direction.

**No merge. No production deploy. PR #59 Draft.**
