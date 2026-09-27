# Primopredajni checklist — mobilnahiska.si

Nobeno geslo ali API ključ ni zapisano v tem dokumentu. Kjer je vrednost potrebna, je navedeno samo, kam mora novi lastnik oditi, da jo pridobi.

## DOMENA

- Uporablja: `mobilnahiska.si` (canonical `www.mobilnahiska.si` — glej `src/app/layout.tsx` `metadataBase`, `sitemap.ts`, `robots.ts`).
- Pripravljeno: DNS mora kazati na Vercel (glej Hosting spodaj).
- Novi lastnik uredi: registracija/podaljšanje domene, DNS zapisi (glej Email spodaj za SPF/DKIM/DMARC).
- Preveriti: `mobilnahiska.si` → `www.mobilnahiska.si` redirect (ali obratno) je konsistenten; HTTPS je obvezen (Vercel to uredi samodejno).

## HOSTING

- Uporablja: Vercel, projekt `info-salybearstuds-projects/mobilnahiska-next`, povezan z GitHub `eliivacic/mobilnahiska` (branch `main`).
- Pripravljeno: samodejni deploy ob pushu na `main`, cron job (`vercel.json`) za dnevne opomnike.
- Novi lastnik uredi: prenos lastništva Vercel projekta/teama in GitHub repozitorija na svoj račun.
- Preveriti: environment variables so nastavljene v vseh treh okoljih (Production/Preview/Development) po prenosu.

## DATABASE

- Uporablja: Supabase (Postgres + Auth), projekt ref `uwqnbsjatixrmiugxtkn`, regija `eu-west-1`.
- Pripravljeno: vse tabele, RLS politike, trigerji — od 2026-09-27 tudi reproducibilno v repozitoriju (`supabase/migrations/000_baseline_schema.sql` + `001_seed_reference_data.sql`, glej `supabase/migrations/README.md`).
- Novi lastnik uredi: prenos lastništva Supabase organizacije/projekta, preverbo plačilnega plana (glej BACKUPS spodaj — trenutno na planu brez PITR).
- Preveriti: `SUPABASE_SERVICE_ROLE_KEY` je rotiran po prenosu lastništva (star ključ je bil viden razvijalcu).

## AUTH

- Uporablja: Supabase Auth (e-mail/geslo, PKCE), brez menjav v tem projektu.
- Pripravljeno: registracija, prijava, potrditev e-maila, pozabljeno/ponastavitev gesla, tri vloge (`user`/`dealer`/`admin`).
- Novi lastnik uredi: v Supabase Dashboard → Authentication → Email Templates ročno prilepi branded predlogi iz `supabase/auth-email-templates/confirmation.html` in `recovery.html` (glej README tam za natančna navodila — Composio orodja tega ne podpirajo programsko).
- Preveriti: prvi admin uporabnik obstaja (`profiles.role = 'admin'` za vsaj enega uporabnika) — brez tega si nihče ne more videti `/admin`.

## EMAIL — podroben checklist

Koda ni bila spremenjena. **Preverjeno prek Resend API 2026-09-27: domena `mobilnahiska.si` še vedno ni dodana** (`GET /domains` vrne prazen seznam).

### 1. Kako dodaš domeno v Resend

1. Pojdi na resend.com → prijava → **Domains → Add Domain**.
2. Vnesi `mobilnahiska.si`.
3. Resend ti izpiše natančne DNS zapise (SPF – 1× TXT, DKIM – 3× CNAME, priporočeno tudi DMARC – 1× TXT). **Teh vrednosti ne izmišljujem** — dobiš jih šele na tem koraku, ker vsebujejo edinstvene vrednosti, vezane na tvoj račun.

### 2. Kje dodaš te DNS zapise

Pri ponudniku, kjer je registrirana/gostovana domena `mobilnahiska.si` (Cloudflare, Namecheap, Vercel DNS ipd. — povej mi kje, pa ti pomagam z natančnimi koraki za tisti konkretni vmesnik). Vsak zapis prekopiraš točno tako, kot ga izpiše Resend (ime, tip, vrednost).

### 3. Kako preveriš verifikacijo

- V Resend dashboardu, Domains → `mobilnahiska.si`, status se spremeni iz "Pending" v "Verified" (lahko traja od nekaj minut do ~24 ur, odvisno od DNS propagacije).
- Dodatno lahko preveriš od zunaj: `dig TXT mobilnahiska.si` (SPF) in `dig CNAME resend._domainkey.mobilnahiska.si` (DKIM, ime se lahko razlikuje — uporabi točno ime, ki ga izpiše Resend).

