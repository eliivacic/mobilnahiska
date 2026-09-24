import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Ponastavi geslo | mobilnahiska.si" };

export default async function PonastaviGesloPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only reachable with a valid session from the recovery email link
  // (established by /auth/callback). Without one there is nothing to reset.
  if (!user) {
    redirect("/pozabljeno-geslo");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground">Ponastavi geslo</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Izberite novo geslo za svoj račun.</p>
        <div className="mt-8 rounded-[14px] border border-border bg-card p-6 shadow-lift">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
