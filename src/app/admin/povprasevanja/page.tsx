import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/dashboard/AdminPlaceholder";

export const metadata: Metadata = { title: "Povpraševanja | Admin | mobilnahiska.si" };

// Contact/inquiry forms on listing pages don't write to a database yet — see
// ŠE NI IMPLEMENTIRANO. When they do, the `inquiries` table should carry a
// `lead_type` column (FREE / PAID / DEALER_INCLUDED) from day one so pricing
// rules can be layered on later without a schema migration — but that pricing
// logic itself must NOT be activated until agreed with the client.
export default function AdminPovprasevanjaPage() {
  return (
    <AdminPlaceholder
      title="Povpraševanja"
      description="Vsa povpraševanja kupcev po oglasih in zemljiščih, z virom, statusom in dodelitvijo ponudniku."
      needs="Kontaktni obrazci na oglasih še ne shranjujejo povpraševanj v bazo. Ko bo to urejeno, bo tabela imela pripravljeno arhitekturo tipov povpraševanj (FREE / PAID / DEALER_INCLUDED), a cenovna logika zanjo se ne bo aktivirala brez dogovora."
    />
  );
}
