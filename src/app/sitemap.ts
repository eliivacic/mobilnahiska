import type { MetadataRoute } from "next";
import { listings, getProviders } from "@/data/listings";
import { lands } from "@/data/land";
import { guides } from "@/data/guides";

const BASE_URL = "https://www.mobilnahiska.si";

// Only real, canonical, publicly indexable pages — no query-param filter
// variants, no auth/account/admin pages, no 404. Rebuilt on every request
// (this route is dynamic) so it always reflects the current data.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/oglasi`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/zemljisca`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE_URL}/ponudniki`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/vodici`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/cene`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/pogoji`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/zasebnost`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/piskotki`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const listingPages: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${BASE_URL}/oglasi/${listing.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const landPages: MetadataRoute.Sitemap = lands.map((land) => ({
    url: `${BASE_URL}/zemljisca/${land.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/vodici/${guide.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const providerPages: MetadataRoute.Sitemap = getProviders().map((provider) => ({
    url: `${BASE_URL}/ponudniki/${provider.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...listingPages, ...landPages, ...guidePages, ...providerPages];
}
