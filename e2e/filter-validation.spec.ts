import { test, expect } from "@playwright/test";

test.describe("Numeric filter validation", () => {
  test("13a. an inverted price range (od > do) shows a clear error instead of a silent empty result", async ({ page }) => {
    await page.goto("/oglasi?priceMin=90000&priceMax=10000");
    const alert = page.getByRole("alert").filter({ hasText: "Cena" });
    await expect(alert).toContainText("Cena");
    await expect(alert).toContainText("od");
  });

  test("13b. an inverted area range is rejected the same way on the land page", async ({ page }) => {
    await page.goto("/zemljisca?areaMin=5000&areaMax=100");
    await expect(page.getByRole("alert").filter({ hasText: "Površina" })).toContainText("Površina");
  });

  test("13c. negative values are rejected by the min attribute on filter inputs", async ({ page }) => {
    await page.goto("/oglasi");
    const priceMin = page.locator("#price-min");
    await expect(priceMin).toHaveAttribute("min", "0");
    const yearMin = page.locator("#year-min");
    await expect(yearMin).toHaveAttribute("min", "1900");
  });

  test("13d. the homepage quick search also constrains inputs to non-negative values", async ({ page }) => {
    await page.goto("/");
    const searchPrice = page.locator("#search-price");
    await expect(searchPrice).toHaveAttribute("min", "0");
    const searchArea = page.locator("#search-area");
    await expect(searchArea).toHaveAttribute("min", "0");
  });
});
