import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Provider } from "@/types/provider";
import { getListingsByProviderUserId } from "@/lib/listings/public";

// A provider IS a dealer-role profiles row with a provider_slug — set once
// the dealer saves a company name in /moj-racun/profil (see updateProfile in
// src/lib/supabase/actions.ts). No separate "providers" table, no mock data.
type ProfileRow = {
  id: string;
  company_name: string | null;
  provider_slug: string | null;
  location: string | null;
  phone: string | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
};

async function countActiveListings(userId: string): Promise<number> {
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();
  const { count } = await admin
    .from("listing_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "published")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`);
  return count ?? 0;
}

function toProvider(row: ProfileRow, activeListings: number): Provider {
  return {
    userId: row.id,
    name: row.company_name ?? "",
    slug: row.provider_slug ?? "",
    location: row.location ?? "",
    phone: row.phone ?? "",
    activeListings,
    description: row.description,
    website: row.website,
    logoUrl: row.logo_url,
  };
}

export async function getProviders(): Promise<Provider[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, company_name, provider_slug, location, phone, description, website, logo_url")
    .eq("role", "dealer")
    .not("provider_slug", "is", null)
    .returns<ProfileRow[]>();

  const rows = data ?? [];
  const providers = await Promise.all(
    rows.map(async (row) => toProvider(row, await countActiveListings(row.id)))
  );
  return providers.sort((a, b) => b.activeListings - a.activeListings);
}

export async function getProviderBySlug(slug: string): Promise<Provider | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, company_name, provider_slug, location, phone, description, website, logo_url")
    .eq("role", "dealer")
    .eq("provider_slug", slug)
    .maybeSingle<ProfileRow>();

  if (!data) return null;
  return toProvider(data, await countActiveListings(data.id));
}

export async function getListingsByProviderSlug(slug: string) {
  const provider = await getProviderBySlug(slug);
  if (!provider) return [];
  return getListingsByProviderUserId(provider.userId);
}
