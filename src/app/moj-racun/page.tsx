import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Moj račun | mobilnahiska.si" };

export default async function MojRacunPregledPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user!.id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, plans(name, max_active_listings)")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .maybeSingle();

  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const displayName = profile?.full_name || user!.email;
  const plan = Array.isArray(subscription?.plans) ? subscription?.plans[0] : subscription?.plans;

  return (
    <div>
      <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
        Pozdravljeni, {displayName}
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {user!.email} · Član od {profile?.created_at ? formatDate(profile.created_at) : "/"}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Aktivni oglasi", value: "0" },
          { label: "Prejeta povpraševanja", value: "0" },
          { label: "Priljubljeni", value: String(favoritesCount ?? 0) },
          { label: "Trenutni paket", value: plan?.name ?? "Brezplačen" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[14px] border border-border bg-card p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </p>
            <p className="mt-1 font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-8 text-center">
        <p className="text-sm font-semibold text-foreground">Trenutno še nimate objavljenih oglasov.</p>
        <p className="text-sm text-muted-foreground">Oddajte prvi oglas in ga upravljajte na enem mestu.</p>
        <Button asChild className="mt-3 bg-primary text-primary-foreground hover:bg-brand-hover">
          <Link href="/oddaj-oglas">Oddaj prvi oglas</Link>
        </Button>
      </div>
    </div>
  );
}
