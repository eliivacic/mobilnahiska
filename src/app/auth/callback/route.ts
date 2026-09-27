import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { sendTransactionalEmail, isNotificationEnabled } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";

// Supabase email links (password recovery, signup confirmation) redirect
// here with a `code` param. Exchanging it establishes the session cookie,
// then we send the user on to the right place — the "set new password"
// page for recovery links, or their account/returnTo target otherwise.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const returnTo = safeRedirectPath(searchParams.get("returnTo"), "/");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/ponastavi-geslo`);
      }

      // This is the moment a signup confirmation link is clicked — send the
      // welcome email here, deduped by user id, so it fires exactly once
      // regardless of how many times the link is opened.
      if (data.user && (await isNotificationEnabled("email_notify_welcome"))) {
        const { subject, html } = welcomeEmail({ fullName: data.user.user_metadata?.full_name ?? null });
        await sendTransactionalEmail({
          to: data.user.email!,
          subject,
          html,
          emailType: "welcome",
          dedupKey: `welcome:${data.user.id}`,
          userId: data.user.id,
        });
      }

      return NextResponse.redirect(`${origin}${returnTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/prijava?error=povezava-je-potekla`);
}
