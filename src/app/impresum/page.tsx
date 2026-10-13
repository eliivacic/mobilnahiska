import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Pravno obvestilo | mobilnahiska.si" };

const podatki: Array<[string, string]> = [
  ["Firma", "MOBILNAHISKA.SI, posredovanje oglaševalskega prostora, Jana Ljubojevič s.p."],
  ["Skrajšana firma", "MOBILNAHISKA.SI, Jana Ljubojevič s.p."],
  ["Sedež", "Rakuševa ulica 8, 1000 Ljubljana, Slovenija"],
  ["Nosilka dejavnosti", "Jana Ljubojevič"],
  ["Matična številka", "7599692000"],
  ["Davčna številka", "53335864"],
  ["Vpis v register", "Poslovni register Slovenije (AJPES), vpis 1. 10. 2026"],
  ["Glavna dejavnost", "SKD 73.120 – Posredovanje oglaševalskega prostora"],
  ["E-pošta", "info@mobilnahiska.si"],
];

export default function ImpresumPage() {
  return (
    <PageShell className="py-8">
      <article>
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Pravno obvestilo
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Veljavno od 13. oktobra 2026.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Upravljavec in lastnik portala</h2>
            <p>Upravljavec in lastnik spletnega portala www.mobilnahiska.si je:</p>
            <dl className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {podatki.map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 gap-1 bg-background px-4 py-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-foreground/70 sm:col-span-1">{label}</dt>
                  <dd className="sm:col-span-2">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Telefon, transakcijski račun in status zavezanca za DDV bodo dodani, ko jih skrbnik portala
              potrdi.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">
              Enotna kontaktna točka (Akt o digitalnih storitvah)
            </h2>
            <p>
              Za pristojne organe, Evropsko komisijo in uporabnike portala je enotna kontaktna točka v
              skladu s čl. 11 in 12 Uredbe (EU) 2022/2065 (Akt o digitalnih storitvah, DSA) e-poštni naslov{" "}
              <a href="mailto:info@mobilnahiska.si" className="font-medium text-primary hover:underline">
                info@mobilnahiska.si
              </a>
              . Komuniciramo v slovenskem in angleškem jeziku.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Avtorske pravice</h2>
            <p>
              Vsebine portala (besedila, vodiči, grafična podoba, logotip, baza podatkov) so last
              upravljavca ali imetnikov pravic in so zaščitene po Zakonu o avtorski in sorodnih pravicah.
              Kopiranje ali ponovna objava brez pisnega dovoljenja ni dovoljena. Za vsebino posameznih
              oglasov odgovarjajo oglaševalci.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Omejitev odgovornosti</h2>
            <p>
              Upravljavec si prizadeva za točnost vodičev in informativnih vsebin, vendar te niso
              strokovno (pravno, gradbeno, finančno) svetovanje. Za odločitve, sprejete na njihovi
              podlagi, upravljavec ne odgovarja.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">Povezani dokumenti</h2>
            <p>
              Glej tudi{" "}
              <a href="/pogoji" className="font-medium text-primary hover:underline">
                Splošne pogoje uporabe
              </a>{" "}
              in{" "}
              <a href="/zasebnost" className="font-medium text-primary hover:underline">
                Politiko zasebnosti
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
