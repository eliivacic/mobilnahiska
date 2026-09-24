import type { Land } from "@/types/land";
import { LAND_IMAGES } from "@/data/images";

// Test/placeholder listings for zazidljiva zemljišča, requested to preview
// the category UI before a real data source exists. Replace with real
// listings (or wire up a backend) before launch — see
// src/components/listings/ExclusiveLands.tsx and src/app/zemljisca/page.tsx.
export const lands: Land[] = [
  {
    id: "1",
    slug: "zazidljivo-zemljisce-bled-750m2",
    title: "Zazidljivo zemljišče Bled",
    price: 189000,
    area: 750,
    type: "stavbno",
    location: "Bled",
    country: "Slovenija",
    exclusive: true,
    utilitiesAvailable: true,
    description:
      "Mirna, sončna parcela z razgledom na okoliške gore, le nekaj minut od Blejskega jezera. Vsi komunalni priključki so speljani do meje zemljišča.",
    images: [LAND_IMAGES[0]],
  },
  {
    id: "2",
    slug: "zazidljivo-zemljisce-kranjska-gora-1100m2",
    title: "Zazidljivo zemljišče Kranjska Gora",
    price: 245000,
    area: 1100,
    type: "stavbno",
    location: "Kranjska Gora",
    country: "Slovenija",
    exclusive: true,
    utilitiesAvailable: true,
    description:
      "Prostorna parcela ob gozdnem robu, primerna za mobilno ali modularno hišo. Dostopna cesta urejena vse leto, elektrika na meji parcele.",
    images: [LAND_IMAGES[1]],
  },
  {
    id: "3",
    slug: "zazidljivo-zemljisce-novo-mesto-620m2",
    title: "Zazidljivo zemljišče Novo mesto",
    price: 98000,
    area: 620,
    type: "stavbno",
    location: "Novo mesto",
    country: "Slovenija",
    exclusive: true,
    utilitiesAvailable: true,
    description:
      "Ravna parcela na robu mirnega naselja, primerna za manjšo mobilno hišo ali vikend. Bližina šole, trgovine in avtoceste.",
    images: [LAND_IMAGES[2]],
  },
  {
    id: "4",
    slug: "kmetijsko-zemljisce-ptuj-4200m2",
    title: "Kmetijsko zemljišče Ptuj",
    price: 42000,
    area: 4200,
    type: "kmetijsko",
    location: "Ptuj",
    country: "Slovenija",
    description:
      "Obdelovalno zemljišče v ravninskem delu Dravskega polja, primerno za kmetijsko dejavnost ali kot naložba.",
    images: [LAND_IMAGES[3]],
  },
];

export function getLands(): Land[] {
  return lands;
}

export function getExclusiveLands(count = 4): Land[] {
  return lands.filter((land) => land.exclusive).slice(0, count);
}

export function getLandBySlug(slug: string): Land | undefined {
  return lands.find((land) => land.slug === slug);
}
