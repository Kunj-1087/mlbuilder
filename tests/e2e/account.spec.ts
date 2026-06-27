import { test, expect } from "@playwright/test";
import { seedTestDb } from "../helpers/seed";
import { signInTestUser } from "./helpers/auth";
import { testUsers } from "../fixtures/users";
import { getMockedEmails, clearMockedHistory } from "../mocks/handlers";
import { testPrisma } from "../test-database";

test.describe("Account Dashboard Lifecycle", () => {
  test.beforeEach(async () => {
    clearMockedHistory();
    await seedTestDb();
  });

  test("should edit profile name and persist successfully", async ({ page }) => {
    await signInTestUser(page, testUsers.regular.email, testUsers.regular.password);
    await page.goto("/account");

    // Click edit profile
    await page.click("text=Edit Profile");
    await page.fill('input[id="name"]', "Updated Regular Dev");
    await page.click("text=Save Changes");

    // Assert name updates in greeting and card
    await expect(page.locator("text=Updated Regular Dev")).toBeVisible();
  });

  test("should force sign-out upon email change", async ({ page }) => {
    await signInTestUser(page, testUsers.regular.email, testUsers.regular.password);
    await page.goto("/account");

    await page.click("text=Edit Profile");
    await page.fill('input[id="email"]', "newemail@mlbuilder.test");
    await page.click("text=Save Changes");

    // Verify redirect to sign-in with email changed parameter
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("should trigger account deletion confirmation and cascade delete in DB", async ({ page }) => {
    await signInTestUser(page, testUsers.regular.email, testUsers.regular.password);
    await page.goto("/account");

    // Click delete account
    await page.click("text=Delete Account");
    
    // Type confirmation
    const confirmInput = page.locator('input[placeholder="Type DELETE to confirm"]');
    await confirmInput.fill("DELETE");
    
    // Click Delete Forever
    await page.click("button:has-text('Delete Forever')");

    // Assert redirection or farewell messages
    await expect(page).toHaveURL(/\/sign-in/);

    // Verify deletion email confirmation is sent
    const emails = getMockedEmails();
    expect(emails.length).toBeGreaterThanOrEqual(1);
    const deleteEmail = emails.find((e) => e.subject.includes("Confirm account deletion"));
    expect(deleteEmail).toBeTruthy();

    // In DB, check that user record is deleted
    const user = await testPrisma.user.findUnique({
      where: { email: testUsers.regular.email },
    });
    expect(user).toBeNull();
  });
});
