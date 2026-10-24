# TUSCANINI — MATERIAL → EXPERIENCE / RESEARCH PASS 04

**Date:** 18 October 2026  
**Status:** RESEARCH SYNTHESIS / TESTABLE PRINCIPLES. **No creative thesis or visual direction is locked.**  
**Location:** Tuscanini, Sur Nadi Tulip, Beni Suef, Egypt — user-confirmed.  
**Continuity:** [Research Pass 02](./TUSCANINI_RESEARCH_PASS_02.md) · [Food & Ritual Atlas 03](./TUSCANINI_FOOD_RITUAL_ATLAS_03.md)

> **Project rule**: Rebuild the *authored experience*, not the old website's appearance. Legacy code supplies historical business and taxonomy evidence only. Do not turn this work into an old-site defect audit. The workflow repeats; the answer must not.

## Executive finding: a previously hidden product grammar

Looking across Tuscanini's **legacy** `lib/mock-data.ts`, extracting records with `name` and `categorySlug` gives **113 parsed entries, 89 different product names, and 21 names that recur across multiple food-category slugs**. This is an extraction of a file's structure, **not 113 confirmed current menu items** and not a validated sales count.

Examples:

| Recurring product name | Legacy categories |
|---|---|
| تشيكن فاير | crepe-tuscanini · pizza-tuscanini · sandwiches-kaiser |
| دوز كباب | crepe-tuscanini · pizza-tuscanini · pasta |
| تشيكن رانش | crepe-tuscanini · pizza-tuscanini |
| تشيكن باربكيو | crepe-tuscanini · pizza-tuscanini |
| شاورما لحم | crepe-meat · pizza-meat · sandwiches-french |
| ميكس جبن | crepe-mixed · pizza-mixed |

**Research inference**: There may be two complementary choice axes: **FORM** (how food is carried, served and eaten: crepe, pizza, pasta, sandwich) and **FLAVOR / RECIPE IDENTITY** (named combinations such as Fire, Ranch, BBQ, Duz Kabab). The familiar menu tree privileges form, but real customers may start either from a desired form or from a remembered flavor.

**What this is NOT:** Proof that those recipes share exactly the same ingredients, that the names remain live in 2026, or that a grid/filter UI is needed. The correct next question is **how people *think* about ordering from this restaurant**.

**Potentially novel product proposition (unlocked, not approved):** *One recognizable flavor can travel across several food forms.* If verified, this could drive photography, product storytelling, information architecture, cross-navigation and meaningful transformation motion. If falsified, reject it.

## 1. New, targeted reference study — physical truth → design grammar

### R4-A — Heinz Dipper / Rethink · 2026 D&AD Graphite (Packaging)
- **Documented brief and intervention:** People struggle to dip fries in condiments while moving; team devised a fries carton with an integrated ketchup pocket. Its construction borrowed the brand's keystone geometry.
- **Transfer:** Start from a *real gesture + physical inconvenience*, not from a logo or animated mockup. A wrapper, sauce pack, tissue, or box may reveal a useful service or identity opportunity.
- **Don't copy:** The literal fold-out sauce-pocket structure. There is no evidence Tuscanini has the same problem.
- **Evidence:** https://www.dandad.org/work/d-ad-awards-archive/heinz-dipper · https://news.kraftheinzcompany.com/press-releases-details/2026/HEINZ-Unveils-the-First-Fry-Box-with-a-Built-In-Condiment-Compartment-in-Eleven-Countries-Across-the-Globe/default.aspx

### R4-B — Hellmann's / Design Bridge and Partners · 2026 agency case
- **Documented method:** A claim about improving real food ('Lifts It') becomes a visual system: custom type, photographic angles, motion, brand frame/window, packaging. The physical gesture of adding a dollop is made a coherent language across media.
- **Transfer:** If Tuscanini has a unique repeatable physical operation (fold, cross-section, package closure, preparing a signature combination), test translating that operation into composition and motion *across multiple touchpoints*.
- **Don't copy:** Hellmann's 'uplift', letterform, palette, or upward-motion metaphor.
- **Evidence:** https://creativepool.com/designbridge/projects/hellmanns-for-hellmanns ; see also https://www.designbridge.com/work/hellmanns for an agency-authored earlier positioning lens (distinguish versions).

