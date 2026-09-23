"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Condition, Country, HouseType } from "@/types/listing";
import { createEmptyFilterState, type FilterState } from "@/lib/filter-listings";

const TYPE_OPTIONS: { value: HouseType; label: string }[] = [
  { value: "mobilna", label: "Mobilna hiška" },
  { value: "modularna", label: "Modularna hiša" },
];

const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: "nova", label: "Nova" },
  { value: "rabljena", label: "Rabljena" },
];

const BEDROOM_OPTIONS = [1, 2, 3, 4];

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

interface ListingFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function ListingFilters({ filters, onChange }: ListingFiltersProps) {
  function update(partial: Partial<FilterState>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-7">
      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Tip</h3>
        <div className="mt-3 space-y-2.5">
          {TYPE_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2.5 text-sm text-foreground">
              <Checkbox
                checked={filters.types.has(option.value)}
                onCheckedChange={() => update({ types: toggleInSet(filters.types, option.value) })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Stanje</h3>
        <div className="mt-3 space-y-2.5">
          {CONDITION_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2.5 text-sm text-foreground">
              <Checkbox
                checked={filters.conditions.has(option.value)}
                onCheckedChange={() =>
                  update({ conditions: toggleInSet(filters.conditions, option.value) })
                }
              />
              {option.label}
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
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Površina (m²)</h3>
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
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Spalnice</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((count) => {
            const active = filters.bedrooms.has(count);
            return (
              <button
                key={count}
                type="button"
                onClick={() => update({ bedrooms: toggleInSet(filters.bedrooms, count) })}
                className={`flex h-9 min-w-9 items-center justify-center rounded-[4px] border px-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border text-foreground hover:border-foreground/40"
                }`}
              >
                {count === 4 ? "4+" : count}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Leto izdelave</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="od"
            value={filters.yearMin}
            onChange={(event) => update({ yearMin: event.target.value })}
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder="do"
            value={filters.yearMax}
            onChange={(event) => update({ yearMax: event.target.value })}
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

      <div>
        <h3 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Dostava</h3>
        <div className="mt-3">
          <label className="flex items-center gap-2.5 text-sm text-foreground">
            <Checkbox
              checked={filters.deliveryOnly}
              onCheckedChange={(checked) => update({ deliveryOnly: checked === true })}
            />
            Dostava v Slovenijo
          </label>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => onChange(createEmptyFilterState())}>
        Ponastavi filtre
      </Button>
    </div>
  );
}
