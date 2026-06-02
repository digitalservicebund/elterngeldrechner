import { defineConfig, devices } from "@playwright/test";

const APP_PORT = process.env.PLAYWRIGHT_PORT || 3001;
const APP_BASE_URL = process.env.PLAYWRIGHT_URL || `http://localhost`;

const webServer = process.env.PLAYWRIGHT_SKIP_SERVER
  ? null
  : {
      command: `npm run serve-e2e -- --port ${APP_PORT}`,
      url: APP_BASE_URL + ":" + APP_PORT,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        VITE_APP_PRELOAD_STATE: "false",
        VITE_FEATURE_FLAG_ABFRAGETEIL_V2: "false",
      },
    };

export default defineConfig({
  testDir: "./tests",
  // Smoke tests run against a deployed environment via playwright.smoke.config.ts,
  // not against the locally served bundle this config builds.
  testIgnore: ["**/smoke/**", process.env.PLAYWRIGHT_TEST_IGNORE].filter(
    (pattern): pattern is string => Boolean(pattern),
  ),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.PLAYWRIGHT_REPORTER || "html",
  use: {
    baseURL: APP_BASE_URL + ":" + APP_PORT,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--disable-lcd-text"],
        },
      },
    },
  ],
  webServer: webServer,
});
