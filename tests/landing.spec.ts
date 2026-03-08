import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("renders hero section with title and CTAs", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Inkwell/);

    await expect(
      page.getByRole("heading", {
        name: "Write with clarity. Powered by knowledge.",
        level: 1,
      })
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "Get Started" })).toHaveAttribute("href", "/auth");
    await expect(page.getByRole("link", { name: "Learn More" })).toBeVisible();
  });

  test("renders navigation with Sign In link", async ({ page }) => {
    await page.goto("/");

    const signInLink = page.getByRole("link", { name: "Sign In (Auth)" });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute("href", "/auth");
  });

  test("renders features section", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Everything you need to write well", level: 2 })
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "AI Writing Assistant", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Knowledge Context", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Rich Text Editing", level: 3 })).toBeVisible();
  });

  test("footer has Design System link pointing to /design-system (known dead link)", async ({ page }) => {
    await page.goto("/");

    const designLink = page.getByRole("link", { name: "Design System" });
    await expect(designLink).toBeVisible();
    await expect(designLink).toHaveAttribute("href", "/design-system");
  });

  test("Sign In link navigates to auth page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Sign In" }).click();
    await expect(page).toHaveURL(/\/auth/);
  });
});
