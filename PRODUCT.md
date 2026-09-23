# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Buyers browsing for a mobile/modular home in Slovenia and neighboring countries (Croatia, Italy, Austria) — private individuals looking for a weekend cabin, retirement home, or full-time compact housing, and dealers/private sellers listing their inventory. [Inferred from the build brief and existing copy across this session, not a live interview — I already hold high-confidence answers from authoring the codebase directly.]

## Product Purpose
mobilnahiska.si is a specialized Slovenian marketplace for mobile houses, modular houses, new and used units — closer in feel to a serious car or real-estate classifieds portal than a generic SaaS product. Current milestone is the public browsing experience only (homepage, listing search/filter, listing detail) — no accounts, payments, listing submission, or dealer dashboard yet.

## Positioning
A vertical-specific marketplace (not a general classifieds site) for mobile/modular housing, with listing data structured around the specs buyers actually compare: type, condition, area, dimensions, bedrooms/bathrooms, capacity, year, delivery availability.

## Operating Context
Next.js 16 App Router + TypeScript + Tailwind v4 + shadcn/ui, local TypeScript mock data (`src/data/listings.ts`, 14 listings), no backend yet. Routes: `/`, `/oglasi` (filtered/sorted listing grid), `/oglasi/[slug]` (listing detail), plus placeholder stubs for `/ponudniki`, `/vodici`, `/prijava`, `/oddaj-oglas`.

## Capabilities and Constraints
Client-side filtering/sorting on `/oglasi` (type, condition, price, area, bedrooms, year, country, delivery). No real backend, auth, payments, or listing-submission flow — explicitly out of scope for this milestone. All copy is Slovenian.

## Brand Commitments
Wordmark: mobilnahiska.si (lowercase, no space). Explicit brand palette set by the user: `#FAFAFF` background, `#1E2749` (deep navy) foreground/brand, `#30343F` secondary text, `#E4D9FF` (periwinkle) accent/border. Typeface: Cabin (Google Font). Design direction explicitly rejects generic AI/SaaS patterns: no gradients, no glassmorphism, no oversized rounded corners, no generic hero banners, no fabricated trust claims (e.g. "verified sellers") the product doesn't actually implement.

## Evidence on Hand
Listing photography is placeholder: curated real Unsplash architecture photos of tiny/modular cabins (`src/data/images.ts`), not the seller's real photos. Future work must not present these as real listing photography once real photos exist.

## Product Principles
- Photography, price, and specs are the product — the interface should stay out of their way, not compete with them.
- Read as a purpose-built property/classifieds portal, not a template or AI-generated landing page.
- Preserve the brand palette and Cabin typeface the user explicitly set — elevate craft and execution, not the color/type identity.
- Information density over marketing whitespace; this is a browsing tool, not a persuasion landing page.
- Never state a capability (verification, dealer trust, delivery guarantees) the product doesn't actually implement.
