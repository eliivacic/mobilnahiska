import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { ListingModerationRow } from "@/components/dashboard/ListingModerationRow";

export const metadata: Metadata = { title: "Oglasi | Admin | mobilnahiska.si" };

// Mobilna/modularna/zemljišče listings shown publicly still come from the
// static data files (src/data) — this page moderates real submissions from
// /oddaj-oglas (the `listing_submissions` table). Approving one here does
// not yet make it appear on the public listing pages, since those aren't
// sourced from the database yet; see the technical report.
export default async function AdminOglasiPage() {
  const admin = createAdminClient();
  const { data: submissions } = await admin
    .from("listing_submissions")
    .select("id, title, price, location, contact_name, contact_email, created_at, status, rejection_reason")
    .order("created_at", { ascending: false });

  const pending = (submissions ?? []).filter((item) => item.status === "pending_review");
  const reviewed = (submissions ?? []).filter((item) => item.status !== "pending_review");

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Oglasi</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Pregled, potrjevanje in zavračanje oddanih oglasov ({"/oddaj-oglas"}).
      </p>

      <div className="mt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
          Čaka na pregled ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Trenutno ni oglasov, ki bi čakali na pregled.</p>
        ) : (
          <div className="mt-3 space-y-3">
            {pending.map((item) => (
              <ListingModerationRow
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                location={item.location}
                contactName={item.contact_name}
                contactEmail={item.contact_email}
                createdAt={item.created_at}
                status={item.status}
                rejectionReason={item.rejection_reason}
              />
            ))}
          </div>
        )}
      </div>

      {reviewed.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
            Pregledani oglasi
          </h2>
          <div className="mt-3 space-y-3">
            {reviewed.map((item) => (
              <ListingModerationRow
                key={item.id}
                id={item.id}
                title={item.title}
                price={item.price}
                location={item.location}
                contactName={item.contact_name}
                contactEmail={item.contact_email}
                createdAt={item.created_at}
                status={item.status}
                rejectionReason={item.rejection_reason}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
