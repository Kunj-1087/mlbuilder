import { test, expect } from "@playwright/test";
import { seedTestDb } from "../helpers/seed";
import { signInTestUser } from "./helpers/auth";
import { testUsers } from "../fixtures/users";

test.describe("Bookmark System", () => {
  test.beforeEach(async () => {
    await seedTestDb();
  });

  test("should redirect signed-out users to login on bookmark click", async ({ page }) => {
    // Visit blog list page while signed out
    await page.goto("/blog");

    // Click bookmark button on the first post
    const firstBookmark = page.locator("button[aria-label*='Bookmark']").first();
    await firstBookmark.click();

    // Check redirect
    await expect(page).toHaveURL(/\/sign-in/);
    expect(page.url()).toContain("callbackUrl=%2Fblog");
  });

  test("should allow authenticated users to bookmark posts and manage notes", async ({ page }) => {
    // 1. Sign in
    await signInTestUser(page, testUsers.regular.email, testUsers.regular.password);

    // 2. Visit blog listing
    await page.goto("/blog");

    // 3. Click bookmark on first card
    const firstBookmark = page.locator("button[aria-label*='Bookmark']").first();
    await firstBookmark.click();

    // 4. Assert toast message is triggered
    await expect(page.locator("text=Saved to your library")).toBeVisible();

    // 5. Navigate to /account/saved
    await page.goto("/account/saved");

    // 6. Assert saved item is rendered
    await expect(page.locator("text=Production n8n LLM Routing Systems")).toBeVisible();

    // 7. Add user note to card
    await page.click("text=+ Add note");
    const noteTextarea = page.locator("textarea");
    await noteTextarea.fill("This is my E2E test bookmark note.");
    await page.click("text=Save");

    // 8. Assert note is saved and displayed
    await expect(page.locator("text=This is my E2E test bookmark note.")).toBeVisible();

    // 9. Remove bookmark from library page
    const removeBtn = page.locator("button[aria-label*='Bookmark']").first();
    await removeBtn.click();

    // 10. Assert item is removed from view
    await expect(page.locator("text=Production n8n LLM Routing Systems")).not.toBeVisible();
    await expect(page.locator("text=NOTHING SAVED YET")).toBeVisible();
  });
});
