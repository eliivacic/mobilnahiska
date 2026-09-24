import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Moji oglasi | mobilnahiska.si" };

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending_review: { label: "V pregledu", className: "bg-accent text-primary" },
  published: { label: "Objavljeno", className: "bg-secondary text-primary" },
  rejected: { label: "Zavrnjeno", className: "bg-destructive/10 text-destructive" },
};

export default async function MojiOglasiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: submissions } = await supabase
    .from("listing_submissions")
    .select("id, title, price, location, status, created_at, photo_urls")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Moji oglasi</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Pregled oddanih oglasov in njihovega statusa pregleda.
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-brand-hover">
          <Link href="/oddaj-oglas">Oddaj oglas</Link>
        </Button>
      </div>

      {!submissions || submissions.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-sm font-semibold text-foreground">Trenutno še nimate oddanih oglasov.</p>
          <p className="text-sm text-muted-foreground">Oddajte svoj prvi oglas in spremljajte njegov status tukaj.</p>
          <Button asChild className="mt-3 bg-primary text-primary-foreground hover:bg-brand-hover">
            <Link href="/oddaj-oglas">Oddaj oglas</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {submissions.map((submission) => {
            const status = STATUS_LABELS[submission.status] ?? STATUS_LABELS.pending_review;
            return (
              <li
                key={submission.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-border bg-card p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">{submission.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.location} &middot; {formatPrice(submission.price)} &middot; oddano{" "}
                    {formatDate(submission.created_at)}
                  </p>
                </div>
                <span className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                  {status.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
