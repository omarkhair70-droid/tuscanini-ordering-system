# TUSCANINI — CREATIVE THESIS STRESS TEST / RESEARCH PASS 05

**Date:** 18 October 2026  
**Status:** Desk-based hypothesis challenge complete; *creative thesis NOT locked*.  
**Project:** Tuscanini — user-confirmed restaurant at Sur Nadi Tulip, Beni Suef, Egypt.  
**Working documents:** [Pass 02](./TUSCANINI_RESEARCH_PASS_02.md) · [Pass 03](./TUSCANINI_FOOD_RITUAL_ATLAS_03.md) · [Pass 04](./TUSCANINI_MATERIAL_TO_EXPERIENCE_PASS_04.md)

## Nonnegotiable project contract

This is **not** an audit to fix old UI, nor a reskin. The existing repository is an archive and **historical** operational evidence only. Nothing in the old appearance—color, logo composition, hero, page structure, typography, or motion—is a required visual inheritance. The next authored experience must be derived from restaurant reality, tested behavioral needs, and original creative translation.

The workflow should follow the principles used in the user's actual HILTECH and Omar Khair portfolio work: `Reality → Brief → Reference Decomposition → Thesis → Experience Architecture → Visual/Motion Grammar → Prototyping → Browser/field QA → Closure`, and **"the workflow repeats, the answer must not."**

*Integrity note:* Stress tests below are **reasoned scenario walkthroughs**, *not* interviews, eye tracking, usability tests, sales figures, or validated restaurant behavior. They cannot tell us which idea real customers like.*

---

## 1. What has been established, and what has not

### Firsthand restaurant evidence
- User-identified Facebook page: https://www.facebook.com/p/Tuscanini-%D8%AA%D9%88%D8%B3%D9%83%D8%A7%D9%86%D9%8A%D9%86%D9%8A-61574394621575/ . User-provided screenshots show (a) English script logo on a black banner, (b) red circular Arabic brand mark, (c) numerous split/open stuffed food photos, (d) staff-held sandwiches/crepes, (e) some red branded packaging/uniforms, (f) football/promo/social creative. Images of physical restaurant interior are sparse in this evidence set.
- The banner/marketing voice and food images are genuine *screenshots of a real restaurant page*, but they are still a **small selected sample**, not a measure of consumer response, best-selling recipes, or what is currently served.

### Legacy project evidence
- Original repository: https://github.com/omarkhair70-droid/tuscanini-ordering-system ; reference data at `lib/mock-data.ts` and `types/menu.ts`.
- Earlier reproducible extraction from `lib/mock-data.ts`: **113 parsed name/category entries**, 89 distinct names, **21 names repeating across separate food-form categories**. Specific examples: `تشيكن فاير` (crepe/pizza/kaiser), `دوز كباب` (crepe/pizza/pasta), `شاورما لحم` (crepe/pizza/French sandwich), `ميكس جبن` (crepe/pizza). This may be a taxonomy clue, **not evidence of matching recipes**.
- Legacy menu includes price/availability structures. Its prices, recipes, actual stock, rankings and sales are **not** verified for October 2026.

### Unverified and potentially thesis-changing facts
1. Whether a recurring name denotes a real standardized flavor across different food forms.
2. Whether a cut/open crepe is distinctive **to Tuscanini**, versus standard food photography in the local category.
3. The genuine handoff ritual, staff/customer gestures, and whether packaging has anything unusual.
4. Whether customer mental models cluster by `form`, `flavor`, `offer`, `price`, or prior familiarity.
5. How orders are actually received, acknowledged and fulfilled during busy periods.

---

## 2. Competing thesis engines — three hypotheses, **not three visual moodboards**

### T-A — ONE FLAVOR, MANY FORMS
**Reality anchor:** Recurring legacy names across crepe, pizza, pasta and sandwiches.

**Generative potential:** Product ontology; a way to look up a recognized flavor family across forms; narrative transitions from one *validated* recipe to another. If customer preference supports it, this can influence menu navigation, type hierarchy and interaction. **Nothing yet demands a literal morphing animation.**

**Why it is fragile:** Identical names may hide different recipes, portion sizes and prices. A conceptual “build-your-meal” interface may erase real recipe differences, tempt fake equivalence and slow a hungry repeat customer.

**Hard rejection criteria:** Recurring names are merely naming reuse, restaurant confirms no reliable flavor family, or discovery tests show that flavor-first hierarchy repeatedly misroutes customers.

**Provisional role:** **Strong candidate product-discovery mechanic; weak standalone brand thesis.**

