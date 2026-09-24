import type { Country } from "@/types/listing";
import type { Land, LandType } from "@/types/land";

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

export function landFilterStateFromSearchParams(
  params: Record<string, string | undefined>
): LandFilterState {
  const state = createEmptyLandFilterState();

  if (params.landType) {
    state.types.add(params.landType as LandType);
  }
  if (params.priceMin) state.priceMin = params.priceMin;
  if (params.priceMax) state.priceMax = params.priceMax;
  if (params.areaMin) state.areaMin = params.areaMin;
  if (params.areaMax) state.areaMax = params.areaMax;
  if (params.country) {
    state.countries.add(params.country as Country);
  }

  return state;
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

export function applyLandFilters(lands: Land[], filters: LandFilterState): Land[] {
  const priceMin = filters.priceMin ? Number(filters.priceMin) : undefined;
  const priceMax = filters.priceMax ? Number(filters.priceMax) : undefined;
  const areaMin = filters.areaMin ? Number(filters.areaMin) : undefined;
  const areaMax = filters.areaMax ? Number(filters.areaMax) : undefined;

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
