# TUSCANINI REBIRTH — HANDOFF TO NEXT CHAT (2026-10-18, ~20:31 Egypt)

> **LATEST STATUS UPDATE (after original handoff, 2026-10-18):** Read `docs/rebirth/08_MOTION_RND_AND_VISUAL_QA_PASS_04.md` before acting on the old outstanding-actions section below. Bridge CSS, renamed-heading QA, and the 320/390/768/1440 browser sweep were already done before this chat. Pass 04 then added one native photo motion trial, corrected the material slider knob clipping at both extremes, and verified a 26-PNG browser artifact / zero-failure Chromium run: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39155495058 . PR #59 remains Draft. Work is DESIGN IN PROGRESS, not launch-ready.

## Read first
This is a continuity memo, NOT a completed-feature claim. The user asked to continue creatively developing Tuscanini's real restaurant website, not to rush publishing or maximize page count. The conversation hit its context limit. **Continue execution from this branch without repeating initial research.**

### Exact GitHub
- Repo: https://github.com/omarkhair70-droid/tuscanini-ordering-system
- Working branch: `redesign/tuscanini-authored-experience-20261018`
- Draft PR: https://github.com/omarkhair70-droid/tuscanini-ordering-system/pull/59
- At handoff fetched head: `7b7549c0325d2041a4939eaf2f4d7f68f3b16a4e` (may move).
- Main/production MUST remain unchanged: no merge/deploy without completed integrated review.
- Original old HTML prototype: `docs/rebirth/archive/WEBSITE_EXPERIENCE_HTML_REFERENCE.html`
- Primary research: `docs/rebirth/00_START_HERE.md`, `01_RESEARCH_MEMORY.md`, `02_CREATIVE_AND_MEDIA_SYSTEM.md`, `03_ENGINEERING_AND_QA.md`, `04_BUILD_SEQUENCE_AND_DECISIONS.md`, `05_CREATIVE_PRODUCTION_01.md`, `06_HTML_VISUAL_TRANSLATION_PASS_02.md`, and archived full research under `docs/rebirth/archive/`.
- Latest confirmed FULL GREEN browser evidence **BEFORE the last in-progress editorial refactor**: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39143436191 ; corresponding `docs/rebirth/QA_2026-10-18_STORY_PASS_02.md`. This validated original JPEGs, moving ticker, genuine packaging image loaded (real decoded pixels) and QA at 320/390/768/1440; 22 screenshots; NOT real restaurant E2E.

### User creative intent — crucial
Tuscanini was the user's FIRST website months ago. They have since advanced their workflow considerably (HILTECH site, portfolios, detailed research-first product building). The old repo isn't a creative specification, only tested contracts potentially worth retaining. **A clean, distinctive whole-site experience grows from research → art direction → media treatment → typography/composition → meaningful interaction/motion → technological choice.**
The stand-alone HTML research prototype felt far more designed than an early Next rewrite; user brought screenshots demonstrating varied chapter identities: dark layered food collage hero, animated yellow brand strip, cream asymmetric documentary photo wall, bold red real packaging/photo chapter, full yellow typographic Beni Suef place chapter. These screenshots are benchmark, NOT instructions to clone HTML.
Twelve actual restaurant 640x640 JPEGs are committed at `public/images/rebirth/food-01.jpg` through `food-12.jpg`, manifested in `lib/rebirth/food-media.ts`. Do not hallucinate toppings, fake ingredient cutouts, or assign a specific image to named menu item without confirmation. Rough automatic image cutout was REJECTED for poor edges.
Do NOT equate green CI, coded routes, or total page count with creative completion. Work on continuous chapter rhythm and meaningful composition first. GSAP/ScrollTrigger/SVG/Three/WebGL not banned but must be selected from content/interaction need and performance evidence—not prestige. Honor mobile, reduced motion, RTL and direct ordering. The user wants ongoing execution and visual QA, not premature aesthetic signoff on half-built screens.

