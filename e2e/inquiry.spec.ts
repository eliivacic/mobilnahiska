import { test, expect } from "@playwright/test";
import { login } from "./helpers";
import { TEST_USER } from "./test-users";

// No email provider is configured in this environment (RESEND_API_KEY
// unset), so submitting an inquiry here never sends a real email — the
// inquiry row itself, not email delivery, is what these tests verify.

test.describe("Listing inquiry", () => {
  test("9. opens an accessible dialog and validates required fields", async ({ page }) => {
    await page.goto("/oglasi");
    const href = await page.locator('[data-testid="listing-card"]').first().getAttribute("href");
    await page.goto(href!);

    const trigger = page.getByRole("button", { name: "Pošlji povpraševanje" }).first();
    await trigger.focus();
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    // Focus should move into the dialog on open.
    await expect(dialog).toContainText("Pošlji povpraševanje");

    // Submitting without filling required fields should not close the dialog
    // (native "required" validation blocks it).
    await dialog.locator('button[type="submit"]').click();
    await expect(dialog).toBeVisible();

    // Close and confirm focus returns to the trigger.
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("10. a server-rejected submission shows an error and allows retry, then succeeds", async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);
    await page.goto("/oglasi");
    const href = await page.locator('[data-testid="listing-card"]').first().getAttribute("href");
    await page.goto(href!);

    await page.getByRole("button", { name: "Pošlji povpraševanje" }).first().click();
    const dialog = page.getByRole("dialog");

    await dialog.locator("#inquiry-name").fill("E2E Test");
    await dialog.locator("#inquiry-email").fill("e2e-test@example.com");
    // Too short to pass server-side validation (min 5 chars) but long enough
    // to pass the browser's native `required` check — genuinely exercises
    // the server error path, not just client-side validation.
    await dialog.locator("#inquiry-message").fill("hi");
    await dialog.locator('button[type="submit"]').click();

    await expect(dialog.getByRole("alert")).toContainText("prekratko", { timeout: 10000 });
    await expect(dialog).toBeVisible();

    // Retry with a valid message — the dialog must still be usable.
    await dialog.locator("#inquiry-message").fill("Avtomatiziran E2E test povpraševanja.");
    await dialog.locator('button[type="submit"]').click();

    await expect(dialog.getByText("Povpraševanje je oddano")).toBeVisible({ timeout: 10000 });
    await dialog.getByRole("button", { name: "Zapri" }).click();
    await expect(dialog).not.toBeVisible();
  });
});
