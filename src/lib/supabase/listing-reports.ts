"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail, isNotificationEnabled } from "@/lib/email/send";
import { listingReportedEmail } from "@/lib/email/templates";
import { checkRateLimit } from "@/lib/rate-limit";

export interface ReportListingActionState {
  error?: string;
  success?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const REPORT_REASONS: Record<string, string> = {
  zavajajoce: "Zavajajoči podatki (cena, površina, stanje …)",
  neustrezna_vsebina: "Neustrezna ali žaljiva vsebina",
  goljufija: "Sum goljufije",
  tuja_vsebina: "Tuje fotografije ali besedilo brez dovoljenja",
  drugo: "Drugo",
};

export async function reportListing(
  _prevState: ReportListingActionState,
  formData: FormData
): Promise<ReportListingActionState> {
  const listingSlug = String(formData.get("listingSlug") ?? "");
  const listingTitle = String(formData.get("listingTitle") ?? "");
  const listingUrl = String(formData.get("listingUrl") ?? "");

  const reasonKey = String(formData.get("reason") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!listingSlug || !listingTitle || !listingUrl) {
    return { error: "Manjkajo podatki o oglasu. Osvežite stran in poskusite znova." };
  }
  if (!REPORT_REASONS[reasonKey]) return { error: "Izberite razlog prijave." };
  if (name.length < 2) return { error: "Vnesite svoje ime." };
  if (!EMAIL_RE.test(email)) return { error: "Vnesite veljaven e-poštni naslov." };
  if (message.length < 5) return { error: "Na kratko opišite razlog prijave." };
  if (message.length > 3000) return { error: "Sporočilo je predolgo (največ 3000 znakov)." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  const rateLimit = await checkRateLimit({ key: `listing_report:${ip}`, limit: 5, windowMinutes: 60 });
  if (!rateLimit.allowed) {
    return { error: "Preveč prijav v kratkem času. Poskusite znova čez nekaj časa." };
  }

  const admin = createAdminClient();

  const { data: submission } = await admin
    .from("listing_submissions")
    .select("id")
    .eq("slug", listingSlug)
    .maybeSingle();

  const reason = REPORT_REASONS[reasonKey];

  const { data: inserted, error } = await admin
    .from("listing_reports")
    .insert({
      listing_submission_id: submission?.id ?? null,
      listing_slug: listingSlug,
      listing_title: listingTitle,
      listing_url: listingUrl,
      reporter_name: name,
      reporter_email: email,
      reason,
      message,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "Prijave ni bilo mogoče oddati. Poskusite znova." };
  }

  if (await isNotificationEnabled("email_notify_admin")) {
    const { data: setting } = await admin
      .from("portal_settings")
      .select("value")
      .eq("key", "contact_email")
      .single();
    const adminEmail = setting?.value;

    if (adminEmail) {
      const { subject, html } = listingReportedEmail({
        listingTitle,
        listingUrl,
        reason,
        reporterName: name,
        reporterEmail: email,
        message,
      });
      await sendTransactionalEmail({
        to: adminEmail,
        subject,
        html,
        emailType: "listing_reported",
        dedupKey: `listing_reported:${inserted.id}`,
        relatedEntityType: "listing_report",
        relatedEntityId: inserted.id,
      });
    }
  }

  return { success: true };
}
