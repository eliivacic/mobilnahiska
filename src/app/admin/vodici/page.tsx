import type { Metadata } from "next";
import { guides } from "@/data/guides";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Vodiči | Admin | mobilnahiska.si" };

// Guides currently live in src/data/guides.ts. A real CMS (create/edit draft
// /publish/schedule from this screen) needs a `guides` database table —
// this view is read-only until that migration happens.
export default function AdminVodiciPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
        Vodiči — Od parcele do hiške
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Urejanje in objava člankov brez posega v kodo bo na voljo, ko bodo vodiči preseljeni v podatkovno bazo.
      </p>

      <div className="mt-6 overflow-hidden rounded-[14px] border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Naslov</th>
              <th className="px-4 py-3">Kategorija</th>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((guide) => (
              <tr key={guide.slug} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{guide.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{guide.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(guide.date)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-[4px] bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">
                    Objavljeno
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
