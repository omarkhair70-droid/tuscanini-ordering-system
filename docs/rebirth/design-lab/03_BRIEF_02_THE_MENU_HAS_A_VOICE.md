# TUSCANINI / CREATIVE BRIEF 02 — THE MENU HAS A VOICE
Date: 2026-11-01 · Status: **active design experiment, not brand approval**
Working branch: `design/tuscanini-menu-first-lab-20261031` · PR #69 draft · Never merge into live main without approval.

## 0 — Actual screenshot critique, not imagined research
Evidence: [GitHub CI run 41246445609](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/41246445609), artifact `tuscanini-mobile-desktop-visuals`; real Chromium screenshots of `/` at 320/390/768/1440 and product dialog at 390.
- **Keep:** mobile first food selection appears inside the first viewport; original repository search/category/product/cart state is connected; a selected product dialog is detailed and workable.
- **Repair:** desktop currently looks like four repetitive boxed product tiles with heavy near-black framing, repeated food artwork dominates dish naming; it needs an authored editorial reading rhythm.
- **Repair:** the tiny `الأصناف` eyebrow repeats the main heading; header's `افتح المنيو` CTA points to the very menu already in view.
- **Repair:** 390px gallery cards' soft, large corners and shadows make the browsing surface feel like a generic app catalog. Seek a printed-menu character **without sacrificing 44px tap targets**.
- **Not proven:** genuine users prefer a two-column printed-menu-inspired desktop layout. This is a visual usability hypothesis for comparison, not a finished user study.

## 1 — Creative question
**Can the menu feel physically authored without making the act of choosing food slower?**

### Working thesis
Think of the **printed restaurant menu**: a readable name, an unambiguous type, a clear beginning price, a tactile dividing rule, an image only when it helps. In a digital interface, let the product sheet do the customization work. Artistic confidence comes from precisely ordered information, not bigger decoration.

### Proposed visual syntax
- Paper: very warm neutral, lightly varied surface via **real CSS color**, no fake "paper texture" overlay.
- Typography: expressive Arabic for a short display and menu item title; quiet Arabic UI for modifiers, category and prices. Names have first priority.
- Product architecture: compact **two-column desktop editorial spread** with small image beside dish name, clearly separated cost and an explicit selection button. Single-column mobile stream.
- Photo identity: legacy mapped product illustrations are *representative* and unverified for specific dishes; do not assign one real restaurant photo to a named SKU. Avoid replacing all images with AI art.
- Motion: restrained hover/selection feedback only; no ambient autoplay, no entrance carousel.
- Persistent truth: exactly the same item IDs, sizes, modifiers, category slugs and backend gates as the existing product. No new order or price calculation.

## 2 — UX questions and evaluation
Compare screenshot v01 vs v02 (320/390/768/1440):
- Can a first-time viewer correctly distinguish chicken shawarma **crepe** from pizza with a similar name?
- Is each dish name, baseline price and tap action visible without reading decorative copy?
- Does one complete item row remain visibly understandable at 320px/200% zoom?
- Can someone jump to the intended food family, return to All, search across families, open the product detail and return without losing context?
- Does the first food item remain in first viewport at 390px? No horizontal overflow.
- Do old photos remain labelled as representative and original photography never impersonate named dishes?

**Numeric targets (hypotheses, not measured customer metrics):** first real product visible within 844px viewport on 390px mobile; ≥44px touch actions; no horizontal overflow >3px; CI browser flow passing at 320/390/768/1440; no order POST.

## 3 — Relevant research (citations for decision context)
- Baymard, *2026 Food Delivery & Takeout UX Benchmark* (13 Aug 2026): observed broken orientation/back paths and weak repeat-order support among benchmarked apps. Distinction: this does not validate our specific visual aesthetics. https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026
- Baymard *Food Delivery & Takeout UX* covers menu navigation, food comparison, customization and checkout. https://baymard.com/research/online-food-delivery
- Nielsen Norman Group, *UX Guidelines for Ecommerce Homepages, Category Pages, and Product Listing Pages*: expose actual product choices alongside short category wayfinding and useful differentiating info. https://www.nngroup.com/articles/ecommerce-homepages-listing-pages/
- Visual references: Semolina Restaurant printed menu and Crepes & Waffles Arte-Sano menu on Behance: editorial use of photographed food and whitespace, not UX performance evidence; **do not copy layouts/identities**.
  https://www.behance.net/gallery/160804991/Menu-Design-Semolina-Restaurant
  https://www.behance.net/gallery/125583829/Menu-Crepes-Waffles-Arte-Sano

## 4 — Scope and review
**Change in code:** only presentation rules scoped `.t-menu-page--first` and redundant menu-intro/header copy. No separate HTML source, no duplicated Next.js menu or cart.
**Reject if:** price/click targets disappear, mobile first item falls below fold, layout requires inaccurate photo/SKU claims, older cart tests regress or visual hierarchy is more generic.
**Do not claim done until:** 320/390/768/1440 screenshots inspected and compared; end-to-end product flow + build passing at final commit.
