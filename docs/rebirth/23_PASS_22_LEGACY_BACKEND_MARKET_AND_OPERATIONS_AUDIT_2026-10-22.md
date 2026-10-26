# TUSCANINI REBIRTH — PASS 22
## Legacy Backend Inventory, Restaurant Operations & Egypt Market Scan
**Date:** 2026-10-22  
**Branch:** `redesign/tuscanini-authored-experience-20261018` · **PR:** #59 (Draft)  
**Scope:** Evidence from repository code/schema + public vendor sites; **NO live restaurant DB, POS terminal, merchant account, bank data or real customer orders inspected.**  
**Release:** No merge, no production deploy, no financial live mutation.

## 1. Decision

**Do not replace the existing backend wholesale.** It already defines an order-management workflow and concrete Supabase schema. First determine the restaurant's real in-store POS system and its integration surface. Preserve the authored Rebirth customer experience while auditing the older backend for operational reuse. The restaurant's actual POS may need to remain the system of record for payments, cash and stock, while the website owns discovery and direct ordering.

**Architecture hypotheses (not approved facts):**
- Option A — Existing POS has a supported API/webhook: integrate menu, order, state and reconciliation carefully; no parallel uncontrolled sales ledger.
- Option B — No POS API but software supports CSV/import/export: supervised pilot, manual staff acceptance and reconciliation before automation.
- Option C — Restaurant has no robust POS: harden the existing Supabase system into a tightly scoped operational system. Do not attempt to clone the entire POS market by default.
- Payment terminal / acquiring merchant account for in-store card payments != online payment gateway integration. Confirm separately.

## 2. Verified old backend inventory (from `main`)

Technology: Next.js App Router; Supabase/Postgres; server-side Supabase admin client; historical mock catalog. `supabase/migrations/001_initial_schema.sql` defines **20 tables**; migration directory contains **001–007 (7 SQL migration files)**. Presence in GitHub does not prove applied migrations in production.

| Module | Code/schema evidence | Status and limitation |
|---|---|---|
| Identity & roles | `profiles`, `user_roles`, owner/staff/kitchen/delivery enum | **Schema only for roles**; actual admin login uses one `ADMIN_ACCESS_SECRET` signed-cookie gate, not per-worker sessions or permissions. |
| Catalog | `menu_categories`, `products`, `product_sizes`, `product_addons`, `product_addon_links` + admin mutations | Product availability, activation, starting price, size price and badges writable. No verified real merchant prices yet. |
| Orders | `orders`, `order_items`, `order_item_addons`, `order_status_history`; `app/api/orders/route.ts` | Order creation, snapshot line items, server-side API, public lookup by UUID; submit != merchant confirmation. |
| Workflow | `types/admin-orders.ts`, `lib/admin/orders-admin-*.ts` | confirm / preparing / ready / delivered / cancel transitions; no proven end-to-end store acceptance. |
| Kitchen | `app/admin/kitchen`, `lib/admin/orders-kitchen-queries.ts` | Read-only grouped order board by status, item notes & addons; polling via `router.refresh()` ~25s; not proven printer/KDS device integration or real-time push. |
| Delivery | `delivery_handoffs` schema | Not evidence of a courier fleet, dispatch, live delivery or driver app. |
| Risk | `customer_flags` schema | No verified safe operational moderation flow. |
| Offers | `offers`, `offer_products`, admin create/update/toggle; migration 004 purchasable offer line | Exists in code, actual live promotion business signoff missing. |
| Feedback | `reviews`, `complaints` schema | Public routes send feedback to WhatsApp; verified database-backed ticket/moderation workflow missing. |
| Settings | `site_settings` admin mutations and public settings API | Ordering open switch, contact fields, WhatsApp, address; owner confirmation needed for live hours/contact. |
| Reporting | `daily_metrics` schema + dynamic admin aggregate queries | Estimates/order counts/hot items exist; NOT settled revenue, payment statements or profit accounting. |
| Tables/QR | `app/admin/tables/page.tsx` | Static links for 20 predefined table refs; not an integrated table occupancy/QR generator/cashier workflow. |
| Inventory | Product `availability` flags | No recipe ingredient quantities, purchase orders, spoilage/COGS or integrated stock engine observed. |
| Payments | No payment-ledger tables or online payment endpoint found in the inspected repo tree | Not integrated; no card charge, webhook reconciliation or refund ledger demonstrated. |
| External POS | No identified POS adapter/webhook/receipt printer/cash-drawer integration in repo | Shop software brand and contractual API capabilities **unknown**. |

