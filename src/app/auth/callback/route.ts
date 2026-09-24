import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

// Supabase email links (password recovery, signup confirmation) redirect
// here with a `code` param. Exchanging it establishes the session cookie,
// then we send the user on to the right place — the "set new password"
// page for recovery links, or their account/returnTo target otherwise.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const returnTo = safeRedirectPath(searchParams.get("returnTo"), "/moj-racun");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/ponastavi-geslo`);
      }
      return NextResponse.redirect(`${origin}${returnTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/prijava?error=povezava-je-potekla`);
}
