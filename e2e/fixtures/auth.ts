import { type Page, expect } from "@playwright/test";
import { ROUTES, TIMEOUTS } from "../utils/constants";

/**
 * Signs up a new user via the auth form and waits for redirect to dashboard.
 */
export async function signUp(
  page: Page,
  email: string,
  password: string,
  _name?: string,
) {
  await page.goto(ROUTES.auth);

  await page.getByRole("button", { name: /sign up/i }).click();

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  await page.getByRole("button", { name: /create account/i }).click();

  await expect(page).toHaveURL(new RegExp(ROUTES.dashboard), {
    timeout: TIMEOUTS.navigation,
  });
}

/**
 * Signs in an existing user and waits for redirect to dashboard.
 */
export async function signIn(page: Page, email: string, password: string) {
  await page.goto(ROUTES.auth);

  const signInTab = page.getByRole("button", { name: /sign in/i }).first();
  await signInTab.click();

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  await page.getByRole("button", { name: /^sign in$/i }).last().click();

  await expect(page).toHaveURL(new RegExp(ROUTES.dashboard), {
    timeout: TIMEOUTS.navigation,
  });
}

/**
 * Signs out the current user via the AccountDropdown.
 */
export async function signOut(page: Page) {
  await page.getByRole("button", { name: /account|chevron/i }).first().click();

  await page.getByRole("button", { name: /sign out/i }).click();

  await expect(page).toHaveURL(new RegExp(ROUTES.auth), {
    timeout: TIMEOUTS.navigation,
  });
}
