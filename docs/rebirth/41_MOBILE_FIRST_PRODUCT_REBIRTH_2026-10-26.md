# TUSCANINI / Product Rebirth 02
## Mobile-first ordering app, branded web, first-party operations
**Date:** 26 Oct 2026 • **Branch:** `redesign/tuscanini-authored-experience-20261018` • **PR:** #59

> New product-direction source of truth, superseding the older implicit assumption that completing a stylish marketing website and a separate order experiment is the finish line. Preserve the existing repository, media, 113 source SKUs, integrations, test evidence and the owner's approved phrase «الكريب بيتكلم». Don't start a new website.

### 0. The change of thesis

**Before:** editorial Tuscanini landing page → historical menu → product dialog → cart → confirm details with the restaurant. An isolated operator/order subsystem exists, but it is not the restaurant's real register.

**Target:** Tuscanini as a **small, beautifully-made first-party takeaway application**: food discovery, personalized selection, a saved identity, accurate pin-based delivery, a deliberate payment choice, durable order placement, direct cashier handoff, reliable progress, easy returns and reorder. Editorial craft creates appetite; shopping interactions stay quiet, short and predictable.

The owner's expectation is not a developer-style test service. **When a customer successfully places an order, the correct thing is to receive an acknowledgment from the real restaurant's order channel**. Do not ask the guest to call and confirm a published price. Updating merchant catalog data should be a regular admin operation, not a reason to leave the whole customer product unfinished. Until real POS transport and authoritative prices are connected, keep the production state distinct from the complete preview implementation; don't claim delivery success or payment success that didn't occur.

### 1. Screenshot-based critique — not a theoretical style guide

Reviewed `tuscanini_mobile_evidence_board.png` (captured Home, Menu, Product selection, Cart, Pickup/Delivery Checkout, Contact and Tracking at 390px), additional prior 320/768/1440 screenshots, plus source code.

- **Composition:** almost every section uses the same huge condensed Arabic headline, stark black/gold blocks and small uppercase/numbered overlines. It looks like a series of campaign posters rather than one refined, navigable food app.
- **Mobile first fold:** Home image collage is memorable, but the menu still demands reading and scrolling through a brand-intro scene before scanning food. Earlier pass reduced this; the bigger fix is separating expressive storytelling from task-focused ordering.
- **Controls:** menus, cart, and product dialog use valid controls but not a coherent control grammar. Radio cards, repeated rectangular actions, top-level links and sticky bars compete. A real thumb-height bottom navigation and a single primary action per purchase state are needed.
- **Information density:** large negative space in Cart/Tracking competes with tiny action/control text. Red/orange banners and retro paper texture appear even in transactional states that need calm clarity.
- **Media system:** real restaurant photography, 100 original concepts and 20 additional images are strengths. Treat contextual real images and conceptual SKU images differently; don't let illustrations masquerade as exact dish photos. Photographer crops and food imagery need art-directed focal points per breakpoint.
- **Language system:** repeating `TUSCANINI / BENI SUEF`, numbered section labels, `بني سويف` and explanatory provenance copy on nearly every screen weakens voice. Brand belongs in logo and one hero story; lower-level microcopy should be concise and task-specific.
- **Real functional gaps:** no secure account and owned order history, no saved user addresses or on-map delivery pin, no completed POS acknowledgment, no actionable payment method choice or verifiable payment status. These are product gaps, not just unfinished styling.

### 2. Research: separated UI polish from ordering effectiveness

Primary method: **inspect actual mobile screen designs and evidence before borrowing**, adapt principles to a single Beni Suef restaurant instead of copying a generic marketplace.