### 4. Nastavitev sender + reply-to

To NI DNS nastavitev — nastavi se neposredno v portalu, v `/admin/nastavitve` → zavihek "E-pošta" (koda to že podpira):
- Sender name: `mobilnahiska.si`
- Sender address: `obvestila@mobilnahiska.si`
- Reply-to: `info@mobilnahiska.si`

Te vrednosti so že prednastavljene v `portal_settings` (glej `supabase/migrations/001_seed_reference_data.sql`) — po verifikaciji domene ni treba ničesar spreminjati, sistem jih bo takoj uporabil.

### 5. API ključ

Ko je domena "Verified", v Resend ustvari API key (Settings → API Keys) in mi ga pošlji — dodam ga kot `RESEND_API_KEY` v Vercel (Production + Preview), tako kot sem že enkrat naredila v tej seji.

### 6. Test po verifikaciji (ta seznam bom izvedla, ko mi poveš, da je domena verificirana)

Pet realnih testov, brez izmišljenih podatkov:
1. **Verification email** — registracija novega testnega računa → preveri prejem in da povezava za potrditev deluje.
2. **Welcome email** — samodejno ob prvi potrditvi e-maila istega računa.
3. **Password reset** — `/pozabljeno-geslo` s testnim računom → preveri prejem in da povezava vodi na `/ponastavi-geslo`.
4. **Listing approved** — oddaja testnega oglasa + admin odobritev → preveri prejem e-maila "Vaš oglas je objavljen".
5. **Inquiry notification** — povpraševanje na testnem oglasu → preveri, da e-mail prejme prodajalec (ne admin).

Vseh pet je že implementiranih in danes ponovno end-to-end preverjenih na aplikacijski ravni (glej poročilo) — manjka jim samo resnično dostavo, kar zahteva korake 1–5 zgoraj.

## STORAGE

- Uporablja: Supabase Storage za fotografije oglasov (upload prek `/oddaj-oglas`).
- Pripravljeno: upload, validacija formata/velikosti.
- Novi lastnik uredi: preveriti retention/kvoto na Supabase planu glede na pričakovan obseg fotografij.
- Preveriti: kaj se zgodi s fotografijami ob brisanju oglasa (preveri, da orphan datoteke ne kopičijo stroškov).

## STRIPE

Glej ločen razdelek spodaj — **"Stripe: checklist za končno povezavo"**.

## ANALYTICS + COOKIE CONSENT

- Uporablja: Google Analytics 4 (gtag.js), measurement ID `G-C7XR50X00S`. **Nalaga se šele po pridobljenem soglasju** (`src/components/consent/`) — pravi cookie consent banner (Nujni/Analitični/Marketinški, "Sprejmi vse"/"Zavrni nenujne"/"Nastavitve") je implementiran.
- Pripravljeno: pageview meritev + custom eventi (`listing_view`, `phone_reveal`, `favorite_added`, `inquiry_sent`, `listing_created`, `checkout_started`, `purchase_completed`), nič PII v parametrih.
- Novi lastnik uredi: dostop do GA4 property naj se prenese na novega lastnika.
- Preveriti: besedilo v `/piskotki` in v bannerju ni bilo pravno pregledano — pred pravo produkcijo v EU naj to potrdi nekdo s pravnim znanjem, tekst sam ni bil izmišljen na novo (obstoječa `/piskotki` stran), le UI za izbiro je nov.

## ERROR MONITORING

- Uporablja: nič trenutno (samo `console.error` v kodi).
- Novi lastnik uredi: izbrati ponudnika (npr. Sentry) in ga povezati, če je želeno sledenje produkcijskim napakam v realnem času.
- Preveriti: brez tega se kritične napake vidijo samo v Vercel function logih.

## BACKUPS — podroben checklist

