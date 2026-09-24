import type { Metadata } from "next";
import { lands } from "@/data/land";
import { landFilterStateFromSearchParams } from "@/lib/filter-land";
import { ZemljiscaPageClient } from "./ZemljiscaPageClient";

export const metadata: Metadata = {
  title: "Zazidljiva zemljišča | mobilnahiska.si",
  description: "Zazidljiva zemljišča za mobilne in modularne hiške na mobilnahiska.si.",
};

// Test/placeholder listings — see src/data/land.ts.
export default async function ZemljiscaPage(props: PageProps<"/zemljisca">) {
  const searchParams = await props.searchParams;

  const initialFilters = landFilterStateFromSearchParams({
    landType: typeof searchParams.landType === "string" ? searchParams.landType : undefined,
    priceMax: typeof searchParams.priceMax === "string" ? searchParams.priceMax : undefined,
    priceMin: typeof searchParams.priceMin === "string" ? searchParams.priceMin : undefined,
    areaMin: typeof searchParams.areaMin === "string" ? searchParams.areaMin : undefined,
    areaMax: typeof searchParams.areaMax === "string" ? searchParams.areaMax : undefined,
    country: typeof searchParams.country === "string" ? searchParams.country : undefined,
  });

  return (
    <ZemljiscaPageClient
      key={JSON.stringify(searchParams)}
      allLands={lands}
      initialFilters={initialFilters}
    />
  );
}
