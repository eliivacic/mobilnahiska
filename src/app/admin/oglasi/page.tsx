import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/dashboard/AdminPlaceholder";

export const metadata: Metadata = { title: "Oglasi | Admin | mobilnahiska.si" };

export default function AdminOglasiPage() {
  return (
    <AdminPlaceholder
      title="Oglasi"
      description="Pregled, potrjevanje, zavračanje in upravljanje vseh oglasov na portalu."
      needs="Oglasi so trenutno statični (v kodi), ne v podatkovni bazi — ta razdelek zaživi, ko bo oddaja oglasov shranjevala prave zapise v bazo."
    />
  );
}
