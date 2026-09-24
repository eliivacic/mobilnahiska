import { test, expect } from "@playwright/test";

test.describe("Registration validation", () => {
  test("15a. mismatched passwords are rejected without creating an account", async ({ page }) => {
    await page.goto("/registracija");
    await page.fill('input[name="fullName"]', "E2E Novi Uporabnik");
    await page.fill('input[name="email"]', `e2e-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "geslo1234");
    await page.fill('input[name="passwordConfirm"]', "drugacnogeslo");
    await page.check('#termsAccepted');
    await page.click('button[type="submit"]');

    await expect(page.getByText("Gesli se ne ujemata.")).toBeVisible();
    // Still on the registration form — no account/session was created.
    await expect(page).toHaveURL(/\/registracija/);
  });

  test("15b. submitting without accepting the terms is rejected", async ({ page }) => {
    await page.goto("/registracija");
    await page.fill('input[name="fullName"]', "E2E Novi Uporabnik");
    await page.fill('input[name="email"]', `e2e-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "geslo1234");
    await page.fill('input[name="passwordConfirm"]', "geslo1234");
    // termsAccepted left unchecked.
    await page.click('button[type="submit"]');

    await expect(page.getByText("Za registracijo morate sprejeti pogoje uporabe.")).toBeVisible();
    await expect(page).toHaveURL(/\/registracija/);
  });

  test("15c. a short password is rejected with an inline, field-associated error", async ({ page }) => {
    await page.goto("/registracija");
    await page.fill('input[name="fullName"]', "E2E Novi Uporabnik");
    await page.fill('input[name="email"]', `e2e-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "short");
    await page.fill('input[name="passwordConfirm"]', "short");
    await page.check('#termsAccepted');
    await page.click('button[type="submit"]');

    const passwordInput = page.locator("#password");
    await expect(passwordInput).toHaveAttribute("aria-invalid", "true");
  });
});
