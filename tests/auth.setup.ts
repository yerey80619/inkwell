import { test as setup, expect } from "@playwright/test";

const TEST_EMAIL = "inkwelltest@gmail.com";
const TEST_PASSWORD = "TestPass123!";

setup("authenticate", async ({ page }) => {
  await page.goto("/auth");

  await page.getByRole("textbox", { name: "Email" }).fill(TEST_EMAIL);
  await page.getByRole("textbox", { name: "Password" }).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Sign In" }).last().click();

  await page.waitForURL("/dashboard", { timeout: 15_000 });
  await expect(page).toHaveURL(/\/dashboard/);

  await page.context().storageState({
    path: "test-artifacts/.auth/user.json",
  });
});
