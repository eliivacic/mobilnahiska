import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateTimeSl } from "@/lib/format";
import { InquiryStatusSelect } from "@/components/dashboard/InquiryStatusSelect";
import { updateInquiryStatus } from "@/lib/supabase/admin-actions";

export const metadata: Metadata = { title: "Povpraševanja | Admin | mobilnahiska.si" };

export default async function AdminPovprasevanjaPage(props: PageProps<"/admin/povprasevanja">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const admin = createAdminClient();
  let query = admin
    .from("inquiries")
    .select("id, listing_title, listing_url, seller_name, name, email, phone, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  const { data: inquiries } = await query;

  const rows = inquiries ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Povpraševanja</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Centralni pregled vseh povpraševanj kupcev po oglasih ({rows.length}).
      </p>

      <form method="get" className="mt-4 flex items-center gap-2">
        <select
          name="status"
          defaultValue={status}
          className="rounded-[8px] border border-border px-2 py-1.5 text-sm text-foreground"
        >
          <option value="">Vsi statusi</option>
          <option value="new">Novo</option>
          <option value="contacted">Kontaktirano</option>
          <option value="closed">Zaključeno</option>
        </select>
        <button type="submit" className="rounded-[8px] bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-brand-hover">
          Filtriraj
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Ni povpraševanj, ki bi ustrezala filtru.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((inquiry) => (
            <li key={inquiry.id} className="rounded-[14px] border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{inquiry.listing_title}</p>
                  <p className="text-sm text-muted-foreground">
                    {inquiry.name} &middot; {inquiry.email}
                    {inquiry.phone && ` · ${inquiry.phone}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTimeSl(inquiry.created_at)}</p>
                </div>
                <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} onUpdate={updateInquiryStatus} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{inquiry.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
