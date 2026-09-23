# mobilnahiska.si

Slovenski marketplace za mobilne in modularne hiške — nove in rabljene, več prodajalcev, primerljivo strukturiran kot avtomobilski ali nepremičninski oglasnik.

Trenutna faza: **javni del marketplacea** (brskanje in iskanje). Brez uporabniških računov, plačil ali oddaje lastnega oglasa — glej [Kaj (še) ni implementirano](#kaj-še-ni-implementirano).

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Radix primitivi: select, checkbox, sheet, dialog, separator ...)
- **Lucide** ikone
- Mock podatki v TypeScriptu — ni baze, ni backenda

## Strani

| Pot | Opis |
|---|---|
| `/` | Naslovnica — iskalnik, hitri filtri, izpostavljeni + najnovejši oglasi |
| `/oglasi` | Seznam oglasov s filtri (tip, stanje, cena, površina, spalnice, leto, država, dostava) in sortiranjem — vse filtrira client-side |
| `/oglasi/[slug]` | Stran posameznega oglasa — galerija, specifikacije, opis, prodajalec |
| `/ponudniki`, `/vodici`, `/prijava`, `/oddaj-oglas` | Placeholder strani (funkcionalnost še ni implementirana) |

## Struktura

```
src/
  app/                 # routes (App Router)
  components/
    layout/             # Header, Footer, TopBar, ...
    listings/            # SearchBar, ListingCard, ListingFilters, ListingGallery, ...
    ui/                  # shadcn primitivi
  data/
    listings.ts          # 14 mock oglasov
    images.ts            # kurirane Unsplash arhitekturne fotografije (placeholder)
  lib/
    filter-listings.ts   # filter/sort logika za /oglasi
    format.ts             # cena, števila, slovenska sklanjatev množine
  types/
    listing.ts            # Listing, Seller tipi
```

## Design sistem

Vsi barvni/tipografski/radius tokeni so centralizirani v `src/app/globals.css` (CSS custom properties + Tailwind v4 `@theme`) — nič ni hardcodano po komponentah.

- Font: **Plus Jakarta Sans**
- Brand barva: temno navy (`#1E2749`), periwinkle akcent (`#E4D9FF`)
- Header/footer: temna navy varianta, ostalo svetlo/belo ozadje

## Zagon

```bash
npm install
npm run dev
```

Odpri [http://localhost:3000](http://localhost:3000).

```bash
npm run lint       # ESLint
npx tsc --noEmit    # TypeScript check
npm run build       # produkcijski build
```

## Kaj (še) ni implementirano

Namenoma izven scopea trenutne faze:

- uporabniški računi, prijava, avtentikacija
- oddaja lastnega oglasa
- plačila / monetizacija
- dealer dashboard
- admin panel
- realna baza podatkov / backend (podatki so v `src/data/listings.ts`)

Fotografije oglasov so placeholder (kurirane Unsplash arhitekturne fotografije, ne resnične fotografije prodajalcev).

## Deploy

Projekt je povezan z Vercel (`info-salybearstuds-projects/mobilnahiska-next`). Stran ima `noindex`/`robots.txt` (ni namenjena indeksiranju s strani iskalnikov v tej fazi).
