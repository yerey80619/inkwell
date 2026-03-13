import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should redirect unauthenticated users to auth", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth/);
  });
});
