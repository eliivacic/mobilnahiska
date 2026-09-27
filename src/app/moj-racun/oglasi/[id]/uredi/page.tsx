import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditListingForm } from "@/components/dashboard/EditListingForm";

export const metadata: Metadata = { title: "Uredi oglas | mobilnahiska.si" };

export default async function EditListingPage(props: PageProps<"/moj-racun/oglasi/[id]/uredi">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS (`listing_submissions_select_own`) already scopes this to the
  // caller's own rows — the .eq("user_id", ...) below is a second,
  // belt-and-suspenders check, not the actual security boundary.
  const { data: submission } = await supabase
    .from("listing_submissions")
    .select(
      "id, type, title, description, price, location, contact_name, contact_phone, contact_email, condition, manufacturer, year, area, length, width, bedrooms, bathrooms, capacity, delivery_available, utilities_available, status"
    )
    .eq("id", id)
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!submission) notFound();

  const isHouseType = submission.type === "mobilna" || submission.type === "modularna";

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Uredi oglas</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {submission.status === "published"
          ? "Ta oglas je trenutno objavljen — po shranitvi sprememb bo ponovno poslan v pregled, preden bo spet javno viden."
          : "Spremembe bodo poslane v pregled administratorju."}
      </p>

      <div className="mt-6">
        <EditListingForm
          submissionId={submission.id}
          isHouseType={isHouseType}
          defaults={{
            title: submission.title,
            description: submission.description,
            price: String(submission.price),
            location: submission.location,
            contactName: submission.contact_name,
            contactPhone: submission.contact_phone,
            contactEmail: submission.contact_email,
            condition: (submission.condition as "nova" | "rabljena" | "") ?? "",
            manufacturer: submission.manufacturer ?? "",
            year: submission.year ? String(submission.year) : "",
            area: submission.area ? String(submission.area) : "",
            length: submission.length ? String(submission.length) : "",
            width: submission.width ? String(submission.width) : "",
            bedrooms: submission.bedrooms !== null ? String(submission.bedrooms) : "",
            bathrooms: submission.bathrooms !== null ? String(submission.bathrooms) : "",
            capacity: submission.capacity ? String(submission.capacity) : "",
            deliveryAvailable: Boolean(submission.delivery_available),
            utilitiesAvailable: Boolean(submission.utilities_available),
          }}
        />
      </div>
    </div>
  );
}
