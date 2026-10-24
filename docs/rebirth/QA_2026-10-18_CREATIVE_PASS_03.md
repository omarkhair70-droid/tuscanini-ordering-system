# TUSCANINI — CREATIVE PASS 03 / ACTUAL BROWSER QA
**Date:** 2026-10-18 • **Run:** https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39145333076
**Status:** automated quality gates PASS; full site and Home art direction still IN PROGRESS.

## Why this QA exists
Previous Pass 02 was vigorous but overly long and repetitive. This pass removed two large duplicate chapters, replaced the second jumbo reveal heading with an inline direct-menu bridge, and clarified restaurant-facing copy. These changes are intended to **make each scene distinct**, not merely make the page shorter.

## Actual checks passed
- GitHub Actions TypeScript and Next production build: PASS.
- Browser screenshot workflow: PASS; 22 route/viewport screenshots saved as artifact `tuscanini-mobile-desktop-visuals`.
- Chromium interaction checks at 320px, 390px, 768px, 1440px: PASS, including functioning ticker/default+reduced motion, 12 original food media files/gallery, photo comparison keyboard controls, actual photo decoding of packaging scene, no horizontal overflow and no uncaught JS errors; existing test-only checkout and tracking fixtures also passed.
- All duplicate-story removal checks passed: neither old intro, giant generic CTA nor redundant oversized detail-after scene renders; a restrained direct Menu link remains.

## Visual result from actual downloaded PNGs
- 390px before / after full-page screenshot heights:
  - Pass 02, after photo fix: **7150 px** (`home-390.png` in previous artifact).
  - Pass 03: **5694 px** (`home-390.png` in run above).
  - Reduction: **1456 px / ~20.4%**, without removing discoverable menu tabs, full photo gallery, reversible true-photo slider, branded red packaging image or yellow local chapter.
- 320px new full-page PNG: **5529 px**; 768px: **4557 px**; 1440px: **6567 px**. Do not compare cross-width height as if it were a responsive quality score.
- Reviewed phone and desktop screenshot contact sheets. The chapter sequence now reads:
  **dark human/food Hero → moving yellow ticker → concise food category selection → asymmetric real-photo story → dark interactive same-photo close-up → red packaging → yellow Beni Suef → footer.**
- The 390px view has an intentionally readable food-first first fold and keeps order actions reachable. Photography in red packaging chapter is present and not replaced by a blank color block.
- The original 640×640 photos still look soft at large crops. Do NOT claim visual imagery has been magically upscaled; better source photographs would improve the hero and macro chapter considerably.
- The red chapter retains high type contrast and Yellow locality is readable. Some typography is still oversized relative to small product photographs, so user/owner creative signoff is still required.

## Design choice
Don't auto-install GSAP/Three/WebGL merely because they exist: the now-shorter route contains no mandatory multi-step synchronised scroll sequence. CSS marquee plus native range is lightweight, tested with reduced motion and directly serves the narrative. An advanced motion library should be selected only after an interaction problem demands it, and after benchmarking touch/CPU performance on a real phone.

## Unfinished and next
- Test visual meaning with actual users/restaurant owner, not only screenshots.
- Re-examine category selection and card spacing at the exact 320px breakpoint on a physical device.
- Improve real restaurant photos only with faithful cropping/editing; obtain higher-resolution originals if possible.
- Consolidate layered route CSS into one authored component system once creative experiment is approved; this PR currently has base + exploration + creative + story rhythm sheets by design while experimenting.
- Evaluate Home-to-Menu continuity, then physical customer order route, without copying the Home's artistic treatment into a utilitarian checkout.
- Other public/operator routes and live merchant data reconciliation remain in progress. Main remains untouched and PR #59 stays Draft.
