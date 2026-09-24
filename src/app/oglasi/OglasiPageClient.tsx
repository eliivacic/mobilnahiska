"use client";
import { PageShell } from "@/components/layout/PageShell";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { ListingGrid } from "@/components/listings/ListingGrid";
import type { Listing } from "@/types/listing";
import {
  applyFilters,
  createEmptyFilterState,
  filterStateFromSearchParams,
  filterStateToSearchParams,
  isFilterStateEmpty,
  isSortKey,
  sortListings,
  validateFilterState,
  type FilterState,
  type SortKey,
} from "@/lib/filter-listings";
import { formatNumber, pluralizeSl } from "@/lib/format";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Najnovejše" },
  { value: "price-asc", label: "Cena naraščajoče" },
  { value: "price-desc", label: "Cena padajoče" },
  { value: "area", label: "Površina" },
];

export function OglasiPageClient({ allListings }: { allListings: Listing[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(
    () =>
      filterStateFromSearchParams({
        type: searchParams.get("type") ?? undefined,
        condition: searchParams.get("condition") ?? undefined,
        country: searchParams.get("country") ?? undefined,
        bedrooms: searchParams.get("bedrooms") ?? undefined,
        priceMin: searchParams.get("priceMin") ?? undefined,
        priceMax: searchParams.get("priceMax") ?? undefined,
        areaMin: searchParams.get("areaMin") ?? undefined,
        areaMax: searchParams.get("areaMax") ?? undefined,
        yearMin: searchParams.get("yearMin") ?? undefined,
        yearMax: searchParams.get("yearMax") ?? undefined,
        delivery: searchParams.get("delivery") ?? undefined,
        featured: searchParams.get("featured") ?? undefined,
      }),
    [searchParams]
  );

  const sortParam = searchParams.get("sort");
  const sort: SortKey = isSortKey(sortParam) ? sortParam : "newest";

  function applyState(nextFilters: FilterState, nextSort: SortKey) {
    const params = filterStateToSearchParams(nextFilters, nextSort);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const validationErrors = useMemo(() => validateFilterState(filters), [filters]);

  const results = useMemo(() => {
    return sortListings(applyFilters(allListings, filters), sort);
  }, [allListings, filters, sort]);

  const resultCount = results.length;

  const heading = filters.featuredOnly
    ? "Izpostavljeni oglasi"
    : filters.types.size === 1
      ? filters.types.has("mobilna")
        ? "Mobilne hiške naprodaj"
        : "Modularne hiše naprodaj"
      : "Mobilne in modularne hiške naprodaj";

  return (
    <PageShell className="py-8">
      <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
        {heading}
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Prebrskajte oglase mobilnih in modularnih hišk, novih in rabljenih, po vsej Sloveniji in regiji.
      </p>

      {validationErrors.length > 0 && (
        <div role="alert" className="mt-4 space-y-1 rounded-[10px] bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {validationErrors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filtri
              {!isFilterStateEmpty(filters) && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-semibold text-brand-foreground">
                  •
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-left">Filtri</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <ListingFilters
                filters={filters}
                onChange={(next) => applyState(next, sort)}
                onReset={() => applyState(createEmptyFilterState(), "newest")}
                idPrefix="mobile-"
              />
              <Button
                className="mt-6 w-full bg-brand text-brand-foreground hover:bg-brand-hover"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Prikaži {formatNumber(resultCount)}{" "}
                {pluralizeSl(resultCount, ["rezultat", "rezultata", "rezultati", "rezultatov"])}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="oglasi-sort" className="hidden text-sm text-muted-foreground sm:inline">
            Sortiraj:
          </label>
          <Select value={sort} onValueChange={(value) => applyState(filters, value as SortKey)}>
            <SelectTrigger id="oglasi-sort" className="w-[190px]" aria-label="Razvrsti oglase">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[288px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <ListingFilters filters={filters} onChange={(next) => applyState(next, sort)} onReset={() => applyState(createEmptyFilterState(), "newest")} />
          </div>
        </aside>

        <div className="min-h-[560px]">
          <ListingGrid
            listings={results}
            variant="narrow"
            onResetFilters={() => applyState(createEmptyFilterState(), "newest")}
          />
        </div>
      </div>
    </PageShell>
  );
}