Legacy `lib/menu-runtime.ts` silently fell back from unavailable Supabase menu to old mock data. **Never treat display fallback as permission to sell at obsolete price.** Legacy `lib/orders/create-order.ts` wrote order/items/history in separate calls with best-effort delete. Its `source` tag was `web_whatsapp`; this is not proof WhatsApp order completion.

## 3. What the Rebirth branch has actually changed

- Preserved the 113 historical menu item records and 16 categories for customer browsing; previous prices must not be treated as current merchant approved sale prices.
- Added 100 generated editorial illustrative WebP assets, 96/113 category-safe representative photo assignments, 17 deliberate fallbacks; avoid new generated assets and false actual-product-photo claims.
- Reworked customer home/menu/product/cart/order journeys and product image forward/reverse FLIP, reducing customer-facing menu to ONE browsing mode.
- Hardened order create code by resolving active current products/sizes/add-ons/offers and checking subtotal **before initial insert**, rather than trusting only browser prices.
- **Not solved:** atomic RPC/transaction, idempotency, paid order accounting, actual gateway, staff authorization/RBAC, POS sync, live kitchen/order acceptance, true inventory, 200% zoom and physical Android testing, real current menu and prices.
- Operator admin code is largely **carried forward from main**; Rebirth visual redesign is not evidence of new staff/operations implementation.

Sources: `docs/rebirth/20_CANONICAL_NEXT_CHAT_HANDOFF_2026-10-19.md`, `docs/rebirth/22_PASS_21_ONE_CUSTOMER_MENU_2026-10-20.md`; repo files above.

## 4. Technical/security launch gates — prioritized

**P0 critical (must before live paid orders):**
1. Identify in-shop POS program/vendor/version, actual cashier order steps, internet reliability, printer setup, current merchant payment hardware/gateway and return/void procedure. Inspect only with store authorization; no credentials, tokens, raw client phones, or merchant secrets in public issues/docs.
2. Reconcile actual 113 historic products against current in-shop menu, sizes/addons/taxes/delivery fees/opening hours and offered modes. Use one authoritative price source per live order.
3. Use transaction-safe backend order create (Postgres RPC or another vetted atomic server workflow) + unique idempotency key + race/duplicate/replay tests.
4. Individual staff identities, least privilege and route/action authorization; audit operational changes, examine CSRF, rate limiting and RLS in **actual DB**. SQL repository intentionally defers RLS policies; do not assert production RLS status from migrations alone.
5. Payment model: clarify cash-on-delivery/pickup vs gateway; signed server-side webhook verification, reconciliation, paid/pending/refunded/failed lifecycle and no reliance on redirect query fields alone.
6. Do controlled test orders with shop staff + kitchen; exercise rejection, cancel, network failure, duplicate retries, out-of-stock and refund; never use real cards in first fixture-only tests.

**P1 operational pilot:**
- Kitchen display sound/notification or ticket printing after examining actual hardware; safe duplicate suppression and failover.
- Matching online order to cashier receipt / POS sale and delivery handoff.
- Order volume, average realized basket, abandoned checkout, processing time and cancellation tracking with privacy-aware reporting.
- Manual/human rollback if POS/gateway integration incomplete.

**P2 authored creative experience:**
- Continue selective B03/B04/B05/B08 visual curation, full 320/390/768/1024/1440/zoom/mobile flow, realistic weak-Android motion and frontend a11y; no public 3-mode selector, no regenerating 100 images.
- Home → Menu → Detail → Cart is creative path; cashier → kitchen → handoff is separate operational path. Keep coherent, do not mix operator complexity into customer UI.

## 5. Egypt market scan (public information on 2026-10-22)

