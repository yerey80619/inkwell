import { test, expect, Page } from "@playwright/test";

const CONVEX_URL = "https://little-tapir-937.convex.cloud";

async function getConvexToken(page: Page): Promise<string> {
  return page.evaluate(() => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("__convexAuthJWT")) return localStorage.getItem(key)!;
    }
    throw new Error("No Convex auth token found");
  });
}

async function deleteAllDocuments(page: Page) {
  const token = await getConvexToken(page);

  await page.evaluate(
    async ({ url, token }) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const listRes = await fetch(`${url}/api/query`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          path: "documents:list",
          args: {},
          format: "json",
        }),
      });
      if (!listRes.ok) throw new Error(`Failed to list documents: ${listRes.status}`);

      const list = await listRes.json();
      const docs: { _id: string }[] = list.value ?? [];

      for (const doc of docs) {
        const delRes = await fetch(`${url}/api/mutation`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            path: "documents:remove",
            args: { id: doc._id },
            format: "json",
          }),
        });
        if (!delRes.ok) throw new Error(`Failed to delete ${doc._id}: ${delRes.status}`);
      }
    },
    { url: CONVEX_URL, token }
  );
}

test.describe("Dashboard Empty State", () => {
  test.describe.configure({ mode: "serial" });

  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: "test-artifacts/.auth/user.json",
    });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  test("shows empty state when user has no documents", async () => {
    test.setTimeout(120_000);
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Your Documents", level: 1 })
    ).toBeVisible({ timeout: 10_000 });

    await deleteAllDocuments(page);

    await expect(page.getByText("No documents yet")).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByText("Create your first document to get started.")
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "New Document" })
    ).toBeVisible();
  });

  test("empty state New Document button creates a document and navigates to editor", async () => {
    await expect(page.getByText("No documents yet")).toBeVisible({
      timeout: 5_000,
    });
    await page.getByRole("button", { name: "New Document" }).click();
    await page.waitForURL(/\/document\//, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/document\/.+/);
  });

  test("dashboard grid returns after creating a document from empty state", async () => {
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Your Documents", level: 1 })
    ).toBeVisible({ timeout: 10_000 });

    await expect(page.getByText("No documents yet")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "New Document" })
    ).toBeVisible();
    await expect(page.getByText("Untitled").first()).toBeVisible();
  });
});
