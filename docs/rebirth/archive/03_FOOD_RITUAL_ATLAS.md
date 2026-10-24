# TUSCANINI — FOOD & RITUAL ATLAS / Research Pass 03

**Date:** 18 October 2026  
**Status:** RESEARCH / EXPLORATION — No creative thesis, layout, logo, styling or implementation stack approved.  
**Restaurant:** Tuscanini — شارع البحر، سور نادي توليب، بني سويف (user-confirmed).  
**Previous phase:** [TUSCANINI_RESEARCH_PASS_02.md](./TUSCANINI_RESEARCH_PASS_02.md)  
**Purpose:** Translate what *food and eating actually do* into testable possibilities for a distinctive digital experience. This is **not** a redesign audit or a UI proposal.

## 0. Project discipline

- The first Tuscanini website is an **archive and possible operational data source**, not the visual model to repair.
- New research must be tied to observed Tuscanini reality, the documented work of other studios, or user/chef studies. Mark hypotheses and missing evidence explicitly.
- Follow the HILTECH / Omar Khair practice: Reality → Brief → Reference Decomposition → Thesis → Experience Architecture → Visual/Motion Grammar → Experiments → Browser QA → Production. **The workflow repeats; the answer must not.**
- Every outside reference is coded as `Problem → Real material → Creative decision → Technique (if confirmed) → Transferable principle → What not to copy`.
- Create no screens just to fill a phase. No logo, palette, giant hero, 3D, or GSAP decision is locked.

## 1. Evidence ledger and reliability

| ID | Evidence | Status | What it supports | What it does **not** support |
|---|---|---|---|---|
| T-01 | User-supplied screenshot: Facebook profile/cover | Direct observation | Black/red English script wordmark; red Arabic avatar; public phrase «ملوك الكريب في بني سويف» | Current approved logo hierarchy or naming origin |
| T-02 | User-supplied screenshot: Facebook photo grid | Direct observation | Close shots of crepe/sandwich sections; pizza; sauce; staff-held food; red boxes; uniforms; sports promotion | Exact recipes, portion weights, whether staged images match ordinary orders |
| T-03 | User-confirmed restaurant location | Direct user evidence | Specific business identity (Tulip Club site) | Branch count, restaurant business data |
| T-04 | GitHub `omarkhair70-droid/tuscanini-ordering-system/lib/mock-data.ts` | Legacy data, **not authoritative live menu** | Food category taxonomy and candidate dish names to investigate | Current prices, sold status, portion ingredients, top sales |
| R-01 | &Walsh: Zooba (2019) | First-hand agency case study | Street-level Cairo field research translated into brand and Arabic lettering | An aesthetic to transplant into Beni Suef |
| R-02 | JKR: Burger King | First-hand agency case study + agency awards list | Cross-touchpoint food-driven identity | Any guaranteed impact for Tuscanini |
| R-03 | Sonat.Co: Gyros Factory | First-hand studio case study | Wrap paper, staff uniform, photography, film, web as one food-world | Greek motifs or invented mythology for Tuscanini |
| R-04 | Chipsa: Promeat + CSSDA 2025 WOTD | First-hand technical case study + independent award page | Editorial metaphor emerging from subject; WebGL performance trade-offs | Mandatory 3D or magazine look |
| R-05 | Baymard: Food Delivery/Takeout (Aug 2026) | UX benchmark | Reordering, customization explanation, wayfinding, fulfillment clarity | That creative landing experiences are unnecessary |
| A-01 | ACM TOCHI: Gayler et al. (2022) | Peer-reviewed systematic review + chef interviews | Food experience can be sensory, emotional, performative, social and temporal | Findings directly tested on Tuscanini |
| A-02 | IJHCS: Li et al. (2025) | Peer-reviewed qualitative study | Cultural meaning belongs in human-food experience | Exact Egyptian food-culture patterns |

