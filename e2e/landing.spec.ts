import { test, expect } from "@playwright/test";
import { ROUTES } from "./utils/constants";

const FEATURE_CARDS = [
  {
    title: "AI Writing Assistant",
    description:
      "Chat with AI that understands your document and references. Get suggestions, drafts, and edits in real time.",
  },
  {
    title: "Knowledge Context",
    description:
      "Add reference materials and notes as knowledge. The AI uses them to write more informed, accurate content.",
  },
  {
    title: "Rich Text Editing",
    description:
      "A beautiful, distraction-free editor with formatting controls. Headings, lists, quotes, and more.",
  },
] as const;

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.landing);
  });

  test.describe("Page Load", () => {
    test("should load the page with hero and features sections visible", async ({
      page,
    }) => {
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: /everything you need to write well/i })
      ).toBeVisible();
    });

    test("should display the Inkwell brand in the navigation", async ({
      page,
    }) => {
      await expect(page.getByText("Inkwell", { exact: true }).first()).toBeVisible();
    });

    test("should display the footer with copyright text", async ({ page }) => {
      await expect(
        page.getByText(/inkwell\. write beautifully/i)
      ).toBeVisible();
    });
  });

  test.describe("Hero Section", () => {
    test("should display the headline text", async ({ page }) => {
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();
      await expect(heading).toContainText("Write with clarity");
      await expect(heading).toContainText("Powered by knowledge");
    });

    test("should display the subheading text", async ({ page }) => {
      await expect(
        page.getByText(/inkwell is your ai writing companion/i)
      ).toBeVisible();
    });

    test("should display the AI-Powered Writing badge", async ({ page }) => {
      await expect(page.getByText("AI-Powered Writing")).toBeVisible();
    });

    test("should display the Get Started CTA button linking to auth", async ({
      page,
    }) => {
      const ctaLink = page.getByRole("link", { name: /get started/i });
      await expect(ctaLink).toBeVisible();
      await expect(ctaLink).toHaveAttribute("href", ROUTES.auth);
    });

    test("should display the Learn More button linking to features", async ({
      page,
    }) => {
      const learnMore = page.getByRole("link", { name: /learn more/i });
      await expect(learnMore).toBeVisible();
      await expect(learnMore).toHaveAttribute("href", "#features");
    });
  });

  test.describe("Features Section", () => {
    test("should display the features section heading", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /everything you need to write well/i })
      ).toBeVisible();
    });

    test("should display the features section subtitle", async ({ page }) => {
      await expect(
        page.getByText(
          /a focused writing environment that brings ai and knowledge together/i
        )
      ).toBeVisible();
    });

    test("should render all three feature cards with titles and descriptions", async ({
      page,
    }) => {
      for (const feature of FEATURE_CARDS) {
        await expect(
          page.getByRole("heading", { name: feature.title })
        ).toBeVisible();
        await expect(page.getByText(feature.description)).toBeVisible();
      }
    });
  });

  test.describe("Navigation", () => {
    test("should navigate to auth page when clicking Sign In", async ({
      page,
    }) => {
      await page.getByRole("link", { name: /sign in/i }).click();
      await page.waitForURL(`**${ROUTES.auth}`);
      await expect(page).toHaveURL(new RegExp(`${ROUTES.auth}$`));
    });

    test("should navigate to auth page when clicking Get Started CTA", async ({
      page,
    }) => {
      await page.getByRole("link", { name: /get started/i }).click();
      await page.waitForURL(`**${ROUTES.auth}`);
      await expect(page).toHaveURL(new RegExp(`${ROUTES.auth}$`));
    });
  });

  test.describe("Responsiveness", () => {
    test("should adapt layout on mobile viewport", async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
      });
      const page = await context.newPage();
      await page.goto(ROUTES.landing);

      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("link", { name: /get started/i })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: /sign in/i })
      ).toBeVisible();

      for (const feature of FEATURE_CARDS) {
        await expect(
          page.getByRole("heading", { name: feature.title })
        ).toBeVisible();
      }

      await context.close();
    });
  });
});
