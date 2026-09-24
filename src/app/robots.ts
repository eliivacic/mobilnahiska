import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/moj-racun", "/prijava", "/registracija", "/pozabljeno-geslo", "/ponastavi-geslo"],
    },
    sitemap: "https://www.mobilnahiska.si/sitemap.xml",
  };
}
