"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail, isNotificationEnabled } from "@/lib/email/send";
import { listingSubmittedEmail, adminNewListingEmail } from "@/lib/email/templates";
import { slugifyWithSuffix } from "@/lib/slug";
import { randomUUID } from "node:crypto";
import { checkRateLimit } from "@/lib/rate-limit";

export interface SubmitListingState {
  error?: string;
  success?: boolean;
}

const HOUSE_TYPES = new Set(["mobilna", "modularna"]);
const LAND_TYPES = new Set(["stavbno", "kmetijsko", "gozdno", "ostalo"]);

function numberOrNull(value: FormDataEntryValue | null): number | null {
  if (!value) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function submitListingSubmission(
  _prevState: SubmitListingState,
  formData: FormData
): Promise<SubmitListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Za oddajo oglasa se morate prijaviti." };
  }

  const type = String(formData.get("type") ?? "");
  if (!HOUSE_TYPES.has(type) && type !== "zemljisce") {
    return { error: "Izberite vrsto nepremičnine." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = numberOrNull(formData.get("price"));
  const location = String(formData.get("location") ?? "").trim();
  const country = String(formData.get("country") ?? "Slovenija");
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const photoUrlsRaw = String(formData.get("photoUrls") ?? "[]");

  let photoUrls: string[] = [];
  try {
    const parsed = JSON.parse(photoUrlsRaw);
    if (Array.isArray(parsed)) photoUrls = parsed.filter((item) => typeof item === "string");
  } catch {
    photoUrls = [];
  }

  if (title.length < 5) return { error: "Naslov mora imeti vsaj 5 znakov." };
  if (description.length < 20) return { error: "Opis mora imeti vsaj 20 znakov." };
  if (price === null || price <= 0) return { error: "Vnesite veljavno ceno." };
  if (!location) return { error: "Vnesite lokacijo." };
  if (!contactName) return { error: "Vnesite kontaktno ime." };
  if (!contactPhone) return { error: "Vnesite kontaktno telefonsko številko." };
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "Vnesite veljaven kontaktni e-poštni naslov." };
  }
  if (photoUrls.length < 1) return { error: "Dodajte vsaj eno fotografijo." };
  if (photoUrls.length > 12) return { error: "Največ 12 fotografij." };

  const rateLimit = await checkRateLimit({ key: `listing_submission:${user.id}`, limit: 5, windowMinutes: 60 });
  if (!rateLimit.allowed) {
    return { error: "Preveč oddanih oglasov v kratkem času. Poskusite znova čez nekaj časa." };
  }

  const featuresRaw = String(formData.get("features") ?? "");
  const features = featuresRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 20);

  const id = randomUUID();
  const slug = slugifyWithSuffix(title, id);

  const record: Record<string, unknown> = {
    id,
    slug,
    user_id: user.id,
    title,
    description,
    price,
    location,
    country,
    contact_name: contactName,
    contact_phone: contactPhone,
    contact_email: contactEmail,
    photo_urls: photoUrls,
    features,
  };

  if (type === "mobilna" || type === "modularna") {
    const condition = String(formData.get("condition") ?? "");
    const manufacturer = String(formData.get("manufacturer") ?? "").trim();
    const year = numberOrNull(formData.get("year"));
    const area = numberOrNull(formData.get("area"));
    const length = numberOrNull(formData.get("length"));
    const width = numberOrNull(formData.get("width"));
    const bedrooms = numberOrNull(formData.get("bedrooms"));
    const bathrooms = numberOrNull(formData.get("bathrooms"));
    const capacity = numberOrNull(formData.get("capacity"));

    if (condition !== "nova" && condition !== "rabljena") return { error: "Izberite stanje hiške." };
    if (!manufacturer) return { error: "Vnesite proizvajalca." };
    if (!year || year < 1950 || year > new Date().getFullYear() + 1) return { error: "Vnesite veljavno leto izdelave." };
    if (!area || area <= 0) return { error: "Vnesite veljavno površino." };
    if (!length || length <= 0 || !width || width <= 0) return { error: "Vnesite veljavne dimenzije." };
    if (bedrooms === null || bedrooms < 0) return { error: "Vnesite število spalnic." };
    if (bathrooms === null || bathrooms < 0) return { error: "Vnesite število kopalnic." };
    if (!capacity || capacity <= 0) return { error: "Vnesite kapaciteto." };

    Object.assign(record, {
      type,
      condition,
      manufacturer,
      year,
      area,
      length,
      width,
      bedrooms,
      bathrooms,
      capacity,
      delivery_available: formData.get("deliveryAvailable") === "on",
    });
  } else if (type === "zemljisce") {
    const landType = String(formData.get("landType") ?? "");
    const area = numberOrNull(formData.get("area"));

    if (!LAND_TYPES.has(landType)) return { error: "Izberite tip zemljišča." };
    if (!area || area <= 0) return { error: "Vnesite veljavno površino." };

    Object.assign(record, {
      type: "zemljisce",
      land_type: landType,
      area,
      utilities_available: formData.get("utilitiesAvailable") === "on",
    });
  } else {
    return { error: "Izberite vrsto nepremičnine." };
  }

  const { data: inserted, error } = await supabase
    .from("listing_submissions")
    .insert(record)
    .select("id")
    .single();

  if (error) {
    return { error: "Oglasa ni bilo mogoče oddati. Poskusite znova." };
  }

  if (await isNotificationEnabled("email_notify_listing_status")) {
    const { subject, html } = listingSubmittedEmail({ title });
    await sendTransactionalEmail({
      to: contactEmail,
      subject,
      html,
      emailType: "listing_submitted",
      dedupKey: `listing_submitted:${inserted.id}`,
      userId: user.id,
      relatedEntityType: "listing_submission",
      relatedEntityId: inserted.id,
    });
  }

  if (await isNotificationEnabled("email_notify_admin")) {
    const admin = createAdminClient();
    const { data: setting } = await admin
      .from("portal_settings")
      .select("value")
      .eq("key", "contact_email")
      .single();
    if (setting?.value) {
      const { subject, html } = adminNewListingEmail({ title, submitterEmail: contactEmail });
      await sendTransactionalEmail({
        to: setting.value,
        subject,
        html,
        emailType: "admin_new_listing",
        dedupKey: `admin_new_listing:${inserted.id}`,
        relatedEntityType: "listing_submission",
        relatedEntityId: inserted.id,
      });
    }
  }

  return { success: true };
}

