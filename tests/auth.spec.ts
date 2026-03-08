import { test, expect } from "@playwright/test";

test.describe("Auth Page", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("renders sign-in form by default", async ({ page }) => {
    await page.goto("/auth");

    await expect(page.getByText("Welcome back. Sign in to continue.")).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Password" })).toBeVisible();

    const signInButtons = page.getByRole("button", { name: "Sign In" });
    await expect(signInButtons.first()).toBeVisible();
  });

  test("switches to sign-up mode", async ({ page }) => {
    await page.goto("/auth");

    await page.getByRole("button", { name: "Sign Up" }).click();

    await expect(page.getByText("Create an account to get started.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create Account" })).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/auth");

    await page.getByRole("textbox", { name: "Email" }).fill("nonexistent@example.com");
    await page.getByRole("textbox", { name: "Password" }).fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign In" }).last().click();

    await expect(page.getByText("Invalid email or password.")).toBeVisible({ timeout: 10_000 });
  });

  test("successful sign-in redirects to dashboard", async ({ page }) => {
    await page.goto("/auth");

    await page.getByRole("textbox", { name: "Email" }).fill("inkwelltest@gmail.com");
    await page.getByRole("textbox", { name: "Password" }).fill("TestPass123!");
    await page.getByRole("button", { name: "Sign In" }).last().click();

    await page.waitForURL("/dashboard", { timeout: 15_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
