import { test, expect } from "@playwright/test";

test.describe("Home search and listing filters", () => {
  test("1. search from homepage with multiple filters navigates to filtered results", async ({ page }) => {
    await page.goto("/");
    // The homepage search bar's tab is the first "Mobilne hiške" button in
    // document order (the "Najnovejši oglasi" tabs further down are the other).
    await page.getByRole("button", { name: "Mobilne hiške" }).first().click();
    await page.locator("#search-price").fill("40000");
    await page.locator("#search-area").fill("20");
    await page.getByRole("button", { name: "Prikaži oglase" }).click();

    await page.waitForURL(/\/oglasi\?/);
    const url = new URL(page.url());
    expect(url.searchParams.get("type")).toBe("mobilna");
    expect(url.searchParams.get("priceMax")).toBe("40000");
    expect(url.searchParams.get("areaMin")).toBe("20");
  });

  test("2. opening a filtered URL directly restores all filters", async ({ page }) => {
    await page.goto("/oglasi?type=modularna&condition=nova&priceMax=60000&bedrooms=2,3");
    await expect(page.getByRole("heading", { name: "Modularne hiše naprodaj" })).toBeVisible();

    // Desktop sidebar checkboxes should reflect the URL-derived state.
    const sidebar = page.locator("aside").first();
    await expect(sidebar.getByRole("checkbox", { name: "Modularna hiša" })).toBeChecked();
    await expect(sidebar.getByRole("checkbox", { name: "Nova" })).toBeChecked();
    await expect(page.locator("#price-max")).toHaveValue("60000");
  });

  test("3. filters survive a full page reload", async ({ page }) => {
    await page.goto("/oglasi?type=mobilna&priceMax=50000");
    await page.reload();
    const url = new URL(page.url());
    expect(url.searchParams.get("type")).toBe("mobilna");
    expect(url.searchParams.get("priceMax")).toBe("50000");
    await expect(page.locator("#price-max")).toHaveValue("50000");
  });

  test("4. Ponastavi filtre clears all params including sort", async ({ page }) => {
    await page.goto("/oglasi?type=mobilna&priceMax=50000&sort=price-asc");
    await page.getByRole("button", { name: "Ponastavi filtre" }).first().click();
    await page.waitForURL((url) => url.search === "");
    const url = new URL(page.url());
    expect(url.search).toBe("");
  });

  test("5. sorting by price updates the sort query param and result order", async ({ page }) => {
    await page.goto("/oglasi");
    await page.getByLabel("Razvrsti oglase").click();
    await page.getByRole("option", { name: "Cena naraščajoče" }).click();
    await page.waitForURL(/sort=price-asc/);
    expect(new URL(page.url()).searchParams.get("sort")).toBe("price-asc");

    const prices = await page.locator('[data-testid="listing-price"]').evaluateAll((nodes) =>
      nodes.map((node) => Number(node.getAttribute("data-price")))
    );
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test("6. featured=true shows only featured listings", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Vse izpostavljene" }).click();
    await page.waitForURL(/featured=true/);
    await expect(page.getByRole("heading", { name: "Izpostavljeni oglasi" })).toBeVisible();
  });

  test("browser back/forward restores previous filter state", async ({ page }) => {
    await page.goto("/oglasi");
    await page.waitForLoadState("networkidle");
    await page.goto("/oglasi?type=mobilna");
    await page.waitForLoadState("networkidle");
    await page.goto("/oglasi?type=modularna");
    await page.waitForLoadState("networkidle");

    await page.goBack();
    await page.waitForURL((url) => url.searchParams.get("type") === "mobilna");
    expect(new URL(page.url()).searchParams.get("type")).toBe("mobilna");

    await page.goBack();
    await page.waitForURL((url) => !url.search);
    expect(new URL(page.url()).searchParams.get("type")).toBeNull();
  });
});

test.describe("Land page naming and filters", () => {
  test("zemljisca defaults to the generic heading and filters persist in the URL", async ({ page }) => {
    await page.goto("/zemljisca");
    await expect(page.getByRole("heading", { name: "Zemljišča" })).toBeVisible();

    await page.goto("/zemljisca?landType=kmetijsko");
    await expect(page.getByRole("heading", { name: "Kmetijska zemljišča" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Zazidljiva zemljišča" })).not.toBeVisible();
  });
});
