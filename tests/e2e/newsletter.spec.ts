import { test, expect } from "@playwright/test";
import { seedTestDb } from "../helpers/seed";
import { getMockedEmails, clearMockedHistory } from "../mocks/handlers";

test.describe("Newsletter Subscription Flow (Double Opt-In)", () => {
  test.beforeEach(async () => {
    clearMockedHistory();
    await seedTestDb();
  });

  test("should complete the double opt-in subscription loop successfully", async ({ page }) => {
    // 1. Visit newsletter subscription page
    await page.goto("/newsletter");

    // 2. Submit form with valid email
    await page.fill('input[placeholder*="email"]', "newsletter@mlbuilder.test");
    await page.click('button[type="submit"]');

    // 3. Assert form shows success state
    await expect(page.locator("text=CHECK YOUR INBOX")).toBeVisible();

    // 4. Assert that Resend received 1 email
    const emails = getMockedEmails();
    expect(emails).toHaveLength(1);
    expect(emails[0].to).toContain("newsletter@mlbuilder.test");
    expect(emails[0].subject).toContain("Confirm your subscription");

    // 5. Extract confirmation token/link
    // In our email templates, the confirm link is usually "/newsletter/confirmed?token=..."
    const html = emails[0].html;
    const match = html.match(/\/newsletter\/confirmed\?token=[a-zA-Z0-9-]+/);
    expect(match).toBeTruthy();
    const relativeLink = match![0];

    // 6. Navigate directly to the confirmation link
    await page.goto(`http://localhost:3000${relativeLink}`);

    // 7. Verify confirmation page loads successfully
    await expect(page).toHaveURL(/\/newsletter\/confirmed/);
    await expect(page.locator("text=YOU'RE IN")).toBeVisible();

    // 8. Assert welcome email is sent after confirmation
    const postConfirmEmails = getMockedEmails();
    expect(postConfirmEmails).toHaveLength(2); // Signup confirmation + Welcome email
    expect(postConfirmEmails[1].subject).toContain("Welcome to MLBuilder");
  });
});
