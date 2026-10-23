"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/supabase/audit";
import { sendTransactionalEmail, isNotificationEnabled } from "@/lib/email/send";
import { listingApprovedEmail, listingRejectedEmail, listingNeedsRevisionEmail } from "@/lib/email/templates";

export async function moderateComment(commentId: string, status: "approved" | "hidden") {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("comments").select("status").eq("id", commentId).single();
  await admin.from("comments").update({ status }).eq("id", commentId);
  await logAdminAction({
    adminId: user.id,
    action: "comment.moderate",
    entityType: "comment",
    entityId: commentId,
    before,
    after: { status },
  });
  revalidatePath("/admin/komentarji");
  revalidatePath("/admin");
  revalidatePath("/vodici", "layout");
}

export async function deleteComment(commentId: string) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("comments").select("*").eq("id", commentId).single();
  await admin.from("comments").delete().eq("id", commentId);
  await logAdminAction({
    adminId: user.id,
    action: "comment.delete",
    entityType: "comment",
    entityId: commentId,
    before,
    after: null,
  });
  revalidatePath("/admin/komentarji");
  revalidatePath("/admin");
  revalidatePath("/vodici", "layout");
}

export interface UpdatePlanInput {
  name: string;
  priceCents: number;
  maxActiveListings: number | null;
  description: string;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  ctaLabel: string;
  durationDays: number | null;
}

export async function updatePlan(planId: string, data: UpdatePlanInput) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin
    .from("plans")
    .select("name, price_cents, max_active_listings, description, features, is_active, is_featured, cta_label, duration_days")
    .eq("id", planId)
    .single();

  const after = {
    name: data.name,
    price_cents: data.priceCents,
    max_active_listings: data.maxActiveListings,
    description: data.description || null,
    features: data.features,
    is_active: data.isActive,
    is_featured: data.isFeatured,
    cta_label: data.ctaLabel || null,
    duration_days: data.durationDays,
  };

  await admin.from("plans").update(after).eq("id", planId);
  await logAdminAction({
    adminId: user.id,
    action: "plan.update",
    entityType: "plan",
    entityId: planId,
    before,
    after,
  });
  revalidatePath("/admin/paketi");
  revalidatePath("/moj-racun/paket");
  revalidatePath("/cene");
}

export async function updatePromotionAddon(
  addonId: string,
  data: { priceCents: number; durationDays: number; isActive: boolean }
) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin
    .from("promotion_addons")
    .select("price_cents, duration_days, is_active")
    .eq("id", addonId)
    .single();

  const after = {
    price_cents: data.priceCents,
    duration_days: data.durationDays,
    is_active: data.isActive,
    updated_at: new Date().toISOString(),
  };

  await admin.from("promotion_addons").update(after).eq("id", addonId);
  await logAdminAction({
    adminId: user.id,
    action: "promotion_addon.update",
    entityType: "promotion_addon",
    entityId: addonId,
    before,
    after,
  });
  revalidatePath("/admin/paketi");
  revalidatePath("/cene");
}

export async function updateUserRole(userId: string, role: "user" | "dealer" | "admin") {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("profiles").select("role").eq("id", userId).single();
  // Uses the service-role client on purpose: profiles.role is protected by a
  // trigger that only accepts role changes from the service role, so a
  // regular authenticated update (even from an admin's own session) would be
  // silently reverted. See migration 001_profiles.sql.
  await admin.from("profiles").update({ role }).eq("id", userId);
  await logAdminAction({
    adminId: user.id,
    action: "user.role_change",
    entityType: "user",
    entityId: userId,
    before,
    after: { role },
  });
  revalidatePath("/admin/uporabniki");
}

export interface UpdateUserProfileInput {
  fullName: string;
  phone: string;
  companyName: string;
}

export async function updateUserProfile(userId: string, data: UpdateUserProfileInput) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin
    .from("profiles")
    .select("full_name, phone, company_name")
    .eq("id", userId)
    .single();

  const record = {
    full_name: data.fullName.trim() || null,
    phone: data.phone.trim() || null,
    company_name: data.companyName.trim() || null,
  };

  await admin.from("profiles").update(record).eq("id", userId);
  await logAdminAction({
    adminId: user.id,
    action: "user.profile_edit",
    entityType: "user",
    entityId: userId,
    before,
    after: record,
  });
  revalidatePath("/admin/uporabniki");
}