// Editing your own listing. RLS (`listing_submissions_update_own`) is the
// real enforcement boundary here: it scopes the update to auth.uid() =
// user_id and refuses to leave the row as status = 'published' or
// 'rejected' no matter what this code sends — so even a bug here couldn't
// let a user self-publish or edit someone else's listing. Re-submitting an
// already-published listing for edits intentionally sends it back through
// moderation, since the content changed.
export async function updateListingSubmission(
  submissionId: string,
  _prevState: SubmitListingState,
  formData: FormData
): Promise<SubmitListingState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Za urejanje oglasa se morate prijaviti." };

  const { data: existing } = await supabase
    .from("listing_submissions")
    .select("id, type, status")
    .eq("id", submissionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!existing) return { error: "Oglasa ni bilo mogoče najti." };
  if (existing.status === "deactivated") {
    return { error: "Deaktiviranega oglasa ni mogoče urejati. Najprej ga ponovno omogočite." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = numberOrNull(formData.get("price"));
  const location = String(formData.get("location") ?? "").trim();
  const contactName = String(formData.get("contactName") ?? "").trim();
  const contactPhone = String(formData.get("contactPhone") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();

  if (title.length < 5) return { error: "Naslov mora imeti vsaj 5 znakov." };
  if (description.length < 20) return { error: "Opis mora imeti vsaj 20 znakov." };
  if (price === null || price <= 0) return { error: "Vnesite veljavno ceno." };
  if (!location) return { error: "Vnesite lokacijo." };
  if (!contactName) return { error: "Vnesite kontaktno ime." };
  if (!contactPhone) return { error: "Vnesite kontaktno telefonsko številko." };
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { error: "Vnesite veljaven kontaktni e-poštni naslov." };
  }

  const record: Record<string, unknown> = {
    title,
    description,
    price,
    location,
    contact_name: contactName,
    contact_phone: contactPhone,
    contact_email: contactEmail,
    status: "pending_review",
    reviewed_at: null,
    reviewed_by: null,
    rejection_reason: null,
  };

  if (existing.type === "mobilna" || existing.type === "modularna") {
    const condition = String(formData.get("condition") ?? "");
    const manufacturer = String(formData.get("manufacturer") ?? "").trim();
    const year = numberOrNull(formData.get("year"));
    const area = numberOrNull(formData.get("area"));
    const length = numberOrNull(formData.get("length"));
    const width = numberOrNull(formData.get("width"));
    const bedrooms = numberOrNull(formData.get("bedrooms"));
    const bathrooms = numberOrNull(formData.get("bathrooms"));
    const capacity = numberOrNull(formData.get("capacity"));

    if (condition !== "nova" && condition !== "rabljena") return { error: "Izberite stanje hiške." };
    if (!manufacturer) return { error: "Vnesite proizvajalca." };
    if (!year || year < 1950 || year > new Date().getFullYear() + 1) return { error: "Vnesite veljavno leto izdelave." };
    if (!area || area <= 0) return { error: "Vnesite veljavno površino." };
    if (!length || length <= 0 || !width || width <= 0) return { error: "Vnesite veljavne dimenzije." };
    if (bedrooms === null || bedrooms < 0) return { error: "Vnesite število spalnic." };
    if (bathrooms === null || bathrooms < 0) return { error: "Vnesite število kopalnic." };
    if (!capacity || capacity <= 0) return { error: "Vnesite kapaciteto." };

    Object.assign(record, {
      condition,
      manufacturer,
      year,
      area,
      length,
      width,
      bedrooms,
      bathrooms,
      capacity,
      delivery_available: formData.get("deliveryAvailable") === "on",
    });
  } else {
    const area = numberOrNull(formData.get("area"));
    if (!area || area <= 0) return { error: "Vnesite veljavno površino." };
    Object.assign(record, {
      area,
      utilities_available: formData.get("utilitiesAvailable") === "on",
    });
  }

  const { error } = await supabase.from("listing_submissions").update(record).eq("id", submissionId);
  if (error) return { error: "Sprememb ni bilo mogoče shraniti. Poskusite znova." };

  revalidatePath("/moj-racun/oglasi");
  return { success: true };
}

export async function deactivateListingSubmission(submissionId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Za to dejanje se morate prijaviti." };

  const { error } = await supabase
    .from("listing_submissions")
    .update({ status: "deactivated" })
    .eq("id", submissionId)
    .eq("user_id", user.id);

  if (error) return { error: "Oglasa ni bilo mogoče deaktivirati." };
  revalidatePath("/moj-racun/oglasi");
  return {};
}

export async function reactivateListingSubmission(submissionId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Za to dejanje se morate prijaviti." };

  // Reactivating sends it back through moderation rather than straight back
  // to published — the listing may have been off the market for a while
  // (price, availability) and content should be re-checked, same as an edit.
  const { error } = await supabase
    .from("listing_submissions")
    .update({ status: "pending_review", reviewed_at: null, reviewed_by: null, rejection_reason: null })
    .eq("id", submissionId)
    .eq("user_id", user.id)
    .eq("status", "deactivated");

  if (error) return { error: "Oglasa ni bilo mogoče ponovno omogočiti." };
  revalidatePath("/moj-racun/oglasi");
  return {};
}
