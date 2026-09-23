import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchBar } from "@/components/listings/SearchBar";
import { QuickCategories } from "@/components/listings/QuickCategories";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { SellerPromo } from "@/components/listings/SellerPromo";
import { CategoryGrid } from "@/components/listings/CategoryGrid";
import { ProviderGrid } from "@/components/listings/ProviderGrid";
import { getFeaturedListings, getLatestListings, getProviders, listings } from "@/data/listings";
import { formatNumber, pluralizeSl } from "@/lib/format";

export default function Home() {
  const featured = getFeaturedListings();
  const latest = getLatestListings(10);
  const providers = getProviders();
  const count = listings.length;

  return (
    <div className="flex-1">
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Mobilne hiške naprodaj
        </h1>
        <p className="mt-1.5 text-sm font-medium text-muted-foreground">
          {formatNumber(count)} {pluralizeSl(count, ["oglas", "oglasa", "oglasi", "oglasov"])}
        </p>

        <div className="mt-6">
          <SearchBar />
        </div>

        <div className="mt-4">
          <QuickCategories />
        </div>
      </section>

      <section className="mt-10 bg-secondary/25 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
              Izpostavljene hiške
            </h2>
            <Link
              href="/oglasi"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Vse izpostavljene
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-5">
            <ListingGrid listings={featured} spacious />
          </div>
        </div>
      </section>

      <SellerPromo />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">Najnovejši oglasi</h2>
          <Link
            href="/oglasi"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Vsi oglasi
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-4">
          <ListingGrid listings={latest} dense />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
          Brskaj po kategorijah
        </h2>
        <div className="mt-5">
          <CategoryGrid />
        </div>
      </section>

      {providers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
            Ponudniki na mobilnahiska.si
          </h2>
          <div className="mt-5">
            <ProviderGrid providers={providers} />
          </div>
        </section>
      )}
    </div>
  );
}
