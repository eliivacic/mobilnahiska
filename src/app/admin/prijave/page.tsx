import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateTimeSl } from "@/lib/format";
import { ReportStatusSelect } from "@/components/dashboard/ReportStatusSelect";
import { updateListingReportStatus } from "@/lib/supabase/admin-actions";

export const metadata: Metadata = { title: "Prijave oglasov | Admin | mobilnahiska.si" };

export default async function AdminPrijavePage(props: PageProps<"/admin/prijave">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams.status === "string" ? searchParams.status : "";

  const admin = createAdminClient();
  let query = admin
    .from("listing_reports")
    .select("id, listing_title, listing_url, reporter_name, reporter_email, reason, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status) query = query.eq("status", status);
  const { data: reports } = await query;

  const rows = reports ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Prijave oglasov</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Prijave nezakonite ali neustrezne vsebine, ki jih oddajo obiskovalci ({rows.length}).
      </p>

      <form method="get" className="mt-4 flex items-center gap-2">
        <select
          name="status"
          defaultValue={status}
          className="rounded-[8px] border border-border px-2 py-1.5 text-sm text-foreground"
        >
          <option value="">Vsi statusi</option>
          <option value="new">Novo</option>
          <option value="reviewed">Pregledano</option>
          <option value="dismissed">Zavrnjeno</option>
        </select>
        <button type="submit" className="rounded-[8px] bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-brand-hover">
          Filtriraj
        </button>
      </form>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Ni prijav, ki bi ustrezale filtru.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((report) => (
            <li key={report.id} className="rounded-[14px] border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link href={report.listing_url} target="_blank" className="font-semibold text-foreground hover:underline">
                    {report.listing_title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Razlog: {report.reason}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Prijavil: {report.reporter_name} &middot; {report.reporter_email}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTimeSl(report.created_at)}</p>
                </div>
                <ReportStatusSelect reportId={report.id} status={report.status} onUpdate={updateListingReportStatus} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{report.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