**Research limit:** We have screenshots and project data, not a site visit, user interviews, kitchen footage, receipts, sales reports, or full item specifications. The source `mock-data.ts` is a *candidate menu list*, not a live sales database. Neither the claim «ملوك الكريب» nor the dominant social-media imagery proves which dishes generate the most revenue.

## 2. Key shift: from food categories to food events

A typical restaurant menu is organized by **what** is sold. For creative research we also ask **what physically happens** to the food, **what the customer does**, and **what changes between moments**.

### Nine raw gestures to investigate

1. **Fold / seal** — a flat material becomes a handheld form; may suggest transformation or layering if the physical process is authentic.
2. **Cut / reveal** — internal structure becomes visible. Photographic evidence of cut-open products exists in the Facebook grid.
3. **Hold / scale** — staff hands or fingers make portion scale legible. Staff-held food is visible; real customer grip remains unverified.
4. **Sauce / top** — final ingredients can be visually dynamic; do not assume real sauces behave like video-ad exaggerations.
5. **Stretch / separate** — cheese/sauce pull is a *possible* visual test for appropriate products, not a property observed in every item.
6. **Pack / carry** — branded containers support a material handoff from kitchen to customer. Boxes and uniform appear in the provided grid.
7. **Open / unwrap** — tactile action of making the product visible after receiving it; needs direct observation.
8. **Share / divide** — pizza and side dishes may enable group behavior; actual customer sharing needs evidence.
9. **Choose / return** — find an unfamiliar meal vs repeat a familiar meal; supported as distinct UX needs by Baymard's 2026 benchmark.

Don't treat these as animation commands. They are **research verbs** describing reality or questions to investigate.

## 3. Candidate food atlas — nine dish families

Food names below are drawn from the old code; **selection is for research contrast**, not a claim that they are top sellers or on the current menu.

| Family / legacy exemplar | Physical feature to verify | Possible lived moment / ritual | Creative experiment (not a screen spec) | Falsification / guardrail |
|---|---|---|---|---|
| Signature crepe — «تشيكن فاير» | Fold geometry, interior layers, heat/spice level (unverified) | First cut or reveal | Film a real served crepe as intact → cut → held; compare against static image for ingredient comprehension | Reject if picture exaggerates filling or customer prefers fast static info |
| Crunch/texture crepe — «دوز كرانشي» | Crispy ingredients or texture indicated only by name | Expectation of first bite | Test annotated real textures/sound against silent macro photography | Don't invent crunch, audio or ingredients without tasting/filming |
| Cheese crepe — «ميكس جبن» | Melt, viscosity, distribution (unverified) | Stretch or layer inspection | Macro photo series of real portion under consistent light | Never replace real portion with an enhanced CGI one |
| Pizza — «مارجريتا» | Circular composition, crust, slice count and sizing | Choosing whole vs slice/share | Compare top-down whole pie and low-angle crust/portion views for size clarity | Show actual diameter, cut and toppings; no forced interaction |
| Signature pizza — «توسكانيني تشيكن» | Relation to normal pizzas; signature differentiator not documented | Ordering a house recommendation | Compare a precise ingredient explanation with an editorial photo sequence | No invented 'special recipe' narrative |
| Pasta — «نجرسكو» | Container, heat, portion density, cream/cheese topping need confirmation | Unboxing/eating with utensil | Show real package-to-plate sequence and assess whether it communicates quantity & type | Don't imply serving plates/dine-in treatment when sold as takeaway |
| French-bread sandwich — «زينجر سوبريم» | Bread structure, cut, grip, distribution | Handheld bite | Analyze person/food scale, side profile and cut-open frame | No staged enormous sandwich or fake layering |
| Appetizers — «باكت كرانشي» | Portion pieces and sauce count | Group order or side dish | Test 'one order on a table' photo explaining count/scale better than single isolated piece | Sharing is a hypothesis; validate with customers |
| Sweet finish — «كريب نوتيلا» | Texture/temperature and syrup presentation | Dessert reward after main meal | Contrast simple product shot with pair-order narrative | Don't assume everyone orders dessert after savory |

