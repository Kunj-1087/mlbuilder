import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E browser testing configuration.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 120000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Run sequentially to avoid database race conditions

  reporter: [
    ["html", { open: "never" }],
    ["list"],
  ],

  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    storageState: "./tests/e2e/storage-state.json",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 13"] },
    },
  ],

  webServer: {
    command: "npx next dev -p 3000",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL || "postgresql://postgres:postgres@127.0.0.1:5432/mlbuilder_test?schema=public",
      RESEND_API_KEY: "re_mock_test_key",
      NEXT_PUBLIC_POSTHOG_KEY: "",
      NEXT_PUBLIC_POSTHOG_HOST: "",
      NEXTAUTH_URL: "http://127.0.0.1:3000",
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
    },
  },
});
