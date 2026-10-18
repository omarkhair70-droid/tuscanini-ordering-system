# TUSCANINI / CREATIVE PRODUCTION 01 — BROWSER QA REVIEW

**Run:** https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39141036502
**Date:** 18 October 2026
**Status:** all automated gates passed; **creative direction still exploratory, not final or approved**.

## Actual execution (not inference)
- GitHub Actions TypeScript and Next.js Production Build: **passed**.
- Actual Chromium rendering and automated interactions: **passed**.
- Screenshot artifact `tuscanini-mobile-desktop-visuals`:
  - all 10 public routes at **390px & 1440px**;
  - additional Home at **320px & 768px**;
  - total **22 full-page screenshots**.
- Browser smoke across **320 / 390 / 768 / 1440**:
  - authentic restaurant Hero photo loads;
  - four food category switcher updates;
  - documentary gallery opens/closes and contains **12 genuine sources**;
  - one accessible range for source-authentic whole/detail reveal;
  - keyboard Home/End changes its state;
  - both whole/detail image URLs refer to **exactly the same TSC-02 photograph**;
  - no meaningful horizontal overflow on Home, Menu, Cart, Tracking;
  - no uncaught Home JavaScript errors;
  - safe no-live-data Menu state;
  - empty cart cannot be submitted;
  - no fake order confirmation from bare tracking URL;
  - fixture-only checkout validation and single refused POST preserve the cart;
  - fixture-only pending → preparing state changes ONLY when server status changes;
  - strict media gate **12/12** passes.

## Visual critique from opened artifact PNGs
1. **Desktop at 1440:** the two-photo collage is genuinely different from the previous plain single panel. Dark field, offset paper windows, direct display type and one bright CTA create a coherent first fold. The backplate frames staff presence while the front frame carries tangible crepe detail. Image edges remain authentic rectangles, not rough bogus transparent PNG.
2. **Mobile 390/320:** native Arabic titles are now better without extra harakat; the editorial frames stack below the text, with Menu CTA reachable without any choreography. The fixed mobile order ribbon is visible and covers part of the photograph at some scroll positions; this is a deliberate functional tradeoff, **to be re-evaluated on a physical phone**.
3. **Tablet 768:** both photo frames, energetic scale and contrasting typography preserve the intended composition rather than collapsing into a generic one-column card. Background font/plate overlap deserves a closer art-direction review.
4. **Material chapter:** bounded real TSC-02 photographed whole vs macro section, within a yellow clip-path reveal, clear labels and slider; the blown-up 640px pixels are visible at large desktop crops. Avoid promoting this photograph to unbounded full-screen; a better high-resolution source would materially improve it.
5. **Homepage sequence:** real gallery and category tab roles are distinct from the material comparison. However repeated “inside” copy, extensive page length (~6k px mobile), and exact Changa/Anton font hierarchy remain open editorial questions. Stronger relationship to physical packaging and local personalities is still underexplored.

## Decisions made after QA
- Preserve hero photo spatial composition **as a study in the real app**, not a final approved brand.
- Remove oversized Arabic diacritics in hero/material headings for readability.
- Short native CSS entry for hero photographs, with fully static reduced-motion alternative. No scroll lock or fake progress.
- Add visible focus indication on comparison stage.
- DO NOT adopt the rough auto-isolated transparent image; shirt artifacts are unacceptable.
- DO NOT install GSAP / Lenis / WebGL / Three.js just to reproduce this clip-path slider. The creative question for an actual coordinated scene must be written first.

## Next creative checkpoint (not more page-count metrics)
- Decide whether this particular **same-image macro reveal** improves users' understanding of real food beyond a simple still. If not, remove it rather than defend it.
- Refine the photo production/crop system with honest bounded sources; candidate real packaging photos may yield distinctive chapter transitions.
- Improve typographic rhythm and avoid repeating the same Inside/Out slogan in too many different chapters.
- Design one **human → preparation → physical pack → food choice** narrative where each moment has distinct actual evidence; do not invent a preparation gesture.
- Then benchmark one meaningful GSAP/ScrollTrigger scene vs native clipping only if narrative demands precisely synchronized motion; test reduced motion and mobile CPU/time-to-menu.
- The public routes beyond Home and operations still need more work; do not confuse screenshot success with production-readiness.

**External design-tech sources (specific relevant lessons):**
- Hiroki Watanabe, Codrops SVG Mask Transitions on Scroll, 11 March 2026: https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/
- GSAP ScrollTrigger documentation: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

**Release gate remains CLOSED; old Main untouched.**

## Post-review mobile composition refinement — final green run
- GitHub run: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39141410291 — **success** (TypeScript/build, Chromium captures, four-viewport interactions, real-photo gate).
- Reviewed **actual captured 320px and 390px Hero screenshots**, not merely status icons.
- At 390px the header already exposes `اطلب دلوقتي`: removed the duplicate full-width sticky mobile order strip that obscured the food photograph; the food collage is now visible to its bottom edge.
- At 320px the header deliberately hides its order CTA due to width constraints: retained a **compact fixed order button** instead of a full-width bar; real product imagery remains mostly visible and fast ordering never requires scrolling through the chapter.
- Confirmed 768px and 1440px still use the authored photo-overlap and extra-wide Arabic composition; no meaningful horizontal overflow in scripted tests.
- **This is a tested exploratory creative slice** inside the real Next site, not an approved final Homepage. Next design checkpoint still needed before a full creative-system lock.
