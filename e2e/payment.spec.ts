import { test, expect } from "@playwright/test";
import { signUp } from "./fixtures/auth";
import { TIMEOUTS, TEST_USER } from "./utils/constants";
import { waitForConvex } from "./utils/helpers";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@gmail.com`;
}

const STRIPE_TEST_CARD = "4242424242424242";
const STRIPE_TEST_EXPIRY = "1230";
const STRIPE_TEST_CVC = "123";
const CHECKOUT_TIMEOUT = 60_000;

test.describe("Polar.sh Payment", () => {
  test("should complete subscription checkout via Polar sandbox", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    const email = uniqueEmail("payment");
    await signUp(page, email, TEST_USER.password);
    await waitForConvex(page);

    const ctaButton = page.getByRole("button", {
      name: /start free trial/i,
    });
    await expect(ctaButton).toBeVisible({ timeout: TIMEOUTS.convexLoad });
    await ctaButton.click();

    const polarFrame = page.frameLocator(
      'iframe[src*="polar"], iframe[src*="sandbox"]',
    );
    await expect(polarFrame.locator("body")).toBeVisible({
      timeout: CHECKOUT_TIMEOUT,
    });

    const stripeFrame = polarFrame
      .frameLocator('iframe[src*="js.stripe.com"]')
      .first();

    const cardNumberInput = stripeFrame.getByRole("textbox", {
      name: /card number/i,
    });
    await cardNumberInput.waitFor({ timeout: CHECKOUT_TIMEOUT });
    await page.waitForTimeout(2_000);

    await cardNumberInput.click();
    await cardNumberInput.pressSequentially(STRIPE_TEST_CARD, { delay: 80 });
    await cardNumberInput.press("Tab");

    await stripeFrame
      .getByRole("textbox", { name: /expiration/i })
      .pressSequentially(STRIPE_TEST_EXPIRY, { delay: 80 });
    await stripeFrame
      .getByRole("textbox", { name: /expiration/i })
      .press("Tab");

    await stripeFrame
      .getByRole("textbox", { name: /security code/i })
      .pressSequentially(STRIPE_TEST_CVC, { delay: 80 });
    await stripeFrame
      .getByRole("textbox", { name: /security code/i })
      .press("Tab");

    await polarFrame
      .getByRole("textbox", { name: /cardholder name/i })
      .fill("Test User");

    await polarFrame
      .getByRole("textbox", { name: /street address/i })
      .fill("123 Test Street");

    await polarFrame
      .getByRole("textbox", { name: /postal code/i })
      .fill("10001");

    await polarFrame.getByRole("textbox", { name: /city/i }).fill("New York");

    const stateCombobox = polarFrame
      .getByRole("combobox")
      .filter({ hasText: /^State$/ });
    await stateCombobox.scrollIntoViewIfNeeded();
    await stateCombobox.click();

    const stateOption = polarFrame
      .getByRole("listbox")
      .getByRole("option", { name: "New York" });
    await stateOption.scrollIntoViewIfNeeded();
    await stateOption.click();

    await expect(
      polarFrame.getByRole("combobox").filter({ hasText: /New York/ }),
    ).toBeVisible();

    const startTrialBtn = polarFrame.getByRole("button", {
      name: /start trial/i,
    });
    await startTrialBtn.scrollIntoViewIfNeeded();
    await expect(startTrialBtn).toBeEnabled();
    await startTrialBtn.click();

    await expect(
      page
        .getByText(/payment successful/i)
        .or(page.getByRole("heading", { name: /your documents/i })),
    ).toBeVisible({
      timeout: CHECKOUT_TIMEOUT,
    });
  });
});
