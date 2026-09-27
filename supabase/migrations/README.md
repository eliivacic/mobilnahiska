# Database migrations

This folder did not exist before 2026-09-27 — every schema change up to that point was applied directly against the live Supabase project (via its dashboard or the Composio Supabase MCP tools) and never committed to the repo. Reconstructing the exact original `CREATE TABLE` statements for the earliest tables (`profiles`, `plans`, etc.) would mean guessing, so instead:

- **`000_baseline_schema.sql`** — a complete, verified snapshot of the actual live schema as introspected on 2026-09-27 (every table, column, constraint, index, enum, function, trigger, and RLS policy). This is the reproducible starting point for a new environment, not a literal chronological history.
- **`001_seed_reference_data.sql`** — the real production reference data the app depends on to function (pricing plans, promotion add-ons, portal settings, the 4 initial vodiči articles). Not placeholder data — these are the actual live values.

## Reproducing the database from scratch

1. Create a new Supabase project.
2. Run `000_baseline_schema.sql` against it (Supabase SQL Editor, or `supabase db push` / the Composio `SUPABASE_APPLY_A_MIGRATION` tool).
3. Run `001_seed_reference_data.sql`.
4. Set the resulting project's URL/keys in `.env.local` (see `.env.example` at the repo root).

## Going forward

Every future schema change must be added as a new file in this folder, numbered sequentially from `002_...`, and applied to the live project the same way `000`/`001` were. Never edit `000_baseline_schema.sql` after the fact — it's a fixed historical snapshot.

## Auth email templates

Supabase's own auth emails (confirmation, password recovery) are configured separately, in the Supabase Dashboard under Authentication → Email Templates — not through SQL. See `supabase/auth-email-templates/README.md` for the branded HTML to paste in there.
