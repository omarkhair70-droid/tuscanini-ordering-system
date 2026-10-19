# PASS 19 — OWNER-GENERATED 100 FOOD IMAGES / REAL MENU INTEGRATION (19 OCT 2026)

## Real progress vs remaining upload blocker
**The owner explicitly authorized replacing random Pexels stock with 100 AI-generated menu photos.**
All 100 images exist in ChatGPT Library, 10 batches, previously inventoried in `/Tuscanini Rebirth/Generated Menu Images`. **They are not 100 verified real dishes from the physical Tuscanini restaurant.**

### What has been implemented IN THIS GITHUB BRANCH
- `lib/rebirth/generated-menu-media.ts`: deterministic category-first + item-name-aware selection using the owner's 100 generated visual IDs (B01-01 through B10-10). It does **not** change `featuredItems`, names, prices, sizes, offers, cart, or order acceptance. No false inferred ingredients. Water, Pepsi, Seven Up, other packaged sodas, tuna pizza, sauces, coleslaw etc. retain artwork/old source references where a generated photo would mismatch their nature.
- `components/rebirth/product-artwork.tsx`: the photo tab prefers local generated illustrative images *when enabled*, and retains original unique SKU artwork as fallback. Each generated food card says **صورة تخيلية توضيحية**; exact restaurant photos still have their own isolated owner-reviewed manifest.
- `components/rebirth/rebirth-product-dialog.tsx`: product sheet explicitly says the AI image is illustrative, not verified product ingredients. Existing native accessible dialog and 390ms clicked-image FLIP remain in place, as do real size/add-on/quantity/cart selections and server-confirmed order workflow.
- `components/rebirth/rebirth-menu.tsx`: explanatory public disclosure varies based on actual asset readiness; original source-labelled Pexels remains available while generated media is not installed, and authored one-SKU graphic portraits are still opt-in.
- `app/menu/visual-atlas/page.tsx` + `visual-atlas.css`: 100-frame curated responsive gallery. Accessible and live only after all images are physically available. The gallery is a study/archive, NOT an expanded restaurant catalog with invented dish names.
- `scripts/qa/verify-generated-menu-media.mjs`: **fail-closed image gate** when activation requested, verifies all 100 files exist, WebP signatures, minimum size and exact image count; default inactive branch builds safely against old stock/graphics.
- `.github/workflows/rebirth-visual-qa.yml`: adds the readiness gate. Existing real-browser screenshot, real-item dialog/cart/order flow and mobile video checks remain in CI.

### IMAGE ASSET DELIVERABLE (CHATGPT LIBRARY; NOT YET COMMITTED TO GITHUB)
`/Tuscanini Rebirth/Generated Menu Images/pass-19-ready-for-repo/`
- `100-webp-asset-install-package.zip` — **100** separate square **720×720 WebP** files, about **8 MiB** unzipped total; path `public/images/rebirth/generated/bNN-NN.webp`; a JSON source/provenance/hash inventory, a single 100-card contact sheet, an optional offline `preview.html` showing click-to-image shared-object FLIP and reduced-motion mode, installation instructions, and a verification/installer script.
- Original 10 pizza images (batch 07) were extremely wide derived from single collage frames; the generated 720px square previews **contain the entire horizontal pizza image over a softened background**, rather than guillotining off the sides of the actual pizza. These wide-source images still need artistic owner approval.
- 17 near-similarity pairs flagged in original perceptual-dHash audit; extremely similar chicken, beef and cheese crepe poses are still individual images, and the owner should approve them in context. 0 byte-identical originals.
- `node install-images.mjs /path/to/project` copies and byte-validates all images into the repository's `public/images/rebirth/generated` folder, **without committing, deploying or changing .env files**. After owner review set `NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES=ready`, run the gated media check, production build and real interactive browser QA with assets ENABLED before any merge or production push.
- **Important connector limitation:** GitHub connector's create/update file actions accept only UTF-8 text and do not consume local binary files; GitHub create_blob accepts a base64 string but cannot use a container file path. Thus the 100 image **binary bytes are not actually in this PR yet**. The code gate is intentionally inactive, so the current green CI run certifies no regressions to the previous menu/FLIP, not that the 100 images have been delivered on the website. Do NOT describe the upgrade as launched.

## Critical owner-preserving rules
- Keep PR #59 **Draft, open and unmerged**; no Vercel production deployment without explicit consent.
- Do not overwrite existing authenticated 12 restaurant original photos or old 113-item original previous-price catalog.
- No dish is an exact restaurant-product photo until merchant confirms it; zero true named-dish images in verifiedMenuPhotos today.
- Do not interpret AI image components as ingredients, allergies, recipe details, actual packaging/size, availability, discount, or merchant endorsement.
- Menu is still searchable/filterable and 20-item paginated; the art/photo/fast view modes are preserved; keyboard and reduced-motion must work.
- Batch-source folders, audits, manifests and the full 100-image optimized ZIP are stored in the user's persistent ChatGPT Library for other threads to reuse.

## Actual validation so far
- New text/code baseline passes `npx tsc --noEmit`, `npm run build`, the existing Browser QA and FLIP films **with generated image flag OFF**; source-aware Pexels fallback remains the active imagery until binaries land.
- Local asset-package validator: 100 distinct filenames, 100 valid WebP images **720×720**, all ZIP CRC checks pass; offline preview's embedded JavaScript passes `node --check`.
- Actual offline-preview browser test was attempted but blocked by browser's administrative navigation policy in this execution environment; no browser QA success claim for that preview.
- Required final approval gate (not yet done): copy 100 generated assets into GitHub branch, turn media flag READY only then, check 100 images render on 390/1440 without network 404s, use same photo for card and native detail FLIP, test 320/390/768/1440 reduced-motion/search/addons/cart, visually review 17 near matches and B07 collage composition.