**Important:** Even names like «فاير» and «كرانشي» aren't reliable ingredient/sensory specifications; they're prompts to inspect real food. The restaurant may have changed its menu since the code was written.

## 4. Ritual timeline — a continuum from desire to memory

This isn't the site's eventual route map. It's a lens to understand human and material events:

1. **Trigger:** Hunger / group plan / impulse after seeing an appetizing image. Which trigger is prevalent in Beni Suef? Unknown.
2. **Recognition:** Identifying Tuscanini among nearby options; how is the brand remembered?
3. **Discovery:** Customer chooses by category, known favorite, budget, flavor or picture.
4. **Decision:** Ingredient/size/toppings and true total must be understood.
5. **Commitment:** Order is placed; visible confirmation vs restaurant acceptance must be distinguished.
6. **Waiting:** Anticipation; meaningful information is more valuable than decorative waiting animation.
7. **Handoff:** Branded bag/box and staff/customer interaction; material condition and timing matter.
8. **Unwrap:** First reveal, scent, texture, first bite; actual process should be filmed and observed.
9. **Memory:** Repeat order, recommending a dish, photographing/sharing, complaint or review.

The digital product may touch only some stages, and should **not** pretend to control physical stages it doesn't operate.

## 5. Comparison principles from credible sources

### Zooba / &Walsh
- **Brief:** Rebuild a Cairo-founded Egyptian street-food restaurant brand for NYC expansion.
- **Field research:** Street-painted writing, foil/decorative tapes, tiles, layered posters, Arabic calligraphy.
- **Creative output:** Existing street vocabulary transformed into a modern system. An Egyptian calligrapher was part of the work.
- **Transfer to Tuscanini:** Visit Beni Suef/Tulip surroundings and document actual material culture, speech, signage, staff handwriting, containers; do **not** default to Cairo-street nostalgic motifs.
- **Source:** https://andwalsh.com/work/all/zooba/

### Burger King / JKR
- **Brief:** Make an established QSR identity visually match a more real/appetizing food promise.
- **Outputs:** Brand, type, packaging and restaurant touchpoints; agency documents extensive awards.
- **Transfer:** Derive image and typographic behavior from verified food attributes; typography can inherit warmth, weight, movement only if meaningful.
- **Avoid:** Copying retro Burger King geometry/palette or overstating sales results.
- **Sources:** https://www.jkrglobal.com/work/burger-king ; https://www.jkrglobal.com/llm

### Gyros Factory / Sonat.Co
- **Brief:** Build a street-food brand around an existing name and recipe.
- **Output:** Photography, film, brand, web, garment and wrap materials.
- **Transfer:** Treat the fold/wrapper/hand movement as physical experience and potential identity rhythm; experiment across package and digital media.
- **Avoid:** Transplanting Greek graphic mythology into an unrelated Egyptian restaurant.
- **Source:** https://sonat.co/gyros-factory

### Promeat / Chipsa
- **Brief:** Introduce a HoReCa meat brand, convey expertise without generic meat-brand tropes.
- **Creative jump:** Brand name suggested a glossy magazine; product presented as editorial subject.
- **Engineering:** Three.js/WebGL; optimization became essential after heavier 3D assets/scroll performance issues.
- **Transfer:** Allow a useful unusual metaphor *only after* observing authentic material; an unexpected connection is stronger than a standard industry template.
- **Avoid:** Assuming editorial or WebGL is the correct Tuscanini direction.
- **Sources:** https://chipsa.design/publications/pocemu-smesenie-raznyx-idei-daet-krutoi-rezultat-keis-promeat ; https://cssdesignawards.com/sites/promeat/47856/

