"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  onReset?: () => void;
  // Rendered twice at once (desktop sidebar + mobile filter sheet) — a
  // prefix keeps each instance's element ids unique.
  idPrefix?: string;
}

export function LandFilters({ filters, onChange, onReset, idPrefix = "" }: LandFiltersProps) {
  const id = (name: string) => `${idPrefix}${name}`;
  function update(partial: Partial<LandFilterState>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
          Tip zemljišča
        </legend>
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
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Cena (€)</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={id("land-price-min")} className="text-xs font-normal text-muted-foreground">
              Od
            </Label>
            <Input
              id={id("land-price-min")}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              aria-label="Cena od"
              value={filters.priceMin}
              onChange={(event) => update({ priceMin: event.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={id("land-price-max")} className="text-xs font-normal text-muted-foreground">
              Do
            </Label>
            <Input
              id={id("land-price-max")}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              aria-label="Cena do"
              value={filters.priceMax}
              onChange={(event) => update({ priceMax: event.target.value })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
          Površina (m²)
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={id("land-area-min")} className="text-xs font-normal text-muted-foreground">
              Od
            </Label>
            <Input
              id={id("land-area-min")}
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              aria-label="Površina od"
              value={filters.areaMin}
              onChange={(event) => update({ areaMin: event.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={id("land-area-max")} className="text-xs font-normal text-muted-foreground">
              Do
            </Label>
            <Input
              id={id("land-area-max")}
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              aria-label="Površina do"
              value={filters.areaMax}
              onChange={(event) => update({ areaMax: event.target.value })}
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Država</legend>
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
      </fieldset>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => (onReset ? onReset() : onChange(createEmptyLandFilterState()))}
      >
        Ponastavi filtre
      </Button>
    </div>
  );
}
