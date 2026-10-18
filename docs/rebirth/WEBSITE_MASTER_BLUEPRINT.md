# TUSCANINI / ONE WEBSITE MASTER PLAN — REBIRTH

**Status:** production scope and visual baseline defined, implementation IN PROGRESS. Not a declaration that the website is complete.
**Date:** 18 October 2026
**Branch:** `redesign/tuscanini-authored-experience-20261018`
**Authoritative implementation:** original Next.js repository, same branch and Draft PR. No separate HTML mini-sites as final deliverables.
**Reference file:** `TUSCANINI_WEBSITE_EXPERIENCE_V01.html` from the 2026-10-18 research session: an *aesthetic/interaction reference*, NOT the deployable website.

## What is being built
A fully joined-up, Arabic-first, responsive Tuscanini restaurant site using the 12 original restaurant photos and the actual operational system. It should feel like a **coherent authored world**, not a repaired legacy template. The owner will judge the **completed integrated site**, not isolated unfinished pages.

**Nonnegotiable:** never inherit an old layout, color, logo placement, card system or navigation solely because it already exists. Existing code can be retained only as reliable business logic/data interfaces after verification.

## Screen/route inventory (verified in existing GitHub repo)
### Customer-facing: 10 existing primary routes
1. `/` — Home / editorial first encounter, actual photo evidence, entry to menu and current offers.
2. `/menu` — complete menu browsing, search by known item, categories, availability and filtering.
3. Product experience — **one connected subexperience of /menu initially**, with authentic image, named item, available size, extras, quantity, price, accurate add-to-cart; can become a dedicated route if real behavior requires it.
4. `/offers` — current offers only, exact price, validity, eligible options and route into cart.
5. `/food-finder` — actual recommendation engine, avoids fictional item availability, never obligatory.
6. `/cart` — cart, editable items, real fulfillment details and checkout/submit behavior.
7. `/order-success` — confirmation, order reference, genuinely tracked status and support.
8. `/about` — real restaurant story; do not treat the unverified four-founders copy as a checked historical claim.
9. `/contact` — address, open channels, location.
10. `/reviews` and `/complaints` — feedback and support are separate existing routes, can appear in one footer-level navigation group.

The list includes **10 actual customer route paths**: /, /menu, /offers, /food-finder, /about, /contact, /reviews, /complaints, /cart, /order-success. Product detail can be a drawer, not a fabricated extra website page. The visual section count does not determine the route count. Loading/empty/error/cart-confirmed/mobile states belong to their respective experiences and MUST be implemented.

### Operations: 7 existing routes
`/admin/login`, `/admin`, `/admin/products`, `/admin/orders`, `/admin/kitchen`, `/admin/offers`, `/admin/settings`.
These get a readable dedicated **operations UI family**, not the cinematic/marketing style of the customer site. Admin routes must preserve permissions, session checks, status truth and mutations. Do NOT merge admin into customer-facing navigation.

## Navigation decision (sitewide)
**Desktop, persistent:** Tuscanini brand link · الرئيسية · المنيو · العروض · اختار أكلك · الحكاية · [cart with count] · prominent **اطلب دلوقتي** CTA. Optional location/contacts available in footer/context, not nine pills.
**Mobile:** brand, persistent visible `المنيو` entry, cart count, one menu trigger for secondary destinations. When not already in a transaction, a restrained sticky `اطلب` action can be present. No duplicate 5-tab old mobile nav underneath the new nav.
**Footer:** location, contact, reviews, complaints, active social link, real ordering help. Internal `order-success` tracking belongs to an actual order, not a fake marketing nav item.
**Deep linking:** menu category, current offer and incoming campaign links must land on the intended state, not fall back to generic home.
**Accessibility:** focus behavior, keyboard + touch, skip link, reduced-motion, content still works with JS/motion turned down.

## Visual baseline derived from the HTML reference (working, NOT customer-approved final brand)
- **Ink:** `#171511`
- **Paper:** `#FFF8E8`
- **Cream:** `#F4E9D4`
- **Chili:** `#D92E24`
- **Corn:** `#F5CD4E`
- Arabic expressive display: **Changa 800**, informative Arabic UI: **IBM Plex Sans Arabic**, Latin editorial accents: **Anton**.
- True photos of 12 food images from user-provided Facebook page, correctly mapped to food **families** only until their item identity is confirmed.
- Photo roles: product/human scale, cross-section, pizza/context, branded wrapping, editorial series; no fake generated portion or oversized pixels as full bleed on desktop.
- Layout rhythm: big Arabic editorial typography, arresting food composition, calm/loaded contrast; custom per-section hierarchy. Not identical repeated hero/cards per route.
- Interaction: progressive image reveals only when they explain actual ingredients/material; search and checkout should be instantaneous and boring in the best sense.
- GSAP may power meaningful 2D editorial motion *after* comparative testing. Do NOT install Three.js/PixiJS/Rive just to signal sophistication.

## Build order (working across the whole PR, review only integrated result)
1. Establish shared theme/nav/footer/type/photo pipeline and a visual-composition baseline that matches or exceeds the HTML reference.
2. Complete Home with all authentic images and meaningful transitions.
3. Build Menu + product detail + discovery as ONE customer task flow on real data.
4. Build Cart + checkout + confirmation/tracking end-to-end with accurate statuses.
5. Build Offers and Food Finder with real integration.
6. Build Story/Contact/Reviews/Complaints under distinct visual roles.
7. Restyle Admin/login/products/orders/kitchen/offers/settings as coherent **operational** family while preserving all backend rules.
8. Full integrated acceptance: real phone/desktop, narrow screens, image loading, slow-network fallback, accessibility, QA all routes and all data paths, performance, and CI.

**Do not prematurely call a page CLOSED** just because its JSX exists or its build passes. End-to-end happy/error states, visual QA and realistic data all have to work.

## Unknowns and safety rules
- The 12 photos were supplied as 640×640 JPEGs; 11 original files are now committed to this branch and displayed through Next/Image, which negotiates optimized formats. TSC-12 remains absent and the strict asset QA gate blocks release.
- The original mock menu is historical; current menu items, prices, recipes and image-to-product assignments require evidence. Existing current Supabase-backed interfaces should be used when valid, but no fabricated sales or available stock.
- Social story, hours, offers and founders must not be fabricated.
- No sitewide publication or PR merge until integrated readiness. The legacy production website and main branch must remain untouched until then.

## Reference trace
- Tripletta Pizza / Treize Grammes: site expresses a real restaurant world, not a template.
- Lupo: audacious typographic identity without copying shapes or characters.
- Promeat / Chipsa: technique follows editorial idea, WebGL is not mandatory.
- Zooba / &Walsh: local material becomes graphic language, not generic Egyptian stereotypes.
- Baymard 2026 food ordering UX: protect direct order, customization clarity, live order statuses.
- HILTECH creative system and Omar Khair Portfolio: authored direction, role-specific pages, anti-repetition, browser QA gates.

**One goal:** A customer encounters one complete Tuscanini universe. NOT a great HTML prototype beside a weaker Next.js site.