| Type | Grounded examples | Consequence for Tuscanini |
|---|---|---|
| Aggregators/discovery | Talabat, elmenus | They can acquire first-time customers and handle some operations. Commission is negotiated, not a universal public rate; check **merchant's signed agreement**, marketing and delivery terms. |
| Restaurant operating system | Foodics | Local Egyptian offer shows cloud POS, inventory, tables, add-ons, online ordering, kitchen and API options; published Egypt Basic from ~EGP 2,848.95/mo billed annually, Advanced ~EGP 3,733.67/mo billed annually (dynamic prices, quote/hardware extra). This is **an alternative/baseline, not the restaurant's identified installed POS**. |
| Direct branded ordering SaaS | Zyda | Supports Egypt, branded order site, store manager, and integrations with POS, delivery services and payment gateways; its official FAQ says subscription rather than percentage-of-orders platform commission. Gateway/delivery fees still separate. |
| Payment gateway | Paymob | Official Checkout and Payment Links are separate products from in-person terminals; listed standard gateway pricing ~2.75% + EGP 3 (verify contracted local method/settlement). An online merchant integration must still be built and tested. |

Sources (vendor/first-party): 
- https://www.talabat.com/page/vendor/terms/restaurants/egypt
- https://www.foodics.com/ar/foodics-pricing-egypt/
- https://www.foodics.com/ar/%D8%A7%D9%84%D8%B5%D9%81%D8%AD%D8%A9-%D8%A7%D9%84%D8%B1%D8%A6%D9%8A%D8%B3%D9%8A%D8%A9/
- https://zyda.com/get-started
- https://paymob.eg/en/pricing
- https://paymob.eg/en/checkout
- https://paymob.eg/en/payment-link

**Strategic conclusion:** Don't reflexively compete with Talabat's discovery or clone Foodics' entire operational suite. A distinctive Tuscanini-owned channel should be the restaurant's repeat-order and brand surface, with a reliable bridge to the actual shop process. Quantify who acquires the customer and the true operational costs.

## 6. Commercial arrangement — do not confuse three charges

1. **Build fee:** authored UX, design, photos/art direction, software architecture, delivery and integration.
2. **Monthly service/operations fee:** support, uptime, menu edits, vendor coordination, monitoring, regression testing; specify scope and response times.
3. **Optional performance upside:** agreed share of successful direct orders only **if contractually chosen**; agree on completed/paid/refunded/cancelled statuses, VAT/service fees/delivery tips exclusion, reporting access, attribution, payment cycle and exit terms. Payment gateway processing fees and any aggregator fees are the restaurant's separate vendor costs, not a substitute for developer compensation.

No fixed commission percent suggested without observing real shop margins, online order volume, operating responsibilities and merchant contract.

## 7. On-site discovery — what to collect (NOT secrets)

1. POS vendor/name/version and whether cashier runs Windows/browser/tablet. Does vendor expose official API, data export or documented integration? Who owns license/data?
2. One **synthetic** test order traced visually through cashier → kitchen → printed receipt → paid/delivered without exposing genuine customer data.
3. Actual menu exports/price lists; modifiers, taxes, costs and current stock/availability logic.
4. Payment provider & method: in-store card terminal? online checkout merchant ID? supported acquiring bank? Confirm merchant onboarding stage via nonsecret contract/product names, not credentials.
5. Printer/KDS network topology and what happens if internet stops (manual backup).
6. Order volumes by channel, average ticket, cancellations and delivery radius. Prefer owner-provided **aggregated** figures and permission-scoped reporting.
7. Clear roles: who confirms web orders, edits prices, handles refunds, support and disputes.

## 8. Proposed next delivery sequence

**Pass 23: Operations reality mapping** — non-sensitive diagram of actual on-site process and decision between integrate/replace/keep separate.  
**Pass 24: Payment/order safety plan** — design idempotency, atomic order flow, safe sandbox gateway and reconciliation; no live credentials.  
**Pass 25: Merchant catalog and admin acceptance** — approved current prices + role-based workflows in controlled environment.  
**Creative track continues in parallel** — asset-ID art curation and integrated mobile/desktop video QA before owner visual signoff.  
**Pilot** — low-risk supervised testing, then controlled go-live **only on explicit owner approval**.

### Audit confidence labels
- **Verified in repository** = actual paths/code/schema examined.
- **Needs runtime verification** = real DB migrations/RLS, production traffic, hardware, POS, price source, merchant provider.
- **Market claim** = published external vendor material as of stated access date; not an agreed contract or bespoke proposal.

**PR #59 stays DRAFT. No merge, production deploy, recreation of generated images, changes to original 113 menu prices or live merchant transactions authorized.**
