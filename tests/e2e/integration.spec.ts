import { test, expect } from "@playwright/test";
import { seedTestDb } from "../helpers/seed";
import { getMockedEmails, clearMockedHistory } from "../mocks/handlers";

test.describe("Integration Funnels (Cross-Feature)", () => {
  test.beforeEach(async () => {
    clearMockedHistory();
    await seedTestDb();
  });

  test("Instagram bio funnel: claim magnet -> auto-enrolled to newsletter double opt-in -> confirm subscription", async ({ page }) => {
    // 1. User arrives on lead magnet detail page with referral code
    await page.goto("/free/n8n-guide?ref=instagram-bio");

    // 2. Claim lead magnet
    await page.fill('input[placeholder*=' + "'email'" + ']', "funnel@mlbuilder.test");
    await page.click('button[type="submit"]');

    // 3. Confirm claim succeeded message
    await expect(page.locator("text=CHECK YOUR INBOX")).toBeVisible();

    // 4. Assert Resend dispatched both: Lead magnet email AND newsletter confirmation email
    const emails = getMockedEmails();
    expect(emails.length).toBe(2);

    const deliveryEmail = emails.find((e) => e.subject.includes("Your n8n Workflow Automation Secrets download"));
    const confirmEmail = emails.find((e) => e.subject.includes("Confirm your subscription"));

    expect(deliveryEmail).toBeTruthy();
    expect(confirmEmail).toBeTruthy();

    // 5. Confirm double opt-in newsletter subscription
    const match = confirmEmail!.html.match(/\/newsletter\/confirmed\?token=[a-zA-Z0-9-]+/);
    expect(match).toBeTruthy();
    const relativeConfirmUrl = match![0];

    await page.goto(`http://localhost:3000${relativeConfirmUrl}`);

    // 6. Arrive on confirmation landing page and verify welcome email dispatches
    await expect(page).toHaveURL(/\/newsletter\/confirmed/);
    await expect(page.locator("text=YOU'RE IN")).toBeVisible();

    const postConfirmEmails = getMockedEmails();
    expect(postConfirmEmails.length).toBe(3); // Delivery + Confirm + Welcome
    expect(postConfirmEmails[2].subject).toContain("Welcome to MLBuilder");
  });
});
