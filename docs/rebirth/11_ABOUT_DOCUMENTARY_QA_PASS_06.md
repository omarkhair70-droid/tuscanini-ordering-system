# TUSCANINI REBIRTH / PASS 06 — REAL RESTAURANT ABOUT + SHELL REPAIR

Date: 18–19 October 2026. Draft PR #59 only; not merged or published.

## Brief / identity
The About route has a specific **human-and-place documentary** role. It should not replay the Home's large cutaway slider, a giant ordering hero, or an invented “Italian heritage” story. The previous legacy About described four named friends, founding motives and delivery standards unsupported by the current restaurant source atlas. We removed those claims rather than elevate unverified founder copy into a new polished page.

## Source-backed material
- TSC-06: restaurant person presenting real crepes, main human-scale opener.
- TSC-01: original restaurant logo/context and real visible food.
- TSC-08: original sandwiches and Tuscanini packaging.
All are 640px source-owned visual materials, documentary context, NOT proof of individual item prices/availability, staff identities or founding history.
- Location uses existing recorded Beni Suef Tulip Club landmark; precise map verification is a separate contact/operations question.

## Executed
- Replaced `app/about/page.tsx` legacy `PageHero` and generic cards with genuine editorial human → food and material → locality arc.
- Created `app/rebirth-about.css`: paper/cream hierarchy, imperfect framed human photo, offset photo pair, ink local CTA; mobile one-column composition.
- A first actual browser screenshot revealed **duplicate legacy header/footer**: About wasn't in `components/layout/route-shell.tsx` authored-route list. Fixed route-shell *structurally*, not by hiding duplicate DOM.
- Enhanced automated browser test to assert one header, main and footer per viewport; 3 decoded real images; no fabricated founder text; direct contact & menu routes; no significant horizontal overflow.

## Independent evidence
Final pre-next-lane browser workflow: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39166812482 — **PASS**.
Production Next compile passed; browser interaction fixture reported **0 failures** at **320/390/768/1440**. Screenshots artifact contained **32 PNGs** covering route overview and focused chapters.
Inspected screenshots after the structural shell fix on 320/390/768/1440: one header/one footer; human portrait and food/takeaway visual scale remain legible and distinctive. Test result is not owner creative approval nor operational release.

## Decision
Accept implementation as an internally QA-reviewed **creative pass**, not site-wide closure. More important unclosed lanes: Contact, Reviews, Complaints and integrated commerce/operations; original photo resolution remains limited. No merge or external production changes.
