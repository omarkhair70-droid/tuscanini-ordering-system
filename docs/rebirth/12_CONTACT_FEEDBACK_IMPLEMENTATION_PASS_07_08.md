# TUSCANINI REBIRTH / PASSES 07–08 — CONTACT, REVIEWS, COMPLAINTS
Date: 19 October 2026. Working branch `redesign/tuscanini-authored-experience-20261018`. Draft PR #59 — no merge.

## Method source (from user uploads), without cross-project styling
- `Omar_Khair_Product_Creative_Operating_System_v1`: R0 reality → user/job/context → narrow problem brief → authored execution → real browser QA → closure. Remember: **The workflow repeats. The answer must not.**
- `Omar_Khair_High_End_Portfolio_Workflow_Playbook_AR`: bounded passes, visual review, first-five-seconds scan, responsive review, re-benchmark when needed. QA in service of design.
- `HILTECH_MASTER_HANDOFF`: differentiate discover/understand/transact speeds; the user should not replay discovery while seeking direct contact.
- `BALCONA_FULL_PLATFORM_MASTER_CONTINUATION`: real data/permissions/operational truth and no fake provider success. **Never import Balcona customer workflow into Tuscanini.**
- The portfolio continuation prompt is closure-discipline reference only; no reused portfolio fonts/geometry/case-story UI.

## A. Contact — physical wayfinding and direct access
**Person/job:** visitor or customer wants current contact/location fast, usually on a phone.

Original route: generic PageHero + repeated white cards, static pseudo-map placeholder. New route:
- `app/contact/page.tsx` (server route with runtime public settings, fallback is recorded `siteConfig`, not independent live phone/location reconfirmation)
- `app/rebirth-contact.css` (ink contact placard × yellow physical address sign; prominent direct call / WhatsApp / Facebook links, no decorative invented map).
- Phone `tel:` links only when numerically valid; normalized WhatsApp `wa.me`, HTTPS Facebook host allowlist, safe external link rel.
- Clearly identifies unknown **exact map pin**, working hours and delivery policy; customer is directed to confirm with restaurant.
- Contact is in one `RouteShell` authored experience, not wrapped in duplicate legacy site chrome.
- Real typography and hierarchy, no new animation/runtime packages; sticky ordering path still available in shared header.

## B. Reviews — real opinions only
**Person/job:** customer wants to share their experience or find authentic evaluations.

- `app/reviews/page.tsx` and `app/rebirth-feedback.css` are designed as distinct red editorial invitation.
- No testimonials, star ratings or fabricated people because the platform has **no trusted on-site review dataset** here.
- Safe prefilled direct WhatsApp link opens a messaging app. Label explains **the customer must send the message**.
- Alternate dedicated complaint escalation route is available.
- A real 320px screenshot showed an enormous floating quotation mark that added a distracting orphan glyph; **removed the decoration** rather than amplifying motion.
- Doesn't assert that “no reviews exist” on the internet, only that the site does not currently show them.

## C. Complaints — task-first, truthful WhatsApp handoff
**Person/job:** customer has a specific problem, needs to send it to the restaurant without writing everything again.

- `app/complaints/page.tsx` is a dedicated server page, passes live-or-fallback WhatsApp contact value to `components/rebirth/rebirth-complaints-form.tsx`.
- `app/rebirth-complaints.css`: calm pale top and ink-form field, accessible cream controls, high contrast; no poster-style animation in the actual form.
- Existing category, optional customer name/contact and required description preserved, with max lengths, clear validation and accessibility attributes.
- Form builds explicit WhatsApp text, opens messaging app on user submit; **does not store a complaint in Tuscanini backend**, does not send it silently, and never asserts restaurant receipt or resolution.
- Blank complaint doesn't open a URL; valid input opens a message draft, then displays that actual sending is the user's job. A visible fallback link covers blocked windows. No sensitive payment card data requested.
- We did not implement fake “ticket created”, webhook or phantom resolution lifecycle.
- 320px first browser proof showed a strong usable form with the actual fields and yellow submit call, plus separate route to call restaurant.
- A naive initial test counted all HTML `header` tags and confused the valid semantic section header inside `<main>` with duplicate app chrome. The correct gate checks exactly one `.t-header`, one `main`, one `.t-footer`. Do not delete semantic headers to satisfy incorrect selectors.

## Visual direction and source-of-truth decision
Three separate personalities, one brand:
- Home = exploratory food, actual photos.
- Contact = place, direct utility.
- Reviews = human invitation, no borrowed ratings.
- Complaints = calm honest form, no fake success.

No additional photographs on these routes because a literal food shot would crowd out the primary user job. No GSAP/Three/WebGL dependencies. Current 640px originals are used only where physical media serves a scene.

## QA requirements
- Four full route screenshots at 320,390,768,1440 for Contact, Reviews and Complaints. Preserve the earlier full-site views.
- Browser: no duplicate app chrome, no horizontal overflow, direct and sanitized contact destinations, no invented operating hours/location; no unverified ratings.
- Complaints: empty input fails locally; non-empty drafts correctly build a WhatsApp URL; no implied successful server-side submission.
- Reduced motion and keyboard focus follow base shell; full screen-reader and production service tests remain for integrated final gate.

## Larger still-open project gates
- Real menu prices/products when restaurant Supabase data is live, legitimate item photo mapping from higher-resolution originals, full ordering and kitchen truth, safe authenticated operator workflows and atomic/idempotent writes all remain separate work.
- Don't merge Draft PR #59 or update production simply because public creative pages and fixture browser tests pass.
