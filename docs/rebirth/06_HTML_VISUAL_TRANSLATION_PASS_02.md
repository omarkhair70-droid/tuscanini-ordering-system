# TUSCANINI / HTML → REAL SITE VISUAL TRANSLATION — PASS 02
Date: 18 October 2026 | Draft PR #59 | creative execution checkpoint (NOT an approved finished site)

## Why this pass exists
User shared **six screenshots from the actual local** `TUSCANINI_WEBSITE_EXPERIENCE_V01.html`: dark collage hero, cream typographic/image-wall chapters, a half-red half-food packaging scene, and a full-yellow place chapter. Comparing them with PR Home revealed a missing piece: **the original prototype wasn't powerful because of one effect; it was powerful through variation of scale, background, photographic function and section-specific visual rhythm**.

The benchmark file is archived in `docs/rebirth/archive/WEBSITE_EXPERIENCE_HTML_REFERENCE.html`.
Screenshots were observed in conversation (not treated as source photographs or shipped image assets).

### Visual comparison and production translation
| Prototype's evidence | What the actual React Home had | This pass |
|---|---|---|
| Different background tones create changing chapter tempo | Home became mostly ink and paper; black real-photo reveal was repeated | Introduced full red packaging split and yellow place chapter; each uses DIFFERENT evidence and typography |
| Animated-looking brand strip | Current ticker was actually static text, despite appearance | Built looping **two-copy marquee**; verifies real CSS animation under standard motion and stillness under reduced motion |
| Asymmetric real-food photo wall with offsets | Gallery preview had three uniform square thumbnails | Set asymmetric three-photo rhythm from genuine TSC-01 wall, TSC-04 crepe in hand and TSC-10 full pizza |
| Package/hand/brand visual relationship | Mostly explored product filling but not physical object | Added standalone real TSC-08 packaging + sandwich scene with dynamic-size typography |
| Full-yellow locality based on typography (no food image necessary) | Footer location was a short textual side note | Added yellow Beni Suef scene with real user-confirmed branch/location and direct Contact/Offers links |
| Hero storytelling | Layered real-product scene existed but captions overexplained the process | Rewrote "REAL NOT RENDERED" and lab commentary into user-facing restaurant language |
| Direct order flow | Already existed | Always keep immediate Menu action; no forced scroll sequence or animation gate |

## Production artifacts
- `components/rebirth/physical-chapters.tsx` — distinct branded packaging scene and local yellow scene.
- `components/home/rebirth-home.tsx` — integrated physical chapters and semantic looping ticker.
- `app/rebirth-story-rhythm.css` — original scene grammar, mobile variations, reduced-motion media query.
- `components/rebirth/food-exploration.tsx` — actual documentary triptych.
- `scripts/qa/rebirth-interaction-check.mjs` — checks actual motion (390px/default preference), no animation in reduced motion, true branded packaging picture and place chapter at 320/390/768/1440.

## Important creative limits
This is **NOT** a request to copy the HTML's exact section designs: the user consistently liked it as a benchmark, not the best possible design. The real site's content must be restaurant-facing, not self-referential "we use real photos" research narration.
- No automatic perfect AI cutout (bad 640px boundaries had been rejected in Pass 01).
- No inferred ingredient identity or real product name assigned to TSC-08/TSC-01/TSC-04.
- No invented location/business claims: location from user's known branch; hours, offers and menu stay contingent on live data.
- No assumption all sections need animation or high-intensity effects: commerce remains calm, photo wall simple hover, packaging static, yellow finale typographic. The animated ticker has an accessible reduced-motion alternative.
- No blanket 3D/GSAP integration without a scene-dependent, measured technical need.

## Acceptance checks now required
1. Green TypeScript + Next production build on the new branch.
2. Genuine screenshot artifact at widths 320, 390, 768, 1440. Compare typography, food crops and full yellow/red scenes, not just hero.
3. Check no horizontal overflow, no clipped Arabic headings, functional links and accessible motion settings, mobile performance (physical device still pending).
4. Verify the marquee **actually changes** with default motion; static screenshots alone cannot establish that.
5. If the whole site feels longer but not more meaningful, reduce chapters: don't preserve a scene simply because the prototype had it.
6. Future targeted reference search should study the precise problem encountered (e.g. scroll choreography of packaging-to-place), not restart broad award research.

## Next creative focus
- Reassess the combined Home rhythm after actual screenshots: count repeated messaging, normalize type scale, align content hierarchy and preserve short order path.
- Explore *one* content-grounded multi-scene choreographic transition only if the section joins warrant it; then decide whether GSAP earns inclusion over native CSS/WAAPI.
- Apply the learned language to live menu/gallery/offers without repeating the Homepage style in utilitarian checkout.
- Full integrated owner review stays **later**. This is an internal design build pass, not merge/release permission.
