"use server";

import { createClient } from "@/lib/supabase/server";

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

  const record: Record<string, unknown> = {
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

  const { error } = await supabase.from("listing_submissions").insert(record);

  if (error) {
    return { error: "Oglasa ni bilo mogoče oddati. Poskusite znova." };
  }

  return { success: true };
}
