import type { Metadata } from "next";
import { Suspense } from "react";
import { listings } from "@/data/listings";
import { OglasiPageClient } from "./OglasiPageClient";

const TITLES: Record<string, string> = {
  mobilna: "Mobilne hiške naprodaj | mobilnahiska.si",
  modularna: "Modularne hiše naprodaj | mobilnahiska.si",
};

const DESCRIPTIONS: Record<string, string> = {
  mobilna: "Prebrskajte oglase mobilnih hišk, novih in rabljenih, po vsej Sloveniji in regiji.",
  modularna: "Prebrskajte oglase modularnih hiš, novih in rabljenih, po vsej Sloveniji in regiji.",
};

const DEFAULT_TITLE = "Mobilne in modularne hiške naprodaj | mobilnahiska.si";
const DEFAULT_DESCRIPTION =
  "Prebrskajte oglase mobilnih in modularnih hišk, novih in rabljenih, po vsej Sloveniji in regiji.";

export async function generateMetadata(props: PageProps<"/oglasi">): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined;
  const canonicalPath = type === "mobilna" || type === "modularna" ? `/oglasi?type=${type}` : "/oglasi";

  return {
    title: (type && TITLES[type]) || DEFAULT_TITLE,
    description: (type && DESCRIPTIONS[type]) || DEFAULT_DESCRIPTION,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: (type && TITLES[type]) || DEFAULT_TITLE,
      description: (type && DESCRIPTIONS[type]) || DEFAULT_DESCRIPTION,
      url: canonicalPath,
    },
  };
}

export default function OglasiPage() {
  return (
    <Suspense>
      <OglasiPageClient allListings={listings} />
    </Suspense>
  );
}
