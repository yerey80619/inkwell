import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display the auth form", async ({ page }) => {
    await page.goto("/auth");
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});
