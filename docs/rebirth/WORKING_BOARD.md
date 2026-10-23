# TUSCANINI REBIRTH — ONE WORKING BOARD

**Last audited (including broad capability scan):** 2026-10-22 | **Branch:** `redesign/tuscanini-authored-experience-20261018` | **PR:** [#59 (DRAFT)](https://github.com/omarkhair70-droid/tuscanini-ordering-system/pull/59) | **Audited code checkpoint:** `82a1a262d41ff78b2dd56546a410cdbb3125b3f1`.

> **Start here in every new chat, and update this SAME FILE after every meaningful feature/review.** This is the current execution and coverage index; historical `00–38`, original research, the HTML reference and technical handoffs remain evidence, not competing "next task" lists. Use the current GitHub PR HEAD and Actions results if newer; never assume this snapshot is the HEAD forever.

## CONTROL ROOM — complete remaining-work radar (23 Oct 2026)

**This is the at-a-glance execution map you requested.** There is ONE product: the Vercel Tuscanini website and its ONE accessible restaurant order screen. Everything below is visible even if not the current sprint. The detailed U01–U12 ideas and P01–P18 payment possibilities in sections 9–12 remain attached to this same board. Do not hide or silently turn these into unapproved code.

**Evidence terms:** `TESTED-LOCAL` = GitHub actions + disposable local Postgres; `READY-PREVIEW` = Vercel website builds/serves pages; `OPEN` = not implemented; `MERCHANT` = decision/data outside verified code; `FIELD` = requires actual phone/tablet/restaurant.

### Milestones — real dependencies, not a new environment for its own sake

| Gate | Desired customer-visible outcome | Exact next deliverable | Verified status |
|---|---|---|---|
| G00 | See both designed screens via Vercel | Stable customer/Order Press/Ticket Rail URLs; local 20-ticket interactive demo | **READY-PREVIEW + browser CI PROVED** at `2a48f08e` |
| G01 | Dedicated Tuscanini data on existing Oracle | Coolify DB+API Compose, unique app user/volume, health and backup/restore | **DB+API COMPOSE COMMITTED — NOT DEPLOYED** |
| G02 | Durable safe service rather than test fixture | New `services/orders-api` with own migrations, service auth, server pricing/idempotency and event states | **CODE BUILT + POSTGRES CI SUCCESS**; not deployed, hardening open |
| G03 | One live shared order between phone and tablet | Preview-only Next adapters + operator gate + gated catalog sync, then internet roundtrip | **CODE BUILT / DEFAULT OFF**; remote E2E still OPEN |
| G04 | Merchant business rules actually true | Approved menu/prices/options/offers, phone/address/hours, delivery region/fee/time, payment and cancellation choices | **MERCHANT** |
| G05 | Operationally reliable restaurant flow | Real tablet + Android test, foreground sound, sleep/reconnect, 20–50 tickets, retry conflict, data security, backup recovery | **FIELD/OPEN** |
| G06 | Controlled restaurant web ordering | Pilot, monitoring, final owner signoff, deliberate production cutover & support/rollback | **OPEN** |

### ALL remaining core workstreams (not a list of automatically approved add-ons)

| ID | Front / backend / operations | Current reality | Finish condition and priority |
|---|---|---|---|
| C01 | Home editorial and visual direction | BUILT preview; visual approval open | Whole Home→Menu flow and imagery signed off (P1) |
| C02 | Menu/catalog/search/categories/finder | BUILT with old sample/historical menu | Correct 113-item inventory/availability and alternatives, search empty/error, approved food identities (P0/P1) |
| C03 | Product modifiers/photos/notes/qty | Browser tested | Real sizes/addon pricing, stock combinations, photos matching SKU, keyboard accessibility (P0/P1) |
| C04 | Cart editing, duplicate prevention, saved review | Browser tested | Long-order + field/input/zoom/offline/address/pickup replay edge acceptance (P1) |
| C05 | Checkout delivery vs pickup & genuine fee | Honest display, fee unverified | Delivery coverage, current fee/tax/packing charge and actual payable total (MERCHANT/P0) |
| C06 | Payments: cash on delivery/pickup, on-prem POS | Only research inventory | Owner selects what is accepted; unpaid/collect-at-handoff state clearly recorded (P1) |
| C07 | Payments: cards, Meeza, wallets, QR, Fawry, InstaPay, Apple/Google Pay, links, deposits, split | U01 P01–P18 documented; no integration | Choose supported provider and merchant account; signed callbacks, failures, reconciliation/refunds (DECIDE; not auto-P0) |
| C08 | Orders in permanent DB, prices, retries | New dedicated PG schema/API + CI tested; Oracle not deployed | Isolated Oracle PG, backup, migrations, API health/metrics (P0) |
| C09 | Remote Vercel-to-Oracle transport | Preview-only server adapter BUILT, feature flag OFF | Deploy HTTPS API, configure secrets, remote full cycle/abuse testing (P0) |
| C10 | Operator screen accessible from URL | Public interactive demo PREVIEW 200 | Same design shows **real** orders only for authorized restaurant access (P0) |
| C11 | Operator workflows: accept/reject/prep/ready/handoff | Local PostgreSQL E2E tested | Remote authorization/conflicts and exact restaurant physical handoff (P0) |
| C12 | Staff entry/security | Test key and no production login | One minimal protected restaurant gate/session; no shift/employee POS platform (P0) |
| C13 | New order visibility and alert | Opt-in browser sound; mock ticket load | Sleep/visibility/reconnect/new arrivals, audio on actual tablet (P0/P1) |
| C14 | Order ticket and stage changes | Local/Postgres tested, preview states | Remote real UUID capability, PII protection, long-lived ticket/recovery and reconciliation (P0) |
| C15 | Restaurant-set prep ETA | NOT BUILT | Save staff-entered estimate in order event, show timestamp as estimate, not guarantee (P1) |
| C16 | Pickup and delivery handoff | Partial UI | Wrong zone, courier, failed pickup, closed time/late order, route-specific terminal wording (MERCHANT/P1) |
| C17 | Cancellation/change/support | WhatsApp REQUEST and rejected status built | Actual owner cutoff, edit/reject protocol, refunds outside/inside payment provider (MERCHANT/P1) |
| C18 | Notifications | Foreground sound only; no Web Push | User opt-in + push subscription/event/deep link; actual device test if commissioned (P2) |
| C19 | Promotions/offers/coupons | Existing offers page; unverified validity | Eligibility, expired offers, bundle/modifier math, one code per order, honest promo T&Cs (MERCHANT/P1/P2) |
| C20 | Contact, About, Reviews, Complaints | Built pages, WhatsApp handoffs not a stored CRM | Numbers/maps/hours, blocked WhatsApp, permission/validation; decide persisted forms (P1) |
| C21 | Mobile UX, motion, accessibility | Desktop/mobile screenshot CI | Real 320/390/768/1024/1440 devices, virtual keyboard, focus, RTL, contrast and reduced-motion (P1) |
| C22 | Images and typography | 12 restaurant + 100 generated illustrations on repo | Exact SKU photo trust, 17 unmatched items, image crop/asset/performance signoff (P1) |
| C23 | Performance/SEO/PWA | Shell and cache built | LCP/CLS/INP, offline boundaries, cache exclusions, metadata, sitemap, install behavior (P1/P2) |
| C24 | Security, rate limits and privacy | Test protections partially | Tracking capability, staff auth, bot resistance, no PII in logs, retention/deletion (P0) |
| C25 | Database migrations/backups/restore | Only disposable migrations proven | Isolated Oracle PG, persistent volume, tested backups, restores, upgrade/runbook (P0) |
| C26 | Server deploy and observability | Vercel READY; Oracle Tuscanini not deployed | Coolify real API health/logs/TLS/restarts, deploy gate, explicit rollback (P0) |
| C27 | Staff/merchant training and launch | Not run with actual restaurant | Tablet orientation, 2-minute walkthrough, support contacts, live supervised rehearsal (FIELD) |
| C28 | Analytics, privacy-safe conversion insight | No confirmed production tracking | Event map and consent, no order contact/PII to third parties (P2) |
| C29 | Loyalty, reorder, gifts, referrals, CRM, expanded delivery/print/POS integrations | Idea universe U01–U12, not built | Evaluate each against demand, costs and owner approval; not silently added (LATER/DECIDE) |
| C30 | Rollout, maintainability, operational cost | PR Draft; no merchant release | Preview QA→pilot→approval→guarded deploy, monitoring, documentation and handoff (P0) |

### What's next IN ORDER (keep execution moving)

1. **FIRST — G01/G02:** inspect Oracle/Coolify resources *without touching the Nova/Plantupia deployment*, create **isolated** database and a proper real order API with migrations and secure staff authorization; don't connect the dangerous localhost simulation.
2. **THEN — G03:** connect Vercel `/api/orders`, `/api/orders/track` and the existing `/operator/orders` to the same Oracle order engine behind server-only credentials, with a visible demo/live distinction and safe fallback switch.
3. **PROVE — G05:** two physically separated devices, price retry/restart/decline, Android/tablet audio/reconnect, protected order ticket, operator success/reject.
4. **THEN — G04/G06:** merchant truth (fees, price, payment choice, contacts) and explicit pilot go/no-go, backups/restore and rollout.
5. **PARALLEL creative route:** C01–C04, C20–C23 can continue without pretending those assets finish commerce. Web Push/loyalty/POS/payments beyond agreed merchant methods remain separate decisions.

### Oracle deployment status & live access boundaries

- Existing Oracle VM with Coolify can **potentially host** the isolated Tuscanini service and PostgreSQL. **Do not** point it at the Nova database, existing production media, or Redis. Capacity/permissions are unverified; no new Tuscanini Oracle service is claimed.
- **NEW FILES COMMITTED:** `infra/oracle/postgres.compose.yaml` (DB container/healthcheck/persistent storage, **no** exposed 5432) and `infra/oracle/README.md` (detailed secure rollout, exact gates and configuration). **NO Oracle deployment has occurred yet.**
- The experiment's `db.ts` explicitly refuses remote DB and `http.ts` has **fixture-only auth**; removing guards and publishing that API would be unsafe. Build G02 separately.
- Vercel's branch preview itself is functioning; site and operator visual demo being ready are distinct from real database order intake.
- A working Coolify/Oracle administration connection is required for actual resource creation, environment variables and deployment. No DB/SSH passwords should be pasted into GitHub, chat or logs.

**Every status update from now on:** Current milestone / changed files + SHA / Build + Browser + PostgreSQL CI / **site preview & order screen links** / what exactly remains and the next unblock. If blocked, mark it honestly and continue independent code/art work.

---

### Execution checkpoint / Oracle transport build (23 Oct 2026)

**Code now built on PR #59** — dedicated `services/orders-api` with separate `tuscanini` SQL schema and additive migration (no `spike_ts` or shared Nova/Plantupia DB), isolated pg pool, authenticated service HTTP routes, server-priced catalog modifiers, idempotent checkout, event log/outbox, operator inbox/actions and PII-minimized customer tracking. The API's test suite proves real PostgreSQL 16 behavior, including identical-cart replay, changed-cart 409, unauthorized inbox/action 403, received→accepted→preparing→ready→delivered and fail-closed default OFF. **No Oracle deployment yet**. Code sources: `services/orders-api/src/`, `services/orders-api/migrations/`, `services/orders-api/Dockerfile`, `services/orders-api/tests/service.test.mjs`, `.github/workflows/tuscanini-orders-service.yml`.

**Same customer site and same order screen:** `lib/oracle-order-api.ts` routes server-to-server only when **both** `VERCEL_ENV=preview` and `ORDER_BACKEND=oracle`; customer `/api/orders`, `/api/orders/track`, and operator `/api/studio/bridge` now have **preview-only** real-service adapters. Staff action/inbox requires a DIFFERENT long passkey in the Next server. For controlled catalog import the new `POST /api/internal/orders/catalog-sync` requires staff passkey, preview flag and `TUSCANINI_ALLOW_CATALOG_SYNC=yes`, plus the isolated service's own `CATALOG_SYNC_ENABLED=yes`. Until all these explicit flags are configured, Vercel remains the same interactive 20-ticket design demo and historical backend. **No public real-order API, no anonymous staff data**.

**Oracle Compose ready for administrator deploy:** `infra/oracle/postgres.compose.yaml` now defines BOTH PostgreSQL and the dedicated Node API, an internal database-only port and its persistent storage. `infra/oracle/README.md` is the single setup/rollback runbook. Actual Coolify project creation, HTTPS API hostname, service secrets, catalog upload, DB backup/restore and remote two-device E2E remain OPEN; do not claim deployment.

**Verification:** dedicated workflow [Tuscanini Dedicated Order API PostgreSQL](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/workflows/tuscanini-orders-service.yml) **SUCCESS** on technical SHA `157cb024`; [Home/Next TypeScript CI #39883719809](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39883719809) **SUCCESS** on same code after isolating `services/orders-api/**` into its own TypeScript compilation scope. Additional visual/Backend jobs and documentation-HEAD reruns may still be active; inspect their conclusions before claiming a complete four-gate pass.

**Blocking dependency:** no authorized OCI/Coolify control panel session in the connected tools. A GitHub commit or Vercel READY cannot create an Oracle container or verify DB data. Never take credentials in source or chat. Continue source+CI until Coolify access is available, then publish isolated Postgres/API with fail-closed ingestion and demonstrate same real test order across phone/restaurant tablet.

---

## Live preview links and session rhythm (23 Oct 2026)

**One recurring check-in:** every implementation response should include **what changed / working code HEAD / three CI statuses / Vercel preview link / next two tasks / blockers**. Continue updates in this board rather than separate handoff files. Vercel deployment `READY` is proof the build is hosted, **not** proof of a shared remotely connected restaurant data engine or merchant acceptance.

**Stable branch preview alias** (deployment is replaced by each successful Git push to PR #59):
- Customer site: https://tuscanini-ordering-syste-git-6bc29f-omarkhair70-droids-projects.vercel.app/
- Restaurant screen: https://tuscanini-ordering-syste-git-6bc29f-omarkhair70-droids-projects.vercel.app/operator/orders
- Checkout: https://tuscanini-ordering-syste-git-6bc29f-omarkhair70-droids-projects.vercel.app/cart
- PR: https://github.com/omarkhair70-droid/tuscanini-ordering-system/pull/59
- Native Vercel branch Preview requires Vercel access or a **temporary Vercel share link**; generate the latter directly rather than committing expiring bypass tokens to GitHub.

**Scope correction confirmed by owner:** The restaurant screen should **open normally from the URL**, not return 404 because the local PostgreSQL fixture is disabled. Implemented on branch:
- `app/operator/orders/page.tsx` always renders this real interface, without a `notFound()` check. With localhost staging disabled (normal Vercel builds), it displays 20 **synthetic** tickets and a prominent truthful notice.
- `components/studio/operator-press.tsx` exposes Order Press and Ticket Rail, search, queue, filters, and **clickable local demo actions** (accept/reject/prepare/ready/complete). Demo state is kept in browser React state ONLY; resets with a button; no real order API calls, no real customer names/phone/address, no payments. This is much more useful for judging actual operator interaction than static screenshot or inert buttons.
- Real staging with `getLocalStudioOrigin()` still shows real Postgres-backed tickets and requires the existing operator key for server mutations. Its separate `?preview=20` mode remains strictly inert for localhost visual fixture tests.
- `scripts/qa/rebirth-interaction-check.mjs`: at 320/390/768/1440, assert the public operator route HTTP 200, 20 synthetic tickets, local accept→prepare, rail switch, reset, and ZERO calls to `/api/studio/bridge`; write screenshots at 390/1440.
- **Proof:** Vercel project deployment `READY` for technical SHA `2a48f08e`. Verified branch alias GET `/operator/orders` returned **HTTP 200**, replacing previous 404. At technical SHA `2a48f08e`, **all three GitHub workflows SUCCESS**: [Home/TypeScript CI #39878775525](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39878775525), [Backend/PostgreSQL CI #39878775512](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39878775512), [Real Browser Screenshots & Asset Gate #39878775509](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39878775509). The latter explicitly proves operator page 200, 20 synthetic orders, local accept→prepare→reset, rail navigation and **ZERO** studio API calls at 320/390/768/1440. This is a public UI demo, not live restaurant data or merchant production approval.
- **Not implemented:** A public *real-time* shared production order queue and merchant-ready checkout. Do not misrepresent the open demo as real order intake or loosen server authorization on any future real shared instance.

Next: close browser test and screenshot review; continue T03 merchant-controlled prep estimate and T05 connection/touch/audio field tests. All payment/cancellation/refund and catalog questions still remain in section 9.

---

## 0. The whole product, without scope creep

**Only TWO customer-facing systems:**
1. **Original Tuscanini Rebirth website:** Home → Menu/search → Item size/addons/notes/quantity → Cart/fulfillment → submit → living tracking ticket. Supporting Offers, Food Finder, About, Contact, Reviews, Complaints are part of the SAME site.
2. **One restaurant order screen** at `/operator/orders` on a tablet/desktop: notice incoming website orders, inspect exact choices and customer/fulfillment details, accept/decline → start preparing → ready → handed over, and automatically update the customer's ticket. **Order Press** is the focused decision view and **Ticket Rail** is an alternate receipt-reel view, NOT competing applications.

Existing cashier/POS, phone ordering, Talabat and their devices remain separate. **Not in scope:** replacing the POS; multi-user workforce accounts/roles/shift management; POS dashboards; stock procurement; payments/gateway; chef stations or order printers without an actual owner request. A **simple secure restaurant access gate** and server authorization of its buttons IS necessary; that does not mean building a staff-management product.

### Working language — NEVER blur the statuses
- **BUILT** = source exists on draft branch.
- **CI PROVED** = a specified automated scenario passed against that commit.
- **VISUALLY REVIEWED** = real screenshot/film observed at named sizes.
- **FIELD PENDING** = mobile/tablet/person-in-restaurant not tried.
- **MERCHANT PENDING** = data, price, wording, branding, or workflow unapproved.
- **OPEN / NOT BUILT** = still needs product code.
- **OUT OF SCOPE** = intentionally not promised; do not silently build.

**A green CI is not a deployed website, visual approval, or live restaurant test.**

## 1. What actually works now — evidence ledger

| ID | Verified work | State / evidence |
|---|---|---|
| E01 | Next.js 16 / React 19 / TypeScript Rebirth site with 10 public paths and distinct Home/Menu/Product/Cart/Tracking and support pages | BUILT; [whole-site screenshot workflow](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39772466722) **SUCCESS** on audited HEAD |
| E02 | Direct single customer menu; 113 historical products / 16 categories, search, categories, paging, choice modal and stored item quantity/size/addons/notes | BUILT + browser fixtures; **historical data NOT merchant-approved** |
| E03 | Original cart→local staged order→independent PostgreSQL atomic line snapshots→tablet inbox→original living customer ticket | CI PROVED in separate **loopback STAGING**, [three-job Actions proof](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39771522529). Real merchant cutover NOT done |
| E04 | Transactional Postgres order record, server-authoritative price, modifier validation, payload-bound idempotency, event log/outbox | CI PROVED on disposable database; tests from [Pass 36](36_REBIRTH_REAL_CART_OPERATOR_TICKET_POSTGRES_2026-10-22.md) |
| E05 | Order Press focus+queue / Ticket Rail, filters/search, All-Day active item counts, 20 diverse visual pressure tickets (actions disabled) | CI PROVED at 1024/768/390 with real screenshots; see [Pass 37](37_THE_ORDER_PRESS_AND_TICKET_RAIL_2026-10-22.md) |
| E06 | Opt-in foreground two-tone new-order sound, new arrivals label, RTL rail buttons, mobile condensed first-ticket access | BUILT + CI PROVED on `6dca3806`; [Pass 38 actual before/after](38_OPERATOR_ATTENTION_AND_SITE_VISUAL_QA_2026-10-22.md). Physical tablet/audio/reconnect FIELD PENDING |
| E07 | 12 source-backed authentic restaurant JPGs and 100 generated illustrative WebPs | FILES PRESENT. 96/113 historical entries have representative assignments from 65 art files; 17 don't; **0/113 exact SKU photographs merchant-certified**; do not regenerate 100 wholesale |
| E08 | Customer ticket with server statuses, pending/confirmed distinction, stale/offline recovery and decorative state-tied stamp | BUILT + scripted fixtures; operator→customer STAGING CI PROVED, **not Web Push** |
| E09 | PWA manifest, icons, offline page, basic cache service worker | BUILT / legacy support. **No push event or remote-notification delivery** in current `public/sw.js` |
| E10 | Home, menu, 12 photo system and selected material/FLIP transitions with reverse/escape and reduced-motion testing | BUILT + browser visuals, not whole-site art-direction approval |

**Latest inspected code HEAD `82a1a262`:** all three PR workflows SUCCESS (Home, Public Visual/Asset Gate, Backend/Postgres/Chromium). Recheck `PR #59` before using this as a current statement. Draft only; not merged to `main`; not deployed as new live ordering channel.

## 2. Actual customer website — route-by-route finish inventory

"BUILT" in this table means it renders and has code, **not** that we can stop designing it.

| Track | Route / files | What exists | Specific uncovered acceptance work |
|---|---|---|---|
| W01 | `/` · `components/home/rebirth-home.tsx`, `app/rebirth-home.css` | Authored dark food hero, original photos, category/gallery, material/packaging sequences, direct CTA | Scene rhythm, mobile photo crops, image decode, repetition vs Menu, brand/typography approval, real-phone motion |
| W02 | `/menu` · `rebirth-menu.tsx`, `rebirth-menu.css` | Single search/category/page, old menu, photo/art grammar | Real first-product reach at 320/390, long names/no results, search/back/categories, browser zoom, no endless opening hero |
| W03 | Item dialog in Menu · `rebirth-product-dialog.tsx` | Native modal, variants, addons, qty, notes, illustrative artwork, cart transfer, optional reversible FLIP | All option combinations, max text length, excessive addon list, sticky CTA with phone keyboard, Escape/focus/back, error-free price/line math |
| W04 | `/cart` · `rebirth-checkout.tsx`, `rebirth-checkout.css` | Populated cart edit/review, delivery/pickup and customer fields, idempotency key in staging, true server submit | 320/390 keyboard, back/edit/persistence, phone/address optionality by fulfillment, validation, double click/retry/409/offline, concise first-fold, test 200% zoom |
| W05 | `/order-success` · `rebirth-order-tracking.tsx`, `rebirth-tracking.css` | Saved/pending/accepted/preparing/ready/delivered/cancelled, refresh, stale/restore, original printable-paper art | Cover **every** terminal/error/status path in screenshots: missing ID, invalid, rejected, unreachable, pickup vs delivery, same order across refresh, reconnect, estimated prep time, accessible announcement |
| W06 | `/offers` | Distinct red promotion chapter, live verified offer guard | Valid active/expired/empty/error example, real terms, correct offer→detail/cart, approved price/eligibility; never invent a promotion |
| W07 | `/food-finder` | Actual family/budget question→matching products, visual pictograms | Zero results, different budgets/long category names, direct deep-link result, actual live catalog availability |
| W08 | `/about` | Restaurant source-led documentary/editorial chapter | Approval of story/facts/source photos, length and distinctness vs Home, responsive crop and clear menu path |
| W09 | `/contact` | Phone/WhatsApp/Facebook/address actions and wayfinding | Merchant-confirmed numbers/address/hours, click-to-call/directions, invalid/missing contact fallbacks, keyboard focus |
| W10 | `/reviews` | Authored prompt with outbound WhatsApp, no fake ratings | Confirm this intended feedback channel; test outbound and unavailable contact. **Not** a persisted review/reputation system |
| W11 | `/complaints` | Custom form prepares WhatsApp draft | Validation, deep links, blocked popup fallback and mobile keyboard, make send semantics clear. **No** saved complaint ticket or guaranteed submission |
| W12 | Shared nav/footer/cart/banners | Owned header/footer, mobile drawer, cart badge, active order navigation | Direct link + browser Back, menu close, focus/ESC, cart/tracking deeplinks, Arabic/English mixing, accidental legacy shell overlay |

**Other existing routes found in source:** `/demo`, `/menu/visual-atlas`, `/studio`, `/offline`, `/admin/tables` and legacy `/admin/*`. Inspect that preview/internal/demo entry points are not accidentally exposed as an official customer ordering flow, and that old admin still works if kept. **Do NOT convert the old admin into a new giant POS scope.** The canonical customer site has ten route paths; W03 and W12 are shared subflows rather than extra primary pages.

## 3. Restaurant order screen — just ONE useful operating surface

| ID | Operator acceptance | Current result | Next concrete proof |
|---|---|---|---|
| O01 | Next new web order visible with ID, age, item/size/addon/note/qty, pickup/delivery and contact | BUILT + staging browser | Verify real fresh event after initial page snapshot; no old-order fake alarm |
| O02 | Press = one focused order + sorted queue, preserving focused ticket on status changes | CI PROVED | Touch through 15–20 orders on real tablet; actions above fold; no accidental selection loss |
| O03 | Rail = separate receipt comparison/reel with explicit previous/next | CI PROVED | Swipe and arrows at 768/1024, scroll offset on filtering/new arrivals, keyboard |
| O04 | Accept / decline / preparing / ready / handed over, same customer ticket | CI PROVED in localhost Postgres | Status conflict/double-press, offline/reconnect, action failure/rollback, correct terminal states |
| O05 | Opt-in order sound + in-page visual arrival | BUILT + browser control check | **Physical sound** + mute persistence and sleep/resume/reconnect/multi-order attention, no auto-unmute |
| O06 | Search/filter/All-Day five top counts for accepted/preparing | BUILT + 20-order preview | Stress long item names, 50+ orders/pagination/load, selection and station relevance (do not invent kitchen stations) |
| O07 | Simple private access (one restaurant, one protected screen) | **NOT COMPLETE**: entered key is a localhost QA fixture | Single protected restaurant entry + server-side action guard + sign out/expiry **without** building named users, roles, rota or personnel admin |
| O08 | Real shared staging reachable by a tablet away from the dev machine | **NOT BUILT**: only loopback demo | Hosted **separate test instance**, test from independent browser/device, persist exact end-to-end event loop and restore from sleep |

Critical note: current data service uses fixture role headers to exercise allowed state transitions. That's a **backend implementation detail**; the actual desired operator product is still ONE screen, not multiple staff personas.

## 4. First-party order + living ticket + notification contract

| ID | Required behavior | Status |
|---|---|---|
| B01 | Server owns catalog price/selection validation and transactionally stores full immutable items, customer info, status and event | PROVED in isolated local PostgreSQL |
| B02 | Same logical checkout retry doesn't create duplicate; modified same key rejected | PROVED in isolated local PostgreSQL |
| B03 | Direct new order arrives on tablet, accept/prep/ready/done immediately reflected in customer's **same** ticket | PROVED across two Chromium windows against localhost engine |
| B04 | Restaurant can set/change a REAL prep estimate and customer sees the timestamp/updated ETA as a labelled estimate | NOT BUILT |
| B05 | Tracking opens from secure private link without leaking contact data; guarded state retrieval, rate limits | NEEDS LAUNCH VALIDATION. Current tracking uses a UUID; don't mistake UUID-only lookup for a fully reviewed capability/access model |
| B06 | Staff sound active on visible page; explicit visual alert, mute and connection state | PARTIAL. New-arrival browser cue exists; offline/stale/reconnect stress still due |
| B07 | Opt-in customer Web Push from event/outbox + service-worker push handling + click-to-ticket | NOT BUILT. Existing offline service worker **is not push**; Android/iOS/browser permissions require actual device test |
| B08 | Local test catalog vs approved real menu; rehearsal of migration/rollback/backups, no real mixed orders | PARTIAL STAGING only |
| B09 | Delivery vs pickup, failed payment assumptions, actual handoff language, cancellation and support | Partially represented; verify against owner's real workflow. Do not invent payment or POS events |
| B10 | Background/closed-tab behavior when devices sleep/offline; duplicate events, recovery, notification failure | NOT FIELD-TESTED |

## 5. Creative, media, interaction and polish — independent checklist

- [ ] **Art direction as one authored world:** compare actual Home→Menu→Dialog→Cart→Ticket entry/exit, not isolated screenshots; identity specificity and non-repeated composition.
- [ ] **Motion as useful behavior:** category reveal, selected-food shared-element FLIP, cart feedback, live ticket stamp, reverse/back; respect reduced motion, low CPU and user control.
- [ ] **Digital copy:** brief decisive Arabic CTA and empty/error states; no internal QA essays on customer UI; keep prices/details truthful where choices are made.
- [ ] **Photography and generated art:** retain all 100 WebPs; review near-repeat clusters B03/B04/B05/B08 selectively; preserve original 12 restaurant photos, avoid calling illustrative art exact dishes.
- [ ] **Brand sources:** resolve logo/font use, restaurant name formatting, 640px-image limits and owner-approved visual identity.
- [ ] **Responsive design:** first-fold and full-page at 320/390/768/1024/1440; landscape tablet; 200% zoom; virtual keyboard; long Arabic item names and mixed Latin numerals.
- [ ] **Accessible interaction:** screen reader and keyboard, focus back after modal, proper tab order/live status, large touch targets, contrast, reduced motion.
- [ ] **Performance and PWA:** image loading/lazy media, core web vitals on low-end Android, service-worker update/offline state, no cached personal tracking/orders, tablet reload.
- [ ] **Discovery/website health:** real route titles/meta, share-preview imagery, favicon/app icons, correct map/phone/social URLs, page indexing vs hidden demo/operation pages.

## 6. Hidden-edges test matrix — DO NOT SKIP

| Test group | Must demonstrate |
|---|---|
| First visit | Home→Menu opens promptly, working navigation/search, no intro trap or asset blanks |
| Food options | Sizes, single/multiple add-ons, notes, quantity and exact subtotal survive add→cart→edit→back |
| Bad/empty data | No categories, no search hits, inactive item, expired offer, empty cart, invalid customer field, unavailable ordering |
| Data correction | Checkout doesn't clear cart on rejected response; no duplicate if impatient tap/retry; offline/network ambiguity clearly surfaced |
| Staging happy path | Actual original Menu→Cart→Postgres→Operator→same Customer Tracking, both pickup and delivery where supported |
| Operator reliability | 20+ visible tickets, 50-order query bound, filter/search, action conflict, disconnected tablet, browser sleep, reconnection and restored selected order |
| Ticket truth | Received vs accepted, preparing, ready, handoff, rejected/cancelled, stale/error/recovery; never fabricate payment/delivery GPS |
| Attention | New order after first poll, several arrivals, opt-out sound, tab background, actual Android tablet sound and visibility |
| Phone & assistive | Widths 320/390/768/1024/1440, portrait/landscape, 200% zoom, keyboard-only, real touch, reduced motion and error messages |
| Outbound support | WhatsApp/call/directions/complaint/review flows, fallback when unavailable; external send is not internal persisted success |
| Deployment readiness | Production vs test environment separation; HTTPS/domain, secrets, cost, backups, rollback, logs without PII, menu/hours/fees signoff |
| Release / staff | Merchant physically tries website→tablet→their existing cashier workflow; controlled pilot, then explicit go-live approval |

Automated evidence exists for **some**, not all, of these; never automatically tick this matrix green just because a previous run passed.

## 7. Priorities — no simultaneous ten-project detour

### NOW / P0 — finish the website's real customer journey
1. **T01 — Cart / Checkout quality**: tighten 390px content, fields and review without losing selected options; browser-proof 320/390 and keyboard; inspect before/after artifact.
2. **T02 — Home→Menu→Product consistency**: direct food access and clear product options; restore/back/modal/reduced-motion details; actual 390 and 1440 screenshots.
3. **T03 — Tracking states + ticket art**: cover all stages and errors and preserve order-context across reload. Same design language as operator paper receipt.
4. **T04 — Secondary routes and shared shell**: Offers, Finder, About, Contact, Reviews, Complaints and footer/nav; each has distinct purpose + empty/action/error QA.

### NEXT / P1 — make the restaurant tablet actually usable
5. **T05 — Order Press / Rail field usability**: real incoming order attention, sound mute, long orders, touch navigation, disconnected/reconnect states, test on 1024 tablet.
6. **T06 — One secure restaurant access gate**: protect inbox and status mutation with minimal server authorization, no separate employee roles/settings product.
7. **T07 — Accessible shared staging deployment**: separate DB, private test access; demonstrate physically separate website phone + tablet sharing one order, not two loopback browser windows.

### NEXT / P1 — living ticket + customer messages
8. **T08 — Operator-entered prep estimate** persisted in order event and animated on customer ticket.
9. **T09 — Customer opt-in Web Push** with notification→correct ticket, exact/duplicate delivery and actual background phone tests.

### BEFORE RELEASE — keep all of this visible; don't substitute it for current design work
10. **T10 — Merchant truth**: approved contemporary prices/stock/categories/ingredients/addons, actual offers, service hours, delivery zones/fees, contact/location and brand/media rights.
11. **T11 — Final integrated art/UX/device QA** across routes/widths; performance, accessibility, SEO, offline/PWA and staff walk-through.
12. **T12 — Controlled release**: stable host and DB, backups/restore and monitoring, environment/secret isolation, explicit merchant/user approval, staged pilot, rollback and intentional PR merge/deploy.

**Blocked by owner input:** T10 current restaurant data, actual logo/source photos and hands-on operating acceptance. Other dev/creative tasks continue independently.

**Not active / out of scope unless newly commissioned:** extra staff role architecture, Django/Oracle repeats, Talabat API, print/POS integration, cashier replacement, inventory system, fictional maps/delivery tracking. **Payments, rewards and other commercial ideas are explicitly indexed in section 9 as candidate decisions, not automatically discarded or silently authorized.** Retain old `/admin/*` only as legacy until explicit preservation/removal decision; do not confuse them with the new tablet screen.

## 8. Always-on workflow for our future chats

1. Check actual branch HEAD and last three CI workflows. **Read this file before older `20`, `31`, `36`, `37`, `38`**; read old docs only for context.
2. Open **latest screenshot artifacts** (not just run conclusion); pick the highest-value unfinished ticket above.
3. Make a **small coherent code diff on SAME branch** + add/update interaction test and screenshot if visual.
4. Re-run relevant CI; state exact code SHA and verified jobs. No claims about live site unless actually deployed.
5. Edit **this board IN PLACE**, under "Current work log" below: latest successful code SHA, files changed, proof links, newly discovered gaps, what remains. Do not append another disconnected "next chat" manifesto each time.
6. After closing a ticket, change its status and note the proof, not merely a green checkbox. If blocked, document *why and what input is needed*, then continue independent work.
7. Leave `PR #59` Draft, `main` and production untouched until explicitly authorized.

### Current work log — latest audit
**2026-10-22 / board initialization:** reconciled [site-first master plan](31_MASTER_DELIVERY_BOARD_AND_SITE_FIRST_RESTART_2026-10-22.md), [full customer journey](33_PASS_30_FULL_CUSTOMER_JOURNEY_AND_TRACKING_SYSTEM_2026-10-22.md), [staged Postgres two-window flow](36_REBIRTH_REAL_CART_OPERATOR_TICKET_POSTGRES_2026-10-22.md), [Order Press/Ticket Rail](37_THE_ORDER_PRESS_AND_TICKET_RAIL_2026-10-22.md), [sound/mobile Pass 38](38_OPERATOR_ATTENTION_AND_SITE_VISUAL_QA_2026-10-22.md), actual route tree, endpoints, QA scripts, worker and last three successful CI checks on `82a1a262`. **Only planning/docs in this board pass — no new runtime feature or deployment claim.**

**T01 current implementation pass:** **Cart-line modification + mobile first-screen composition** is implemented on the branch (technical SHA `23b6c218`). Browser proof on earlier intermediate `3c97d80c` [Visual QA #39777387744](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39777387744) SUCCESS with original cart→menu edit→cart flow and unchanged line identity. Latest full browser assertions for review-invalidating edits and focus errors, plus before/after screenshots, are **SUCCESS** in [Visual + Asset Gate #39777983392](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39777983392) at technical SHA `23b6c218`; screenshot artifact `12425537975` includes `checkout-before-line-edit-390.png`, `checkout-after-line-edit-390.png`, and equivalent 1440px screenshots. Inspected actual 390px captures: the line keeps its place, quantity goes **2→1**, mozzarella disappears, notes are retained and displayed, total changes **290→125 EGP**, and review checkbox is unchecked. Home/build [#39777984216](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39777984216) and Backend/Postgres [#39777983942](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39777983942) also **SUCCESS** on the same technical SHA.

**T01 changes:**
- `components/cart/cart-provider.tsx`: `replaceProductItem` updates original product line (same `lineId`, ordered position) instead of appending it. Changing items, quantities, customer/fulfillment or table clears `confirmedAccurateDetails`; no old review checkbox can sign off new selections.
- `components/rebirth/rebirth-menu.tsx` + `rebirth-product-dialog.tsx`: `/menu?editLine=<id>` opens the existing native food dialog with old size/addons/notes/qty preselected, saves an updated same line, returns to cart; cancel returns to cart; handles deleted/unknown line by going back to cart.
- `components/rebirth/rebirth-checkout.tsx`: user can explicitly “تعديل التفاصيل” on each product line; first invalid form field gets focus and centered scroll; header styles adapt based on a genuinely populated cart.
- `app/rebirth-checkout.css`: mobile populated cart enters as a compact functional receipt rather than repeating a giant editorial home scene; empty cart retains full editorial welcome; edit link has keyboard-focus styling.
- `scripts/qa/rebirth-interaction-check.mjs`: at widths 320/390/768/1440 tests original historical 125 EGP size + 20 EGP mozzarella + quantity 2, cart edit with qty/extra/notes changes, expected new 125 EGP total, **same ID and one row**, required re-review, invalid form focus and no spurious order POST. Captures 390/1440 before/after edit screenshots (verified and inspected in #39777983392).

**T01 continued (fulfillment + payment honesty, code `fd5d501a` / screenshot QA correction `e687710d`):**
- `components/rebirth/rebirth-checkout.tsx`: the same restaurant order form now clearly separates **delivery / in-store pickup**. Delivery shows **unknown** fee pending merchant confirmation and keeps mandatory address. Pickup shows no delivery charge and hides the address. Both show **food subtotal only**, never a fabricated charged total. A separate branded paper-style payment note says the website does **not** currently charge cards/wallets or confirm the actual payment method; no fake payment radio buttons. Review checkbox explicitly covers these caveats.
- **Data minimization, both sides of the boundary:** `rebirth-checkout.tsx` suppresses any old delivery draft address when a pickup request is submitted (without deleting the buyer's draft if they switch back); `lib/orders/order-validation.ts` also drops an irrelevant pickup address **server-side**, even when supplied manually by a client. Real delivery addresses are retained only for delivery.
- `app/rebirth-checkout.css`: mobile service-note / fees / current-item-only subtotal / payment disclosure styles, without introducing a new POS or choosing any unapproved gateway.
- `scripts/qa/rebirth-interaction-check.mjs`: independent mock checkout runs at **320/390/768/1440** prove delivery with address → rejected order leaves cart → toggle pickup hides address and preserves no-delivery-fee truth → review checkbox resets → new pickup submission contains `address:''` → switch back restores the editable delivery draft and resets confirmation again. Checks payment text never suggests online money capture. New **390px + 1440px** delivery/pickup screenshots included in [successful browser/asset run #39780130846](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39780130846), artifact `12426806316`. Personally inspected 390px versions. The original full-page QA screenshot was recorded while scrolled inside the form, creating a misleading mid-page position for the *sticky header in the stitched image*. Test-only correction `e687710d` now resets scroll/focus **before screenshots**. [Visual + Asset Gate #39781166067](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39781166067) **SUCCESS**, screenshot artifact `12427262055`; personally inspected 390px “checkout-delivery-payment-truth” and “checkout-pickup-payment-truth” recaptures with the header correctly anchored at top and fee/payment fields legible. Same code SHA Home CI [#39781166092](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39781166092) and full three-job Backend/PostgreSQL CI [#39781165992](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39781165992) also **SUCCESS**.
- `scripts/qa/rebirth-next-studio-integration.mjs`: actual disposable PostgreSQL/Next test submits a **pickup with malicious leftover address** and verifies saved `customer_snapshot.address === ''`; then creates actual **delivery** and verifies the correct deliberate address is stored. [Backend + three-job Postgres/Chromium run #39780130930](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39780130930) **SUCCESS** at `fd5d501a`; [Home/TypeScript build #39780130895](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39780130895) **SUCCESS**.
- **This does NOT implement or configure any cash/card/wallet/InstaPay/Fawry/payment link/QR payment method.** P01–P18 remain documented *capabilities awaiting merchant selection and signed-off provider contracts*. It is not safe to claim the subtotal is the final total while delivery fees/availability and merchant pricing are unverified.

**T01 still OPEN for:** actual Android virtual keyboard and 200% zoom, long add-on/name edit, changed historical server catalog during edit, checkout abandonment/duplicate/reconnection, pickup and delivery fee/coverage contract, merchant-approved payment choice (cash versus online/wallet/QR etc), and fully approved item prices. **Do not claim payment processing was implemented.** Next technical unit: merchant-approved delivery coverage/fees and pickup/handoff rules; cancellation/refund rules and an actual chosen payment-method/provider contract. Keep P01–P18 in section 9 open for owner direction.

**Other next tasks remain:** T02 Home→Menu→Product motion/visual cohesion, then T03 status/ticket, and T05 operator reconnection/sound. Site craft stays primary.


---

### T03 / NEW CARE LOOP — linked changes, rejection and cancellation clarity (23 Oct 2026)

**Scope:** The same live ticket on `/order-success` and the same existing restaurant order screen. NO auto-cancel, automatic refund, separate CRM/POS product or invented merchant policy.

- `components/rebirth/rebirth-order-tracking.tsx`: new **post-order assistance** printed-paper section. Once a server-confirmed order exists, it offers *request cancellation*, *request an edit* and *generic support* as **distinct** WhatsApp draft links with actual order reference and correct explanatory text. It retrieves the publicly configured WhatsApp number through `/api/public/site-settings`, validates it before forming an external URL and falls back to `/contact` if unavailable. No UI action mutates order state or guarantees messages were sent: user must review and send in WhatsApp. No phone/address or payment details are automatically shared in the prefilled message.
- **Status correctness:** `confirmationStatus=rejected` now has its own `declined` visual/semantic state ("المطعم اعتذر عن الطلب", `DECLINED`), distinct from generic `status='ملغي'` (`cancelled`). A restaurant rejection is NOT an indication that the customer chose to cancel. For terminal delivered, rejected or canceled states, action links for changing/canceling the order disappear but a support route remains. All modes explicitly state refund/payment outcomes are **not verified** by this system.
- `app/rebirth-tracking.css`: compact paper/stamp support language, keyboard focus and phone column layout; maintains the authentic printed-ticket metaphor.
- `scripts/qa/rebirth-interaction-check.mjs`: at 320/390/768/1440, mock a valid configured business WhatsApp, validate request cancellation link text/ref and never open/send it, assure generic help remains neutral and terminal states don't offer an active cancel/edit. Rejected and cancelled are independently verified, with screenshots for 390px declined/cancelled/ready/delivered.
- `scripts/qa/rebirth-next-studio-integration.mjs`: physically separate synthetic order rejected via authorized operator action, persists one `received → rejected` event and returns `ملغي` + `confirmationStatus=rejected` from the **original** Rebirth tracking endpoint. Repeating reject returns 409; no duplicate event. These stages remain synthetic staging, not live restaurant deployment.

**VERIFIED / technical checkpoint `c4305b3d`:** all three CI workflows **SUCCESS**: [Next/Home Typecheck & Build #39876883294](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39876883294), [Backend V2 PostgreSQL/Next Integration #39876883326](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39876883326), and [Real Chromium Browser + Visual QA #39876883134](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39876883134). Browser screenshot artifact `12468907479` was generated. CI passing doesn't mean a real-restaurant pilot, direct customer-initiated cancel API, processor refund or physical tablet test. There is **no** settled merchant cancellation/refund policy or payment provider, so customer self-service cancel/refund APIs remain unbuilt.

**Next if this pass succeeds:** inspect actual 390px declined/cancelled screenshots, fix legibility or any test failures, then prioritize merchant prep estimate + real tablet/connection testing and real cash/prepay/refund policy as explicit decisions. Stage photos don't imply field approval.

---

## 9. THE UNEXPLORED PRODUCT UNIVERSE — discovered, not commissioned

**User scope correction (22 Oct 2026):** This board must also remember the **big questions never previously discussed or built**: every practical payment route, fulfillment variants, post-order lifecycle, support/reputation, retention, commercial terms, responsive edge cases, operational failure modes, strategic creative ideas and launch infrastructure. The previous T01–T12 are the **immediate execution shortlist**, **not the entire conceivable product**.

**Crucial rule:** The following is a **capability/opportunity inventory**, NOT approval to implement everything. We continue to build **one website plus one restaurant order screen**, not a POS/ERP, kitchen ERP, accounts platform or delivery fleet. Nothing starts automatically because it appears here.

Tags:
- **CORE** — logically required for reliable first-party ordering, but often needs restaurant-specific business decisions.
- **DECIDE** — potentially high value; estimate cost/complexity and have the owner choose.
- **IDEA** — creative differentiator / R&D hypothesis; test usefulness before shipping.
- **LATER** — optional future growth; never postpone the usable first release for it.
- **OUT** — outside current commissioning; record as a boundary, not a backlog promise.

Each future proposal gets an **owner/user value**, evidence/source, **dependency**, UX treatment, technical contract, risks, operating responsibility, test plan, then one of: \`chosen / experimenting / shelved / declined\`. Features cannot become \`done\` from attractive mockups.

### U01 — Payment methods and combinations (much broader than today's cart)

**Audited reality:** Current \`types/cart.ts\` carries delivery/pickup and items, but **no payment-method field**. The original \`rebirth-checkout.tsx\` submits an order; staged PostgreSQL shows order transaction correctness, **not a merchant payment processor**. \`spike_ts.payment_attempt\` exists as an experimental schema table, not evidence of card/wallet payments. No merchant settlement, capture, refund or successful external provider webhook has been demonstrated.

| ID | Method/experience | Status | Questions & required behavior |
|---|---|---|---|
| P01 | Cash on delivery (**COD**) | CORE / DECIDE | Will restaurant take cash for delivery? exact collection actor, change needed, cash due, failed handoff |
| P02 | Cash on pickup (**pay at store**) | CORE / DECIDE | Reservation versus confirmed order; pay when arriving; no false “paid” on submit |
| P03 | Existing counter card POS when picking up | DECIDE | **External** cashier terminal collects payment; website must not claim it processed payment |
| P04 | Online domestic/international cards (Visa/Mastercard/Meeza where supported) | DECIDE | Egyptian merchant onboarding, processor, currency, accepted card types, 3DS, settlement, merchant fees |
| P05 | Mobile wallets (Vodafone Cash, Orange Cash, e& money, WE Pay, others actually supported) | DECIDE | Provider-hosted wallet/R2P flow and callback; never assume every wallet is enabled for this merchant |
| P06 | InstaPay / instant account transfer | DECIDE | Distinguish **manual transfer + verified reconciliation** from supported merchant payment acceptance; **never** interpret screenshot/typed reference as paid |
| P07 | QR-code mobile-wallet merchant acceptance | DECIDE | Dynamic order-bound merchant QR, expiry, provider verification, callback, mismatch/refund |
| P08 | Fawry or comparable payment-reference collection | DECIDE | Merchant/provider capabilities, reference expiry, pending-paid transition, remote confirmation |
| P09 | Secure payment link / hosted checkout | DECIDE | Pay before/after staff acceptance? Expiring, amount-locked reference, authenticated callback, resume/cancel |
| P10 | Apple Pay / Google Pay | DECIDE | Provider-country/browser-device eligibility, wallet availability and fallback; not guaranteed for every merchant |
| P11 | Split payment (cash + online, two people) | LATER | Partial amounts, exact balance, failed second payer, refunds across methods; not automatic V1 |
| P12 | Pay for another person / gift order | IDEA | Receiver phone/privacy, address confirmation, surprise vs notification, payer/refund ownership |
| P13 | Tips (before/after order) | DECIDE | Recipient/tax/accounting treatment, refunds, merchant policy, skip friction |
| P14 | Gift cards / store credit / prepaid balances | LATER | Issuance, redemption, expiry, fraud, ledger/liability — not a generic coupon |
| P15 | Installments / BNPL | LATER / likely unnecessary for low-value restaurant orders | Provider availability and true consumer need; do not build for fashion |
| P16 | Deposit/prepay for scheduled large orders | DECIDE | Booking commitment, no-show/cancellation/deposit-refund terms |
| P17 | Refund to original method / partial item refund | CORE **if** any prepaid method chosen | Idempotent refund API, permissions, amounts, webhook/ledger reconciliation, customer notice |
| P18 | In-person QR/card/cash at counter | DECIDE | Existing restaurant equipment stays external; optionally record only that staff confirmed payment |

**Payment engine acceptance — independent from order status:**
- **CORE if online payment:** \`created → pending → authorized (if used) → captured/paid\`, or \`failed / expired / cancelled\`; refund states \`requested / partial / full / failed\`; processor-native statuses mapped without inventing financial success.
- The website should show **payment method + amount due/paid** separately from **restaurant accepted/preparing/ready/delivered**. A recorded order is not paid; a paid charge does not necessarily imply restaurant acceptance.
- Server computes **line item + variant + addon + discount + delivery fee + service fee + tax (if applicable) + tip = charged grand total**, with currency minor-units and immutable amount snapshot. Define who pays provider fees and whether prices displayed include those fees.
- Idempotent payment intents, safe provider redirect return, customer refresh/back, 3D Secure failure/abandon, webhook signature, out-of-order webhook, timeout, duplicates, payment accepted after restaurant reject/closed, cancel versus capture race, amount tampering, settled-without-order and orphaned order-without-payment.
- Reconciliation and settlement: processor transaction ID, amount, method, provider status, merchant payout/batch, fees, refund, chargeback/dispute, exception queue, audit and owner exports; avoid introducing accounting/POS replacement UI unless justified.
- **NEVER collect or store raw card number/CVV on Tuscanini servers.** Choose a provider-hosted redirect/embedded compliant checkout. Payment method availability and compliance are dependent on processor, merchant contract and PCI scope. No credentials/secrets in repo.

**Official research sources (comparison leads, not committed providers):**
- Egypt CBE mobile-wallet QR and R2P merchant acceptance: https://www.cbe.org.eg/en/payment-systems-and-services/payment-services/payment-acceptance/mobile-payment-acceptance
- Egypt CBE wallet ecosystem: https://www.cbe.org.eg/en/payment-systems-and-services/payment-services/mobile-wallet
- Egypt CBE Instant Payment Network: https://www.cbe.org.eg/en/payment-systems-and-services/instant-payment-network (does NOT by itself prove a Tuscanini merchant API exists)
- Paymob's own checkout payment-method overview: https://developers.paymob.com/paymob-docs/developers/checkout-experiences/overview (provider example only)
- Official PCI SSC hosted/embedded payment boundary: https://www.pcisecuritystandards.org/faqs/1438/ and SAQ updates https://www.pcisecuritystandards.org/faqs/1588/

### U02 — Fulfillment, physical service, location and timing

- **F01 CORE:** Pickup versus delivery information differs; no address on pickup; don't ask irrelevant fields.
- **F02 DECIDE:** ASAP vs **preorder** for later, schedule date/time, earliest slot, maximum look-ahead, capacity and closure.
- **F03 DECIDE:** Store hours, weekly holidays, Ramadan/special holidays, temporary busy/pause, kitchen cut-off, per-fulfillment time windows; server-controlled availability.
- **F04 CORE if delivery:** Areas/pincodes/neighborhoods accepted, unavailable address feedback, real delivery fee, free-delivery threshold, minimum order, ETA source.
- **F05 DECIDE:** Delivery address as text, landmark, apartment/floor, optional map pin, caller instructions, pickup branch and directions; privacy retention for exact address.
- **F06 DECIDE:** Restaurant's own courier vs external delivery service; who marks dispatched/delivered, handoff rules, no synthetic courier GPS.
- **F07 DECIDE:** Estimated preparation/delivery time **entered by staff** and revised on ticket, delay handling, pickup notification, lateness and exception.
- **F08 LATER:** Multiple branches and branch-aware inventory/prices/hours/coverage; only if merchant actually has them.
- **F09 LATER:** Dine-in / table QR and table reference; existing historical table support is not a commissioned in-venue POS.
- **F10 DECIDE:** Group/bulk order and timed catering; lead time, confirmations and deposits only if demand verified.
- **F11 IDEA:** “Ready to pick up” accessible ticket matching physical packaging; printed/digital receipt referent without inventing hardware.
- **F12 DECIDE:** Lost/undeliverable courier, unreachable customer, no-show pickup, incorrect address, wrong handoff and what the operator can resolve.

### U03 — Menu truth and rich food selection

- **M01 CORE:** Current merchant-approved categories, products, Arabic names/descriptions, prices, price variants, availability and last verified date.
- **M02 CORE:** Sizes, toppings/add-ons, modifier groups, required/exclusive selections, min/max selection limits, notes/allowed length, quantity bounds, incompatible combos.
- **M03 DECIDE:** Half/half pizza, choose bread/sauce/cooking level, substitution/replacement, combo meals, drinks/sides bundles **only if the real menu supports them**.
- **M04 DECIDE:** Sold-out item/addon and low-stock availability without sitewide ordering shutdown; price change while cart open, cart correction review.
- **M05 DECIDE:** Allergens and ingredient disclosure, dietary/spicy tags with source confirmation; **never derive allergen safety from AI-generated images**.
- **M06 IDEA:** Editorial close-ups, ingredient cross-sections, paper-fold labels, animations mapped to actual categories; useful not fictitious.
- **M07 CORE:** Arabic synonym search/typo/accent variants, duplicate same names across categories, no-results suggestions, direct category URLs.
- **M08 LATER:** Favorites, saved last selection, recently ordered, one-click reorder with **fresh** prices/availability/choice validation.
- **M09 DECIDE:** Nutritional content, portion weights, ingredient changes, allergen cross-contact policy; only with verified merchant source.
- **M10 DECIDE:** Dynamic combos / meal builder that never misprices optional extras; owner decides scope.

### U04 — Promotions, commercial rules and value

- **C01 CORE:** Actual active offers with eligibility/availability/time windows; transparent current price.
- **C02 DECIDE:** Promo codes (fixed/%), single-use/first-order, max discount, minimum subtotal, eligible category, expiry, stacking rules, abuse checks.
- **C03 DECIDE:** Product bundles, family boxes, add-on upsell and checkout recommendation based on real menu, not dark-pattern cross-sell.
- **C04 DECIDE:** Free delivery or discounted delivery threshold; rounding, tax/fee clarity and edge cases.
- **C05 LATER:** Loyalty points/stamps, birthday rewards, referral code, cashback/store credits; requires meaningful merchant repeat-customer strategy and privacy model.
- **C06 IDEA:** Digital packaging ritual when offer unlocks, personalized reorder print label; test speed/clarity before production.
- **C07 DECIDE:** Restaurant-funded versus payment-provider campaign and settlement owner, refund after discounted item removed.
- **C08 DECIDE:** Gift/free product exceptions, employee/manual adjustment constrained by authorized staff (not full POS).

### U05 — Checkout, basket, order records and after-sales reality

- **X01 CORE:** Persist cart across refresh/back/tab close; separate multiple configurations of same SKU correctly; edits and line deletion not merged unexpectedly.
- **X02 CORE:** Review exact size/addons/notes/qty, current price and all fees **before** commit, delivery/pickup fields and contact.
- **X03 CORE:** Double-click guard, idempotent server order key, timeout/ambiguous response, stale cart, delayed network, retry that doesn't clone a sale.
- **X04 CORE:** Unique readable restaurant reference vs private opaque customer tracking capability; QR/share links with privacy.
- **X05 DECIDE:** Anonymous guest checkout as default versus optional saved identity; avoid compulsory registration and OTP without need.
- **X06 DECIDE:** “Modify order” grace period and explicit acceptance cutoff; preserve server audit and totals, operator sees corrected ticket.
- **X07 DECIDE:** Customer cancellation before acceptance/preparation; separate merchant cancel, rejection reason, auto/refund if prepaid, fair user copy.
- **X08 DECIDE:** Customer request support/change via WhatsApp/call or in-product support; meaningful escalation, no imaginary SLA.
- **X09 DECIDE:** SMS/email confirmation only with lawful consent, verified delivery provider, failure handling, templates; not universally necessary.
- **X10 LATER:** Order history/reorder with opt-in identity, receipts and archived transactions; data minimization.
- **X11 DECIDE:** Data minimization and deletion/retention: order phone/address kept only as operationally required; avoid surfacing on unnecessary screens.
- **X12 DECIDE:** Printable downloadable order receipt/ticket for customer (not necessarily a tax invoice); truthful paid/unpaid words.

### U06 — Live ticket, operator attention and order exception choreography

- **O-U01 CORE:** New order attention, audible opt-in, connection status, no lost ticket after sleep/reload, bounded polling/reconnect.
- **O-U02 CORE:** Readable item/size/notes at once; focus/queue/rail search, next action, touch size, no 20-order overlap.
- **O-U03 CORE:** Double actions, stale version conflict, two browsers taking action concurrently, request timeout, safe refresh; one authoritative event log.
- **O-U04 DECIDE:** Operator short decline/hold/delay **reason** and customer-facing message, not giant operational analytics.
- **O-U05 DECIDE:** Operator-set prep ETA and corrections, meaningful customer stamp and notification.
- **O-U06 DECIDE:** Phone/address reveal on explicit need, privacy/screen sharing, call action, no PII in audio/toasts/logs.
- **O-U07 DECIDE:** Pause new web orders and reopening **without** breaking already accepted orders.
- **O-U08 IDEA:** Paper print-room art direction, motion on new state only, order “tear/open/stamp/pass” loop shared across site and restaurant tablet.
- **O-U09 DECIDE:** How staff hand over into *existing* cashier/kitchen workflow; check “entered in POS” only if required by actual restaurant procedure.
- **O-U10 OUT:** Multi-employee scheduling, inventory procurement, kitchen station routing, Talabat sync and receipt printer until explicitly requested.
- **O-U11 CORE:** One secure restaurant-only access gate, private API and audit; **not** separate role-management app.

### U07 — Messaging, service and customer trust

- **N01 CORE:** In-page real-time-ish status with correction after missed intervals, stale/offline indicators and manual refresh.
- **N02 DECIDE:** Customer Web Push (explicit opt-in, scoped tracking subscription, background SW notification/click, expired/unsubscribed token and retries).
- **N03 DECIDE:** SMS or WhatsApp *business-platform* notifications with cost/consent/template and provider delivery acknowledgment, distinct from a \`wa.me\` link.
- **N04 DECIDE:** Confirmation/pickup-ready vs marketing notifications; separate consent and per-category unsubscribe.
- **N05 DECIDE:** Structured “problem with my order” linked to order ID versus current WhatsApp draft; receipt and response expectations.
- **N06 DECIDE:** Review capture after delivered, private feedback vs public review, moderation/source authenticity, zero fake ratings.
- **N07 LATER:** FAQ/how ordering works, shipping/returns/refunds policy, accessibility contact and support escalation.
- **N08 IDEA:** “Your food has entered the kitchen” expressive status stamp with meaningful narration and silent/reduced-motion option.
- **N09 CORE:** Error messages actionable, distinct order/payment/fulfillment facts, offline fallbacks and human contact path.

### U08 — Retention, discovery and growth (not mandatory loyalty platform)

- **G01 CORE:** Local SEO and brand search listing, contact/open-hours correctness, structured restaurant/menu facts only when supported, metadata, canonical URLs.
- **G02 DECIDE:** OpenGraph/social share image, campaign deep links, QR on physical packaging to menu or order status, print-ready QR with tested short destinations.
- **G03 DECIDE:** First/repeat visitor journey: direct menu above fold, saved cart, optional quick reorder and revisit active ticket.
- **G04 LATER:** Opt-in CRM/customer segmentation, email/WhatsApp marketing and consent/deletion; not assumed from checkout phone number.
- **G05 LATER:** Referral/affiliate, loyalty, gamification, “build your box” experiments; evidence from real orders before cost.
- **G06 DECIDE:** Basic analytics events: menu opened → product viewed → modifier selected → cart → checkout attempt → recorded order → fulfilled, with no raw address/phone in analytics.
- **G07 DECIDE:** Merchant KPI reading outside the operator order screen (e.g. privacy-safe event reports); never build a dashboard just because analytics exists.
- **G08 IDEA:** Physical/digital brand continuations using true store packaging, sticker/receipt and bespoke food glyphs, not generic points/streaks.

### U09 — Original creative direction and authoring beyond pages

- **A-U01 CORE:** Truly ownable Tuscanini typographic/motion/physical identity; not 10 matching heroes or copied award-winning patterns.
- **A-U02 CORE:** Full mobile/desktop rhythm and photography: 12 actual restaurant photographs + 100 generated category illustrations, careful role/story/attribution and correct SKU truth.
- **A-U03 DECIDE:** Menu-as-print-sheet, package-fold transitions, living tear-off receipt; unique **behavior** not ornamental parallax.
- **A-U04 DECIDE:** Food discovery by appetite/occasion, contextual category shuffle, user-decision aids, visually distinct secondary routes.
- **A-U05 IDEA:** Micro-interactions tied to quantities/addons; reversible product-to-cart shared element, deliberate sound only where requested, optical/tactile responsiveness.
- **A-U06 DECIDE:** Photography production shot list for missing exact products, genuine packaging/video/macro footage, owner-approved custom logo and source art.
- **A-U07 IDEA:** Genuine Beni Suef/place language, real photos and locality as authored content with verifiable claims, not made-up origin myths.
- **A-U08 CORE:** Respect performance, 320px, 200% zoom, virtual keyboard, Arabic/mixed text, dark/light contrasts, reduced motion, focus and screen reader.

### U10 — Physical restaurant and human handoff

- **H01 CORE:** Full observed customer→tablet→staff→existing cashier/kitchen handoff with actual person; document failure points and who answers phone.
- **H02 DECIDE:** Multiple sources coexist (phone, counter, Talabat, web); operator screen shows **web orders only**, no claims of merged full restaurant queue.
- **H03 DECIDE:** Offline tablet/internet outage plan: how merchant takes calls, what the website tells customers, how staff checks pending orders when back online.
- **H04 DECIDE:** Who owns menu changes, opening/closing orders, temporary stock stop, support escalations and end-of-day reconciliation.
- **H05 DECIDE:** Staff instructions, two-minute training, readable minimal order ID and printed fallback if the business already has a print process.
- **H06 OUT unless newly commissioned:** POS integration, fleet management, native Android cashier app, cashier drawer printing and enterprise personnel management.

### U11 — Technical quality, privacy, compliance, supportability

- **Q01 CORE:** Site and server pricing/discount/fee authority, concurrency, mutations under DB transaction, idempotency and proper event history.
- **Q02 CORE:** Connection pool, DB migration/versioning, data backup/restore, deploy/rollback, site availability, error budgets and minimal observability.
- **Q03 CORE:** Secure customer ticket capability, no guessable PII link abuse, retention controls, scoped restaurant endpoint, rate limiting and secret hygiene.
- **Q04 CORE if payment selected:** Hosted PCI-responsible checkout, signed callbacks, payment/refund idempotency, reconciliation, processor downtime, fraud/chargeback policies.
- **Q05 CORE:** HTTPS, secure cookie if used, CSRF where necessary, SSRF/input validation, cache protections, media CSP, cross-browser behavior.
- **Q06 CORE:** Privacy notice, consent where applicable, retention/deletion request channel, consumer-facing terms, payment/refund policy once payment exists; review Egyptian legal/tax obligations with merchant/professional before asserting exact requirements.
- **Q07 CORE:** Mobile Lighthouse/Core Web Vitals/slow 3G/low-end Android, images optimized, CSS/JS budgets; no motion trapping repeat visitors.
- **Q08 CORE:** Accessibility 320–1440, 200% zoom, touch, physical keyboard, focus/ESC, ARIA announcements, reduced-motion and contrast.
- **Q09 CORE:** Metadata/favicon/manifest/offline error/PWA updates; Android/iOS install behavior; notification permissions if Push gets chosen.
- **Q10 CORE:** Automated screenshot/functional/error-state regression across public pages and operator; synthetic QA separated from merchant data.
- **Q11 DECIDE:** Feature flags and rollback switches for payment methods, web ordering, offers, delivery zones, operator sound, push.
- **Q12 CORE:** Slow provider, intermittent hosting, out-of-order events, retries, stale catalog, partial failures, process restarts, delayed processing; rehearse failure mode.
- **Q13 DECIDE:** Automated accessibility audits and threat-model/review; prioritize high-risk commerce screens, not empty checklists.
- **Q14 CORE:** Never send contact info, raw order contents or secret keys to analytics/third-party visual observability.

### U12 — Experiments, decisions and merchant economics

- **R01 DECIDE:** Which payment methods have merchant acceptance contracts? Fees and payouts? **No provider selected** yet.
- **R02 DECIDE:** Is cash at delivery/pickup the desired initial V1, with online payments as separate rollout?
- **R03 DECIDE:** Delivery fleet/coverage/fees, opening hours, pickup timing, tax-inclusive display, cancellation and refund policy.
- **R04 DECIDE:** Who updates catalog, who sees tablet, who confirms orders, how they treat Talabat/existing POS?
- **R05 DECIDE:** Brand/media/logotype actual owner approval, menu pricing/ingredient photos and customer contact truth.
- **R06 IDEA:** 3–5 tested creative hypotheses with clear customer behavior and performance effect, not infinite inspirational research.
- **R07 DECIDE:** Provider/hosting total-cost model, maintenance ownership, backups and low-traffic economics.
- **R08 DECIDE:** A real merchant-supervised synthetic-to-pilot trial, then explicit approval to switch on production checkout.

## 10. DETAILED PAYMENT & COMMERCE DECISION TREE — do not hide inside T01

**Why it matters:** A gorgeous cart with no agreed payment, delivery-fee and cancellation contract is not a complete restaurant ordering product. Conversely, **not** every method should be built simply to appear feature-rich.

1. **Before asking for payment:** confirm whether restaurant accepts **cash-on-delivery**, **cash-on-pickup**, **card-at-counter**, **online prepay**, and which methods/fees/regions it actually supports. Decide whether orders can be placed without prepay.
2. **If no online payment commissioned for V1:** show honest “الدفع عند الاستلام” or “الدفع في الفرع” *only after merchant confirmation*. Persist method and \`unpaid / due_on_delivery / due_on_pickup\` as appropriate; no fabricated \`paid\` state. The existing cashier handles collection.
3. **If online payments commissioned:** pick actual merchant-eligible gateway based on official API docs, live/test access, card/wallet methods, costs, settlement, support, refunds, dispute response, and real device experience. Do NOT expose card collection fields on Tuscanini server.
4. **Place/order-charge relationship:** choose and prove one coherent approach: authorize/capture on accepted order; or pay-then-accept with automatic rejection/refund handling. Avoid uncoupled paid charges and rejected orders.
5. **Financial lifecycle as a separate record:** payment intent, merchant order, provider reference, attempts, webhook, refund, settlement and exceptions. Customer sees short understandable words; restaurant sees only necessary operation data.
6. **Test matrix before any online payment launch:** normal payment; 3DS approval/reject; payer closes tab; slow callback; two callbacks; client forged success URL; duplicate POST; out-of-stock after pay; restaurant rejects after capture; partial cancellation; double refund; gateway outage; mismatch between payout and order; webhook failure/retry; dispute.
7. **Merchant acceptance** signs off supported cards/wallets, payout account, refund responsibility, legal/customer copy, invoice/tax applicability, and reconciliation procedure.

**Explicit design opportunity:** The post-order living ticket can combine **three honest layers** — \`Order received\` / \`Restaurant preparing\` / \`Payment settled or due\` — inside one coherent paper-like physical design. This is more distinctive and useful than adding three unrelated dashboard cards.

## 11. ONE-PRODUCT CROSS-CHANNEL CUSTOMER JOURNEY (all the unseen transitions)

\`\`\`text
Discovery (search/social/QR/return visit)
   → Homepage/direct menu (fast and expressive)
   → Search/category/finder/valid offer
   → Actual food choice and modifiers (or saved/reordered validated option)
   → Basket edit & location/service mode
   → Available time/fee/payment terms
   → Customer contact + complete total + consent
   → Server validates current menu and requested slot
   → Order created exactly once (regardless of double tap/retry)
   → [If prepaid chosen] verified provider payment / pending / failure / refund
   → Restaurant order tablet receives it (+ optional sound)
   → Staff accepts/rejects and prepares in existing restaurant workflow
   → Updated estimate / prepared / pickup or delivery
   → Same customer's living ticket and optional notification
   → Collected / handed over / completed (paid status independent)
   → Support / complaint / review / optional reorder / recommendation
\`\`\`

**Branches often forgotten:** search no results, unapproved product, expired promo, wrong pickup time, no delivery coverage, no change for cash, incorrect phone, duplicate modifiers, disconnected user, browser refresh, staff offline, merchant closed, item sold out, staff rejection, post-payment cancellation/refund, delivery failed, stale ticket, missed notification, multiple tabs, iOS PWA restriction, operator tablet sleep, data-removal request, and merchant changes a price while cart sits open.

## 12. FEATURE EVALUATION AND COVERAGE RULES

Never substitute a giant list for product judgment. When choosing a candidate from U01–U12:

| Field | Required decision |
|---|---|
| Feature ID / job | Concrete customer/staff problem it solves; whose moment |
| Current reality | \`not discussed / not built / built local / CI proved / deployed / merchant confirmed\` with exact artifact |
| Business value | Order conversion, reduced effort/errors, repeat, service/trust or distinctive creative expression |
| Complexity/ops | Front-end / server / database / external contract / subscriptions / cost / maintenance owner |
| User experience | Full happy path **and** refusal/error/empty/retry/offline/return case |
| Dependencies | Merchant decision, payment provider, customer consent, images, ops, delivery partner |
| Next action | Research 1 narrow fact / wire mock safely / build staging / usability test / decline |
| Validation | Screenshot + interaction + DB test + real device/provider/merchant gate as applicable |

**Do not** make everything P0. No uncommissioned payment, CRM, SMS, loyalty, multi-store, location tracking, consumer accounts or employee profiles simply because this catalog exists.

### Updated execution tracks after broad product audit

| Track | Work now | Explicitly visible decision lane | Later possibilities |
|---|---|---|---|
| Experience | Home→Menu→Product→Cart→Ticket craft, all supporting pages, mobile/accessibility | approved content, image truth, fulfillment/service rules | reorder, favorites, gifts, category animation |
| Commerce | real item/option math, safe checkout, order submission and tracking | cash vs prepay, fees, promo validity, cancellation/refunds, provider approval | wallets, dynamic QR, payment links, loyalty |
| Restaurant screen | Press/Rail touch usability, live order attention/status/reconnect | simple access, prep estimate, handoff reality, order closures | print integration/stations only if commissioned |
| Growth/service | truthful contact/review/complaints, working support and discovery | actual offer terms, analytics consent, search and deep links | campaigns, CRM, referrals, membership |
| Platform | isolated Postgres, test and production gates, mobile PWA, web push design | cost, HTTPS, monitoring, retention, owner approval | multi-branch and advanced insight if actual demand |

**Next implementation is still T01** unless the user explicitly reprioritizes. **Parallel product-discovery questions:** what exact payment-at-handoff method the restaurant uses, online payment willingness, delivery coverage and fees, operating hours, cancellation handling and approval of today's menu. None of those questions freezes creative implementation.

### Broad audit log (22 Oct 2026)

**Source inspection:** \`types/cart.ts\` has no payment method; \`components/rebirth/rebirth-checkout.tsx\` currently validates name/phone/delivery address and records an order, with local studio override; \`app/api/orders/route.ts\` retains Supabase for non-staging traffic; \`public/sw.js\` handles offline shell but no customer Web Push; \`/reviews\` and \`/complaints\` route to WhatsApp rather than a persisted support desk. Historic SQL contained tables/enums for older admin/reviews, but schema presence is not a released first-party review/payment system. All backend success described earlier remains **staging-only**.

**No new payment code was claimed or deployed in this audit.** The exploratory universe adds opportunities, risks, acceptance cases and merchant questions to the SAME ongoing board so work does not disappear between chats. The original T01–T12 are still the current short execution queue; this section is its **comprehensive possibility register**.
