# Tuscanini — incoming owner-generated food assets

## ONE-FILE UPLOAD / 100 PHOTOGRAPHS

This is the **intake folder**, not the web-serving directory.

Please upload the unmodified owner-generated **8.9 MB** file
`tuscanini_pass19_100_optimized_web_images.zip` to this folder **and name it**
`tuscanini-pass19-images.zip`.

1. On branch `redesign/tuscanini-authored-experience-20261018`, open this `assets/intake` directory.
2. Choose **Add file → Upload files** (or drag/drop).
3. Upload **one** ZIP named **`tuscanini-pass19-images.zip`**.
4. Commit to **this existing branch**, NOT `main`; do **not** merge or deploy.

The committed ZIP triggers `.github/workflows/rebirth-owner-100-image-intake.yml`.
That workflow unpacks only the 100 expected owner assets, verifies each
720x720 WebP and inventory, commits the real image bytes into
`public/images/rebirth/generated`, then schedules the enabled-image
real-Chromium browser/media/FLIP QA. The workflow cannot merge or deploy.

**The photographs are AI-generated illustrative food images, not actual
restaurant photographed dishes nor a promise of exact ingredients.**

Current / historical restaurant product data, prices and checkout logic are
never modified by the image intake.
