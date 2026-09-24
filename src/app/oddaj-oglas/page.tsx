import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { createClient } from "@/lib/supabase/server";
import { OddajOglasForm } from "@/components/listings/OddajOglasForm";

export const metadata: Metadata = { title: "Oddaj oglas | mobilnahiska.si" };

export default async function OddajOglasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/prijava?returnTo=%2Foddaj-oglas");
  }

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();

  return (
    <PageShell className="py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Oddaj oglas
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Izpolnite podatke o svoji nepremičnini. Vsak oddan oglas najprej pregleda administrator portala.
        </p>

        <div className="mt-8">
          <OddajOglasForm
            userId={user.id}
            defaultContactName={profile?.full_name ?? ""}
            defaultContactEmail={user.email ?? ""}
          />
        </div>
      </div>
    </PageShell>
  );
}
