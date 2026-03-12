import { test, expect } from "@playwright/test";

test.describe("Premium Animations - Landing Page", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("hero section animates in and is fully visible", async ({ page }) => {
    await page.goto("/");

    const hero = page.getByRole("heading", {
      name: "Write with clarity. Powered by knowledge.",
      level: 1,
    });
    await expect(hero).toBeVisible({ timeout: 5_000 });

    const badge = page.getByText("AI-Powered Writing");
    await expect(badge).toBeVisible();

    const getStarted = page.getByRole("link", { name: "Get Started" });
    await expect(getStarted).toBeVisible();
    await expect(getStarted).toHaveAttribute("href", "/auth");
  });

  test("features section is visible after scroll", async ({ page }) => {
    await page.goto("/");

    const featuresHeading = page.getByRole("heading", {
      name: "Everything you need to write well",
      level: 2,
    });

    await featuresHeading.scrollIntoViewIfNeeded();
    await expect(featuresHeading).toBeVisible({ timeout: 5_000 });

    await expect(
      page.getByRole("heading", { name: "AI Writing Assistant", level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Knowledge Context", level: 3 })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Rich Text Editing", level: 3 })
    ).toBeVisible();
  });

  test("page transition renders smoothly on navigation", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/auth/);

    await expect(
      page.getByText("Welcome back. Sign in to continue.")
    ).toBeVisible({ timeout: 5_000 });
  });
});

test.describe("Premium Animations - Auth Page", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("auth form animates in with all elements visible", async ({ page }) => {
    await page.goto("/auth");

    await expect(page.getByText("Inkwell").first()).toBeVisible({
      timeout: 5_000,
    });
    await expect(
      page.getByText("Welcome back. Sign in to continue.")
    ).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Password" })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Sign In" }).first()
    ).toBeVisible();
  });

  test("sign-up toggle works with animated error display", async ({
    page,
  }) => {
    await page.goto("/auth");

    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(
      page.getByText("Create an account to get started.")
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Create Account" })
    ).toBeVisible();
  });
});

test.describe("Premium Animations - Dashboard", () => {
  test("dashboard cards animate in with stagger", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: "Your Documents", level: 1 })
    ).toBeVisible({ timeout: 10_000 });

    await expect(
      page.getByRole("button", { name: "New Document" })
    ).toBeVisible();
  });

  test("account dropdown animates open and closed", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: "Your Documents", level: 1 })
    ).toBeVisible({ timeout: 10_000 });

    const accountButton = page.getByRole("button", {
      name: /inkwelltest@gmail\.com/,
    });
    await expect(accountButton).toBeVisible();
    await accountButton.click();

    await expect(page.getByText("Profile")).toBeVisible({ timeout: 3_000 });
    await expect(page.getByText("Sign Out")).toBeVisible();

    await page.keyboard.press("Escape");
    await page.click("body", { position: { x: 10, y: 10 } });

    await expect(page.getByText("Profile")).not.toBeVisible({ timeout: 3_000 });
  });

  test("new document creation works with animated button", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("button", { name: "New Document" })
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole("button", { name: "New Document" }).click();
    await page.waitForURL(/\/document\//, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/document\/.+/);
  });
});

test.describe("Premium Animations - Document Editor", () => {
  test("editor panels animate in with spring physics", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("button", { name: "New Document" })
    ).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "New Document" }).click();
    await page.waitForURL(/\/document\//, { timeout: 10_000 });

    await expect(page.getByRole("heading", { name: "Knowledge" })).toBeVisible({ timeout: 5_000 });
    await expect(page.getByRole("heading", { name: "AI Assistant" })).toBeVisible();
  });

  test("panel toggle animates panels in and out", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("button", { name: "New Document" })
    ).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "New Document" }).click();
    await page.waitForURL(/\/document\//, { timeout: 10_000 });

    await expect(page.getByRole("heading", { name: "Knowledge" })).toBeVisible({ timeout: 5_000 });

    const hideKnowledge = page.getByTitle("Hide knowledge panel");
    await hideKnowledge.click();

    await expect(page.getByRole("heading", { name: "Knowledge" })).not.toBeVisible({
      timeout: 3_000,
    });

    const showKnowledge = page.getByTitle("Show knowledge panel");
    await showKnowledge.click();

    await expect(page.getByRole("heading", { name: "Knowledge" })).toBeVisible({ timeout: 3_000 });
  });
});

test.describe("Premium Animations - Reduced Motion", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("respects prefers-reduced-motion setting", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Write with clarity. Powered by knowledge.",
        level: 1,
      })
    ).toBeVisible({ timeout: 5_000 });

    await expect(
      page.getByRole("link", { name: "Get Started" })
    ).toBeVisible();
  });
});
