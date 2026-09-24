import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLandBySlug, lands } from "@/data/land";
import { LAND_TYPE_LABELS } from "@/types/land";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return lands.map((land) => ({ slug: land.slug }));
}

export async function generateMetadata(
  props: PageProps<"/zemljisca/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const land = getLandBySlug(slug);
  if (!land) return {};
  return {
    title: `${land.title} | mobilnahiska.si`,
    description: land.description,
  };
}

export default async function LandPage(props: PageProps<"/zemljisca/[slug]">) {
  const { slug } = await props.params;
  const land = getLandBySlug(slug);

  if (!land) {
    notFound();
  }

  const specRows: [string, string][] = [
    ["Tip zemljišča", LAND_TYPE_LABELS[land.type]],
    ["Površina", `${land.area} m²`],
    ["Lokacija", `${land.location}, ${land.country}`],
  ];

  return (
    <PageShell className="py-8">
      <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Domov
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/zemljisca" className="hover:text-foreground">
          Zazidljiva zemljišča
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{land.title}</span>
      </nav>

      <div className="mt-4">
        {land.exclusive && (
          <span className="inline-block rounded-[6px] bg-accent px-2 py-1 text-[11px] font-semibold tracking-wide text-primary">
            EKSKLUZIVNO
          </span>
        )}
        <h1 className="mt-2 text-balance font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          {land.title}
        </h1>
        <p className="mt-1.5 text-sm font-medium text-muted-foreground">
          {land.location}, {land.country}
        </p>
        <p className="mt-3 font-heading text-3xl font-light tracking-[-0.01em] text-foreground">
          {formatPrice(land.price)}
        </p>
      </div>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-[14px] bg-muted">
        <Image src={land.images[0]} alt={land.title} fill sizes="1280px" className="object-cover" />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">Opis</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{land.description}</p>
          </section>

          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">
              Specifikacije
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {specRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-1.5 text-sm">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">Lokacija</h2>
            <div className="mt-3 flex items-start gap-3 rounded-[12px] border border-border p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/40">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {land.location}, {land.country}. Točen naslov parcele je na voljo po dogovoru.
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-[14px] border border-border bg-card p-5 shadow-lift">
            <p className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
              {formatPrice(land.price)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Zanima vas to zemljišče? Kontaktirajte nas za več informacij.
            </p>
            <Button asChild className="mt-4 w-full bg-primary text-primary-foreground hover:bg-brand-hover">
              <a href="mailto:info@mobilnahiska.si">Pošlji povpraševanje</a>
            </Button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