### T-B — THE INSIDE IS THE EVENT
**Reality anchor:** Multiple real supplied photos present stuffed crepes/sandwiches open to camera, showing layered fillings, color, sauce and thickness.

**Generative potential:** Honest food cuts and cross-sections; image pairing (whole / cut / portion reference); typographic layering and high/low-density compositions; optional reveal-based interactions; ingredient visibility that helps customers choose. Can extend from campaign image to menu, packaging and motion without necessarily becoming a visual gimmick.

**Why it is fragile:** Open food shots are common in fast food; composition may exaggerate quantities; repeated reveal motion can become tedious; whole-body video may slow entry.

**Hard rejection criteria:** Physical food does not reliably resemble the social image; customers gain no added information from reveal versus a still photo; repeat visitors must wait to navigate; the visual language cannot extend beyond 1–2 hero food shots without repeating itself.

**Provisional role:** **Best-supported subject for the next visual R&D experiment**, *not* the winning brand identity.

### T-C — MADE, HELD, HANDED OVER
**Reality anchor:** Branded takeaway packaging/uniforms and staff-held food photography; plausible but presently unobserved transitions from prep to pickup to eating.

**Generative potential:** Food photographed with a human scale and hands; packaging choreography; useful status and handoff communication; a physical-to-digital continuity system with distinctive micro-rituals, if the physical observation substantiates it.

**Why it is fragile:** The restaurant may have a wholly ordinary or inconsistent packaging workflow; service diagrams could become made-up theatre; impossible to infer “customer delight” or “signature ritual” from a screenshot.

**Hard rejection criteria:** No meaningful repeatable physical gesture; implementing it would require fictional kitchen states; no change for the person receiving the food.

**Provisional role:** **Field-research prospect, not ready for creative-thesis lock.**

---

## 3. Four scenario stress tests — reasoning, not user testing

| Situation | T-A: Form × Flavor | T-B: Reveal | T-C: Handoff | What the test teaches us |
|---|---|---|---|---|
| **S1. Familiar customer; 40 seconds; weak cellular network; searching for `تشيكن فاير`.** | Helps if they start from remembered name and can disambiguate form quickly; harmful if forced into a multi-step chooser. | Does not belong in the critical path; a static food image can load progressively. | Mostly irrelevant until fulfillment. | **Direct search/order entry is a constant**, not a visual concept. |
| **S2. Two first-time customers choosing within a budget, uncertain about sizes and extras.** | May reveal alternative formats of the same name if the restaurant validates them; may confuse if names sound equal but portions differ. | Can show actual fillings and portion difference if shot consistently; cross-section alone does not communicate scale. | Packaging could help judge portability; cannot infer from current shots. | Accurate description, price, ingredients and actual portion reference must survive any art direction. |
| **S3. Busy kitchen / pickup queue; distinct `تشيكن فاير` orders in crepe/pizza/kaiser forms.** | Strong need to separate actual item identity and form: avoid ambiguous tickets. | Decorative reveal has no operational value. | Order state and handoff details matter if they correspond to true actions. | **Kitchen data and truthful service status must not be dictated by a cinematic narrative.** |
| **S4. Visitor from a football promotion or shared post wants the advertised offer.** | They care about the *offer promise*; flavor matrix might be secondary. | An appetizing authentic image helps only if it matches the offer. | Pickup/delivery terms must be clear. | Brand/social momentum and transactional clarity must coexist without hijacking one another. |

**Survivors across scenarios:**
- **Two tempos:** browse/discover when invited; instant known-item/offer finding when needed.
- **Truthful food evidence:** visuals may attract, but ingredients, portions, price, offer conditions and status must be reliable.
- **One world, different page responsibilities:** editorial discoveries should feel authored, transaction views deliberately calm, kitchen states literal and legible.
- **Physical material is a source of meaning**, not automatically a mandate for 3D, animation, packaging redesign or sound.

---

## 4. Desk-test outcome / thesis decision record

| Research dimension | T-A | T-B | T-C |
|---|---|---|---|
| Strongest currently available evidence | Repeated legacy product names | Multiple authentic page screenshots of open food | Packaging/uniform/hand-held shots |
| Biggest unresolved dependency | Current recipe equivalence + customer mental model | Food-truth fidelity + uniqueness + actual comprehension | Actual observed wrapping, delivery and pickup |
| Can support a *creative* grammar across touchpoints? | Maybe, but risks looking like generic configurator | Plausibly, after proof and diversity study | Plausibly, after physical observation |
| Can safely support the **fast order** path? | Yes, as optional route or shortcut | Only if optional / static equivalent | Only as truthful status or useful instructions |
| Today's call | **HOLD — product/IA hypothesis** | **EXPLORE FIRST — visual experiment** | **HOLD — service/physical hypothesis** |

