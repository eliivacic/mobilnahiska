// A public provider profile is a real `dealer`-role user's profile — see
// src/lib/providers/public.ts. There is no separate "providers" table: a
// dealer becomes a public provider the moment they set a company name (which
// generates their provider_slug) in /moj-racun/profil.
export interface Provider {
  userId: string;
  name: string;
  slug: string;
  location: string;
  phone: string;
  activeListings: number;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
}
