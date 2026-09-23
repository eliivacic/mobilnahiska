import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getListingBySlug, listings } from "@/data/listings";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingSpecs } from "@/components/listings/ListingSpecs";
import { SellerCard } from "@/components/listings/SellerCard";
import { ListingInquiryBox } from "@/components/listings/ListingInquiryBox";
import { formatPrice } from "@/lib/format";

export function generateStaticParams() {
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata(
  props: PageProps<"/oglasi/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = getListingBySlug(slug);
  if (!listing) return {};
  return {
    title: `${listing.title} | mobilnahiska.si`,
    description: listing.description,
  };
}

const TYPE_LABEL: Record<string, string> = {
  mobilna: "Mobilne hiške",
  modularna: "Modularne hiše",
};

export default async function ListingPage(props: PageProps<"/oglasi/[slug]">) {
  const { slug } = await props.params;
  const listing = getListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const specRows: [string, string][] = [
    ["Tip hiške", listing.type === "mobilna" ? "Mobilna hiška" : "Modularna hiša"],
    ["Stanje", listing.condition === "nova" ? "Nova" : "Rabljena"],
    ["Proizvajalec", listing.manufacturer],
    ["Leto izdelave", String(listing.year)],
    ["Površina", `${listing.area} m²`],
    ["Dimenzije", `${listing.length} × ${listing.width} m`],
    ["Spalnice", String(listing.bedrooms)],
    ["Kopalnice", String(listing.bathrooms)],
    ["Kapaciteta", `${listing.capacity} oseb`],
    ["Lokacija", `${listing.location}, ${listing.country}`],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Domov
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/oglasi?type=${listing.type}`} className="hover:text-foreground">
          {TYPE_LABEL[listing.type]}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{listing.title}</span>
      </nav>

      <div className="mt-4">
        <h1 className="text-balance font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          {listing.title}
        </h1>
        <p className="mt-1.5 text-sm font-medium text-muted-foreground">
          {listing.condition === "nova" ? "Nova" : "Rabljena"} &middot; {listing.year} &middot;{" "}
          {listing.location}
        </p>
        <p className="mt-3 font-heading text-3xl font-light tracking-[-0.01em] text-foreground">
          {formatPrice(listing.price)}
        </p>
      </div>

      <div className="mt-6">
        <ListingGallery images={listing.images} title={listing.title} />
      </div>

      <div className="mt-6">
        <ListingSpecs listing={listing} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">Opis</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{listing.description}</p>
          </section>

          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">Specifikacije</h2>
            <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {specRows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-1.5 text-sm"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">Oprema</h2>
            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {listing.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-foreground/90">
                  <Check className="h-4 w-4 shrink-0 text-brand" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">Transport in dostava</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              {listing.deliveryAvailable
                ? "Prodajalec za to hiško omogoča dostavo na naslov po izbiri. Natančen strošek in rok dostave se dogovorita neposredno s prodajalcem, glede na oddaljenost lokacije."
                : `Dostava za to hiško trenutno ni ponujena. Prevzem je možen na lokaciji hiške v kraju ${listing.location}, prevoz pa si kupec organizira samostojno.`}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">Lokacija</h2>
            <div className="mt-3 flex items-start gap-3 rounded-[4px] border border-border p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/40">
                <MapPin className="h-5 w-5 text-brand" />
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {listing.location}, {listing.country} &mdash; točen naslov je na voljo po dogovoru s
                prodajalcem.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">Prodajalec</h2>
            <div className="mt-3">
              <SellerCard seller={listing.seller} />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <ListingInquiryBox listing={listing} />
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 bg-brand px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-8px_24px_-12px_rgba(30,39,73,0.3)] lg:hidden">
        <span className="font-heading text-xl font-light tracking-[-0.01em] text-brand-foreground">
          {formatPrice(listing.price)}
        </span>
        <Button className="bg-brand-foreground text-brand hover:bg-secondary">
          Pošlji povpraševanje
        </Button>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </div>
  );
}
