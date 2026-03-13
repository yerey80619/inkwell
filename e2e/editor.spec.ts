import { test, expect } from "@playwright/test";

test.describe("Document Editor", () => {
  test.skip("should load the editor", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });
});
