import { Page } from "@playwright/test";

/**
 * Perform manual browser-based login in Playwright.
 */
export async function signInTestUser(page: Page, email: string, password = "password123") {
  await page.goto("/sign-in");
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes("/sign-in"));
}

/**
 * Perform manual browser-based signup in Playwright.
 */
export async function signUpTestUser(page: Page, name: string, email: string, password = "password123") {
  await page.goto("/sign-up");
  await page.fill('input[id="name"]', name);
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes("/sign-up"));
}
