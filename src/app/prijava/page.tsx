import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Prijava | mobilnahiska.si" };

export default function PrijavaPage() {
  return (
    <ComingSoon
      title="Prijava"
      description="Uporabniški računi in prijava bodo na voljo v naslednji fazi razvoja."
    />
  );
}
