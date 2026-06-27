import { test, expect } from "@playwright/test";
import { seedTestDb } from "../helpers/seed";
import { signInTestUser, signUpTestUser } from "./helpers/auth";
import { testUsers } from "../fixtures/users";

test.describe("Authentication Flows (Credentials)", () => {
  test.beforeEach(async () => {
    // Reset test database to clean state
    await seedTestDb();
  });

  test("should show inline validation errors for missing signup inputs", async ({ page }) => {
    await page.goto("/sign-up");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=We need your name.")).toBeVisible();
    await expect(page.locator("text=We need your email.")).toBeVisible();
    await expect(page.locator("text=We need a password.")).toBeVisible();
  });

  test("should enforce minimum password length", async ({ page }) => {
    await page.goto("/sign-up");
    await page.fill('input[id="name"]', "Short Pass");
    await page.fill('input[id="email"]', "short@example.com");
    await page.fill('input[id="password"]', "12345");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Your password needs at least 8 characters.")).toBeVisible();
  });

  test("should complete successful signup and redirect to dashboard", async ({ page }) => {
    await signUpTestUser(page, "New User", "new-signup@example.com", "password123");
    
    // Default logged-in landing page is /automation or similar
    await expect(page).toHaveURL(/\/automation/);
  });

  test("should sign out successfully from the account dashboard", async ({ page }) => {
    // Sign in first
    await signInTestUser(page, testUsers.regular.email, testUsers.regular.password);
    await page.goto("/account");
    
    // Click Sign Out
    await page.click("text=Sign Out");
    await page.waitForURL("http://localhost:3000/");
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("should show error message for wrong credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('input[id="email"]', testUsers.regular.email);
    await page.fill('input[id="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid credentials. Try again.")).toBeVisible();
  });

  test("should enforce auth gate and redirect back to originally requested page", async ({ page }) => {
    // Try to visit protected page /blog
    await page.goto("/blog");
    await expect(page).toHaveURL(/\/sign-in/);
    expect(page.url()).toContain("callbackUrl=%2Fblog");

    // Logging in should redirect back to /blog
    await page.fill('input[id="email"]', testUsers.regular.email);
    await page.fill('input[id="password"]', testUsers.regular.password);
    await page.click('button[type="submit"]');

    await page.waitForURL("http://localhost:3000/blog");
    await expect(page).toHaveURL("http://localhost:3000/blog");
  });
});
