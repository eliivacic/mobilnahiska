import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Moj paket | mobilnahiska.si" };

interface PlanRow {
  id: string;
  name: string;
  price_cents: number;
  billing_period: string;
  max_active_listings: number;
  description: string | null;
}

export default async function MojPaketPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, plans(*)")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .maybeSingle();

  const { data: allPlans } = await supabase
    .from("plans")
    .select("*")
    .order("price_cents", { ascending: true });

  const plan = (Array.isArray(subscription?.plans) ? subscription?.plans[0] : subscription?.plans) as
    | PlanRow
    | undefined;

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Moj paket</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Trenutni paket in razpoložljive možnosti.</p>

      <div className="mt-6 rounded-[14px] border border-border bg-card p-6">
        <p className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
          {plan?.name ?? "Brezplačen"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {plan && plan.price_cents > 0
            ? `${(plan.price_cents / 100).toFixed(0)} € / mesec`
            : "0 € / mesec"}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Aktivni oglasi</dt>
            <dd className="mt-0.5 font-medium text-foreground">0 / {plan?.max_active_listings ?? 1}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Naslednje plačilo</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {subscription?.current_period_end ? formatDate(subscription.current_period_end) : "—"}
            </dd>
          </div>
        </dl>
      </div>

      {allPlans && allPlans.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
            Razpoložljivi paketi
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {allPlans.map((option) => (
              <div
                key={option.id}
                className={`rounded-[14px] border p-4 ${
                  plan?.id === option.id ? "border-primary bg-secondary/20" : "border-border bg-card"
                }`}
              >
                <p className="font-semibold text-foreground">{option.name}</p>
                <p className="mt-1 font-heading text-xl font-light tracking-[-0.01em] text-foreground">
                  {option.price_cents === 0 ? "Brezplačno" : `${(option.price_cents / 100).toFixed(0)} €/mes.`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-[14px] border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-foreground">Nadgradnja paketa še ni na voljo.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Plačilni sistem še ni povezan — nakup plačljivih paketov bo mogoč, ko bo urejena integracija s
          plačilnim ponudnikom.
        </p>
      </div>
    </div>
  );
}
