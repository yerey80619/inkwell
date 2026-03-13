import { test, expect } from "@playwright/test";
import { signUp } from "./fixtures/auth";
import { ROUTES, TIMEOUTS, TEST_USER } from "./utils/constants";
import { waitForConvex, navigateToDashboard, createDocument } from "./utils/helpers";

function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@inkwell-e2e.test`;
}

test.describe("Document CRUD", () => {
  test.describe("Create a new document", () => {
    test("should navigate to editor after clicking New Document @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-create");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await page.getByText("New Document").click();

      await page.waitForURL("**/document/**", {
        timeout: TIMEOUTS.navigation,
      });
      await expect(page).toHaveURL(/\/document\//);
    });

    test("should load editor with empty default document @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-editor");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await page.getByText("New Document").click();
      await page.waitForURL("**/document/**", {
        timeout: TIMEOUTS.navigation,
      });
      await waitForConvex(page);

      await expect(page.getByPlaceholder("Untitled")).toBeVisible();
      await expect(page.getByPlaceholder("Untitled")).toHaveValue("");
    });

    test("should show new document in dashboard list after creation @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-list");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await page.getByText("New Document").click();
      await page.waitForURL("**/document/**", {
        timeout: TIMEOUTS.navigation,
      });

      await page.goto(ROUTES.dashboard);
      await waitForConvex(page);

      await expect(page.getByText("Untitled").first()).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });
    });
  });

  test.describe("Rename a document", () => {
    test("should update document title and reflect on dashboard @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-rename");
      const newTitle = `Renamed Doc ${Date.now()}`;
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await page.getByText("New Document").click();
      await page.waitForURL("**/document/**", {
        timeout: TIMEOUTS.navigation,
      });
      await waitForConvex(page);

      const titleInput = page.getByPlaceholder("Untitled");
      await expect(titleInput).toBeVisible();
      await titleInput.fill(newTitle);
      await titleInput.press("Enter");

      await page.getByRole("link", { name: /dashboard/i }).click();
      await page.waitForURL(`**${ROUTES.dashboard}`, {
        timeout: TIMEOUTS.navigation,
      });
      await waitForConvex(page);

      await expect(page.getByText(newTitle)).toBeVisible({
        timeout: TIMEOUTS.convexLoad,
      });
    });
  });

  test.describe("Delete a document", () => {
    test("should show confirmation modal when clicking delete @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-del-modal");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await createDocument(page);
      await navigateToDashboard(page);

      const card = page.getByRole("link").filter({ hasText: /untitled/i });
      await card.hover();
      await card.getByTitle("Delete document").click();

      await expect(
        page.getByRole("heading", { name: /delete document/i }),
      ).toBeVisible();
      await expect(
        page.getByText(/are you sure you want to delete/i),
      ).toBeVisible();
    });

    test("should remove document from list after confirming delete @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-del-confirm");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await createDocument(page);
      await navigateToDashboard(page);

      const cardsBefore = page
        .getByRole("link")
        .filter({ hasText: /untitled/i });
      const countBefore = await cardsBefore.count();

      await cardsBefore.first().hover();
      await cardsBefore.first().getByTitle("Delete document").click();

      await page.getByRole("button", { name: /^delete$/i }).click();

      await expect(
        page.getByRole("link").filter({ hasText: /untitled/i }),
      ).toHaveCount(countBefore - 1, { timeout: TIMEOUTS.convexLoad });
    });
  });

  test.describe("Cancel delete", () => {
    test("should keep document in list after cancelling delete @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-del-cancel");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await createDocument(page);
      await navigateToDashboard(page);

      const card = page.getByRole("link").filter({ hasText: /untitled/i });
      const countBefore = await card.count();

      await card.first().hover();
      await card.first().getByTitle("Delete document").click();

      await expect(
        page.getByRole("heading", { name: /delete document/i }),
      ).toBeVisible();

      await page.getByRole("button", { name: /cancel/i }).click();

      await expect(
        page.getByRole("heading", { name: /delete document/i }),
      ).not.toBeVisible();
      await expect(
        page.getByRole("link").filter({ hasText: /untitled/i }),
      ).toHaveCount(countBefore);
    });
  });

  test.describe("Multiple documents", () => {
    test("should display all created documents in list @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-multi");
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await createDocument(page);
      await createDocument(page);
      await createDocument(page);

      await navigateToDashboard(page);

      await expect(
        page.getByRole("link").filter({ hasText: /untitled/i }),
      ).toHaveCount(3, { timeout: TIMEOUTS.convexLoad });
    });

    test("should remove only the deleted document from list @subscribed", async ({
      page,
    }) => {
      test.skip(
        true,
        "Requires active subscription — mock or seeded subscription needed",
      );

      const email = uniqueEmail("crud-multi-del");
      const docTitle = `Delete Me ${Date.now()}`;
      await signUp(page, email, TEST_USER.password);
      await waitForConvex(page);

      await createDocument(page);

      const titleInput = page.getByPlaceholder("Untitled");
      await titleInput.fill(docTitle);
      await titleInput.press("Enter");

      await createDocument(page);

      await navigateToDashboard(page);

      await expect(
        page.getByRole("link").filter({ hasText: docTitle }),
      ).toBeVisible({ timeout: TIMEOUTS.convexLoad });
      await expect(
        page.getByRole("link").filter({ hasText: /untitled/i }),
      ).toBeVisible();

      const targetCard = page
        .getByRole("link")
        .filter({ hasText: docTitle });
      await targetCard.hover();
      await targetCard.getByTitle("Delete document").click();
      await page.getByRole("button", { name: /^delete$/i }).click();

      await expect(
        page.getByRole("link").filter({ hasText: docTitle }),
      ).not.toBeVisible({ timeout: TIMEOUTS.convexLoad });

      await expect(
        page.getByRole("link").filter({ hasText: /untitled/i }),
      ).toBeVisible();
    });
  });
});
