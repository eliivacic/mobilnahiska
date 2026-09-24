import { test, expect } from "@playwright/test";

// No SMTP/email provider is configured for this project's Supabase instance
// yet (see technical report) — Supabase's own rate-limited default mailer is
// used, so we don't assert an email actually arrives here. We assert the
// user-facing contract instead: the request always succeeds visibly and
// never reveals whether the address is registered.

test.describe("Forgot password", () => {
  test("14a. the link is reachable from the login page", async ({ page }) => {
    await page.goto("/prijava");
    await page.getByRole("link", { name: "Pozabljeno geslo?" }).click();
    await page.waitForURL(/\/pozabljeno-geslo/);
    await expect(page.getByRole("heading", { name: "Pozabljeno geslo" })).toBeVisible();
  });

  test("14b. submitting a registered email shows the neutral success message", async ({ page }) => {
    await page.goto("/pozabljeno-geslo");
    await page.fill('input[name="email"]', "uporabnik@mobilnahiska.si");
    await page.click('button[type="submit"]');
    await expect(page.getByRole("status")).toContainText("Če e-poštni naslov obstaja");
  });

  test("14c. submitting an unregistered email shows the exact same neutral message", async ({ page }) => {
    await page.goto("/pozabljeno-geslo");
    await page.fill('input[name="email"]', "definitely-not-registered@example.com");
    await page.click('button[type="submit"]');
    await expect(page.getByRole("status")).toContainText("Če e-poštni naslov obstaja");
  });

  test("14d. /ponastavi-geslo without a recovery session redirects back to the request form", async ({ page }) => {
    await page.goto("/ponastavi-geslo");
    await page.waitForURL(/\/pozabljeno-geslo/);
  });
});
