# TUSCANINI / PASS 04 — NATIVE MOTION PROOF + REVEAL EDGE QA
Date: 2026-10-18. Working branch `redesign/tuscanini-authored-experience-20261018`, Draft PR #59. Internal QA only, no merge or visual sign-off.

## The reason: HTML's felt quality vs early Next translation
The archived one-file HTML read as a complete composed canvas: section identities, photograph hierarchy, motion and typography were visible immediately. Initial Next implementation kept much of the application structure but temporarily lost real photo loading and some interaction roles; these are **implementation regressions**, not technical limitations of Next/React. The stand-alone HTML never proved live menu truth, reliable checkout, operator permissions or actual database transactions. Rebuild should retain the visual authorship **and** earn those application properties.

## Source and actual last pre-pass checkpoint
- Historical reference: `docs/rebirth/archive/WEBSITE_EXPERIENCE_HTML_REFERENCE.html`. Reference for energy and composition, **not** a literal component translation.
- Earlier written handoff assumed `.t-material__bridge`, renamed headings and QA were outstanding. That assumption was stale: prior commits `1f6deedf`, `09b6a580`, `7b7549c` had already completed bridge styling, test text updates, and verified the 20.4% mobile length reduction.
- The branch's 390px Home was **5694px**, vs **7150px** before the editorial cut. Five purposeful Home story sections remain: discovery, photo archive, material reveal, packaging, place. This is a size measurement, not a declaration of creative completeness.
- Prior browser evidence (pre Pass 04): https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39150122198

## What we actually changed in Pass 04
1. Added one progressive native CSS `animation-timeline: view()` motion experiment on the *middle* authentic-photo archive image. It shifts only 16px vertically inside a small scale cushion, without hiding the actual photograph. No section pinning, synthetic food, huge parallax or blocking scroll. Browsers without scroll timeline support retain the static composition.
2. Kept a fully static image under `prefers-reduced-motion: reduce`. Tested presence of the native effect with normal motion and its absence in all reduced-motion browser viewports.
3. Audited focused actual-browser screenshots of the red packaging and dark material chapters. Found that keyboard Home/End put the range slider knob half outside the clipped image boundary.
4. Separated the decorative knob from the percentage-positioned dividing line. The accurate dividing line still reaches 0–100%; the knob itself is `clamp()`ed within 29px of stage edges. Keyboard, mouse/touch target and aria text remain the native HTML range.
5. Added browser assertions checking the knob is inside the visual stage at both **0% and 100%** at 320, 390, 768 and 1440. Added four **focused** viewport PNGs (Material/Packaging at 390/1440) with the slider in its neutral initial 52% position; kept the 22 existing full-page screenshots.

## Verified browser and CI evidence
- Final TypeScript/Next workflow: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39155495047 — PASS.
- Final Chromium + asset gate: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39155495058 — PASS, browser interaction smoke reported **zero failures**.
- Workflow screenshot artifact: `tuscanini-mobile-desktop-visuals`; **26 PNGs** (22 general route/viewports + four focused scenes).
- Assertions PASS at 320/390/768/1440 for actual restaurant photo loading, count of five Home scenes, no significant horizontal overflow, keyboard slider controls, slider knob containment at both extremes, red packaging scene and direct Menu routing. Default ticker animates at 390 and both it and the documentary effect stop for reduced motion. CSS view-timeline animation name verified in supported Chromium.
- Reviewed full-page and focused scene PNGs directly. Photo comparison now shows centered usable slider in neutral state, physically branded food packaging is present on phone and desktop, no duplicate giant intro is back.

## Judgment — do not prematurely escalate tools
This one photographic shift needs no GSAP, ScrollTrigger, WebGL or three.js. Keep CSS view timelines as a **small R&D experiment**, not a mandate across all sections. The animation-name and reduced-motion checks are automated; device-level jank, scroll-position interpolation and real-user perceptual value still need physical testing. If a future specific cross-scene choreography requires synchronization beyond native CSS, prototype and benchmark it before adding a package.

## Still incomplete
- Photographs are genuine but only 640x640; macro crops are visibly soft. Request better originals when feasible. No invented product-to-photo mapping.
- Home's energy is improved, but its total rhythm, the photographic and typographic hierarchy, and Menu/Offers/Story continuity are still design in progress. Neither green checks nor screenshot count proves award-level visual quality.
- Menu and Offers with no trusted live data intentionally do not fabricate prices or promotions. Richer narrative treatment must **not** compromise availability truth.
- Checkout/admin security, atomic order creation/idempotency, production DB connections and real restaurant E2E are not validated here.
- Target next creative work: Menu discovery photography and information architecture; About/physical restaurant story; compare near-real mobile scrolling, especially entry/exit of dark reveal → red packaging → yellow locality. Retain distinct utilitarian checkout/operations.
- No merge, deploy or Main mutation.

## Code / tests
- `app/rebirth-story-rhythm.css` — progressive documentary photo drift.
- `components/rebirth/material-reveal.tsx` and `app/rebirth-creative.css` — edge-safe range handle.
- `scripts/qa/rebirth-interaction-check.mjs` — viewport checks and focused screenshots.
