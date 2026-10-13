import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Piškotki | mobilnahiska.si" };

export default function PiskotkiPage() {
  return (
    <PageShell className="py-8">
      <article>
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Politika piškotkov
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Veljavno od 13. oktobra 2026.</p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          Pripravljena skladno s 225. členom Zakona o elektronskih komunikacijah (ZEKom-2).
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Kaj so piškotki</h2>
            <p>
              Piškotki so majhne besedilne datoteke, ki jih spletna stran shrani v vaš brskalnik, da si
              zapomni informacije o vašem obisku.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Kako upravljamo soglasje</h2>
            <p>
              Ob prvem obisku portala se prikaže pasica za soglasje, kjer lahko izberete „Sprejmi vse&#34;,
              „Zavrni nenujne&#34; ali si ogledate podrobne nastavitve po kategorijah. Vaša izbira se shrani in
              jo lahko kadarkoli spremenite v nastavitvah soglasja.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Katere kategorije piškotkov uporabljamo</h2>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border border-border p-4">
                <p className="font-medium text-foreground">Nujni piškotki</p>
                <p className="mt-1 text-foreground/80">
                  Vedno omogočeni, saj so potrebni za osnovno delovanje portala — prijavo v uporabniški
                  račun in ohranjanje seje (Supabase avtentikacija) ter beleženje vaše izbire soglasja za
                  piškotke. Brez njih prijava in oddaja oglasa ne delujeta.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="font-medium text-foreground">Analitični piškotki</p>
                <p className="mt-1 text-foreground/80">
                  Google Analytics (GA4) — pomagajo nam razumeti, kako obiskovalci uporabljajo portal
                  (obiskane strani, iskanja, interakcije z oglasi). Naložijo se izključno, če v pasici za
                  soglasje izberete kategorijo „Analitični&#34;.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <p className="font-medium text-foreground">Marketinški piškotki</p>
                <p className="mt-1 text-foreground/80">
                  Trenutno se na portalu ne uporabljajo, čeprav je kategorija v pasici za soglasje že na
                  voljo za morebitno prihodnjo uporabo.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Upravljanje piškotkov</h2>
            <p>
              Svojo izbiro lahko kadarkoli spremenite prek nastavitev soglasja na portalu ali piškotke
              izbrišete/blokirate neposredno v nastavitvah svojega brskalnika. Ker so nujni piškotki
              potrebni za delovanje računa, njihova blokada onemogoči prijavo v portal.
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
