# TUSCANINI / CREATIVE LAB — BRIEF SEQUENCE
Status: work-in-progress creative planning · 2026-11-01
Owner goal: "Less talking, more sensation. Open the website and immediately see the menu."
Implementation requirement: **the real existing Next.js site only**. No separate HTML prototype or duplicate cart/menu components.

## Brief 02 / THE MENU HAS A VOICE — In code, critique pending
Research source: current 390/1440 Chromium images + Baymard's food delivery benchmark + Nielsen Norman Group category/list guidance.
Experiment: editorial two-column desktop dish spread, one-column mobile scan, thin rules, restrained price actions; preserve catalog and direct food access.
Review: check first fold, product identity vs category identity, prices, photos, loading, accessibility and browser screenshot diff. **Not customer validated yet.**

## Brief 03 / FOOD, NOT DECORATION — Next creative experiment
**Question:** If exact dish photos aren't certified, how can we make the brand feel hungry and tactile without inventing a product photo?
Source: 12 original genuine restaurant 640x640 photos (TSC-01..12) and existing generated representative WebPs. Exact SKU photo verification is still 0 in the historical media audit.
Design work:
- Build 12-source photo contact sheet and a source/evidence matrix, each source assigned to allowable *category/brand/packaging* contexts only.
- Compose 3 alternate photographic rhythms **inside existing Next.js components**: (A) one true restaurant image as low-height editorial punctuation between menu sections; (B) contextual photo only on selected category; (C) typography-first list with images solely in product detail. These are exploration variations; don't silently replace real product imagery.
- Identify shooting needs for true SKU photography with owner. Avoid generated food presented as authentic or current menu imagery.
- Evaluate image loading at 320/390, crop integrity, alt/caption truth, first-food accessibility, dark food legibility and image redundancy.
Reject if food discovery slows or a diner can mistake category/illustrative photo for approved exact dish.

## Brief 04 / THE ORDERING GESTURE — Interaction and accessibility
**Question:** Can selecting and customizing a crepe feel effortless with one hand?
Design work: product sheet and options, price updates, adding to persistent cart, editing prior selection and returning, checkout error and disabled intake state. Preserve original backed validation.
Explore two controlled gestures: tap row vs preview art, sheet close/focus restore; no autoplay or unnecessary FLIP for reduced-motion.
Measure with 5 moderated user sessions and Playwright: taps, task success, misunderstandings, errors, add/remove correctness; NO live restaurant order submission.
Reject if options, costs or return paths are concealed for visual cleanliness.

## Brief 05 / ONE RESTAURANT, ONE LANGUAGE — Whole product polish
**Question:** Does Tuscanini feel like a coherent place rather than unrelated menu/cart/offer/operator themes?
Map typographic voice, paper/ink/chili tokens, button semantics, icons, hierarchy, status strips and operational feedback across actual routes. Operator UI remains functional staff workspace; do not force brand decoration onto tickets.
Compare 10 customer routes at 320/390/768/1440 + real-device exercise; account for blocked external integrations and production launch gates.

## Creative method / every brief
1. **Observed problem** — actual screenshot or user test, not a moodboard adjective.
2. **Design hypothesis** — expected UX and emotional payoff, stated as unproven.
3. **Independent references** — distinguish UX evidence from visual inspiration.
4. **Real-site commit** — scoped implementation on isolated design branch.
5. **Proof** — Chromium screenshots, functional QA, failure states, accessibility.
6. **Critique** — retain/change/reject; never call a quick mockup finished identity.

Source references:
- https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026
- https://baymard.com/research/online-food-delivery
- https://www.nngroup.com/articles/ecommerce-homepages-listing-pages/
