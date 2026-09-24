import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Moji oglasi | mobilnahiska.si" };

// Listings live in src/data/listings.ts (static) and src/data/land.ts, not in
// the database yet — there is no submission flow that writes a real listing
// row for a user. Until that exists, this page shows an honest empty state
// instead of pretending a listing exists.
export default function MojiOglasiPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Moji oglasi</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Pregled, urejanje, podaljšanje in izpostavitev vaših oglasov.
      </p>

      <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-10 text-center">
        <p className="text-sm font-semibold text-foreground">Trenutno še nimate objavljenih oglasov.</p>
        <p className="text-sm text-muted-foreground">
          Oddaja oglasa še ni povezana s podatkovno bazo — ta del čaka na naslednjo fazo razvoja.
        </p>
        <Button asChild className="mt-3 bg-primary text-primary-foreground hover:bg-brand-hover">
          <Link href="/oddaj-oglas">Oddaj oglas</Link>
        </Button>
      </div>
    </div>
  );
}
