import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test.skip("should display profile page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });
});
