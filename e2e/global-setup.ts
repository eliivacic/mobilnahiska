import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal } from "./env";
import { TEST_DEALER } from "./test-users";
import { FIXTURE_SLUG, FIXTURE_TITLE, FIXTURE_CONTACT_EMAIL, FIXTURE_PHOTOS } from "./fixture-listing";

// Creates exactly one real, published, clearly-labeled listing before the
// suite runs, owned by the existing TEST_DEALER account (no new user
// created/destroyed per run). global-teardown.ts removes it (and anything
// tests created that reference it — inquiries, favorites) immediately
// after, success or failure. See e2e/README.md for why this exists instead
// of either (a) asserting against a legitimately empty catalog, or
// (b) leaving permanent fake data in the database.
export default async function globalSetup() {
  const env = loadEnvLocal();
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: usersPage } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const dealer = usersPage?.users.find((u) => u.email === TEST_DEALER.email);
  if (!dealer) {
    throw new Error(
      `e2e global-setup: TEST_DEALER (${TEST_DEALER.email}) not found — this account must already exist for the suite to run.`
    );
  }

  // Clean up any leftover fixture from a previous run that crashed before
  // teardown could run, so this stays idempotent.
  await admin.from("listing_submissions").delete().eq("slug", FIXTURE_SLUG);

  const { error } = await admin.from("listing_submissions").insert({
    user_id: dealer.id,
    type: "mobilna",
    slug: FIXTURE_SLUG,
    title: FIXTURE_TITLE,
    description:
      "To je testni zapis, ustvarjen samodejno pred izvajanjem avtomatiziranih E2E testov in odstranjen takoj po njihovem zaključku.",
    price: 24900,
    location: "Ljubljana",
    country: "Slovenija",
    contact_name: "E2E Fixture",
    contact_phone: "+386 40 000 000",
    contact_email: FIXTURE_CONTACT_EMAIL,
    condition: "nova",
    manufacturer: "E2E Fixture Manufacturer",
    year: 2025,
    area: 22,
    length: 7,
    width: 3.2,
    bedrooms: 1,
    bathrooms: 1,
    capacity: 2,
    delivery_available: true,
    photo_urls: FIXTURE_PHOTOS,
    status: "published",
    is_featured_homepage: true,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  if (error) {
    throw new Error(`e2e global-setup: failed to insert fixture listing: ${error.message}`);
  }
}
