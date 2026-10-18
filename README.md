> ### TUSCANINI REBIRTH / 2026 — active development
> The restaurant site is being rebuilt as a new authored customer + operations experience. The original implementation is preserved on `main`; the live redesign is a **Draft PR**, not a finished release.
>
> **Start here:** [Research and decision source of truth](docs/rebirth/00_START_HERE.md) · [Research atlas](docs/rebirth/01_RESEARCH_MEMORY.md) · [Creative/media bible](docs/rebirth/02_CREATIVE_AND_MEDIA_SYSTEM.md) · [QA contract](docs/rebirth/03_ENGINEERING_AND_QA.md) · [Build gates](docs/rebirth/04_BUILD_SEQUENCE_AND_DECISIONS.md).
>
> Photo assets are a required release gate: the 12 genuine 640px Tuscanini images are cataloged in `lib/rebirth/food-media.ts`; 11 of 12 genuine images are now committed as original JPEGs under `public/images/rebirth`; one photo remains pending, and the set is not yet fully reviewed, the Home is not visually approved. The legacy material below records older implementation phases, not current restaurant pricing or an approved new art direction.
>
> ---

# Tuscanini Ordering System

Arabic-first, RTL-ready Next.js App Router project for a bold fast-food ordering experience.

## Stack (Current Phase)
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Brand direction
- Colors: red, yellow, white, dark accents
- Tone: bold, fast, appetizing, mobile-first

## Implemented Scope (Phase 0 / Phase 1)
- Project structure and styling foundation
- Responsive public layout (header/footer/mobile nav)
- Home skeleton sections:
  - Hero
  - Categories preview
  - Food Finder CTA
  - Offers preview
  - Story preview
  - Contact CTA
- Placeholder public pages:
  - Home, Menu, Offers, Food Finder, About, Reviews, Complaints, Contact, Cart
- Placeholder admin routes:
  - /admin/login
  - /admin
  - /admin/products
  - /admin/orders
  - /admin/settings
- Mock static data only (no database)

## Not yet implemented (intentionally)
- Supabase integration
- Authentication and protected admin logic
- Real cart/order business logic
- Food Finder recommendation logic
- Orders dashboard logic

## Run locally
```bash
npm install
npm run dev
```

## Admin access secret setup (Phase 7.7B)
A temporary admin login gate is now enabled for protected admin routes and uses an environment-managed shared secret.

### Local development (`.env.local`)
Add this variable to your `.env.local` file:

```bash
ADMIN_ACCESS_SECRET=replace-with-a-long-random-secret
```

### Vercel
In your Vercel project:
1. Go to **Project Settings → Environment Variables**.
2. Add:
   - **Name:** `ADMIN_ACCESS_SECRET`
   - **Value:** a strong random secret string
3. Apply it to **Production** and **Preview** (and **Development** if needed).
4. Redeploy after adding/updating the value.

### Notes
- This is a temporary gate and does **not** use Supabase Auth yet.
- Keep the secret server-side only; never expose it in client code.
