import type { Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string, returnTo?: string) {
  const url = returnTo ? `/prijava?returnTo=${encodeURIComponent(returnTo)}` : "/prijava";
  await page.goto(url);
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL((current) => !current.pathname.startsWith("/prijava"), { timeout: 15000 });
}
