# Tuscanini — photographed cashier modifiers (25 October 2026)

## Provenance

Owner supplied a **photo of the existing cash-register app**, page labelled `الإضافات`. This is merchant-source reference for the labels and **displayed prices in EGP**, not proof they are enabled for every dish. The POS developer verbally confirmed integration feasibility, **not** endpoints, authentication, codes, or a successful test order.

## Exact screen transcription

| Display name on POS | EGP | Website handling |
|---|---:|---|
| موتزاريلا | 20 | Selectable in savoury-crepe product customization |
| رومي | 20 | Selectable in savoury-crepe product customization |
| شيدر | 15 | Selectable in savoury-crepe product customization |
| كونو | 25 | Selectable in savoury-crepe product customization |
| رول | 20 | Selectable in savoury-crepe product customization |
| صوص تكساس | 15 | Selectable in savoury-crepe product customization |
| دبل فطيرة | 15 | Selectable in savoury-crepe product customization |
| إضافة سوسيس كبير | 30 | Selectable in savoury-crepe product customization |
| إضافة برجر كبير | 30 | Selectable in savoury-crepe product customization |
| إضافة سوسيس صغير | 15 | Selectable in savoury-crepe product customization |
| إضافة برجر صغير | 15 | Selectable in savoury-crepe product customization |
| إضافة دونرز | 35 | Selectable in savoury-crepe product customization |
| صوص ألف جزيرة | 15 | Selectable in savoury-crepe product customization |
| صوص شيدر | 15 | Selectable in savoury-crepe product customization |
| صوص باربكيو | 15 | Selectable in savoury-crepe product customization |
| صوص سويت تشيلي | 15 | Selectable in savoury-crepe product customization |
| صوص رانش | 15 | Selectable in savoury-crepe product customization |
| إضافة استربس | 25 | Selectable in savoury-crepe product customization |
| إضافة مشروم | 20 | Selectable in savoury-crepe product customization |
| إضافة بطاطس | 10 | Selectable in savoury-crepe product customization |
| إضافة كفتة | 30 | Selectable in savoury-crepe product customization |
| إضافة سجق | 25 | Selectable in savoury-crepe product customization |
| ميكس جبن | 25 | Selectable in savoury-crepe product customization |
| إضافة كريسبي | 15 | Selectable in savoury-crepe product customization |
| S أساف | 35 | Held for restaurant clarification |
| M أساف | 45 | Held for restaurant clarification |
| L أساف | 60 | Held for restaurant clarification |
| F أساف | 75 | Held for restaurant clarification |
| إضافة شاورما | 25 | Selectable in savoury-crepe product customization |
| إضافة فاهيتا | 30 | Selectable in savoury-crepe product customization |
| إضافة تركي مدخن | 20 | Selectable in savoury-crepe product customization |
| إضافة روزبيف | 20 | Selectable in savoury-crepe product customization |
| إضافة سلامي | 20 | Selectable in savoury-crepe product customization |
| إضافة بسطرمة | 40 | Selectable in savoury-crepe product customization |

Notes: The four S/M/L/F entries read approximately "أساف" in the photo. The exact underlying product and naming cannot be verified; do not offer them as modifiers until confirmed. "كونو" and "رول" remain from the previous menu and the screenshot, but their meaning/compatibility must be verified. `رول` was **25 in the legacy site catalog** vs **20 in the photographed POS**, so the pending website reference was corrected to 20 (not synced into any actual POS). The generic legacy `صوصات` product is retained only as historical catalog item `ca6`; specific new named sauces now appear in the customization list.

## Ordering safety and workflow

- **30 / 34** identifiable POS entries are represented as selectable savory crepe choices. **4 / 34** unresolved sizing entries are documented but not selectable.
- The `addon-*` IDs remain website IDs. Their equivalents in the cashier POS **must be mapped to actual POS modifier/product IDs**, not inferred by label or assumed to match.
- Website reference data and Oracle catalog must not drift. **Catalog sync stays disabled** until restaurant approval and explicit server-side migration, with tests of exact prices, item compatibility, tax/fees and order lifecycle.
- Existing menu has 113 historical entries, not an owner-confirmed replacement menu. Pizza/sandwich products do not silently inherit crepe toppings. Existing sweet crepes keep no savoury toppings.
- Staff to confirm: which extras apply to which food families; whether “كونو” vs “رول” are alternatives; whether sizing entries are additions or products; stock/availability, taxes/fees and approved retail prices.