**Decision:** Do **not** select a final brand thesis today. Prioritize **T-B as a visual research subject**, keep **T-A as a structural information hypothesis**, keep **T-C as field research**. Do not collapse them into the slogan "Revealing flavor across forms" simply because it combines the three labels. A synthesis must emerge from evidence, not prose.

---

## 5. Anti-repetition creative synthesis test (imported from HILTECH lesson)

A thesis must generate *meaningfully different* expressions for different moments. Test these six roles; no pixel UI is requested:

| Experience role | What must be communicated | What NOT to copy from another role |
|---|---|---|
| **First encounter / discovery** | Food/restaurant world and identity; why this place is memorable | Avoid becoming a generic oversized-food hero with scroll gimmicks |
| **Food exploration** | Real differences between food forms, fillings, portions | Not another repeating promo collage |
| **Known-order action** | Find precise product fast, customize, understand total | No mandatory introduction, sound, reveal or forced scroll |
| **Offers and social entry** | Exact offer, price, conditions, expiry, eligible items | Do not sacrifice accuracy for energetic campaign artwork |
| **Kitchen / order status** | Saved vs confirmed vs preparing vs ready; no invented status | No simulated kitchen progress or fake waiting theatre |
| **Physical receipt / wrapper / pickup** | Useful real-world instructions and recognizable brand | No screenshot of website pasted onto packaging |

If all six use the same giant headline + open-food photo + clip mask, **the creative system has failed**, even if one page looks beautiful. A single worldview should vary in visual intensity and behavior.

---

## 6. Cross-discipline reference recheck (new Pass 05 sources)

### A. Chipsa on Promeat — optimization is part of direction
- Studio documents that an image-sequence attempt was too heavy/choppy for Promeat and that optimized 3D/WebGL served the intended material expression; they discuss complexities of synchronization, models and scroll input. Source: https://chipsa.ru/en/publications/pocemu-smesenie-raznyx-idei-daet-krutoi-rezultat-keis-promeat and https://chipsa.design/publications/kak-webgl-pomogaet-chipsa-sozdavat-kreativnye-3d-saity .
- **Transfer to Tuscanini:** measure *which medium* explains a physical event and the mobile cost; don't declare GSAP/WebGL as the outcome of the research. The product itself may be better represented by genuinely photographed stills, not 3D approximations.

### B. NN/g on Card Sorting vs. Tree Testing — don't invent the customer's mental model
- Card sorting elicits natural groupings; tree testing evaluates findability in a proposed hierarchy. They are distinct steps. Sources: https://www.nngroup.com/articles/card-sorting-definition/ and https://www.nngroup.com/articles/tree-testing/ .
- **Transfer:** validate whether people start from `form`, `flavor`, `price`, `offer`, or remembered item. Similar recipe names in developer data don't prove behavior.

### C. Baymard Food Delivery & Takeout UX Benchmark — commerce is its own research lane
- August 2026 assessment covered eight major services and identified weaknesses in repeat ordering, customization information, wayfinding and fulfillment clarity. Source: https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026 .
- **Transfer:** protect short paths, editable selections and truthful status rather than forcing the creative journey on habitual orders.

### D. MONARQ / KHUFU'S — place can generate the digital language
- Egyptian agency case study says its dining website uses the physical Giza setting to guide atmosphere, image sequence and reservation navigation, with **an Awwwards Honorable Mention claimed by the studio**. Source: https://monarqeg.com/case-studies/khufus/ . Independent Awwwards award listing not independently confirmed in this pass; do not upgrade the claim to a verified award without it.
- **Transfer:** the actual restaurant location can be the source of a language, not stock "Italian restaurant" tropes. Tuscanini's real setting is Beni Suef street-food context, not monument tourism.

### E. W3C + Google web.dev — quality is a production constraint, not an afterthought
- WCAG 2.2 provides reduced-motion technique `prefers-reduced-motion` for interaction animation: https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html .
- Core Web Vitals 'good' field thresholds: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75 mobile/desktop: https://web.dev/articles/vitals . These are **later production targets**, not measured results for Tuscanini.

---

## 7. Executable research kit / E05 micro-studies (no website mockups)

### E05-A: WHAT COMES FIRST? (product mental-model study)
**Prepare:** 12–18 printed item cards from **current verified** Tuscanini menu: several forms, repeated names, one or two offers, a dessert and add-on. Replace outdated legacy names. Each card: real name + exact brief factual description; no image/icon preclassifying it as "pizza" or "crepe" where that would bias sorting.

