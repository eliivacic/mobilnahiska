import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const metadata: Metadata = { title: "Prijava | mobilnahiska.si" };

export default async function PrijavaPage(props: PageProps<"/prijava">) {
  const searchParams = await props.searchParams;
  const returnTo = safeRedirectPath(
    typeof searchParams.returnTo === "string" ? searchParams.returnTo : undefined,
    "/moj-racun"
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(returnTo);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground">Prijava</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Prijavite se v svoj račun na mobilnahiska.si.</p>
        <div className="mt-8 rounded-[14px] border border-border bg-card p-6 shadow-lift">
          <LoginForm returnTo={returnTo === "/moj-racun" ? undefined : returnTo} />
        </div>
      </div>
    </div>
  );
}
