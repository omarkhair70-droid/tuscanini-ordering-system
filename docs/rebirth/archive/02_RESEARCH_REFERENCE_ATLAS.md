# TUSCANINI — RESEARCH PASS 02
**Status:** Research synthesis, not visual direction lock  
**Date:** 2026-10-18  
**Subject:** Tuscanini, Sūr Nadi Tulip, Beni Suef, Egypt  
**Purpose:** Ground-up authorship of a food/restaurant digital experience using source-driven creative R&D.

## Core project rule
The previous `tuscanini-ordering-system` implementation is a historical artifact, not the creative design specification. No prior visual element, layout, color, page hierarchy, or component is automatically retained. Operational data and working logic can be evaluated independently and preserved if useful. Do not rebuild its homepage first.

## Lessons reproduced from the user's existing workflows
Source 1: [HILTECH Creative System](https://github.com/omarkhair-labs/hiltech-eg-website/blob/main/docs/HILTECH_CREATIVE_SYSTEM_INDEX.md)
- Reality → Brief → Research → Reference Decomposition → Identity Thesis → IA / Experience Architecture → Visual / Motion Grammar → Exploration → Browser QA → Production / Closure.
- Source of truth: real business facts > creative thesis > reference principles > experience architecture > visual grammar > concept visuals.
- Reference → principle → interpretation; never reference → copy.
- The workflow repeats. The answer must not.
- Discovery and fast transaction paths should coexist; public pages need not share one template.

Source 2: [Omar Khair Final Visual Direction](https://github.com/omarkhair70-droid/omar-khair-portfolio/blob/main/docs/FINAL_VISUAL_DIRECTION.md)
- Idea precedes imagery and stack. 'Systems with a pulse' became an operating thesis, not a mood board.
- Motion should make the perspective clearer, make evidence understandable, or improve spatial/narrative orientation.
- Technology was chosen to serve the idea (GSAP / Lenis / PixiJS; Three.js deliberately excluded in that context).
- Validate mobile/desktop, reduced motion, focus, real images, first-five-seconds impression.

## Current Tuscanini reality evidence
Evidence: two screenshots of the restaurant's Facebook page provided by user, plus the user's confirmation of the Tulip Club location, plus user-owned original website/repository.

Observed:
- Black English script wordmark with red lettering and pizza-slice symbol in Facebook cover.
- Red circular Arabic logo, yellow/white accents in profile.
- Multiple close-up food photographs of stuffed crepes/sandwiches/pizzas, often showing cross-sections and generous toppings/sauce, with staff holding food.
- Branded packaging and uniforms appear in images.
- Social posts combine food images, sports tie-ins and promotions.
- Facebook page positions itself as 'ملوك الكريب في بني سويف'.

NOT validated:
- Which products generate most orders or margin.
- Whether the cover and avatar identities represent old/new marks, or deliberate coexistence.
- Whether 'ملوك الكريب' corresponds to internal commercial priority.
- A complete, original set of restaurant photography; source files and licensing.
- The four-friends origin story beyond the current site copy.
- In-store actual customer behavior, dispatch timing or queueing.

## Award/reference research — evidence and transfer matrix

### Tripletta Pizza — Creative restaurant atmosphere
- [CSSDA winner 27 March 2025](https://www.cssdesignawards.com/sites/tripletta-pizza/47250/) — Website of the Day, final judge score 8.33.
- Team: Treize Grammes + Thomas Carré. Developer stated stack on LinkedIn: Vanilla JS, GSAP, Webflow CMS: https://www.linkedin.com/posts/thomas-carre_new-branding-new-website-for-tripletta-activity-7299737234134454272-gHBL
- Problem: reinterpret existing restaurant identity digitally, taking the different venue atmospheres seriously.
- Take: a restaurant website can embody the physical brand universe and be expressive; identity extends beyond the order form.
- Don't copy: its characters, color system or playful transitions literally.

### Promeat — Food material × editorial metaphor × interaction
- [CSSDA winner 2 August 2025](https://cssdesignawards.com/sites/promeat/47856/) — WOTD, 8.28.
- [First-hand Chipsa case study](https://chipsa.ru/en/publications/pocemu-smesenie-raznyx-idei-daet-krutoi-rezultat-keis-promeat).
- Brief: professional food/HORECA expertise for chefs and buyers, against generic meat-brand conventions.
- Studio solution: treat the brand like a glossy culinary magazine, not a catalogue. Editorial annotations and cover rhythm convey professional authority.
- Verified technique: Three.js/WebGL scroll object motion; optimized assets, glTF transforms, damping/interpolation, React hook, Lenis, scroll-linked animation with fallback.
- Take: an unexpected metaphor *about the real substance* can generate composition and motion.
- Don't copy: 3D food object, magazine layout, or add Three.js before a meaningful motion concept exists.

### CAVA — Omnichannel identity
- [REQ agency CAVA case study](https://req.co/case-studies/cava/); self-reported ADDY website award and ARE restaurant category Grand Prize.
- Scope included brand strategy and identity, packaging, in-store ordering technology and digital assets.
- Take: online ordering, physical packaging, place and communications can be one brand system, not isolated design pieces.
- Don't copy: scale of chain operations or invent an enterprise loyalty scheme.

### Boccone — Fast-casual packaging and legibility
- [Slash Studio case study](https://slsh.studio/projects/boccone-brand-identity), not claimed to have won website awards.
- Studio focuses on quick-service identity, readability at speed, personality/mascot, packaging use.
- Take: think of a wordmark on packaging, staff clothing, physical menu, delivery container and 360px phone before producing a logo showcase.
- Don't copy: mascot or palette if ungrounded in Tuscanini.

### The Hot Chicken — Egypt-local brand system
- [DIVI Branding case study](https://divibranding.com/case-studies/the-hot-chicken/) — studio self-report, not independently verified award.
- Brand character, local market voice, packaging and integrated ordering.
- Take: local relevance doesn't demand kitsch; map language and interface behavior to what local customers expect.
- Don't copy: American hot-chicken aesthetics and generic local slang.

### NEW SUSHISM — Food as cultural/editorial narrative
- [CSSDA winner March 7 2025](https://www.cssdesignawards.com/sites/new-sushism/47163/) — WOTD, 8.09; importantly, a food culture MEDIA platform, not a local restaurant ordering UX benchmark.
- Take: food knowledge and visual authorship can build a world separate from buying.
- Don't copy: abstract cultural-catalogue navigation into checkout.

## UX research counterweight: hungry users
[Baymard Food Delivery & Takeout UX Benchmark (2026-08-13)](https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026)
- The 2026 benchmark assessed 8 mainstream mobile ordering services/apps across 390+ criteria, generating 3,100+ scores and 1,900+ examples.
- Recurrent weaknesses included difficulty reordering, insufficient dietary/customization explanations, weak wayfinding and order fulfillment information.
- For Tuscanini, test these *journeys* separately from the expressive introduction:
  1. Regular customer knows exact crepe, repeat order.
  2. First-time customer sees hero products, understands ingredients and size, orders.
  3. Group order with multiple sizes/add-ons, clear totals and confirmation.
  4. Customer with dietary needs or allergies, understand available information accurately.
  5. Restaurant staff receive, confirm, prepare and hand off the order, without misleading states.
- Do not assert that any particular benchmark failure is already a proven fault of Tuscanini until field testing.

## Research synthesis: tensions worth exploring, not three ready-made design options

**Craving ↔ Clarity** — food images drive desire; information enables a decision.

**Excess ↔ Composition** — the food is visually full, but the website needn't be crowded.

**Local voice ↔ Distinct authorship** — local familiarity can coexist with an original art-directed system.

**Discovery ↔ Ordering** — users exploring the brand and users buying in 30 seconds have different immediate needs.

**Physical truth ↔ Digital metaphor** — real product/packaging/people provide building blocks; motion transforms those materials meaningfully.

## Preliminary brief V0.2 (not locked)
**Reality:** A Beni Suef fast-casual business visibly leads with generously filled crepes and uses bold social communication; online ordering is an actual functional need.

**Opportunity:** Author a distinctive digital restaurant experience where photographed food is the raw material for a brand world, while the mobile transaction stays trustworthy and quick.

**Creative question:** What website behavior could emerge from the *actual construction, scale, and ritual of eating Tuscanini food* that no generic pizza or burger template could have predicted?

**Design challenge:** Create emotional recognition, product differentiation, clarity of ingredients/size/add-ons, and an operationally believable order journey without adopting a conventional card-grid as the brand identity.

**Not yet decided:** visual palette, fonts, layout, hero treatment, imagery selection, mood, WebGL use, sequence of chapters, navigation model, menu interactions, product detail patterns.

## Research-to-design gates — required next work

### R3 — Product and ritual mapping
- Obtain verified menu/photos/packaging assets and identify 6–10 representative products across categories.
- Map each product: shape, cross-section, layers, ingredients, perceived heft, handling, finishing, packaging, serving ritual, decision variables.
- Map customer moments: before deciding, deciding, ordering, waiting, receiving, eating, sharing, reordering.
- Validate claims with real restaurant evidence. Mark each as observed/claimed/hypothesized.

### R4 — Creative translation / reference stress test
- Derive 5–7 meaningful experience principles from physical food and customer behavior, not isolated color choices.
- Re-search award-winning food/product/media/motion work against each principle.
- For each candidate interaction, capture: what information it reveals, whether it creates interest, how it behaves on phone, accessibility/performance fallback, build complexity.
- Reject visual effects that only make the page seem expensive.

### R5 — Thesis and structure
- Lock one project-specific creative thesis only when strong evidence exists.
- Define distinct experience modes: brand/discovery, menu/selection, transaction/confirmation, staff operations if in project scope.
- Build a prototype of the ONE hardest signature interaction, before creating a homepage design.
- User review and qualitative QA before full implementation.

## Implementation principles
- Product UI can be rewritten entirely in a new branch; retain production behavior only after reviewing contracts/data semantics.
- Next.js/React/TypeScript are candidates because existing project uses them; their use isn't a visual style decision.
- GSAP / ScrollTrigger / Flip may be useful for meaningful 2D motion; WebGL/Three.js only with a demonstrable explanatory metaphor and performance budget.
- Real photography/real food first. Any illustrative abstraction should not misrepresent served food.
- Motion should have an accessible reduced-motion mode and transactions must work without cinematic entry sequences.
- Phone-first confirmation and location-specific restaurant ordering realities must guide the final implementation.

## State of evidence
- Completed: initial page/photo audit (two user screenshots), award verification for selected projects, first-hand Promeat and Tripletta technical case studies, UX benchmark, user workflow recovery from HILTECH / portfolio repository.
- Not completed: comprehensive Tuscanini page/post timeline; restaurant interviews; production menu/metrics confirmation; operational field testing; unique creative direction lock; code branch or deployment.

## Key reference URLs
- https://www.cssdesignawards.com/sites/tripletta-pizza/47250/
- https://www.linkedin.com/posts/thomas-carre_new-branding-new-website-for-tripletta-activity-7299737234134454272-gHBL
- https://cssdesignawards.com/sites/promeat/47856/
- https://chipsa.ru/en/publications/pocemu-smesenie-raznyx-idei-daet-krutoi-rezultat-keis-promeat
- https://req.co/case-studies/cava/
- https://slsh.studio/projects/boccone-brand-identity
- https://divibranding.com/case-studies/the-hot-chicken/
- https://www.cssdesignawards.com/sites/new-sushism/47163/
- https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026

## Additional outside-website visual reference layer — food photography and physical identity

### Monty's — distinctive sandwich world across touchpoints
- [Nicolas Lavrov Studio case study](https://www.nicolaslavrov.com/projects/montys) — branded menus, packaging, signage, uniforms, social, website.
- Use for: aligning physical packaging and close-up food photography under one designed visual vocabulary.
- Do not assume any formal award from this case study.

### BoxPark Pico — one shooting system across photo, menu and social
- [Pinn.Media case study](https://pinn.media/work/boxpark) — photographic art direction, product/menu/social with a small repeatable set of choices.
- Use for: how real food photography can maintain consistent framing/color/selection while serving different formats.
- Do not copy their palette or over-stylize actual Tuscanini products.

### Ollie's — food and packaging competing for attention
- [Bricks case study](https://www.bricks.com.kw/projects/ollies) — food packaging is composed inside the visual world instead of being incidental.
- Use for: determining hierarchy when highly saturated packaging and richly colored food are in the same frame.

These are first-party studio portfolio claims for process/inspiration, not independently audited award-winning projects.