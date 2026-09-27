"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient, isStripeConfigured } from "@/lib/payments/stripe-client";
import type { ProductType } from "@/lib/payments/types";

export interface CreateCheckoutInput {
  productType: ProductType;
  productId: string;
  // Required for top_addon/homepage_addon (which listing to promote) and for
  // "listing" (which submitted listing the one-time fee unlocks).
  relatedEntityId?: string;
}

export type CreateCheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "not_authenticated" | "not_configured" | "unknown_product" | "missing_price_mapping" | "stripe_error" };

const PLAN_PRODUCT_TABLE: Record<ProductType, "plans" | "promotion_addons"> = {
  listing: "plans",
  plan: "plans",
  top_addon: "promotion_addons",
  homepage_addon: "promotion_addons",
};

// Builds a Stripe Checkout Session for one of the six sellable products
// (Zasebni oglas, PRO Start, PRO, Dealer, TOP oglas, Izpostavitev). Every
// price is read from the `plans`/`promotion_addons` tables — never trust a
// client-supplied amount. Returns "not_configured" until STRIPE_SECRET_KEY is
// set, and "missing_price_mapping" until the product's stripe_price_id
// column is populated — both are expected, safe no-ops before the real
// Stripe go-live step (see HANDOVER_CHECKLIST.md).
export async function createCheckoutSession(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "not_authenticated" };

  if (!isStripeConfigured()) return { ok: false, reason: "not_configured" };
  const stripe = getStripeClient();
  if (!stripe) return { ok: false, reason: "not_configured" };

  const admin = createAdminClient();
  const table = PLAN_PRODUCT_TABLE[input.productType];
  const { data: product } = await admin
    .from(table)
    .select("id, name, price_cents, stripe_price_id")
    .eq("id", input.productId)
    .eq("is_active", true)
    .single();

  if (!product) return { ok: false, reason: "unknown_product" };
  if (!product.stripe_price_id) return { ok: false, reason: "missing_price_mapping" };

  const { data: payment, error: insertError } = await admin
    .from("payments")
    .insert({
      user_id: user.id,
      product_type: input.productType,
      product_id: input.productId,
      related_entity_type: input.relatedEntityId ? "listing_submission" : null,
      related_entity_id: input.relatedEntityId ?? null,
      amount_cents: product.price_cents,
      currency: "eur",
      status: "pending",
      provider: "stripe",
    })
    .select("id")
    .single();

  if (insertError || !payment) return { ok: false, reason: "stripe_error" };

  const siteUrl = "https://www.mobilnahiska.si";
  const mode = input.productType === "plan" ? "subscription" : "payment";

  try {
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      success_url: `${siteUrl}/moj-racun/placila/uspeh?payment_id=${payment.id}`,
      cancel_url: `${siteUrl}/moj-racun/placila/preklicano?payment_id=${payment.id}`,
      client_reference_id: payment.id,
      customer_email: user.email ?? undefined,
      metadata: { payment_id: payment.id, product_type: input.productType, product_id: input.productId },
    });

    await admin.from("payments").update({ provider_session_id: session.id }).eq("id", payment.id);

    if (!session.url) return { ok: false, reason: "stripe_error" };
    return { ok: true, url: session.url };
  } catch (error) {
    console.error("[payments] Failed to create Stripe checkout session", error);
    await admin.from("payments").update({ status: "failed" }).eq("id", payment.id);
    return { ok: false, reason: "stripe_error" };
  }
}
