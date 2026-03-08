import { test, expect } from "@playwright/test";

test.describe("Auth Gates - Unauthenticated Redirects", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("dashboard redirects to /auth when unauthenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/auth", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/auth/);
  });

  test("document page redirects to /auth when unauthenticated", async ({ page }) => {
    await page.goto("/document/some-fake-id");
    await page.waitForURL("/auth", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/auth/);
  });

  test("profile redirects to /auth when unauthenticated", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForURL("/auth", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/auth/);
  });

  test("auth page redirects to /dashboard when already authenticated", async ({ page }) => {
    await page.goto("/auth");

    await page.getByRole("textbox", { name: "Email" }).fill("inkwelltest@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("TestPass123!");
    await page.getByRole("button", { name: "Sign In" }).last().click();

    await page.waitForURL("/dashboard", { timeout: 15_000 });

    await page.goto("/auth");
    await page.waitForURL("/dashboard", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
