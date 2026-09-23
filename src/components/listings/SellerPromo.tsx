import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HERO_IMAGE } from "@/data/images";

export function SellerPromo() {
  return (
    <section className="bg-brand">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-5 lg:gap-10 lg:px-8 lg:py-16">
        <div className="lg:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Za prodajalce
          </p>
          <h2 className="mt-3 font-heading text-2xl font-light tracking-[-0.01em] text-brand-foreground sm:text-3xl">
            Prodajate mobilne ali modularne hiške?
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-foreground/70">
            Predstavite svojo ponudbo kupcem, ki aktivno iščejo mobilne in modularne hiške.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button asChild className="bg-brand-foreground text-brand hover:bg-secondary">
              <Link href="/oddaj-oglas">Oddaj oglas</Link>
            </Button>
            <Link
              href="/cene"
              className="text-sm font-medium text-brand-foreground/80 underline-offset-4 transition-colors hover:text-brand-foreground hover:underline"
            >
              Paketi za ponudnike →
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] lg:col-span-2">
          <Image
            src={HERO_IMAGE}
            alt="Mobilna hiška s teraso"
            fill
            sizes="(min-width: 1024px) 35vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
