import type { Metadata } from "next";
import Link from "next/link";
import { lands } from "@/data/land";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Zemljišča | Admin | mobilnahiska.si" };

// Land listings live in src/data/land.ts (static test data). This admin view
// is read-only for now — editing here would only change in-memory data, not
// a real record, so it doesn't pretend to support add/edit/delete yet.
export default function AdminZemljiscaPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Zemljišča</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Trenutno testni podatki iz kode — urejanje iz admina bo na voljo, ko bodo zemljišča preseljena v bazo.
      </p>

      <div className="mt-6 overflow-hidden rounded-[14px] border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Naslov</th>
              <th className="px-4 py-3">Lokacija</th>
              <th className="px-4 py-3">Cena</th>
              <th className="px-4 py-3">Ekskluzivno</th>
            </tr>
          </thead>
          <tbody>
            {lands.map((land) => (
              <tr key={land.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href={`/zemljisca/${land.slug}`} className="hover:underline">
                    {land.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{land.location}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatPrice(land.price)}</td>
                <td className="px-4 py-3 text-muted-foreground">{land.exclusive ? "Da" : "Ne"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
