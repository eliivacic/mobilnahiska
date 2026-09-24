"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Country } from "@/types/listing";
import { LAND_TYPE_LABELS, type LandType } from "@/types/land";
import { createEmptyLandFilterState, type LandFilterState } from "@/lib/filter-land";

const TYPE_OPTIONS = Object.entries(LAND_TYPE_LABELS) as [LandType, string][];

const COUNTRY_OPTIONS: Country[] = ["Slovenija", "Hrvaška", "Italija", "Avstrija", "ostalo"];

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

interface LandFiltersProps {
  filters: LandFilterState;
  onChange: (filters: LandFilterState) => void;
}

export function LandFilters({ filters, onChange }: LandFiltersProps) {
  function update(partial: Partial<LandFilterState>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
          Tip zemljišča
        </h3>
        <div className="mt-3 space-y-2.5">
          {TYPE_OPTIONS.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2.5 text-sm text-foreground">
              <Checkbox
                checked={filters.types.has(value)}
                onCheckedChange={() => update({ types: toggleInSet(filters.types, value) })}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Cena (€)</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="od"
            value={filters.priceMin}
            onChange={(event) => update({ priceMin: event.target.value })}
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder="do"
            value={filters.priceMax}
            onChange={(event) => update({ priceMax: event.target.value })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
          Površina (m²)
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="od"
            value={filters.areaMin}
            onChange={(event) => update({ areaMin: event.target.value })}
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder="do"
            value={filters.areaMax}
            onChange={(event) => update({ areaMax: event.target.value })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Država</h3>
        <div className="mt-3 space-y-2.5">
          {COUNTRY_OPTIONS.map((country) => (
            <label key={country} className="flex items-center gap-2.5 text-sm text-foreground">
              <Checkbox
                checked={filters.countries.has(country)}
                onCheckedChange={() => update({ countries: toggleInSet(filters.countries, country) })}
              />
              {country}
            </label>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => onChange(createEmptyLandFilterState())}>
        Ponastavi filtre
      </Button>
    </div>
  );
}
