import { test, expect } from "@playwright/test";
import { seedTestDb } from "../helpers/seed";
import { signInTestUser } from "./helpers/auth";
import { testUsers } from "../fixtures/users";

test.describe("Community Page platform voting", () => {
  test.beforeEach(async () => {
    await seedTestDb();
  });

  test("should allow signed-in users to vote for coming-soon platforms and persist voted status", async ({ page }) => {
    await signInTestUser(page, testUsers.regular.email, testUsers.regular.password);
    await page.goto("/blog/community");

    // Locate coming soon platform card voting button
    const voteBtn = page.locator("button:has-text('Vote to prioritize')").first();
    await voteBtn.click();

    // Verify voted button status updates
    await expect(voteBtn).toHaveText(/Voted/);

    // Refresh page
    await page.reload();
    
    // Verify voted button remains checked
    await expect(page.locator("button").first()).toHaveText(/Voted/);
  });
});
