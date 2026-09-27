import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Globe } from "lucide-react";
import { getProviderBySlug, getListingsByProviderSlug } from "@/lib/providers/public";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { PhoneReveal } from "@/components/listings/PhoneReveal";
import { pluralizeSl } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/ponudniki/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return {};
  return { title: `${provider.name} | mobilnahiska.si`, description: provider.description ?? undefined };
}

export default async function ProviderPage(props: PageProps<"/ponudniki/[slug]">) {
  const { slug } = await props.params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const providerListings = await getListingsByProviderSlug(slug);

  return (
    <PageShell className="py-8">
      <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Domov
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/ponudniki" className="hover:text-foreground">
          Ponudniki
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{provider.name}</span>
      </nav>

      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {provider.logoUrl ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-secondary/40">
              <Image src={provider.logoUrl} alt={provider.name} fill sizes="64px" className="object-cover" />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-2xl font-semibold text-brand">
              {provider.name.charAt(0)}
            </div>
          )}
          <div>
            <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground sm:text-3xl">
              {provider.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {provider.location}
              {provider.location && " · "}
              {provider.activeListings}{" "}
              {pluralizeSl(provider.activeListings, ["aktiven oglas", "aktivna oglasa", "aktivni oglasi", "aktivnih oglasov"])}
            </p>
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                {provider.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>

        {provider.phone && (
          <div className="w-full sm:w-64">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Kontaktiraj ponudnika
            </p>
            <PhoneReveal phone={provider.phone} />
          </div>
        )}
      </div>

      {provider.description && (
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-foreground/90">{provider.description}</p>
      )}

      <div className="mt-8">
        <ListingGrid listings={providerListings} />
      </div>
    </PageShell>
  );
}
