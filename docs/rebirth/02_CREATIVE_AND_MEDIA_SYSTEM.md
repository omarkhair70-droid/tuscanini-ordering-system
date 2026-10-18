# TUSCANINI / CREATIVE CONSTITUTION + MEDIA BIBLE
Working creative system V02, derived from the owner's Oct 2026 12-photo set and `TUSCANINI_WEBSITE_EXPERIENCE_V01.html`; subject to integrated preview review.

## What makes the project distinctive
A **real fast-casual restaurant in Beni Suef**: staff, handmade/filled food, branded red packaging, local football-related promotions, bold two-language logo uses, human-scale presentation. Not an imaginary Tuscan trattoria or a copy of an awarded pizza site.

### Creative tension: contained / abundant
Inside / Out is an exploratory *generative engine*:
- Exterior vs interior; whole vs cut; wrapper vs what it actually contains.
- Quiet wide framing vs tactile dense genuine food; macro vs human context.
- Text and space can be big, but order tools must remain compact and calm.
- A signature motion should be one expression of the idea, NOT a mask animation repeated on every screen or an official public slogan by default.
- **Anti-repetition:** each route has an independent visual job; gallery images on Home, precise item photographs on Menu, energetic but legible art for Offers, calm literal status and checkout, readable utilitarian operator UI.

### Color trials, inherited from the COMPASS (not from legacy styles)
| Token | Hex | Job |
|---|---|---|
| Ink | `#171511` | anchor/high-contrast dark panel |
| Paper | `#FFF8E8` | bright background / breathing room |
| Cream | `#F4E9D4` | editorial warmth/alternating scenes |
| Chili | `#D92E24` | expressive emphasis, never whole UI default |
| Corn | `#F5CD4E` | sharp contrast/promotions, accessible control highlights only after contrast QA |

Use CSS variables/design tokens, not copy-pasted colors. Palette is an **experiment tested in HTML**, not legally approved current identity. Existing Facebook red/black logos are evidence, not mandatory redesign rules. Avoid making every surface red.

### Type specification: roles before font choice
- Arabic **Changa** (display, heavy weight) on campaigns, Hero and oversized chapter title; test glyph spacing and 320px wrap, don't lock until screenshots.
- Arabic **IBM Plex Sans Arabic** for item titles, prices, errors, navigation and body, clear at 14–18px; test Egyptian colloquial text.
- Latin **Anton** for small oversized branded editorial markers, not a replacement for the restaurant's official wordmark or the commerce UI.
- True RTL for primary reading, isolate Latin/number elements with `dir` correctly. Preserve glyph clarity; don't force extreme negative letter-spacing on Arabic.
- Load/fallback strategy tested on low bandwidth; do not ship files from unknown license or leak proprietary fonts.

### Imagery: the REAL 12-image library (photo IDs mapped to supplied 640x640 files)
| ID | Source visual | Best current role | Crop / treatment |
|---|---|---|---|
| 01 | crepe pile with in-shop Tuscanini wall logo | brand context | preserve real setting, not giant stretched full-bleed |
| 02 | single opened crepe in staff hand, black branded polo | cross-section food proof | transparent/cropped only if contour is clean |
| 03 | pizza in real printed Tuscanini box | pizza + package story | keep box context |
| 04 | opened crepe, sausage/meat content in gloved hand | editorial detail | true filling only |
| 05 | assorted sliced/opened crepes held together | variety | natural multi-product crop |
| 06 | person presenting multiple crepes | human-to-food scale | retain person/hand context |
| 07 | three exposed crepes stacked | cross-section rhythm | macro editorial inset |
| 08 | two filled long-bread sandwiches + red Tuscanini packages | sandwich/brand physical | full context/medium crop |
| 09 | three stacked opened crepes near lens with person behind | food macro hero candidate | controlled size |
| 10 | whole round topped pizza top-down | category/profile | whole pizza visible, don't invent topping count |
| 11 | loaded bowl/round base with bright yellow sauce + packages | other dishes/sauces | preserve real sauce/context |
| 12 | bunch of open crepes held by staff | variety/abundance | group editorial composition |

