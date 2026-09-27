import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal } from "./env";
import { FIXTURE_SLUG, FIXTURE_CONTACT_EMAIL } from "./fixture-listing";

// Runs after every test run (Playwright always calls the configured
// globalTeardown once globalSetup succeeded, regardless of test outcomes) —
// removes the fixture listing and anything tests created that reference it,
// so nothing from this suite is ever left in the database afterward.
export default async function globalTeardown() {
  const env = loadEnvLocal();
  const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const { data: fixture } = await admin
    .from("listing_submissions")
    .select("id")
    .eq("slug", FIXTURE_SLUG)
    .maybeSingle();

  if (fixture) {
    await admin.from("inquiries").delete().eq("listing_submission_id", fixture.id);
  }
  await admin.from("inquiries").delete().eq("listing_slug", FIXTURE_SLUG);
  await admin.from("inquiries").delete().eq("email", "e2e-test@example.com");
  await admin.from("favorites").delete().eq("item_slug", FIXTURE_SLUG);
  await admin.from("email_log").delete().eq("recipient_email", FIXTURE_CONTACT_EMAIL);
  await admin.from("listing_submissions").delete().eq("slug", FIXTURE_SLUG);

  // e2e/oddaj-oglas.spec.ts submits a real listing through the actual
  // /oddaj-oglas form every run (that's the point of the test — it's not
  // fixture data global-setup controls). Clean those up too so the suite
  // never leaves real rows behind, regardless of which spec created them.
  await admin.from("email_log").delete().eq("recipient_email", "e2e@example.com");
  await admin.from("listing_submissions").delete().eq("contact_email", "e2e@example.com");
}
