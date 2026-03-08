import { test, expect } from "@playwright/test";

test.describe("Document Editor", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByRole("button", { name: "New Document" })).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "New Document" }).click();
    await page.waitForURL(/\/document\//, { timeout: 10_000 });
  });

  test("shows three-panel layout with editor toolbar", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Knowledge" })).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();

    await expect(page.getByRole("button", { name: "Bold" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Italic" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Heading 1" })).toBeVisible();
  });

  test("title is editable", async ({ page }) => {
    const titleInput = page.locator('input[placeholder="Untitled"]');
    await expect(titleInput).toBeVisible({ timeout: 5_000 });

    await titleInput.fill("My Test Title");
    await titleInput.blur();

    await expect(titleInput).toHaveValue("My Test Title");
  });

  test("knowledge panel toggle changes button state", async ({ page }) => {
    const hideBtn = page.getByRole("button", { name: "Hide knowledge panel" });
    await expect(hideBtn).toBeVisible({ timeout: 5_000 });

    await hideBtn.click();
    await expect(page.getByRole("button", { name: "Show knowledge panel" })).toBeVisible();

    await page.getByRole("button", { name: "Show knowledge panel" }).click();
    await expect(page.getByRole("button", { name: "Hide knowledge panel" })).toBeVisible();
  });

  test("AI panel toggle changes button state", async ({ page }) => {
    const hideBtn = page.getByRole("button", { name: "Hide AI assistant" });
    await expect(hideBtn).toBeVisible({ timeout: 5_000 });

    await hideBtn.click();
    await expect(page.getByRole("button", { name: "Show AI assistant" })).toBeVisible();

    await page.getByRole("button", { name: "Show AI assistant" }).click();
    await expect(page.getByRole("button", { name: "Hide AI assistant" })).toBeVisible();
  });

  test("Dashboard back link navigates to dashboard", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Dashboard" })).toBeVisible({ timeout: 5_000 });
    await page.getByRole("button", { name: "Dashboard" }).click();

    await page.waitForURL("/dashboard", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("shows save status indicator", async ({ page }) => {
    await expect(page.getByText(/Saved/)).toBeVisible({ timeout: 10_000 });
  });
});