**FACT:** source JPEGs 640 × 640, low resolution with social compression. Bounded display/cropping necessary. This is NOT a full live menu photo catalog, do NOT map an image to a specific named/sized product unless verified.
**PIPELINE:** RAW original preserved privately → optimized WebP/AVIF derivatives → only selective non-generative clean-up and accurate masking → color/edge QA → responsive sizes/alt → category assignment with `photo-confirmed` vs `family-only` flags. Keep source filename, photo ID and credits/origin metadata. No fabricated cheese, portion size, sauces or packet. Do not treat cut-out AI hallucinations as factual food images.

### Formal hierarchy in completed website
- **Home:** editorial identity + a genuine food photo with clear path to Menu; grouped story chapters, no fake prices or rotating slideshow-by-default.
- **Menu:** category views from REAL dataset, search, correct sizes/add-ons & current availability, accurate fallbacks; photography in service of picking the right food.
- **Product:** genuine ingredient and size info; optional reveal only when real comparison exists.
- **Offers:** clear terms/time and eligibility on landing/deep link, imagery secondary to transactional truth.
- **Food Finder:** meaningful questions and outputs backed by real products; no pseudo-personalization.
- **Cart/checkout:** lean forms, keyboard and touch; don't make users watch elaborate motion.
- **Tracking:** literal states; signed/verified order identity, no pretend step animation.
- **Story:** restaurant community, four-friends copy as **unconfirmed** narrative pending validation, real people/space if material authorized.
- **Contact/reviews/complaints:** utilitarian clarity, support and accessible error states.
- **Admin/kitchen:** functional operator family, high-density clear lists and status controls, distinct from showy public editorial.

### Motion vocabulary
- In the **public editorial**: deliberate revealed material, restrained typography stagger, crop/scale/scroll when it offers meaning. Avoid 371 frames, excessive blur or forced scrolling just because a reference used those techniques.
- In **product browsing**: one reversible useful interaction, not hover-only details or scroll pinning to choose food.
- In **checkout and operations**: near-zero decoration; feedback animation shows actual successful state.
- Mandatory fallbacks: reduced motion, pointer & keyboard parity, orientation/layout transitions, touch performance, no forced audio.
- **Stack candidate:** CSS + Web Animations API for simple things, SVG clipping for factual reveal, GSAP/ScrollTrigger only for demonstrably complex coordinated sequences. Add Three.js, PixiJS or Rive ONLY after specific browser-tested need. Don't transplant HILTECH's/WebGL tech for prestige.

### Production disciplines
- Compare desktop/mobile screenshots (1440,1024,768,390,320) against the approved integrated HTML **feel** and the actual content.
- Art direction must outlive missing product photos; editorial photos at family level are separate from item-level truth.
- Strong look ≠ award-winning copy; reference only mechanisms, not layouts, colors, slogans, mascot systems or prebuilt templates.
- A new reference search is warranted when testing reveals a specific missing method or need; cite original designer/engineer where possible and log implementation takeaways.

### Prototype-to-production gap identified (must close)
Prototype had strong dark Hero, typographic scale, actual 12-photo library, category switching, functional exploratory side sheet, gallery and authentic packaging context. The first Next branch lost media assets and reduced interactions to static links. These are outstanding **regressions**, not accepted scope cuts. Closing the gap requires bringing the interaction *roles* into React correctly—no need to copy raw prototype JS or simulate the checkout.

Reference source: `TUSCANINI_WEBSITE_EXPERIENCE_V01.html` (independent research artifact shared in conversation), and `TUSCANINI_VISUAL_CONSTITUTION_V01.md`. Source files are not currently Git committed; the repo documents their identity and evidence.
