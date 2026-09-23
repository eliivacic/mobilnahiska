import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Vodiči | mobilnahiska.si" };

export default function VodiciPage() {
  return (
    <ComingSoon
      title="Vodiči po nakupu"
      description="Praktični vodiči o izbiri, dostavi in postavitvi mobilnih ter modularnih hišk bodo kmalu na voljo."
    />
  );
}
