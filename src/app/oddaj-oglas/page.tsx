import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = { title: "Oddaj oglas | mobilnahiska.si" };

export default function OddajOglasPage() {
  return (
    <ComingSoon
      title="Oddaj oglas"
      description="Oddaja lastnega oglasa bo na voljo v naslednji fazi razvoja."
    />
  );
}
