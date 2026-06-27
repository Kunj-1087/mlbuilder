import { test, expect } from "@playwright/test";

test.describe("Error Pages", () => {
  test("should render branded 404 page for nonexistent routes", async ({ page }) => {
    // Navigate to a completely fake URL
    await page.goto("/completely-nonexistent-page-12345");

    // Branded 404 styling checks
    await expect(page.locator("text=404")).toBeVisible();
    await expect(page.locator("text=PAGE NOT FOUND")).toBeVisible();

    // suggestions chip should open search modal
    const suggestionPill = page.locator("text=n8n workflows");
    await suggestionPill.click();

    // Check search modal opens
    const modal = page.locator("role=dialog[name='Search MLBuilder']");
    await expect(modal).toBeVisible();
  });
});
