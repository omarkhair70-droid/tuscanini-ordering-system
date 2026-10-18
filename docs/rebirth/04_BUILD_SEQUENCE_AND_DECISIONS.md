# TUSCANINI / BUILD SEQUENCE + DECISION LOG
Date: 2026-10-18. Scope: integrated production site with internal checkpoints; no premature owner review of isolated incomplete pages.

## The working cycle
For each lane: study brief/evidence → narrowed source/reference check when needed → define the page's *unique role* → implement a complete functional state in real Next.js → desktop+mobile browser QA with screenshots and interaction checks → accessibility/performance/data audit → compare to reference HTML's energy → refine → record decision. Do not hold a final verdict on the aesthetics of the **whole** site until the joined-up routes are coherent.

### Stage 0 — foundational repair / in progress
- Preserve old Main deployment; all new work on `redesign/tuscanini-authored-experience-20261018`, Draft PR #59.
- Single source-of-truth docs and explicit decision ledger.
- Integrate all twelve authentic 640px original photos + optimized WebP in `public/images/rebirth`. Correctly store provenance, category-level assignment until named item mapping confirmed. **PARTIAL**: 11 source-backed original JPEGs committed to GitHub; 12th remains absent and strict media merge gate remains red. Optimized image delivery is handled by Next/Image at runtime; WebP derivation remains optional.
- Lock consistent CSS tokens, type roles, top navigation, secondary drawer, footer and cart entry; test on 320/390/768/1024/1440.
- Establish route smoke tests, Playwright screenshot artifacts, mobile-focused QA, reduced motion and reference comparison.
- Rewrite/review Home so that the actual preview reproduces or exceeds the HTML's rich photographed editorial experience.
**Gate:** preview screenshot + actual images + functioning nav + desktop/mobile + TypeScript/Next build; no acceptance yet.

### Stage 1 — food discovery / menu + product
- Preserve valid menu API contract; remove silent stale-price fallback in ordering contexts.
- Categories, exact-name search, repeated flavor/form disambiguation, filter and empty-state fidelity.
- Product details with confirmed item photos only, portions/sizes, extras, quantity, clear totals, add-to-cart with correct validation.
- Special study on Form×Flavor with actual customer/menu evidence rather than mandating it as top navigation.
**Gate:** known-item and first-time-browsing paths tested with correct menu data and no forced creative delay.

### Stage 2 — purchase, confirmation and kitchen truth
- Cart editing + delivery/pickup/in-shop options as allowed by real backend.
- Use idempotent/atomic order creation, clear server validation, no double-submission.
- Explicit “received, awaiting confirmation” vs “confirmed” vs “preparing, ready” states; no fake timelines.
- Check live kitchen status/admin commands and true customer order status end-to-end.
**Gate:** working simulated test transactions incl. failure and duplicate cases, credible totals, kitchen operator check.

### Stage 3 — campaigns, discovery assistant and brand chapters
- Current Offers + eligibility and deep links; no fake promo offers.
- Food Finder uses verified live availability, not historical sample recommendations.
- Story grounded in confirmed physical facts and approved words; real locality, not generic Italian stereotypes.
- Contact, accessible reviews, complaint handling and helpful support.
**Gate:** each route works as a distinct expression with functional and editorial parity.

### Stage 4 — staff experience / high-density operating UI
- Admin auth/security architecture evaluation: current shared-secret cookie, staff role boundaries, auditing and server protections.
- Products, offers, orders, kitchen, settings, admin overview: operator-centered interface; no distracting marketing motion.
- Preserve transactional integrity and exact price/stock synchronization with customers.
**Gate:** staff role E2E + UI QA, accessible high-density use on actual target devices.

### Stage 5 — integrated creative + operational QA and sign-off
- One holistic restaurant journey with all content and source-backed media; 10 customer route paths plus 7 existing principal admin paths; extra nested routes inventoried rather than silently removed.
- Every route: working loading / empty / error / invalid route / keyboard / touch / narrow screen.
- Performance profile: cold load, slow mobile network, image decode, font fallback, scroll jank, animation costs, layout shift.
- Regression: live menu, food categorization, offers, order submission, order tracking, admin mutations, session rules.
- Security/deployment: environment variables, permissions, headers, protection, PWA/service-worker caching, stale content, observability and recovery.
- Save screenshot/video comparisons in PR CI artifacts and short written QA reports.
- Owner looks at **complete integrated preview**; then refine, approve and merge/release. Do not ask for premature screen-level subjective verdict.

## Decision record (current)
| Topic | State | Decision and reason |
|---|---|---|
| Existing repo | Adopt with clean-slate frontend | Proven integration contracts are worth testing; old UI isn't. |
| Original HTML | Creative benchmark | It shows real photographic energy and interactions; it is not deployable commerce. |
| Branch/PR | Active | Keep PR #59 draft; do not merge without end-to-end QA. |
| Palette | Trial | Ink/Paper/Cream/Chili/Corn from prototype; no final brand approval yet. |
| Type | Trial | Changa display, IBM Plex Sans Arabic UI, Anton editorial Latin; test implementation. |
| Product creative thesis | Explore | Inside/Out is an engine of honest exterior/interior contrast; can be disproved. |
| IA | Provisional | Five visible primary nav targets; accessible cart/direct Menu, secondary links in drawer/footer. |
| Media | Required | 11 of 12 true Facebook JPEG images committed, remaining one blocked; source sizes 640x640; optimize without inventing contents. |
| Motion | Conditional | CSS/SVG baseline, GSAP if demonstrated; WebGL/Three/Pixi/Rive only if specific need. |
| Backend | Audit first | Supabase itself is not “primitive” or inherently wrong; repair stale menu, atomic orders and staff permissions first. |
| Menus/prices | Unverified | Code history isn't a live restaurant confirmation; explicit safe fallbacks. |
| Reviews | Integrated only | Per-route internal QA yes; customer art-direction sign-off after full experience. |

## Concrete next review
- Confirm files `00_START_HERE`, `01_RESEARCH_MEMORY`, `02_CREATIVE_AND_MEDIA_SYSTEM`, `03_ENGINEERING_AND_QA` are committed and no old ref has been deleted.
- Integrate actual assets to unblock photographed Home.
- Add programmatic assertions for reference asset paths and CI visual screenshot generation.
- Upgrade page-level layout components and navigation while preserving old routes until rebuilt.
- Log every limitation honestly: “Static checks passed” ≠ “browser visual QA passed”.

## Definition of DONE
Not “the homepage renders”, nor “the old APIs still respond”, nor “something looks like our mockup”. DONE means original restaurant material, original authored identity, readable/responsive UI, working ordering, truthful kitchen state, accessible interaction, safe staff tools, acceptable performance, reliable tests and integrated owner review.
