import { test, expect } from "@playwright/test";

test.describe("Dashboard (Subscribed User)", () => {
  test("shows Your Documents heading and New Document button", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: "Your Documents", level: 1 })
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText("Create a new document or continue where you left off.")).toBeVisible();
    await expect(page.getByRole("button", { name: "New Document" })).toBeVisible();
  });

  test("shows nav bar with Inkwell logo and account dropdown", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByText("Inkwell").first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: /inkwelltest@gmail\.com/ })).toBeVisible();
  });

  test("creates a new document and navigates to editor", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.getByRole("button", { name: "New Document" })).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "New Document" }).click();

    await page.waitForURL(/\/document\//, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/document\/.+/);

    await expect(page.getByRole("textbox", { name: "Untitled" })).toBeVisible({ timeout: 10_000 });
  });
});
