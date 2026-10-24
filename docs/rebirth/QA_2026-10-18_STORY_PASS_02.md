# TUSCANINI / HTML VISUAL TRANSLATION — LIVE QA 02
18 October 2026 — Internal creative QA only, NO owner approval, NO production merge.

## Evidence and current result
Actual GitHub Actions Chromium workflow after image correction:
https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39143436191

- TypeScript and Next production build: **PASSED**.
- Genuine photo manifest gate: **PASSED**.
- Four-width (320,390,768,1440px) scripted interactions and overflow smoke: **PASSED**.
- Captured **22 full-page PNGs** (10 routes at 390 & 1440; Home extra 320 & 768). Source artifact on run: `tuscanini-mobile-desktop-visuals`.
- Ticker: repeated sequence; **actual** CSS infinite translation when normal motion is enabled at 390px; stopped when `prefers-reduced-motion: reduce`. Both checks **PASSED**.
- The red packaging chapter has a real photograph of Tuscanini red branded boxes and sandwiches, the yellow location chapter uses real confirmed branch wording; responsive source-loading and text presence checks **PASSED**.

## Real screenshot finding that caught an invisible failure
FIRST artifact after Pass 02:
https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39142986983

The left half of the RED packaging scene showed as a **blank brown-red block** on both desktop and phone screenshots. The existing test only checked an `img` existed in markup; screenshot capture wasn't reliably loading a below-fold lazy `next/image`. That made the intended creative scene fail, despite all code/CI checks turning green.

**Fix actually committed:** `loading="eager"` on the one compact real packaging JPEG, plus a new browser assertion of `img.complete && img.naturalWidth > 0` at all test sizes. Subsequent fully rendered screenshot confirms the actual food/packaging photo replaces the empty block. This illustrates why visual QA must observe rendered pixels, not only DOM nodes or build status.

## What screenshots now show (in the real Next site)
- **1440:** dark actual-food collage Hero → truly animated yellow brand ticker → cream typographic and photo-discovery chapters → asymmetrically offset photo triptych → dark actual-image-controlled macro reveal → split packaging image against bold red copy → compact fast-order path → full yellow Beni Suef place chapter → dark editorial footer.
- **390:** same chapter logic but reflowed. Two small photo-wall items followed by a wider whole pizza; red real food scene stacks above text instead of shrinking into two cramped half-columns; yellow place is full-width typography.
- The prototype's **varied composition rhythm** is emerging without copying its exact frames or falsely using cutouts of food.
- The user's photo-only HTML snapshots are inputs to the *design critique*, not finished UI specs; source authoring remains from research and real food, not screenshot cloning.

## Still clearly unfinished
- Serious **editorial reduction** needed: multiple giant headings invoke `الحكاية`, `مش`, `جوه` and `تفاصيل`; rhythm isn't better merely because more sections are present. Remove/refine repetitive copy and possibly whole chapters based on impact.
- Full-page height on 390px ~7150px, still too expansive for many repeat hungry ordering visitors; use real behavior tasks and shorter direct paths, not an arbitrary ideal number.
- Staff presence and physical branding remain underused beyond stills; source images are only 640px, some close crops visibly soft. No invented ingredients or fake sharper generated details.
- 320/768 screenshots are CI artifacts, but a physical phone's actual touch, font loading performance and scroll jank still require device QA.
- These screenshot checks are NOT authenticated checkout or admin verification, and the other seven public/operations routes still require deeper authored rebuilding.
- Neither motion library decision nor final logo/palette typography has owner signoff. WebGL/GSAP cannot be added as prestige dependencies.

**Next targeted creative research:** how to connect distinct chapter transitions while respecting direct ordering and low-resource original imagery; test a bounded timeline against CSS rather than restart generic awards search.

**Work stays Draft PR #59; Main unchanged.**