### R4-C — Voice of Food / Dentsu, Ajinomoto · D&AD 2026 Graphite (Digital Experience)
- **Documented method:** For visually impaired home cooks, recipes were reconceived using real cooking sounds as practical cues, co-created with a blind cook.
- **Transfer:** In food experiences sound should carry **meaning and access**, not be an obligatory frying or crunch ambience. Optional captioned media, readable text, keyboard flow and equivalent non-audio cues are essential.
- **Don't copy:** A recipe assistant; Tuscanini is principally a restaurant commerce context, not accessible cookery instruction.
- **Evidence:** https://www.dandad.org/work/d-ad-awards-archive/voice-of-food

### R4-D — Don Bisho / MONARQ · Egyptian restaurant digital case (award status not established)
- **Documented studio claim:** A restaurant site organized as scroll-choreographed scenes and food transitions, while practical menu/reservation/order routes remain accessible. GSAP + ScrollTrigger, pinned scenes, parallax, layered dish moments.
- **Transfer:** Rich *discovery* and utility *ordering* can coexist with deliberate speed separation. A local Egyptian case is useful for constraints; it is not automatically a model of Beni Suef street food.
- **Don't copy:** Pinned scenes, location-branding, Italian trattoria atmosphere, or the notion that cinematic scroll is mandatory.
- **Evidence:** https://monarqeg.com/case-studies/don-bisho/

### R4-E — Human–Food Interaction / Gayler, Sas, Kalnikaitė · ACM TOCHI 2022
- **Documented method:** Review of 109 research papers and interviews with 18 chefs explores bodily, sensory, social, cultural and temporal qualities of eating.
- **Transfer:** Represent more than food hero imagery: intention, selection, preparation, anticipation, handoff, unwrapping, memory; investigate social and bodily gestures with actual people.
- **Don't claim:** Any human-food findings were tested at Tuscanini.
- **Evidence:** https://doi.org/10.1145/3484439

### R4-F — Baymard / Food Delivery & Takeout benchmark · August 2026
- **Documented benchmark:** Eight food delivery and takeout services assessed across 390+ research-based UX parameters. Common issues include repeat-order discovery, diet/customization clarity, wayfinding and fulfillment details.
- **Transfer:** User who knows exactly what they want should not be forced into an authored visual journey. Ensure product certainty, editability and truthful order confirmation.
- **Don't claim:** These problems occur at Tuscanini until we test.
- **Evidence:** https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026

### R4-G — Food portion size perception / Nelson, Atkinson & Darbyshire · British Journal of Nutrition 1994
- **Documented experiment:** 51 volunteers made 7,284 portion-size assessments using different food photographs, and estimates differed depending on the photo set and portion. The study predates modern ecommerce and doesn't test Tuscanini.
- **Transfer:** Hero shots are not necessarily enough to communicate portion size. Test **real scale references**, accurate serving-size data and multiple views rather than eye-catching closeups alone.
- **Evidence:** https://pubmed.ncbi.nlm.nih.gov/7826990/

## 2. Material-to-experience translation matrix — 7 hypotheses, not UI screens

Each translates a physical / behavioral question into a possible digital behavior, then into a verification condition. Techniques are examples **only** and no technology is approved yet.

