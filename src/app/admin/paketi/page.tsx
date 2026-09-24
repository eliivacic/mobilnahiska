import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { PlanEditRow } from "@/components/dashboard/PlanEditRow";

export const metadata: Metadata = { title: "Paketi in cene | Admin | mobilnahiska.si" };

// Prices come from a single source of truth (the `plans` table) so they're
// never hardcoded in components — this is where they're set.
export default async function AdminPaketiPage() {
  const admin = createAdminClient();
  const { data: plans } = await admin.from("plans").select("*").order("price_cents", { ascending: true });

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Paketi in cene</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Spremembe tukaj se takoj odražajo na strani &ldquo;Moj paket&rdquo; in v cenah, ki jih vidijo uporabniki.
      </p>

      <div className="mt-6 space-y-3">
        {(plans ?? []).map((plan) => (
          <PlanEditRow
            key={plan.id}
            id={plan.id}
            name={plan.name}
            priceCents={plan.price_cents}
            maxActiveListings={plan.max_active_listings}
            isActive={plan.is_active}
          />
        ))}
      </div>

      <div className="mt-8 rounded-[14px] border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-foreground">TOP oglas in izpostavitev na naslovnici</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Enkratni promocijski dodatki (ne naročnine) bodo dodani kot ločen del te tabele, ko bo pripravljen
          nakupni tok zanje.
        </p>
      </div>

      <div className="mt-4 rounded-[14px] border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-foreground">Mesečno / polletno / letno obračunavanje</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Podatkovni model (`billing_period`) to že podpira. Preklop iz admina za posamezen paket dodamo, ko
          bo pripravljena dejanska ponudba za daljša obdobja.
        </p>
      </div>
    </div>
  );
}
