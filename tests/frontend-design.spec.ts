import { test, expect } from "@playwright/test";

test.describe("Frontend Design Page", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("renders design system without authentication", async ({ page }) => {
    await page.goto("/frontend-design");

    await expect(
      page.getByRole("heading", { name: "Inkwell Design System", level: 1 })
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "Typography", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Colors", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Components", level: 2 })).toBeVisible();
  });

  test("/design-system returns 404 (known dead link)", async ({ page }) => {
    const response = await page.goto("/design-system");
    expect(response?.status()).toBe(404);
  });
});
