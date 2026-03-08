import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test("renders profile form with pre-populated email", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.getByRole("heading", { name: "Profile", level: 1 })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByText("Manage your account details.")).toBeVisible();

    const emailInput = page.getByRole("textbox", { name: "Email" });
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveValue("inkwelltest@gmail.com");
  });

  test("Save Changes button is disabled when no changes are made", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "Save Changes" })).toBeDisabled();
  });

  test("renders AI Assistant Instructions section", async ({ page }) => {
    await page.goto("/profile");

    await expect(
      page.getByRole("heading", { name: "AI Assistant Instructions", level: 2 })
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByText("Set global instructions that guide the AI assistant across all your documents.")
    ).toBeVisible();

    await expect(
      page.getByRole("textbox", { name: "Global System Instructions" })
    ).toBeVisible();

    await expect(page.getByRole("button", { name: "Save Instructions" })).toBeDisabled();
  });

  test("Back to Dashboard link navigates to dashboard", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.getByRole("button", { name: "Back to Dashboard" })).toBeVisible({
      timeout: 10_000,
    });
    await page.getByRole("button", { name: "Back to Dashboard" }).click();

    await page.waitForURL("/dashboard", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
