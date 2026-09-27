"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail, isNotificationEnabled } from "@/lib/email/send";
import { inquiryNotificationEmail } from "@/lib/email/templates";

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
  const { data: inserted, error } = await admin
    .from("inquiries")
    .insert({
      listing_slug: listingSlug,
      listing_title: listingTitle,
      listing_url: listingUrl,
      seller_name: sellerName,
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

  // Listings shown on the public site are still static data (src/data),
  // not tied to a real seller account yet — there is no real seller inbox
  // to notify, so this goes to the portal admin instead. Once listings are
  // fully database-backed with a real owner, this can notify that owner
  // directly using the same template.
  if (await isNotificationEnabled("email_notify_inquiry")) {
    const { data: setting } = await admin
      .from("portal_settings")
      .select("value")
      .eq("key", "contact_email")
      .single();
    const notifyEmail = setting?.value;

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
