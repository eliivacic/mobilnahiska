import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Pogoji uporabe | mobilnahiska.si" };

export default function PogojiPage() {
  return (
    <PageShell className="py-8">
      <article>
        <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
          Splošni pogoji uporabe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Veljavno od 13. oktobra 2026.</p>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          Z uporabo portala ali oddajo oglasa uporabnik potrjuje, da je te pogoje prebral in se z njimi
          strinja.
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">1. Upravljavec in namen portala</h2>
            <p>
              Portal www.mobilnahiska.si upravlja MOBILNAHISKA.SI, Jana Ljubojevič s.p., Rakuševa ulica 8,
              1000 Ljubljana (v nadaljevanju: upravljavec). Podrobni podatki o upravljavcu so navedeni v{" "}
              <a href="/impresum" className="font-medium text-primary hover:underline">
                Pravnem obvestilu
              </a>
              . Portal je specializiran oglaševalski prostor za mobilne hiške, modularne hiše in zemljišča
              ter objavlja informativne vodiče.
            </p>
            <p className="mt-2">
              Upravljavec ni stranka pogodb med oglaševalci in kupci, ne posreduje pri prometu z
              nepremičninami v smislu Zakona o nepremičninskem posredovanju in ne jamči za stanje,
              lastništvo ali zakonitost oglaševanih predmetov.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">2. Opredelitve pojmov</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Obiskovalec</strong> – vsakdo, ki brska po portalu.</li>
              <li><strong>Uporabnik</strong> – obiskovalec, ki ustvari uporabniški račun.</li>
              <li>
                <strong>Oglaševalec</strong> – uporabnik, ki objavi oglas; je lahko fizična oseba (zasebni
                prodajalec) ali podjetje (ponudnik).
              </li>
              <li>
                <strong>Ponudnik</strong> – oglaševalec, ki deluje v okviru svoje gospodarske ali poklicne
                dejavnosti (proizvajalec, trgovec, nepremičninska agencija).
              </li>
              <li><strong>Paket</strong> – plačljiva storitev objave ali izpostavitve oglasov po veljavnem ceniku.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">3. Registracija in uporabniški račun</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Za oddajo oglasa je potrebna registracija z resničnimi podatki. Uporabnik mora biti star najmanj 18 let.</li>
              <li>
                Uporabnik varuje svoje geslo in odgovarja za vse dejavnosti v svojem računu. Zlorabo
                nemudoma sporoči na{" "}
                <a href="mailto:info@mobilnahiska.si" className="font-medium text-primary hover:underline">
                  info@mobilnahiska.si
                </a>
                .
              </li>
              <li>
                Ponudnik v svojem profilu lahko navede ime podjetja, spletno stran, lokacijo in opis
                dejavnosti. Ta javno vidna navedba ne nadomešča morebitnih registrskih podatkov, ki jih
                portal danes ne preverja — podrobnosti v Politiki zasebnosti.
              </li>
              <li>Uporabnik lahko račun kadarkoli izbriše oziroma zahteva izbris s sporočilom na zgornji e-naslov.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">4. Objava oglasov in pravila vsebine</h2>
            <p>
              Oglaševalec jamči, da je oglas resničen, popoln in zakonit. Oglas mora vsebovati vsaj: vrsto
              predmeta, lokacijo, ceno v evrih, osnovne specifikacije in resnične fotografije.
            </p>
            <p className="mt-2">Prepovedano je objavljati:</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>zavajajoče podatke o ceni, površini, namembnosti zemljišča ali gradbenih dovoljenjih;</li>
              <li>predmete, s katerimi oglaševalec nima pravice razpolagati;</li>
              <li>tuje fotografije ali besedila brez dovoljenja imetnika pravic;</li>
              <li>podvojene oglase za isti predmet;</li>
              <li>vsebine, ki so žaljive, diskriminatorne, nezakonite ali spodbujajo goljufijo;</li>
              <li>kontaktne podatke tretjih oseb brez njihove privolitve;</li>
              <li>oglase za predmete, ki niso v kategorijah portala.</li>
            </ul>
            <p className="mt-2">
              Ponudnik mora v svojem profilu jasno nastopati kot podjetje. Pri nakupu od zasebnega
              prodajalca potrošniške pravice po Zakonu o varstvu potrošnikov (ZVPot-1) ne veljajo.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">5. Plačljivi paketi za ponudnike</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Cene, trajanje in vsebina paketov so objavljeni na strani „Paketi in cenik&#34;. Cene so v evrih; status obračuna DDV je naveden na izdanem računu.</li>
              <li>
                <strong>Nakup paketov trenutno ni mogoč</strong> — plačilni sistem portala še ni aktiviran.
                Ko bo aktiviran, bo pogodba sklenjena, ko ponudnik potrdi naročilo in prejme potrditev ter
                račun po e-pošti; oglas/paket se bo aktiviral po prejemu plačila.
              </li>
              <li>Paket se izteče ob koncu obdobja; samodejno podaljšanje velja le, če ga je ponudnik izrecno izbral, in ga lahko kadarkoli prekliče.</li>
              <li>
                Pakete kupujejo ponudniki v okviru dejavnosti, zato pravica do odstopa po ZVPot-1 zanje ne
                velja. Če paket kupi potrošnik, ima pravico do odstopa v 14 dneh brez navedbe razloga; če
                izrecno zahteva takojšnjo objavo, sorazmerno plača že opravljeno storitev, po izvedbi
                celotne storitve pa pravico izgubi.
              </li>
              <li>Če upravljavec oglas odstrani zaradi kršitve teh pogojev, kupnina ni vrnjena.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">6. Moderiranje in prijava nezakonitih vsebin</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Upravljavec lahko oglas ali komentar pred objavo ali po njej pregleda ter ga zavrne, uredi
                tehnično obliko, začasno skrije ali odstrani, če krši te pogoje ali zakon. Uporabniški
                račun lahko pri ponavljajočih ali hudih kršitvah začasno ali trajno onemogoči.
              </li>
              <li>
                Vsebino, za katero menite, da je nezakonita, lahko prijavite na{" "}
                <a href="mailto:info@mobilnahiska.si" className="font-medium text-primary hover:underline">
                  info@mobilnahiska.si
                </a>
                . Prijava naj vsebuje natančno povezavo do vsebine, razlago razloga, vaše ime in e-naslov
                ter izjavo, da jo podajate v dobri veri.
              </li>
              <li>Upravljavec prijave obravnava pravočasno, skrbno in objektivno ter prijavitelja obvesti o odločitvi.</li>
              <li>
                Ob vsaki omejitvi upravljavec oglaševalcu pošlje obrazložitev: kaj je bilo omejeno, zakaj,
                na kateri podlagi in kakšna pravna sredstva ima.
              </li>
              <li>
                Oglaševalec lahko v 6 mesecih zahteva ponovno presojo na zgornjem e-naslovu. Odločitev o
                ugovoru sprejme človek, ne avtomatiziran sistem.
              </li>
              <li>Razvrščanje oglasov je privzeto po datumu objave (najnovejši prvi). Oglasi iz plačanih paketov so lahko izpostavljeni in posebej označeni.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">7. Odgovornost</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Za vsebino oglasov, točnost podatkov in izpolnitev pogodb odgovarja izključno oglaševalec. Upravljavec kot ponudnik gostovanja vsebin odgovarja le, če ob vedenju o nezakoniti vsebini ne ukrepa nemudoma.</li>
              <li>Upravljavec ne jamči za neprekinjeno delovanje portala in ne odgovarja za škodo zaradi tehničnih motenj, vzdrževanja ali višje sile.</li>
              <li>Kupcem svetujemo, da pred plačilom preverijo lastništvo (zemljiška knjiga), namembnost zemljišča (prostorski akti občine) in predmet ogledajo v živo. Nikoli ne plačujte predplačil neznanim osebam.</li>
              <li>Odgovornost upravljavca do ponudnika je omejena na znesek, ki ga je ponudnik plačal za paket v zadnjih 12 mesecih, razen pri naklepu ali hudi malomarnosti.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">8. Intelektualna lastnina</h2>
            <p>
              Oglaševalec z objavo upravljavcu podeli neizključno, brezplačno pravico do objave,
              prilagoditve formata in prikaza vsebine oglasa (vključno s fotografijami) na portalu za čas
              objave oglasa. Oglaševalec jamči, da ima pravice na vsebini, in upravljavca odvezuje
              odgovornosti za zahtevke tretjih.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">9. Varstvo osebnih podatkov</h2>
            <p>
              Obdelava osebnih podatkov je opisana v{" "}
              <a href="/zasebnost" className="font-medium text-primary hover:underline">
                Politiki zasebnosti
              </a>
              , ki je sestavni del teh pogojev.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">10. Pritožbe in reševanje sporov</h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Pritožbe pošljite na{" "}
                <a href="mailto:info@mobilnahiska.si" className="font-medium text-primary hover:underline">
                  info@mobilnahiska.si
                </a>
                . Prejem potrdimo v 5 delovnih dneh, pritožbo obravnavamo in nanjo odgovorimo v 8 delovnih dneh.
              </li>
              <li>Upravljavec ne priznava pristojnosti nobenega izvajalca izvensodnega reševanja potrošniških sporov (IRPS).</li>
              <li>Za spore je pristojno stvarno pristojno sodišče v Ljubljani, za potrošnike pa sodišče po njihovem stalnem prebivališču. Uporablja se pravo Republike Slovenije.</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">11. Spremembe pogojev</h2>
            <p>
              Upravljavec lahko te pogoje spremeni. Spremembe objavi na portalu, registrirane uporabnike
              pa o bistvenih spremembah obvesti po e-pošti najmanj 15 dni pred začetkom veljavnosti.
              Uporabnik, ki se s spremembami ne strinja, lahko svoj račun pred začetkom veljavnosti izbriše.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-foreground">12. Kontakt</h2>
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