### Human–Food Interaction research (research lens, not restaurant claims)
- Gayler, Sas & Kalnikaitė (2022): systematic review of 109 papers plus interviews with 18 chefs, presenting sensory, emotional, communicative, performative, temporal aspects as viable interaction-design lenses. https://doi.org/10.1145/3484439
- Li, Wang & Sun (2025): qualitative 21-person study on cultural expressions in food interaction, including pitfalls of homogeneity and weak culture sharing. https://www.sciencedirect.com/science/article/pii/S1071581925000874
- Transfer: investigate atmosphere, anticipation, gesture, memory and group context rather than reduce food to beauty shots.
- Caution: their study populations/food contexts differ from Tuscanini; they inspire **questions**, not factual claims about customers.

### Real-world ordering UX counterweight
- Baymard (2026): 8 benchmarked food delivery/takeout services; common problems include reordering, unclear customization, poor orientation and fulfillment details.
- Transfer: simultaneously prototype expressive discovery and an extremely short direct-order path; test with new and returning customers.
- Source: https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026

## 6. Four non-UI creative experiments to prototype next

Each experiment is *an observation or visual material test* first; it must not become a compulsory animation in the ordering path.

### E1 / The Cut
- Capture the same real crepe in three physical states: sealed, freshly cut, held facing camera.
- Same portion, real filling, documented lens/light/distance.
- Compare with another food item for which cutaway is inappropriate. This tests whether "reveal" is a universal grammar or only local to crepes.
- Outcome: a small 3-frame study, an ingredient-legibility assessment and rejection/approval notes.

### E2 / The Hand
- Photograph wrapped, served, and hand-held portions with a stable human scale; measure actual dimensions and note whether products are one-handed or two-handed.
- Outcome: proportion / scale rules without exaggerating the food.

### E3 / The Wrapper
- Document the physical transitions: pack, close, carry, open, reveal. Study what printed surface is actually encountered and for how long.
- Outcome: packaging-to-digital identity grammar ideas and a list of surfaces we can actually design.

### E4 / The Choice
- Ask 3–5 local volunteers (ideally customers) to choose the same meal using (A) a concise factual menu and (B) an exploratory food presentation.
- Track time, errors, understanding of size/add-ons, and preferences; don't claim statistical significance.
- Outcome: clarify where rich experience is useful and where direct ordering must win.

## 7. Draft constraints for next creative-thesis stage (NOT LOCKED)

- **Truth of materials:** real food never made to look more filled than the ordinary served portion.
- **Dual tempo:** slower expressive food discovery can coexist with immediate reorder / exact-item purchase.
- **Local specificity:** Beni Suef context must be observed, not invented from generic Egyptian clichés.
- **Physical consistency:** if a motif appears digitally, test whether it makes sense on actual wrapper/receipt/box/signage.
- **Category specificity:** pizza, crepe, pasta and a sweet crepe do different things. Don't force one animation grammar onto them.
- **Accessible and performant:** fast phone experience, reduced-motion, semantic product info, loading stability.
- **No template cloning:** award references supply *methods*, not screenshots to reproduce.

## 8. Next research gate — before creative direction

1. **Reality evidence:** confirm current menu (names, options, portions), obtain 6–10 clean photos/short unedited videos of real dishes; document one packaging order and one kitchen-to-handoff sequence.
2. **Food taxonomy:** map verified features and gestures of 8 representative products, using observations not product names.
3. **Visual culture recheck:** investigate independent editorial food photography, cookbook design, culinary macro cinema, packaging interaction and Beni Suef local signage against the actual evidence collected.
4. **Behavior tests:** new customer vs repeat customer; photos vs no photos; product understanding and checkout accuracy.
5. **Synthesis:** one ownable creative thesis, design principles, experimental motion grammar, only then information/experience architecture and production tech selection.

**Only eventual request to user/restaurant, when the evidence gate arrives:** Current menu and permission to photograph real food/packaging (or original media). Neither is required to continue desk research now.

## 9. Research continuation record

- This pass is complete as a **desk research and hypothesis artifact**, not completion of the field work, prototyping or brand thesis.
- The old code remains untouched; no git branch, commit, deployment or production change was made in this pass.
- Prior document: `TUSCANINI_RESEARCH_PASS_02.md`.