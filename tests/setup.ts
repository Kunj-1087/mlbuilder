import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers, clearMockedHistory } from "./mocks/handlers";
import { vi, beforeAll, afterEach, afterAll } from "vitest";

// 1. Establish MSW mock server
export const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
  server.resetHandlers();
  clearMockedHistory();
});

afterAll(() => {
  server.close();
});

// 2. Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
process.env.NEXTAUTH_SECRET = "test_nextauth_secret_longer_key_32_bytes_longer";
process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.DATABASE_URL = "postgresql://mlbuilder:mlbuilder_dev_password@localhost:5433/mlbuilder_test?schema=public";
process.env.TEST_DATABASE_URL = "postgresql://mlbuilder:mlbuilder_dev_password@localhost:5433/mlbuilder_test?schema=public";
process.env.RESEND_API_KEY = "re_mock_test_key";
process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_mock_test_key";
process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://us.i.posthog.com";

// 3. Mock Global / Browser APIs that Happy DOM doesn't fully implement
if (typeof window !== "undefined") {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();
  Object.defineProperty(window, "localStorage", { value: localStorageMock });

  // Mock matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}
