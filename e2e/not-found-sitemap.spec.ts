import { test, expect } from "@playwright/test";

test.describe("404 page", () => {
  test("16. an unknown route returns a real HTTP 404 with the right title and working links", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist-e2e");
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle("Stran ni najdena | mobilnahiska.si");

    await page.getByRole("link", { name: "Nazaj na oglase" }).click();
    await page.waitForURL(/\/oglasi/);
  });

  test("16b. /oglasi/[slug] with an invalid slug also returns 404", async ({ page }) => {
    const response = await page.goto("/oglasi/ne-obstaja-e2e-test-slug");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Sitemap", () => {
  test("17. /sitemap.xml is valid, publicly served XML with the core public pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");

    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("https://www.mobilnahiska.si/oglasi</loc>");
    expect(body).not.toContain("/moj-racun");
    expect(body).not.toContain("/admin");
    expect(body).not.toContain("/prijava");
  });

  test("17b. robots.txt references the sitemap and allows crawling", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("sitemap.xml");
    expect(body).not.toMatch(/Disallow:\s*\/\s*$/m);
  });
});
