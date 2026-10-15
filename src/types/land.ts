// Zazidljiva zemljišča ("land") are backed by the same `listing_submissions`
// table as house listings (type = 'zemljisce') — see toLand() in
// src/lib/listings/public.ts. Mirrors the structure of `Listing`
// (src/types/listing.ts) for consistency across the marketplace.

import type { Country } from "@/types/listing";

export type LandType = "stavbno" | "kmetijsko" | "gozdno" | "ostalo";

export interface Land {
  id: string;
  slug: string;
  title: string;
  price: number;
  area: number;
  type: LandType;
  location: string;
  country: Country;
  exclusive?: boolean;
  utilitiesAvailable?: boolean;
  description: string;
  images: string[];
  createdAt?: string;
  // Present for real DB-backed land listings — lets the detail page offer a
  // real inquiry form instead of a plain mailto link.
  contactName?: string;
  contactPhone?: string;
}

// Land listings never store price/m² separately — it's always derived from
// price and area so there's exactly one source of truth for it.
export function pricePerSquareMeter(land: Pick<Land, "price" | "area">): number | null {
  if (!land.area) return null;
  return Math.round(land.price / land.area);
}

export const LAND_TYPE_LABELS: Record<LandType, string> = {
  stavbno: "Stavbno zemljišče",
  kmetijsko: "Kmetijsko zemljišče",
  gozdno: "Gozdno zemljišče",
  ostalo: "Ostalo",
};
