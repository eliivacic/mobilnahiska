// Shared shapes for the `payments` / `subscriptions` tables. See
// supabase/migrations/008_payments.sql for the schema these mirror.

export type PaymentStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

// "listing" = the one-time "Zasebni oglas" fee, "plan" = a recurring PRO
// Start/PRO/Dealer subscription, "top_addon"/"homepage_addon" = the two
// promotion_addons rows.
export type ProductType = "listing" | "plan" | "top_addon" | "homepage_addon";

export interface Payment {
  id: string;
  user_id: string;
  product_type: ProductType;
  product_id: string;
  related_entity_type: string | null;
  related_entity_id: string | null;
  amount_cents: number;
  currency: string;
  status: PaymentStatus;
  provider: string;
  provider_session_id: string | null;
  provider_transaction_id: string | null;
  invoice_url: string | null;
  created_at: string;
  updated_at: string;
}

export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "expired" | "trialing";

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  billing_interval: "monthly" | "biannual" | "yearly" | null;
  started_at: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  provider: string;
  provider_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "V obdelavi",
  paid: "Plačano",
  failed: "Neuspešno",
  cancelled: "Preklicano",
  refunded: "Vrnjeno",
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  listing: "Zasebni oglas",
  plan: "Naročniški paket",
  top_addon: "TOP oglas",
  homepage_addon: "Izpostavitev na naslovnici",
};
