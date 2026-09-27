import type { Metadata } from "next";
import { getProviders } from "@/lib/providers/public";
import { pluralizeSl } from "@/lib/format";

export const metadata: Metadata = { title: "Ponudniki | Admin | mobilnahiska.si" };
export const dynamic = "force-dynamic";

export default async function AdminPonudnikiPage() {
  const providers = await getProviders();

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Profesionalni ponudniki</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Realni dealer profili — nastanejo samodejno, ko dealer v svojem profilu vnese ime podjetja.
      </p>

      {providers.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Trenutno ni ponudnikov z izpolnjenim javnim profilom.</p>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-[14px] border border-border md:block">
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
                  <tr key={provider.userId} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{provider.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{provider.location || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {provider.activeListings} {pluralizeSl(provider.activeListings, ["oglas", "oglasa", "oglasi", "oglasov"])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {providers.map((provider) => (
              <div key={provider.userId} className="rounded-[14px] border border-border bg-card p-4">
                <p className="font-semibold text-foreground">{provider.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {provider.location || "—"} &middot; {provider.activeListings}{" "}
                  {pluralizeSl(provider.activeListings, ["oglas", "oglasa", "oglasi", "oglasov"])}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
