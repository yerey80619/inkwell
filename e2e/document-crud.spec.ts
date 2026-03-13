import { test, expect } from "@playwright/test";

test.describe("Document CRUD", () => {
  test.skip("should create a new document", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