### Current creative app implementation
- `components/home/rebirth-home.tsx` real Home route; `app/page.tsx` imports `rebirth-home.css`, `rebirth-exploration.css`, `rebirth-creative.css`, `rebirth-story-rhythm.css`.
- Hero: visually layered TSC-06 human and TSC-09 full crepes, large Arabic typography and obvious /menu link.
- `components/rebirth/food-exploration.tsx`: four real-food discovery family tabs and opening 12-photo modal. Asymmetric triptych TSC-01,04,10.
- `components/rebirth/material-reveal.tsx`: ONE real TSC-02 source as whole and enlarged macro; accessible reversible native range/clip-path; direct /menu link.
- `components/rebirth/physical-chapters.tsx`: real TSC-08 food+red branded packaging chapter; bold yellow confirmed Beni Suef place chapter.
- Yellow ticker is ACTUALLY animated two repeated sets in default motion and still for prefers-reduced-motion.
- Functional site routes and commerce shell also on branch but NOT fully art-directed or end-to-end production verified: Menu, Cart, Tracking, Offers, Food Finder. Others and admin still legacy; atomic DB order/idempotency, staff auth and security audits unfinished.

### Exact CURRENT IN-PROGRESS last edits — IMPORTANT (unverified by CI)
After user asked "هتكمل" at ~19:27 and instructed Home creative edit/reduction:
1. **Removed** redundant `t-intro` from Home (over-repeated "الحكاية مش بس من بره") and generic long `t-quick` CTA chapter (direct /menu CTA remains in Hero/Explore/Material/Packaging).
   - Commit `56d4e0ce902f2fed09d01ce236bb2e1e1514b89b`.
2. Rewrote `components/rebirth/material-reveal.tsx`: title from "من بعيد من جوه" to "قرّب بنفسك"; shorter copy; replaced overly huge `t-material__after` section with a concise `t-material__bridge t-shell` that links to /menu.
   - Commit `14691b677a5bd9672847e4aabed6caddae952e34`.
3. Rewrote `components/rebirth/physical-chapters.tsx`: red chapter title now "العلبة ليها شكل" and yellow locality title "تلاقينا في بني سويف", adjusted chapter indices/text.
   - Commit `081db91525bf74e6951eba09b44b1461a90c4224`.
4. Rewrote `components/rebirth/food-exploration.tsx` subcopy/index to be customer-facing, no lab jargon.
   - Commit `a550de7fb537d64fceae040d46615954bcf11305`.
**These four changes have NOT YET been QA verified. Most urgent next action: add styles for `.t-material__bridge`, update/fix stale CSS/test assertions and review actual screenshots before celebrating.** The older CSS still includes styles for removed `.t-material__after` and `.t-intro`/`.t-quick`, harmless but should be cleaned after verification. The old `scripts/qa/rebirth-interaction-check.mjs` contains `getByRole('heading',{name:/العلبة كمان/})` and `/الحكاية.*في بني.*سويف/` assertions which MUST be updated to the new headings, otherwise fresh QA will fail for outdated expectations! Also the Home hero link `#t-main-story` now jumps to FoodExploration, so verify correct heading/landmark semantics.

### Immediate next work: do, don't just propose
1. Fetch latest GitHub branch/PR head and read affected files.
2. Style the new material bridge as editorial yet compact; choose whether smaller sections should preserve varied texture without repeated mega headlines.
3. Update QA expected strings for renamed physical chapter headings and add meaningful measurement/assertions: Home chapter count, genuine main/Menu path, typography/clipping/overflow at 320,390,768,1440, image loads.
4. Execute/review GitHub Actions logs and **actual uploaded screenshots**. Mark clearly if running, failed, passed, and visually weak.
5. Refine based on screenshots. Decide after content reduction whether staged CSS/WAAPI transition is enough or a coordinated GSAP scroll timeline genuinely adds meaning. Don't introduce libraries without an actual scene-driven test.
6. Log findings in `docs/rebirth/` and keep PR #59 Draft / Main untouched.
7. Then deepen real photo production and creative language across Menu/Offers and rest of site, while retaining truthful ordering semantics.

### Communication
User speaks colloquial Egyptian Arabic, addresses assistant as "يا فنان/يسطا"; be engaged but avoid repetitive shallow status updates. Answer with real GitHub actions and evidence. Don't solicit premature final approval or refer to production as imminent. The user is especially annoyed if an assistant forgets prior rigorous reference/research method or treats a functional site shell as a finished designed website.
