import { test, expect } from "@playwright/test";

async function firstListingUrl(page: import("@playwright/test").Page) {
  await page.goto("/oglasi");
  const href = await page.locator('[data-testid="listing-card"]').first().getAttribute("href");
  return href!;
}

test.describe("Listing gallery", () => {
  test("7. thumbnail toggle updates the accessible pressed state", async ({ page }) => {
    await page.goto(await firstListingUrl(page));

    const thumbnails = page.locator('button[aria-label^="Fotografija"]');
    const count = await thumbnails.count();
    test.skip(count < 2, "Listing needs at least 2 photos for this test");

    await expect(thumbnails.nth(0)).toHaveAttribute("aria-pressed", "true");
    await expect(thumbnails.nth(1)).toHaveAttribute("aria-pressed", "false");

    await thumbnails.nth(1).click();

    await expect(thumbnails.nth(0)).toHaveAttribute("aria-pressed", "false");
    await expect(thumbnails.nth(1)).toHaveAttribute("aria-pressed", "true");
  });
});

test.describe("Phone reveal", () => {
  test("8. revealing the phone number renders a callable tel: link", async ({ page }) => {
    await page.goto(await firstListingUrl(page));

    await page.getByRole("button", { name: "Prikaži telefon" }).click();

    const telLink = page.locator('a[href^="tel:"]');
    await expect(telLink).toBeVisible();
    const href = await telLink.getAttribute("href");
    expect(href).toMatch(/^tel:\+\d+$/);
  });
});
