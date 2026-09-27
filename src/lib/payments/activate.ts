import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email/send";
import { paymentConfirmationEmail } from "@/lib/email/templates";
import { PRODUCT_TYPE_LABELS, type Payment } from "@/lib/payments/types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function addInterval(from: Date, interval: "monthly" | "biannual" | "yearly" | null): Date {
  const next = new Date(from);
  if (interval === "yearly") next.setFullYear(next.getFullYear() + 1);
  else if (interval === "biannual") next.setMonth(next.getMonth() + 6);
  else next.setMonth(next.getMonth() + 1);
  return next;
}

// Called only after a payment is confirmed paid by the Stripe webhook (or, in
// development without Stripe connected, by an admin manually marking a
// payment as paid — see /admin/placila). The checkout success page never
// calls this directly: activation must always be driven by a verified
// payment record, never by the client reaching a "thank you" URL.
export async function activateProductForPayment(payment: Payment): Promise<void> {
  const admin = createAdminClient();

  if (payment.product_type === "listing" && payment.related_entity_id) {
    const { data: plan } = await admin
      .from("plans")
      .select("duration_days")
      .eq("id", payment.product_id)
      .single();
    const durationDays = plan?.duration_days ?? 30;
    const expiresAt = new Date(Date.now() + durationDays * MS_PER_DAY).toISOString();
    await admin
      .from("listing_submissions")
      .update({ expires_at: expiresAt })
      .eq("id", payment.related_entity_id);
  }

  if (payment.product_type === "plan") {
    const { data: plan } = await admin
      .from("plans")
      .select("billing_period")
      .eq("id", payment.product_id)
      .single();
    const billingInterval =
      plan?.billing_period === "monthly" || plan?.billing_period === "biannual" || plan?.billing_period === "yearly"
        ? plan.billing_period
        : "monthly";
    const now = new Date();
    const periodEnd = addInterval(now, billingInterval);

    await admin.from("subscriptions").upsert(
      {
        user_id: payment.user_id,
        plan_id: payment.product_id,
        status: "active",
        billing_interval: billingInterval,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        cancel_at_period_end: false,
        provider: payment.provider,
      },
      { onConflict: "user_id" }
    );
  }

  if ((payment.product_type === "top_addon" || payment.product_type === "homepage_addon") && payment.related_entity_id) {
    const { data: addon } = await admin
      .from("promotion_addons")
      .select("duration_days")
      .eq("id", payment.product_id)
      .single();
    const durationDays = addon?.duration_days ?? 15;
    const until = new Date(Date.now() + durationDays * MS_PER_DAY).toISOString();
    const column = payment.product_type === "top_addon" ? "top_until" : "featured_until";
    const flag = payment.product_type === "top_addon" ? "is_top" : "is_featured_homepage";
    await admin
      .from("listing_submissions")
      .update({ [flag]: true, [column]: until })
      .eq("id", payment.related_entity_id);
  }

  const { data: authUser } = await admin.auth.admin.getUserById(payment.user_id);
  const recipient = authUser?.user?.email;
  if (recipient) {
    const { subject, html } = paymentConfirmationEmail({
      serviceName: PRODUCT_TYPE_LABELS[payment.product_type] ?? payment.product_id,
      amountCents: payment.amount_cents,
      paidAt: payment.updated_at,
      status: "Plačano",
      invoiceUrl: payment.invoice_url,
    });
    await sendTransactionalEmail({
      to: recipient,
      subject,
      html,
      emailType: "payment_confirmation",
      dedupKey: `payment_confirmation:${payment.id}`,
      userId: payment.user_id,
      relatedEntityType: "payment",
      relatedEntityId: payment.id,
    });
  }
}
