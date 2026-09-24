import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Registracija | mobilnahiska.si" };

export default async function RegistracijaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/moj-racun");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground">Ustvarite račun</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Registrirajte se, da lahko oddajate oglase in shranjujete priljubljene.
        </p>
        <div className="mt-8 rounded-[14px] border border-border bg-card p-6 shadow-lift">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
