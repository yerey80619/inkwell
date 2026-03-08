import { test, expect } from "@playwright/test";

test.describe("Account Dropdown", () => {
  test("shows dropdown menu with Profile, Manage Subscription, and Sign Out", async ({ page }) => {
    await page.goto("/dashboard");

    const dropdownButton = page.getByRole("button", { name: /inkwelltest@gmail\.com/ });
    await expect(dropdownButton).toBeVisible({ timeout: 10_000 });
    await dropdownButton.click();

    await expect(page.getByRole("button", { name: "Profile" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Manage Subscription" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
  });

  test("shows user email in dropdown header", async ({ page }) => {
    await page.goto("/dashboard");

    const dropdownButton = page.getByRole("button", { name: /inkwelltest@gmail\.com/ });
    await expect(dropdownButton).toBeVisible({ timeout: 10_000 });
    await dropdownButton.click();

    await expect(page.getByText("inkwelltest@gmail.com").nth(1)).toBeVisible();
  });

  test("Profile button navigates to profile page", async ({ page }) => {
    await page.goto("/dashboard");

    const dropdownButton = page.getByRole("button", { name: /inkwelltest@gmail\.com/ });
    await expect(dropdownButton).toBeVisible({ timeout: 10_000 });
    await dropdownButton.click();

    await page.getByRole("button", { name: "Profile" }).click();
    await page.waitForURL("/profile", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/profile/);
  });

  test("Sign Out clears session and redirects", async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    await page.goto("/auth");
    await page.getByRole("textbox", { name: "Email" }).fill("inkwelltest@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("TestPass123!");
    await page.getByRole("button", { name: "Sign In" }).last().click();

    await page.waitForURL("/dashboard", { timeout: 15_000 });

    const dropdownButton = page.getByRole("button", { name: /inkwelltest@gmail\.com/ });
    await expect(dropdownButton).toBeVisible({ timeout: 10_000 });
    await dropdownButton.click();

    await page.getByRole("button", { name: "Sign Out" }).click();

    await page.waitForURL("/auth", { timeout: 15_000 });
    await expect(page).toHaveURL(/\/auth/);

    await context.close();
  });
});
