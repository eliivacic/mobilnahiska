"use client";

import { useMemo, useState } from "react";
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
  isFilterStateEmpty,
  sortListings,
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

export function OglasiPageClient({
  allListings,
  initialFilters,
}: {
  allListings: Listing[];
  initialFilters: FilterState;
}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    return sortListings(applyFilters(allListings, filters), sort);
  }, [allListings, filters, sort]);

  const resultCount = results.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[30px] font-light tracking-[-0.01em] text-foreground">
          Mobilne hiške naprodaj
        </h1>
        <p className="text-sm font-medium text-muted-foreground">
          {formatNumber(resultCount)}{" "}
          {pluralizeSl(resultCount, ["rezultat", "rezultata", "rezultati", "rezultatov"])}
        </p>
      </div>

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
              <ListingFilters filters={filters} onChange={setFilters} />
              <Button className="mt-6 w-full bg-brand text-brand-foreground hover:bg-brand-hover" onClick={() => setMobileFiltersOpen(false)}>
                Prikaži {formatNumber(resultCount)}{" "}
                {pluralizeSl(resultCount, ["rezultat", "rezultata", "rezultati", "rezultatov"])}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">Sortiraj:</span>
          <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
            <SelectTrigger className="w-[190px]">
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
          <div className="sticky top-24">
            <ListingFilters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          <ListingGrid listings={results} onResetFilters={() => setFilters(createEmptyFilterState())} />
        </div>
      </div>
    </div>
  );
}
