# TUSCANINI — CREATIVE DEVELOPMENT LAB / PASS 05-B

**Date:** 18 October 2026  
**Stage:** Source-backed technical/reference recheck + text-only experience experiment designs  
**Status:** Research decision recorded; no final creative thesis, site designs, new brand assets, or production code approved.

**Links to previous passes:**
- [02 — Reference research](./TUSCANINI_RESEARCH_PASS_02.md)
- [03 — Food & ritual atlas](./TUSCANINI_FOOD_RITUAL_ATLAS_03.md)
- [04 — Material to experience](./TUSCANINI_MATERIAL_TO_EXPERIENCE_PASS_04.md)
- [05 — Creative thesis stress test](./TUSCANINI_CREATIVE_THESIS_STRESS_TEST_05.md)

## 0. Scope and evidence standard

This project is a **new authored experience** for Tuscanini (the user-identified restaurant beside Tulip Club, Beni Suef), not a facelift of the first site. The old website is a historical operational reference. Avoid inheriting its home layout, typographic styles, red/yellow palette, navigation, animations, or aesthetic merely because they exist.

**Evidence legend:**
- **E-P** — Primary visual evidence: two user-supplied screenshots of the restaurant Facebook header and photo gallery (not the full page). These are *images of the actual page*, not a sales study.
- **E-R** — First-party code and historical catalog in `omarkhair70-droid/tuscanini-ordering-system` (`lib/mock-data.ts`, `types/menu.ts`), not verified October 2026 restaurant inventory.
- **E-X** — External studies/tutorials whose authors or publishers we can identify.
- **H** — Hypothesis requiring observational/customer/field validation.

A screenshot cannot tell us bestselling dishes, repeat rate, recipe fidelity or what a user would choose. A shader tutorial is evidence of a possible implementation technique, **not** proof that the effect helps restaurant users.

## 1. What the supplied restaurant evidence actually says

At the visible gallery date, the screenshot contains a 5-column grid. The first three fully visible rows show: many staff-held open stuffed savory items, a pizza, a sauce-covered dish, branded takeout packaging, football/competition promotional artworks, a restaurant-counter scene, and one stylized illustrative scene. Do not claim that the entire feed has this distribution; these are 15 selected visible tiles.

**Observed recurring photographic gestures:**
1. Open/cut side facing camera, exposing sauce and fillings — *inside visible* (E-P).
2. A hand/body holding multiple full-size portions — *human scale* (E-P).
3. Black staff tops and red takeaway packaging create recurring backdrops — *real brand context* (E-P).
4. More than one food form appears: stuffed crepe-like products, pizza, other hot prepared food — *not purely Italian or purely crepe* (E-P).
5. Direct product shots coexist with football promotions and graphics — *at least two voice registers* (E-P).

**Not yet known:** whether food is actually served cut open; whether the shot exaggerates normal portions; the current recipe for each image; how the wrapping opens; whether the staff picture is staging; whether a dominant ingredient motif is distinctive locally.

## 2. New reference decomposition: mechanism → potential meaning → risk

| Verified reference | Technique/publisher fact | Possible Tuscanini R&D experiment (NOT a proposed feature) | Fail condition |
|---|---|---|---|
| **Hiroki Watanabe, “SVG Mask Transitions on Scroll,” Codrops, Mar 2026** | Shows four image transitions through GSAP/ScrollTrigger and responsive SVG masks. | Contrast ordinary still vs two-image real-food mask that reveals a genuinely photographed cut. | The transition conveys no extra food information; mobile crop hides actual portion; obligatory pin delays order. |
| **Andrea Biason, “How to Animate WebGL Shaders with GSAP,” Codrops, Oct 2025** | Shows shader-based blending of two textures with animated uniforms, including pointer interaction. | Explore if a spatially localized reveal gives users more control in a discovery *editorial* moment. | Requires WebGL for something a static comparison explains better; quality and performance suffer on mobile. |
| **PX PUSH website case study, Codrops, Aug 2026** | Founder portraits shot from fifteen angles; frame selection coupled to scroll for photographed rotation rather than realtime 3D modeling. | A real-food multi-angle sequence, only if the food's shape/size is confusing and footage is genuine. | Multiple angles do not communicate relevant product difference; network weight is excessive. |
| **Trionn technical case study, Codrops, Jul 2026** | One normalized progress driver coordinates a 371-frame WebP sequence and several independent animations. | Use one shared timeline **if** a future concept has tightly related chapter transitions. | A frame-heavy implementation becomes the identity, or imposes download/scroll cost. |
| **Adobe, Food Photography Tips & Techniques** | Emphasizes controlling light, framing, real edible food, timing and surfaces in food photography. | Make a repeatable capture kit: whole item, cut/interior, in-hand scale, wrapper/open, top view as appropriate. | Pictures enhance the dish beyond what customers normally receive, distort color, or omit ingredients. |
| **Nielsen Norman Group, Tree Testing** | Evaluate a proposed IA using a text-only tree and task finding; card sorting instead discovers groupings. | Run tasks on three different *text-only* findability structures. | We prematurely name “flavor first” as preferred with no participant results. |
| **Baymard, Food Delivery UX Benchmark, Aug 2026** | Eight services; common shortcomings in repeat ordering, customization, navigation and fulfillment clarity. | Protect an immediate find/order route distinct from optional discovery or editorial storytelling. | Customer must watch visual intro, has ambiguous portion/add-on status, or fulfillment is theatrical rather than true. |

