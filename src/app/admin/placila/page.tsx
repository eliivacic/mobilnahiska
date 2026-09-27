import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDateTimeSl } from "@/lib/format";
import { PAYMENT_STATUS_LABELS, PRODUCT_TYPE_LABELS, type Payment } from "@/lib/payments/types";

export const metadata: Metadata = { title: "Plačila | Admin | mobilnahiska.si" };

const STATUS_BADGE: Record<Payment["status"], string> = {
  pending: "bg-accent text-primary",
  paid: "bg-secondary text-primary",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  refunded: "bg-muted text-muted-foreground",
};

export default async function AdminPlacilaPage(props: PageProps<"/admin/placila">) {
  const searchParams = await props.searchParams;
  const status = typeof searchParams.status === "string" ? searchParams.status : "";
  const productType = typeof searchParams.product === "string" ? searchParams.product : "";
  const from = typeof searchParams.from === "string" ? searchParams.from : "";
  const to = typeof searchParams.to === "string" ? searchParams.to : "";

  const admin = createAdminClient();
  let query = admin.from("payments").select("*").order("created_at", { ascending: false }).limit(200);
  if (status) query = query.eq("status", status);
  if (productType) query = query.eq("product_type", productType);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", `${to}T23:59:59`);

  const { data: payments } = await query.returns<Payment[]>();

  const userIds = [...new Set((payments ?? []).map((p) => p.user_id))];
  const { data: profiles } =
    userIds.length > 0
      ? await admin.from("profiles").select("id, full_name").in("id", userIds)
      : { data: [] };
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  const rows = payments ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Plačila</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Pregled dejanskih zapisov plačil. Dokler Stripe ni povezan, ta seznam ostane prazen — tu ni izmišljenih
        zneskov.
      </p>

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3 rounded-[14px] border border-border bg-card p-4">
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          Status
          <select name="status" defaultValue={status} className="rounded-[8px] border border-border px-2 py-1.5 text-sm text-foreground">
            <option value="">Vsi</option>
            {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          Produkt
          <select name="product" defaultValue={productType} className="rounded-[8px] border border-border px-2 py-1.5 text-sm text-foreground">
            <option value="">Vsi</option>
            {Object.entries(PRODUCT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          Od
          <input type="date" name="from" defaultValue={from} className="rounded-[8px] border border-border px-2 py-1.5 text-sm text-foreground" />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-muted-foreground">
          Do
          <input type="date" name="to" defaultValue={to} className="rounded-[8px] border border-border px-2 py-1.5 text-sm text-foreground" />
        </label>
        <button type="submit" className="rounded-[8px] bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-brand-hover">
          Filtriraj
        </button>
        {(status || productType || from || to) && (
          <a href="/admin/placila" className="text-xs font-semibold text-muted-foreground underline">
            Počisti filtre
          </a>
        )}
      </form>

      {rows.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-sm font-semibold text-foreground">Ni zapisov plačil.</p>
          <p className="text-sm text-muted-foreground">
            Plačilni ponudnik (Stripe) še ni povezan, zato tu ni pravih transakcij.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-[14px] border border-border md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Uporabnik</th>
                  <th className="px-4 py-3">Produkt</th>
                  <th className="px-4 py-3">Znesek</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Ponudnik</th>
                  <th className="px-4 py-3">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((payment) => (
                  <tr key={payment.id} className="border-t border-border">
                    <td className="px-4 py-3 text-muted-foreground">{formatDateTimeSl(payment.created_at)}</td>
                    <td className="px-4 py-3 text-foreground">{nameById.get(payment.user_id) || "—"}</td>
                    <td className="px-4 py-3 text-foreground">{PRODUCT_TYPE_LABELS[payment.product_type]}</td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {new Intl.NumberFormat("sl-SI", { style: "currency", currency: payment.currency.toUpperCase() }).format(
                        payment.amount_cents / 100
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[payment.status]}`}>
                        {PAYMENT_STATUS_LABELS[payment.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{payment.provider}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {payment.provider_transaction_id || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {rows.map((payment) => (
              <div key={payment.id} className="rounded-[14px] border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{nameById.get(payment.user_id) || "—"}</p>
                    <p className="text-sm text-muted-foreground">{PRODUCT_TYPE_LABELS[payment.product_type]}</p>
                  </div>
                  <span className={`shrink-0 rounded-[6px] px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[payment.status]}`}>
                    {PAYMENT_STATUS_LABELS[payment.status]}
                  </span>
                </div>
                <p className="mt-2 font-heading text-lg font-light tracking-[-0.01em] text-foreground">
                  {new Intl.NumberFormat("sl-SI", { style: "currency", currency: payment.currency.toUpperCase() }).format(
                    payment.amount_cents / 100
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDateTimeSl(payment.created_at)} &middot; {payment.provider}
                </p>
                {payment.provider_transaction_id && (
                  <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{payment.provider_transaction_id}</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
