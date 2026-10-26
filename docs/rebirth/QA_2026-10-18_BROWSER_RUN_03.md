# Tuscanini — Integrated QA Round 03 / Genuine Restaurant Images
Date: 18 October 2026
Evidence: https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39134879938
Release state: DRAFT, NOT READY FOR MERGE.

## Verified in actual GitHub Chromium
- Real 640×640 owner-provided restaurant photographs visible in the editorial Home Hero, discovery category tab and gallery. 11 JPGs committed in Git with source names tracked; image #12 still missing.
- Captures on Desktop 1440 and mobile-width 390 and other public routes ran successfully.
- **New interaction checks** completed: real hero loads, clicking food tabs changes selection, gallery opens/closes, direct Menu shows a real search entry point, and no significant horizontal overflow or uncaught page errors for the tested states.
- TypeScript + Next production build passed in this round.
- Strict media integrity gate failed as designed because 11/12 images are present, NOT because of a missing JavaScript asset in the hero.

## Visual reviewer findings
- Home now has actual cut crepe and shop context alongside the previously approved exploratory mood: dark opening, expressive Arabic type and restrained red/yellow accents. Better than blank placeholder PR Home.
- The desktop Home has distinct chapter rhythms, but it is still a long page. Mobile is roughly 5500px full-page screenshot; treat editorial chapter density/tempo as a live review task, not an arbitrary performance metric.
- Main product Menu had been rebuilt, but **live menu data is unavailable in CI** by design. The safe state is displayed; no fake/historical price catalog is exposed there.
- Shop product dialog is now a native accessible dialog connected to the actual cart calculations; until test data and E2E entry are available, it is **NOT yet interactively validated**.

## Production blockers
1. Last source photo TSC-12 not committed; complete strict media integrity gate.
2. Validate restaurant live item/size/addon/offer price/availability and test product drawer against real or isolated fixture data.
3. Native checkout backend: extra server-side price validation is in progress; transactional atomicity, retries/idempotency and permissions remain unvalidated. Never release the old client-priced checkout as trustworthy.
4. Unify Offers, Finder, Cart/Checkout, Tracking, Story/Contact, Feedback and staff panels to same authored system; current protected operator and transactional screens are not artistically integrated yet.
5. Test real physical phone and device input, network degradation, font fallback and performance, not just Chromium viewport emulation.
6. Obtain explicit owner review of COMPLETE integrated result before PR merge.

## Next action
Re-run GitHub CI after product dialog and authoritative price changes. Keep screenshot+interaction and strict media gate independent so a green TypeScript build cannot disguise an unfinished customer experience. Then proceed with Cart/Checkout authored UI and transaction/test fixtures.
