import type { Metadata } from "next";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPlanPrice, type Plan, type PromotionAddon } from "@/types/pricing";

export const metadata: Metadata = {
  title: "Paketi in cenik | mobilnahiska.si",
  description: "Primerjajte pakete za oglaševanje na mobilnahiska.si in izberite tistega, ki ustreza vašim potrebam.",
};

export default async function CenePage() {
  const supabase = await createClient();

  const [{ data: plans }, { data: addons }, { data: userData }] = await Promise.all([
    supabase.from("plans").select("*").eq("is_active", true).order("price_cents", { ascending: true }),
    supabase.from("promotion_addons").select("*").eq("is_active", true).order("price_cents", { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const isLoggedIn = !!userData.user;
  const allPlans = (plans as Plan[] | null) ?? [];
  const privatePlan = allPlans.find((plan) => plan.billing_period === "one_time");
  const subscriptionPlans = allPlans.filter((plan) => plan.billing_period !== "one_time");
  const promotionAddons = (addons as PromotionAddon[] | null) ?? [];

  if (allPlans.length === 0) {
    return (
      <PageShell className="py-12">
        <div className="mx-auto max-w-lg rounded-[14px] border border-dashed border-border p-8 text-center">
          <p className="text-sm font-semibold text-foreground">Cenik trenutno ni na voljo.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Paketi še niso bili nastavljeni v administraciji portala.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell className="py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Paketi in cenik
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Izberite paket, ki ustreza obsegu vaše ponudbe. Profesionalni paketi vključujejo upravljanje oglasov,
          profil ponudnika in dostop do nadzorne plošče.
        </p>
      </div>

      {privatePlan && (
        <div className="mx-auto mt-10 max-w-lg">
          <PlanCard plan={privatePlan} isLoggedIn={isLoggedIn} />
        </div>
      )}

      {subscriptionPlans.length > 0 && (
        <div className="mt-14">
          <h2 className="text-center font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
            Za profesionalne ponudnike
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </div>
      )}

      {promotionAddons.length > 0 && (
        <div className="mt-14">
          <h2 className="text-center font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
            Dodatna izpostavitev oglasa
          </h2>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {promotionAddons.map((addon) => (
              <AddonCard key={addon.id} addon={addon} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}

function PlanCard({ plan, isLoggedIn }: { plan: Plan; isLoggedIn: boolean }) {
  const isOneTime = plan.billing_period === "one_time";
  const ctaHref = isOneTime
    ? "/oddaj-oglas"
    : isLoggedIn
      ? "/moj-racun/paket"
      : `/registracija?returnTo=${encodeURIComponent("/moj-racun/paket")}`;
  const ctaLabel = isOneTime ? (plan.cta_label ?? "Oddaj oglas") : isLoggedIn ? "Upravljaj svoj paket" : (plan.cta_label ?? `Izberi ${plan.name}`);

  return (
    <div
      className={`flex h-full flex-col rounded-[14px] border bg-card p-6 ${
        plan.is_featured ? "border-primary shadow-lift" : "border-border shadow-[0_1px_2px_rgba(48,37,33,0.04)]"
      }`}
    >
      {plan.is_featured && (
        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-[6px] bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
          <Star className="h-3 w-3 fill-current" />
          Najbolj priljubljen
        </span>
      )}

      <p className="font-semibold text-foreground">{plan.name}</p>
      <p className="mt-2 font-heading text-3xl font-light tracking-[-0.01em] text-foreground">
        {formatPlanPrice(plan)}
      </p>
      {isOneTime && plan.duration_days && (
        <p className="text-sm text-muted-foreground">{plan.duration_days} dni</p>
      )}

      {plan.description && <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>}

      <ul className="mt-5 flex-1 space-y-2.5 text-sm text-foreground/90">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            {feature}
          </li>
        ))}
      </ul>

      <Button asChild className="mt-6 w-full bg-primary text-primary-foreground hover:bg-brand-hover">
        <Link href={ctaHref}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}

function AddonCard({ addon, isLoggedIn }: { addon: PromotionAddon; isLoggedIn: boolean }) {
  const ctaHref = isLoggedIn
    ? "/moj-racun/oglasi"
    : `/prijava?returnTo=${encodeURIComponent("/moj-racun/oglasi")}`;

  return (
    <div className="flex h-full flex-col rounded-[14px] border border-border bg-card p-6">
      <p className="font-semibold text-foreground">{addon.name}</p>
      <p className="mt-2 font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
        {(addon.price_cents / 100).toFixed(0)} €
      </p>
      <p className="text-sm text-muted-foreground">{addon.duration_days} dni</p>
      {addon.description && <p className="mt-3 flex-1 text-sm text-muted-foreground">{addon.description}</p>}

      <Button asChild variant="outline" className="mt-6 w-full">
        <Link href={ctaHref}>{addon.cta_label ?? "Izpostavi oglas"}</Link>
      </Button>
    </div>
  );
}
