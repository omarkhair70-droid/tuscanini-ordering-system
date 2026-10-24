# Tuscanini Rebirth — Order Room integrated into Next.js (22 Oct 2026)

**Status:** actual multi-service, two-browser staging proof is implemented and verified. **Not production or live Rebirth checkout yet.** Branch `redesign/tuscanini-authored-experience-20261018`, PR #59 DRAFT.

## Product loop achieved

```
Next.js /studio (customer with a synthetic item)
   → Next /api/studio/bridge (local dev + fixed local engine address only)
   → independent PostgreSQL 16 order/lines/history/outbox (transaction)
   → Next /operator/orders (touch tablet view with a local test key)
   → accept / start / ready / deliver recorded by the local order engine
   → Next customer live ticket reads actual order status + event history.
```

This is a working vertical slice of **one order, two worlds**; unlike the previous isolated spike, both operator and customer views are **native pages of the same Next.js Rebirth project**, served by a studio-only bridge. Existing branded site `/menu`, `/cart`, and `/order-success` are **not** yet switched to this engine; they retain their inherited Supabase implementation.

## Verified GitHub CI
- [End-to-end run #39728485619](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39728485619): disposable PostgreSQL, separate TypeScript transactions, Next.js localhost app and backend simultaneously, Node HTTP pass for idempotent customer order → operator inbox → all actions → customer tracking and durable history, plus actual Chromium interactions at **390px customer** and **1024px operator tablet** for accepted → preparing, both successful.
- The CI produces **two actual screenshots** under the `tuscanini-two-screen-studio-browser` artifact. Compared screenshots before/after adjusting `RouteShell`; removed inherited sticky public header, mobile navigation and duplicated footer from these two private full-bleed studio screens.
- `18/18` standalone backend TypeScript tests also pass; the 3-job spike workflow at #39728872505 passed with the new Next+browser integration (backend Django suite also passed).
- Site-wide Visual QA for the legacy/Rebirth routes is separate. An earlier pre-update visual run #39728489862 had two **obsolete test assertions** looking for an old, deliberately removed photo disclaimer and old checkout checkbox wording. Corrected in `scripts/qa/rebirth-interaction-check.mjs`; do **not** claim that the latest comprehensive visual suite passed without checking it.

## What was actually implemented
- `lib/studio-bridge.ts`: explicit dev-only and localhost origin guards, non-public operator key comparison; no public production bridge.
- `app/api/studio/bridge/route.ts`: typed route allowlist for sample catalog, create, inbox, tracking, events and status actions. No arbitrary URL/path proxy. Fixed loopback backend origin and no client money authority.
- `app/studio/page.tsx`, `app/operator/orders/page.tsx`, `components/studio/studio-order-room.tsx` and `app/studio.css`: designed customer and operator pages using the existing Tuscanini ink/paper/red/yellow language.
- `components/layout/route-shell.tsx`: suppress old marketing navigation/chrome for these separately authored page shells only, not the public website.
- Local `experiments/backend-v2/typescript/src/studio.ts` bootstraps an independent disposable Postgres schema + demo items, and `src/http.ts` accepts an explicit long local test token; `src/operations.ts` exposes server-side inbox and durable event list.
- `scripts/qa/rebirth-next-studio-integration.mjs` checks Next/API + PostgreSQL correctness; `scripts/qa/rebirth-studio-two-window-browser.mjs` clicks both live UIs and takes screenshots.
- No live merchant, POS, Talabat, payment gateway, phone notifications or customer accounts used.

## Start both Next.js interfaces yourself

Create your own disposable localhost PostgreSQL database named `tuscanini_spike` and user `spike`; the interactive studio initializes schema if missing but does not drop existing records. Do **not** run isolated destructive tests while actively using that same DB.

Generate your own **test-only** shared bridge token and separate operator key (24+ characters). Terminal A:

```bash
export POSTGRES_DB=tuscanini_spike POSTGRES_HOST=127.0.0.1 POSTGRES_USER=spike
export POSTGRES_PASSWORD="<your-disposable-local-test-password>" TUSCANINI_SPIKE_ONLY=yes
export TUSCANINI_STUDIO_BRIDGE_TOKEN="<your-long-test-token>"
npm install --prefix experiments/backend-v2/typescript --no-package-lock
npm run studio --prefix experiments/backend-v2/typescript
# Observe http://127.0.0.1:<ephemeral-port>/studio
```

Terminal B, the SAME COMPUTER running the Next.js app:

```bash
export TUSCANINI_STUDIO_ENABLED=yes
export TUSCANINI_STUDIO_ORIGIN=http://127.0.0.1:<ephemeral-port>
export TUSCANINI_STUDIO_BRIDGE_TOKEN="<same-long-test-token>"
export TUSCANINI_STUDIO_OPERATOR_KEY="<your-separate-long-operator-key>"
npm ci
npm run dev -- -H 127.0.0.1
```

Open `http://127.0.0.1:3000/studio` and `http://127.0.0.1:3000/operator/orders` in two browser windows. Type the operator key into the operator page, create a sample order on the customer page and move it through its stages. **Do not publish localhost bridge credentials.** If `TUSCANINI_STUDIO_ENABLED` isn't set, or in any production build, the studio pages and bridge are **404**. No live database permission is used.

## What comes next (one coherent execution backlog)

**36 — Real Menu→Cart Order Contract.** Replace synthetic SKU catalog with **merchant-reviewable staging copies** of actual Tuscanini product/size/addon/offer choices. Persist full snapshots of item, variant, add-ons, notes, quantity, addresses (where needed), delivery/pickup and buyer contact with appropriate privacy; validate price on the server and ensure idempotency binds the complete choice set. Only after that wire the *existing Rebirth /cart submit* to staging: NEVER silently convert a customized cart into a plain `sku,qty` order.

**37 — Operator PWA/Staff Identity.** Migrate `/operator/orders` from a test key to named staff sessions with scoped permissions; attach detailed line modifiers, status history, order-intake sounds, tablet-safe reconnect and handoff into the existing conventional cashier process.

**38 — Tracking Motion & Web Push.** Reuse the actual branded `/order-success` ticket component and update from the first-party order-event stream with state-specific animations and staff-provided prep estimates. Add opt-in service-worker push, subscriptions, durable notification sending and real Android/browser-permission tests. No pretending the foreground polling prototype sends closed-tab Web Push.

**39 — Whole-Website Finish & Pilot.** Keep polishing Home, Menu, Cart, Offers, Finder, About, Contacts, Reviews, Complaints, and the visual/UX throughline, then merchant price, hours, delivery, fee and staff signoff; test one authorized pilot before deciding public cutover.

**Non-goals for this phase:** replacing the existing POS, needing Talabat API access, drawing courier movement without real GPS, any artificial monthly hosting expense, production deployment or merge of Draft PR #59.
