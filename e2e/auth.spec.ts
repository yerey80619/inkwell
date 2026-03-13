import { test, expect } from "@playwright/test";
import { signUp, signIn } from "./fixtures/auth";
import { ROUTES, TIMEOUTS, TEST_USER } from "./utils/constants";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@inkwell-e2e.test`;
}

test.describe("Authentication", () => {
  test.describe("Sign Up flow", () => {
    test("should sign up with valid credentials and redirect to dashboard", async ({
      page,
    }) => {
      const email = uniqueEmail("signup");
      await page.goto(ROUTES.auth);

      await page.getByRole("button", { name: /sign up/i }).click();
      await page.getByLabel(/email/i).fill(email);
      await page.getByLabel(/password/i).fill(TEST_USER.password);
      await page.getByRole("button", { name: /create account/i }).click();

      await expect(page).toHaveURL(new RegExp(ROUTES.dashboard), {
        timeout: TIMEOUTS.navigation,
      });
    });

    test("should display authenticated content after sign up", async ({
      page,
    }) => {
      const email = uniqueEmail("signup-auth");
      await signUp(page, email, TEST_USER.password);

      await expect(page.getByText(/start your free trial/i)).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });
    });
  });

  test.describe("Sign In flow", () => {
    test("should sign in with valid credentials and redirect to dashboard", async ({
      page,
    }) => {
      const email = uniqueEmail("signin");

      await signUp(page, email, TEST_USER.password);

      await page.getByRole("button", { name: /sign out/i }).click();
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });

      await signIn(page, email, TEST_USER.password);
      await expect(page).toHaveURL(new RegExp(ROUTES.dashboard));
    });
  });

  test.describe("Sign Out flow", () => {
    test("should sign out and redirect to auth page", async ({ page }) => {
      const email = uniqueEmail("signout");
      await signUp(page, email, TEST_USER.password);

      await page.getByRole("button", { name: /sign out/i }).click();

      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });
    });

    test("should not access protected pages after sign out", async ({
      page,
    }) => {
      const email = uniqueEmail("signout-protect");
      await signUp(page, email, TEST_USER.password);

      await page.getByRole("button", { name: /sign out/i }).click();
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });

      await page.goto(ROUTES.dashboard);
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });
    });
  });

  test.describe("Form validation", () => {
    test("should not submit empty sign-in form", async ({ page }) => {
      await page.goto(ROUTES.auth);

      await page.getByRole("button", { name: /^sign in$/i }).last().click();

      await expect(page).toHaveURL(new RegExp(ROUTES.auth));
    });

    test("should show error for invalid credentials", async ({ page }) => {
      await page.goto(ROUTES.auth);

      await page.getByLabel(/email/i).fill("nonexistent@example.com");
      await page.getByLabel(/password/i).fill("SomePassword123!");
      await page.getByRole("button", { name: /^sign in$/i }).last().click();

      await expect(page.getByText(/invalid email or password/i)).toBeVisible({
        timeout: TIMEOUTS.navigation,
      });
    });

    test("should show error for wrong password on existing account", async ({
      page,
    }) => {
      const email = uniqueEmail("wrong-pass");

      await signUp(page, email, TEST_USER.password);
      await page.getByRole("button", { name: /sign out/i }).click();
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });

      await page.getByLabel(/email/i).fill(email);
      await page.getByLabel(/password/i).fill("WrongPassword123!");
      await page.getByRole("button", { name: /^sign in$/i }).last().click();

      await expect(page.getByText(/invalid email or password/i)).toBeVisible({
        timeout: TIMEOUTS.navigation,
      });
    });

    test("should show error when signing up with already-registered email", async ({
      page,
    }) => {
      const email = uniqueEmail("dup-email");

      await signUp(page, email, TEST_USER.password);
      await page.getByRole("button", { name: /sign out/i }).click();
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });

      await page.getByRole("button", { name: /sign up/i }).click();
      await page.getByLabel(/email/i).fill(email);
      await page.getByLabel(/password/i).fill("DifferentPassword456!");
      await page.getByRole("button", { name: /create account/i }).click();

      await expect(
        page.getByText(/could not create account/i),
      ).toBeVisible({ timeout: TIMEOUTS.navigation });
    });
  });

  test.describe("Route protection", () => {
    test("should redirect unauthenticated user from /dashboard to /auth", async ({
      page,
    }) => {
      await page.goto(ROUTES.dashboard);
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });
    });

    test("should redirect unauthenticated user from /profile to /auth", async ({
      page,
    }) => {
      await page.goto(ROUTES.profile);
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });
    });

    test("should redirect unauthenticated user from /document/some-id to /auth", async ({
      page,
    }) => {
      await page.goto(ROUTES.document("some-id"));
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });
    });
  });

  test.describe("Tab switching", () => {
    test("should switch between Sign In and Sign Up tabs", async ({
      page,
    }) => {
      await page.goto(ROUTES.auth);

      await expect(page.getByText(/welcome back/i)).toBeVisible();

      await page.getByRole("button", { name: /sign up/i }).click();
      await expect(
        page.getByRole("button", { name: /create account/i }),
      ).toBeVisible();
      await expect(page.getByText(/create an account/i)).toBeVisible();

      await page.getByRole("button", { name: /sign in/i }).first().click();
      await expect(page.getByText(/welcome back/i)).toBeVisible();
    });

    test("should show correct form fields for each tab", async ({ page }) => {
      await page.goto(ROUTES.auth);

      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();

      await page.getByRole("button", { name: /sign up/i }).click();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });
  });
});
