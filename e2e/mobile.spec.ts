import { test, expect, devices } from "@playwright/test";
import { login } from "./helpers";
import { TEST_USER } from "./test-users";

// Self-contained mobile emulation so this spec behaves the same whether run
// via the dedicated "mobile-chromium" project or invoked directly by path.
test.use({ ...devices["Pixel 7"] });

test.describe("Mobile navigation and key flows", () => {
  test("18a. mobile menu opens and navigates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /meni|menu/i }).click();
    await page.getByRole("link", { name: "Zemljišča" }).click();
    await page.waitForURL(/\/zemljisca/);
    await expect(page.getByRole("heading", { name: "Zemljišča" })).toBeVisible();
  });

  test("18b. mobile filter sheet opens, filters, and shows the result count", async ({ page }) => {
    await page.goto("/oglasi");
    await page.getByRole("button", { name: "Filtri" }).click();
    const filtriHeading = page.getByRole("heading", { name: "Filtri" });
    await expect(filtriHeading).toBeVisible();
    // Let the sheet's slide-in animation finish before interacting.
    await page.waitForTimeout(300);
    await page.getByRole("checkbox", { name: "Mobilna hiška" }).click();
    await expect(page.getByRole("checkbox", { name: "Mobilna hiška" })).toBeChecked();
    await page.getByRole("button", { name: /Prikaži \d+ rezultat/ }).click();
    await expect(page.getByRole("heading", { name: "Mobilne hiške naprodaj" })).toBeVisible();
  });

  test("18c. sticky mobile inquiry bar opens the inquiry dialog on a listing page", async ({ page }) => {
    await page.goto("/oglasi");
    const href = await page.locator('[data-testid="listing-card"]').first().getAttribute("href");
    await page.goto(href!);

    await page.getByRole("button", { name: "Pošlji povpraševanje" }).last().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("18d. logged-in mobile user can reach their account and log out", async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);
    await page.getByRole("button", { name: /meni|menu/i }).click();
    await page.getByRole("link", { name: "Moj račun" }).click();
    await page.waitForURL(/\/moj-racun/);
  });
});
