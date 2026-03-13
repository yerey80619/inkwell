import { test, expect } from "@playwright/test";

test.describe("AI Chat Panel", () => {
  test.skip("should display AI chat panel", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });
});
