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

  test("TC5 — CTA hierarchy: Start free trial is visually dominant above Sign out", async ({
    browser,
  }) => {
    const { context, page } = await signUpFreshUser(browser, "tc5");

    await expect(
      page.getByRole("heading", { name: "Start your free trial" })
    ).toBeVisible({ timeout: 10_000 });

    const ctaButton = page.getByRole("button", { name: "Start free trial" });
    const signOutButton = page.getByRole("button", { name: "Sign out" });

    await expect(ctaButton).toBeVisible();
    await expect(signOutButton).toBeVisible();

    const ctaBox = await ctaButton.boundingBox();
    const signOutBox = await signOutButton.boundingBox();

    expect(ctaBox).not.toBeNull();
    expect(signOutBox).not.toBeNull();

    expect(ctaBox!.y).toBeLessThan(signOutBox!.y);

    expect(ctaBox!.width).toBeGreaterThanOrEqual(signOutBox!.width * 0.9);

    await context.close();
  });

  test("TC6 — Responsive: TrialPopup renders correctly at 375px mobile viewport", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
      viewport: { width: 375, height: 812 },
    });
    const page = await context.newPage();

    await page.goto("/auth");
    await page.getByRole("button", { name: "Sign Up" }).click();

    const email = `signout_tc6_${Date.now()}@gmail.com`;
    await page.getByRole("textbox", { name: "Email" }).fill(email);
    await page.getByRole("textbox", { name: "Password" }).fill("TestPass123!");
    await page.getByRole("button", { name: "Create Account" }).click();

    await page.waitForURL("/dashboard", { timeout: 15_000 });

    await expect(
      page.getByRole("heading", { name: "Start your free trial" })
    ).toBeVisible({ timeout: 10_000 });

    const ctaButton = page.getByRole("button", { name: "Start free trial" });
    const signOutButton = page.getByRole("button", { name: "Sign out" });

    await expect(ctaButton).toBeVisible();
    await expect(signOutButton).toBeVisible();

    const signOutBox = await signOutButton.boundingBox();
    expect(signOutBox).not.toBeNull();
    expect(signOutBox!.x).toBeGreaterThanOrEqual(0);
    expect(signOutBox!.x + signOutBox!.width).toBeLessThanOrEqual(375);

    await expect(page.getByText("$19")).toBeVisible();

    await context.close();
  });
});
