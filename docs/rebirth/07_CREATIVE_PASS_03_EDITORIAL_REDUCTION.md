# TUSCANINI / CREATIVE PASS 03 — CUT THE REDUNDANCY
Date: 18 Oct 2026 | Work in progress, Draft PR #59; no production merge.

## Decision
Pass 02 restored valuable differences between black food photography, warm cream photo wall, red physical packaging and yellow place. But more scenes DID NOT automatically equal a better restaurant experience. Mobile Home exceeded ~7,150px at 390px in recorded Pass 02 QA and repeated the same enormous inside/out/hunger message at least three times.

**This pass is about EDITING: distinctive rhythm instead of more sections.** Keep each scene that contributes different verified material, remove scenes that merely restate a claim or repeat an order CTA.

## Edited site, not a detached mockup
1. Deleted the huge intro block after the yellow marquee: repeated hero copy about “الحكاية مش بس من برّه”. Category discovery follows ticker directly.
2. Deleted the long generic “عارف نفسك هتاكل إيه؟” sales chapter: menu CTA already in hero, discovery tabs, material bridge and packaging scene. The direct order route stays accessible from the header.
3. Deleted second oversized post-photo reveal heading; substituted one restrained one-line menu bridge.
4. Rewrote category labels and photographic message for hunger/choice instead of talking about how the site was designed.
5. Changed the red packaging headline to one clear physical claim: “العلبة ليها شكل” (not another “مش بس…”).
6. Changed yellow local chapter from vague “الحكاية” to simple actionable branch arrival: “تلاقينا في بني سويف”.
7. Corrected section label order: 01 discover, 02 photo wall, 03 macro comparison, 04 packaging, 05 place.
8. Kept the custom yellow ticker, offset original photographs, authentic photo comparison, real packaging photo, strong typography and identity contrast, with reduced-motion support.

## Creative principles validated or challenged
- A scene needs its *own job*: attention, choice, evidence, tactile comparison, physical object, or local destination. A second grand headline making the same claim is redundant.
- Product finding must be short: customers shouldn't need to finish a story to reach Menu.
- Keep only real Tuscanini images; no AI food generation and no ingredient provenance fabrication.
- Layer typography and photo strategically. Checkout & tracking should stay calm and service-first.
- Use CSS marquee and native range rather than import GSAP/Three.js solely to add effects. Reassess when genuinely synchronized scroll storytelling requires a timeline.

## Tests added
- Assert the obsolete giant intro, oversized generic CTA and second detail hero are absent at 320/390/768/1440.
- Assert visible fast Menu path after photo comparison.
- Retain 12 authentic photo, keyboard/photo reveal, packaging-source decoding, running/stopped ticker, all ordering fixtures, and responsive overflow tests.

## Creative review still needed
- Compare before/after *actual* screenshots and screenshot pixel heights; reduction should change reading length, not sacrifice food recognition.
- Ensure Arabic headings remain complete at 320px.
- Inspect transition from dark macro scene to red packaging and then yellow location. Don't force GSAP if separation is legible.
- Confirm real browser checks; no physical phone testing yet. Owner hasn't approved final Home; whole-site release gates still open.

## References
- Earlier full HTML prototype: `docs/rebirth/archive/WEBSITE_EXPERIENCE_HTML_REFERENCE.html`.
- Previous creative direction translation: `docs/rebirth/06_HTML_VISUAL_TRANSLATION_PASS_02.md`.
- Prior QA screenshots: `docs/rebirth/QA_2026-10-18_STORY_PASS_02.md`.
