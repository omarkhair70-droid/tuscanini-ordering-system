# Supabase Foundation (Phase 7.1)

This folder contains **database foundation files only** for Tuscanini's Advanced Restaurant Management Package.

## Included in this phase
- Initial SQL migration: `supabase/migrations/001_initial_schema.sql`
- Core enums, tables, relationships, indexes, and `updated_at` trigger setup
- Inline comments marking where Row Level Security (RLS) will be added in later phases

## Explicitly excluded in this phase
- Supabase client code in the app runtime
- Authentication implementation
- Environment variable setup
- Any changes to existing app behavior, menu data, prices, cart logic, or WhatsApp flow

## Notes
- This is a schema-first step to prepare future integration safely.
- Runtime integration and RLS policies are intentionally deferred to subsequent phases.
