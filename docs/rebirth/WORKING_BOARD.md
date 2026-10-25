# TUSCANINI REBIRTH — ONE WORKING BOARD

**Last audited (including broad capability scan):** 2026-10-22 | **Branch:** `redesign/tuscanini-authored-experience-20261018` | **PR:** [#59 (DRAFT)](https://github.com/omarkhair70-droid/tuscanini-ordering-system/pull/59) | **Audited code checkpoint:** `82a1a262d41ff78b2dd56546a410cdbb3125b3f1`.

> **Start here in every new chat, and update this SAME FILE after every meaningful feature/review.** This is the current execution and coverage index; historical `00–38`, original research, the HTML reference and technical handoffs remain evidence, not competing "next task" lists. Use the current GitHub PR HEAD and Actions results if newer; never assume this snapshot is the HEAD forever.

### Public launch fixture-boundary test corrections (25 Oct 2026)

- Initial release UI build/TypeScript and Dedicated API passed, but populated-cart visual test was outdated: it required address/contact fields even when intake is disabled. It now explicitly verifies either open Cart → customer fields → summary OR closed Cart with an earlier notice and NO contact input.
- In isolated PostgreSQL, real Next customer-cart → server-priced order → operator inbox → tracking passed, but synthetic 20-ticket **visual** fixture was not enabled in that test runner. Added `TUSCANINI_INTERNAL_VISUAL_QA=yes` **only** to the ephemeral `studio-next-integration` CI job, not Vercel/production. The browser and backend visual steps need fresh success on this commit.

### Legacy pitch/demo visibility correction (25 Oct 2026)

- `/demo` contained an outdated MVP roadmap and unsupported claim that old menu prices were current restaurant prices. This route now returns **404 outside explicit internal visual CI**; it is additionally `noindex`. It is not customer-facing collateral. No demo marketing/menus promoted to the production preview.

### Public-facing finish pass — no synthetic operator orders or dead checkout forms (25 Oct 2026)

- Owner direction: this is a customer/merchant-facing final product surface, **not a demo interface**. No new system or speculative features were commissioned. Preserved PR #59 Draft and historical data safety gates.
- **Operator deployment gate:** if there is no real Oracle/localhost orders backend, `/operator/orders` now displays a well-designed unavailable state rather than **20 fabricated tickets**. Interactive 20-ticket designs only exist under explicit server-only `TUSCANINI_INTERNAL_VISUAL_QA=yes` in the GitHub browser suite. Query `?preview=20` no longer activates a fictitious queue in an ordinary deployment; active real operator controls conceal the preview toggle by default. Operator page is `noindex`.
- **Checkout honesty before customer data:** when `isOrderingOpen=false`, a customer can keep/edit items but sees an early short notice and direct /contact route. Contact/address form and final confirmation checkbox are not displayed; the final action becomes contact rather than a disabled nonfunctional submit. Once intake is truly open, original contact validation, pickup/delivery, server submission, prices and order tracking stay unchanged.
- **Product sheet:** compact human-facing Arabic eyebrow, plain option legends, character count on optional notes, readable quantity × unit price before delivery and accessible live total; small-screen footer adjustments retain native dialog and original forward/reverse FLIP and focus behavior.
- QA uses an explicit **CI-only** fixture gate; no Vercel/merchant order intake toggles were touched. Screenshot CI/build must prove this SHA; then physically inspect 390/1440 page evidence. Merchant menu, fees and customer order go-live approvals are still open.

### Browser reference correction after image curation (25 Oct 2026)

- First screenshot CI on `6ee44b2` completed build and source/media verification, then stopped in the specifically focused `cm8` screenshot assertion because it still hard-coded old image `B04-02`. The curated Fajita beef image is deliberately `B04-06`. Updated **only that source expectation** in `rebirth-populated-menu-visuals.mjs`; rerun on this HEAD and inspect full browser result. No customer runtime image or price changed in the correction.

### SKU illustration truth pass — audited actual atlas and removed random matching (25 Oct 2026)

- **User-reported defect reproduced in source:** `crepe-meat`, chicken, specialty crepes, pasta, and pizza silently chose an illustrative frame by a hash of the item's ID from a broad family bank. For example, `cm2` (سوسيس) had no link to a sausage-specific image; `ct2` (دوز كرانشي) could show generic grilled chicken. Independent visual review of the 100-frame full 1440px atlas found actual B04-05 sausage crepe, B09-10 fried crisp strips, and B07-03 pepperoni vs other pizza toppings.
- **Code correction:** `CURATED_VISUALS` explicitly lists all 113 historical SKU IDs. 64 individually curated *food-form-appropriate illustrative* assignments use retained originals; 35 receive their unique named original artwork until a defensible photo exists; 14 512px supplementary concepts remain enabled. No pseudo-random photo assignment exists for any SKU. Especially `cm2` = B04-05, `cm3` mix = drawn, `ct2` crunchy = drawn, `pm3` minced pizza != pepperoni B07-03, `cx1` potato != cheese photo.
- **Temporary art hold:** Six new conceptual files remain committed, but `sf5`, `sf6`, `dr5`, `dr6`, `ca4`, `ca5` now render SKU-specific drawn artwork, *not* their compositionally incorrect draft 512px photos. This does not delete any of the 120 generated files nor touch merchant prices, cart/order APIs, launch settings, or PR Draft.
- Browser smoke expanded for named sausage, crunchy, drink and add-on truth at 390px; source audit asserts 113 explicit mappings. **Only CI passing and rendered screenshots after this commit establish code behavior; merchant photo approval stays 0/113 and field UX not signed off.** The previous "all 113 have photo" framing was incorrect: all have **artwork**, not exact named food photography.

### Creative Finish — 20 additional conceptual SKU visuals committed (24 Oct 2026)

- **User request:** install both ten-image batches on the Tuscanini Rebirth draft, not just hand over ZIPs. Twenty WebP assets stored as Git binary blobs under `public/images/rebirth/supplemental/<SKU>.webp`, 512×512 optimized, mapped by stable original catalog IDs in `lib/rebirth/supplemental-menu-media.ts` and rendered through existing `ProductArtwork` with `data-kind=generated-illustrative`. They do not enter the original 100 WebP atlas nor overwrite a verified photograph.
- All twenty concept assets are selectable on the **draft** Menu and product dialog when the preexisting generated-media gate is active. `NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES=off/not-ready` still disables ALL unverified locally generated media and returns original safe graphics/stock. First-page tuna illustration, 6 drinks and 6 crepe add-ons now have stable separately auditable illustration IDs.
- **Visual truth and launch gate:** all concepts are not merchant photos. Six are flagged for more exact artist/restaurant verification: `sf5` (mixed beef/chicken not evidenced), `sf6` (fries but not fries *baguette*), `dr5` (Twist packaging/flavor unknown), `dr6` (Fayrouz packaging/flavor unknown), `ca4` ('كونو' meaning unknown), `ca5` ('رول' meaning unknown). Site uses the preexisting note 'الصور للتوضيح'; exact-product photos not approved. Keep flagged concepts out of owner-approved production claims until reviewed.
- Visual/browser QA expanded to request all 20 distinct WebPs, assert new SKU image and named drink/add-on mappings. Source audit validates local RIFF/WEBP files and 100 originals remain separate. Same catalog, all 113 products, previous prices, modifier logic, store operations and intake flags.
- New CI and Vercel screenshot review **pending** on this commit. PR #59 remains Draft; main/production unchanged.

### Creative Finish — Menu quick-find moves into first scene (24 Oct 2026)

- Kept the authentic restaurant photo pair and editorial type, but moved the ONE existing menu search (not a duplicate form) into the first hero's copy so finding food does not require scrolling beyond documentary photography. It continues to search across all 16 food families and preserves deep-linked category semantics.
- When a term is typed, show a live cross-menu result count and an explicit button to jump to the results; pressing Enter also takes the guest to those results, with reduced-motion respect. The original source/price disclaimer, all original 113 products, quantity/customization, and cart remain untouched.
- Made the search card compact and legible against the black photo-led intro on 320/390, with mobile images shortened modestly to offset its new position, keeping two genuine photography sources. Browser QA updated to assert that exactly one search lives in the first scene and results have a visible quick jump.
- This is a focused UI code change pending independent CI and fresh screenshots; not a completed visual signoff or production-ready menu. **No customer intake flags, Oracle catalog, merchant prices, or images changed.**

### Missing named-SKU visual production — 20-image inventory (24 Oct 2026)

- Exhaustively identified 20 currently unmatched SKU image IDs (4 savory dishes, 4 appetizers, 6 drinks, 6 crepe additions), see `docs/rebirth/MISSING_SKU_IMAGE_SHOTLIST_2026-10-24.md`.
- ImageGen returned **menu poster composites rather than twenty standalone product photographs**. A 20-file experimental WebP candidate ZIP and an HTML preview were prepared in the originating conversation, but those extracts have low source resolution and several dish/brand mismatches. They are **not an approved asset delivery and are not published to the customer site**. No broken image asset is implied: each missing SKU still has unique branded SVG art in `ProductArtwork`.
- Exact single-SKU generation, quality inspection and owner verification remain OPEN. The 100 original generated WebPs are still intact. Do not change pricing, launch flags, or branch merge state to address art.

### Creative Finish — source-truth photo selection (24 Oct 2026)

- Browser Screenshot & Asset Gate **SUCCESS** on quick-find commit `b314438`, alongside Home CI, PostgreSQL API and Backend V2 suites; the same SHA was Vercel READY. New photo-review changes below require fresh independent CI.
- Inspected actual original 100-image generated visual atlas against the 113 historical SKU audit. Found materially misleading candidate reuse: chicken-crepe reference art in the beef pool, round-bun burger studies in French-bread sandwich choices, beef-burger images for named chicken burgers, and stock juice/side photographs silently substituting for packaged drinks, pickles, sauces and similar nonmatches. Repetition is partly unavoidable where fewer distinct category-correct images exist.
- Scoped matching by actual represented food formats: beef crepes use beef reference studies; French-bread sandwiches never inherit burger-bun art; named chicken Kaiser burgers pick from the chicken-burger studies; tuna crepe, fries-only sandwich, and mixed filling with no suitable generated study use drawn SKU art instead. When the 100 generated photos are available, unknown products remain **original illustrated graphics**, not generic Pexels stock. A historical no-generated-media fallback also avoids branded drink and non-potato side misrepresentations.
- First automatically triggered Home typecheck on `f8e2aab` found TS2367: drink categories were already returned early in the safe-fallback policy, leaving an unreachable old `else if drinks` branch. Removed only that obsolete branch; fresh CI is required to confirm the correction. No feature or catalog change.
- Added source-invariant audit checks and updated the original 4-viewport browser assertion to reflect one deliberately drawn tuna crepe in the first 20, without relaxing 113 stable product IDs or any existing photo-load semantics. No new images, changed prices, live ordering flags or operational routing. PR remains Draft and unmerged.

### New-chat exact resume checkpoint — 23 Oct 2026 (last reviewed)

**User instruction:** Continue the actual existing Tuscanini Rebirth work, NOT a new design/codebase. User wants holistic creative/experience finishing, full on-site editorial pass, typography/illustrations/icons/photography, menu/cart/checkout/operator/tracking, all route copy free of cringe developer commentary, UI at desktop/mobile/tablet, contextual motion, references, and restaurant production-readiness, with no repeat image generation of the 100 generated images. Do not ask them to repeat goals or reintroduce 20 isolated Terminal tests.

- **Canonical project:** `omarkhair70-droid/tuscanini-ordering-system`, branch `redesign/tuscanini-authored-experience-20261018`, draft PR #59. Maintain and update **this same board**; code and design history in repo plus original Tuscanini brief/creative lab. Retain existing imagery and secure Oracle/Coolify app/data. Do not merge draft PR automatically.
- **Creative implementation already COMMITTED:** shortened client-facing Arabic for 9 routes/components (Offers/About/Contact/Reviews/Complaints/Food Finder/Menu/Checkout/Tracking), including removing English internal research labels from public screens; improved Arabic hero typography/focus in `app/rebirth-home.css`; shared persistent actual order status strip under `ExperienceHeader`, wired to real server tracking without inventing ETA/Live Activities; local order status is not a native push/lock screen notification. No images regenerated. Existing original 100 generated assets stay in repo.
- **Evidence and live status at handoff:** GitHub current PR HEAD `bc73fe14fd6cb9f530074ef3bf8a99fcad9c73b6` when checked. At that SHA Home, dedicated API PostgreSQL and Backend V2 suites completed **SUCCESS**, Screenshot/Browser suite **IN_PROGRESS** at last check. Latest Vercel branch Preview **READY** is SHA `b8d77b65b658...`: `https://tuscanini-ordering-system-gqhd28f9m-omarkhair70-droids-projects.vercel.app/`, and prior READY `b6e4301...`: `https://tuscanini-ordering-system-be0fcsmhy-omarkhair70-droids-projects.vercel.app/`. Verify current PR HEAD and Vercel deployment again; never assume post-READY commits were deployed.
- **Oracle backend:** deployed to Coolify Tuscanini only, HTTPS `https://tuscanini-orders-api.duckdns.org` and ready endpoint `/readyz` user confirmed `200 {"ok":true}`. PostgreSQL 113 historical test SKUs imported and one fake 145 EGP ticket reached live Vercel operator screen, completed staff lifecycle per user; authenticated positive 200 and anonymous 403. Coolify test gates `ORDER_API_ACCEPT_ORDERS=no`, `CATALOG_SYNC_ENABLED=no` confirmed off by user after trials. User later reported successful `Deploy` with the newer API image. Vercel public `isOrderingOpen=false` (previously verified). No public merchant orders authorized yet; menu/prices are from previous catalog, not owner-approved.
- **Editorial criteria:** Original `INSIDE / OUT` creative exploration was NOT owner-approved final visual system; evaluate deployment and actual research sources rather than freeze red/yellow/black by inertia. Remove process apologetics/meta-claims from public screens but retain material transactional safety notices. User expressly wants a genuinely human, fast, legible and minimally *frictional* restaurant journey, not a generic minimalist site. Typography stack Changa/IBM Plex Sans Arabic/Anton; `MaterialGlyph` SVG set drawn in-house. Review 320/390/768/1024/1440, focus/reduced motion/real devices, image SKU identities, clarity of product choices.
- **Next EXACT task:** check current browser screenshot & interaction CI on latest source; inspect screenshot artifacts for original design regressions; verify latest Vercel matched. Continue holistic, route-by-route UI/copy cleanup and visual consistency (with concrete code changes), then image mapping/crops/motion and on-site tracking bar. For **native lock-screen order progress** iOS Live Activities/Android ongoing notification, separate mobile/PWA feasibility and platform support; do not promise a plain WebView alone creates OS system progress. Online payments only after merchant/provider contract, do not fabricate gateway. Finish customer Cart→Oracle→tracking live full-flow and real merchant operations/backup before public intake.

### Creative & Experience Finish — continuity pass 24 (23 Oct 2026)

- Resumed from PR #59 HEAD `9ce7f2b0dc6d` without rebuilding or regenerating the 100 media assets. Latest checked Vercel READY before this pass was `b8d77b65b658`; later commits (including this pass) have **no verified READY preview**. Vercel combined status at the prior HEAD reported a Hobby build-rate-limit failure; do not trigger manual redeploy storms.
- Browser CI at prior HEAD was **failure despite clean compilation/media/visual-capture steps**: eight assertions at four viewports expected copy that editorial review already shortened (pending and rejected labels). Updated semantic assertions to match truthful, human-facing order descriptions; added explicit rejection ≠ buyer cancellation wording and clearer wait-for-confirmation sentence.
- Backend V2 Django/Postgres and TypeScript/Postgres isolated transactional proofs passed, but a two-window browser test timed out after operator `start`; it refreshed the client before proving the operator mutation had landed. That fixture now waits for the next server-backed permitted action on the operator card before refreshing customer tracking. This is **a test-race correction, not proof of live customer-to-Oracle checkout**. Fresh CI must confirm.
- Removed duplicated legacy active-order banner from Menu (the shared header status strip now owns site-level continuity; Cart retains its own full active-order card). Menu name search now searches across all 113 historical menu items even if a food family was previously selected, visibly explains its scope and discloses shown/total results. Added focused field cue, tightened no-match copy, and mobile heading wrap.
- Mobile authored navigation now manages keyboard focus while open, closes on Escape, restores toggle focus and avoids background scrolling. Existing MaterialGlyph iconography retained; no new fonts, glyph sets, generated food images, spurious motion or claims of payment/ETA.
- **Evidence boundary:** Improvements are code changes awaiting automatic post-push Actions and matching deploy. No manual rerun of already-passed suites; inspect only the changed gates. PR still DRAFT. Keep `isOrderingOpen=false`, `ORDER_API_ACCEPT_ORDERS=no`, `CATALOG_SYNC_ENABLED=no` until merchant approval. Visual art direction (real crops across actual screenshots, 100-picture SKU mapping, desktop/tablet/mobile photography, and operator physical environment) still requires a verified preview/visual review. Do not call this final launch clearance.

### Guest-first tracking art direction + inspected screenshot atlas (23 Oct 2026)

- **Actual evidence before this revision:** 0ae64525 CI all **4/4 SUCCESS**: Home [39931908976](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39931908976), Dedicated API [39931908723](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39931908723), Backend V2 [39931909002](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39931909002), Browser Screenshots & Asset Gate [39931908743](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39931908743). Auto-Vercel Preview at 0ae was **READY** and SHA-matched: `https://tuscanini-ordering-system-cklsrg708-omarkhair70-droids-projects.vercel.app/`. Do not call a later commit READY until Vercel validates it; all subsequent CI is automatically triggered, not manually requested.
- **Real image-backed route walkthrough:** inspected GitHub Actions screenshots at 390px for Home, Menu, Offers, About, Cart, Tracking, Contact and Food Finder, with 320/768/1440 interaction and layout confirmations from browser CI. Home entry identity/photography is strong; menu photo-led hero is appealing but browse starts after a long scroll and food-family visuals sometimes repeat; About and Offers are legible, Contact/Finder keep straightforward choices. Cart's pickup-first transaction is readable; the Tracking hero `الطلب له حكاية` crowded out actionable status on narrow screens.
- **Final editorial correction in this pass:** redesigned Tracking's first impression from advertising headline to customer-purpose `تابع طلبك.`, compressed the dark hero's mobile and desktop height without changing the authoritative ticket, facts, safety descriptions or 15-second status polling. Removed redundant 'process rationale' from the after-ticket panel, retained a direct help path and accurate invalid-link state. Shared header CTA now truthfully says `افتح المنيو` instead of `اطلب دلوقتي` while merchant order intake is closed.
- **Photo mapping facts from CI artifact:** historical menu 113 SKUs, 100 generated illustrative photos, 96 menu entries assigned one of those photos, 65 unique photos appearing across the assignments, 100 discoverable via atlas, and **zero owner-confirmed exact dish photographs**. Reuse and visually similar crepes are known; do not invent exact SKU-photo identity or force an inappropriate image onto unsupported drinks/sauces/tuna. The 12 authentic restaurant images remain only branded/family/editorial context.
- **Motion and icon QA:** the original custom MaterialGlyph set and FLIP view transitions are retained; the 0ae browser suite verified real scrolls/photographs, reverse image animation, Escape, focus and reduced motion. No decorative animation or glyph package added without need.
- **Unfinished / owner-dependent:** approve actual menu products/prices/photos, operational availability, delivery geography and charges, opening hours, payments/provider choice, notifications, staff hardware and real Cart→hosted Oracle checkout in a privileged QA path. Leave **`isOrderingOpen=false`**, `ORDER_API_ACCEPT_ORDERS=no`, `CATALOG_SYNC_ENABLED=no`; never infer preview or CI evidence is merchant go-live. Draft PR unmerged. This same Working Board remains authoritative; follow-up visual comparisons should use the next SHA-matched screenshot artifact.

### CI last-mile correction — invalid tracking URL (23 Oct 2026)

- Post-editorial commit `d605cfbfa656`: Home, Backend V2 and Dedicated Order API workflows passed, including the full studio two-device integration. Screenshot/image decoding/reduced-motion work was unaffected. Browser interactions reported precisely **4 failures** (320, 390, 768, 1440): the test expected the intentionally removed phrase `معندناش مرجع` for an invalid tracking URL.
- Changed *only* the obsolete direct-URL assertion to require the new plain-language heading `مفيش رقم طلب صالح هنا` and to assert **no `.t-order-tracking` ticket is rendered** without a valid order identifier. This tests the security/UX outcome, not merely the exact marketing copy. No order APIs, fixtures, media or production flags changed. CI following this commit is pending independent confirmation; Vercel Hobby build-rate-limit still blocks a latest-SHA PREVIEW, the earlier 0ae64525 Preview remains last READY.

### Creative Finish — customer voice, Arabic type and persistent order status (23 Oct 2026)

- After full cross-route content/creative audit, condensed customer-facing copy on **9 pages/components**: Offers, About, Contact, Reviews, Complaints, Food Finder, Menu, Checkout and Order Tracking. Removed internal meta-commentary such as `NO INVENTED RATINGS`/`MENU DATA / MISSING` and long process rationales without pretending historical prices are approved or that WhatsApp/online payments have been sent. Kept short truthful notices near transaction controls.
- Applied Arabic type refinement in `app/rebirth-home.css`: less aggressive headline tracking/line height, matched focus-visible controls/inputs and safe readable Arabic labels; retained existing Changa/IBM Plex Arabic/Anton ecosystem and custom `MaterialGlyph` SVG set. Existing reduced-motion rules remain intact; no new hero/assets regenerated.
- Built shared **on-site order status strip** `components/rebirth/active-order-status-strip.tsx` under `ExperienceHeader` on authored customer pages, with status from same server `/api/orders/track` as full receipt, 15-second visible-only polling, safe stale feedback, and 44px-ish follow action. It does **not** invent ETA or promise native iOS Live Activities/Android notifications. Replaces previously bulky home-only `ActiveOrderBanner` placement; cart retains its own detailed saved-order banner; order-success retains full tracking ticket.
- Added mobile browser QA assertion: after mocked cart checkout and redirect, revisiting Menu shows actual local saved order ID and server-derived status strip; navigation doesn't resubmit. No new order is created on Oracle by this fixture.
- Further shortened order tracking facts and assistance copy, preserving precise cancel/refund disclaimers; suppresses irrelevant empty table-reference row on standard pickup/delivery tickets.
- **Deployment and proof caution:** at latest check branch `b6e4301` was Vercel READY with four CI suites passing *before* newer strip edits. Newest code changes have **not** been proven live until matching Vercel deployment is READY and current CI (especially screenshot/browser and Home TS) finishes. PR #59 remains Draft. Do not change customer intake flags or merge on this creative pass.
- **Next:** verify latest CI/UI, check screenshots especially 390px overflow and Arabic display headline after type changes; measure shared bar legibility and focus at 320/390/1024. Still need full photography-to-menu audit, coherent icon/motion usage, proper merchant-approved operational content; native lock-screen Live Activities require mobile platform support beyond a web progress strip.

### Test intake gates closed after first ticket lifecycle (23 Oct 2026)

- User confirms both temporary Oracle test switches have been turned OFF after first full synthetic staff ticket lifecycle: `ORDER_API_ACCEPT_ORDERS=no` and `CATALOG_SYNC_ENABLED=no`. This is **user-reported**; no admin console screenshot or fresh runtime check was performed.
- Independent public-site setting from the latest fetched Preview was `isOrderingOpen:false`; Vercel `TUSCANINI_ALLOW_CATALOG_SYNC=no` as previously set. Preserve all these OFF values until a controlled, explicitly approved merchant go-live.
- The remaining customer-flow work is the regular Home/Menu→Cart→Checkout→`POST /api/orders`→Oracle→Order Success/Tracking path. Existing code checks `isOrderingOpen` in both the customer UI and the Next route; don't relax the public gate or turn on real intake without a private, authenticated, isolated test path and owner signoff. Current validated result is the database-backed staff order flow, **not** a confirmed cart checkout.
- Next work should be a focused code/review sprint and one consolidated branch Preview deploy, not repeated user-driven Terminal checks. PR #59 stays Draft. Avoid misrepresenting historic 113-item prices as approved.

### Full synthetic order operator lifecycle reported successful (23 Oct 2026)

- **User now reports `Success`** after being asked to click the four steps on the real Vercel `Operator Press` for the PostgreSQL-backed trial ticket: `accept → start → ready → deliver`. Treat staff-side lifecycle as **user-reported successful**. Order persistence after a hard browser refresh and the PostgreSQL event ledger are **not independently audited**; verify with a read-only query if needed.
- Import had already succeeded on deployed Oracle: `SYNC: 200 {"ok":true,"count":113}`; `MENU: { total: 113, available: 113 }`. Both 113-SKU menu prices and this 145 EGP order are **synthetic/historical test data**, not merchant-accepted revenue.
- **Immediate security/operational shutdown after test:** in only Tuscanini Coolify app set `ORDER_API_ACCEPT_ORDERS=no`, `CATALOG_SYNC_ENABLED=no`; Save and Deploy, confirm Healthy. Do not assume toggles are OFF without user confirmation. Vercel `TUSCANINI_ALLOW_CATALOG_SYNC=no` was already set server-side. The store's `isOrderingOpen` setting is still `false` in previously fetched deployed Preview.
- **Next G03 checkout gate:** the ordinary customer Checkout reads `GET /api/public/site-settings` and disables submission when `isOrderingOpen=false`, and `/api/orders` independently requires ordering open. Therefore a real customer Cart→Checkout→Oracle test cannot currently be run without a controlled staff-only test bypass of BOTH guards, or opening the public store. Prefer **staff-authenticated temporary QA checkout** that never flips the public storefront ordering flag, never uses real customer contact information, and never claims restaurant readiness. Do not open live checkout to all visitors simply to demonstrate one test.

### Oracle synthetic live order visible in Vercel operator UI (23 Oct 2026)

- **User screenshot confirmed first end-to-end API-to-operator ticket:** hosted Preview `/operator/orders` rendered **LIVE QUEUE 1**, **INCOMING 1**, and real ticket customer name `اختبار توسكانيني - لا تحضر`, note `تجربة تقنية فقط - لا تحضر أي طعام`, product `تشيكن فاير` x1 with selected size `سعر واحد` and `موتزاريلا`, `145 ج.م` subtotal from Oracle DB catalog. This is the *real PostgreSQL-backed order* created directly through authenticated API from the deployed container, not client-side synthetic 20-order preview.
- User says `خلصانه` and screenshot shows action buttons `اقبل الأوردر` / `اعتذر عن الأوردر` active. **Not yet verified**: staff accept→start→ready→deliver transitions, persisted event ledger, remote customer tracking, user website Checkout→Oracle creation, and mobile/tablet foreground/background.
- **Immediate request:** click `اقبل الأوردر` then `ابدأ التحضير` then `الطلب جاهز` then `تم التسليم` in same Vercel operator screen; check counts move and reload preserves final order state. Run read-only server SQL for one synthetic order status and status events after, then switch Oracle `ORDER_API_ACCEPT_ORDERS=no` and redeploy until full merchant rollout. Disable catalog sync flag `CATALOG_SYNC_ENABLED=no` if not yet returned to no. The 113 SKUs and prices remain sample/historical until owner approval. Production/main website is still separately gated; preview success is not release approval.

### Oracle production-hosted test catalog successfully populated (23 Oct 2026)

- **User-provided live Coolify Terminal output confirms successful catalog import:** `SYNC: 200 {"ok":true,"count":113}` and `MENU: { total: 113, available: 113 }`. The 113 pinned GitHub historical menu items were written to **actual Oracle-hosted** `tuscanini.menu_catalog`, NOT just disposable GitHub CI PostgreSQL. This closes initial catalog seeding for TEST; not a declaration of restaurant-approved prices.
- **Close the import gate now:** set `CATALOG_SYNC_ENABLED=no` in `tuscanini-orders-api` Coolify environment and Deploy to reload. Vercel admin import flag already `TUSCANINI_ALLOW_CATALOG_SYNC=no`. Do not rerun import automatically.
- **Next controlled end-to-end step:** with web ordering setting still `isOrderingOpen=false`, set only Oracle `ORDER_API_ACCEPT_ORDERS=yes`, redeploy, and run ONE synthetic pickup order via authenticated localhost `/v1/orders`. Use `requestKey='studio-'+randomUUID()`, customer `name='اختبار توسكانيني - لا تحضر'`, `phone='01000000000'` (fictional), `address=''`, `orderType='pickup'`, `generalNotes='اختبار تقني فقط - لا تحضر أي طعام'`, `items:[{kind:'product',productId:'ct3',sizeId:'single',addonIds:['addon-mozzarella'],quantity:1,itemNotes:'اختبار فقط'}]`, `tableReference:null`; expect 200 and `subtotal_cents='14500'` (125 EGP size + 20 EGP addon). No real customer, no payment, no dispatch. Staff should see the real ticket on latest Vercel `/operator/orders` using separate staff passkey and advance it through accepted→preparing→ready→delivered; verify order tracking status and retry safely. Keep `ORDER_API_ACCEPT_ORDERS=no` after test until merchant rule review and storefront end-to-end.
- This is a **database-backed order simulation** in the deployed server, not yet a user checkout from the public shopping cart. Site `isOrderingOpen=false` is unchanged. Preserve test order as marked synthetic or archive via separately reviewed procedure; never pretend it is customer revenue.

### Pinned full-catalog fixture CI + Oracle one-shot Terminal path (23 Oct 2026)

- Added **immutable-source** fixture `services/orders-api/fixtures/historical-menu-2026-10-23.json`, generated strictly from `lib/mock-data.ts` `featuredItems`. File has **113 unique product IDs**, current repo historical sizes/addons/price cents, `37286` compact JSON bytes (<150000 service API body limit), and no secrets or customers. Example SKU `ct3` (تشيكن فاير) single-size 12500 cents, mozzarella option 2000 cents. **Test prices, not merchant-approved live prices**.
- Added PostgreSQL 16 CI that POSTS this exact JSON to the isolated catalog-sync API on disposable DB, asserts 113 imported and verifies total rows and example prices. [Tuscanini Dedicated Order API PostgreSQL #39899072518](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39899072518) **SUCCESS** at code SHA `d524cb43`.
- **No need to wait for new Vercel deployment to seed Oracle**: user may temporarily set `CATALOG_SYNC_ENABLED=yes` in **only** the existing `tuscanini-orders-api` Coolify resource (Save + Restart), then from its terminal use Node `fetch` to retrieve pinned public GitHub raw JSON at commit `9b72a954ceb7d4a36607a5f8560e92c1c53baca4` and POST to the **loopback** `/v1/catalog/sync` with the existing runtime `process.env.ORDER_API_SERVICE_KEY`. First assert Oracle `tuscanini.menu_catalog` still has **0** rows so this cannot overwrite a merchant-entered catalog, then import and SELECT count=113. Never print the service key.
- Immediately set Coolify `CATALOG_SYNC_ENABLED=no` and **Restart** to close the temporary import gate. Leave `ORDER_API_ACCEPT_ORDERS=no` and website ordering `isOrderingOpen=false` while testing catalog; do not activate checkout as side effect.
- Alternatively the staff-gated menu import UI in `/operator/orders` can be enabled deliberately on a future Vercel deployment, but the chosen immediate Oracle Terminal path needs **no** new Vercel deployment. Vercel admin sync remains disabled (`TUSCANINI_ALLOW_CATALOG_SYNC=no`) as defense-in-depth.

### Empty Oracle menu confirmed / one-click gated test catalog import (23 Oct 2026)

- User ran read-only live SQL in Oracle `tuscanini-orders-api` Terminal: `SELECT count(*)::int AS total,count(*) FILTER (WHERE available)::int AS available FROM tuscanini.menu_catalog` → **`Menu: { total: 0, available: 0 }`**. Backend cannot price or accept any SKU until catalogue is seeded. Staff inbox Vercel→Oracle had already succeeded with 0 orders.
- Repo has **113 historical menu items** in `lib/mock-data.ts` (sizes/add-ons/base prices). These are **test/legacy prices**, NOT confirmed by restaurant owner. Do not enable public checkout merely after import.
- Code now adds an optional, staff-authenticated **'حمّل منيو الاختبار (113 صنف)'** button on the existing `/operator/orders` interface, requiring an explicit browser confirmation and the entered separate operator key. It calls protected `POST /api/internal/orders/catalog-sync`, which publishes the existing source catalog server-to-server using Oracle's service key. On success it shows count and explicitly flags non-approved historical prices. Button only appears with `ORDER_BACKEND=oracle` and `TUSCANINI_ALLOW_CATALOG_SYNC=yes`. Never creates an order or requests payment.
- Vercel environment flag `TUSCANINI_ALLOW_CATALOG_SYNC=no` on Production+Preview: deliberately left OFF because the same 113-SKU catalog can be imported **only from Oracle's loopback** using the pinned JSON; the UI button code remains optional and dormant until explicitly reopened. The independently locked Coolify API still has `CATALOG_SYNC_ENABLED=no` (as last instructed; must be explicitly changed by user), and `ORDER_API_ACCEPT_ORDERS=no`. User action: in **only Tuscanini `tuscanini-orders-api` resource** set `CATALOG_SYNC_ENABLED=yes`, Save + Restart; verify `Running (healthy)`. Open branch Vercel `/operator/orders`, enter staff key privately, click the import button and confirm; expect **113**, then rerun SQL query to verify 113 available/historical rows.
- Immediately after success, turn **both** gates off: Coolify `CATALOG_SYNC_ENABLED=no` + Restart, Vercel `TUSCANINI_ALLOW_CATALOG_SYNC=no` + next deploy. Keep intake `ORDER_API_ACCEPT_ORDERS=no` and public store ordering closed until prices reviewed or a clearly bounded synthetic-order protocol is used.
- If import returns 403/503, check Coolify runtime sync flag, last deployment env capture, Vercel branch READY and staff key. Do **not** transfer database/user secrets via chat, do not paste public catalogue into arbitrary SQL, and do not redeploy an extra Postgres container.

### Vercel-to-Oracle authenticated operator screen live (23 Oct 2026)

- **User confirmed real two-service roundtrip:** on latest branch Preview `/operator/orders`, they entered their distinct staff key privately and the connected queue returned **0 orders / success**, consistent with the earlier authenticated Oracle API inbox returning `HTTP 200 Orders: 0`. This is the first user-confirmed **Vercel operator UI → Next.js authenticated bridge → HTTPS Oracle API → dedicated PostgreSQL** connection, not a demo queue.
- Previous negative tests also returned unauthenticated `403` from both the public Oracle inbox and Vercel bridge. These are basic positive/negative authorization proofs; not a substitute for long-session, credentials rotation, throttling, replay, access expiry and real hardware tests.
- **NEXT ORDER TEST STILL OPEN:** historical menu data must be explicitly seeded/verified inside `tuscanini.menu_catalog`; main public site settings currently `isOrderingOpen:false`, Oracle `ORDER_API_ACCEPT_ORDERS=no` and catalog sync `CATALOG_SYNC_ENABLED=no`. Do not imply customer checkout works just because staff inbox shows zero.
- Controlled next test should use a **clearly marked synthetic fixture**, fake contact information, and server-calculated price. Demonstrate order create/retry/tracking and staff accept→prep→ready→handoff, and prevent accidental real customer orders; remove/archive demo fixtures afterward. Only then review owner-approved catalog/fees/payment policy before real intake.

### Current Vercel branch deployment recovered and verified (23 Oct 2026)

- Despite the earlier **402 Hobby manual create-deployment** error, Vercel now shows a **READY** deployment at commit `fde12d471fd88e8bac50fcbcee972608a5134213`: `https://tuscanini-ordering-system-bwmwi45xj-omarkhair70-droids-projects.vercel.app/`. The deployment was already created automatically; no fresh manual deployment was needed.
- Direct connected Vercel HTTP fetch verified on that immutable deployment URL: `/operator/orders` HTTP **200**; `/api/studio/bridge?resource=inbox` unauthenticated HTTP **403**; `/api/internal/orders/connection` unauthenticated HTTP **403**. Thus unified Oracle switch is loaded in this Preview deployment and unauthorized requests fail closed, but protected end-to-end server connection has NOT yet been validated with the staff passkey.
- `GET /api/public/site-settings` responded HTTP **200** with `isOrderingOpen:false`. Combined with Oracle's independent `ORDER_API_ACCEPT_ORDERS=no`, **customer checkout is intentionally disabled** until controlled catalog/price and private operator test. Do not treat 200 from Vercel page as permission to intake production orders.
- At deployment SHA `fde12d47`, Home CI, Dedicated API/PostgreSQL CI and Backend Spike CI are SUCCESS; Browser Screenshot/Asset Gate was still in progress at last check. Later board-only HEAD commits are NOT themselves evidence of a new READY deployment.
- Next user action: on the latest Preview `/operator/orders` enter the separately-generated Vercel `TUSCANINI_OPERATOR_KEY` into the masked staff-key input (do **not** share in chat/screenshot) and click sync. Expected empty real Oracle queue if secret matches; wrong/missing key must remain 403. If the remote call returns 403/503 inspect Vercel secret consistency with Coolify `ORDER_API_SERVICE_KEY`, never paste the secret. Later move to a single approved production release intentionally; do not merge Draft PR #59 automatically.

### Public anonymous operator API gate verified (23 Oct 2026)

- **User-confirmed external Chrome test:** visiting `https://tuscanini-orders-api.duckdns.org/v1/operator/orders` without an `x-tuscanini-service-key` header returned **HTTP 403 Forbidden**. Earlier **live container test** with service key returned **HTTP 200, Orders: 0**. Together they confirm basic service-key protection from anonymous internet callers and successful authorized Oracle DB read.
- This does **not** replace staff authentication/abuse tests, rate limits, private order-tracking capability checks, real merchant price review or end-to-end order creation.
- Vercel checked again: latest branch Preview **READY** is still SHA `aaa80d67ee` (before the unified Production/Preview Oracle connection code). Fresh deployment API is blocked by Hobby quota `api-deployments-free-per-day`; do not claim current public UI talks to Oracle yet. New code is on GitHub PR #59 (Draft).
- **Next gate:** when Vercel build quota is available, deploy current branch source with existing Production/Preview server-only variables; verify private read-only `/api/internal/orders/connection` and separate staff passkey, then sync reviewed trial catalog and submit a clearly marked fictional order. Oracle intake remains OFF until the controlled transition.

### Verified live Oracle authenticated inbox (23 Oct 2026)

- **New USER-CONFIRMED live container test:** inside the running Oracle `tuscanini-orders-api` container, Node `fetch('http://127.0.0.1:8080/v1/operator/orders',{headers:{'x-tuscanini-service-key':process.env.ORDER_API_SERVICE_KEY}})` returned `HTTP: 200 Orders: 0`. This verifies **runtime service-key authentication**, successful operator inbox query against deployed Oracle PostgreSQL, and no existing orders. No sensitive key or customer data was printed.
- Does NOT verify Vercel's separate copy of the secret matches, an external caller's HTTPS connection, unauthorized-visitor 403, catalog sync, order creation, or UI end-to-end. Keep user-visible claims precise.
- NEXT: verify anonymous public HTTPS `/v1/operator/orders` returns 403; when Vercel Hobby deployment quota resets deploy the reviewed redesign branch with shared Oracle env and exercise protected `/api/internal/orders/connection` via staff passkey; reconcile catalog/current prices and run controlled sample order through tablet. Oracle `ORDER_API_ACCEPT_ORDERS=no` and `CATALOG_SYNC_ENABLED=no` remain OFF until explicit cutover.

### Vercel shared Oracle settings / deployment quota gate (23 Oct 2026)

- Vercel env metadata confirmed: `ORDER_API_ORIGIN`, `ORDER_API_SERVICE_KEY`, `TUSCANINI_OPERATOR_KEY` remain Sensitive and now have **both** Production/Preview targets. New server-only selector `ORDER_BACKEND=oracle` also targets both. Secrets were never read, decrypted, printed or placed in code. Other preview branches may receive these secrets while targeting Preview; revisit branch scoping when collaborator workflow broadens.
- Branch code now uses `oracleOrdersEnabled()` for **both** `VERCEL_ENV=production` or `preview`, but only when explicit selector is `oracle`; existing legacy fallback remains if not selected. A private read-only `GET /api/internal/orders/connection` checks signed Oracle inbox with staff passkey and returns count/connection status, even with customer intake disabled. No public order traffic automatically activated.
- **DEPLOY BLOCK:** Attempted an explicit fresh Vercel deployment from current PR branch through connected Vercel API. The platform rejected the deployment with **402** code `api-deployments-free-per-day`, more than 100 deploys on Hobby for current daily window; response advised retry after `86400` seconds or address account limit. This means the newest code/variables are **NOT YET VERIFIED ON THE PUBLIC VERCEL URL** despite GitHub commits and prior READY previews. Do not merge/push again just to force a new Vercel deployment while quota is blocked; it will not fix the quota.
- Production Vercel still tracks `main` (older code); changing Production env values alone doesn't install the PR #59 Oracle adapters. PR #59 remains Draft and unmerged. After deployment quota reset, release only the reviewed branch Preview first to verify private 403 and signed remote status, then explicitly promote/merge with approval. Do not presume a shared database makes checkout harmless: a created order is persistent, even without payments.
- Oracle API continues with real `tuscanini_orders` Postgres and HTTP readiness healthy (user proof); `ORDER_API_ACCEPT_ORDERS=no` and `CATALOG_SYNC_ENABLED=no` should remain until a controlled historical-menu demo import and owner-safe acceptance plan. Test orders must be marked synthetic and use no real customer PII.

### One backend for both Vercel environments (23 Oct 2026)

- **Owner direction:** do not maintain two different business applications. Production/Preview may have different URLs and deployment branches, but both are configured to reach the **same isolated Tuscanini Oracle/PostgreSQL engine**. Never switch customer traffic by guessing which Vercel target the user means.
- Three existing **Vercel server-only** variables (`ORDER_API_ORIGIN`, `ORDER_API_SERVICE_KEY`, `TUSCANINI_OPERATOR_KEY`) were updated **without changing their values** to target both Production and Preview. All remain Vercel Sensitive values. The server-only selector `ORDER_BACKEND=oracle` was created with target Production and Preview. It does not change behavior on older `main` code that has no Oracle adapter; rollout requires a deployment containing the new branch code.
- New branch source makes `oracleOrdersEnabled()` require only **an explicit** `ORDER_BACKEND=oracle` flag plus `VERCEL_ENV` being Production/Preview. New protected read-only `GET /api/internal/orders/connection` checks the real Oracle operator inbox using the staff passkey sent as header, returns only a boolean/visible count (no PII), and functions even with intake flag disabled. All original customer/order/operator paths stay the same.
- **Hard independent backend gate:** Oracle API `ORDER_API_ACCEPT_ORDERS=no` still blocks HTTP POST /v1/orders, and `CATALOG_SYNC_ENABLED=no` blocks catalog publication until deliberate review. Thus an enabled Vercel route does **not** imply a working public checkout. No auto-payment or notifications are wired.
- **Current blockers:** need new Vercel deployment picking up env changes, then verify /api/studio/bridge unauthorized 403 and signed remote requests; confirm actual menu/catalog, test one deliberately marked synthetic order with approved temporary prices and no real customer PII, then enable intake only when staff-screen behavior is verified. A deployment from `main` won't gain the branch's new functionality just because env targets match.
- **Security:** sharing secrets into the Preview environment means they can be present in other Preview deployments of this project, not only this branch. Restrict Preview to approved branches or use per-branch credentials before adding untrusted PR contributors. Do not put keys in browser URLs, screenshots, client bundles, or the board.

### Oracle Coolify deployment success confirmed / studio CI regression addressed (23 Oct 2026)

- **User reports Coolify `tuscanini-orders-api` Deploy completed `Success`** after being instructed to keep `ORDER_API_ACCEPT_ORDERS=no` and `CATALOG_SYNC_ENABLED=no` and use Deploy (not Restart) to rebuild image from the branch. This confirms successful deployment as reported; `Healthy` **was not separately confirmed** in this turn. Database was not touched, secrets unmodified, and this was not an authorization to enable real order intake.
- On latest board HEAD `b99d95e4`, three GitHub suites SUCCESS (Home, Dedicated API PostgreSQL, Browser Screenshots), while **Backend V2 PostgreSQL Spike** failed in `studio-next-integration` browser at `scripts/qa/rebirth-studio-two-window-browser.mjs:60`: Playwright waited for a delivery-address placeholder after checkout default changed to pickup. Prior backend/DB portion **passed**; a test assumption about the old default caused the failure, not PostgreSQL data loss.
- Fixed that regression in commit `bd5d7e63` by explicitly selecting and confirming `pickup` and asserting the delivery-address field is absent, while preserving the actual two-window customer↔tablet flow. **Fix committed, must verify new CI run conclusion before calling suite green.**
- Latest Vercel Preview READY observed at SHA `1ff953d6` while code edits are ahead; do not infer current Preview contains all new production-readiness behavior. Public `isOrderingOpen=false` previously verified; merchant menu prices remain historical/unapproved. PR #59 Draft.

### Production readiness follow-through / deployment limitation (23 Oct 2026)

- New customer carts now default to **pickup** in `lib/cart-storage.ts`; existing stored delivery drafts are automatically converted to pickup by runtime policy if delivery is disabled. Both server route branches reject unapproved delivery even if browser JS bypasses controls.
- Public `GET /api/public/site-settings` is explicitly dynamic with browser + CDN `no-store` response headers, avoiding stale open/closed state during operations. Customer order tracking is similarly uncacheable/noindex.
- **Attempted a single Vercel Preview deployment** for latest PR SHA through connected API. Vercel returned **HTTP 402 api-deployments-free-per-day** (Hobby, more than 100 deploys). The code is committed, but this latest change set is NOT YET proven present on a READY deployment. Do not suggest repeated attempts circumventing the quota.
- PostgreSQL API integration, Home and Backend V2 suites succeeded on immediate prior branch commit; Browser screenshot E2E for modified pickup-only flow was still running at last check. Later commits will require independently checking their own CI.
- Remaining merchant/go-live requirements unchanged: approved current historical menu/prices, real delivery service area/fee if offered, staff operations, Oracle application rebuild with revised subtotal-lock code, backups, live Cart→Oracle on physical devices, and intentional production cutover. Test intake flags remain user-reported OFF; PR #59 stays Draft.

### Production readiness: pickup-first and private tracking (23 Oct 2026)

- **Owner explicitly confirmed the goal is a real 100%-ready restaurant ordering site**, not perpetual demo. This sprint improves release suitability while leaving public intake flags unchanged and PR #59 Draft.
- **New required delivery policy:** `getRuntimePublicSiteSettings()` now exposes `deliveryEnabled:boolean` from server-only `TUSCANINI_DELIVERY_ENABLED==='yes'`, default **false**. Checkout disables Delivery, explains **pickup only** until real zones/fees approved; an old delivery draft in localStorage automatically switches to pickup and invalidates checked confirmation (saved address remains local, never sent). Both Oracle and old Supabase public POST route paths independently reject delivery with 409 `DELIVERY_UNAVAILABLE` while disabled. Local studio and explicit Browser QA mock route retain delivery enabled for existing test coverage. This prevents placing live delivery orders with undefined total fees; it is not a final delivery fee engine.
- **Privacy:** `/order-success` sets robots noindex/nofollow/noarchive. Customer `GET /api/orders/track` now responds with Cache-Control private/no-store, X-Robots-Tag noindex, and no-referrer policy on 200 and error replies. Tracking links are customer-held capability URLs, should not be publicized.
- **New browser integration regression** simulates a returning visitor with delivery saved, when restaurant disables delivery: checks radio disabled, pickup automatically selected, address input removed and prior confirmation unchecked. It uses fully mocked site settings/no actual order creation.
- **Critical caveat:** `TUSCANINI_DELIVERY_ENABLED=yes` is NOT a substitute for implementing/approving zones, actual fee and final payable total. Leave unset/false until delivery contract is complete. Current live site `isOrderingOpen=false`; Oracle `ORDER_API_ACCEPT_ORDERS=no` and `CATALOG_SYNC_ENABLED=no` were user-confirmed. No visitor order capture was turned on this sprint.
- **Still required before opening a real merchant site:** 113 historical SKU/option prices and stock reviewed by owner; merchant-defined pickup hours/closures, contact/payment policy and delivery zones/fee calculation if Delivery is offered; deploy strict reviewed-subtotal API to Coolify while intake OFF; verify guest CART→Oracle→order receipt→tracking and staff on two separate devices; minimal staff access/session, DB backup restore+monitoring; intentional PR review, main/Production release and combined site/API intake switch. Optional add-ons not required for first launch.

### Pass A preview deployed successfully, storefront still closed (23 Oct 2026)

- **All four workflows GREEN at branch code + board SHA `09ab4dcf51a0c18b05b301b86da1e551a22a6712`**: Home CI, Dedicated Order API PostgreSQL CI, Backend V2 PostgreSQL Spike CI and Browser Screenshots & Asset Gate. Browser test covers simulated mobile Cart→order success→customer tracking; mocks backend, does not create a real customer transaction.
- **Manual Preview deployment now READY** at `https://tuscanini-ordering-system-5p07vy4ho-omarkhair70-droids-projects.vercel.app` for SHA `09ab4dcf51a0`. Direct Vercel website fetches confirmed HTTP 200 `/cart`, `/operator/orders`, `/order-success`; public `GET /api/public/site-settings` returned HTTP 200 `isOrderingOpen:false`; anonymous protected `/api/internal/orders/connection` returned 403. Oracle order intake still user-reported OFF.
- The **new checkout server price-consistency check** in `services/orders-api` passed CI on disposable PostgreSQL but live Oracle Coolify instance **has not yet been redeployed with this change**; do not tell visitors or merchant that production price-lock change is running. Keep intake disabled until isolated API rebuild and controlled pilot.
- One gap remains: real visitor's cart→Oracle create→tracking in hosted environment when safely piloted. Launch depends on merchant-approved historical menu, payment/fees, secure restaurant login/device and backups. PR #59 remains Draft.

### Pass A — browser client end-to-end verification added (23 Oct 2026)

- Added **390px Chromium integration fixture** to `scripts/qa/rebirth-interaction-check.mjs` using a **product** (`ct3` chicken fire + mozzarella) instead of legacy mock offer: full customer Cart with valid synthetic pickup details → one `/api/orders` POST → synthetic HTTP 200 → `/order-success?orderId=<UUID>` → server tracking response → empty persisted cart → accessible private tracking link. Intercepts every order and tracking network request; **no real backend intake and no customer data**.
- This proves the browser handoff *with mocked server responses*, not public Checkout→Oracle production proof. Actual customer ordering remains closed both in Vercel site settings and Coolify flags per user.
- The existing CI PostgreSQL order API succeeded after strict reviewed-subtotal price lock patch; run the latest screenshot/browser gate separately to confirm entire mobile new fixture passed.

### Pass A — real customer ticket linking and price-safe checkout code (23 Oct 2026)

- **User said proceed; implemented Pass A work on PR #59 Draft branch, not merged/main.** Kept Oracle test flags user-reported OFF: `ORDER_API_ACCEPT_ORDERS=no`, `CATALOG_SYNC_ENABLED=no`; public `isOrderingOpen=false`. No production customer order was submitted and no merchant data or secrets changed.
- **Customer follow-through:** real (non-preview) operator tickets now show **'افتح تذكرة متابعة العميل ↗'** opening the same `/order-success?orderId=<real UUID>` that the buyer sees, in a new tab. The 20 fake tickets never render a public customer-link. Tracking ticket now offers **copy tracking link** with an explicit don't-publish reminder and safe fallback instruction. `/order-success` UUID validator now supports versions 1–8 like the Oracle API.
- **Checkout truth:** fixed delivery-address client max length to match Oracle's 300-char limit; pre-submit validation catches overlong address. Next Oracle connector passes customer's `expectedSubtotalCents` from validated Checkout form to the API. Dedicated order API now **locks menu rows, calculates authoritative server subtotal and refuses any order if it differs from the customer's reviewed amount before writing**; missing reviewed amount also fails. Key's payload identity includes that reviewed subtotal. Return code 400 drives 'review prices' message rather than silently recording a different amount.
- **Independent disposable PostgreSQL CI:** order API integration test now asserts wrong/missing subtotal 400, zero created order rows, unchanged success 25000c idempotent retry, stage transitions; dedicated API suite passed after initial code commit. Browser screenshot CI and full branch deployment results must be checked separately for latest SHA.
- **Controlled deployment requirement:** code changes to `services/orders-api/src/menu-orders.ts` are committed but NOT on the already running Coolify image until Tuscanini app is explicitly rebuilt/redeployed (while intake remains NO). Do **NOT** assume the live old API yet enforces subtotal match. New Vercel branch Preview also needs an updated READY build to render the new ticket link/share UI.
- **Customer cart→Oracle live proof still OPEN**: since both public website `isOrderingOpen=false` and Oracle `ORDER_API_ACCEPT_ORDERS=no` remain closed intentionally, the new additions do not bypass merchant closure. Final test is a separately approved guarded synthetic QA/pilot with a proper server-side control; no accountless public intake.

## 2026-10-23 — CREATIVE / UX FINISH: FIRST ACTUAL SOURCE PASS

### Guest-facing editorial clean-up SHIPPED TO PR SOURCE (not yet visually signed off)

- Owner feedback: public site still contained internal designer self-commentary, defensive copy and cringe repetitive clauses; wants comprehensive human-first design on Home/Menu/Cart/Tracking/Operator/secondary routes, not another infrastructure sprint. Maintain INSIDE / OUT as an exploratory brand grammar rather than brand approval.
- **Applied actual copy changes** in 9 source surfaces: `app/offers/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/reviews/page.tsx`, `app/complaints/page.tsx`, `components/rebirth/rebirth-food-finder.tsx`, `components/rebirth/rebirth-menu.tsx`, `components/rebirth/rebirth-checkout.tsx`, `components/rebirth/rebirth-order-tracking.tsx`. Replaced internal mastheads such as `NO INVENTED RATINGS`, `MENU DATA / MISSING`, `PREVIOUS MENU / REAL PRICES`, overly long negative disclaimers, with concise Arabic guest guidance. Retained required factual caveats: non-electronic payment, previous-menu unapproved prices, WhatsApp handoff and order/cancellation semantics.
- **Cleaned image captions** in `app/about/page.tsx`, `app/offers/page.tsx`, and `lib/rebirth/verified-menu-photographs.ts`: internal labels `TSC-06`, `TSC / 11`, `TSC-07` are not public-facing value. Source photo context remains explicit. `ProductArtwork` displays generated illustrative food pictures with accurate alt/accessibility labels; exactly verified SKU real photo manifest **remains EMPTY** pending merchant photo/recipe approval; DO NOT misrepresent generated food or original restaurant category photos as specific served items.
- **Typography and keyboard pass:** `app/rebirth-home.css` protects Changa Arabic hero joining by eliminating severe negative Arabic letter spacing and clipped `.83` line-height, mildly reducing largest headline size, and unifies focus-visible on interactive elements; Arabic tag font treatment uses IBM Plex Sans Arabic and ordinary wrapping. Existing Anton remains the Latin display accent. This is a CSS change, NOT a finished manually screenshot-audited design system.
- **Test contract updated to preserve guest language:** `scripts/qa/rebirth-interaction-check.mjs` now verifies semantic facts through guest-language copy/alt/links rather than forcing retired explanatory prose. Old browser smoke temporarily failed five assumptions repeated across 320/390/768/1440 widths; updated assertions are in commit `89af0cea` but newest CI verdict must be checked. Never revert the human-facing copy merely to satisfy obsolete phrase-matching tests.

### Refined experience principles / final choices to critique in screenshots

| Route/surface | One clear guest job | Visual/editing direction | Proof of finish |
|---|---|---|---|
| Home | Understand cuisine/place and get to menu instantly | 1 distinct INSIDE/OUT moment in hero, visible menu CTA, real photo credibility, no repeated expositional sections | User can reach menu with one obvious action on 390px |
| Menu | Find a specific product or browse meaningful categories | Search/category compactness before excessive editorials, photo honesty, available price and direct dialog action | 113 items never lose prices/options; one-hand category/search and fast scroll |
| Product detail | Decide size/extra/quantity with price clarity | Keep single FLIP detail transition, legible choice controls and image crop; no unexpected ingredient assertions | Choices remain through cart edit, keyboard and reduced motion |
| Cart/Checkout | Correct order once, no hidden cost surprise | Calm, concise transactional hierarchy; explicit pickup/delivery/due-amount, contact reason and no auto-paid impression | Validate complete customer request and server pricing; accurate fees |
| Tracking | Know saved/accepted/cooking/ready/delivered | Living paper receipt remains, 1 strong status label, link private and copyable, no invented ETA | Updates reflect actual Oracle staff actions, refresh failure still truthful |
| Operator | See, accept and move kitchen queue | Two stable views Press/Rail; legible critical mods, distinctive urgency, staff-only entry | Tablet 768/1024; sleep/resume/sound and >20 tickets rehearsal |
| Offers | See genuinely active promotions | Photo is contextual restaurant image, never pretend it depicts current offer; quick menu route if none | Real active offer prices/validity or honest empty |
| Finder | Get help selecting by budget and food type | Friendly compact controls, few words, real available SKU basis | Links back into filtered menu preserve intent |
| About | Feel actual restaurant/place | Short authentic photo essay rather than unverifiable origin/myth or internal evidence narration | Shows original restaurant images and visit/menu CTAs |
| Contact | Call, WhatsApp or locate restaurant | Useful address/phone first, avoid internal data verification language | Correct official numbers and confirmed hours/map when owner supplies |
| Reviews | Share sincere feedback | No fabricated testimonials or rating stars; direct outbound action | WhatsApp drafting not mistaken for saved review |
| Complaints | Get help and send clear details | Short explanation, private field reminders, direct WhatsApp handoff | User understands they must send message, no invented ticket receipt |

### Typography, illustration, interaction and motion

- Keep **Changa** for expressive Arabic titles, **IBM Plex Sans Arabic** for all running Arabic/interface copy, **Anton** only for small meaningful Latin wordmarks/numbering. Arabic joins should not use Latin negative letter-spacing. Aim ≥16px transactional input text, reasonable line-height and hierarchy, 44px touch targets, one obvious primary action/viewport, visible keyboard focus. Verify actual pixel layout, iPhone keyboard and Arabic numerals; CSS changes are not the final screenshot QA.
- Retain original **MaterialGlyph** SVG icon family (fold, cut, box, pizza, crepe, etc.), avoid mixing emojis/assorted external icon sets in branded navigation. Icons never replace accessible text for essential actions; UI icon stroke, baseline and direction all reviewed together.
- Keep 100 existing consistent editorial generated food WebPs and 12 original restaurant source images. Inspect 113 SKU↔art relationships; prohibit false exact-item claims, duplicate family mismatches and poor crop, record remaining unmatched items. Don't regenerate assets as a reflex or show a soda as a milkshake. UI needs one honest source-label convention, not a disclaimer over every photograph.
- Motion: ONE story-bearing hero interaction and purposeful product FLIP/cart feedback, simple predictable ticket-stage change, ~150–280ms utility motion; `prefers-reduced-motion` eliminates parallax/scroll-bound effects and FLIP fallback. Don't add animation just because GSAP exists.

### 2026 research references applied, not cloned

- Baymard **2026 food-delivery benchmark** https://baymard.com/research-articles/food-delivery-and-takeout-ux-benchmark-2026 — menu orientation, options, clear return paths and completion are still major pain points even on large brands; prioritize functional navigation over random animations.
- Baymard menu/cart customisation usability https://baymard.com/research-articles/food-delivery-takeout-launch — editing toppings from basket shouldn't require removal/recreation.
- Pasta Evangelists professional design-system / food photography and basket reference https://www.sean.london/work/pasta-evangelists — compare product/basket information architecture, NOT copy visuals.
- W3C Arabic typography requirements https://www.w3.org/TR/alreq/ — Arabic connecting glyphs, spacing/line-height/RTL numeral handling.
- W3C motion accessibility https://www.w3.org/WAI/WCAG22/Techniques/css/C39 — reduce requested nonessential motion.

### Notification / lock-screen progress feasibility (separate dependency)

- Existing browser `/order-success` already polls current status while open. Web Push for opted-in installed iOS Home Screen web apps and compatible Android browsers is possible via service worker and browser permissions (Apple https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers). **No implementation or notifications permission yet.**
- Persistent iPhone **Dynamic Island / native Live Activity** is **not the same as PWA Web Push or WebView**; Apple documents ActivityKit + native WidgetKit/SwiftUI extension (https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities). Never sell it as browser-only 'easy notification strip'. Design in-site order progress first; implement native only with separate product scope.

### Release status

**User requested full polish, but this is an initial code/brand/copy pass, NOT completed visual approval.** PR #59 stays DRAFT. Operator/Oracle proof established earlier; public order intake is OFF. Before production launch still require owner menu/price/fee/hours signoff, physical browser/device checks, browser→Oracle real checkout proof, approved payment method, backups and staff auth. New Vercel/Oracle deployments require separate confirmation and should not be inferred from committed sources.

---
## 2026-10-23 — COMPREHENSIVE REMAINING PRODUCT REVIEW (CURRENT)

User requested a single, complete review with external UX/visual/restaurant-operations references, NOT more isolated Terminal tests or starting a second product. ONE Tuscanini customer website, ONE operator screen (Press/Rail), ONE dedicated Oracle Postgres/API. PR #59 remains DRAFT.

**EVIDENCE:** Real Oracle API Healthy + HTTPS, authenticated staff inbox success and anonymous 403, 113 historical SKUs imported, first synthetic 145 EGP order shown in live Vercel Operator Press, user-reported accept→prep→ready→deliver; test gates user-reported off. Four GitHub Actions suites at last audited PR HEAD passed; latest public branch Vercel pages Home, Menu, Cart, Tracking empty state, Offers, Finder, About, Contact, Complaints and Operator all returned 200. Public isOrderingOpen=false. Separate actual CUSTOMER cart submit has NOT been proved, nor field tablets or current owner-approved prices.

### NAMED FINISH TRACKS (clear outcomes)

| Track | What is left | Gate |
|---|---|---|
| F01 Guest checkout | Home/Menu→customise→Cart→post to Oracle→receipt; prevent accidental public test orders and duplicate submits | P0 OPEN |
| F02 Customer tracking | One saved order ID follows staff transitions; pending/rejected/ready/delivered, refreshing/offline errors; truthful statuses | P0 OPEN REMOTE |
| F03 Menu truth | Owner-approved 113 prices, stock, sizes/addons, offer math and delivery fee; server price authoritative | P0 OWNER DATA |
| F04 Creative art direction | Review Home→Menu→Dialog→Cart→Ticket against original INSIDE / OUT thesis; current red/yellow/black/cream palette is deployed but **not owner-approved final identity**; test clarity and non-repetition | P1 DIRECTION OPEN |
| F05 Food images | Retain 100 generated + 12 actual photos, verify 17 unmatched SKU identities and accurate disclosure/cropping/alt | P1 REVIEW |
| F06 Motion | Keep original FLIP and add useful Add-to-cart/Ticket/state cues with reduced-motion fallback | P1 PARTIAL |
| F07 Responsive & accessibility | 320/390/768/1024/1440, real keyboard/touch/landscape, 200% zoom, focus, RTL, long item names | P1 FIELD |
| F08 One operator experience | Private staff entry, order alerts/sound/reconnect, stage conflict handling, 30+ tickets and durable receipts | P0/P1 PARTIAL |
| F09 Merchant operations | Pickup/delivery coverage and hours, fee, offline/cancel/reject policy, actual contacts and payment terms | P0 OWNER |
| F10 Other customer pages | Offers, Finder, About, Contact, Reviews, Complaints, nav/footer; distinct, truthful empty/failure/outbound actions | P1 BUILT/REVIEW |
| F11 Production safety | Auth/rate limits/tracking privacy, backups+restore, monitoring/rollback, SEO/asset weight/offline cache | RELEASE BLOCKER |
| F12 Real deployment & handoff | Two separate physical devices, owner signoff and menu, staff rehearsals, deliberate PR merge/deploy | RELEASE BLOCKER |
| OPTIONAL | Preorder ETA, push, loyalty/reorder, payment gateway/wallets, expanded POS/printing/analytics | NOT AUTOMATIC SCOPE |

### Original user Library creative brief, not merely external design references

- Re-read original 18 Oct Tuscanini research: TUSCANINI_CREATIVE_SYNTHESIS_PASS_06 and TUSCANINI_CREATIVE_DEVELOPMENT_LAB_05B. The historical 113-SKU catalog is **not verified current inventory**. Actual social screenshots show open stuffed-food interiors, staff-held food/scale, red takeaway packaging, black staff tops; neither real portion sizes nor preparation ritual can be presumed.
- The selected working **INSIDE / OUT** creative engine (restrained exterior vs rich interior) was expressly approved for **editorial exploration only**, NOT a fixed logo, colors, typography or final visual identity. Alternatives ONE FLAVOR/MANY FORMS and MADE/HELD/HANDED OVER remain conditional product/service hypotheses.
- Protect a direct Menu/Cart route. Don't repeat the same red-black editorial mask reveal on every page; transactional pages need calm legibility, with real prices/ingredients plainly visible. The brief explicitly prioritizes authentic serving, honest photo pairing whole/cut/handheld/wrapper, non-illusory ingredient/portion claims, and no mandatory animation.
- Preserve all existing generated assets and code, but label their evidentiary limits and compare them to original research before declaring art direction approved.
### Curated comparison references with application to Tuscanini

- FarmGrill https://elegantsquirrel.com/case-study-farmgrill — black/red/yellow lively street-food visual identity and fast mobile menu; reference for F04/05, never direct copy.
- Thunderbird Fried Chicken https://riseandamplify.co.uk/experience/thunderbird-fried-chicken/ — strong appetite-led brand site, striking hierarchy + quick order path; F04/F06.
- Pastaria https://www.atomicdust.com/work/pastaria/ — distinct crafted identity across website/packaging; preserve Tuscanini's own authored grammar.
- Toast official 2026 online ordering https://support.toasttab.com/en/article/Getting-Started-Online-Ordering — menu visibility, order acceptance mode, hours/payment readiness, test order; F08/F09/F12.
- Square KDS https://squareup.com/help/us/en/article/7944-get-started-with-square-kds-android — readable modifier/ticket layouts; F08.
- Baymard https://baymard.com/industries/food-delivery-and-takeout-ux and https://baymard.com/research-articles/current-state-of-checkout-ux — ingredient/option search, clear guest checkout, correct pickup/delivery, targeted validation; F01/F02/F07.
- Al-Asala Arabic restaurant https://phillote.com/portfolio/alasala — contextual RTL pickup/delivery entry; comparison only, not unapproved redesign.

### No-detours integrated sequence

**PASS 1 / P0:** F01+F02, safely restricted customer test with independent backend intake lock maintained until approved, full transaction from customer's UI; no new payment processor.
**PASS 2 / Creative quality:** F03/F04/F05/F06/F07/F10 design, text, photos, motion and responsive UX across whole website in one coherent batch; retain generated assets.
**PASS 3 / Pilot & release:** F08/F09/F11/F12 owner data, production staff gate, real tablet/phone behavior, backup/rollback and deliberate release; PR still Draft.

**Two meanings of DONE:** *technical* means real client cart/order/tracking works against Oracle securely; *merchant-ready* also means current prices/stock/payment/fee/contact plus actual device and backup validation. Today only the internal operator order loop is validated, not merchant-ready launch.

---
## CONTROL ROOM — complete remaining-work radar (23 Oct 2026)

**This is the at-a-glance execution map you requested.** There is ONE product: the Vercel Tuscanini website and its ONE accessible restaurant order screen. Everything below is visible even if not the current sprint. The detailed U01–U12 ideas and P01–P18 payment possibilities in sections 9–12 remain attached to this same board. Do not hide or silently turn these into unapproved code.

**Evidence terms:** `TESTED-LOCAL` = GitHub actions + disposable local Postgres; `READY-PREVIEW` = Vercel website builds/serves pages; `OPEN` = not implemented; `MERCHANT` = decision/data outside verified code; `FIELD` = requires actual phone/tablet/restaurant.

### Milestones — real dependencies, not a new environment for its own sake

| Gate | Desired customer-visible outcome | Exact next deliverable | Verified status |
|---|---|---|---|
| G00 | See both designed screens via Vercel | Stable customer/Order Press/Ticket Rail URLs; local 20-ticket interactive demo | **READY-PREVIEW + browser CI PROVED** at `2a48f08e` |
| G01 | Dedicated Tuscanini data on existing Oracle | Coolify DB+API Compose, unique app user/volume, health and backup/restore | **ORACLE PG+API LIVE / HTTPS HEALTHY / BACKUP RESTORE OPEN** |
| G02 | Durable safe service rather than test fixture | New `services/orders-api` with own migrations, service auth, server pricing/idempotency and event states | **API DEPLOYED + POSTGRES CI SUCCESS; hardening open** |
| G03 | One live shared order between phone and tablet | Preview-only Next adapters + operator gate + gated catalog sync, then internet roundtrip | **REAL STAFF TICKET AND REMOTE ORACLE INBOX PROVED; CUSTOMER CART E2E OPEN** |
| G04 | Merchant business rules actually true | Approved menu/prices/options/offers, phone/address/hours, delivery region/fee/time, payment and cancellation choices | **MERCHANT** |
| G05 | Operationally reliable restaurant flow | Real tablet + Android test, foreground sound, sleep/reconnect, 20–50 tickets, retry conflict, data security, backup recovery | **FIELD/OPEN** |
| G06 | Controlled restaurant web ordering | Pilot, monitoring, final owner signoff, deliberate production cutover & support/rollback | **OPEN** |

### ALL remaining core workstreams (not a list of automatically approved add-ons)

| ID | Front / backend / operations | Current reality | Finish condition and priority |
|---|---|---|---|
| C01 | Home editorial and visual direction | BUILT preview; visual approval open | Whole Home→Menu flow and imagery signed off (P1) |
| C02 | Menu/catalog/search/categories/finder | BUILT with old sample/historical menu | Correct 113-item inventory/availability and alternatives, search empty/error, approved food identities (P0/P1) |
| C03 | Product modifiers/photos/notes/qty | Browser tested | Real sizes/addon pricing, stock combinations, photos matching SKU, keyboard accessibility (P0/P1) |
| C04 | Cart editing, duplicate prevention, saved review | Browser tested | Long-order + field/input/zoom/offline/address/pickup replay edge acceptance (P1) |
| C05 | Checkout delivery vs pickup & genuine fee | Honest display, fee unverified | Delivery coverage, current fee/tax/packing charge and actual payable total (MERCHANT/P0) |
| C06 | Payments: cash on delivery/pickup, on-prem POS | Only research inventory | Owner selects what is accepted; unpaid/collect-at-handoff state clearly recorded (P1) |
| C07 | Payments: cards, Meeza, wallets, QR, Fawry, InstaPay, Apple/Google Pay, links, deposits, split | U01 P01–P18 documented; no integration | Choose supported provider and merchant account; signed callbacks, failures, reconciliation/refunds (DECIDE; not auto-P0) |
| C08 | Orders in permanent DB, prices, retries | Dedicated Oracle PG+API and 113 historical SKUs imported; one synthetic live order proved | Isolated Oracle PG, backup, migrations, API health/metrics (P0) |
| C09 | Remote Vercel-to-Oracle transport | HTTPS Oracle adapter in Preview and Production code; Preview operator connection proved | Deploy HTTPS API, configure secrets, remote full cycle/abuse testing (P0) |
| C10 | Operator screen accessible from URL | Preview operator screen displays private real PostgreSQL tickets after staff key | Same design shows **real** orders only for authorized restaurant access (P0) |
| C11 | Operator workflows: accept/reject/prep/ready/handoff | Local PostgreSQL E2E tested | Remote authorization/conflicts and exact restaurant physical handoff (P0) |
| C12 | Staff entry/security | Test key and no production login | One minimal protected restaurant gate/session; no shift/employee POS platform (P0) |
| C13 | New order visibility and alert | Opt-in browser sound; mock ticket load | Sleep/visibility/reconnect/new arrivals, audio on actual tablet (P0/P1) |
| C14 | Order ticket and stage changes | Local/Postgres tested, preview states | Remote real UUID capability, PII protection, long-lived ticket/recovery and reconciliation (P0) |
| C15 | Restaurant-set prep ETA | NOT BUILT | Save staff-entered estimate in order event, show timestamp as estimate, not guarantee (P1) |
| C16 | Pickup and delivery handoff | Partial UI | Wrong zone, courier, failed pickup, closed time/late order, route-specific terminal wording (MERCHANT/P1) |
| C17 | Cancellation/change/support | WhatsApp REQUEST and rejected status built | Actual owner cutoff, edit/reject protocol, refunds outside/inside payment provider (MERCHANT/P1) |
| C18 | Notifications | Foreground sound only; no Web Push | User opt-in + push subscription/event/deep link; actual device test if commissioned (P2) |
| C19 | Promotions/offers/coupons | Existing offers page; unverified validity | Eligibility, expired offers, bundle/modifier math, one code per order, honest promo T&Cs (MERCHANT/P1/P2) |
| C20 | Contact, About, Reviews, Complaints | Built pages, WhatsApp handoffs not a stored CRM | Numbers/maps/hours, blocked WhatsApp, permission/validation; decide persisted forms (P1) |
| C21 | Mobile UX, motion, accessibility | Desktop/mobile screenshot CI | Real 320/390/768/1024/1440 devices, virtual keyboard, focus, RTL, contrast and reduced-motion (P1) |
| C22 | Images and typography | 12 restaurant + 100 generated illustrations on repo | Exact SKU photo trust, 17 unmatched items, image crop/asset/performance signoff (P1) |
| C23 | Performance/SEO/PWA | Shell and cache built | LCP/CLS/INP, offline boundaries, cache exclusions, metadata, sitemap, install behavior (P1/P2) |
| C24 | Security, rate limits and privacy | Test protections partially | Tracking capability, staff auth, bot resistance, no PII in logs, retention/deletion (P0) |
| C25 | Database migrations/backups/restore | Only disposable migrations proven | Isolated Oracle PG, persistent volume, tested backups, restores, upgrade/runbook (P0) |
| C26 | Server deploy and observability | Vercel Preview READY; Oracle dedicated API + Postgres live | Coolify real API health/logs/TLS/restarts, deploy gate, explicit rollback (P0) |
| C27 | Staff/merchant training and launch | Not run with actual restaurant | Tablet orientation, 2-minute walkthrough, support contacts, live supervised rehearsal (FIELD) |
| C28 | Analytics, privacy-safe conversion insight | No confirmed production tracking | Event map and consent, no order contact/PII to third parties (P2) |
| C29 | Loyalty, reorder, gifts, referrals, CRM, expanded delivery/print/POS integrations | Idea universe U01–U12, not built | Evaluate each against demand, costs and owner approval; not silently added (LATER/DECIDE) |
| C30 | Rollout, maintainability, operational cost | PR Draft; no merchant release | Preview QA→pilot→approval→guarded deploy, monitoring, documentation and handoff (P0) |

### What's next IN ORDER (keep execution moving)

1. **FIRST — G01/G02:** inspect Oracle/Coolify resources *without touching the Nova/Plantupia deployment*, create **isolated** database and a proper real order API with migrations and secure staff authorization; don't connect the dangerous localhost simulation.
2. **THEN — G03:** connect Vercel `/api/orders`, `/api/orders/track` and the existing `/operator/orders` to the same Oracle order engine behind server-only credentials, with a visible demo/live distinction and safe fallback switch.
3. **PROVE — G05:** two physically separated devices, price retry/restart/decline, Android/tablet audio/reconnect, protected order ticket, operator success/reject.
4. **THEN — G04/G06:** merchant truth (fees, price, payment choice, contacts) and explicit pilot go/no-go, backups/restore and rollout.
5. **PARALLEL creative route:** C01–C04, C20–C23 can continue without pretending those assets finish commerce. Web Push/loyalty/POS/payments beyond agreed merchant methods remain separate decisions.

### Oracle deployment status & live access boundaries

- Existing Oracle VM with Coolify can **potentially host** the isolated Tuscanini service and PostgreSQL. **Do not** point it at the Nova database, existing production media, or Redis. Capacity/permissions are unverified; no new Tuscanini Oracle service is claimed.
- **NEW FILES COMMITTED:** `infra/oracle/postgres.compose.yaml` (DB container/healthcheck/persistent storage, **no** exposed 5432) and `infra/oracle/README.md` (detailed secure rollout, exact gates and configuration). **NO Oracle deployment has occurred yet.**
- The experiment's `db.ts` explicitly refuses remote DB and `http.ts` has **fixture-only auth**; removing guards and publishing that API would be unsafe. Build G02 separately.
- Vercel's branch preview itself is functioning; site and operator visual demo being ready are distinct from real database order intake.
- A working Coolify/Oracle administration connection is required for actual resource creation, environment variables and deployment. No DB/SSH passwords should be pasted into GitHub, chat or logs.

**Every status update from now on:** Current milestone / changed files + SHA / Build + Browser + PostgreSQL CI / **site preview & order screen links** / what exactly remains and the next unblock. If blocked, mark it honestly and continue independent code/art work.

---

### HTTPS API readiness success / Vercel next gate (23 Oct 2026)

- User reports the public `https://tuscanini-orders-api.duckdns.org/readyz` URL returned `{"ok":true}` **successfully** after setting DuckDNS/Coolify domain and deploying route. Previously confirmed Coolify Healthy. This proves success **in the user's browser**, not independent remote verification by this assistant.
- Vercel project environment inventory (read-only, not decrypted) currently includes Supabase variables but **none** of `ORDER_API_ORIGIN`, `ORDER_API_SERVICE_KEY`, `TUSCANINI_OPERATOR_KEY`, `ORDER_BACKEND`.
- Next manual Vercel Preview (prefer scoped only to branch `redesign/tuscanini-authored-experience-20261018`): add server-only `ORDER_API_ORIGIN=https://tuscanini-orders-api.duckdns.org/`; copy existing Coolify `ORDER_API_SERVICE_KEY` securely into Vercel (not NEXT_PUBLIC); create a **different** 24+ random character `TUSCANINI_OPERATOR_KEY` for staff routes; leave `ORDER_BACKEND` unset/off and `ORDER_API_ACCEPT_ORDERS=no` until catalog, auth, remote action and an actual live checkout are reviewed. Keep `TUSCANINI_ALLOW_CATALOG_SYNC` unset or `no` until menu is approved.
- Secrets must never be pasted in chat/screenshots or committed. After adding variables, redeploy preview for env changes to take effect. Confirm unauthorized `/v1/operator/orders` returns 403 and private tracking doesn't leak PII; test staff gate before enabling orders.

### DuckDNS hostname added in Coolify (23 Oct 2026)

- User screenshot shows `tuscanini-orders-api.duckdns.org` registered at DuckDNS, then Coolify `tuscanini-orders-api → Domains` lists HTTPS root hostname on internal port **8080**, an additional `www.` hostname on port **8080**, and prior generated HTTP `sslip.io` hostname. **All DNS statuses were `Not checked`; `Changes pending` showed deployment configuration not applied yet.**
- No independent proof of a functioning public TLS endpoint as of screenshot. The DuckDNS domain initially resolved to an unrelated client public IP; confirm its A record is corrected to Oracle `158.101.254.30` before calling DNS complete.
- Next: delete just the unnecessary `www.` row unless explicitly DNS-configured; mark temporary API domain `Noindex`; run Check All DNS and correct IP if needed; deploy pending routing changes; open HTTPS `/readyz` and require trusted TLS plus `200 {"ok":true}` before entering `ORDER_API_ORIGIN` on Vercel. Keep existing generated HTTP hostname temporarily for rollback, order intake off.

### Oracle live health and DuckDNS setup (23 Oct 2026)

- User states **Coolify reports Healthy** after corrected `curl` runtime image and IPv4 loopback HTTP `/readyz` probe. Prior runtime Terminal screenshot recorded `200 {"ok":true}`. Healthy is user-confirmed; no current public HTTPS test yet.
- User opened DuckDNS account and entered a prospective subdomain; screenshot shows **domains 0/5**, so it has **not yet been created**. Next actions: add domain, validate A record targets Oracle `158.101.254.30` (not the laptop/home IP), add new HTTPS hostname in `tuscanini-orders-api` Domains with internal port `8080`, deploy/proxy-refresh, verify public `/readyz` returns `200` with a trusted TLS certificate. Do not open PostgreSQL externally.
- **Secret hygiene:** DuckDNS account token is partially visible in conversation screenshot; rotate/regenerate it in DuckDNS and never save/paste it in GitHub, chat or Vercel. Domain name and server IP are safe to share. `ORDER_API_ACCEPT_ORDERS=no` until TLS, staff auth and E2E pass.

### Coolify post-fix deploy reported success (23 Oct 2026)

- User confirmed `Success` after deploying the Dockerfile fix which adds runtime `curl` and configuring the loopback HTTP healthcheck. This is user-reported successful **Coolify deployment**, following the earlier unhealthy/rollback event.
- Prior independent live `/readyz` evidence returned `200 {"ok":true}` and proved Postgres SELECT 1. **Do not mark the latest container `Running (healthy)` until visually confirmed via Coolify status**.
- Next steps: confirm app health in Coolify; provision user-owned/free DNS name (e.g. DuckDNS) resolving to Oracle, configure Coolify application's `https://` domain proxy → internal port 8080 and validate a public TLS-protected `/readyz` response. Do not use auto-generated `sslip.io` HTTPS (Coolify docs warn of shared-zone certificate rate limits). Keep `ORDER_API_ACCEPT_ORDERS=no` and no Vercel preview activation until HTTPS + authentication checked.

### Coolify healthcheck rollback / corrected runtime image (23 Oct 2026)

- User-provided actual deploy log confirms **migration completed and API ready on port 8080**, but Coolify aborted its rolling replacement after HTTP healthcheck returned unhealthy five times: `curl: not found`; `wget: can't connect to remote host: Connection refused`. The original container was preserved by automatic rollback.
- **Root causes to eliminate:** final Node Alpine runtime image lacked `curl`; `localhost` can resolve to an unreachable loopback family depending on container resolver. `services/orders-api/Dockerfile` updated at `4008a67d` to explicitly `apk add --no-cache curl` in final runtime stage. User-facing HTTP healthcheck should set Host=`127.0.0.1`, Port=`8080`, Path=`/readyz`, Scheme=HTTP, Method=GET, expected response code 200, response text empty, start period 30 seconds.
- **Required action:** GitHub Docker-image CI success, then **Deploy** from the updated branch (not merely Restart of cached old image), verify Coolify Healthy and `200 {"ok":true}` inside resulting live app. This does not alter the existing PostgreSQL DB. Keep order intake disabled until secure remote Vercel integration is tested.

### Oracle backend readiness verified from live container (23 Oct 2026)

- User supplied Coolify's `tuscanini-orders-api` container Terminal screenshot showing `node -e "fetch('http://127.0.0.1:8080/readyz')..."` returned `200 {"ok":true}`.
- The API's `/readyz` runs `SELECT 1` on its configured PostgreSQL pool, so this demonstrates live app-process responsiveness AND a successful database query from the deployed Oracle container. This is stronger evidence than Docker image build or `Running` alone.
- Coolify currently labels this application `Running (no healthcheck)`. Configure GET localhost:8080/readyz, ensure the container includes curl/wget if using Coolify's HTTP check, enable, and restart/redeploy to apply. Do not infer it is Healthy until Coolify confirms that.
- Production order intake remains disabled (`ORDER_API_ACCEPT_ORDERS=no`); the Oracle API is not yet connected to Vercel Preview for real shared orders, and no customer checkout test from external devices has been done.

### Oracle Coolify first API deployment (23 Oct 2026)

- User reports Coolify deployment of `tuscanini-orders-api` **Success** from the application deployment screen, on Oracle `localhost` server in Tuscanini/production. Earlier screenshot of in-progress deployment showed source branch `redesign/tuscanini-authored-experience-20261018`, commit `f23d2cef`.
- This is a **user-reported successful deploy**, NOT independent verification of migration completion, `GET /readyz`, PostgreSQL connectivity, container logs, HTTPS endpoint, operator key or real order delivery.
- **NEXT GATE:** open app Runtime Logs; look for `Tuscanini additive migrations complete` and `Tuscanini order API ready on port 8080`. Then from container terminal request `http://127.0.0.1:8080/readyz` and require `{"ok":true}`; verify protected API rejects unauthenticated calls. Preserve intake disabled (`ORDER_API_ACCEPT_ORDERS=no`) and catalog sync disabled until verified.
- If logs show restart/PG auth issues, recheck PGHOST derived from internal Coolify URL (no passwords in chat), PGDATABASE=`tuscanini_orders` PGUSER=`tuscanini_app`, and common Docker network, without changing other projects.

### Oracle Coolify manual database milestone (23 Oct 2026)

**USER-CONFIRMED ON LIVE COOLIFY, not merely a CI simulation:** User created standalone PostgreSQL resource in Tuscanini/production on the `localhost` server, `postgres:18-alpine` (psql reported 18.6), and executed inside that new isolated container:

- Existing administrative database/user remain `postgres`; do not overwrite Coolify's database resource General credentials.
- Created a distinct `tuscanini_app` LOGIN role with a password entered directly through interactive `\\password` (never copy it into this board or chat).
- Created `tuscanini_orders` owned by `tuscanini_app`, confirmed via `SELECT datname,pg_get_userbyid(datdba)...` returning exactly `tuscanini_orders | tuscanini_app`.
- **The PostgreSQL container is Running and DB+role exist on Oracle.** This does *not* yet prove application network reachability, migrations, backup/restore or any order receipt.
- **Deployment strategy adjusted:** because Coolify's one-click PostgreSQL resource already exists, **DO NOT deploy `infra/oracle/postgres.compose.yaml` unchanged**; its additional `tuscanini-postgres` service would create a redundant second PostgreSQL database. Deploy **only** `services/orders-api/Dockerfile` as a separate Git-backed application on the same Coolify destination, using internal database host from this resource's network details, port 5432, database `tuscanini_orders`, user `tuscanini_app`, and the password saved directly into the API application's Secret environment variable in Coolify.
- Secure initial API config: service key 32+ characters in Coolify only; `ORDER_API_ACCEPT_ORDERS=no`, `CATALOG_SYNC_ENABLED=no`. Next verify migrations, `/readyz`, Docker network and isolated persistence; then configure HTTPS proxy and server-only Vercel Preview credentials, run two-device flow, and obtain merchant approval. No automatic real customer intake.

### Coolify handoff / production-image verification (23 Oct 2026)

- User provided an authenticated screenshot of **Coolify v4.4.7** at `https://coolify.158.101.254.30.sslip.io/projects`, displaying four existing projects. This confirms the control-panel URL, **not** that our connected automation is authenticated or that Tuscanini services exist.
- A separate authorized browser-profile login handoff has been generated; **user must open it, sign in if needed and press Save profile** before authenticated browser actions can run. Do not collect credentials in chat or assume their personal Chrome session transfers automatically.
- CI specifically checks `docker compose -f infra/oracle/postgres.compose.yaml config -q` and builds the real `services/orders-api/Dockerfile` production container. [Dedicated API/Compose check #39884814448](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39884814448) **SUCCESS** at technical SHA `76bb9cfe`. This proves build/compose syntax, **not** a deployed Oracle service, database backups or actual Vercel round trip.
- **Next authorized Coolify actions:** inspect server health/resources without modifying current projects; create the separate `Tuscanini` project and environment; configure secret variables in the UI; deploy new Compose at `infra/oracle/postgres.compose.yaml` on PR #59's review branch; verify Postgres ready/API ready/TLS and isolation. Do **not** enable `TUSCANINI_ACCEPT_ORDERS=yes` or `ORDER_BACKEND=oracle` until the operator gate, reviewed catalog and private remote test pass.
- Keep all previous projects unchanged. Do not expose `5432` or install a fictitious shared client DB.

### Execution checkpoint / Oracle transport build (23 Oct 2026)

**Code now built on PR #59** — dedicated `services/orders-api` with separate `tuscanini` SQL schema and additive migration (no `spike_ts` or shared Nova/Plantupia DB), isolated pg pool, authenticated service HTTP routes, server-priced catalog modifiers, idempotent checkout, event log/outbox, operator inbox/actions and PII-minimized customer tracking. The API's test suite proves real PostgreSQL 16 behavior, including identical-cart replay, changed-cart 409, unauthorized inbox/action 403, received→accepted→preparing→ready→delivered and fail-closed default OFF. **No Oracle deployment yet**. Code sources: `services/orders-api/src/`, `services/orders-api/migrations/`, `services/orders-api/Dockerfile`, `services/orders-api/tests/service.test.mjs`, `.github/workflows/tuscanini-orders-service.yml`.

**Same customer site and same order screen:** `lib/oracle-order-api.ts` routes server-to-server only when **both** `VERCEL_ENV=preview` and `ORDER_BACKEND=oracle`; customer `/api/orders`, `/api/orders/track`, and operator `/api/studio/bridge` now have **preview-only** real-service adapters. Staff action/inbox requires a DIFFERENT long passkey in the Next server. For controlled catalog import the new `POST /api/internal/orders/catalog-sync` requires staff passkey, preview flag and `TUSCANINI_ALLOW_CATALOG_SYNC=yes`, plus the isolated service's own `CATALOG_SYNC_ENABLED=yes`. Until all these explicit flags are configured, Vercel remains the same interactive 20-ticket design demo and historical backend. **No public real-order API, no anonymous staff data**.

**Oracle Compose ready for administrator deploy:** `infra/oracle/postgres.compose.yaml` now defines BOTH PostgreSQL and the dedicated Node API, an internal database-only port and its persistent storage. `infra/oracle/README.md` is the single setup/rollback runbook. Actual Coolify project creation, HTTPS API hostname, service secrets, catalog upload, DB backup/restore and remote two-device E2E remain OPEN; do not claim deployment.

**Verification:** dedicated workflow [Tuscanini Dedicated Order API PostgreSQL](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/workflows/tuscanini-orders-service.yml) **SUCCESS** on technical SHA `157cb024`; [Home/Next TypeScript CI #39883719809](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39883719809) **SUCCESS** on same code after isolating `services/orders-api/**` into its own TypeScript compilation scope. Additional visual/Backend jobs and documentation-HEAD reruns may still be active; inspect their conclusions before claiming a complete four-gate pass.

**Blocking dependency:** no authorized OCI/Coolify control panel session in the connected tools. A GitHub commit or Vercel READY cannot create an Oracle container or verify DB data. Never take credentials in source or chat. Continue source+CI until Coolify access is available, then publish isolated Postgres/API with fail-closed ingestion and demonstrate same real test order across phone/restaurant tablet.

---

## Live preview links and session rhythm (23 Oct 2026)

**One recurring check-in:** every implementation response should include **what changed / working code HEAD / three CI statuses / Vercel preview link / next two tasks / blockers**. Continue updates in this board rather than separate handoff files. Vercel deployment `READY` is proof the build is hosted, **not** proof of a shared remotely connected restaurant data engine or merchant acceptance.

**Stable branch preview alias** (deployment is replaced by each successful Git push to PR #59):
- Customer site: https://tuscanini-ordering-syste-git-6bc29f-omarkhair70-droids-projects.vercel.app/
- Restaurant screen: https://tuscanini-ordering-syste-git-6bc29f-omarkhair70-droids-projects.vercel.app/operator/orders
- Checkout: https://tuscanini-ordering-syste-git-6bc29f-omarkhair70-droids-projects.vercel.app/cart
- PR: https://github.com/omarkhair70-droid/tuscanini-ordering-system/pull/59
- Native Vercel branch Preview requires Vercel access or a **temporary Vercel share link**; generate the latter directly rather than committing expiring bypass tokens to GitHub.

**Scope correction confirmed by owner:** The restaurant screen should **open normally from the URL**, not return 404 because the local PostgreSQL fixture is disabled. Implemented on branch:
- `app/operator/orders/page.tsx` always renders this real interface, without a `notFound()` check. With localhost staging disabled (normal Vercel builds), it displays 20 **synthetic** tickets and a prominent truthful notice.
- `components/studio/operator-press.tsx` exposes Order Press and Ticket Rail, search, queue, filters, and **clickable local demo actions** (accept/reject/prepare/ready/complete). Demo state is kept in browser React state ONLY; resets with a button; no real order API calls, no real customer names/phone/address, no payments. This is much more useful for judging actual operator interaction than static screenshot or inert buttons.
- Real staging with `getLocalStudioOrigin()` still shows real Postgres-backed tickets and requires the existing operator key for server mutations. Its separate `?preview=20` mode remains strictly inert for localhost visual fixture tests.
- `scripts/qa/rebirth-interaction-check.mjs`: at 320/390/768/1440, assert the public operator route HTTP 200, 20 synthetic tickets, local accept→prepare, rail switch, reset, and ZERO calls to `/api/studio/bridge`; write screenshots at 390/1440.
- **Proof:** Vercel project deployment `READY` for technical SHA `2a48f08e`. Verified branch alias GET `/operator/orders` returned **HTTP 200**, replacing previous 404. At technical SHA `2a48f08e`, **all three GitHub workflows SUCCESS**: [Home/TypeScript CI #39878775525](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39878775525), [Backend/PostgreSQL CI #39878775512](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39878775512), [Real Browser Screenshots & Asset Gate #39878775509](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39878775509). The latter explicitly proves operator page 200, 20 synthetic orders, local accept→prepare→reset, rail navigation and **ZERO** studio API calls at 320/390/768/1440. This is a public UI demo, not live restaurant data or merchant production approval.
- **Not implemented:** A public *real-time* shared production order queue and merchant-ready checkout. Do not misrepresent the open demo as real order intake or loosen server authorization on any future real shared instance.

Next: close browser test and screenshot review; continue T03 merchant-controlled prep estimate and T05 connection/touch/audio field tests. All payment/cancellation/refund and catalog questions still remain in section 9.

---

## 0. The whole product, without scope creep

**Only TWO customer-facing systems:**
1. **Original Tuscanini Rebirth website:** Home → Menu/search → Item size/addons/notes/quantity → Cart/fulfillment → submit → living tracking ticket. Supporting Offers, Food Finder, About, Contact, Reviews, Complaints are part of the SAME site.
2. **One restaurant order screen** at `/operator/orders` on a tablet/desktop: notice incoming website orders, inspect exact choices and customer/fulfillment details, accept/decline → start preparing → ready → handed over, and automatically update the customer's ticket. **Order Press** is the focused decision view and **Ticket Rail** is an alternate receipt-reel view, NOT competing applications.

Existing cashier/POS, phone ordering, Talabat and their devices remain separate. **Not in scope:** replacing the POS; multi-user workforce accounts/roles/shift management; POS dashboards; stock procurement; payments/gateway; chef stations or order printers without an actual owner request. A **simple secure restaurant access gate** and server authorization of its buttons IS necessary; that does not mean building a staff-management product.

### Working language — NEVER blur the statuses
- **BUILT** = source exists on draft branch.
- **CI PROVED** = a specified automated scenario passed against that commit.
- **VISUALLY REVIEWED** = real screenshot/film observed at named sizes.
- **FIELD PENDING** = mobile/tablet/person-in-restaurant not tried.
- **MERCHANT PENDING** = data, price, wording, branding, or workflow unapproved.
- **OPEN / NOT BUILT** = still needs product code.
- **OUT OF SCOPE** = intentionally not promised; do not silently build.

**A green CI is not a deployed website, visual approval, or live restaurant test.**

## 1. What actually works now — evidence ledger

| ID | Verified work | State / evidence |
|---|---|---|
| E01 | Next.js 16 / React 19 / TypeScript Rebirth site with 10 public paths and distinct Home/Menu/Product/Cart/Tracking and support pages | BUILT; [whole-site screenshot workflow](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39772466722) **SUCCESS** on audited HEAD |
| E02 | Direct single customer menu; 113 historical products / 16 categories, search, categories, paging, choice modal and stored item quantity/size/addons/notes | BUILT + browser fixtures; **historical data NOT merchant-approved** |
| E03 | Original cart→local staged order→independent PostgreSQL atomic line snapshots→tablet inbox→original living customer ticket | CI PROVED in separate **loopback STAGING**, [three-job Actions proof](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39771522529). Real merchant cutover NOT done |
| E04 | Transactional Postgres order record, server-authoritative price, modifier validation, payload-bound idempotency, event log/outbox | CI PROVED on disposable database; tests from [Pass 36](36_REBIRTH_REAL_CART_OPERATOR_TICKET_POSTGRES_2026-10-22.md) |
| E05 | Order Press focus+queue / Ticket Rail, filters/search, All-Day active item counts, 20 diverse visual pressure tickets (actions disabled) | CI PROVED at 1024/768/390 with real screenshots; see [Pass 37](37_THE_ORDER_PRESS_AND_TICKET_RAIL_2026-10-22.md) |
| E06 | Opt-in foreground two-tone new-order sound, new arrivals label, RTL rail buttons, mobile condensed first-ticket access | BUILT + CI PROVED on `6dca3806`; [Pass 38 actual before/after](38_OPERATOR_ATTENTION_AND_SITE_VISUAL_QA_2026-10-22.md). Physical tablet/audio/reconnect FIELD PENDING |
| E07 | 12 source-backed authentic restaurant JPGs and 100 generated illustrative WebPs | FILES PRESENT. 96/113 historical entries have representative assignments from 65 art files; 17 don't; **0/113 exact SKU photographs merchant-certified**; do not regenerate 100 wholesale |
| E08 | Customer ticket with server statuses, pending/confirmed distinction, stale/offline recovery and decorative state-tied stamp | BUILT + scripted fixtures; operator→customer STAGING CI PROVED, **not Web Push** |
| E09 | PWA manifest, icons, offline page, basic cache service worker | BUILT / legacy support. **No push event or remote-notification delivery** in current `public/sw.js` |
| E10 | Home, menu, 12 photo system and selected material/FLIP transitions with reverse/escape and reduced-motion testing | BUILT + browser visuals, not whole-site art-direction approval |

**Latest inspected code HEAD `82a1a262`:** all three PR workflows SUCCESS (Home, Public Visual/Asset Gate, Backend/Postgres/Chromium). Recheck `PR #59` before using this as a current statement. Draft only; not merged to `main`; not deployed as new live ordering channel.

## 2. Actual customer website — route-by-route finish inventory

"BUILT" in this table means it renders and has code, **not** that we can stop designing it.

| Track | Route / files | What exists | Specific uncovered acceptance work |
|---|---|---|---|
| W01 | `/` · `components/home/rebirth-home.tsx`, `app/rebirth-home.css` | Authored dark food hero, original photos, category/gallery, material/packaging sequences, direct CTA | Scene rhythm, mobile photo crops, image decode, repetition vs Menu, brand/typography approval, real-phone motion |
| W02 | `/menu` · `rebirth-menu.tsx`, `rebirth-menu.css` | Single search/category/page, old menu, photo/art grammar | Real first-product reach at 320/390, long names/no results, search/back/categories, browser zoom, no endless opening hero |
| W03 | Item dialog in Menu · `rebirth-product-dialog.tsx` | Native modal, variants, addons, qty, notes, illustrative artwork, cart transfer, optional reversible FLIP | All option combinations, max text length, excessive addon list, sticky CTA with phone keyboard, Escape/focus/back, error-free price/line math |
| W04 | `/cart` · `rebirth-checkout.tsx`, `rebirth-checkout.css` | Populated cart edit/review, delivery/pickup and customer fields, idempotency key in staging, true server submit | 320/390 keyboard, back/edit/persistence, phone/address optionality by fulfillment, validation, double click/retry/409/offline, concise first-fold, test 200% zoom |
| W05 | `/order-success` · `rebirth-order-tracking.tsx`, `rebirth-tracking.css` | Saved/pending/accepted/preparing/ready/delivered/cancelled, refresh, stale/restore, original printable-paper art | Cover **every** terminal/error/status path in screenshots: missing ID, invalid, rejected, unreachable, pickup vs delivery, same order across refresh, reconnect, estimated prep time, accessible announcement |
| W06 | `/offers` | Distinct red promotion chapter, live verified offer guard | Valid active/expired/empty/error example, real terms, correct offer→detail/cart, approved price/eligibility; never invent a promotion |
| W07 | `/food-finder` | Actual family/budget question→matching products, visual pictograms | Zero results, different budgets/long category names, direct deep-link result, actual live catalog availability |
| W08 | `/about` | Restaurant source-led documentary/editorial chapter | Approval of story/facts/source photos, length and distinctness vs Home, responsive crop and clear menu path |
| W09 | `/contact` | Phone/WhatsApp/Facebook/address actions and wayfinding | Merchant-confirmed numbers/address/hours, click-to-call/directions, invalid/missing contact fallbacks, keyboard focus |
| W10 | `/reviews` | Authored prompt with outbound WhatsApp, no fake ratings | Confirm this intended feedback channel; test outbound and unavailable contact. **Not** a persisted review/reputation system |
| W11 | `/complaints` | Custom form prepares WhatsApp draft | Validation, deep links, blocked popup fallback and mobile keyboard, make send semantics clear. **No** saved complaint ticket or guaranteed submission |
| W12 | Shared nav/footer/cart/banners | Owned header/footer, mobile drawer, cart badge, active order navigation | Direct link + browser Back, menu close, focus/ESC, cart/tracking deeplinks, Arabic/English mixing, accidental legacy shell overlay |

**Other existing routes found in source:** `/demo`, `/menu/visual-atlas`, `/studio`, `/offline`, `/admin/tables` and legacy `/admin/*`. Inspect that preview/internal/demo entry points are not accidentally exposed as an official customer ordering flow, and that old admin still works if kept. **Do NOT convert the old admin into a new giant POS scope.** The canonical customer site has ten route paths; W03 and W12 are shared subflows rather than extra primary pages.

## 3. Restaurant order screen — just ONE useful operating surface

| ID | Operator acceptance | Current result | Next concrete proof |
|---|---|---|---|
| O01 | Next new web order visible with ID, age, item/size/addon/note/qty, pickup/delivery and contact | BUILT + staging browser | Verify real fresh event after initial page snapshot; no old-order fake alarm |
| O02 | Press = one focused order + sorted queue, preserving focused ticket on status changes | CI PROVED | Touch through 15–20 orders on real tablet; actions above fold; no accidental selection loss |
| O03 | Rail = separate receipt comparison/reel with explicit previous/next | CI PROVED | Swipe and arrows at 768/1024, scroll offset on filtering/new arrivals, keyboard |
| O04 | Accept / decline / preparing / ready / handed over, same customer ticket | CI PROVED in localhost Postgres | Status conflict/double-press, offline/reconnect, action failure/rollback, correct terminal states |
| O05 | Opt-in order sound + in-page visual arrival | BUILT + browser control check | **Physical sound** + mute persistence and sleep/resume/reconnect/multi-order attention, no auto-unmute |
| O06 | Search/filter/All-Day five top counts for accepted/preparing | BUILT + 20-order preview | Stress long item names, 50+ orders/pagination/load, selection and station relevance (do not invent kitchen stations) |
| O07 | Simple private access (one restaurant, one protected screen) | **NOT COMPLETE**: entered key is a localhost QA fixture | Single protected restaurant entry + server-side action guard + sign out/expiry **without** building named users, roles, rota or personnel admin |
| O08 | Real shared staging reachable by a tablet away from the dev machine | **NOT BUILT**: only loopback demo | Hosted **separate test instance**, test from independent browser/device, persist exact end-to-end event loop and restore from sleep |

Critical note: current data service uses fixture role headers to exercise allowed state transitions. That's a **backend implementation detail**; the actual desired operator product is still ONE screen, not multiple staff personas.

## 4. First-party order + living ticket + notification contract

| ID | Required behavior | Status |
|---|---|---|
| B01 | Server owns catalog price/selection validation and transactionally stores full immutable items, customer info, status and event | PROVED in isolated local PostgreSQL |
| B02 | Same logical checkout retry doesn't create duplicate; modified same key rejected | PROVED in isolated local PostgreSQL |
| B03 | Direct new order arrives on tablet, accept/prep/ready/done immediately reflected in customer's **same** ticket | PROVED across two Chromium windows against localhost engine |
| B04 | Restaurant can set/change a REAL prep estimate and customer sees the timestamp/updated ETA as a labelled estimate | NOT BUILT |
| B05 | Tracking opens from secure private link without leaking contact data; guarded state retrieval, rate limits | NEEDS LAUNCH VALIDATION. Current tracking uses a UUID; don't mistake UUID-only lookup for a fully reviewed capability/access model |
| B06 | Staff sound active on visible page; explicit visual alert, mute and connection state | PARTIAL. New-arrival browser cue exists; offline/stale/reconnect stress still due |
| B07 | Opt-in customer Web Push from event/outbox + service-worker push handling + click-to-ticket | NOT BUILT. Existing offline service worker **is not push**; Android/iOS/browser permissions require actual device test |
| B08 | Local test catalog vs approved real menu; rehearsal of migration/rollback/backups, no real mixed orders | PARTIAL STAGING only |
| B09 | Delivery vs pickup, failed payment assumptions, actual handoff language, cancellation and support | Partially represented; verify against owner's real workflow. Do not invent payment or POS events |
| B10 | Background/closed-tab behavior when devices sleep/offline; duplicate events, recovery, notification failure | NOT FIELD-TESTED |

## 5. Creative, media, interaction and polish — independent checklist

- [ ] **Art direction as one authored world:** compare actual Home→Menu→Dialog→Cart→Ticket entry/exit, not isolated screenshots; identity specificity and non-repeated composition.
- [ ] **Motion as useful behavior:** category reveal, selected-food shared-element FLIP, cart feedback, live ticket stamp, reverse/back; respect reduced motion, low CPU and user control.
- [ ] **Digital copy:** brief decisive Arabic CTA and empty/error states; no internal QA essays on customer UI; keep prices/details truthful where choices are made.
- [ ] **Photography and generated art:** retain all 100 WebPs; review near-repeat clusters B03/B04/B05/B08 selectively; preserve original 12 restaurant photos, avoid calling illustrative art exact dishes.
- [ ] **Brand sources:** resolve logo/font use, restaurant name formatting, 640px-image limits and owner-approved visual identity.
- [ ] **Responsive design:** first-fold and full-page at 320/390/768/1024/1440; landscape tablet; 200% zoom; virtual keyboard; long Arabic item names and mixed Latin numerals.
- [ ] **Accessible interaction:** screen reader and keyboard, focus back after modal, proper tab order/live status, large touch targets, contrast, reduced motion.
- [ ] **Performance and PWA:** image loading/lazy media, core web vitals on low-end Android, service-worker update/offline state, no cached personal tracking/orders, tablet reload.
- [ ] **Discovery/website health:** real route titles/meta, share-preview imagery, favicon/app icons, correct map/phone/social URLs, page indexing vs hidden demo/operation pages.

## 6. Hidden-edges test matrix — DO NOT SKIP

| Test group | Must demonstrate |
|---|---|
| First visit | Home→Menu opens promptly, working navigation/search, no intro trap or asset blanks |
| Food options | Sizes, single/multiple add-ons, notes, quantity and exact subtotal survive add→cart→edit→back |
| Bad/empty data | No categories, no search hits, inactive item, expired offer, empty cart, invalid customer field, unavailable ordering |
| Data correction | Checkout doesn't clear cart on rejected response; no duplicate if impatient tap/retry; offline/network ambiguity clearly surfaced |
| Staging happy path | Actual original Menu→Cart→Postgres→Operator→same Customer Tracking, both pickup and delivery where supported |
| Operator reliability | 20+ visible tickets, 50-order query bound, filter/search, action conflict, disconnected tablet, browser sleep, reconnection and restored selected order |
| Ticket truth | Received vs accepted, preparing, ready, handoff, rejected/cancelled, stale/error/recovery; never fabricate payment/delivery GPS |
| Attention | New order after first poll, several arrivals, opt-out sound, tab background, actual Android tablet sound and visibility |
| Phone & assistive | Widths 320/390/768/1024/1440, portrait/landscape, 200% zoom, keyboard-only, real touch, reduced motion and error messages |
| Outbound support | WhatsApp/call/directions/complaint/review flows, fallback when unavailable; external send is not internal persisted success |
| Deployment readiness | Production vs test environment separation; HTTPS/domain, secrets, cost, backups, rollback, logs without PII, menu/hours/fees signoff |
| Release / staff | Merchant physically tries website→tablet→their existing cashier workflow; controlled pilot, then explicit go-live approval |

Automated evidence exists for **some**, not all, of these; never automatically tick this matrix green just because a previous run passed.

## 7. Priorities — no simultaneous ten-project detour

### NOW / P0 — finish the website's real customer journey
1. **T01 — Cart / Checkout quality**: tighten 390px content, fields and review without losing selected options; browser-proof 320/390 and keyboard; inspect before/after artifact.
2. **T02 — Home→Menu→Product consistency**: direct food access and clear product options; restore/back/modal/reduced-motion details; actual 390 and 1440 screenshots.
3. **T03 — Tracking states + ticket art**: cover all stages and errors and preserve order-context across reload. Same design language as operator paper receipt.
4. **T04 — Secondary routes and shared shell**: Offers, Finder, About, Contact, Reviews, Complaints and footer/nav; each has distinct purpose + empty/action/error QA.

### NEXT / P1 — make the restaurant tablet actually usable
5. **T05 — Order Press / Rail field usability**: real incoming order attention, sound mute, long orders, touch navigation, disconnected/reconnect states, test on 1024 tablet.
6. **T06 — One secure restaurant access gate**: protect inbox and status mutation with minimal server authorization, no separate employee roles/settings product.
7. **T07 — Accessible shared staging deployment**: separate DB, private test access; demonstrate physically separate website phone + tablet sharing one order, not two loopback browser windows.

### NEXT / P1 — living ticket + customer messages
8. **T08 — Operator-entered prep estimate** persisted in order event and animated on customer ticket.
9. **T09 — Customer opt-in Web Push** with notification→correct ticket, exact/duplicate delivery and actual background phone tests.

### BEFORE RELEASE — keep all of this visible; don't substitute it for current design work
10. **T10 — Merchant truth**: approved contemporary prices/stock/categories/ingredients/addons, actual offers, service hours, delivery zones/fees, contact/location and brand/media rights.
11. **T11 — Final integrated art/UX/device QA** across routes/widths; performance, accessibility, SEO, offline/PWA and staff walk-through.
12. **T12 — Controlled release**: stable host and DB, backups/restore and monitoring, environment/secret isolation, explicit merchant/user approval, staged pilot, rollback and intentional PR merge/deploy.

**Blocked by owner input:** T10 current restaurant data, actual logo/source photos and hands-on operating acceptance. Other dev/creative tasks continue independently.

**Not active / out of scope unless newly commissioned:** extra staff role architecture, Django/Oracle repeats, Talabat API, print/POS integration, cashier replacement, inventory system, fictional maps/delivery tracking. **Payments, rewards and other commercial ideas are explicitly indexed in section 9 as candidate decisions, not automatically discarded or silently authorized.** Retain old `/admin/*` only as legacy until explicit preservation/removal decision; do not confuse them with the new tablet screen.

## 8. Always-on workflow for our future chats

1. Check actual branch HEAD and last three CI workflows. **Read this file before older `20`, `31`, `36`, `37`, `38`**; read old docs only for context.
2. Open **latest screenshot artifacts** (not just run conclusion); pick the highest-value unfinished ticket above.
3. Make a **small coherent code diff on SAME branch** + add/update interaction test and screenshot if visual.
4. Re-run relevant CI; state exact code SHA and verified jobs. No claims about live site unless actually deployed.
5. Edit **this board IN PLACE**, under "Current work log" below: latest successful code SHA, files changed, proof links, newly discovered gaps, what remains. Do not append another disconnected "next chat" manifesto each time.
6. After closing a ticket, change its status and note the proof, not merely a green checkbox. If blocked, document *why and what input is needed*, then continue independent work.
7. Leave `PR #59` Draft, `main` and production untouched until explicitly authorized.

### Current work log — latest audit
**2026-10-22 / board initialization:** reconciled [site-first master plan](31_MASTER_DELIVERY_BOARD_AND_SITE_FIRST_RESTART_2026-10-22.md), [full customer journey](33_PASS_30_FULL_CUSTOMER_JOURNEY_AND_TRACKING_SYSTEM_2026-10-22.md), [staged Postgres two-window flow](36_REBIRTH_REAL_CART_OPERATOR_TICKET_POSTGRES_2026-10-22.md), [Order Press/Ticket Rail](37_THE_ORDER_PRESS_AND_TICKET_RAIL_2026-10-22.md), [sound/mobile Pass 38](38_OPERATOR_ATTENTION_AND_SITE_VISUAL_QA_2026-10-22.md), actual route tree, endpoints, QA scripts, worker and last three successful CI checks on `82a1a262`. **Only planning/docs in this board pass — no new runtime feature or deployment claim.**

**T01 current implementation pass:** **Cart-line modification + mobile first-screen composition** is implemented on the branch (technical SHA `23b6c218`). Browser proof on earlier intermediate `3c97d80c` [Visual QA #39777387744](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39777387744) SUCCESS with original cart→menu edit→cart flow and unchanged line identity. Latest full browser assertions for review-invalidating edits and focus errors, plus before/after screenshots, are **SUCCESS** in [Visual + Asset Gate #39777983392](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39777983392) at technical SHA `23b6c218`; screenshot artifact `12425537975` includes `checkout-before-line-edit-390.png`, `checkout-after-line-edit-390.png`, and equivalent 1440px screenshots. Inspected actual 390px captures: the line keeps its place, quantity goes **2→1**, mozzarella disappears, notes are retained and displayed, total changes **290→125 EGP**, and review checkbox is unchecked. Home/build [#39777984216](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39777984216) and Backend/Postgres [#39777983942](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39777983942) also **SUCCESS** on the same technical SHA.

**T01 changes:**
- `components/cart/cart-provider.tsx`: `replaceProductItem` updates original product line (same `lineId`, ordered position) instead of appending it. Changing items, quantities, customer/fulfillment or table clears `confirmedAccurateDetails`; no old review checkbox can sign off new selections.
- `components/rebirth/rebirth-menu.tsx` + `rebirth-product-dialog.tsx`: `/menu?editLine=<id>` opens the existing native food dialog with old size/addons/notes/qty preselected, saves an updated same line, returns to cart; cancel returns to cart; handles deleted/unknown line by going back to cart.
- `components/rebirth/rebirth-checkout.tsx`: user can explicitly “تعديل التفاصيل” on each product line; first invalid form field gets focus and centered scroll; header styles adapt based on a genuinely populated cart.
- `app/rebirth-checkout.css`: mobile populated cart enters as a compact functional receipt rather than repeating a giant editorial home scene; empty cart retains full editorial welcome; edit link has keyboard-focus styling.
- `scripts/qa/rebirth-interaction-check.mjs`: at widths 320/390/768/1440 tests original historical 125 EGP size + 20 EGP mozzarella + quantity 2, cart edit with qty/extra/notes changes, expected new 125 EGP total, **same ID and one row**, required re-review, invalid form focus and no spurious order POST. Captures 390/1440 before/after edit screenshots (verified and inspected in #39777983392).

**T01 continued (fulfillment + payment honesty, code `fd5d501a` / screenshot QA correction `e687710d`):**
- `components/rebirth/rebirth-checkout.tsx`: the same restaurant order form now clearly separates **delivery / in-store pickup**. Delivery shows **unknown** fee pending merchant confirmation and keeps mandatory address. Pickup shows no delivery charge and hides the address. Both show **food subtotal only**, never a fabricated charged total. A separate branded paper-style payment note says the website does **not** currently charge cards/wallets or confirm the actual payment method; no fake payment radio buttons. Review checkbox explicitly covers these caveats.
- **Data minimization, both sides of the boundary:** `rebirth-checkout.tsx` suppresses any old delivery draft address when a pickup request is submitted (without deleting the buyer's draft if they switch back); `lib/orders/order-validation.ts` also drops an irrelevant pickup address **server-side**, even when supplied manually by a client. Real delivery addresses are retained only for delivery.
- `app/rebirth-checkout.css`: mobile service-note / fees / current-item-only subtotal / payment disclosure styles, without introducing a new POS or choosing any unapproved gateway.
- `scripts/qa/rebirth-interaction-check.mjs`: independent mock checkout runs at **320/390/768/1440** prove delivery with address → rejected order leaves cart → toggle pickup hides address and preserves no-delivery-fee truth → review checkbox resets → new pickup submission contains `address:''` → switch back restores the editable delivery draft and resets confirmation again. Checks payment text never suggests online money capture. New **390px + 1440px** delivery/pickup screenshots included in [successful browser/asset run #39780130846](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39780130846), artifact `12426806316`. Personally inspected 390px versions. The original full-page QA screenshot was recorded while scrolled inside the form, creating a misleading mid-page position for the *sticky header in the stitched image*. Test-only correction `e687710d` now resets scroll/focus **before screenshots**. [Visual + Asset Gate #39781166067](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39781166067) **SUCCESS**, screenshot artifact `12427262055`; personally inspected 390px “checkout-delivery-payment-truth” and “checkout-pickup-payment-truth” recaptures with the header correctly anchored at top and fee/payment fields legible. Same code SHA Home CI [#39781166092](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39781166092) and full three-job Backend/PostgreSQL CI [#39781165992](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39781165992) also **SUCCESS**.
- `scripts/qa/rebirth-next-studio-integration.mjs`: actual disposable PostgreSQL/Next test submits a **pickup with malicious leftover address** and verifies saved `customer_snapshot.address === ''`; then creates actual **delivery** and verifies the correct deliberate address is stored. [Backend + three-job Postgres/Chromium run #39780130930](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39780130930) **SUCCESS** at `fd5d501a`; [Home/TypeScript build #39780130895](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39780130895) **SUCCESS**.
- **This does NOT implement or configure any cash/card/wallet/InstaPay/Fawry/payment link/QR payment method.** P01–P18 remain documented *capabilities awaiting merchant selection and signed-off provider contracts*. It is not safe to claim the subtotal is the final total while delivery fees/availability and merchant pricing are unverified.

**T01 still OPEN for:** actual Android virtual keyboard and 200% zoom, long add-on/name edit, changed historical server catalog during edit, checkout abandonment/duplicate/reconnection, pickup and delivery fee/coverage contract, merchant-approved payment choice (cash versus online/wallet/QR etc), and fully approved item prices. **Do not claim payment processing was implemented.** Next technical unit: merchant-approved delivery coverage/fees and pickup/handoff rules; cancellation/refund rules and an actual chosen payment-method/provider contract. Keep P01–P18 in section 9 open for owner direction.

**Other next tasks remain:** T02 Home→Menu→Product motion/visual cohesion, then T03 status/ticket, and T05 operator reconnection/sound. Site craft stays primary.


---

### T03 / NEW CARE LOOP — linked changes, rejection and cancellation clarity (23 Oct 2026)

**Scope:** The same live ticket on `/order-success` and the same existing restaurant order screen. NO auto-cancel, automatic refund, separate CRM/POS product or invented merchant policy.

- `components/rebirth/rebirth-order-tracking.tsx`: new **post-order assistance** printed-paper section. Once a server-confirmed order exists, it offers *request cancellation*, *request an edit* and *generic support* as **distinct** WhatsApp draft links with actual order reference and correct explanatory text. It retrieves the publicly configured WhatsApp number through `/api/public/site-settings`, validates it before forming an external URL and falls back to `/contact` if unavailable. No UI action mutates order state or guarantees messages were sent: user must review and send in WhatsApp. No phone/address or payment details are automatically shared in the prefilled message.
- **Status correctness:** `confirmationStatus=rejected` now has its own `declined` visual/semantic state ("المطعم اعتذر عن الطلب", `DECLINED`), distinct from generic `status='ملغي'` (`cancelled`). A restaurant rejection is NOT an indication that the customer chose to cancel. For terminal delivered, rejected or canceled states, action links for changing/canceling the order disappear but a support route remains. All modes explicitly state refund/payment outcomes are **not verified** by this system.
- `app/rebirth-tracking.css`: compact paper/stamp support language, keyboard focus and phone column layout; maintains the authentic printed-ticket metaphor.
- `scripts/qa/rebirth-interaction-check.mjs`: at 320/390/768/1440, mock a valid configured business WhatsApp, validate request cancellation link text/ref and never open/send it, assure generic help remains neutral and terminal states don't offer an active cancel/edit. Rejected and cancelled are independently verified, with screenshots for 390px declined/cancelled/ready/delivered.
- `scripts/qa/rebirth-next-studio-integration.mjs`: physically separate synthetic order rejected via authorized operator action, persists one `received → rejected` event and returns `ملغي` + `confirmationStatus=rejected` from the **original** Rebirth tracking endpoint. Repeating reject returns 409; no duplicate event. These stages remain synthetic staging, not live restaurant deployment.

**VERIFIED / technical checkpoint `c4305b3d`:** all three CI workflows **SUCCESS**: [Next/Home Typecheck & Build #39876883294](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39876883294), [Backend V2 PostgreSQL/Next Integration #39876883326](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39876883326), and [Real Chromium Browser + Visual QA #39876883134](https://github.com/omarkhair70-droid/tuscanini-ordering-system/actions/runs/39876883134). Browser screenshot artifact `12468907479` was generated. CI passing doesn't mean a real-restaurant pilot, direct customer-initiated cancel API, processor refund or physical tablet test. There is **no** settled merchant cancellation/refund policy or payment provider, so customer self-service cancel/refund APIs remain unbuilt.

**Next if this pass succeeds:** inspect actual 390px declined/cancelled screenshots, fix legibility or any test failures, then prioritize merchant prep estimate + real tablet/connection testing and real cash/prepay/refund policy as explicit decisions. Stage photos don't imply field approval.

---

## 9. THE UNEXPLORED PRODUCT UNIVERSE — discovered, not commissioned

**User scope correction (22 Oct 2026):** This board must also remember the **big questions never previously discussed or built**: every practical payment route, fulfillment variants, post-order lifecycle, support/reputation, retention, commercial terms, responsive edge cases, operational failure modes, strategic creative ideas and launch infrastructure. The previous T01–T12 are the **immediate execution shortlist**, **not the entire conceivable product**.

**Crucial rule:** The following is a **capability/opportunity inventory**, NOT approval to implement everything. We continue to build **one website plus one restaurant order screen**, not a POS/ERP, kitchen ERP, accounts platform or delivery fleet. Nothing starts automatically because it appears here.

Tags:
- **CORE** — logically required for reliable first-party ordering, but often needs restaurant-specific business decisions.
- **DECIDE** — potentially high value; estimate cost/complexity and have the owner choose.
- **IDEA** — creative differentiator / R&D hypothesis; test usefulness before shipping.
- **LATER** — optional future growth; never postpone the usable first release for it.
- **OUT** — outside current commissioning; record as a boundary, not a backlog promise.

Each future proposal gets an **owner/user value**, evidence/source, **dependency**, UX treatment, technical contract, risks, operating responsibility, test plan, then one of: \`chosen / experimenting / shelved / declined\`. Features cannot become \`done\` from attractive mockups.

### U01 — Payment methods and combinations (much broader than today's cart)

**Audited reality:** Current \`types/cart.ts\` carries delivery/pickup and items, but **no payment-method field**. The original \`rebirth-checkout.tsx\` submits an order; staged PostgreSQL shows order transaction correctness, **not a merchant payment processor**. \`spike_ts.payment_attempt\` exists as an experimental schema table, not evidence of card/wallet payments. No merchant settlement, capture, refund or successful external provider webhook has been demonstrated.

| ID | Method/experience | Status | Questions & required behavior |
|---|---|---|---|
| P01 | Cash on delivery (**COD**) | CORE / DECIDE | Will restaurant take cash for delivery? exact collection actor, change needed, cash due, failed handoff |
| P02 | Cash on pickup (**pay at store**) | CORE / DECIDE | Reservation versus confirmed order; pay when arriving; no false “paid” on submit |
| P03 | Existing counter card POS when picking up | DECIDE | **External** cashier terminal collects payment; website must not claim it processed payment |
| P04 | Online domestic/international cards (Visa/Mastercard/Meeza where supported) | DECIDE | Egyptian merchant onboarding, processor, currency, accepted card types, 3DS, settlement, merchant fees |
| P05 | Mobile wallets (Vodafone Cash, Orange Cash, e& money, WE Pay, others actually supported) | DECIDE | Provider-hosted wallet/R2P flow and callback; never assume every wallet is enabled for this merchant |
| P06 | InstaPay / instant account transfer | DECIDE | Distinguish **manual transfer + verified reconciliation** from supported merchant payment acceptance; **never** interpret screenshot/typed reference as paid |
| P07 | QR-code mobile-wallet merchant acceptance | DECIDE | Dynamic order-bound merchant QR, expiry, provider verification, callback, mismatch/refund |
| P08 | Fawry or comparable payment-reference collection | DECIDE | Merchant/provider capabilities, reference expiry, pending-paid transition, remote confirmation |
| P09 | Secure payment link / hosted checkout | DECIDE | Pay before/after staff acceptance? Expiring, amount-locked reference, authenticated callback, resume/cancel |
| P10 | Apple Pay / Google Pay | DECIDE | Provider-country/browser-device eligibility, wallet availability and fallback; not guaranteed for every merchant |
| P11 | Split payment (cash + online, two people) | LATER | Partial amounts, exact balance, failed second payer, refunds across methods; not automatic V1 |
| P12 | Pay for another person / gift order | IDEA | Receiver phone/privacy, address confirmation, surprise vs notification, payer/refund ownership |
| P13 | Tips (before/after order) | DECIDE | Recipient/tax/accounting treatment, refunds, merchant policy, skip friction |
| P14 | Gift cards / store credit / prepaid balances | LATER | Issuance, redemption, expiry, fraud, ledger/liability — not a generic coupon |
| P15 | Installments / BNPL | LATER / likely unnecessary for low-value restaurant orders | Provider availability and true consumer need; do not build for fashion |
| P16 | Deposit/prepay for scheduled large orders | DECIDE | Booking commitment, no-show/cancellation/deposit-refund terms |
| P17 | Refund to original method / partial item refund | CORE **if** any prepaid method chosen | Idempotent refund API, permissions, amounts, webhook/ledger reconciliation, customer notice |
| P18 | In-person QR/card/cash at counter | DECIDE | Existing restaurant equipment stays external; optionally record only that staff confirmed payment |

**Payment engine acceptance — independent from order status:**
- **CORE if online payment:** \`created → pending → authorized (if used) → captured/paid\`, or \`failed / expired / cancelled\`; refund states \`requested / partial / full / failed\`; processor-native statuses mapped without inventing financial success.
- The website should show **payment method + amount due/paid** separately from **restaurant accepted/preparing/ready/delivered**. A recorded order is not paid; a paid charge does not necessarily imply restaurant acceptance.
- Server computes **line item + variant + addon + discount + delivery fee + service fee + tax (if applicable) + tip = charged grand total**, with currency minor-units and immutable amount snapshot. Define who pays provider fees and whether prices displayed include those fees.
- Idempotent payment intents, safe provider redirect return, customer refresh/back, 3D Secure failure/abandon, webhook signature, out-of-order webhook, timeout, duplicates, payment accepted after restaurant reject/closed, cancel versus capture race, amount tampering, settled-without-order and orphaned order-without-payment.
- Reconciliation and settlement: processor transaction ID, amount, method, provider status, merchant payout/batch, fees, refund, chargeback/dispute, exception queue, audit and owner exports; avoid introducing accounting/POS replacement UI unless justified.
- **NEVER collect or store raw card number/CVV on Tuscanini servers.** Choose a provider-hosted redirect/embedded compliant checkout. Payment method availability and compliance are dependent on processor, merchant contract and PCI scope. No credentials/secrets in repo.

**Official research sources (comparison leads, not committed providers):**
- Egypt CBE mobile-wallet QR and R2P merchant acceptance: https://www.cbe.org.eg/en/payment-systems-and-services/payment-services/payment-acceptance/mobile-payment-acceptance
- Egypt CBE wallet ecosystem: https://www.cbe.org.eg/en/payment-systems-and-services/payment-services/mobile-wallet
- Egypt CBE Instant Payment Network: https://www.cbe.org.eg/en/payment-systems-and-services/instant-payment-network (does NOT by itself prove a Tuscanini merchant API exists)
- Paymob's own checkout payment-method overview: https://developers.paymob.com/paymob-docs/developers/checkout-experiences/overview (provider example only)
- Official PCI SSC hosted/embedded payment boundary: https://www.pcisecuritystandards.org/faqs/1438/ and SAQ updates https://www.pcisecuritystandards.org/faqs/1588/

### U02 — Fulfillment, physical service, location and timing

- **F01 CORE:** Pickup versus delivery information differs; no address on pickup; don't ask irrelevant fields.
- **F02 DECIDE:** ASAP vs **preorder** for later, schedule date/time, earliest slot, maximum look-ahead, capacity and closure.
- **F03 DECIDE:** Store hours, weekly holidays, Ramadan/special holidays, temporary busy/pause, kitchen cut-off, per-fulfillment time windows; server-controlled availability.
- **F04 CORE if delivery:** Areas/pincodes/neighborhoods accepted, unavailable address feedback, real delivery fee, free-delivery threshold, minimum order, ETA source.
- **F05 DECIDE:** Delivery address as text, landmark, apartment/floor, optional map pin, caller instructions, pickup branch and directions; privacy retention for exact address.
- **F06 DECIDE:** Restaurant's own courier vs external delivery service; who marks dispatched/delivered, handoff rules, no synthetic courier GPS.
- **F07 DECIDE:** Estimated preparation/delivery time **entered by staff** and revised on ticket, delay handling, pickup notification, lateness and exception.
- **F08 LATER:** Multiple branches and branch-aware inventory/prices/hours/coverage; only if merchant actually has them.
- **F09 LATER:** Dine-in / table QR and table reference; existing historical table support is not a commissioned in-venue POS.
- **F10 DECIDE:** Group/bulk order and timed catering; lead time, confirmations and deposits only if demand verified.
- **F11 IDEA:** “Ready to pick up” accessible ticket matching physical packaging; printed/digital receipt referent without inventing hardware.
- **F12 DECIDE:** Lost/undeliverable courier, unreachable customer, no-show pickup, incorrect address, wrong handoff and what the operator can resolve.

### U03 — Menu truth and rich food selection

- **M01 CORE:** Current merchant-approved categories, products, Arabic names/descriptions, prices, price variants, availability and last verified date.
- **M02 CORE:** Sizes, toppings/add-ons, modifier groups, required/exclusive selections, min/max selection limits, notes/allowed length, quantity bounds, incompatible combos.
- **M03 DECIDE:** Half/half pizza, choose bread/sauce/cooking level, substitution/replacement, combo meals, drinks/sides bundles **only if the real menu supports them**.
- **M04 DECIDE:** Sold-out item/addon and low-stock availability without sitewide ordering shutdown; price change while cart open, cart correction review.
- **M05 DECIDE:** Allergens and ingredient disclosure, dietary/spicy tags with source confirmation; **never derive allergen safety from AI-generated images**.
- **M06 IDEA:** Editorial close-ups, ingredient cross-sections, paper-fold labels, animations mapped to actual categories; useful not fictitious.
- **M07 CORE:** Arabic synonym search/typo/accent variants, duplicate same names across categories, no-results suggestions, direct category URLs.
- **M08 LATER:** Favorites, saved last selection, recently ordered, one-click reorder with **fresh** prices/availability/choice validation.
- **M09 DECIDE:** Nutritional content, portion weights, ingredient changes, allergen cross-contact policy; only with verified merchant source.
- **M10 DECIDE:** Dynamic combos / meal builder that never misprices optional extras; owner decides scope.

### U04 — Promotions, commercial rules and value

- **C01 CORE:** Actual active offers with eligibility/availability/time windows; transparent current price.
- **C02 DECIDE:** Promo codes (fixed/%), single-use/first-order, max discount, minimum subtotal, eligible category, expiry, stacking rules, abuse checks.
- **C03 DECIDE:** Product bundles, family boxes, add-on upsell and checkout recommendation based on real menu, not dark-pattern cross-sell.
- **C04 DECIDE:** Free delivery or discounted delivery threshold; rounding, tax/fee clarity and edge cases.
- **C05 LATER:** Loyalty points/stamps, birthday rewards, referral code, cashback/store credits; requires meaningful merchant repeat-customer strategy and privacy model.
- **C06 IDEA:** Digital packaging ritual when offer unlocks, personalized reorder print label; test speed/clarity before production.
- **C07 DECIDE:** Restaurant-funded versus payment-provider campaign and settlement owner, refund after discounted item removed.
- **C08 DECIDE:** Gift/free product exceptions, employee/manual adjustment constrained by authorized staff (not full POS).

### U05 — Checkout, basket, order records and after-sales reality

- **X01 CORE:** Persist cart across refresh/back/tab close; separate multiple configurations of same SKU correctly; edits and line deletion not merged unexpectedly.
- **X02 CORE:** Review exact size/addons/notes/qty, current price and all fees **before** commit, delivery/pickup fields and contact.
- **X03 CORE:** Double-click guard, idempotent server order key, timeout/ambiguous response, stale cart, delayed network, retry that doesn't clone a sale.
- **X04 CORE:** Unique readable restaurant reference vs private opaque customer tracking capability; QR/share links with privacy.
- **X05 DECIDE:** Anonymous guest checkout as default versus optional saved identity; avoid compulsory registration and OTP without need.
- **X06 DECIDE:** “Modify order” grace period and explicit acceptance cutoff; preserve server audit and totals, operator sees corrected ticket.
- **X07 DECIDE:** Customer cancellation before acceptance/preparation; separate merchant cancel, rejection reason, auto/refund if prepaid, fair user copy.
- **X08 DECIDE:** Customer request support/change via WhatsApp/call or in-product support; meaningful escalation, no imaginary SLA.
- **X09 DECIDE:** SMS/email confirmation only with lawful consent, verified delivery provider, failure handling, templates; not universally necessary.
- **X10 LATER:** Order history/reorder with opt-in identity, receipts and archived transactions; data minimization.
- **X11 DECIDE:** Data minimization and deletion/retention: order phone/address kept only as operationally required; avoid surfacing on unnecessary screens.
- **X12 DECIDE:** Printable downloadable order receipt/ticket for customer (not necessarily a tax invoice); truthful paid/unpaid words.

### U06 — Live ticket, operator attention and order exception choreography

- **O-U01 CORE:** New order attention, audible opt-in, connection status, no lost ticket after sleep/reload, bounded polling/reconnect.
- **O-U02 CORE:** Readable item/size/notes at once; focus/queue/rail search, next action, touch size, no 20-order overlap.
- **O-U03 CORE:** Double actions, stale version conflict, two browsers taking action concurrently, request timeout, safe refresh; one authoritative event log.
- **O-U04 DECIDE:** Operator short decline/hold/delay **reason** and customer-facing message, not giant operational analytics.
- **O-U05 DECIDE:** Operator-set prep ETA and corrections, meaningful customer stamp and notification.
- **O-U06 DECIDE:** Phone/address reveal on explicit need, privacy/screen sharing, call action, no PII in audio/toasts/logs.
- **O-U07 DECIDE:** Pause new web orders and reopening **without** breaking already accepted orders.
- **O-U08 IDEA:** Paper print-room art direction, motion on new state only, order “tear/open/stamp/pass” loop shared across site and restaurant tablet.
- **O-U09 DECIDE:** How staff hand over into *existing* cashier/kitchen workflow; check “entered in POS” only if required by actual restaurant procedure.
- **O-U10 OUT:** Multi-employee scheduling, inventory procurement, kitchen station routing, Talabat sync and receipt printer until explicitly requested.
- **O-U11 CORE:** One secure restaurant-only access gate, private API and audit; **not** separate role-management app.

### U07 — Messaging, service and customer trust

- **N01 CORE:** In-page real-time-ish status with correction after missed intervals, stale/offline indicators and manual refresh.
- **N02 DECIDE:** Customer Web Push (explicit opt-in, scoped tracking subscription, background SW notification/click, expired/unsubscribed token and retries).
- **N03 DECIDE:** SMS or WhatsApp *business-platform* notifications with cost/consent/template and provider delivery acknowledgment, distinct from a \`wa.me\` link.
- **N04 DECIDE:** Confirmation/pickup-ready vs marketing notifications; separate consent and per-category unsubscribe.
- **N05 DECIDE:** Structured “problem with my order” linked to order ID versus current WhatsApp draft; receipt and response expectations.
- **N06 DECIDE:** Review capture after delivered, private feedback vs public review, moderation/source authenticity, zero fake ratings.
- **N07 LATER:** FAQ/how ordering works, shipping/returns/refunds policy, accessibility contact and support escalation.
- **N08 IDEA:** “Your food has entered the kitchen” expressive status stamp with meaningful narration and silent/reduced-motion option.
- **N09 CORE:** Error messages actionable, distinct order/payment/fulfillment facts, offline fallbacks and human contact path.

### U08 — Retention, discovery and growth (not mandatory loyalty platform)

- **G01 CORE:** Local SEO and brand search listing, contact/open-hours correctness, structured restaurant/menu facts only when supported, metadata, canonical URLs.
- **G02 DECIDE:** OpenGraph/social share image, campaign deep links, QR on physical packaging to menu or order status, print-ready QR with tested short destinations.
- **G03 DECIDE:** First/repeat visitor journey: direct menu above fold, saved cart, optional quick reorder and revisit active ticket.
- **G04 LATER:** Opt-in CRM/customer segmentation, email/WhatsApp marketing and consent/deletion; not assumed from checkout phone number.
- **G05 LATER:** Referral/affiliate, loyalty, gamification, “build your box” experiments; evidence from real orders before cost.
- **G06 DECIDE:** Basic analytics events: menu opened → product viewed → modifier selected → cart → checkout attempt → recorded order → fulfilled, with no raw address/phone in analytics.
- **G07 DECIDE:** Merchant KPI reading outside the operator order screen (e.g. privacy-safe event reports); never build a dashboard just because analytics exists.
- **G08 IDEA:** Physical/digital brand continuations using true store packaging, sticker/receipt and bespoke food glyphs, not generic points/streaks.

### U09 — Original creative direction and authoring beyond pages

- **A-U01 CORE:** Truly ownable Tuscanini typographic/motion/physical identity; not 10 matching heroes or copied award-winning patterns.
- **A-U02 CORE:** Full mobile/desktop rhythm and photography: 12 actual restaurant photographs + 100 generated category illustrations, careful role/story/attribution and correct SKU truth.
- **A-U03 DECIDE:** Menu-as-print-sheet, package-fold transitions, living tear-off receipt; unique **behavior** not ornamental parallax.
- **A-U04 DECIDE:** Food discovery by appetite/occasion, contextual category shuffle, user-decision aids, visually distinct secondary routes.
- **A-U05 IDEA:** Micro-interactions tied to quantities/addons; reversible product-to-cart shared element, deliberate sound only where requested, optical/tactile responsiveness.
- **A-U06 DECIDE:** Photography production shot list for missing exact products, genuine packaging/video/macro footage, owner-approved custom logo and source art.
- **A-U07 IDEA:** Genuine Beni Suef/place language, real photos and locality as authored content with verifiable claims, not made-up origin myths.
- **A-U08 CORE:** Respect performance, 320px, 200% zoom, virtual keyboard, Arabic/mixed text, dark/light contrasts, reduced motion, focus and screen reader.

### U10 — Physical restaurant and human handoff

- **H01 CORE:** Full observed customer→tablet→staff→existing cashier/kitchen handoff with actual person; document failure points and who answers phone.
- **H02 DECIDE:** Multiple sources coexist (phone, counter, Talabat, web); operator screen shows **web orders only**, no claims of merged full restaurant queue.
- **H03 DECIDE:** Offline tablet/internet outage plan: how merchant takes calls, what the website tells customers, how staff checks pending orders when back online.
- **H04 DECIDE:** Who owns menu changes, opening/closing orders, temporary stock stop, support escalations and end-of-day reconciliation.
- **H05 DECIDE:** Staff instructions, two-minute training, readable minimal order ID and printed fallback if the business already has a print process.
- **H06 OUT unless newly commissioned:** POS integration, fleet management, native Android cashier app, cashier drawer printing and enterprise personnel management.

### U11 — Technical quality, privacy, compliance, supportability

- **Q01 CORE:** Site and server pricing/discount/fee authority, concurrency, mutations under DB transaction, idempotency and proper event history.
- **Q02 CORE:** Connection pool, DB migration/versioning, data backup/restore, deploy/rollback, site availability, error budgets and minimal observability.
- **Q03 CORE:** Secure customer ticket capability, no guessable PII link abuse, retention controls, scoped restaurant endpoint, rate limiting and secret hygiene.
- **Q04 CORE if payment selected:** Hosted PCI-responsible checkout, signed callbacks, payment/refund idempotency, reconciliation, processor downtime, fraud/chargeback policies.
- **Q05 CORE:** HTTPS, secure cookie if used, CSRF where necessary, SSRF/input validation, cache protections, media CSP, cross-browser behavior.
- **Q06 CORE:** Privacy notice, consent where applicable, retention/deletion request channel, consumer-facing terms, payment/refund policy once payment exists; review Egyptian legal/tax obligations with merchant/professional before asserting exact requirements.
- **Q07 CORE:** Mobile Lighthouse/Core Web Vitals/slow 3G/low-end Android, images optimized, CSS/JS budgets; no motion trapping repeat visitors.
- **Q08 CORE:** Accessibility 320–1440, 200% zoom, touch, physical keyboard, focus/ESC, ARIA announcements, reduced-motion and contrast.
- **Q09 CORE:** Metadata/favicon/manifest/offline error/PWA updates; Android/iOS install behavior; notification permissions if Push gets chosen.
- **Q10 CORE:** Automated screenshot/functional/error-state regression across public pages and operator; synthetic QA separated from merchant data.
- **Q11 DECIDE:** Feature flags and rollback switches for payment methods, web ordering, offers, delivery zones, operator sound, push.
- **Q12 CORE:** Slow provider, intermittent hosting, out-of-order events, retries, stale catalog, partial failures, process restarts, delayed processing; rehearse failure mode.
- **Q13 DECIDE:** Automated accessibility audits and threat-model/review; prioritize high-risk commerce screens, not empty checklists.
- **Q14 CORE:** Never send contact info, raw order contents or secret keys to analytics/third-party visual observability.

### U12 — Experiments, decisions and merchant economics

- **R01 DECIDE:** Which payment methods have merchant acceptance contracts? Fees and payouts? **No provider selected** yet.
- **R02 DECIDE:** Is cash at delivery/pickup the desired initial V1, with online payments as separate rollout?
- **R03 DECIDE:** Delivery fleet/coverage/fees, opening hours, pickup timing, tax-inclusive display, cancellation and refund policy.
- **R04 DECIDE:** Who updates catalog, who sees tablet, who confirms orders, how they treat Talabat/existing POS?
- **R05 DECIDE:** Brand/media/logotype actual owner approval, menu pricing/ingredient photos and customer contact truth.
- **R06 IDEA:** 3–5 tested creative hypotheses with clear customer behavior and performance effect, not infinite inspirational research.
- **R07 DECIDE:** Provider/hosting total-cost model, maintenance ownership, backups and low-traffic economics.
- **R08 DECIDE:** A real merchant-supervised synthetic-to-pilot trial, then explicit approval to switch on production checkout.

## 10. DETAILED PAYMENT & COMMERCE DECISION TREE — do not hide inside T01

**Why it matters:** A gorgeous cart with no agreed payment, delivery-fee and cancellation contract is not a complete restaurant ordering product. Conversely, **not** every method should be built simply to appear feature-rich.

1. **Before asking for payment:** confirm whether restaurant accepts **cash-on-delivery**, **cash-on-pickup**, **card-at-counter**, **online prepay**, and which methods/fees/regions it actually supports. Decide whether orders can be placed without prepay.
2. **If no online payment commissioned for V1:** show honest “الدفع عند الاستلام” or “الدفع في الفرع” *only after merchant confirmation*. Persist method and \`unpaid / due_on_delivery / due_on_pickup\` as appropriate; no fabricated \`paid\` state. The existing cashier handles collection.
3. **If online payments commissioned:** pick actual merchant-eligible gateway based on official API docs, live/test access, card/wallet methods, costs, settlement, support, refunds, dispute response, and real device experience. Do NOT expose card collection fields on Tuscanini server.
4. **Place/order-charge relationship:** choose and prove one coherent approach: authorize/capture on accepted order; or pay-then-accept with automatic rejection/refund handling. Avoid uncoupled paid charges and rejected orders.
5. **Financial lifecycle as a separate record:** payment intent, merchant order, provider reference, attempts, webhook, refund, settlement and exceptions. Customer sees short understandable words; restaurant sees only necessary operation data.
6. **Test matrix before any online payment launch:** normal payment; 3DS approval/reject; payer closes tab; slow callback; two callbacks; client forged success URL; duplicate POST; out-of-stock after pay; restaurant rejects after capture; partial cancellation; double refund; gateway outage; mismatch between payout and order; webhook failure/retry; dispute.
7. **Merchant acceptance** signs off supported cards/wallets, payout account, refund responsibility, legal/customer copy, invoice/tax applicability, and reconciliation procedure.

**Explicit design opportunity:** The post-order living ticket can combine **three honest layers** — \`Order received\` / \`Restaurant preparing\` / \`Payment settled or due\` — inside one coherent paper-like physical design. This is more distinctive and useful than adding three unrelated dashboard cards.

## 11. ONE-PRODUCT CROSS-CHANNEL CUSTOMER JOURNEY (all the unseen transitions)

\`\`\`text
Discovery (search/social/QR/return visit)
   → Homepage/direct menu (fast and expressive)
   → Search/category/finder/valid offer
   → Actual food choice and modifiers (or saved/reordered validated option)
   → Basket edit & location/service mode
   → Available time/fee/payment terms
   → Customer contact + complete total + consent
   → Server validates current menu and requested slot
   → Order created exactly once (regardless of double tap/retry)
   → [If prepaid chosen] verified provider payment / pending / failure / refund
   → Restaurant order tablet receives it (+ optional sound)
   → Staff accepts/rejects and prepares in existing restaurant workflow
   → Updated estimate / prepared / pickup or delivery
   → Same customer's living ticket and optional notification
   → Collected / handed over / completed (paid status independent)
   → Support / complaint / review / optional reorder / recommendation
\`\`\`

**Branches often forgotten:** search no results, unapproved product, expired promo, wrong pickup time, no delivery coverage, no change for cash, incorrect phone, duplicate modifiers, disconnected user, browser refresh, staff offline, merchant closed, item sold out, staff rejection, post-payment cancellation/refund, delivery failed, stale ticket, missed notification, multiple tabs, iOS PWA restriction, operator tablet sleep, data-removal request, and merchant changes a price while cart sits open.

## 12. FEATURE EVALUATION AND COVERAGE RULES

Never substitute a giant list for product judgment. When choosing a candidate from U01–U12:

| Field | Required decision |
|---|---|
| Feature ID / job | Concrete customer/staff problem it solves; whose moment |
| Current reality | \`not discussed / not built / built local / CI proved / deployed / merchant confirmed\` with exact artifact |
| Business value | Order conversion, reduced effort/errors, repeat, service/trust or distinctive creative expression |
| Complexity/ops | Front-end / server / database / external contract / subscriptions / cost / maintenance owner |
| User experience | Full happy path **and** refusal/error/empty/retry/offline/return case |
| Dependencies | Merchant decision, payment provider, customer consent, images, ops, delivery partner |
| Next action | Research 1 narrow fact / wire mock safely / build staging / usability test / decline |
| Validation | Screenshot + interaction + DB test + real device/provider/merchant gate as applicable |

**Do not** make everything P0. No uncommissioned payment, CRM, SMS, loyalty, multi-store, location tracking, consumer accounts or employee profiles simply because this catalog exists.

### Updated execution tracks after broad product audit

| Track | Work now | Explicitly visible decision lane | Later possibilities |
|---|---|---|---|
| Experience | Home→Menu→Product→Cart→Ticket craft, all supporting pages, mobile/accessibility | approved content, image truth, fulfillment/service rules | reorder, favorites, gifts, category animation |
| Commerce | real item/option math, safe checkout, order submission and tracking | cash vs prepay, fees, promo validity, cancellation/refunds, provider approval | wallets, dynamic QR, payment links, loyalty |
| Restaurant screen | Press/Rail touch usability, live order attention/status/reconnect | simple access, prep estimate, handoff reality, order closures | print integration/stations only if commissioned |
| Growth/service | truthful contact/review/complaints, working support and discovery | actual offer terms, analytics consent, search and deep links | campaigns, CRM, referrals, membership |
| Platform | isolated Postgres, test and production gates, mobile PWA, web push design | cost, HTTPS, monitoring, retention, owner approval | multi-branch and advanced insight if actual demand |

**Next implementation is still T01** unless the user explicitly reprioritizes. **Parallel product-discovery questions:** what exact payment-at-handoff method the restaurant uses, online payment willingness, delivery coverage and fees, operating hours, cancellation handling and approval of today's menu. None of those questions freezes creative implementation.

### Broad audit log (22 Oct 2026)

**Source inspection:** \`types/cart.ts\` has no payment method; \`components/rebirth/rebirth-checkout.tsx\` currently validates name/phone/delivery address and records an order, with local studio override; \`app/api/orders/route.ts\` retains Supabase for non-staging traffic; \`public/sw.js\` handles offline shell but no customer Web Push; \`/reviews\` and \`/complaints\` route to WhatsApp rather than a persisted support desk. Historic SQL contained tables/enums for older admin/reviews, but schema presence is not a released first-party review/payment system. All backend success described earlier remains **staging-only**.

**No new payment code was claimed or deployed in this audit.** The exploratory universe adds opportunities, risks, acceptance cases and merchant questions to the SAME ongoing board so work does not disappear between chats. The original T01–T12 are still the current short execution queue; this section is its **comprehensive possibility register**.
