import { defineConfig } from "vitest/config";
import { resolve } from "path";

/**
 * Vitest configuration for unit and integration testing.
 */
export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "coverage/**",
        "playwright-report/**",
        "test-results/**",
        "playwright.config.ts",
        "vitest.config.ts",
        "postcss.config.js",
        "next.config.mjs",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});