### Primary reference URLs

- SVG mask techniques: https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/
- Shader reveal: https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/
- Photo-based image sequence: https://tympanus.net/codrops/2026/08/07/the-department-is-open-building-the-px-push-website/
- Trionn sequence engineering: https://tympanus.net/codrops/2026/07/15/the-architecture-behind-trionn-coordinating-gsap-three-js-lenis-and-web-audio/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Food photography: https://www.adobe.com/au/creativecloud/photography/discover/food-photography.html
- IA test: https://www.nngroup.com/articles/tree-testing/
- Online food ordering UX: https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026
- Reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion
- Web Vitals: https://web.dev/articles/vitals
- Layout stability for images: https://web.dev/articles/optimize-cls/

## 3. Image capture bible — initial study shot plan

**This is a research capture protocol, not an approved styling brief.** Choose 3 *currently available and verified* items representing different food forms, preferably one regular portion and one signature product. Photograph the normally served item; if cutting one changes the served state, create a second portion solely for the research comparison and label it clearly.

| Shot | Question answered | Evidence constraint | Candidate output |
|---|---|---|---|
| **Whole / context** | What am I ordering? | Normal plate/wrapper, actual portion | Static documentary still |
| **Cut / inside** | What's in it and how is it layered? | Real cut and authentic ingredients | Two-frame comparison or still pair |
| **Held / scale** | How big and portable is it? | Real hand/normal portion; same camera distance if comparing | Scale-reference photo |
| **Assembly / form** | What is the meal physically made from? | Film real workflow; no staged fictional stages | Raw micro-film, later optional sequence |
| **Wrapper / open** | What do I receive, and how do I use it? | True packaging material, honest takeaway condition | Physical/digital continuity study |

**Technical capture guidance:** same lens/exposure/white balance in a pair; diffuse side/back illumination where it helps texture; avoid fluorescent color cast; lock framing; record exact item name, form, date, physical dimensions, ingredients and authorized image-use rights. Capture photo and short video separately rather than overcommitting to 3D or animation.

## 4. The REAL comparison: five implementations against one research question

**Study question:** Does presenting a genuine food interior make customers understand what they are ordering more accurately and with less hesitation?

| Method | What it can communicate | Engineering complexity | Estimated mobile cost (relative) | Fallback | Decision |
|---|---|---|---|---|---|
| A. Static full/cut images | Accurate texture and portion comparison | Low | Low after optimization | Native images with real captions | **Baseline mandatory** |
| B. Tap-to-compare two stills | User-controlled reveal | Low/medium | Low | Two visible stills | **First interactive candidate** |
| C. SVG mask + short GSAP timeline | Directed reveal in campaign/editorial context | Medium | Moderate; implementation-dependent | Two stills if reduced motion | **Experiment; not approved** |
| D. Real-image sequence | Actual change in viewing angle/action | Medium/high capture + development | Can be high if many frames | Poster still / short opt-in video | **Conditional only** |
| E. Three.js/WebGL shader | Complex spatial blend/distortion | High | GPU/CPU cost; device-sensitive | Static picture | **Defer until a specific unsolved need** |

We haven't benchmarked these on a running prototype. Cost and complexity are qualitative engineering expectations, not measured Tuscanini numbers. The list **does not** prescribe a progression in which each later method is “better.”

### Acceptance gates for prototype stage (future)

**Understanding:** Can participants correctly report basic ingredients, portion characteristics and differences without misleading guesses?  
**Control:** Can users skip any animated reveal and reach an item directly? Is the media never a precondition of ordering?  
**Truth:** Does the displayed portion match a normal prepared order? Real specs/conditions are visible.  
**Accessibility:** Works on touch + keyboard; reduced-motion setting removes optional zoom/scrub; imagery remains meaningful without motion.  
**Performance:** Assess *field/lab* LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 as Google “good” thresholds; these are **future production targets**, not audit results. Art-directed responsive images must reserve layout space.

## 5. Product architecture laboratory: test 3 text-only trees (no UI)

**Catalog caveat:** The legacy `lib/mock-data.ts` includes category and name combinations; it is not a current verified menu. “Same label” ≠ “same recipe.” Do not pre-populate calorie/allergen information or make new option availability claims.

**Candidate Tree A — FORM:**

