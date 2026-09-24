import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Pogoji uporabe | mobilnahiska.si" };

export default function PogojiPage() {
  return (
    <PageShell className="py-8">
      <article>
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Pogoji uporabe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Veljavno od 23. septembra 2026.</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">1. Splošno</h2>
            <p>
              Portal mobilnahiska.si (v nadaljevanju: portal) upravlja ekipa mobilnahiska.si. Z uporabo
              portala se strinjate s temi pogoji uporabe. Če se s pogoji ne strinjate, portala ne uporabljajte.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">2. Narava storitve</h2>
            <p>
              Portal omogoča objavo in pregledovanje oglasov za mobilne hiške, modularne hiše in zazidljiva
              zemljišča. Portal je zgolj posrednik med prodajalci in kupci ter ni stranka v nobenem poslu,
              sklenjenem med uporabniki.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">3. Registracija in račun</h2>
            <p>
              Za oddajo oglasa ali shranjevanje priljubljenih je potrebna registracija. Uporabnik je
              odgovoren za pravilnost podatkov, ki jih navede, in za varovanje dostopa do svojega računa.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">4. Vsebina oglasov in komentarjev</h2>
            <p>
              Uporabnik je odgovoren za resničnost in zakonitost vsebine, ki jo objavi. Portal si pridržuje
              pravico, da oglas ali komentar zavrne, skrije ali odstrani, če krši te pogoje ali veljavno
              zakonodajo. Komentarji so pred javno objavo pregledani.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">5. Omejitev odgovornosti</h2>
            <p>
              Portal si prizadeva za točnost objavljenih podatkov, vendar ne jamči za popolnost ali
              ažurnost vsebine, ki jo objavijo uporabniki. Portal ne odgovarja za škodo, nastalo zaradi
              poslov, sklenjenih med uporabniki.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">6. Spremembe pogojev</h2>
            <p>
              Portal lahko te pogoje kadarkoli spremeni. Nadaljnja uporaba portala po objavi sprememb
              pomeni strinjanje s spremenjenimi pogoji.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">7. Kontakt</h2>
            <p>
              Za vprašanja v zvezi s temi pogoji nas kontaktirajte na{" "}
              <a href="mailto:info@mobilnahiska.si" className="font-medium text-primary hover:underline">
                info@mobilnahiska.si
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
