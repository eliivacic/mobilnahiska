# mobilnahiska.si

Slovenski marketplace za mobilne in modularne hiške ter zazidljiva zemljišča — oglasi, profesionalni ponudniki, povpraševanja in vodiči na enem mestu.

## Tech stack

- **Next.js 16** (App Router, Turbopack, Server Actions, Route Handlers)
- **TypeScript**, **React 19**
- **Supabase** — Postgres + Auth (e-mail/geslo, PKCE), brez ORM-a (neposredno `@supabase/supabase-js`)
- **Tailwind CSS v4**, **shadcn/ui** (Radix primitivi), **Lucide** ikone
- **Resend** — transakcijski e-maili (glej [Email sistem](#email-sistem))
- **Stripe** — pripravljena arhitektura, **še ni povezan** (glej [Plačila / Stripe](#plačila--stripe))
- Deploy: **Vercel** (`info-salybearstuds-projects/mobilnahiska-next`)

## Zagon

```bash
npm install
cp .env.example .env.local   # izpolni prave vrednosti, glej spodaj
npm run dev
```

Odpri [http://localhost:3000](http://localhost:3000).

```bash
npm run lint         # ESLint
npx tsc --noEmit      # TypeScript check
npm run build         # produkcijski build
npx playwright test   # E2E testi (e2e/)
```

## Environment variables

Glej `.env.example` za popoln seznam imen (brez vrednosti). Kratek pregled:

| Spremenljivka | Za kaj | Kje dobiš |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase klient (RLS-scoped) | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin klient, obide RLS — samo server-side | Supabase → Project Settings → API (secret!) |
| `CRON_SECRET` | Avtorizacija za `/api/cron/reminders` | poljuben naključen string, isti v Vercel cron konfiguraciji |
| `RESEND_API_KEY` | Pošiljanje transakcijskih e-mailov | resend.com, po verifikaciji domene |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Plačila (**še ne nastavljaj** — glej spodaj) | Stripe dashboard, šele ob dejanski povezavi |

## Authentication in vloge

**Supabase Auth** (e-mail/geslo, PKCE code-exchange prek `/auth/callback`). Email potrditev je obvezna.

Tri vloge v `profiles.role` (Postgres enum `user_role`): `user`, `dealer`, `admin`.

- `user` — upravlja svoj profil, oglase, priljubljene, povpraševanja.
- `dealer` — profesionalni ponudnik. Javni profil (`/ponudniki/[slug]`) se ustvari samodejno, ko dealer v `/moj-racun/profil` nastavi ime podjetja (generira `provider_slug`).
- `admin` — celoten portal, preverjen izključno server-side prek `requireAdmin()` (`src/lib/supabase/require-admin.ts`), uveljavljen centralno v `src/app/admin/layout.tsx` (velja za vse `/admin/*` podstrani), nikoli samo s skrivanjem UI elementa.

## Podatkovni model

Ker ni ORM-a, je shema upravljana neposredno v Supabaseu, a je od 2026-09-27 reproducibilna prek `supabase/migrations/` (glej README tam). Tabele: `profiles`, `listing_submissions`, `favorites`, `inquiries`, `comments`, `articles`, `plans`, `promotion_addons`, `subscriptions`, `payments`, `payment_provider_events`, `email_log`, `portal_settings`, `admin_audit_log`, `rate_limit_hits`.

## Javni marketplace (DB-backed)

`/`, `/oglasi`, `/zemljisca`, `/ponudniki`, `/vodici` in njihove detail strani berejo izključno iz `listing_submissions` / `profiles` / `articles` prek `src/lib/listings/public.ts`, `src/lib/providers/public.ts`, `src/lib/articles/public.ts` — javno se prikažejo samo vrstice s `status = 'published'` in `expires_at` v prihodnosti (ali brez roka). Iskanje/filtriranje/sortiranje (`src/lib/filter-listings.ts`) ostaja nespremenjeno — deluje client-side nad poljubnim `Listing[]`/`Land[]`, ne glede na to, od kod prihajajo podatki.

Celoten flow (registracija → oddaja oglasa → admin odobritev → javna vidnost → iskanje → detail → povpraševanje → prodajalec prejme obvestilo) je preverjen end-to-end s pravimi podatki (glej git zgodovino/poročilo te seje).

Uporabnik lahko svoj oglas ureja (`/moj-racun/oglasi/[id]/uredi` — urejanje objavljenega oglasa ga vrne v `pending_review`) in deaktivira/ponovno omogoči (`src/lib/supabase/listing-submissions.ts`). RLS (`listing_submissions_update_own`) preprečuje, da bi lastnik sam nastavil status na `published`/`rejected` ali spremenil `user_id`.

## Admin panel (`/admin`)

Pregled, Oglasi (moderacija), Zemljišča, Uporabniki, Ponudniki, Povpraševanja, Plačila, Paketi, Promocije, Vodiči, Komentarji, Statistika, Nastavitve. Vse strani so zaščitene v `src/app/admin/layout.tsx`.

## Email sistem

`src/lib/email/` — branded HTML predloge (registracija, dobrodošlica, pozabljeno geslo, status oglasa, povpraševanje, potek oglasa/paketa, potrditev plačila, admin obvestila), poslane prek Resend (`sendTransactionalEmail`), z dedup po `email_log.dedup_key` (prepreči podvojeno pošiljanje). Nastavitve pošiljatelja in ON/OFF stikala so v `/admin/nastavitve`. Brez `RESEND_API_KEY` se pošiljanje varno preskoči in zabeleži kot `skipped_no_provider`.

Supabase-ov lastni auth mailer (potrditev registracije, reset gesla) uporablja svoje ločene predloge — branded HTML zanju je v `supabase/auth-email-templates/`, a jih je treba ročno prilepiti v Supabase Dashboard (Composio orodja tega ne izpostavljajo programsko).

## Plačila / Stripe

Arhitektura je pripravljena (podatkovni model, checkout flow, webhook, admin/uporabniški prikaz), **Stripe pa namenoma ni povezan** — brez `STRIPE_SECRET_KEY` vsak nakupni gumb ostane prikazan kot onemogočen z besedilom "Plačilni sistem še ni aktiviran", nikoli kot lažno delujoč.

- `src/lib/payments/types.ts` — `Payment`, `Subscription` tipi
- `src/lib/payments/checkout.ts` — `createCheckoutSession()` server action
- `src/app/api/webhooks/stripe/route.ts` — webhook endpoint (signature verifikacija, idempotenten prek `payment_provider_events`)
- `src/lib/payments/activate.ts` — aktivacija paketa/oglasa/TOP-a/izpostavitve po potrjenem plačilu (kliče se izključno iz webhooka, nikoli iz success strani)
- Stripe product/price mapping živi na `plans.stripe_price_id` / `promotion_addons.stripe_price_id` (null dokler ni nastavljeno) — nikoli hardcodano v UI

Za natančen checklist končne povezave glej **HANDOVER_CHECKLIST.md**.

## Rate limiting

`src/lib/rate-limit.ts` — DB-backed (Postgres `rate_limit_hits` tabela, ne Redis — ni potrebe po dodatni infrastrukturi), uporabljeno na: registraciji, prijavi (po e-pošti IN po IP), pozabljenem geslu (tiho, brez razkritja obstoja naslova), oddaji oglasa, povpraševanjih, komentarjih.

## Cookie consent

`src/components/consent/` — pravi consent sistem (Nujni/Analitični/Marketinški, "Sprejmi vse"/"Zavrni nenujne"/"Nastavitve", shranjeno v cookie). GA4 (`AnalyticsScripts.tsx`) se naloži izključno, če je `analytics` soglasje dano — pred tem se ne inicializira. Analytics eventi (`src/lib/analytics.ts`): `listing_view`, `phone_reveal`, `favorite_added`, `inquiry_sent`, `listing_created`, `checkout_started`, `purchase_completed` — nikoli PII.

## Vodiči CMS

`/admin/vodici` — pravi CRUD (ustvari/uredi/objavi/odstrani iz objave/izbriši), `articles` tabela, polja vključno s SEO title/description in `comments_enabled`. Prvotna 4 članki iz `src/data/guides.ts` so bili preseljeni v bazo (`supabase/migrations/001_seed_reference_data.sql`) — ta statična datoteka se ne uporablja več za javne strani.

## Testi (`e2e/`)

`e2e/global-setup.ts` ustvari en jasno označen testni oglas pred zagonom (lasten obstoječemu `TEST_DEALER` računu), `e2e/global-teardown.ts` ga skupaj z vsemi povpraševanji/priljubljenimi, ki ga med testi referencirajo, izbriše takoj po zaključku — vedno, tudi če testi padejo. 42/42 testov je zelenih. Glej `e2e/README.md` za razlago te arhitekture (deli isto Supabase bazo s produkcijo — ni ločenega test projekta) in njeno mejo.

Rate limiting (`src/lib/rate-limit.ts`) je aktiven samo, ko `NODE_ENV === "production"` — kar velja za vsak pravi Vercel deploy (Preview ali Production), ne pa za lokalni `next dev`, kjer bi samo oviral razvoj in teste brez varnostne koristi.

## Znane preostale vrzeli

- Ni error monitoringa (Sentry ipd.) — samo `console.error` v Vercel function logih.
- Ni pravega upload UI-ja za dealer logotip — polje je URL vnos, ne file upload (v `/moj-racun/profil`).

## Deploy

Vercel projekt `info-salybearstuds-projects/mobilnahiska-next`, povezan z GitHub `eliivacic/mobilnahiska` (branch `main`). Cron job za opomnike o poteku definiran v `vercel.json`.
