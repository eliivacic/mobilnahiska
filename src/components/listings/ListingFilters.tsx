"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const CURRENT_YEAR = new Date().getFullYear();

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
  onReset?: () => void;
  // This component renders twice at once on listing pages (desktop sidebar
  // + mobile filter sheet) — a prefix keeps each instance's element ids
  // unique so <label htmlFor> stays valid and unambiguous.
  idPrefix?: string;
}

export function ListingFilters({ filters, onChange, onReset, idPrefix = "" }: ListingFiltersProps) {
  function update(partial: Partial<FilterState>) {
    onChange({ ...filters, ...partial });
  }
  const id = (name: string) => `${idPrefix}${name}`;

  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Tip</legend>
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
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Stanje</legend>
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
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Cena (€)</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={id("price-min")} className="text-xs font-normal text-muted-foreground">
              Od
            </Label>
            <Input
              id={id("price-min")}
              name="priceMin"
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
            <Label htmlFor={id("price-max")} className="text-xs font-normal text-muted-foreground">
              Do
            </Label>
            <Input
              id={id("price-max")}
              name="priceMax"
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
            <Label htmlFor={id("area-min")} className="text-xs font-normal text-muted-foreground">
              Od
            </Label>
            <Input
              id={id("area-min")}
              name="areaMin"
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
            <Label htmlFor={id("area-max")} className="text-xs font-normal text-muted-foreground">
              Do
            </Label>
            <Input
              id={id("area-max")}
              name="areaMax"
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
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Spalnice</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((count) => {
            const active = filters.bedrooms.has(count);
            return (
              <button
                key={count}
                type="button"
                aria-pressed={active}
                onClick={() => update({ bedrooms: toggleInSet(filters.bedrooms, count) })}
                className={`flex h-9 min-w-9 items-center justify-center rounded-[8px] border px-2.5 text-sm font-medium transition-[transform,background-color,border-color,color] duration-150 ease-out active:scale-[0.97] ${
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
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">
          Leto izdelave
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={id("year-min")} className="text-xs font-normal text-muted-foreground">
              Od
            </Label>
            <Input
              id={id("year-min")}
              name="yearMin"
              type="number"
              inputMode="numeric"
              min={1900}
              max={CURRENT_YEAR + 1}
              step={1}
              aria-label="Leto izdelave od"
              value={filters.yearMin}
              onChange={(event) => update({ yearMin: event.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={id("year-max")} className="text-xs font-normal text-muted-foreground">
              Do
            </Label>
            <Input
              id={id("year-max")}
              name="yearMax"
              type="number"
              inputMode="numeric"
              min={1900}
              max={CURRENT_YEAR + 1}
              step={1}
              aria-label="Leto izdelave do"
              value={filters.yearMax}
              onChange={(event) => update({ yearMax: event.target.value })}
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

      <fieldset>
        <legend className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Dostava</legend>
        <div className="mt-3">
          <label className="flex items-center gap-2.5 text-sm text-foreground">
            <Checkbox
              checked={filters.deliveryOnly}
              onCheckedChange={(checked) => update({ deliveryOnly: checked === true })}
            />
            Dostava v Slovenijo
          </label>
        </div>
      </fieldset>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => (onReset ? onReset() : onChange(createEmptyFilterState()))}
      >
        Ponastavi filtre
      </Button>
    </div>
  );
}
