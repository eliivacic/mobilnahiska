import "server-only";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient } from "@/lib/payments/stripe-client";
import { activateProductForPayment } from "@/lib/payments/activate";
import type { Payment } from "@/lib/payments/types";

export const dynamic = "force-dynamic";

// Not wired up to anything in Stripe yet — this route exists so the
// integration point is ready. It will do nothing useful until:
//   1. STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set, and
//   2. this URL (https://www.mobilnahiska.si/api/webhooks/stripe) is added
//      as an endpoint in the Stripe Dashboard listening for at least
//      checkout.session.completed, checkout.session.expired,
//      customer.subscription.updated, customer.subscription.deleted.
// See HANDOVER_CHECKLIST.md for the full go-live checklist.
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = getStripeClient();

  if (!webhookSecret || !stripe) {
    console.warn("[stripe-webhook] Received event but Stripe is not configured — ignoring.");
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe-webhook] Signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency: the event id is the primary key. A duplicate delivery (Stripe
  // retries on timeout, or sends the same event twice) hits a 23505
  // unique-violation here and is treated as "already handled" — this is what
  // prevents double-activating a plan/listing/addon on a retried webhook.
  const { error: dedupeError } = await admin
    .from("payment_provider_events")
    .insert({ id: event.id, provider: "stripe", event_type: event.type });
  if (dedupeError) {
    if (dedupeError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    console.error("[stripe-webhook] Failed to record event for idempotency", dedupeError);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentId = session.metadata?.payment_id ?? session.client_reference_id;
        if (!paymentId) break;

        const transactionId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : typeof session.subscription === "string"
              ? session.subscription
              : null;

        const { data: payment } = await admin
          .from("payments")
          .update({ status: "paid", provider_transaction_id: transactionId })
          .eq("id", paymentId)
          .select()
          .single<Payment>();

        if (payment) await activateProductForPayment(payment);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentId = session.metadata?.payment_id ?? session.client_reference_id;
        if (paymentId) {
          await admin.from("payments").update({ status: "cancelled" }).eq("id", paymentId);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        await admin
          .from("payments")
          .update({ status: "failed" })
          .eq("provider_transaction_id", intent.id);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = event.type === "customer.subscription.deleted" ? "cancelled" : "active";
        await admin
          .from("subscriptions")
          .update({
            status,
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq("provider_subscription_id", subscription.id);
        break;
      }

      default:
        // Unhandled event types are acknowledged (200) but not processed —
        // Stripe only retries on a non-2xx response.
        break;
    }
  } catch (error) {
    console.error(`[stripe-webhook] Failed to process event ${event.type}`, error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
