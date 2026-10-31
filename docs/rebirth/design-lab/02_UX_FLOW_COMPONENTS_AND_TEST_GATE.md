# TUSCANINI / UX FLOW + TEST GATE 01
**31 October 2026 · Design study only**

## Primary jobs
- **Known-item buyer:** home → search name → correct dish/form → size/modifiers → cart. Search must scan the entire available catalog; a prior category filter must not silently hide it.
- **Undecided buyer:** home → main food family → clearly differentiated name/size/starting price → product sheet → cart.
- **Editing buyer:** cart → edit line → preserve options and order reference, correct totals → cart.
- **Tracking buyer:** verified order link → truthful received/confirmed/preparing status, not decorative prediction.

## Proposed family grouping
- `crepe`: historical crepe-meat, crepe-chicken, crepe-mixed, crepe-tuscanini and crepe-sweet.
- `pizza`: historical pizza-meat, pizza-chicken, pizza-mixed and pizza-tuscanini.
- `sandwiches`: sandwiches-french, sandwiches-kaiser.
- `pasta`: pasta.
- `sweets`: waffle and appropriately indexed sweet crepes (do not duplicate SKU identity).
- `appetizers`: appetizers.
- `drinks`: drinks.
- `crepe-addons` is a **modifier group**, not a prominent top-level meal family without actual ordering evidence.

## Interface states to prototype and verify
Home/menu: loading, normal, search active, empty results, no catalog, not-available item, product matched photo vs only family photo. Product: one/multiple sizes, modifier conflicts, quantity, price update, notes, close/back/focus. Cart: empty, edit, remove, changed price, intake disabled, API uncertainty. Tracking: order received is *not* restaurant confirmed; disconnected data is flagged stale.

## V01 component map
`BrandHeader`, `Search`, `FamilyRail`, `MenuSection`, `MenuRow`, `ProductSheet`, `QuantityControl`, `CartReview`, `ContextPhoto`, `StatusAndError`.

## First validation plan (not yet conducted)
Five short moderated sessions: two returning Tuscanini guests, two first-timers, one participant less comfortable with mobile forms, using their own phones if possible. Four tasks:
1. Find a **chicken shawarma crepe** without choosing pizza with the same dish name.
2. Find a Margherita pizza, select correct size and tell us its final price.
3. Change quantity and return to menu without losing progress.
4. Find location/help or inspect a simulated order status.

Observe task completion, wrong-category selection, taps, first item visibility, search success, misread price/size, return-path ease, 320px/390px horizontal overflow, keyboard focus and 200% zoom. Test current Rebirth vs this direction. Threshold targets are hypotheses, not measured results.

## Hard gates
- Source-backed authenticated runtime catalog and current restaurant approval.
- Real branded photo use only when rights and exact dish association are verified.
- Guest purchase remains direct; no forced identity wall.
- Touch targets ≥44px; Arabic RTL and Latin isolation; no motion requirement; predictable Escape and focus return.
- Real order acceptance/status is never simulated as production.
- Verify mobile/desktop visual screenshots, network failure, no-order duplicate retry and staff handoff independently.

**No merge, no deploy, no change to active checkout or legacy main from this design-only work.**