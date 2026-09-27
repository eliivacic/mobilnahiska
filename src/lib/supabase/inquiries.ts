"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail, isNotificationEnabled } from "@/lib/email/send";
import { inquiryNotificationEmail } from "@/lib/email/templates";
import { checkRateLimit } from "@/lib/rate-limit";

export interface InquiryActionState {
  error?: string;
  success?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitInquiry(
  _prevState: InquiryActionState,
  formData: FormData
): Promise<InquiryActionState> {
  const listingSlug = String(formData.get("listingSlug") ?? "");
  const listingTitle = String(formData.get("listingTitle") ?? "");
  const listingUrl = String(formData.get("listingUrl") ?? "");
  const sellerName = String(formData.get("sellerName") ?? "");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!listingSlug || !listingTitle || !listingUrl || !sellerName) {
    return { error: "Manjkajo podatki o oglasu. Osvežite stran in poskusite znova." };
  }
  if (name.length < 2) return { error: "Vnesite svoje ime." };
  if (!EMAIL_RE.test(email)) return { error: "Vnesite veljaven e-poštni naslov." };
  if (message.length < 5) return { error: "Sporočilo je prekratko." };
  if (message.length > 3000) return { error: "Sporočilo je predolgo (največ 3000 znakov)." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  const rateLimit = await checkRateLimit({ key: `inquiry:${ip}`, limit: 10, windowMinutes: 60 });
  if (!rateLimit.allowed) {
    return { error: "Preveč povpraševanj v kratkem času. Poskusite znova čez nekaj časa." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Anonymous visitors can submit inquiries, but the RLS select policy on
  // this table is admin-only (no "read your own" policy — there's no
  // account to scope it to for anonymous submitters). Insert via the admin
  // client so we can read the new row's id back for the dedup key below,
  // rather than granting anon a select policy just for this.
  const admin = createAdminClient();

  // Real DB-backed listings carry their own contact_email — the inquiry
  // notification goes straight to that seller. Falls back to the portal
  // admin contact only when the slug doesn't resolve to a real submission
  // (shouldn't happen for anything reachable from the live catalog anymore,
  // but keeps this action from silently dropping a notification if it does).
  const { data: submission } = await admin
    .from("listing_submissions")
    .select("id, contact_email")
    .eq("slug", listingSlug)
    .maybeSingle();

  const { data: inserted, error } = await admin
    .from("inquiries")
    .insert({
      listing_slug: listingSlug,
      listing_title: listingTitle,
      listing_url: listingUrl,
      seller_name: sellerName,
      listing_submission_id: submission?.id ?? null,
      user_id: user?.id ?? null,
      name,
      email,
      phone: phone || null,
      message,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "Povpraševanja ni bilo mogoče oddati. Poskusite znova." };
  }

  if (await isNotificationEnabled("email_notify_inquiry")) {
    let notifyEmail = submission?.contact_email;
    if (!notifyEmail) {
      const { data: setting } = await admin
        .from("portal_settings")
        .select("value")
        .eq("key", "contact_email")
        .single();
      notifyEmail = setting?.value;
    }

    if (notifyEmail) {
      const { subject, html } = inquiryNotificationEmail({
        listingTitle,
        listingUrl,
        sellerName,
        senderName: name,
        senderEmail: email,
        senderPhone: phone || null,
        message,
      });
      await sendTransactionalEmail({
        to: notifyEmail,
        subject,
        html,
        emailType: "inquiry_notification",
        dedupKey: `inquiry_notification:${inserted.id}`,
        relatedEntityType: "inquiry",
        relatedEntityId: inserted.id,
      });
    }
  }

  return { success: true };
}
