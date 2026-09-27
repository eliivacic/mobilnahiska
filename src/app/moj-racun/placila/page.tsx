import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSl } from "@/lib/format";
import { PAYMENT_STATUS_LABELS, PRODUCT_TYPE_LABELS, type Payment } from "@/lib/payments/types";

export const metadata: Metadata = { title: "Plačila | mobilnahiska.si" };

const STATUS_BADGE: Record<Payment["status"], string> = {
  pending: "bg-accent text-primary",
  paid: "bg-secondary text-primary",
  failed: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  refunded: "bg-muted text-muted-foreground",
};

export default async function MojaPlacilaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<Payment[]>();

  const rows = payments ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Plačila</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Zgodovina vaših plačil za pakete in oglase.</p>

      {rows.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-sm font-semibold text-foreground">Trenutno še nimate plačil.</p>
          <p className="text-sm text-muted-foreground">
            Plačilni sistem še ni aktiviran. Ko bo na voljo, boste tukaj videli zgodovino svojih nakupov.
          </p>
          <Link href="/cene" className="mt-2 text-sm font-semibold text-primary underline">
            Poglej cenik
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((payment) => (
            <li
              key={payment.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-border bg-card p-4"
            >
              <div>
                <p className="font-semibold text-foreground">{PRODUCT_TYPE_LABELS[payment.product_type]}</p>
                <p className="text-sm text-muted-foreground">{formatDateTimeSl(payment.created_at)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-foreground">
                  {new Intl.NumberFormat("sl-SI", { style: "currency", currency: payment.currency.toUpperCase() }).format(
                    payment.amount_cents / 100
                  )}
                </span>
                <span className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold ${STATUS_BADGE[payment.status]}`}>
                  {PAYMENT_STATUS_LABELS[payment.status]}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