export async function deleteUser(userId: string): Promise<{ error?: string }> {
  const { user } = await requireAdmin();
  if (userId === user.id) {
    return { error: "Ne morete izbrisati lastnega računa." };
  }
  const admin = createAdminClient();

  const { data: before } = await admin
    .from("profiles")
    .select("full_name, role, company_name")
    .eq("id", userId)
    .single();

  // Deletes the auth.users row; ON DELETE CASCADE (see 06-podatkovni-model.md)
  // takes profiles, listing_submissions, comments, favorites, payments, and
  // subscriptions with it. This is permanent and cannot be undone from the
  // app — the confirmation dialog in the UI is the only safety net.
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: "Uporabnika ni bilo mogoče izbrisati." };

  await logAdminAction({
    adminId: user.id,
    action: "user.delete",
    entityType: "user",
    entityId: userId,
    before,
    after: null,
  });
  revalidatePath("/admin/uporabniki");
  return {};
}

export async function updatePortalSetting(key: string, value: string) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("portal_settings").select("value").eq("key", key).single();
  await admin.from("portal_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  await logAdminAction({
    adminId: user.id,
    action: "setting.update",
    entityType: "portal_setting",
    entityId: key,
    before,
    after: { value },
  });
  revalidatePath("/admin/nastavitve");
}

export async function updatePortalSettingsBatch(entries: Record<string, string>) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const keys = Object.keys(entries);
  const { data: beforeRows } = await admin.from("portal_settings").select("key, value").in("key", keys);
  const before = Object.fromEntries((beforeRows ?? []).map((row) => [row.key, row.value]));

  await admin.from("portal_settings").upsert(
    keys.map((key) => ({ key, value: entries[key], updated_at: new Date().toISOString() }))
  );

  await logAdminAction({
    adminId: user.id,
    action: "setting.update_batch",
    entityType: "portal_setting",
    entityId: keys.join(","),
    before,
    after: entries,
  });
  revalidatePath("/admin/nastavitve");
}

export async function approveListingSubmission(submissionId: string) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();

  const { data: submission } = await admin
    .from("listing_submissions")
    .select("title, contact_email, user_id, status")
    .eq("id", submissionId)
    .single();
  if (!submission) return;

  // The only concretely priced listing lifetime today is the one-time
  // "Zasebni oglas" plan's duration — read from `plans` (single source of
  // truth) instead of hardcoding "30 days" here. Once listings are tied to
  // whichever plan the submitter actually holds, this can use that plan's
  // duration_days instead of always falling back to zasebni-oglas.
  const { data: plan } = await admin
    .from("plans")
    .select("duration_days")
    .eq("id", "zasebni-oglas")
    .single();
  const durationDays = plan?.duration_days ?? 30;
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  await admin
    .from("listing_submissions")
    .update({ status: "published", reviewed_at: new Date().toISOString(), reviewed_by: user.id, expires_at: expiresAt })
    .eq("id", submissionId);

  await logAdminAction({
    adminId: user.id,
    action: "listing_submission.approve",
    entityType: "listing_submission",
    entityId: submissionId,
    before: { status: submission.status },
    after: { status: "published", expires_at: expiresAt },
  });

  if (await isNotificationEnabled("email_notify_listing_status")) {
    const { subject, html } = listingApprovedEmail({ title: submission.title, expiresAt });
    await sendTransactionalEmail({
      to: submission.contact_email,
      subject,
      html,
      emailType: "listing_approved",
      dedupKey: `listing_approved:${submissionId}`,
      userId: submission.user_id,
      relatedEntityType: "listing_submission",
      relatedEntityId: submissionId,
    });
  }

  revalidatePath("/admin/oglasi");
  revalidatePath("/moj-racun/oglasi");
}

