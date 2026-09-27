import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/format";
import { ExclusiveToggle } from "@/components/dashboard/ExclusiveToggle";

export const metadata: Metadata = { title: "Zemljišča | Admin | mobilnahiska.si" };

export default async function AdminZemljiscaPage() {
  const admin = createAdminClient();
  const { data: lands } = await admin
    .from("listing_submissions")
    .select("id, slug, title, location, price, is_exclusive, status")
    .eq("type", "zemljisce")
    .order("created_at", { ascending: false });

  const rows = lands ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Zemljišča</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Objavljena zemljišča lahko označite kot ekskluzivna — prikažejo se v sekciji &quot;Ekskluzivna ponudba zemljišč&quot; na
        naslovnici. Za odobritev/zavrnitev oddanih zemljišč glej{" "}
        <Link href="/admin/oglasi" className="text-primary hover:underline">
          Oglasi
        </Link>
        .
      </p>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Ni oddanih zemljišč.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[14px] border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Naslov</th>
                <th className="px-4 py-3">Lokacija</th>
                <th className="px-4 py-3">Cena</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Ekskluzivno</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((land) => (
                <tr key={land.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {land.status === "published" ? (
                      <Link href={`/zemljisca/${land.slug}`} className="hover:underline" target="_blank">
                        {land.title}
                      </Link>
                    ) : (
                      land.title
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{land.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatPrice(land.price)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{land.status}</td>
                  <td className="px-4 py-3">
                    <ExclusiveToggle submissionId={land.id} isExclusive={land.is_exclusive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