| Reference | Studied user/system principle | Tuscanini-specific transfer |
|---|---|---|
| [Baymard 2026 Food Delivery & Takeout benchmark](https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026) | 8 major mobile brands, 390+ parameters. Important gaps: reorder access, modifiers, back navigation and truthful fulfillment. | Direct reorder, good item options, back navigation/retained state, transparent real order receipt. |
| [Domino's](https://www.dominos.com/) and Baymard's benchmark of its app | Ordering state, visible basket, addresses, order progress | Step-through checkout with fixed order facts, real POS statuses; no invented countdown. |
| [CAVA](https://cava.com/) / [mobile-ordering article](https://www.restaurantbusinessonline.com/technology/cavas-new-app-hopes-mimic-restaurant-experience) | Product customization feels like an interaction, not long print menu | Crepe add-on selection in one carefully composed, touch-friendly mobile sheet with persistent total. |
| [Shake Shack](https://shakeshack.com/) | Precise food-led campaign focus and order CTA | Brand visual rhythm without reusing the same headline template in every route. |
| [Zooba](https://zoobaeats.com/) | Contemporary local Egyptian graphic identity | Local pride through specific words, genuine food and restrained graphic moments, not BNS stamps everywhere. |
| [Pizza Station Egypt](https://pizzastationeg.com/home) | Immediate menu / deal / branch intent | Menu and reorder are shopping-first; don't delay a hungry returning guest behind a giant composition. |
| [Google Maps draggable Advanced Markers](https://developers.google.com/maps/documentation/javascript/advanced-markers/draggable-markers), [Places Autocomplete](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new) | Exact pin, accessible marker movement, address selection | Delivery location: real interactive map, user-selected coordinates, named place, written directions, saved address. |
| [Paymob payment methods](https://developers.paymob.com/paymob-docs/payments-and-features/payment-methods), [InstaPay](https://www.instapay.eg/) | Cards/wallets via PSP; Instant bank transfers are different from gateway-settled card payments | Cash on delivery / cash on pickup; offline pay via InstaPay or Vodafone Cash only with merchant-supplied settlement procedure; Paymob cards & wallets behind its real callbacks/credentials. |

Design awards, when used, assess art direction separately from task completion. No claim that Tuscanini has ratings or awards. No fake user testing results.

### 3. New information architecture

**Mobile navigation primary:** Home (appetite/discovery), Menu (buy), Offers (real promotions), Cart (live count + checkout). Entire app uses one fixed bottom dock; not redundant fixed CTA bars. Secondary links in a compact expanded navigation: My Account, My Orders, Locations & Help, Brand Story.

**Home**: distinctive single brand statement, real photographic focal point, current food categories/real offers, short order path, a minimal local story. No multiple pseudo-hero chapters stacked before food.

**Menu**: current fulfillment/address header, persistent search, meaningful category picker, photographic product cards with legible price, one clear action; no irrelevant editorial overlines or huge empty image field.

**Product**: focused visual, actual name, base/size, grouped extras with clear required/optional rules, quantity, computed total, dominant sticky Add button, Esc/back behavior. Full keyboard and reduced-motion fallback.

**Cart**: chosen lines and editing, fulfillment method, selected delivery address, one readable price breakdown, payment method, explicit **place order** action. No manual restaurant price reconfirmation UX for a published current catalog.

**Account & Order History**: verify identity, edit saved phone/name, multiple named addresses including pin and arrival directions, durable order list, invoice snapshot with status, one-tap repeat order rebuilt from *current SKU data* and revalidated totals. Guest checkout remains possible; registration isn't forced before ordering.

**Order tracking**: receipt and ID, actual server/merchant events, pickup vs delivery status, support, driver status only if a real courier system emits it. No fictional ETA.

### 4. Exact location as a transaction, not just a contact-page map

The current map in `/contact` helps locate **the restaurant**. A customer address picker is a **separate component and data model**.

Required live path:
1. Customer chooses Delivery; taps **«حدّد مكان التوصيل»**.
2. Request browser geolocation only when tapped (never assume permissions). If declined, typed search or manual map navigation works.
3. A draggable Google Maps marker or center-pin + Place Autocomplete lets the person set an **exact location**; show full map in a controlled sheet.
4. Return `lat` and `lng` plus selected display address; allow building, street, floor, apartment and landmark. Customer explicitly saves selected location.
5. Server checks service coverage using store-approved polygons/areas and computes actual fee, distance if needed, not client-supplied numbers. If outside coverage, clear alternatives.
6. The server persists the validated delivery point per order and optionally per customer; the operator ticket and driver-facing button open directions to **that customer's coordinates** (not their IP or rough suburb).
7. On editing address, recalculate fee/time and give explicit total before submission. After order, pin and address are immutable in the order snapshot unless the operator deliberately edits them.

**Integration shape:** Google Maps JavaScript API + Places with restricted API key and a documented adapter. Do not use a third-party iframe as a location-picking API or imply current `/contact` map already does this. Fallback is manually typed address, clearly marked as not a geocoded pin.

### 5. Account + durable order ownership

Use existing Supabase Auth infrastructure, preferably passwordless OTP; verify supported provider options (phone SMS requires configured SMS provider, email OTP requires verified sender/redirect). Avoid a fake localStorage `account`. Suggested tables (names subject to existing schema check):

- `customer_profiles (user_id PK auth.users, display_name, phone_e164, created_at)`
- `customer_addresses (id, user_id FK, label, formatted_address, lat, lng, building, floor, apartment, landmark, is_default)`
- `orders.customer_user_id` nullable for guest checkout; snapshots remain immutable; separate securely verified guest lookup.
- `order_events` immutable actual operator status transitions.
- `merchant_payment_intents` / `payment_events` for gateway payment state, not client-submitted `paid`.

Apply row-level security (authenticated person can only see their own rows), validated guest order lookups and API-based reconciliation. Add migrations; avoid linking old orders to a phone string without ownership verification.

### 6. Payment orchestration

An option presented in checkout must have real execution semantics. Proposed payment methods:

| Method | Checkout behavior | Who marks paid |
|---|---|---|
| Cash on delivery / pickup | order transmitted to real cashier, payment due at handoff | restaurant/POS |
| InstaPay on delivery / pickup | treated as an agreed **pay-on-handoff transfer method** only if restaurant confirms accepted handle/QR and reconciliation; don't fabricate a hosted direct debit API | verified receipt by restaurant |
| Vodafone Cash on delivery / pickup | same pay-on-handoff wallet semantics while no licensed gateway collection path exists | verified receipt by restaurant |
| Visa/Mastercard / online wallet later | initiate actual payment intent via PSP (e.g. Paymob) and secure return/callback processing with idempotency | backend after verified PSP signature/event |

States: `not_required_yet`, `pending`, `paid`, `failed`, `refunded` as applicable. Payment method selection `!=` payment confirmation. Avoid automatically treating InstaPay as an API-powered merchant checkout. Never ship hardcoded merchant wallet/bank numbers without actual account setup.

### 7. Direct cashier handoff: transaction semantics

**Target flow:**
`Customer submit → server calculates current authoritative product/add-on prices + delivery fee → writes idempotent order → POS adapter pushes or awaits pickup → real cashier acknowledges receipt → customer sees placed/received status → kitchen/dispatch events → ready/out/delivered`.

A *success* state must correspond to a durable order and actual guaranteed merchant intake method, with truthful acknowledgment. If a remote POS API does not provide synchronous acknowledgment, distinguish `submitted_to_queue` and `received_by_restaurant`, recover via retries/status checks; never invent immediate printer receipt.

Integration contracts to request from existing POS developer: API/DB exchange protocol, authentication, SKU/size/modifier mapping, accept/reject acknowledgment, idempotency key handling, ticket printing pipeline, status webhooks or polling, fee/tax fields, reversals and failures. Build behind transport adapter `RestaurantPosGateway`, not business logic coupled to one vendor. Run test against their system before calling it connected.

Catalog edits: `Draft → Validated → Published`. Owner publishes canonical menu/price/add-ons atomically; orders use published version. If price changes between cart and submit, show the new total and one action to accept **the new total**; don't send guest to call a cashier to verify every normal purchase. Availability reflects actual sold-out state, not outdated old PDF.

### 8. Visual design system v2 — quiet precision × expressive appetite

Keep Tuscanini DNA: paper/warm cream, deep charcoal, disciplined red, inviting yellow, real crepe fillings and locally-authored typographic attitude.

| Token / role | Candidate direction | Rule |
|---|---|---|
| `ink` | #171511 | body text, primary action, serious transaction labels |
| `paper` | #FFF9EE | quiet purchase surfaces; not harsh white |
| `cream` | #F2E7D4 | alternating product panels, rarely giant slabs |
| `yellow` | #F5CD4E | one directional accent or CTA, not everywhere |
| `red` | #D72E26 | selected brand emphasis / one emotional punctuation |
| `muted` | #6D6256 | subdued secondary copy with verified contrast |
| Body / functional | IBM Plex Sans Arabic | readable 14–16px mobile; numbers tabular for prices |
| Display | Changa | 36–64px context-dependent, rare 72px+ only Home |
| Condensed Latin / stamp | Anton | rare deliberate graphic glyph, never labels/buttons/forms |
| Radii | 12–16 controls, 20–24 sheets | consistent tactile object vocabulary |
| Layout | 4/8 spacing grid; 16–20 mobile gutters; 44–48px min tap targets | pixel-level optical rhythm, not hundreds of independent overrides |
| Motion | 120–200ms controls, 220–320ms sheets, rare 400ms storytelling | no motion required to understand or finish order |
| Elevation | restrained single-tone shadows | separate layers only when they communicate interaction |

**Anti-repetition rule:** one `بص جوه`/«الكريب بيتكلم» brand statement at Home; do not duplicate big Tuscanini/Beni Suef/numbered editorial labels on Menu, Cart, Contact and Tracking. These routes get task-based titles. Photograph crops must be chosen to sell a *real dish*, not be random texture. Do not apply the same black/yellow split + giant headline template to every screen.

**One screen / one job:** every 390px first viewport must answer: where am I, what can I do now, and what changes when I tap? Use an uncluttered bottom dock for high-frequency routes, context-sensitive header, bottom sheet for item customization, a quiet single checkout action, clear feedback/reversibility.

### 9. Motion and performance budget

Only entrance motion with a role. Menu filter changes should feel instantaneous; preserve scroll and focus. Sheet transition is spatial and reversible. A customer's selection should **never** be delayed by scroll animations. Respect reduced motion and keyboard focus. Optimize primary content image priority and CLS, prevent 3rd-party maps and analytics from slowing the menu. Target field CWV rather than fabricated scores.

### 10. Priority sequence (implementation, not repeated planning)

**Now (design-system / shell):**
- Refactor the existing mobile customer header into one bottom dock and suppress competing mobile order bars; cart badge reflects real state.
- Inventory repetitions, map every screen to the new type/space/control tokens, polish one commerce screen end-to-end before propagating. Real 320/390/768/1440 and physical Android/iOS screenshots, interaction tests, no horizontal overflow.
- Keep approved real food imagery and all previous assets.

**Next (delivery/address domain):**
- Model customer delivery point and exact selection component, with geolocation and map marker, cart/customer persistence and immutable order snapshot; then zone-based delivery fee.
- Create real authenticated customer profile + RLS-owned address book/order history + reorder.
- Model method selection and provider-neutral payment states, then cashier adapter + actual acknowledgment integration.

**Before a publicly accepted order:** merchant configuration, current published catalog and POS adapter tested against actual cashier. This is a product-integration gate, **not a reason to stop front-end or backend work today**.

### 11. Definition of done, mobile and backend separately

- **Design:** owner-reviewed real 320/390 screenshots, iOS Safari and Android Chrome physical-device journeys, photography mapping, no duplicate headings/CTAs, one dominant action per viewport, no blocking sticky layers.
- **Functional:** address chosen and persisted to order/operator map link, authenticated saved address & history, exact selection and price total, one payment intent state, stable idempotent submission, real POS acknowledgment.
- **Operational:** customer/restaurant support paths, reliable order state update and retry, error-state recovery on weak connection, real payment verification and service-zone configuration.
- **Release:** branch CI/browser proof plus merchant publication decision, preview distinct from production. Git main merge is a code deployment change, not equivalent to verified first-party restaurant acceptance.

### Progress log
- 26 Oct: visually audited existing screenshot contact sheet and source, verified current PR HEAD status and previous green CI, captured current benchmark references. Shipped customer mobile bottom navigation and removed redundant sticky purchase bars in existing shared shell. **This is the first concrete product-shell upgrade, not a claim that accounts, user delivery pins, PSP or real cashier are already built.**
