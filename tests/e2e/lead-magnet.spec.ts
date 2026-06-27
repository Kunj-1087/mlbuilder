import { test, expect } from "@playwright/test";
import { seedTestDb } from "../helpers/seed";
import { getMockedEmails, clearMockedHistory } from "../mocks/handlers";

test.describe("Lead Magnet Flow", () => {
  test.beforeEach(async () => {
    clearMockedHistory();
    await seedTestDb();
  });

  test("should claim a lead magnet and fetch the download link via email", async ({ page }) => {
    // 1. Visit lead magnet detail landing page
    await page.goto("/free/n8n-guide");

    // 2. Assert detailed cover rendering and claim form are visible
    await expect(page.locator("text=n8n Workflow Automation Secrets")).toBeVisible();
    await expect(page.locator('input[placeholder*="email"]')).toBeVisible();

    // 3. Submit claim form with new email
    await page.fill('input[placeholder*="email"]', "claim@mlbuilder.test");
    await page.click('button[type="submit"]');

    // 4. Assert form displays success status
    await expect(page.locator("text=CHECK YOUR INBOX")).toBeVisible();

    // 5. Assert Resend dispatched lead magnet delivery email
    const emails = getMockedEmails();
    expect(emails.length).toBeGreaterThanOrEqual(1);
    
    // Check if the delivery email matches
    const delivery = emails.find((e) => e.subject.includes("Your n8n Workflow Automation Secrets download"));
    expect(delivery).toBeTruthy();

    // 6. Extract download link: "/api/lead-magnet/download?token=..."
    const match = delivery!.html.match(/\/api\/lead-magnet\/download\?token=[a-zA-Z0-9-]+/);
    expect(match).toBeTruthy();
    const downloadUrl = match![0];

    // 7. Verify the download link works by executing a page fetch on the route
    const response = await page.request.get(`http://localhost:3000${downloadUrl}`);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("application/pdf");
  });
});
