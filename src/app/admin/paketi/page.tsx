import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { PlanEditRow } from "@/components/dashboard/PlanEditRow";
import { PromotionAddonEditRow } from "@/components/dashboard/PromotionAddonEditRow";
import type { Plan, PromotionAddon } from "@/types/pricing";

export const metadata: Metadata = { title: "Paketi in cene | Admin | mobilnahiska.si" };

// Prices come from a single source of truth (the `plans` and
// `promotion_addons` tables) so they're never hardcoded in components —
// this is where they're set, and every consumer (/cene, /moj-racun/paket)
// reads from here.
export default async function AdminPaketiPage() {
  const admin = createAdminClient();
  const [{ data: plans }, { data: addons }] = await Promise.all([
    admin.from("plans").select("*").order("price_cents", { ascending: true }),
    admin.from("promotion_addons").select("*").order("price_cents", { ascending: true }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Paketi in cene</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Spremembe tukaj se takoj odražajo na strani &ldquo;Moj paket&rdquo; in na javni strani /cene.
      </p>

      <div className="mt-6 space-y-4">
        {((plans ?? []) as Plan[]).map((plan) => (
          <PlanEditRow key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
          Dodatna izpostavitev oglasa
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enkratni promocijski dodatki na posamezen oglas (ne naročnina).
        </p>
        <div className="mt-3 space-y-3">
          {((addons ?? []) as PromotionAddon[]).map((addon) => (
            <PromotionAddonEditRow key={addon.id} addon={addon} />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[14px] border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-foreground">Polletno / letno obračunavanje</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Podatkovni model to že podpira (`billing_period` dovoljuje &ldquo;biannual&rdquo;/&ldquo;yearly&rdquo;,
          `plan_group` povezuje pakete med obdobji) — ko bodo cene za ta obdobja določene, jih dodamo kot nove
          vrstice v tej tabeli, brez spremembe sheme ali te strani.
        </p>
      </div>
    </div>
  );
}
