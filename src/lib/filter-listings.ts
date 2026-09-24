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
  featuredOnly: boolean;
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
    featuredOnly: false,
  };
}

const HOUSE_TYPES: HouseType[] = ["mobilna", "modularna"];
const CONDITIONS: Condition[] = ["nova", "rabljena"];
const COUNTRIES: Country[] = ["Slovenija", "Hrvaška", "Italija", "Avstrija", "ostalo"];

function parseList<T extends string>(value: string | undefined, allowed: readonly T[]): Set<T> {
  if (!value) return new Set();
  const allowedSet = new Set<string>(allowed);
  return new Set(value.split(",").filter((item): item is T => allowedSet.has(item)));
}

function parseIntList(value: string | undefined, allowed: readonly number[]): Set<number> {
  if (!value) return new Set();
  const allowedSet = new Set(allowed);
  return new Set(
    value
      .split(",")
      .map((item) => Number(item))
      .filter((item) => allowedSet.has(item))
  );
}

// Reads filter state from a plain query-param record (used both server-side,
// from Next.js `searchParams`, and client-side, from `useSearchParams()`).
export function filterStateFromSearchParams(params: Record<string, string | undefined>): FilterState {
  const state = createEmptyFilterState();

  state.types = parseList(params.type, HOUSE_TYPES);
  state.conditions = parseList(params.condition, CONDITIONS);
  state.countries = parseList(params.country, COUNTRIES);
  state.bedrooms = parseIntList(params.bedrooms, [1, 2, 3, 4]);

  if (params.priceMin) state.priceMin = params.priceMin;
  if (params.priceMax) state.priceMax = params.priceMax;
  if (params.areaMin) state.areaMin = params.areaMin;
  if (params.areaMax) state.areaMax = params.areaMax;
  if (params.yearMin) state.yearMin = params.yearMin;
  if (params.yearMax) state.yearMax = params.yearMax;
  if (params.delivery === "true") state.deliveryOnly = true;
  if (params.featured === "true") state.featuredOnly = true;

  return state;
}

// Serializes filter state (+ sort) back into query params — the inverse of
// filterStateFromSearchParams. Omits empty/default values so the URL stays
// clean (e.g. `/oglasi` instead of `/oglasi?type=&condition=&...`).
export function filterStateToSearchParams(filters: FilterState, sort: SortKey): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.types.size > 0) params.set("type", Array.from(filters.types).join(","));
  if (filters.conditions.size > 0) params.set("condition", Array.from(filters.conditions).join(","));
  if (filters.countries.size > 0) params.set("country", Array.from(filters.countries).join(","));
  if (filters.bedrooms.size > 0) params.set("bedrooms", Array.from(filters.bedrooms).sort().join(","));
  if (filters.priceMin) params.set("priceMin", filters.priceMin);
  if (filters.priceMax) params.set("priceMax", filters.priceMax);
  if (filters.areaMin) params.set("areaMin", filters.areaMin);
  if (filters.areaMax) params.set("areaMax", filters.areaMax);
  if (filters.yearMin) params.set("yearMin", filters.yearMin);
  if (filters.yearMax) params.set("yearMax", filters.yearMax);
  if (filters.deliveryOnly) params.set("delivery", "true");
  if (filters.featuredOnly) params.set("featured", "true");
  if (sort !== "newest") params.set("sort", sort);

  return params;
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
    !filters.deliveryOnly &&
    !filters.featuredOnly
  );
}

// Returns an error message when a range is invalid (negative, or "od" >
// "do"), or null when the range is fine to apply. Used by both the home
// search and the listing pages so validation stays consistent everywhere.
export function validateRange(min: string, max: string, label: string): string | null {
  const minValue = min ? Number(min) : undefined;
  const maxValue = max ? Number(max) : undefined;

  if (minValue !== undefined && minValue < 0) return `${label}: vrednost "od" ne sme biti negativna.`;
  if (maxValue !== undefined && maxValue < 0) return `${label}: vrednost "do" ne sme biti negativna.`;
  if (minValue !== undefined && maxValue !== undefined && minValue > maxValue) {
    return `${label}: vrednost "od" ne sme biti večja od vrednosti "do".`;
  }
  return null;
}

export function validateFilterState(filters: FilterState): string[] {
  const errors: string[] = [];
  const priceError = validateRange(filters.priceMin, filters.priceMax, "Cena");
  if (priceError) errors.push(priceError);
  const areaError = validateRange(filters.areaMin, filters.areaMax, "Površina");
  if (areaError) errors.push(areaError);
  const yearError = validateRange(filters.yearMin, filters.yearMax, "Leto izdelave");
  if (yearError) errors.push(yearError);
  return errors;
}

export function applyFilters(listings: Listing[], filters: FilterState): Listing[] {
  // An invalid range (od > do, or negative) must never silently produce an
  // empty result — surface it as "no valid filter applied" for that field
  // instead of filtering anything out.
  const priceRangeValid = !validateRange(filters.priceMin, filters.priceMax, "Cena");
  const areaRangeValid = !validateRange(filters.areaMin, filters.areaMax, "Površina");
  const yearRangeValid = !validateRange(filters.yearMin, filters.yearMax, "Leto izdelave");

  const priceMin = priceRangeValid && filters.priceMin ? Number(filters.priceMin) : undefined;
  const priceMax = priceRangeValid && filters.priceMax ? Number(filters.priceMax) : undefined;
  const areaMin = areaRangeValid && filters.areaMin ? Number(filters.areaMin) : undefined;
  const areaMax = areaRangeValid && filters.areaMax ? Number(filters.areaMax) : undefined;
  const yearMin = yearRangeValid && filters.yearMin ? Number(filters.yearMin) : undefined;
  const yearMax = yearRangeValid && filters.yearMax ? Number(filters.yearMax) : undefined;

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
    if (filters.featuredOnly && !listing.featured) return false;
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

export function isSortKey(value: string | null): value is SortKey {
  return value === "newest" || value === "price-asc" || value === "price-desc" || value === "area";
}
