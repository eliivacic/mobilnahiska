// Shared shape for the `plans` and `promotion_addons` tables — the single
// source of truth for every price shown on the portal (/cene,
// /moj-racun/paket, /admin/paketi). Never hardcode a price in a component;
// read it from these tables instead.

export type BillingPeriod = "one_time" | "monthly" | "biannual" | "yearly";

export interface Plan {
  id: string;
  name: string;
  price_cents: number;
  billing_period: BillingPeriod;
  // null = unlimited (e.g. Dealer).
  max_active_listings: number | null;
  description: string | null;
  features: string[];
  is_featured: boolean;
  cta_label: string | null;
  // Only set for one_time plans (e.g. "Zasebni oglas" = 30 dni).
  duration_days: number | null;
  is_active: boolean;
  // Groups rows that represent the same package at different billing
  // periods (e.g. a future "pro-start" @ biannual/yearly row) — today every
  // plan has exactly one row, but adding a new interval later is just a new
  // row with the same plan_group, no schema/UI change required.
  plan_group: string;
  // Null until the Stripe product/price is created and mapped in at the
  // final go-live step — see HANDOVER_CHECKLIST.md.
  stripe_product_id: string | null;
  stripe_price_id: string | null;
}

export interface PromotionAddon {
  id: string;
  name: string;
  price_cents: number;
  duration_days: number;
  description: string | null;
  cta_label: string | null;
  is_active: boolean;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
}

// Human-readable labels — the raw billing_period value ("one_time" etc.)
// should never be rendered directly anywhere in the UI.
export const BILLING_PERIOD_LABELS: Record<BillingPeriod, string> = {
  one_time: "Enkratno",
  monthly: "Mesečno",
  biannual: "Polletno",
  yearly: "Letno",
};

export function formatPlanPrice(plan: Pick<Plan, "price_cents" | "billing_period">): string {
  const amount = `${(plan.price_cents / 100).toFixed(0)} €`;
  if (plan.billing_period === "monthly") return `${amount} / mesec`;
  if (plan.billing_period === "biannual") return `${amount} / 6 mesecev`;
  if (plan.billing_period === "yearly") return `${amount} / leto`;
  return amount;
}
