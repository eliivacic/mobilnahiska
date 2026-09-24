import type { Condition, Country, HouseType, Listing } from "@/types/listing";

export type SortKey = "newest" | "price-asc" | "price-desc" | "area";

export interface FilterState {
  types: Set<HouseType>;
  conditions: Set<Condition>;
  priceMin: string;
  priceMax: string;
  areaMin: string;
  areaMax: string;
  bedrooms: Set<number>;
  yearMin: string;
  yearMax: string;
  countries: Set<Country>;
  deliveryOnly: boolean;
}

export function createEmptyFilterState(): FilterState {
  return {
    types: new Set(),
    conditions: new Set(),
    priceMin: "",
    priceMax: "",
    areaMin: "",
    areaMax: "",
    bedrooms: new Set(),
    yearMin: "",
    yearMax: "",
    countries: new Set(),
    deliveryOnly: false,
  };
}

export function filterStateFromSearchParams(
  params: Record<string, string | undefined>
): FilterState {
  const state = createEmptyFilterState();

  if (params.type === "mobilna" || params.type === "modularna") {
    state.types.add(params.type);
  }
  if (params.condition === "nova" || params.condition === "rabljena") {
    state.conditions.add(params.condition);
  }
  if (params.priceMax) state.priceMax = params.priceMax;
  if (params.priceMin) state.priceMin = params.priceMin;
  if (params.areaMin) state.areaMin = params.areaMin;
  if (params.areaMax) state.areaMax = params.areaMax;

  if (params.bedroomsMin) {
    const min = Number(params.bedroomsMin);
    for (let value = min; value <= 4; value += 1) {
      state.bedrooms.add(value);
    }
  }
  if (params.delivery === "true") state.deliveryOnly = true;
  if (params.country) {
    state.countries.add(params.country as Country);
  }

  return state;
}

export function isFilterStateEmpty(filters: FilterState): boolean {
  return (
    filters.types.size === 0 &&
    filters.conditions.size === 0 &&
    filters.bedrooms.size === 0 &&
    filters.countries.size === 0 &&
    !filters.priceMin &&
    !filters.priceMax &&
    !filters.areaMin &&
    !filters.areaMax &&
    !filters.yearMin &&
    !filters.yearMax &&
    !filters.deliveryOnly
  );
}

export function applyFilters(listings: Listing[], filters: FilterState): Listing[] {
  const priceMin = filters.priceMin ? Number(filters.priceMin) : undefined;
  const priceMax = filters.priceMax ? Number(filters.priceMax) : undefined;
  const areaMin = filters.areaMin ? Number(filters.areaMin) : undefined;
  const areaMax = filters.areaMax ? Number(filters.areaMax) : undefined;
  const yearMin = filters.yearMin ? Number(filters.yearMin) : undefined;
  const yearMax = filters.yearMax ? Number(filters.yearMax) : undefined;

  return listings.filter((listing) => {
    if (filters.types.size > 0 && !filters.types.has(listing.type)) return false;
    if (filters.conditions.size > 0 && !filters.conditions.has(listing.condition)) return false;
    if (priceMin !== undefined && listing.price < priceMin) return false;
    if (priceMax !== undefined && listing.price > priceMax) return false;
    if (areaMin !== undefined && listing.area < areaMin) return false;
    if (areaMax !== undefined && listing.area > areaMax) return false;
    if (yearMin !== undefined && listing.year < yearMin) return false;
    if (yearMax !== undefined && listing.year > yearMax) return false;
    if (filters.countries.size > 0 && !filters.countries.has(listing.country)) return false;
    if (filters.deliveryOnly && !listing.deliveryAvailable) return false;
    if (filters.bedrooms.size > 0) {
      const matchesBedrooms = Array.from(filters.bedrooms).some((value) =>
        value >= 4 ? listing.bedrooms >= 4 : listing.bedrooms === value
      );
      if (!matchesBedrooms) return false;
    }
    return true;
  });
}

export function sortListings(listings: Listing[], sort: SortKey): Listing[] {
  const sorted = [...listings];
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
