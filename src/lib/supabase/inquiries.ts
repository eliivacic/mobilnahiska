"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

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

  const { error } = await supabase.from("inquiries").insert({
    listing_slug: listingSlug,
    listing_title: listingTitle,
    listing_url: listingUrl,
    seller_name: sellerName,
    user_id: user?.id ?? null,
    name,
    email,
    phone: phone || null,
    message,
  });

  if (error) {
    return { error: "Povpraševanja ni bilo mogoče oddati. Poskusite znova." };
  }

  const admin = createAdminClient();
  const { data: setting } = await admin
    .from("portal_settings")
    .select("value")
    .eq("key", "contact_email")
    .single();
  const notifyEmail = setting?.value;

  if (notifyEmail) {
    await sendEmail({
      to: notifyEmail,
      subject: `Novo povpraševanje: ${listingTitle}`,
      html: `
        <p><strong>Oglas:</strong> <a href="${listingUrl}">${listingTitle}</a></p>
        <p><strong>Prodajalec:</strong> ${sellerName}</p>
        <hr />
        <p><strong>Ime:</strong> ${name}</p>
        <p><strong>E-pošta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone || "ni navedeno"}</p>
        <p><strong>Sporočilo:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });
  }

  return { success: true };
}
