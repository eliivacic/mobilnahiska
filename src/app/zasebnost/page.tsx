import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Politika zasebnosti | mobilnahiska.si" };

export default function ZasebnostPage() {
  return (
    <PageShell className="py-8">
      <article>
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Politika zasebnosti
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Veljavno od 23. septembra 2026.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">1. Katere podatke zbiramo</h2>
            <p>
              Ob registraciji zbiramo vaše ime, e-poštni naslov in geslo (shranjeno v šifrirani obliki).
              Ob oddaji oglasa dodatno zbiramo podatke o oglasu (npr. lokacijo, ceno, fotografije) in
              kontaktne podatke, ki jih sami navedete. Ob komentiranju člankov shranimo vsebino komentarja
              in povezavo z vašim računom.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">2. Namen obdelave</h2>
            <p>
              Podatke uporabljamo za delovanje uporabniškega računa, prikaz in upravljanje oglasov,
              moderacijo komentarjev ter komunikacijo v zvezi z vašim računom. Podatkov ne prodajamo
              tretjim osebam.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">3. Hramba podatkov</h2>
            <p>
              Podatki so shranjeni pri ponudniku Supabase (baza podatkov in avtentikacija). Podatke
              hranimo, dokler je vaš račun aktiven, oziroma dokler zahtevate izbris.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">4. Vaše pravice</h2>
            <p>
              Do svojih podatkov lahko kadarkoli dostopate ali zahtevate njihov popravek oziroma izbris,
              tako da nam pišete na{" "}
              <a href="mailto:info@mobilnahiska.si" className="font-medium text-primary hover:underline">
                info@mobilnahiska.si
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">5. Piškotki</h2>
            <p>
              Portal uporablja piškotke, kot je opisano v naši{" "}
              <a href="/piskotki" className="font-medium text-primary hover:underline">
                politiki piškotkov
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