**Protocol:**
1. Ask representative customers to group cards however makes sense to them; ask them to name their own groups. Do not introduce the words `form/flavor` at the start.
2. Ask: "When you're hungry and want something you know by name, how would you find it?" and "How would you choose when you don't know the name?"
3. Create two *text-only* candidate hierarchies from findings: form-first with find-by-name, and flavor-first with form disambiguation.
4. Use task-based tree tests to find `تشيكن فاير` in its specified form, an offer, an inexpensive item, and a product with extras.
5. Record first path, correct find, backtracks, false equivalences, and participants' verbal rationales.

**Recruitment:** For a rapid exploratory round, run 5–8 short moderated interviews; do not generalize percentages or call this a validated IA. A more formal qualitative card sort should use an appropriate larger and representative sample (NN/g gives a guideline of 15+), followed by tree testing.

**Decide:** Product ordering taxonomy should not be based on the repeated names alone. If form-first dominates, flavor becomes search/cross-linking rather than primary architecture. If both mental models occur, preserve **parallel entry routes** instead of asking everybody to use a new mechanism.

### E05-B: REAL FOOD REVEAL (visual-comprehension test)
**Prepare:** One actual ordinary-serving Tuscanini crepe, recipe/size verified; 3 presentations: (A) honest still showing whole food, (B) whole plus a cut showing internal texture, (C) very short optional reveal motion from the same real serving. Make ingredients/size available in text for all three.

**Ask:** Without telling people which version is supposed to be exciting: What ingredients can you recognize? How large do you expect it to be? Which version makes you more confident in your decision? Can you reach its information and order action quickly?

**Record:** Ingredient recall vs kitchen-verified ingredients; size estimates vs actual measure; mistaken impressions; time to correct info; distraction / motion requests; mobile data and paint performance later.

**Reject the motion** if it produces no measurable clarity beyond the real still, or shows the food more generously than delivered. Honor reduced motion and caption/alt equivalents.

### E05-C: THE HANDOFF FILM (physical ritual verification)
**Prepare:** One authentic takeaway order filmed across five real moments—pack, close, hand to customer, carry, open—and capture packaging measurements/materials. Do not stage fictional kitchen choreography.

**Ask:** Is there a distinct touchpoint? Can an explanation or visual system reduce spillage, confusion, or order identification time? Is there already something customers recognize as uniquely Tuscanini?

**Reject** if the film is ordinary and adds no useful insight. Record it as physical evidence, not a failed project.

### E05-D: TWO-TEMPO TEST (critical-path protection)
Prototype **unskinned, text-first paths** only after accurate menu data exists:
- (1) customer knows exact item, weak network, wants fast repeat;
- (2) customer is undecided and wants guided exploration;
- (3) arrival from a promotion seeking that exact valid offer.

Measure correct item, form, size, extras, price and final status. Novel interactions must never be mandatory for the first or third path.

---

## 8. Gate outcomes / what to do next

**Green for desk research:** Three hypotheses articulated, scenario challenges conducted, source recheck and test protocols complete.

**Amber / provisional:** T-B cross-section visual research is the strongest *next experiment candidate* because its physical evidence is strongest, but uniqueness has not been established. T-A is an eligible auxiliary discovery model; T-C requires physical observation.

**Red / not authorized:** final creative thesis, visual identity, brand palette, typographic system, full IA, screen layouts, moodboards as final designs, Three.js scene, code implementation, GitHub changes and production deployment.

### Next stage: REFERENCE RECHECK 05-B (targeted), then TEST 06
1. Collect **real** food close-up/cross-section/portion photography references and original food-photo methods, but focus on *distinctiveness vs generic clichés*.
2. Compare three implementations of the **same real serving**: still, whole+cut, and short optional reveal, documenting content, editing, technical cost and accuracy.
3. Recheck authentic Tuscanini menus, actual kitchen recipe differences and packaging gestures. Current Instagram/Facebook gallery screenshots are helpful but not enough to confirm recipes.
4. Use findings to write a **single creative thesis** only after evidence and rejection tests; carry forward necessary utility principles separately.
5. Then form the authored `Creative Constitution`: visual grammar + photographic grammar + typographic logic + motion behavior + service tone + proof, explicitly anti-repetition across surfaces.

**STOP RULE:** Do not design a homepage or mimic award-winning restaurant sites as a substitute for confirming what Tuscanini is. Final version does not inherit old site visuals. Original repository remains unchanged until build stage is explicitly authorized.