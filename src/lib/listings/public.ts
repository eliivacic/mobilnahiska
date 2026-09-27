import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Listing, Country, HouseType } from "@/types/listing";
import type { Land, LandType } from "@/types/land";

// The only place the public marketplace (homepage, /oglasi, /zemljisca and
// their detail pages, search, filters) reads listing data from. Everything
// here queries `listing_submissions` — the same table /oddaj-oglas writes to
// and /admin/oglasi moderates — filtered to status = 'published' and not
// expired. There is no second listing system; this only maps DB rows onto
// the existing Listing/Land shapes so every component built for the static
// mock catalog (src/data/*.ts) keeps working unchanged.

type SubmissionRow = {
  id: string;
  user_id: string;
  type: "mobilna" | "modularna" | "zemljisce";
  title: string;
  slug: string | null;
  description: string;
  price: number;
  location: string;
  country: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  condition: string | null;
  manufacturer: string | null;
  year: number | null;
  area: number | null;
  length: number | null;
  width: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  capacity: number | null;
  delivery_available: boolean | null;
  land_type: string | null;
  utilities_available: boolean | null;
  features: string[] | null;
  photo_urls: string[];
  is_top: boolean;
  is_featured_homepage: boolean;
  is_exclusive: boolean;
  created_at: string;
};

const PUBLISHED_SELECT =
  "id, user_id, type, title, slug, description, price, location, country, contact_name, contact_phone, contact_email, condition, manufacturer, year, area, length, width, bedrooms, bathrooms, capacity, delivery_available, land_type, utilities_available, features, photo_urls, is_top, is_featured_homepage, is_exclusive, created_at";

function isCountry(value: string): value is Country {
  return value === "Slovenija" || value === "Hrvaška" || value === "Italija" || value === "Avstrija" || value === "ostalo";
}

function toListing(row: SubmissionRow, sellerIsDealer: boolean): Listing {
  return {
    id: row.id,
    slug: row.slug ?? row.id,
    title: row.title,
    manufacturer: row.manufacturer ?? "",
    price: Number(row.price),
    year: row.year ?? new Date(row.created_at).getFullYear(),
    condition: row.condition === "nova" ? "nova" : "rabljena",
    type: row.type as HouseType,
    area: Number(row.area ?? 0),
    width: Number(row.width ?? 0),
    length: Number(row.length ?? 0),
    bedrooms: row.bedrooms ?? 0,
    bathrooms: row.bathrooms ?? 0,
    capacity: row.capacity ?? 0,
    location: row.location,
    country: isCountry(row.country) ? row.country : "ostalo",
    deliveryAvailable: Boolean(row.delivery_available),
    featured: row.is_top,
    description: row.description,
    features: row.features ?? [],
    images: row.photo_urls,
    seller: {
      name: row.contact_name,
      type: sellerIsDealer ? "Profesionalni prodajalec" : "Zasebnik",
      location: row.location,
      country: isCountry(row.country) ? row.country : "ostalo",
      phone: row.contact_phone,
      memberSince: new Date(row.created_at).getFullYear(),
    },
    createdAt: row.created_at,
  };
}

function toLand(row: SubmissionRow): Land {
  return {
    id: row.id,
    slug: row.slug ?? row.id,
    title: row.title,
    price: Number(row.price),
    area: Number(row.area ?? 0),
    type: (row.land_type as LandType) ?? "ostalo",
    location: row.location,
    country: isCountry(row.country) ? row.country : "ostalo",
    exclusive: row.is_exclusive,
    utilitiesAvailable: Boolean(row.utilities_available),
    description: row.description,
    images: row.photo_urls,
    createdAt: row.created_at,
    contactName: row.contact_name,
    contactPhone: row.contact_phone,
  };
}

// Dealer status affects only how the seller badge renders — looked up once
// for the whole batch instead of per-row to avoid N+1 queries.
async function dealerUserIds(userIds: string[]): Promise<Set<string>> {
  if (userIds.length === 0) return new Set();
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("id, role").in("id", userIds).eq("role", "dealer");
  return new Set((data ?? []).map((row) => row.id));
}

export async function getPublishedHouseListings(): Promise<Listing[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("listing_submissions")
    .select(PUBLISHED_SELECT)
    .eq("status", "published")
    .in("type", ["mobilna", "modularna"])
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false })
    .returns<SubmissionRow[]>();

  const rows = data ?? [];
  const dealers = await dealerUserIds([...new Set(rows.map((r) => r.user_id))]);
  return rows.map((row) => toListing(row, dealers.has(row.user_id)));
}

export async function getPublishedLands(): Promise<Land[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("listing_submissions")
    .select(PUBLISHED_SELECT)
    .eq("status", "published")
    .eq("type", "zemljisce")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false })
    .returns<SubmissionRow[]>();

  return (data ?? []).map(toLand);
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("listing_submissions")
    .select(PUBLISHED_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .in("type", ["mobilna", "modularna"])
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .maybeSingle<SubmissionRow>();

  if (!data) return null;
  const dealers = await dealerUserIds([data.user_id]);
  return toListing(data, dealers.has(data.user_id));
}

export async function getLandBySlug(slug: string): Promise<Land | null> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("listing_submissions")
    .select(PUBLISHED_SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .eq("type", "zemljisce")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .maybeSingle<SubmissionRow>();

  if (!data) return null;
  return toLand(data);
}

export async function getFeaturedListings(count = 8): Promise<Listing[]> {
  const all = await getPublishedHouseListings();
  const featured = all.filter((l) => l.featured);
  return (featured.length > 0 ? featured : all).slice(0, count);
}

export async function getLatestListings(count = 8): Promise<Listing[]> {
  return (await getPublishedHouseListings()).slice(0, count);
}

export async function getExclusiveLands(count = 4): Promise<Land[]> {
  const all = await getPublishedLands();
  const exclusive = all.filter((l) => l.exclusive);
  return exclusive.slice(0, count);
}

// Listings currently placed in the homepage "featured" section via a paid
// Izpostavitev na naslovnici add-on (distinct from the TOP badge above).
export async function getHomepageFeaturedListings(count = 8): Promise<Listing[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("listing_submissions")
    .select(PUBLISHED_SELECT)
    .eq("status", "published")
    .eq("is_featured_homepage", true)
    .in("type", ["mobilna", "modularna"])
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false })
    .limit(count)
    .returns<SubmissionRow[]>();

  const rows = data ?? [];
  const dealers = await dealerUserIds([...new Set(rows.map((r) => r.user_id))]);
  return rows.map((row) => toListing(row, dealers.has(row.user_id)));
}

export async function getListingsByProviderUserId(userId: string): Promise<Listing[]> {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("listing_submissions")
    .select(PUBLISHED_SELECT)
    .eq("status", "published")
    .eq("user_id", userId)
    .in("type", ["mobilna", "modularna"])
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("created_at", { ascending: false })
    .returns<SubmissionRow[]>();

  return (data ?? []).map((row) => toListing(row, true));
}
