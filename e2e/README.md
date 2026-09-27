# E2E test data

This repo has one Supabase project, used by both the running app and these tests — there is no separate test/staging database. That's a real trade-off, documented here rather than hidden:

- **`global-setup.ts`** creates exactly one real, clearly-labeled listing (`FIXTURE_TITLE` starts with `[E2E TEST FIXTURE — ne kupujte]`) before the suite runs, owned by the existing `TEST_DEALER` account. No new user is created per run.
- **`global-teardown.ts`** deletes that listing and anything tests created that reference it (inquiries, favorites, email log rows) immediately after the run — success or failure. Playwright always calls `globalTeardown` once `globalSetup` has completed, so this isn't conditional on tests passing.
- `global-setup.ts` also deletes any leftover fixture from a previous crashed run before creating a fresh one, so re-running after an interrupted suite is safe.

This keeps the exposure window to "during a test run" rather than "permanent fake data in production." It is **not** the same as a fully isolated test environment — while the suite is running, the fixture listing is genuinely visible on the live site to any real visitor. If/when this matters (e.g. running the suite against the live production URL instead of a local dev server), the correct fix is a separate Supabase project for CI, with its own `.env.test` and seed data — that's a bigger infrastructure decision, not something to introduce silently.

## Running

```bash
npx playwright test
```

Uses the existing standing accounts in `test-users.ts` (`admin@mobilnahiska.si`, `ponudnik@mobilnahiska.si`, `uporabnik@mobilnahiska.si`) — these must already exist. The fixture listing is created/destroyed automatically; nothing else needs seeding.
