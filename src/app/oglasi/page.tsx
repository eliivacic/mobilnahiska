import type { Metadata } from "next";
import { listings } from "@/data/listings";
import { filterStateFromSearchParams } from "@/lib/filter-listings";
import { OglasiPageClient } from "./OglasiPageClient";

export const metadata: Metadata = {
  title: "Mobilne hiške naprodaj | mobilnahiska.si",
  description: "Prebrskajte oglase mobilnih in modularnih hišk, novih in rabljenih, po vsej Sloveniji in regiji.",
};

export default async function OglasiPage(props: PageProps<"/oglasi">) {
  const searchParams = await props.searchParams;

  const initialFilters = filterStateFromSearchParams({
    type: typeof searchParams.type === "string" ? searchParams.type : undefined,
    condition: typeof searchParams.condition === "string" ? searchParams.condition : undefined,
    priceMax: typeof searchParams.priceMax === "string" ? searchParams.priceMax : undefined,
    priceMin: typeof searchParams.priceMin === "string" ? searchParams.priceMin : undefined,
    areaMin: typeof searchParams.areaMin === "string" ? searchParams.areaMin : undefined,
    areaMax: typeof searchParams.areaMax === "string" ? searchParams.areaMax : undefined,
    bedroomsMin: typeof searchParams.bedroomsMin === "string" ? searchParams.bedroomsMin : undefined,
    delivery: typeof searchParams.delivery === "string" ? searchParams.delivery : undefined,
    country: typeof searchParams.country === "string" ? searchParams.country : undefined,
  });

  // The header's "Mobilne hiške" / "Modularne hiše" links both point at this
  // same route with a different `type` query param, so Next.js reuses the
  // existing client component instance instead of remounting it — without a
  // key tied to the query string, useState(initialFilters) below would keep
  // stale filters from the first visit. Forcing a remount here keeps
  // navigation between these links in sync with the URL, every time.
  return (
    <OglasiPageClient
      key={JSON.stringify(searchParams)}
      allListings={listings}
      initialFilters={initialFilters}
    />
  );
}
