> **NEXT CHAT / MOST RECENT VERIFIED STATUS (19 Oct 2026):** Read [`20_CANONICAL_NEXT_CHAT_HANDOFF_2026-10-19.md`](20_CANONICAL_NEXT_CHAT_HANDOFF_2026-10-19.md) **FIRST**. The full owner-generated **100 WebP images are now committed in GitHub and enabled**, with generated-photo Chromium/FLIP/browser QA green: [Action #39209194074](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39209194074). PR #59 remains DRAFT, no merge or deploy. This older 18 Oct source priority and decisions remain valuable but status/old TODOs are superseded. All errors, decisions, Pass 00–19 chronology and current next work are documented in Pass 20.\n\n# TUSCANINI REBIRTH — SOURCE OF TRUTH
Updated: 2026-10-18 | Branch: `redesign/tuscanini-authored-experience-20261018` | PR #59 (draft)

## The commission
Rebuild Tuscanini (شارع البحر، سور نادي توليب، بني سويف) as a coherent new restaurant experience, not a visual facelift. It was the builder's FIRST WEBSITE; the new work should demonstrate the intervening growth shown by HILTECH, Omar Khair Portfolio and other full products. Return a COMPLETE connected website for the owner to review, not a succession of unfinished isolated homepages.

**Rule: “The workflow repeats. The answer must not.”** The research-to-expression method from HILTECH and the portfolio repeats; neither project's appearance, effects or page template should.

## Definitive source priority
1. **Owner-confirmed facts:** physical Tuscanini branch and the supplied Facebook URL + 12 true page pictures.
2. **Original media:** `TSC-01..12` 640 × 640 actual Facebook page images, plus screen captures of logo, social content and offers. These verify visible features, not menu prices/ingredients/sales figures.
3. **Research archive:** Passes 02,03,04,05,05B,06, creative labs 06A, Visual Constitution 01, 12-image audit, and integrated HTML experience V01 from Oct 18, 2026. Their findings are indexed in `01_RESEARCH_MEMORY.md`.
4. **Working aesthetic reference:** `TUSCANINI_WEBSITE_EXPERIENCE_V01.html`, an independent exploratory full-site HTML, liked for its typography, color, energy and interactive image compositions. The file itself is NOT the production source. Treat its visual level as a minimum to improve on, not an arbitrary final blueprint.
5. **Legacy GitHub code:** trusted only for concrete integration contracts after verification; NEVER for a visual/design requirement. Legacy Main is an archive; Draft PR is the new production workspace.

## Architecture and delivery
- ONE real Next.js App Router project; same existing GitHub repository and draft PR for traceability. Clean-slate customer frontend and design system, selective preservation/replacement of validated order/admin logic. Supabase is *not* a design constraint or necessarily a reason to migrate; audit operational truth, security and reliability first.
- Customer: Home, Menu+product customization, Offers, Food Finder, Cart/Checkout, Confirmation/Tracking, Story, Contact, Reviews, Complaints. **10 existing route paths**; product detail may be part of /menu, not a gratuitous extra page.
- Operations: 7 existing core routes: admin login, overview, products, orders, kitchen, offers, settings; preserve operational accuracy and privilege boundaries. Other ancillary admin paths should be discovered rather than silently discarded.
- Keep historical item/price data marked UNVERIFIED until reconciled with restaurant or live approved source.
- The review checkpoint requested by owner is the **INTEGRATED SITE**, not approval of each half-built screen. Internal per-route QA and screenshot reviews still mandatory.
- Ship no production merge without explicit approval; first preview QA on branch, then integrated release review.

## Navigation baseline, not old UI inheritance
Desktop: Tuscanini brand; الرئيسية / المنيو / العروض / اختار أكلك / الحكاية; visible cart count and decisive «اطلب دلوقتي». Mobile: brand + visible menu entry, accessible drawer for secondary places and obvious cart/order action. Footer: contact/location, reviews, complaints, social, ordering help. An order-tracking link is contextual to an *existing real order*. Do not duplicate legacy 5-tab mobile navigation beneath new header. All deep links and focus handling must work.

## Design commitments vs hypotheses
**Committed constraints:** real food photography, accurate portions, readable real prices, direct fast-order path, support RTL/LTR, distinct page roles, mobile-first and keyboard/reduced-motion support, semantic navigation and real loading/empty/failure states.
**Working, not final brand approval:** Inside/Out; large expressive Arabic type, editorial contrast and bounded use of food cutaways; photo-led campaign language; experimental palette/fonts in `02_CREATIVE_AND_MEDIA_SYSTEM.md`.
**Not decided yet:** final logotype, final exact palette, exact font licensing/bundling, full animation technology, 3D, packaging program, menu hierarchy winner, physical rituals. These decisions are earned through documented visual/browser tests, not invented consensus.

## Read in order
1. `01_RESEARCH_MEMORY.md` — why ideas exist, counter-evidence, studies & references
2. `02_CREATIVE_AND_MEDIA_SYSTEM.md` — image audit, design grammar, typography, motion and prototype translation
3. `03_ENGINEERING_AND_QA.md` — integrations, security, accessibility, tests and CI gates
4. `04_BUILD_SEQUENCE_AND_DECISIONS.md` — production lanes and recorded decisions
5. `WEBSITE_MASTER_BLUEPRINT.md` — existing verified route map, current production outline

The old work is preserved; never silently present hypotheses or demos as finished storefront features.
