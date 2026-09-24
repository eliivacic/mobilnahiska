import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS. Server-only, never imported into a
// client component. Use it only for reads/writes that are intentionally
// broader than a single user's own row (e.g. showing the display name next
// to a publicly-approved comment, or admin moderation actions).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
