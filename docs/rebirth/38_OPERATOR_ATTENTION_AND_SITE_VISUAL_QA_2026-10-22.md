> **OWNER SCOPE CORRECTION:** The next-work section below suggesting named cashier/kitchen accounts and sessions is superseded by [ONE WORKING BOARD](WORKING_BOARD.md): one protected restaurant order screen with simple secure access. All other tested visuals and evidence here remain valid. No new HR, staff roles or POS suite.

# PASS 38 — Order attention + real screenshot craft review
**22 Oct 2026 · PR #59 DRAFT · branch `redesign/tuscanini-authored-experience-20261018`**

## Canonical proofs inspected (not inferred from code)
- **Before (code `cdaa9e54`):** [Operator / Postgres / Chromium CI #39744281293](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39744281293), screenshot artifact `12410114354`. Inspected `press-20-orders-1024.png`, `ticket-rail-20-orders-1024.png`, `press-20-orders-768.png`, `press-20-orders-390.png`.
- **After (code `6dca3806`):** [Backend + real browser CI #39771522529](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39771522529), screenshot artifact `12422757147`. Also [Home CI #39771522517](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39771522517) and [public website visual + asset CI #39771522454](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39771522454): all three **SUCCESS** on the same code SHA.
- **Site-wide inspected artifact:** [Visual + asset CI #39744281289](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39744281289), `tuscanini-mobile-desktop-visuals` artifact `12411486107`. Includes 390/1440 public routes, 320/768 selected routes, dialog/cart/tracking states, menus and motion films.

## What the screenshots made clear
1. At **390px before**, the first actual order paper started about **790px** from the top of the full-page capture. Header, preview explanation, four large counts, filters and search consumed almost the full first screen. At **390px after**, it starts about **507px** down: a visibly faster path to the first ticket while preserving totals, query filters and controls.
2. At **1024px**, Order Press has one readable, scrollable focus ticket with its action footer inside the paper and an independent fixed-height queue. Previous text-row compression in a 19-order queue was already corrected at Pass 37; do not regress it.
3. The Rail is intentionally an **RTL paper reel** rather than Kanban. Before, it had obvious horizontal overflow but no explicit move control; the left-edge partial ticket could look cut off. After, it has two prominent arrow buttons; Chromium verifies that the **next** button physically advances the RTL scroll.
4. Current receipt detail hierarchy remains honest: order ID, server phase, arrival age, fulfillment mode, exact line variants/addons/notes, total and permitted next action. The 20-order preview keeps all mutations disabled.

## Actual implementation
- `components/studio/operator-press.tsx`: explicit opt-in **two-note sound cue** using Web Audio; initial inbox snapshot intentionally causes no alarm; later newly received order IDs trigger attention and an in-page count when a live visible tab syncs; muted by default and user can toggle off. The cue is scoped to an open operator page, not a background notification. Added explicit RTL Rail previous/next navigation, corrected success/error text styling, and kept selected-order persistence.
- `app/operator-press.css`: 390px information compression, action/button touch targets, accessible rail arrows and a bounded optional arrival callout; preserved the 1024px paper-based visual system.
- `scripts/qa/rebirth-operator-press-visual.mjs`: real Chromium checks for arrow scroll direction, sound opt-in/out control, first Press ticket visible within a 390px viewport, no overflow, 20 cards, queue focus and mode/filter persistence.
- **Measured by CI:** all 3 PR-check workflows green for `6dca3806`. The WebAudio toggle is browser-verified; the exact audible sound on a real physical tablet is **not yet human-tested**, and no background sound/Web Push exists.

## Public website — first-fold creative audit from real 390px and 1440px artifacts
| Surface | Observed composition / opportunity |
|---|---|
| **Home** | Strong black/yellow editorial food entry with real restaurant media and direct menu CTA. Large headline/art have presence. Compare the repeating dark opening rhythm with Menu so the second page gives the user more new information faster. |
| **Menu / product** | Menu initially repeats the oversized dark editorial hero before catalog. Its native product dialog shows real option selection and sticky cart total. Next craft action: confirm first purchasable option proximity at 320/390, and test last addon, scrolling, back and keyboard with sticky footer. |
| **Cart / checkout** | 390px populated cart shows line/size/addon review, quantity edit, form, delivery and final review all in one coherent flow. Still a long vertical sequence; shorten the transition from selected item to required contact fields, preserve a visible edit/review path and test virtual-keyboard behavior. |
| **Tracking** | Real staged customer status and incoming operator updates are represented in branded ticket states. Need complete operator-provided estimated prep time, reconnect/duplicate-event QA and push-to-ticket entry. No fixed fabricated ETA. |
| **Offers** | Strong standalone chili-red composition — visually distinguishable from Home and Menu. Check empty/expired offer state against live catalog authority. |
| **Food Finder** | Deliberately lighter first-fold entry. Test recommendations/search and zero-result flow on real 390px, not just hero screenshots. |
| **About** | Paper/cream documentary chapter and genuine source-backed photo; rich storytelling has a distinct role. Check total reading length/crops on 320px and avoid reusing one food composition too often. |
| **Contact** | Dark entry then yellow wayfinding/actual location directions; good split between contact and place. Verify clickable number/directions and focus states. |
| **Reviews** | Distinct red first chapter. Confirm submit/empty/server-error states; automated screenshot success alone is not submission proof. |
| **Complaints** | Cream/red factual support entry, visually distinct from Reviews. Test form validations, response state and narrow widths, not only a static capture. |

This is a **visual first-fold and screenshot-level audit**, not a statement that every page is editorially closed or merchant approved. Do not repeat full visual research or regenerate the 100 generated food images.

## Product direction / next actual build units
1. **Named staff sessions + server-enforced cashier/kitchen permissions** replacing the entered local fixture key. Preserve minimum-data inbox responses, session expiry/logout, role denial tests and audit actor IDs. The current role switch in the loopback engine is still test-only and must not be called auth.
2. **New-order attention on actual operator devices:** live arrival browser test (including reconnect and multiple arriving orders), role-scoped sound and disabled/muted preference, plus selected order retention. Do not announce old orders as new on page load.
3. **Kitchen timestamp and operator-entered prep estimate** as durable events to the same first-party living customer ticket; then scoped Web Push subscription, outbox and service worker with opt-in.
4. **P0 site craft continues alongside operations:** Home→Menu differentiated entry, product choice under sticky CTA, cart/mobile keyboard, tracking/motion at 320/390/768/1440. Pair *each* change with screenshot before/after and real interaction proof.

**Boundaries:** The original cashier/POS and Talabat are separate. No real merchant prices/data, no main merge, no public deploy or staff pilot. PR #59 stays DRAFT.