| ID | Real-world material / question | Potential experience behavior | Possible media/engineering study | Evidence status | Kill switch |
|---|---|---|---|---|---|
| P1 FORM × FLAVOR | Are favorite names recognized across crepe/pizza/pasta? | Let discovery start from a remembered flavor *or* from chosen food form; preserve accurate item difference. | Product taxonomy graph; compact pairwise selection prototype; text-first fallback. | Legacy names confirmed; user behavior unknown. | Customers don't recognize shared flavors or recipes differ materially. |
| P2 REVEAL AS PROOF | Are ordinary served crepe sections distinctive and legible? | Ingredient reveal explains what actually comes inside, at the customer's request. | Real photo triptych; optional GSAP mask/Flip from *same* portion; alt text/accessible content. | Facebook cross-section photos present; ingredients unverified. | Motion adds time but no ingredient understanding. |
| P3 THE HUMAN SCALE | Can staff-held food communicate actual size honestly? | Size choice grounded in measurable proportions rather than only small/large labels. | One consistent photography rig; calibration object; actual dimensions and quantity. | Held-item photos observed; dimensions unknown. | Confusion increases or photos visually overstate portions. |
| P4 MATERIAL HANDOFF | Does packaging have a memorable gesture/structural property? | Brand meaning travels from preparation/wrapping to physical handoff and possibly digital confirmation. | Short unedited 5-action pack/unpack film; wrapper surface map; paper prototype. | Branded boxes visible; usage ritual unobserved. | Generic animation unrelated to genuine packaging. |
| P5 TWO TEMPOS | Do new and repeat customers pursue different immediate goals? | Expressive food discovery and fast known-order path remain independent but coherent. | Compare direct find/add/confirm against optional narrative discovery; timing and error measure. | Baymard industry evidence; Tuscanini-specific testing pending. | Discovery blocks or slows repeat orders. |
| P6 WAITING HAS TRUTH | Which order states are truly known by restaurant operation? | Anticipation comes from reliable order state, not fake kitchen theater. | State diagram tied to actual confirmation and fulfillment events. | Old project contains order status logic; restaurant workflow unverified. | Any impression an order is preparing before staff confirmation. |
| P7 SENSORY RESTRAINT | Which sounds/textures actually support a decision? | Optional sensory details (real sound, ingredients, preparation context) improve recognition and accessibility. | A/B silent close-up vs sound-on clip with captions and mute default. | General HFI literature; no Tuscanini validation. | Decorative noise, forced autoplay, unjustified 'crunch' claims. |

## 3. Thesis pressure-test: three situations where the system must work

1. **Known-order customer, 40 seconds available, weak mobile connection.** They know «تشيكن فاير» and want a correct size/quantity quickly. Can the experience reach the correct named item without opening animations or an irrelevant story? If it exists in several forms, can they distinguish *which form* precisely? Testable metrics: time-to-correct-item, navigation errors, load behavior.
2. **First-time customer choosing with another person.** They enter unsure of form/flavor, see real food photos, compare two sizes and an extra sauce, then agree on total. Does the creative layer clarify or distract? Metrics: correct recall of ingredients/size, price total, confidence (self-reported), mistakes.
3. **Kitchen / pickup handoff during the rush.** A food order is saved, then confirmed and prepared; customer receives honest state. Does theatrical waiting accidentally imply work underway? Can staff distinguish identical named products across crepe/pizza/pasta? Metrics: item-form ambiguity, state mismatches, fulfillment accuracy.

*These are scripted test scenarios, not claims about actual Tuscanini customer behavior.*

## 4. Micro-R&D experiments, before a hero or visual direction

### E04-1 — One name, three food forms (highest information value)
- **Input:** Three verified ordinary-served versions of *one* recurring flavor name, if the restaurant still carries them. Otherwise select another current recurring flavor.
- **Capture:** Same background, true dimensions, same angles; recipe/ingredients recorded per form; one independent staff check.
- **Question:** Can people reliably recognize a common 'signature' flavor and still notice differences between crepe/pizza/sandwich?
- **Stimuli:** (A) form-first labels, (B) flavor-first labels, (C) plain text list.
- **Success:** Accurate identity, ingredient/size comprehension, low mistaken selections, no meaningful slowdown for returning users.
- **Reject if:** The common name is marketing-only; no consistent identity; customers prefer category-first unanimously; misleading food equivalence.

### E04-2 — Reveal or still?
- **Input:** Real whole/section food photograph and one short optional movement sequence from the same actual ordinary serving.
- **Compare:** High-quality single still vs concise two-frame cutaway vs moving masked reveal.
- **Measures:** What filling is visible? portion sense? task completion speed? preference? mobile performance; reduced-motion equivalence.
- **Reject if:** The moving version is only prettier, not more comprehensible.

