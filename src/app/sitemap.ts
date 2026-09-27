import type { MetadataRoute } from "next";
import { getPublishedHouseListings, getPublishedLands } from "@/lib/listings/public";
import { getProviders } from "@/lib/providers/public";
import { getPublishedArticles } from "@/lib/articles/public";

const BASE_URL = "https://www.mobilnahiska.si";

// Only real, canonical, publicly indexable pages — no query-param filter
// variants, no auth/account/admin pages, no 404. Rebuilt on every request
// (this route is dynamic) so it always reflects the current data.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const [houseListings, lands, providers, articles] = await Promise.all([
    getPublishedHouseListings(),
    getPublishedLands(),
    getProviders(),
    getPublishedArticles(),
  ]);

  const listingPages: MetadataRoute.Sitemap = houseListings.map((listing) => ({
    url: `${BASE_URL}/oglasi/${listing.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const landPages: MetadataRoute.Sitemap = lands.map((land) => ({
    url: `${BASE_URL}/zemljisca/${land.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/vodici/${article.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const providerPages: MetadataRoute.Sitemap = providers
    .filter((provider) => provider.slug)
    .map((provider) => ({
      url: `${BASE_URL}/ponudniki/${provider.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  return [...staticPages, ...listingPages, ...landPages, ...guidePages, ...providerPages];
}
