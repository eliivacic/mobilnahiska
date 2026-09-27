// Shared identifiers for the single E2E fixture listing — created fresh by
// global-setup before the suite runs and deleted by global-teardown
// immediately after, whether tests pass or fail. This is real row in the
// same Supabase project the app itself uses (this repo has no separate
// test project — see e2e/README.md) — the tight setup/teardown window is
// what keeps it from being persistent fake production data.
export const FIXTURE_SLUG = "e2e-fixture-listing-ne-kupujte";
export const FIXTURE_TITLE = "[E2E TEST FIXTURE — ne kupujte] Testna mobilna hiška";
export const FIXTURE_CONTACT_EMAIL = "e2e-fixture-seller@example.com";

// Reuses the same known-good Unsplash ids as src/data/images.ts's
// EXTERIOR_IDS, rather than guessing new ones that might 404.
export const FIXTURE_PHOTOS = [
  "https://images.unsplash.com/photo-1668015642451-a3bb11afb441?w=1200&h=900&fit=crop&auto=format&q=75",
  "https://images.unsplash.com/photo-1628394029761-acc83a2a08a6?w=1200&h=900&fit=crop&auto=format&q=75",
];