**Preverjeno neposredno prek Supabase API 2026-09-27** (`SUPABASE_LIST_BACKUPS`): `pitr_enabled: false`, `backups: []` (trenutno dobesedno ni nobenega backupa), `walg_enabled: true` (backup infrastruktura obstaja na platformi, a ni aktivirana). Projekt je star ~4 dni (ustvarjen 2026-09-23) — da bi imel Pro-plan avtomatske dnevne backupe že narejene, bi jih po štirih dneh moralo biti vsaj nekaj v seznamu; prazen seznam skupaj s tem, da PITR ni vklopljen, kaže, da je projekt najverjetneje na **Free planu** (na Free planu Supabase ne ponuja nobenega avtomatskega backupa — to ni nastavitev, ki bi jo pozabili vklopiti, ampak omejitev plana). **Točnega plana nisem mogla potrditi prek API-ja — to preveri sama v Dashboard → Settings → Billing.**

### 1. Katere backup možnosti trenutno dejansko omogoča tvoj setup

| Plan | Kaj dobiš |
|---|---|
| **Free** (najverjetneje trenutni plan) | Nič avtomatskega. Edina možnost je ročni `pg_dump`. |
| **Pro** (25 $/mesec) | Samodejni dnevni backupi, hranjeni 7 dni, obnovitev prek Dashboarda (Database → Backups → Restore). |
| **Pro + PITR dodatek** | Obnovitev na poljuben trenutek znotraj izbranega retention obdobja (ne samo na dnevni posnetek). Dodatni strošek, odvisen od dolžine retencije. |

### 2. Kaj moraš ročno vključiti (jaz tega ne morem storiti namesto tebe)

- Pojdi v Supabase Dashboard → izberi projekt → **Settings → Billing** in preveri trenutni plan.
- Če je Free in nameravaš iti v pravo produkcijo z realnimi uporabniškimi podatki: nadgradi vsaj na **Pro** (dnevni backupi so vključeni v ceno, brez dodatne nastavitve).
- Če želiš PITR (priporočljivo za marketplace s plačili): Database → Backups → omogoči Point-in-Time Recovery in izberi retention obdobje.

### 3. Kako narediti backup PRED vsakim deployem/migracijo (deluje na katerem koli planu, tudi Free)

Ker lokalno nimam nameščenega `supabase` CLI ali `pg_dump` (preverjeno — nobenega ni), tega nisem mogla izvesti namesto tebe. Ti naredi:

```bash
# Namesti Supabase CLI (enkrat)
npm install -g supabase

# Prijava
supabase login

# Poln dump sheme + podatkov (poženi iz mape projekta)
supabase db dump --db-url "postgresql://postgres:[TVOJE-GESLO]@db.uwqnbsjatixrmiugxtkn.supabase.co:5432/postgres" -f backup-$(date +%Y%m%d-%H%M).sql
```

Geslo za bazo dobiš v Dashboard → Settings → Database → Connection string (ali ga ponastaviš tam, če ga ne poznaš). Shrani `.sql` datoteko izven repozitorija (nikoli je ne commitaj — vsebuje realne podatke).

### 4. Kako bi izvedli restore

- **Če je PITR omogočen**: Dashboard → Database → Backups → izberi trenutek → Restore. Supabase to izvede sam.
- **Če ni PITR-a, imaš pa ročni `pg_dump`**: `psql "postgresql://postgres:[GESLO]@db.uwqnbsjatixrmiugxtkn.supabase.co:5432/postgres" -f backup-XXXX.sql` (na PRAZNO ali obnovljeno bazo — ne na živo bazo z obstoječimi podatki, ker bi prišlo do konfliktov).
- **Če nimaš niti ročnega backupa**: edina "obnovitev" je ponovna izgradnja sheme iz `supabase/migrations/000_baseline_schema.sql` + `001_seed_reference_data.sql` — s tem dobiš nazaj strukturo in referenčne podatke (paketi, vodiči), **ne pa realnih uporabniških podatkov, oglasov ali plačil**, ki bi bili nepovratno izgubljeni.

**Zaključek: dokler ne narediš vsaj enega ročnega `pg_dump` (točka 3) ali ne nadgradiš plana, je vsaka resnična uporabniška aktivnost (registracije, oglasi, plačila) nezavarovana pred izgubo podatkov.**

## ADMIN

- Uporablja: `/admin/*`, zaščiteno server-side (`requireAdmin()` v `src/app/admin/layout.tsx`).
- Pripravljeno: Oglasi (moderacija), Zemljišča (ekskluzivnost), Ponudniki, Povpraševanja (status), Uporabniki, Plačila, Paketi, Vodiči (poln CRUD CMS), Komentarji, Nastavitve (vključno z e-pošto), Audit log.
- Novi lastnik uredi: nič dodatnega za osnovno delovanje.
- Preveriti: vsaj en admin račun obstaja (glej AUTH zgoraj).

