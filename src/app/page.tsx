import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { SearchBar } from "@/components/listings/SearchBar";
import { ExploreCategories } from "@/components/listings/ExploreCategories";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { LatestListingsTabs } from "@/components/listings/LatestListingsTabs";
import { ExclusiveLands } from "@/components/listings/ExclusiveLands";
import { SellerCta } from "@/components/listings/SellerCta";
import { ProviderGrid } from "@/components/listings/ProviderGrid";
import { GuidesPreview } from "@/components/guides/GuidesPreview";
import {
  getHomepageFeaturedListings,
  getLatestListings,
  getPublishedLands,
  getExclusiveLands,
} from "@/lib/listings/public";
import { getProviders } from "@/lib/providers/public";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, providers, exclusiveLands, allLands, latestListings] = await Promise.all([
    getHomepageFeaturedListings(),
    getProviders(),
    getExclusiveLands(),
    getPublishedLands(),
    getLatestListings(),
  ]);

  return (
    <div className="flex-1">
      <PageShell className="pt-8">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl lg:text-5xl">
          Poiščite svoj novi prostor.
        </h1>
        <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">
          Mobilne in modularne hiške ter zemljišča na enem mestu.
        </p>

        <div className="mt-7">
          <SearchBar />
        </div>
      </PageShell>

      <PageShell className="py-12">
        <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
          Raziščite ponudbo
        </h2>
        <div className="mt-5">
          <ExploreCategories />
        </div>
      </PageShell>

      {featured.length > 0 && (
        <PageShell className="py-12">
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
              Izpostavljena ponudba
            </h2>
            <Link
              href="/oglasi?featured=true"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Vse izpostavljene
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-5">
            <ListingGrid listings={featured} variant="spacious" />
          </div>
        </PageShell>
      )}

      <ExclusiveLands lands={exclusiveLands} />

      <PageShell className="py-12">
        <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
          Najnovejši oglasi
        </h2>
        <div className="mt-4">
          <LatestListingsTabs listings={latestListings} lands={allLands} />
        </div>
      </PageShell>

      <GuidesPreview />

      {providers.length > 0 && (
        <PageShell className="pb-12">
          <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
            Preverjeni ponudniki
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Poiščite ponudnike mobilnih in modularnih hišk na enem mestu.
          </p>
          <div className="mt-5">
            <ProviderGrid providers={providers} />
          </div>
        </PageShell>
      )}

      <SellerCta />
    </div>
  );
}
