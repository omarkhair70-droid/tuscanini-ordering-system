# TUSCANINI — LAB 06A / FINDINGS
**Date:** 2026-10-18  
**Status:** Three visual treatments completed; visual research only, not an approved identity or live website.  
**Output:** `TUSCANINI_LAB_06A.html` (self-contained, interactive).  
**Input:** One crop from the user's Facebook photo-gallery screenshot; cropped from an actual restaurant post thumbnail. The source is only 308 × 330 px; no food contents were changed or artificially generated.

## Studies produced

| Study | Research question | Implemented treatment | Honest finding |
|---|---|---|---|
| 01 — The Honest Still | Can food evidence work without art direction? | Source photo framed with documentary label, quiet layout, readable annotation | Provides a clear factual baseline; lacks detail/recipe/size because those data are absent; not appropriate as final full-size asset |
| 02 — Editorial Tension | Can Inside / Out generate a visually different rhythm? | High-density expressive display type contrasted against open space and one food photograph, with a secondary tight crop | There is formal range beyond a generic product card, but the current food photo is pixelated at this scale; the type/contrasts are sketches, not chosen brand codes |
| 03 — Controlled Detail | Can a person choose whether to inspect close detail? | Working, accessible HTML range slider compares original crop and magnified crop of *the same photo*, with presets and keyboard support | Interaction is technically viable without GSAP/Three.js; the magnified detail is lower quality, and no participant has demonstrated that it improves understanding |

## Authenticity / non-claims

- The picture is a single documented social-post image; it is **not** confirmed as a particular item, a normal portion, or a currently available menu product.
- There is **no** true sealed-vs-cut pair; the interface deliberately compares context vs zoom, not a fabricated before/after state.
- No mock ingredients, altered food, AI-generated portions, or fake 3D food assets were added.
- The working phrase `INSIDE / OUT` is an internal experimental thesis, NOT a proposed restaurant tagline or a proven owned position.
- All three studies have provisional test layouts/typography/colors. None are a final navigation, hero, palette, or brand system.

## Browser checks

- Rendered all three desktop studies at 1440 × 900 and mobile studies at 390 × 844 in a local Chromium browser.
- Checked page JavaScript errors (none observed) and horizontal document overflow (none observed).
- Tested comparison slider value changes (75%, 25%) and click-to-set buttons.
- Included native range keyboard control and `prefers-reduced-motion`; actual customer/user testing and real-device network performance are **not** completed.

## Critical verdict after the lab

1. Keep **real-food evidence** as a requirement.
2. Keep the **contrast idea** open for a targeted reference recheck, not a final lock.
3. Do not promote the photo-reveal interaction yet: better source imagery and user comprehension tests are required.
4. Do **not** derive all of Tuscanini's identity from generic stuffed food macro photos. A genuinely Tuscanini-specific ingredient, preparation, human action, local context, or material signature still needs discovery.
5. An art-directed brand introduction can coexist with a plain, fast product/checkout mode; do not use repeated visual grammar for every page.

## Next stage / targeted reference recheck

Examine four precise questions rather than re-running broad inspiration searches:

- How do food-led design studios build photographic rules across *actual packaging, typography, marketing and websites* without looking like fast-food ad templates?
- Which distinctive food and local place signals in **Beni Suef / this restaurant** are truly ownable and evidenced?
- How do Arabic and Latin display typographic systems convey density/contrast without sacrificing product clarity and legibility?
- For high-quality original food photographs, is context/detail interactivity useful beyond simply showing both shots side by side?

**Gate before typography / stack lock:** select a thesis capable of at least three genuinely different expressions, validate it against authentic higher-resolution restaurant photography, and define role-specific experience architecture. Then research candidate fonts/motion libraries/technical choices. Keep the first website unchanged.