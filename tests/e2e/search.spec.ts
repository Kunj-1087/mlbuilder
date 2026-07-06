import { test, expect } from "@playwright/test";
import { seedTestDb } from "../helpers/seed";

test.describe("Site-Wide Search (Command Palette)", () => {
  test.beforeEach(async () => {
    await seedTestDb();
  });

  test("should open search modal using keyboard shortcut '/'", async ({ page }) => {
    await page.goto("/");
    
    // Press forward-slash
    await page.keyboard.press("/");
    
    // Assert search modal opens
    const modal = page.locator("role=dialog[name='Search MLBuilder']");
    await expect(modal).toBeVisible();

    // Escape closes modal
    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("should execute fuzzy search and support filter pills", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("/");

    // Type query
    const input = page.locator("input[placeholder*='Search']");
    await input.fill("n8n");

    // Wait for search result items to be visible
    await expect(page.locator("text=n8n Workflow Automation Secrets")).toBeVisible();

    // Click filter pill for lead-magnets (Free Resources)
    // Wait, let's see: the filter pills are from activeFilter values: BLOG, AUTOMATION, etc.
    const leadMagnetPill = page.locator("text=Blog");
    await leadMagnetPill.click();

    // Lead magnet guides shouldn't appear since we filtered by Blog!
    // Wait! Let's check: the post with title "Production n8n LLM Routing Systems" has category "automation".
    // So if we filter by Blog, we should see the blog matches.
    await expect(page.locator("text=Production n8n LLM Routing Systems")).toBeVisible();
  });
});
