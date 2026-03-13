import { test, expect } from "@playwright/test";
import { signUp } from "./fixtures/auth";
import { ROUTES, TIMEOUTS, TEST_USER } from "./utils/constants";
import { waitForConvex } from "./utils/helpers";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@inkwell-e2e.test`;
}

test.describe("Dashboard", () => {
  test.describe("Route protection", () => {
    test("should redirect unauthenticated users to auth", async ({ page }) => {
      await page.goto(ROUTES.dashboard);
      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });
    });
  });

  test.describe("Dashboard loads for authenticated user", () => {
    test("should land on dashboard after sign up", async ({ page }) => {
      const email = uniqueEmail("dash-load");
      await signUp(page, email, TEST_USER.password);

      await expect(page).toHaveURL(new RegExp(ROUTES.dashboard));
    });

    test("should display subscription gate or dashboard content", async ({
      page,
    }) => {
      const email = uniqueEmail("dash-content");
      await signUp(page, email, TEST_USER.password);

      await waitForConvex(page);

      const trialPopup = page.getByText(/start your free trial/i);
      const dashboardHeading = page.getByRole("heading", {
        name: /your documents/i,
      });

      await expect(trialPopup.or(dashboardHeading)).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });
    });
  });

  test.describe("TrialPopup (subscription gate)", () => {
    let email: string;

    test.beforeEach(async ({ page }) => {
      email = uniqueEmail("dash-trial");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);
    });

    test("should display the TrialPopup modal for unsubscribed user", async ({
      page,
    }) => {
      await expect(page.getByText(/start your free trial/i)).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });
    });

    test("should display the Inkwell branding in the modal", async ({
      page,
    }) => {
      await expect(page.getByText(/inkwell/i).first()).toBeVisible();
    });

    test("should display the free trial CTA button", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: /start free trial/i }),
      ).toBeVisible();
    });

    test("should display benefit items", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /ai-powered writing assistant/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /unlimited documents/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /knowledge base/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /priority support/i }),
      ).toBeVisible();
    });

    test("should display pricing information", async ({ page }) => {
      await expect(page.getByText("$19")).toBeVisible();
      await expect(page.getByText(/\/mo/i)).toBeVisible();
      await expect(page.getByText(/cancel anytime/i)).toBeVisible();
    });

    test("should display the sign-out option", async ({ page }) => {
      const signOutButton = page.getByRole("button", { name: /sign out/i });
      await expect(signOutButton).toBeVisible();
    });

    test("should sign out from the TrialPopup", async ({ page }) => {
      await page.getByRole("button", { name: /sign out/i }).click();

      await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
        timeout: TIMEOUTS.navigation,
      });
    });

    test("should render as a full-screen overlay", async ({ page }) => {
      const overlay = page.locator(".fixed.inset-0");
      await expect(overlay).toBeVisible();
    });

    test("should not show dashboard content behind the modal", async ({
      page,
    }) => {
      await expect(
        page.getByRole("heading", { name: /your documents/i }),
      ).not.toBeVisible();
    });
  });

  test.describe("Empty state", () => {
    test("should show empty state for new subscribed user @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      await expect(page.getByText(/no documents yet/i)).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });
      await expect(
        page.getByText(/create your first document to get started/i),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /new document/i }),
      ).toBeVisible();
    });
  });

  test.describe("Document list", () => {
    test("should show New Document button for subscribed users @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      await expect(
        page.getByRole("button", { name: /new document/i }),
      ).toBeVisible();
    });

    test("should create a document and show it in the list @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      await page.getByRole("button", { name: /new document/i }).click();
      await page.waitForURL("**/document/**", {
        timeout: TIMEOUTS.navigation,
      });

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      await expect(page.getByText(/untitled/i).first()).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });
    });

    test("should display document card with title and timestamp @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      await page.getByRole("button", { name: /new document/i }).click();
      await page.waitForURL("**/document/**", {
        timeout: TIMEOUTS.navigation,
      });

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      const card = page.getByRole("link").filter({ hasText: /untitled/i });
      await expect(card).toBeVisible({ timeout: TIMEOUTS.convexLoad });
    });
  });

  test.describe("Navigation from dashboard", () => {
    test("should navigate to document when clicking a card @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      await page.getByRole("button", { name: /new document/i }).click();
      await page.waitForURL("**/document/**", {
        timeout: TIMEOUTS.navigation,
      });

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      const card = page.getByRole("link").filter({ hasText: /untitled/i });
      await card.click();

      await expect(page).toHaveURL(/\/document\//, {
        timeout: TIMEOUTS.navigation,
      });
    });

    test("should show AccountDropdown for subscribed users @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      await expect(
        page.getByRole("button", { name: /account|chevron/i }).first(),
      ).toBeVisible();
    });
  });

  test.describe("Subscription-gated behavior", () => {
    test("unsubscribed user sees TrialPopup instead of dashboard", async ({
      page,
    }) => {
      const email = uniqueEmail("dash-unsub");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await expect(page.getByText(/start your free trial/i)).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });

      await expect(
        page.getByRole("heading", { name: /your documents/i }),
      ).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: /new document/i }),
      ).not.toBeVisible();
    });

    test("TrialPopup CTA button is enabled and clickable", async ({
      page,
    }) => {
      const email = uniqueEmail("dash-cta");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      const ctaButton = page.getByRole("button", {
        name: /start free trial/i,
      });
      await expect(ctaButton).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });
      await expect(ctaButton).toBeEnabled();
    });
  });
});
