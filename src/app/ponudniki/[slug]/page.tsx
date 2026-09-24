import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getListingsByProviderSlug, getProviderBySlug, getProviders } from "@/data/listings";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { pluralizeSl } from "@/lib/format";

export function generateStaticParams() {
  return getProviders().map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata(
  props: PageProps<"/ponudniki/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const provider = getProviderBySlug(slug);
  if (!provider) return {};
  return { title: `${provider.name} | mobilnahiska.si` };
}

export default async function ProviderPage(props: PageProps<"/ponudniki/[slug]">) {
  const { slug } = await props.params;
  const provider = getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  const providerListings = getListingsByProviderSlug(slug);

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

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-2xl font-semibold text-brand">
          {provider.name.charAt(0)}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground sm:text-3xl">
            {provider.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {provider.location}, {provider.country} &middot; {provider.activeListings}{" "}
            {pluralizeSl(provider.activeListings, ["aktiven oglas", "aktivna oglasa", "aktivni oglasi", "aktivnih oglasov"])}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <ListingGrid listings={providerListings} />
      </div>
    </PageShell>
  );
}
