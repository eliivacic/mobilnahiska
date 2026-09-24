"use client";
import { PageShell } from "@/components/layout/PageShell";

import { useMemo, useState } from "react";
import { SlidersHorizontal, LandPlot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LandFilters } from "@/components/listings/LandFilters";
import { LandCard } from "@/components/listings/LandCard";
import type { Land } from "@/types/land";
import {
  applyLandFilters,
  createEmptyLandFilterState,
  isLandFilterStateEmpty,
  sortLands,
  type LandFilterState,
  type LandSortKey,
} from "@/lib/filter-land";
import { formatNumber, pluralizeSl } from "@/lib/format";

const SORT_OPTIONS: { value: LandSortKey; label: string }[] = [
  { value: "newest", label: "Najnovejše" },
  { value: "price-asc", label: "Cena naraščajoče" },
  { value: "price-desc", label: "Cena padajoče" },
  { value: "area", label: "Površina" },
];

export function ZemljiscaPageClient({
  allLands,
  initialFilters,
}: {
  allLands: Land[];
  initialFilters: LandFilterState;
}) {
  const [filters, setFilters] = useState<LandFilterState>(initialFilters);
  const [sort, setSort] = useState<LandSortKey>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const results = useMemo(() => {
    return sortLands(applyLandFilters(allLands, filters), sort);
  }, [allLands, filters, sort]);

  const resultCount = results.length;

  return (
    <PageShell className="py-8">
      <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
        Zazidljiva zemljišča
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Skrbno izbrana zazidljiva zemljišča za vaš naslednji gradbeni projekt.
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filtri
              {!isLandFilterStateEmpty(filters) && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
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
              <LandFilters filters={filters} onChange={setFilters} />
              <Button
                className="mt-6 w-full bg-primary text-primary-foreground hover:bg-brand-hover"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Prikaži {formatNumber(resultCount)}{" "}
                {pluralizeSl(resultCount, ["rezultat", "rezultata", "rezultati", "rezultatov"])}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">Sortiraj:</span>
          <Select value={sort} onValueChange={(value) => setSort(value as LandSortKey)}>
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
          <div className="sticky top-28">
            <LandFilters filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div className="min-h-[560px]">
          {results.length === 0 ? (
            <div className="flex flex-col items-center rounded-[14px] border border-dashed border-border py-20 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
                <LandPlot className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">
                Ni zemljišč, ki bi ustrezala izbranim filtrom.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Poskusite spremeniti ali ponastaviti filtre.</p>
              <Button
                variant="outline"
                className="mt-5"
                onClick={() => setFilters(createEmptyLandFilterState())}
              >
                Ponastavi filtre
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {results.map((land) => (
                <LandCard key={land.id} land={land} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
