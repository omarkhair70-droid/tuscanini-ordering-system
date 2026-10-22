# TUSCANINI REBIRTH — ONE WORKING BOARD

**Last audited:** 2026-10-22 | **Branch:** `redesign/tuscanini-authored-experience-20261018` | **PR:** [#59 (DRAFT)](https://github.com/omarkhair70-droid/tuscanini-ordering-system/pull/59) | **Audited code checkpoint:** `82a1a262d41ff78b2dd56546a410cdbb3125b3f1`.

> **Start here in every new chat, and update this SAME FILE after every meaningful feature/review.** This is the current execution and coverage index; historical `00–38`, original research, the HTML reference and technical handoffs remain evidence, not competing "next task" lists. Use the current GitHub PR HEAD and Actions results if newer; never assume this snapshot is the HEAD forever.

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

**Not active / out of scope:** extra staff role architecture, Django/Oracle repeats, Talabat API, print/POS integration, cashier replacement, inventory system, reward points, fictional maps/delivery tracking, payments without commission. Retain old `/admin/*` only as legacy until explicit preservation/removal decision; do not confuse them with the new tablet screen.

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

**Next code action:** **T01 Cart/Checkout actual mobile/keyboard and error-state craft**, with T05 operator reconnection/sound observation queued in parallel once T01 screenshot proof is captured. The website leads, screen stays one product.
