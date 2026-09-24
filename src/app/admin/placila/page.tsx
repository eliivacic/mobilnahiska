import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/dashboard/AdminPlaceholder";

export const metadata: Metadata = { title: "Plačila | Admin | mobilnahiska.si" };

export default function AdminPlacilaPage() {
  return (
    <AdminPlaceholder
      title="Plačila"
      description="Pregled vseh plačil, statusov (uspešno/neuspešno/preklicano) in prihodkov po virih."
      needs="Plačilni ponudnik še ni povezan. Ko bo urejena integracija, se bodo tu prikazovali pravi zapisi plačil, ne izmišljeni zneski."
    />
  );
}
