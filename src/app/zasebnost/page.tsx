import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Politika zasebnosti | mobilnahiska.si" };

const nameniObdelave: Array<{ namen: string; podatki: string; podlaga: string; hramba: string }> = [
  {
    namen: "Uporabniški račun",
    podatki: "ime, e-naslov, geslo (zgoščeno), telefon",
    podlaga: "čl. 6(1)(b) GDPR – izvajanje pogodbe",
    hramba: "do izbrisa računa",
  },
  {
    namen: "Objava oglasa",
    podatki: "vsebina oglasa, fotografije, lokacija, kontaktni podatki, navedeni v oglasu",
    podlaga: "čl. 6(1)(b) GDPR – izvajanje pogodbe",
    hramba: "čas objave + 12 mesecev po poteku (reševanje morebitnih sporov)",
  },
  {
    namen: "Profil ponudnika",
    podatki: "ime podjetja, telefon, opis dejavnosti, spletna stran, lokacija, logotip",
    podlaga: "čl. 6(1)(b) GDPR – izvajanje pogodbe",
    hramba: "do izbrisa računa",
  },
  {
    namen: "Povpraševanja na oglase",
    podatki: "ime, e-naslov, telefon (neobvezno), vsebina sporočila",
    podlaga: "čl. 6(1)(b) oz. (f) GDPR",
    hramba: "12 mesecev",
  },
  {
    namen: "Komentarji na vodiče",
    podatki: "vsebina komentarja, povezava z uporabniškim računom",
    podlaga: "čl. 6(1)(b) GDPR",
    hramba: "do izbrisa komentarja ali računa",
  },
  {
    namen: "Varnost in preprečevanje zlorab",
    podatki: "dnevniški zapisi prijav in omejevanja hitrosti dostopa",
    podlaga: "čl. 6(1)(f) GDPR – zakoniti interes",
    hramba: "omejeno obdobje, vezano na namen",
  },
  {
    namen: "Analitika obiska (po soglasju)",
    podatki: "anonimizirani/psevdonimizirani podatki o obisku (Google Analytics)",
    podlaga: "čl. 6(1)(a) GDPR – privolitev",
    hramba: "do preklica soglasja, glej Politiko piškotkov",
  },
];