### E04-3 — Hand/scale truth
- **Input:** 3 actual sizes of a verified food family, with measured dimensions and photographed consistently.
- **Compare:** Isolated product vs staff-held size-reference vs clear numeric dimensions/weight as permitted by kitchen.
- **Measures:** Participant guesses compared to actual serving, trust and recall.
- **Reject if:** Photos create unrealistic portion expectations.

### E04-4 — The wrapper as a service rather than a graphic
- **Input:** Genuine wrapper/box, one real takeaway order, five transitions pack → close → handoff → carry → open.
- **Question:** Is there any actual packaging usability pain point / distinct choreography?
- **Output:** A physical evidence sheet, candidate touchpoints and one *paper* idea, **not** an automatic logo-redesign brief.
- **Reject if:** The packaging action is ordinary and offers no meaning or improvement.

## 5. Truth hierarchy / anti-clone system

1. **Direct user-verified Tuscanini truth:** page identity, location, provided screenshots.
2. **Current restaurant evidence:** validated menu, source photos, packaging, sales and preparation observations (not yet available).
3. **Legacy Tuscanini project facts:** old data structures and code, useful but not proof of current operations.
4. **External case studies:** documented studio work; demonstrate transferable *method* only.
5. **Independent human/UX research:** directions for testing; never treated as customer findings for Tuscanini.
6. **Speculation / creative hypotheses:** clearly labeled and easily rejected.

**Anti-clone rule:** No borrowed palettes, mascots, magazine look, scroll tricks, typography, wrapper structures or scripted transitions. A reference earns a place only if it helps answer a Tuscanini-specific question.

**Technology posture:** Next.js/TypeScript may remain practical; GSAP/ScrollTrigger/Flip, CSS masks, high-quality video or static imagery are experiments, not requirements. WebGL/Three.js and custom audio remain unapproved and must have a clear reason, accessible fallback and performance budget.

## 6. Source / project evidence ledger

- User supplied screenshots: Facebook page banner / logo and photo grid. Visual observations: black/red English logo, red Arabic icon, stuffed food cross-section shots, branded boxes/uniform and sports marketing.
- User confirmed Tulip Club, Beni Suef identity.
- Original code: `https://github.com/omarkhair70-droid/tuscanini-ordering-system/blob/main/lib/mock-data.ts` and `types/menu.ts`. Numeric analysis **applies to file parsing only**.
- Workflow precedent: `https://github.com/omarkhair-labs/hiltech-eg-website/blob/main/docs/HILTECH_CREATIVE_SYSTEM_INDEX.md` and `https://github.com/omarkhair70-droid/omar-khair-portfolio/blob/main/docs/FINAL_VISUAL_DIRECTION.md`.
- First-hand awards and case references: https://www.dandad.org/work/d-ad-awards-archive/heinz-dipper · https://www.dandad.org/work/d-ad-awards-archive/voice-of-food · https://creativepool.com/designbridge/projects/hellmanns-for-hellmanns · https://monarqeg.com/case-studies/don-bisho/ .
- Independent research: https://doi.org/10.1145/3484439 · https://pubmed.ncbi.nlm.nih.gov/7826990/ · https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026.

## 7. Status and next decision gate

**Completed as desk research:** systematic translation of food/rituals to seven hypotheses, new evidence-based award/creative references, legacy cross-category extraction, proposed falsifiable prototype scripts and 3 user situations.

**Not completed:** actual recipe checks, current menu verification, real live customer research, kitchen observation, photographer permissions, finished coded prototypes, creative thesis lock, design system, deployment.

**Next work — first true experiment:** verify the shared-name/food-form relationship with current Tuscanini menu and ordinary servings. If that collapses, preserve the findings and reopen R4 alternatives (food reveal, hand/scale, packaging ritual). Concurrently research original editorial food photography and physical packaging design methods for the surviving material.

**Do not ask user to redesign the old site. Do not create an arbitrary homepage. Keep the old repository unchanged until a build phase is explicitly authorized.**