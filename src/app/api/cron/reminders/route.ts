import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail, isNotificationEnabled } from "@/lib/email/send";
import { listingExpiringEmail, planExpiringEmail } from "@/lib/email/templates";

export const dynamic = "force-dynamic";

const REMINDER_WINDOW_DAYS = 3;

// Runs daily (see vercel.json). Vercel Cron sends
// `Authorization: Bearer $CRON_SECRET` — reject anything else so this can't
// be triggered by an outsider hitting the URL directly.
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();
  const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  let listingReminders = 0;
  let planReminders = 0;

  if (await isNotificationEnabled("email_notify_expiry")) {
    // Listings: real data — `listing_submissions.expires_at` is set when an
    // admin approves a submission (see approveListingSubmission).
    const { data: expiringListings } = await admin
      .from("listing_submissions")
      .select("id, title, contact_email, user_id, expires_at")
      .eq("status", "published")
      .is("expiry_reminder_sent_at", null)
      .not("expires_at", "is", null)
      .lte("expires_at", windowEnd.toISOString())
      .gte("expires_at", now.toISOString());

    for (const listing of expiringListings ?? []) {
      const { subject, html } = listingExpiringEmail({ title: listing.title, expiresAt: listing.expires_at! });
      const result = await sendTransactionalEmail({
        to: listing.contact_email,
        subject,
        html,
        emailType: "listing_expiring",
        dedupKey: `listing_expiring:${listing.id}`,
        userId: listing.user_id,
        relatedEntityType: "listing_submission",
        relatedEntityId: listing.id,
      });
      if (result.sent) {
        await admin
          .from("listing_submissions")
          .update({ expiry_reminder_sent_at: now.toISOString() })
          .eq("id", listing.id);
        listingReminders += 1;
      }
    }

    // Plans: the query is real and will start finding rows the moment a real
    // billing system starts populating subscriptions.current_period_end —
    // today no subscription has one set (no payment provider is connected
    // yet), so this will always find zero rows. Not mock data: it's a real
    // check against a real (currently empty) condition.
    const { data: expiringSubscriptions } = await admin
      .from("subscriptions")
      .select("id, user_id, current_period_end, plans(name)")
      .eq("status", "active")
      .not("current_period_end", "is", null)
      .lte("current_period_end", windowEnd.toISOString())
      .gte("current_period_end", now.toISOString());

    for (const subscription of expiringSubscriptions ?? []) {
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("id", subscription.user_id)
        .single();
      const { data: authUser } = await admin.auth.admin.getUserById(subscription.user_id);
      if (!profile || !authUser.user?.email) continue;

      const plan = Array.isArray(subscription.plans) ? subscription.plans[0] : subscription.plans;
      const { subject, html } = planExpiringEmail({
        planName: plan?.name ?? "Paket",
        expiresAt: subscription.current_period_end!,
      });
      const result = await sendTransactionalEmail({
        to: authUser.user.email,
        subject,
        html,
        emailType: "plan_expiring",
        dedupKey: `plan_expiring:${subscription.id}:${subscription.current_period_end}`,
        userId: subscription.user_id,
        relatedEntityType: "subscription",
        relatedEntityId: subscription.id,
      });
      if (result.sent) planReminders += 1;
    }
  }

  return NextResponse.json({ ok: true, listingReminders, planReminders });
}
