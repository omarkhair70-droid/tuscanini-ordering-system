# PASS 36 — Full Rebirth Menu/Cart → Independent PostgreSQL → Operator → Living Ticket
**2026-10-22 | Branch:** `redesign/tuscanini-authored-experience-20261018` | **PR #59 DRAFT — no merge, no merchant data, no public release.**

## Result
The *existing Rebirth product menu and actual cart* now submit through the **independent PostgreSQL staging engine**, retaining product variants and add-ons and connecting to the **same operator tablet** and **original art-directed Order Success/Tracking**. This is more than the earlier three-fake-SKU Order Room fixture.

### One real two-screen test path
1. Customer visits `/menu` in local Next.js studio mode.
2. Chooses **تشيكن فاير**, size, the first add-on **موتزاريلا**, quantity **2** in the original branded picker, then continues to the original `/cart`.
3. Enters name, phone, delivery address and reviews order in the original checkout.
4. `POST /api/orders` detects **localhost dev staging only**, validates the complete submitted cart, and uses a request key that stays fixed for retries of the same exact cart/contact payload.
5. Next's server imports a staging copy of the **113 recorded Tuscanini products and their sizes/add-ons** from `lib/mock-data.ts` into the disposable `spike_ts.menu_catalog`. No source price originates from the client.
6. Backend validates each selected product/size/add-on under DB locks, computes the price **in integer cents**, saves a complete immutable line snapshot `name+category+selected size+selected addons+notes+quantity`, customer contact/order type and any table reference, order state, audit history and outbox atomically. Bad options, key reuse with changed cart, forged client totals/price and transaction rollback have tests.
7. Staff opens **native** `/operator/orders`, uses the localhost test key, sees full line details and contact, accepts and starts preparation.
8. Customer's existing branded `/order-success?orderId=...` ticket polls the same PostgreSQL order through `GET /api/orders/track`, updates its decorative status stamp and tracking facts. No fake ETA required.

**Evidence:** [Green full-cart Next/API + two-browser run #39731707615](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39731707615). Pass logs include `FULL REBIRTH CART`, server price tamper, idempotent reruns, actor actions, and actual Chromium branded Menu→Cart→Order Success at **390px** driven by operator at **1024px**. Screenshot artifact `12405550962` contains `studio-original-rebirth-tracking-390.png` and `studio-rebirth-order-operator-1024.png`. Subsequent desktop tablet design revision moved the operator inbox to the main 1fr canvas, with active/new orders prioritized first; check latest run before declaring that final screen verified. Previous original Rebirth status screenshot had a sticky-header **full-page capture artifact** due to test scroll position; the next capture scrolls to top first.

**Tests:** The TypeScript/Postgres suite grew from 18 to **20** with transactional size/add-on/notes/price authority, invalid choices, duplicate add-ons, same-key collision; Django suite unaffected. Never conflate these with a real merchant pilot or browser Push test.

## Modules
- `experiments/backend-v2/typescript/schema-menu.sql`: **additive** schema migration for existing disposable local DB: `menu_catalog`, `orders.customer_snapshot/order_type/table_reference`, `order_line.selection_snapshot/notes_snapshot/category_snapshot`.
- `experiments/backend-v2/typescript/src/menu-orders.ts`: catalog import + canonical request SHA + server price/resolution, atomic order+lines+event+outbox.
- `experiments/backend-v2/typescript/src/http.ts`: localhost-only `POST /api/studio/catalog/sync`, `POST /api/orders/menu`, `GET /api/orders/:id/menu-tracking`.
- `experiments/backend-v2/typescript/src/operations.ts`: show precise full cart lines and customer fields to staff, prioritize received/active orders.
- `lib/studio-menu-orders.ts`: Next server-side catalog mapping and sync, full Rebirth order payload adapter and status mapping.
- `app/api/orders/route.ts`, `app/api/orders/track/route.ts`, `app/api/public/site-settings/route.ts`: local-dev gated staging substitution only. All non-dev/non-local traffic retains inherited behavior.
- `components/rebirth/rebirth-checkout.tsx`: idempotency key stable for one cart/contact payload, checkout staging retry does not unnecessarily block.
- `components/studio/studio-order-room.tsx`, `app/studio.css`: staff line variants, notes, customer and improved tablet layout.
- `scripts/qa/rebirth-next-studio-integration.mjs`, `scripts/qa/rebirth-studio-two-window-browser.mjs`: HTTP, PostgreSQL + actual UI integration evidence.

## How to use
Prerequisite: on your **own** computer create disposable PostgreSQL DB `tuscanini_spike`. Follow [Pass 35's launch instructions](35_NEXTJS_ORDER_ROOM_TWO_SCREEN_INTEGRATION_2026-10-22.md) and start BOTH the Node engine and Next.js dev server with `TUSCANINI_STUDIO_ENABLED=yes`, the same bridge token, the correct `TUSCANINI_STUDIO_ORIGIN`, and a separate operator key.

Now **do not use /studio** to test a real Tuscanini cart. Open `http://127.0.0.1:3000/menu`, add any of the recorded products with choices, review `/cart`, submit, follow `/order-success` and separately open `/operator/orders`. All prices and products are currently a **staging copy of the historical menu**, not a merchant-approved sales menu.

**Security / product boundaries:** local loopback only, no deployment. Staff's manually-entered long key is still a **fixture and not staff authentication**; buyer contact saved in a disposable local DB for QA only. Staging orders should never be mixed into the restaurant's live data. No real payment processing, POS receipt printer, Talabat integration, dedicated prep estimate, courier GPS or background Web Push exists. Offer SKUs have no current authored catalog and return a clear "not yet available" message rather than losing their data. Future plans must not strip any addon/variant to shoehorn into the old SKU-only order contract.

## Next decision: staff console then push
1. **Operator experience as a real tablet product:** named cashier/kitchen sessions, order alert, dedicated new/preparing/ready queues, clear status feedback, reconnect, exact mods, actions with optimistic but reversible pending UI.
2. **State-created artistic tracking:** event-driven motion, operator-editable preparation estimates, menu→cart→ticket transition; use the existing type/photo system without clutter.
3. **Opt-in Web Push:** service worker, VAPID + stored scoped subscriptions, durable retry with idempotency, Android device test when page/tab isn't visible.
4. **Merchant release:** finalize owner-approved prices/availability/delivery/fees, auth, real DB backups and supervised single-store pilot, then decide merge/deploy separately.

**No new arbitrary Django/POS research spike**: one customer/order/operator product is now technically connected in staging. Continue the existing Rebirth-wide creative QA and 390px device testing alongside operations.
