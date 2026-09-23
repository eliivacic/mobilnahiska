import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Cenik | mobilnahiska.si" };

export default function CenePage() {
  return (
    <ComingSoon
      title="Paketi za ponudnike"
      description="Cenik in paketi za profesionalne prodajalce bodo kmalu na voljo."
    />
  );
}
