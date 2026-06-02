import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke test configuration, separate from the e2e config on purpose.
 *
 * Unlike the e2e suite, the smoke test runs against an already deployed
 * environment, so there is no webServer to build and serve a local bundle.
 * Host and path differ between staging and production, so the environment
 * prefix up to (and including) the trailing slash is supplied per run via
 * ENVIRONMENT_URL (passed by the CI workflow after a deployment); the spec
 * appends the "egr" entry segment.
 *
 * Timeouts are generous: the assets are served from object storage and may
 * respond slowly on a cold cache (see ADR 0009).
 */
export default defineConfig({
  testDir: "./tests/smoke",
  reporter: process.env.PLAYWRIGHT_REPORTER || "list",
  retries: 2,
  timeout: 60_000,
  expect: { timeout: 20_000 },
  use: {
    baseURL: process.env.ENVIRONMENT_URL,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
