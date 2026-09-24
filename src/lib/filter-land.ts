import type { Country } from "@/types/listing";
import type { Land, LandType } from "@/types/land";
import { validateRange } from "@/lib/filter-listings";

export type LandSortKey = "newest" | "price-asc" | "price-desc" | "area";

export interface LandFilterState {
  types: Set<LandType>;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  countries: Set<Country>;
}

export function createEmptyLandFilterState(): LandFilterState {
  return {
    types: new Set(),
    priceMin: "",
    priceMax: "",
    areaMin: "",
    areaMax: "",
    countries: new Set(),
  };
}

const LAND_TYPES: LandType[] = ["stavbno", "kmetijsko", "gozdno", "ostalo"];
const COUNTRIES: Country[] = ["Slovenija", "Hrvaška", "Italija", "Avstrija", "ostalo"];

function parseList<T extends string>(value: string | undefined, allowed: readonly T[]): Set<T> {
  if (!value) return new Set();
  const allowedSet = new Set<string>(allowed);
  return new Set(value.split(",").filter((item): item is T => allowedSet.has(item)));
}

export function landFilterStateFromSearchParams(params: Record<string, string | undefined>): LandFilterState {
  const state = createEmptyLandFilterState();

  state.types = parseList(params.landType, LAND_TYPES);
  state.countries = parseList(params.country, COUNTRIES);

  if (params.priceMin) state.priceMin = params.priceMin;
  if (params.priceMax) state.priceMax = params.priceMax;
  if (params.areaMin) state.areaMin = params.areaMin;
  if (params.areaMax) state.areaMax = params.areaMax;

  return state;
}

export function landFilterStateToSearchParams(filters: LandFilterState, sort: LandSortKey): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.types.size > 0) params.set("landType", Array.from(filters.types).join(","));
  if (filters.countries.size > 0) params.set("country", Array.from(filters.countries).join(","));
  if (filters.priceMin) params.set("priceMin", filters.priceMin);
  if (filters.priceMax) params.set("priceMax", filters.priceMax);
  if (filters.areaMin) params.set("areaMin", filters.areaMin);
  if (filters.areaMax) params.set("areaMax", filters.areaMax);
  if (sort !== "newest") params.set("sort", sort);

  return params;
}

export function isLandFilterStateEmpty(filters: LandFilterState): boolean {
  return (
    filters.types.size === 0 &&
    filters.countries.size === 0 &&
    !filters.priceMin &&
    !filters.priceMax &&
    !filters.areaMin &&
    !filters.areaMax
  );
}

export function validateLandFilterState(filters: LandFilterState): string[] {
  const errors: string[] = [];
  const priceError = validateRange(filters.priceMin, filters.priceMax, "Cena");
  if (priceError) errors.push(priceError);
  const areaError = validateRange(filters.areaMin, filters.areaMax, "Površina");
  if (areaError) errors.push(areaError);
  return errors;
}

export function applyLandFilters(lands: Land[], filters: LandFilterState): Land[] {
  const priceRangeValid = !validateRange(filters.priceMin, filters.priceMax, "Cena");
  const areaRangeValid = !validateRange(filters.areaMin, filters.areaMax, "Površina");

  const priceMin = priceRangeValid && filters.priceMin ? Number(filters.priceMin) : undefined;
  const priceMax = priceRangeValid && filters.priceMax ? Number(filters.priceMax) : undefined;
  const areaMin = areaRangeValid && filters.areaMin ? Number(filters.areaMin) : undefined;
  const areaMax = areaRangeValid && filters.areaMax ? Number(filters.areaMax) : undefined;

  return lands.filter((land) => {
    if (filters.types.size > 0 && !filters.types.has(land.type)) return false;
    if (priceMin !== undefined && land.price < priceMin) return false;
    if (priceMax !== undefined && land.price > priceMax) return false;
    if (areaMin !== undefined && land.area < areaMin) return false;
    if (areaMax !== undefined && land.area > areaMax) return false;
    if (filters.countries.size > 0 && !filters.countries.has(land.country)) return false;
    return true;
  });
}

export function sortLands(lands: Land[], sort: LandSortKey): Land[] {
  const sorted = [...lands];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "area":
      return sorted.sort((a, b) => b.area - a.area);
    case "newest":
    default:
      return sorted.sort((a, b) => Number(b.id) - Number(a.id));
  }
}

export function isLandSortKey(value: string | null): value is LandSortKey {
  return value === "newest" || value === "price-asc" || value === "price-desc" || value === "area";
}
