import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server-side admin gate. Checked with the caller's own session (RLS-safe),
// never trusted from the client. Any actual privileged write still goes
// through the service-role admin client — this only decides whether to
// render the admin UI / allow calling those actions.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/prijava");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") redirect("/");

  return { user, supabase };
}
