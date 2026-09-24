import type { Metadata } from "next";
import { getProviders } from "@/data/listings";
import { pluralizeSl } from "@/lib/format";

export const metadata: Metadata = { title: "Ponudniki | Admin | mobilnahiska.si" };

// Providers are derived from static listing data (src/data/listings.ts), not
// their own database table yet — so promo-period assignment isn't wired up.
// See the "Začetna akcija za ponudnike" requirement for what that needs once
// providers are a real table.
export default function AdminPonudnikiPage() {
  const providers = getProviders();

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Profesionalni ponudniki</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Ročna dodelitev promocijskega obdobja (npr. brezplačni paket za prve partnerje) bo na voljo, ko bodo
        ponudniki preseljeni v bazo.
      </p>

      <div className="mt-6 overflow-hidden rounded-[14px] border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Podjetje</th>
              <th className="px-4 py-3">Lokacija</th>
              <th className="px-4 py-3">Aktivni oglasi</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider) => (
              <tr key={provider.slug} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{provider.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {provider.location}, {provider.country}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {provider.activeListings} {pluralizeSl(provider.activeListings, ["oglas", "oglasa", "oglasi", "oglasov"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
