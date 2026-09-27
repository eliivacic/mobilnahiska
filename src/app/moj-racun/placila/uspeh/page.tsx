import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { PAYMENT_STATUS_LABELS, type Payment } from "@/lib/payments/types";
import { TrackPurchaseCompleted } from "@/components/payments/TrackPurchaseCompleted";

export const metadata: Metadata = { title: "Plačilo | mobilnahiska.si" };

// This page only ever READS the payment's current status — it never marks
// anything as paid itself. Activation happens exclusively in the Stripe
// webhook (src/app/api/webhooks/stripe/route.ts) after Stripe confirms the
// charge. If the webhook hasn't landed yet when the user is redirected back
// here, we show a "still processing" state rather than guessing.
export default async function PlaciloUspehPage(props: PageProps<"/moj-racun/placila/uspeh">) {
  const searchParams = await props.searchParams;
  const paymentId = typeof searchParams.payment_id === "string" ? searchParams.payment_id : undefined;

  const supabase = await createClient();
  const { data: payment } = paymentId
    ? await supabase.from("payments").select("*").eq("id", paymentId).maybeSingle<Payment>()
    : { data: null };

  const isPaid = payment?.status === "paid";

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-[14px] border border-border bg-card p-8 text-center">
      {isPaid ? (
        <>
          <TrackPurchaseCompleted
            productType={payment.product_type}
            productId={payment.product_id}
            amountCents={payment.amount_cents}
          />
          <CheckCircle2 className="h-10 w-10 text-brand" />
          <h1 className="font-heading text-xl font-light tracking-[-0.01em] text-foreground">Plačilo uspešno</h1>
          <p className="text-sm text-muted-foreground">Vaše naročilo je bilo potrjeno in aktivirano.</p>
        </>
      ) : (
        <>
          <Clock className="h-10 w-10 text-muted-foreground" />
          <h1 className="font-heading text-xl font-light tracking-[-0.01em] text-foreground">
            Plačilo se še obdeluje
          </h1>
          <p className="text-sm text-muted-foreground">
            Trenutni status: {payment ? PAYMENT_STATUS_LABELS[payment.status] : "neznano"}. Osvežite stran čez
            trenutek — potrditev od plačilnega ponudnika lahko traja nekaj sekund.
          </p>
        </>
      )}
      <Button asChild className="mt-2">
        <Link href="/moj-racun/placila">Nazaj na plačila</Link>
      </Button>
    </div>
  );
}
