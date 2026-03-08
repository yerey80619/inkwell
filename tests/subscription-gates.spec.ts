import { test, expect } from "@playwright/test";

test.describe("Subscription Gates", () => {
  test("dashboard shows TrialPopup for authenticated user without subscription", async ({
    browser,
  }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    await page.goto("/auth");
    await page.getByRole("button", { name: "Sign Up" }).click();

    const uniqueEmail = `subtest_${Date.now()}@gmail.com`;
    await page.getByRole("textbox", { name: "Email" }).fill(uniqueEmail);
    await page.getByRole("textbox", { name: "Password" }).fill("TestPass123!");
    await page.getByRole("button", { name: "Create Account" }).click();

    await page.waitForURL("/dashboard", { timeout: 15_000 });

    await expect(page.getByRole("heading", { name: "Start your free trial" })).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByRole("button", { name: "Start free trial" })).toBeVisible();
    await expect(page.getByText("$19")).toBeVisible();

    await context.close();
  });
});