export default function ZasebnostPage() {
  return (
    <PageShell className="py-8">
      <article>
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Politika zasebnosti
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Veljavno od 13. oktobra 2026.</p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          Pripravljena je skladno s Splošno uredbo o varstvu podatkov (Uredba (EU) 2016/679, GDPR) in
          Zakonom o varstvu osebnih podatkov (ZVOP-2).
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">1. Upravljavec osebnih podatkov</h2>
            <p>
              MOBILNAHISKA.SI, Jana Ljubojevič s.p., Rakuševa ulica 8, 1000 Ljubljana (polni podatki v{" "}
              <a href="/impresum" className="font-medium text-primary hover:underline">
                Pravnem obvestilu
              </a>
              ). Kontakt za vprašanja o varstvu podatkov:{" "}
              <a href="mailto:info@mobilnahiska.si" className="font-medium text-primary hover:underline">
                info@mobilnahiska.si
              </a>
              . Upravljavec glede na naravo in obseg dejavnosti ni zavezan k imenovanju pooblaščene osebe
              za varstvo podatkov (čl. 37 GDPR).
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">2. Kateri podatki, za kaj in kako dolgo</h2>
            <div className="mt-3 space-y-3">
              {nameniObdelave.map((vrstica) => (
                <div key={vrstica.namen} className="rounded-lg border border-border p-4">
                  <p className="font-medium text-foreground">{vrstica.namen}</p>
                  <p className="mt-1 text-foreground/80">{vrstica.podatki}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Podlaga: {vrstica.podlaga} · Hramba: {vrstica.hramba}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3">
              Podatkov ne obdelujemo za avtomatizirano odločanje ali profiliranje s pravnimi učinki (čl. 22
              GDPR). Posebnih vrst osebnih podatkov ne zbiramo. Kontaktni podatki, ki jih oglaševalec sam
              objavi v oglasu, so javno vidni vsem obiskovalcem portala — objavite le podatke, ki jih
              želite deliti.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">3. Obdelovalci podatkov</h2>
            <p>Podatkov ne prodajamo. Pri delovanju portala sodelujemo z naslednjimi obdelovalci:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li><strong>Supabase</strong> (Irska/EU) – podatkovna baza, prijava v portal in shramba fotografij.</li>
              <li><strong>Vercel</strong> – gostovanje spletne aplikacije.</li>
              <li><strong>Resend</strong> – pošiljanje e-poštnih obvestil v zvezi z vašim računom in oglasi.</li>
              <li><strong>Google (Google Analytics)</strong> – izključno po vašem soglasju za analitične piškotke.</li>
            </ul>
            <p className="mt-2">
              Plačilni sistem za nakup paketov na portalu še ni aktiviran, zato danes noben ponudnik
              plačilnih storitev ne obdeluje vaših podatkov v tem okviru. Ko bo plačevanje omogočeno, bo ta
              razdelek dopolnjen z imenom in podrobnostmi ponudnika plačilnih storitev.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">4. Iznos v tretje države</h2>
            <p>
              Podatke praviloma obdelujemo znotraj EU/EGP. Če kateri od obdelovalcev podatke izjemoma
              prenaša izven EGP, to stori na podlagi sklepa Evropske komisije o ustreznosti ali standardnih
              pogodbenih klavzul.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">5. Vaše pravice</h2>
            <p>Po GDPR imate pravico do:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>dostopa do svojih podatkov in kopije (čl. 15);</li>
              <li>popravka netočnih podatkov (čl. 16);</li>
              <li>izbrisa – „pravice do pozabe&#34; (čl. 17);</li>
              <li>omejitve obdelave (čl. 18);</li>
              <li>prenosljivosti podatkov (čl. 20);</li>
              <li>ugovora obdelavi na podlagi zakonitega interesa (čl. 21);</li>
              <li>preklica privolitve kadarkoli, brez vpliva na zakonitost prejšnje obdelave (čl. 7).</li>
            </ul>
            <p className="mt-3">
              Zahtevo pošljite na{" "}
              <a href="mailto:info@mobilnahiska.si" className="font-medium text-primary hover:underline">
                info@mobilnahiska.si
              </a>{" "}
              ali po pošti na naslov sedeža. V e-pošto prosimo vključite: vaše ime in priimek, e-naslov,
              uporabljen na portalu, katero pravico uveljavljate in kratek opis zahteve. Odgovorimo
              najpozneje v enem mesecu; v zahtevnih primerih se rok lahko podaljša za dva meseca, o čemer
              vas obvestimo. Uveljavljanje pravic je brezplačno; za potrditev istovetnosti lahko zahtevamo
              dodatne podatke.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">6. Pritožba pri nadzornem organu</h2>
            <p>
              Če menite, da obdelava vaših podatkov krši predpise, lahko vložite pritožbo pri Informacijskem
              pooblaščencu RS, Dunajska cesta 22, 1000 Ljubljana, e-pošta gp.ip@ip-rs.si, telefon 01 230 97
              30,{" "}
              <a
                href="https://www.ip-rs.si"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                www.ip-rs.si
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">7. Mladoletni</h2>
            <p>
              Portal ni namenjen osebam, mlajšim od 18 let, za oddajo oglasov. Za privolitev v storitve
              informacijske družbe mora biti posameznik star najmanj 15 let; za mlajše privolitev da starš
              ali skrbnik.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">8. Varnost podatkov</h2>
            <p>
              Uporabljamo šifrirano povezavo (HTTPS), zgoščena gesla in omejen dostop na podlagi vlog
              (uporabnik/ponudnik/administrator). O morebitni kršitvi varnosti, ki pomeni tveganje za
              posameznike, obvestimo Informacijskega pooblaščenca v 72 urah in, kjer je potrebno, prizadete
              posameznike.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">9. Piškotki</h2>
            <p>
              Uporaba piškotkov je urejena v{" "}
              <a href="/piskotki" className="font-medium text-primary hover:underline">
                Politiki piškotkov
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">10. Spremembe politike</h2>
            <p>
              To politiko lahko posodobimo. Veljavna različica je vedno objavljena na portalu z datumom
              začetka veljavnosti; o bistvenih spremembah registrirane uporabnike obvestimo po e-pošti.
            </p>
          </section>
        </div>
      </article>
    </PageShell>
  );
}
