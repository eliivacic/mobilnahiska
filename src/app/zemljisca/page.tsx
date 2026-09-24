import type { Metadata } from "next";
import { Suspense } from "react";
import { lands } from "@/data/land";
import { LAND_TYPE_LABELS, type LandType } from "@/types/land";
import { ZemljiscaPageClient } from "./ZemljiscaPageClient";

const LAND_TITLES: Record<LandType, string> = {
  stavbno: "Zazidljiva zemljišča naprodaj | mobilnahiska.si",
  kmetijsko: "Kmetijska zemljišča naprodaj | mobilnahiska.si",
  gozdno: "Gozdna zemljišča naprodaj | mobilnahiska.si",
  ostalo: "Ostala zemljišča naprodaj | mobilnahiska.si",
};

const LAND_DESCRIPTIONS: Record<LandType, string> = {
  stavbno: "Skrbno izbrana zazidljiva zemljišča za vaš naslednji gradbeni projekt.",
  kmetijsko: "Kmetijska zemljišča za nadaljnjo obdelavo ali naložbo.",
  gozdno: "Gozdna zemljišča po vsej Sloveniji in regiji.",
  ostalo: "Zemljišča ostalih namenskih rab po vsej Sloveniji in regiji.",
};

const DEFAULT_TITLE = "Zemljišča naprodaj | mobilnahiska.si";
const DEFAULT_DESCRIPTION = "Skrbno izbrana zemljišča za vaš naslednji projekt, po vsej Sloveniji in regiji.";

function isLandType(value: string | undefined): value is LandType {
  return !!value && value in LAND_TYPE_LABELS;
}

export async function generateMetadata(props: PageProps<"/zemljisca">): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const landType = typeof searchParams.landType === "string" ? searchParams.landType : undefined;
  const canonicalPath = isLandType(landType) ? `/zemljisca?landType=${landType}` : "/zemljisca";
  const description = isLandType(landType) ? LAND_DESCRIPTIONS[landType] : DEFAULT_DESCRIPTION;

  return {
    title: isLandType(landType) ? LAND_TITLES[landType] : DEFAULT_TITLE,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: isLandType(landType) ? LAND_TITLES[landType] : DEFAULT_TITLE,
      description,
      url: canonicalPath,
    },
  };
}

// Test/placeholder listings — see src/data/land.ts.
export default function ZemljiscaPage() {
  return (
    <Suspense>
      <ZemljiscaPageClient allLands={lands} />
    </Suspense>
  );
}