export async function rejectListingSubmission(submissionId: string, reason: string) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();

  const { data: submission } = await admin
    .from("listing_submissions")
    .select("title, contact_email, user_id, status")
    .eq("id", submissionId)
    .single();
  if (!submission) return;

  await admin
    .from("listing_submissions")
    .update({
      status: "rejected",
      rejection_reason: reason,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", submissionId);

  await logAdminAction({
    adminId: user.id,
    action: "listing_submission.reject",
    entityType: "listing_submission",
    entityId: submissionId,
    before: { status: submission.status },
    after: { status: "rejected", rejection_reason: reason },
  });

  if (await isNotificationEnabled("email_notify_listing_status")) {
    const { subject, html } = listingRejectedEmail({ title: submission.title, reason, submissionId });
    await sendTransactionalEmail({
      to: submission.contact_email,
      subject,
      html,
      emailType: "listing_rejected",
      dedupKey: `listing_rejected:${submissionId}`,
      userId: submission.user_id,
      relatedEntityType: "listing_submission",
      relatedEntityId: submissionId,
    });
  }

  revalidatePath("/admin/oglasi");
  revalidatePath("/moj-racun/oglasi");
}

// Distinct from reject: the listing is not terminal here — the submitter can
// (and is expected to) edit it, which already resets status to
// "pending_review" via updateListingSubmission(). This just gives that path
// its own honest status/label/email instead of reusing "rejected" for
// something that isn't final.
export async function requestListingRevision(submissionId: string, message: string) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();

  const { data: submission } = await admin
    .from("listing_submissions")
    .select("title, contact_email, user_id, status")
    .eq("id", submissionId)
    .single();
  if (!submission) return;

  await admin
    .from("listing_submissions")
    .update({
      status: "needs_revision",
      rejection_reason: message,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq("id", submissionId);

  await logAdminAction({
    adminId: user.id,
    action: "listing_submission.request_revision",
    entityType: "listing_submission",
    entityId: submissionId,
    before: { status: submission.status },
    after: { status: "needs_revision", rejection_reason: message },
  });

  if (await isNotificationEnabled("email_notify_listing_status")) {
    const { subject, html } = listingNeedsRevisionEmail({ title: submission.title, message, submissionId });
    await sendTransactionalEmail({
      to: submission.contact_email,
      subject,
      html,
      emailType: "listing_needs_revision",
      dedupKey: `listing_needs_revision:${submissionId}:${Date.now()}`,
      userId: submission.user_id,
      relatedEntityType: "listing_submission",
      relatedEntityId: submissionId,
    });
  }

  revalidatePath("/admin/oglasi");
  revalidatePath("/moj-racun/oglasi");
}

export async function updateInquiryStatus(inquiryId: string, status: "new" | "contacted" | "closed") {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("inquiries").select("status").eq("id", inquiryId).single();
  await admin.from("inquiries").update({ status }).eq("id", inquiryId);
  await logAdminAction({
    adminId: user.id,
    action: "inquiry.update_status",
    entityType: "inquiry",
    entityId: inquiryId,
    before,
    after: { status },
  });
  revalidatePath("/admin/povprasevanja");
}

export async function updateListingReportStatus(reportId: string, status: "new" | "reviewed" | "dismissed") {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("listing_reports").select("status").eq("id", reportId).single();
  await admin
    .from("listing_reports")
    .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: user.id })
    .eq("id", reportId);
  await logAdminAction({
    adminId: user.id,
    action: "listing_report.update_status",
    entityType: "listing_report",
    entityId: reportId,
    before,
    after: { status },
  });
  revalidatePath("/admin/prijave");
}

export async function toggleListingExclusive(submissionId: string, isExclusive: boolean) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  await admin.from("listing_submissions").update({ is_exclusive: isExclusive }).eq("id", submissionId);
  await logAdminAction({
    adminId: user.id,
    action: "listing_submission.toggle_exclusive",
    entityType: "listing_submission",
    entityId: submissionId,
    before: { is_exclusive: !isExclusive },
    after: { is_exclusive: isExclusive },
  });
  revalidatePath("/admin/zemljisca");
  revalidatePath("/zemljisca");
}