## TESTNA POKRITOST

- `e2e/` (Playwright): **42/42 testov zelenih** (dodan je bil tudi nov test za pravi empty-state marketplacea). `e2e/global-setup.ts`/`global-teardown.ts` ustvarita en jasno označen testni oglas pred zagonom in ga (skupaj z vsemi povpraševanji/priljubljenimi, ki ga med testi referencirajo) izbrišeta takoj po zaključku — baza po vsakem zagonu ostane popolnoma prazna, preverjeno. Glej `e2e/README.md` za razlago te arhitekture in njeno edino znano omejitev (deli isto Supabase bazo s produkcijo, ni ločenega test/staging projekta).
- Rate limiting je med testiranjem odkril in pravilno blokiral prekomerno prijavljanje — zato je zdaj aktiven izključno, ko `NODE_ENV === "production"` (torej na vsakem pravem Vercel deployu, Preview ali Production), ne pa v lokalnem `next dev`, kjer bi samo oviral razvoj/teste brez varnostne koristi.
- Med preverjanjem sem našla in popravila pravi bug: cookie consent banner in mobilna "Pošlji povpraševanje" vrstica sta se na oglasu prekrivala in blokirala drug drugega — popravljeno (`MobileCtaBarPresence.tsx`).

## ENVIRONMENT VARIABLES

- Glej `.env.example` za popoln seznam imen.
- Novi lastnik uredi: vse vrednosti nastavi v Vercelu (Production/Preview/Development) — nobena ni v tem repozitoriju.

---

## Stripe: checklist za končno povezavo

Portal je tehnično pripravljen za Stripe (podatkovni model, checkout flow, webhook, admin/uporabniški prikaz), a Stripe **ni povezan in ni aktiviran**. Ko bo čas za dejansko povezavo:

1. **Ustvari Stripe produkte**: Zasebni oglas, PRO Start, PRO, Dealer, TOP oglas, Izpostavitev na naslovnici (6 produktov, glej trenutne cene v `/admin/paketi` oz. tabelah `plans`/`promotion_addons`).
2. **Ustvari Stripe Prices** za vsak produkt (mesečno za PRO Start/PRO/Dealer, enkratno za Zasebni oglas/TOP/Izpostavitev). Ko bodo določene polletne/letne cene, dodaj dodatne Price zapise z isto `plan_group`.
3. **Vnesi Price ID-je** v Supabase: `plans.stripe_price_id` in `plans.stripe_product_id` (oz. `promotion_addons.stripe_price_id`/`stripe_product_id`) za vsako vrstico — nikoli v kodo/UI.
4. **Nastavi environment variables** v Vercelu: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (glej `.env.example`).
5. **Dodaj webhook URL** v Stripe Dashboard → Developers → Webhooks: `https://www.mobilnahiska.si/api/webhooks/stripe`.
6. **Izberi webhook evente**, ki jih endpoint posluša: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.
7. **Naredi testno plačilo** v Stripe TEST načinu (testna kartica `4242 4242 4242 4242`) prek enega od "Nadgradi"/"Kupi" gumbov na portalu.
8. **Preveri aktivacijo paketa**: po testnem plačilu naj se v `/admin/placila` prikaže zapis s statusom "Plačano", v `subscriptions` naj se pojavi/posodobi vrstica, in `/moj-racun/paket` naj kaže nov paket.
9. **Preveri TOP oglas**: kupi TOP addon na testnem oglasu, preveri da `listing_submissions.is_top = true` in da je oglas ustrezno označen.
10. **Preveri izpostavitev**: enako za `is_featured_homepage`.
11. **Preklopi iz TEST v LIVE**: zamenjaj `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` z LIVE vrednostmi, ponovno ustvari webhook endpoint v LIVE načinu (Stripe ločuje TEST/LIVE webhooke), ponovno preveri Price ID-je (LIVE ID-ji se razlikujejo od TEST ID-jev).
12. **Po preklopu ponovno preveri**: eno resnično plačilo z majhnim zneskom (ali s Stripe-ovim priporočenim postopkom za LIVE test), da webhook dejansko prejme in obdela dogodek, preden se sistem oglašuje kot "plačila delujejo".

Do takrat vsak nakupni gumb na portalu ostaja onemogočen z besedilom **"Plačilni sistem še ni aktiviran"** — to je namerno, ne napaka.
