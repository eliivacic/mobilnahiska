// Zazidljiva zemljišča ("land") don't have a data source yet — there is no
// backend/database in this project. This type documents the shape the UI
// already expects, so a future API/data layer can be dropped in without
// touching the components. Mirrors the structure of `Listing`
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
}

export const LAND_TYPE_LABELS: Record<LandType, string> = {
  stavbno: "Stavbno zemljišče",
  kmetijsko: "Kmetijsko zemljišče",
  gozdno: "Gozdno zemljišče",
  ostalo: "Ostalo",
};
