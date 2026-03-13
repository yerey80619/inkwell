import { test, expect } from "@playwright/test";

test.describe("Knowledge Panel", () => {
  test.skip("should display knowledge panel", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });
});
