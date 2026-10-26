# TUSCANINI / CREATIVE PRODUCTION 01 — THE REAL MATERIAL

**State:** integrated in the real Home route on Draft PR #59; requires real browser art-direction review. **Not a finished Home, final brand or production-ready site.**
**Date:** 2026-10-18

## Why we interrupted page production
The team spent months generating working web pages, but the implementation didn't embody the earlier deep research: authentic human-food-place relations, source-backed photography, the tension between exterior and dense interior, typography and interactions with *meaning*. A passing Next build or twenty browser screenshots was not a creative result. We now **stop extending the page list before testing a distinctive visual grammar in the running application**.

## The actual research question
Can a first-time visitor FEEL Tuscanini's scale, abundance and food material from a real, imperfect photo set WITHOUT:
1. falsely promising portions or hiding the order shortcut;
2. repeating the same giant crepe photo trick on every page;
3. inventing cutaway ingredients with AI or claiming unrelated photos depict the same product;
4. requiring a pinned-scroll WebGL theatrical effect;
5. copying award-site aesthetics rather than the research/engineering method?

## What was built on the real site
**Hero / spatial editorial composition**
- TSC-06 = human holding various real crepes; a smaller tilted documentary plate.
- TSC-09 = multiple real opened crepes; large dominant overlaid plate.
- The two photographs show **distinct photographed food**, NOT before-and-after of a single order.
- Expressive Arabic “بُصّ جُوَّه.” contrasted with bounded photo windows and purposeful source labels; immediate Menu link remains visible.
- Big type and physical overlap are formal equivalents of *contained vs abundant*. Not product packaging promises.

**Material chapter / tactile proof**
- TSC-02 = **the exact same genuine source pixels duplicated** once as whole, once zoomed, with 0–100 range controlling CSS `clip-path`.
- Native range supports pointer, touch and keyboard arrows/Home/End, with explicit label/value; reveal is fully user-controlled.
- Macro crop might be softened because source is only 640 px. This is a deliberate image limitation, not a cue to hallucinate sharp ingredient detail.
- Links to genuine Menu. Does not require motion/scroll to access order and price.

## Photo-production trials and rejection
A temporary segmentation of TSC-02 via OpenCV GrabCut and a manual polygon was produced privately from the original 640×640 photo. Both retained obvious fragments of shirt/background around the irregular food edge. **Rejected for production**. Those files are not committed and must not be mistaken for usable source assets. Revisit only if a genuinely clean, authentic, manually edited isolate is possible at the intended display size.
Only the untouched genuine restaurant image pixels ship in this experimental slice.

## Tech decision — evidence, not prestige
- Existing runtime: Next.js 16 / React 19 / TS.
- **Selected here:** next/image, CSS grid/overlap, native range input, `clip-path`, semantic accessible interactions, responsive CSS and reduced-motion support.
- **Not added yet:** GSAP, ScrollTrigger, Lenis, Three.js, PixiJS, WebGL, Rive, smooth-scrolling.
- Why: this experiment is a single bounded, user-controlled photo comparison; the browser implements it natively with no bespoke animation timeline. Complex synchronized multi-chapter sequencing could earn GSAP later, but must be justified by the experience and measured on midrange Android. Do not confuse tool sophistication with value.
- Relevant source for *alternative method*: Hiroki Watanabe, [SVG Mask Transitions on Scroll (Codrops, 2026-03-11)](https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/). Uses full-screen image blinds and scroll synchronization. We transfer the *principle* of a scene with information purpose, **not its full-screen mandatory scroll choreography**.
- Reference [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) for future responsive timeline/media-query experiment.

## How the research manifests in this build
| Research finding | Concrete site expression | How to falsify |
|---|---|---|
| INSIDE / OUT only a working thesis | full-size and macro view of same photo | if users don't understand anything better than still, retire interaction |
| Human scale | actual staff/food picture in separate brand plate | if the small 640px image is distorted or implies false portion scale, reduce/recompose |
| Two tempos | Menu shortcut visible in first view and after material chapter | if visitors must sit through motion to order, fail |
| No synthetic food | no new product silhouettes generated or substituted | reject any enhanced ingredient not in photo |
| Anti-repetition across screens | this one hero and one different comparison mechanism, not copied to cart | reject repeated mechanisms without new job |
| Low-resource imagery | bounded photo windows at source-appropriate sizes | if photographs become pixelated full-bleed, reduce scale or revisit assets |

## Motion grammar (to be decided by test, not a library list)
- **Material disclosure** is reversible and user-controlled.
- **Attention punctuation**: tiny hover or focus response, never a demand.
- **Physical space**: offset documentary plates give depth without faking 3D or making someone wait to scroll.
- **Service truth**: checkout/status UI deliberately stays literal and calm.

## Browser QA, acceptance, and next study
Targeted assertions added to `scripts/qa/rebirth-interaction-check.mjs`:
- 12 restaurant images available in documentary gallery;
- image compare is one labelled accessible range;
- End/Home changes actual comparison state via keyboard;
- duplicated images have identical source paths (no fictional before/after);
- 390px & 1440px Home horizontal-overflow and JavaScript-error checks remain;
- all routes still compile and server-backed checkout tests retain status truth.

**Owner has not approved the new direction yet.** Design cannot be “finished” until actual Home screenshots are inspected on 320/390/768/1440, material is visible and not overscaled, gallery and sliders work on touch and keyboard, links navigate, responsive layout is deliberate, and the sections form one coherent flow. Only then choose a harder motion system if its benefits are grounded.

## What comes NEXT (not a new generic lab)
1. Real GH Actions screenshots and browser interaction checks; record results and repair.
2. *Photographic system*: per-family real images, well-made crops and frame grammar; identify missing originals.
3. *Composition/typography*: decide Arabic display scale, rhythm and signed-off mobile line breaks in connected site.
4. *Motion R&D*: compare this reversible disclosure with one GSAP/SVG alternative only if a task calls for coordinated multiple stages. Record performance and clarity, reject if merely spectacle.
5. Expand coherent language beyond Home into Menu & Offers, preserving useful no-drama product ordering.
