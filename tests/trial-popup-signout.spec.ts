import { test, expect, Browser } from "@playwright/test";

async function signUpFreshUser(browser: Browser, testId: string) {
  const context = await browser.newContext({
    storageState: { cookies: [], origins: [] },
  });
  const page = await context.newPage();

  await page.goto("/auth");
  await page.getByRole("button", { name: "Sign Up" }).click();

  const email = `signout_${testId}_${Date.now()}@gmail.com`;
  await page.getByRole("textbox", { name: "Email" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill("TestPass123!");
  await page.getByRole("button", { name: "Create Account" }).click();

  await page.waitForURL("/dashboard", { timeout: 15_000 });

  return { context, page, email };
}

test.describe("TrialPopup Sign Out", () => {
  test("TC1 — TrialPopup shows Sign out link for unsubscribed user", async ({
    browser,
  }) => {
    const { context, page } = await signUpFreshUser(browser, "tc1");

    await expect(
      page.getByRole("heading", { name: "Start your free trial" })
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByRole("button", { name: "Start free trial" })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Sign out" })
    ).toBeVisible();

    await context.close();
  });

  test("TC2 — clicking Sign out redirects to /auth", async ({ browser }) => {
    const { context, page } = await signUpFreshUser(browser, "tc2");

    await page.waitForURL("/dashboard", { timeout: 15_000 });
    await expect(
      page.getByRole("button", { name: "Sign out" })
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page).toHaveURL(/\/auth/);

    await expect(
      page.getByRole("button", { name: "Sign In" }).first()
    ).toBeVisible();

    await context.close();
  });

  test("TC3 — subscribed user sees normal dashboard without TrialPopup", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: "Your Documents", level: 1 })
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByRole("button", { name: /inkwelltest@gmail\.com/ })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "Start your free trial" })
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign out" })
    ).not.toBeVisible();
  });

  test("TC4 — after sign-out from TrialPopup, re-signin shows TrialPopup with Sign out", async ({
    browser,
  }) => {
    const { context, page, email } = await signUpFreshUser(browser, "tc3");

    await expect(
      page.getByRole("button", { name: "Sign out" })
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: "Sign out" }).click();
    await page.waitForURL("/auth", { timeout: 15_000 });

    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page
      .getByRole("textbox", { name: "Password" })
      .fill("TestPass123!");
    await page.locator("form").getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL("/dashboard", { timeout: 15_000 });

    await expect(
      page.getByRole("heading", { name: "Start your free trial" })
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByRole("button", { name: "Sign out" })
    ).toBeVisible();

    await context.close();
  });
});
