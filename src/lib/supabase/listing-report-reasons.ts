// Shared between the "use server" action (listing-reports.ts) and the client
// modal (ReportListingModal.tsx). A "use server" file may only export async
// functions — a plain object export like this one is invalid there (Next.js
// throws "A 'use server' file can only export async functions, found
// object" at module evaluation), so it lives in its own plain module.
export const REPORT_REASONS: Record<string, string> = {
  zavajajoce: "Zavajajoči podatki (cena, površina, stanje …)",
  neustrezna_vsebina: "Neustrezna ali žaljiva vsebina",
  goljufija: "Sum goljufije",
  tuja_vsebina: "Tuje fotografije ali besedilo brez dovoljenja",
  drugo: "Drugo",
};
