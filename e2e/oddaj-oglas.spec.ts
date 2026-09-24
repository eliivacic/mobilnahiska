import { test, expect } from "@playwright/test";
import path from "node:path";
import { login } from "./helpers";
import { TEST_USER } from "./test-users";

const SAMPLE_IMAGE = path.resolve(process.cwd(), "public/logo-mark.png");

test.describe("Submit a listing (oddaj oglas)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);
  });

  test("12a. invalid data blocks preview with a clear client-side error", async ({ page }) => {
    await page.goto("/oddaj-oglas");
    await page.getByRole("button", { name: "Mobilna hiška" }).click();
    // Leave everything empty and try to preview.
    await page.getByRole("button", { name: "Predogled oglasa" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /./ })).toBeVisible();
    // Must not have advanced to the preview/submit step.
    await expect(page.getByRole("button", { name: "Oddaj oglas", exact: true })).not.toBeVisible();
  });

  test("12b. valid data previews and submits successfully with a pending-review status", async ({ page }) => {
    const uniqueTitle = `E2E testni oglas mobilna hiška ${Date.now()}`;

    await page.goto("/oddaj-oglas");
    await page.getByRole("button", { name: "Mobilna hiška" }).click();

    await page.fill("#title", uniqueTitle);
    await page.fill("#description", "Avtomatiziran E2E test celotnega toka oddaje oglasa.");
    await page.fill("#price", "22000");
    await page.fill("#location", "Maribor");

    await page.click("#condition");
    await page.getByRole("option", { name: "Nova" }).click();
    await page.fill("#manufacturer", "E2E Manufacturer");
    await page.fill("#year", "2023");
    await page.fill("#area", "24");
    await page.fill("#length", "7");
    await page.fill("#width", "3");
    await page.fill("#bedrooms", "1");
    await page.fill("#bathrooms", "1");
    await page.fill("#capacity", "2");

    await page.fill("#contactName", "E2E Test");
    await page.fill("#contactPhone", "031 000 000");
    await page.fill("#contactEmail", "e2e@example.com");

    await page.setInputFiles('input[type="file"]', SAMPLE_IMAGE);
    // Uploading goes to real Supabase Storage — wait for the hidden field to
    // actually contain a URL instead of a fixed sleep.
    await expect(async () => {
      const value = await page.locator('input[name="photoUrls"]').inputValue();
      expect(JSON.parse(value)).toHaveLength(1);
    }).toPass({ timeout: 15000 });

    await page.getByRole("button", { name: "Predogled oglasa" }).click();
    await expect(page.getByRole("heading", { name: "Predogled oglasa" })).toBeVisible();

    await page.getByRole("button", { name: "Oddaj oglas", exact: true }).click();
    await expect(page.getByText("Oglas je bil oddan")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("V pregledu")).toBeVisible();

    await page.getByRole("link", { name: "Pojdi na Moji oglasi" }).click();
    await page.waitForURL(/\/moj-racun\/oglasi/);
    await expect(page.getByText(uniqueTitle)).toBeVisible();
    await expect(page.getByText("V pregledu").first()).toBeVisible();
  });
});
