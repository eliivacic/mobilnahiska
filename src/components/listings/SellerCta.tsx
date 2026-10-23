import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/PageShell";

export function SellerCta() {
  return (
    <section className="bg-header">
      <PageShell className="py-14 text-center">
        <h2 className="mx-auto max-w-xl font-heading text-2xl font-light tracking-[-0.01em] text-header-foreground sm:text-3xl">
          Prodajate hiške ali zemljišča?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-header-foreground/70">
          Kupce dosežite s specializiranim oglasom na mobilnahiska.si.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="bg-brand-on-header text-brand-on-header-foreground hover:bg-brand-on-header-hover">
            <Link href="/oddaj-oglas">Oddaj oglas</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/cene">Paketi za ponudnike</Link>
          </Button>
        </div>
      </PageShell>
    </section>
  );
}
