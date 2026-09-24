import { test, expect } from "@playwright/test";
import { TEST_USER } from "./test-users";

test.describe("Unauthenticated redirect + returnTo", () => {
  test("11a. visiting /oddaj-oglas while logged out redirects to /prijava with a safe returnTo", async ({ page }) => {
    await page.goto("/oddaj-oglas");
    await page.waitForURL(/\/prijava/);
    const url = new URL(page.url());
    expect(url.searchParams.get("returnTo")).toBe("/oddaj-oglas");
  });

  test("11b. logging in via a returnTo link sends the user back to the original page", async ({ page }) => {
    await page.goto("/prijava?returnTo=%2Fmoj-racun%2Fprofil");
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/moj-racun\/profil/, { timeout: 15000 });
  });

  test("11c. an external returnTo is rejected and falls back to a safe default", async ({ page }) => {
    await page.goto("/prijava?returnTo=https://evil.example.com");
    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await page.waitForURL((url) => !url.pathname.startsWith("/prijava"), { timeout: 15000 });
    expect(page.url()).not.toContain("evil.example.com");
  });

  test("11d. favoriting while logged out explains why, then completes the save after login", async ({ page }) => {
    await page.goto("/oglasi");
    const card = page.locator('[data-testid="listing-card"]').first();
    const favoriteButton = card.getByRole("button", { name: "Dodaj med priljubljene" });
    await favoriteButton.click();

    await page.waitForURL(/\/prijava\?returnTo=/);

    await page.fill('input[name="email"]', TEST_USER.email);
    await page.fill('input[name="password"]', TEST_USER.password);
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/oglasi/, { timeout: 15000 });
    // The favorite should now be applied automatically without a second click.
    await expect(page.locator('[data-testid="listing-card"]').first().getByRole("button", { name: "Odstrani iz priljubljenih" })).toBeVisible({
      timeout: 10000,
    });
  });
});
