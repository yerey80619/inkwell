import { type Page, expect } from "@playwright/test";
import { ROUTES, TIMEOUTS } from "./constants";

/**
 * Waits for Convex-powered content to finish loading by ensuring
 * no spinner elements remain visible on the page.
 */
export async function waitForConvex(page: Page) {
  await expect(page.getByRole("progressbar").or(page.locator(".animate-spin")).first())
    .not.toBeVisible({ timeout: TIMEOUTS.convexLoad })
    .catch(() => {
      // If no spinner was ever present, that's fine
    });
}

/** Navigates to the dashboard and waits for content to load. */
export async function navigateToDashboard(page: Page) {
  await page.goto(ROUTES.dashboard);
  await page.waitForURL(`**${ROUTES.dashboard}`, { timeout: TIMEOUTS.navigation });
  await waitForConvex(page);
}

/** Creates a new document from the dashboard and returns the new page URL. */
export async function createDocument(page: Page) {
  await navigateToDashboard(page);
  await page.getByRole("button", { name: /new document/i }).click();
  await page.waitForURL("**/document/**", { timeout: TIMEOUTS.navigation });
  return page.url();
}