```text
Start
├─ Crepe
│  ├─ Chicken / meat / mix
│  └─ Tuscanini signature
├─ Pizza
│  ├─ Chicken / meat / mix
│  └─ Tuscanini signature
├─ Pasta
├─ Sandwiches
├─ Sides / Dessert / Drinks
├─ Offers
└─ Find exact item by name
```

**Candidate Tree B — NAME / KNOWN ITEM:**

```text
Start
├─ Search exact name
│  └─ If multiple valid forms: show the real form variants and distinct recipes
├─ Food type
├─ Flavor / ingredients (validated tags only)
├─ Offers
└─ Sides / Dessert / Drinks
```

**Candidate Tree C — FLAVOR:**

```text
Start
├─ Chicken styles (only genuinely comparable recipes)
├─ Meat styles
├─ Cheese / mixed
├─ Hot / mild (only validated spice level)
├─ Dessert
├─ Offers
└─ Find exact item by name
```

### Tasks (do not announce which hierarchy is hypothesized to be best)

1. “You know the name `تشيكن فاير`; find the *crepe* version.”
2. “Find the *pizza* item called `دوز كباب`.”
3. “Find a product with a chicken filling but not a pizza.”
4. “You came from a football promotion; find the *specific* offer and conditions.”
5. “Find the extras and total price of a crepe without finishing an order.”
6. “You're ordering again; find an exact known item as directly as possible.”

Use **currently verified** labels and products in a real study; the above are placeholders from historical data. Let participants sort and name items first, then test the candidate trees. Capture first choice, wrong location, backtracks, final answer and participant explanation. If 5–8 participants are used for an exploratory moderated session, results remain qualitative, not percentage-based proof.

### Internal review — not a claimed user test

- Tree A gives a direct route to forms but repeats many labels and can hide exact-name selection in deep categories.
- Tree B supports name-driven repeat customers but needs precise entity disambiguation when a name is used for more than one actual recipe.
- Tree C could be expressive but rests on the largest unknown: are the flavor groups real, and do customers think that way?

**Provisional product decision:** Keep *direct exact-name search* and *form finding* as necessary candidate routes; don't force flavor-first discovery. Final IA waits for real menu and testing.

## 6. Cross-lane anti-repetition contract (borrowed from HILTECH but not its visual style)

| Lane | Its unique job | Maximum tolerable creative intrusion |
|---|---|---|
| Brand / first encounter | Establish why Tuscanini exists and what food experience it stands for | May be rich if optional/skip-friendly |
| Product discovery | Explain product differences with true ingredients/photos and cross-links | Short, information-led enhancements |
| Known item / cart / checkout | Correct choice, quantity, price, address, totals | Near zero; no forced scene transition |
| Offers | Exact promotion conditions, eligibility and date | Brand tone allowed but terms always clear |
| Status | True system events (received ≠ confirmed ≠ preparing) | Literal, calm |
| Packaging / handoff | Physical instructions, identity, trust | Must correspond to real package and workflow |

**Failure condition:** The whole website becomes the same image mask + black/red headline repeated six times. One grammar can have different expressions. Same workflow, different creative answer.

## 7. What is *actually* decided today

1. **KEEP:** Authentic restaurant photography as the *primary evidence* and foundation for early visual tests.
2. **TEST FIRST:** Static still pair vs user-controlled photo compare. Only then a short SVG/GSAP editorial reveal if it answers a distinct question.
3. **HOLD:** Multi-frame production and shader/WebGL effects until they have content and purpose; no decorative dependency.
4. **KEEP OPEN:** Form × Flavor as a catalog question, not a brand thesis or a confirmed recipe model.
5. **HOLD:** Packaging/handoff as a physical-world lens until photographed and observed.
6. **REQUIRE:** Fast, direct order paths are distinct from immersive discovery; motion isn't a gate.
7. **DO NOT LOCK:** Brand palette, typography, global layout, logo, hero, motion system, or website architecture.

## 8. Next work package — PASS 06 / CREATIVE SYNTHESIS PREP

A. **Evidence-to-thesis test:** Can a concept generate *distinct* original expressions for brand arrival, ingredient discovery, offers, packaging, and ordinary checkout without repeating a gimmick? Compare the “reveal,” “material handoff” and “flavor relationships” sources for *generative range*, not visual taste.

B. **Evidence audit:** Gather current menu and three genuine physical servings before claiming an ingredient/portion-driven site identity. The user has not been asked to do this now; the items are an honest future dependency.

C. **Art-direction research brief:** Find several proven food-brand systems and trace one formal motif through print/packaging/photo/digital, recording agency rationale, not just screenshot aesthetics.

D. **Concept approval gate:** Choose a *working thesis* for editorial explorations only when it explains genuine restaurant reality and has falsifiable rejection criteria. Do not treat a digital prototype as proof of customer behavior.

**Preservation:** No changes have been made to the original Tuscanini GitHub repo or deployed website. This document is an independent research artifact.