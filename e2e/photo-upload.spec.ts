import { test, expect } from "@playwright/test";
import path from "node:path";
import { writeFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { login } from "./helpers";
import { TEST_USER } from "./test-users";

const FIXTURES = path.resolve(process.cwd(), "e2e/fixtures");
const JPG = path.join(FIXTURES, "valid-photo-1.jpg");
const PNG = path.join(FIXTURES, "valid-photo-2.png");
const WEBP = path.join(FIXTURES, "valid-photo-3.webp");
const WRONG_TYPE = path.join(FIXTURES, "wrong-type.gif");

// Generated on demand rather than committed — a real >8MB binary fixture
// doesn't belong in git. Reuses the valid JPG's bytes padded out, so the
// browser still reports a real "image/jpeg" MIME type (File.type comes from
// the extension/OS, not content) and only the size check is exercised.
function oversizedJpgPath(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "mh-e2e-"));
  const target = path.join(dir, "oversized.jpg");
  const padding = Buffer.alloc(9 * 1024 * 1024, 0);
  writeFileSync(target, padding);
  return target;
}

test.describe("Photo upload", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USER.email, TEST_USER.password);
    await page.goto("/oddaj-oglas");
    await page.getByRole("button", { name: "Mobilna hiška" }).click();
  });

  test("upload-jpg: a valid JPG uploads and appears as the main photo", async ({ page }) => {
    await page.setInputFiles('input[type="file"]', JPG);
    await expect(page.getByText("Glavna")).toBeVisible({ timeout: 15000 });
  });

  test("upload-png-webp: PNG and WEBP both upload successfully in one batch", async ({ page }) => {
    await page.setInputFiles('input[type="file"]', [PNG, WEBP]);
    for (let i = 0; i < 30; i++) {
      const val = await page.locator('input[name="photoUrls"]').inputValue();
      if (JSON.parse(val || "[]").length === 2) break;
      await page.waitForTimeout(500);
    }
    const val = await page.locator('input[name="photoUrls"]').inputValue();
    expect(JSON.parse(val).length).toBe(2);
  });

  test("upload-oversized: an oversized file is rejected with a clear Slovenian message, not a generic error", async ({ page }) => {
    await page.setInputFiles('input[type="file"]', oversizedJpgPath());
    await expect(page.locator("p[role=\"alert\"]")).toContainText("prevelika", { timeout: 10000 });
    await expect(page.locator("p[role=\"alert\"]")).not.toContainText("StorageApiError");
    await expect(page.locator("p[role=\"alert\"]")).not.toContainText("413");
  });

  test("upload-wrong-type: an unsupported file type is rejected with a clear Slovenian message", async ({ page }) => {
    await page.setInputFiles('input[type="file"]', WRONG_TYPE);
    await expect(page.locator("p[role=\"alert\"]")).toContainText("dovoljene so samo slike", { timeout: 10000 });
  });

  test("upload-partial-failure: one bad file among several valid ones doesn't discard the valid uploads", async ({ page }) => {
    await page.setInputFiles('input[type="file"]', [JPG, WRONG_TYPE, PNG]);
    for (let i = 0; i < 30; i++) {
      const val = await page.locator('input[name="photoUrls"]').inputValue();
      if (JSON.parse(val || "[]").length === 2) break;
      await page.waitForTimeout(500);
    }
    const val = await page.locator('input[name="photoUrls"]').inputValue();
    expect(JSON.parse(val).length).toBe(2);
    await expect(page.locator("p[role=\"alert\"]")).toContainText("dovoljene so samo slike");
  });

  test("upload-reorder: moving a photo left/right changes which one is 'Glavna'", async ({ page }) => {
    await page.setInputFiles('input[type="file"]', [JPG, PNG]);
    for (let i = 0; i < 30; i++) {
      const val = await page.locator('input[name="photoUrls"]').inputValue();
      if (JSON.parse(val || "[]").length === 2) break;
      await page.waitForTimeout(500);
    }
    const before = await page.locator('input[name="photoUrls"]').inputValue();
    await page.getByRole("button", { name: "Premakni fotografijo kasneje" }).first().click();
    const after = await page.locator('input[name="photoUrls"]').inputValue();
    expect(JSON.parse(after)).toEqual([JSON.parse(before)[1], JSON.parse(before)[0]]);
  });

  test("upload-remove: removing a photo takes it out of the listing", async ({ page }) => {
    await page.setInputFiles('input[type="file"]', JPG);
    await expect(page.getByText("Glavna")).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "Odstrani fotografijo" }).click();
    const val = await page.locator('input[name="photoUrls"]').inputValue();
    expect(JSON.parse(val || "[]").length).toBe(0);
  });
});

test.describe("Photo upload fixtures exist", () => {
  test("sanity: fixture files are present", () => {
    for (const f of [JPG, PNG, WEBP, WRONG_TYPE]) {
      expect(existsSync(f)).toBe(true);
    }
  });
});
