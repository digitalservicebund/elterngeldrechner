import { defineConfig, devices } from "@playwright/test";

const APP_PORT = process.env.PLAYWRIGHT_PORT || 3001;
const APP_BASE_URL = process.env.PLAYWRIGHT_URL || `http://localhost`;

const webServer = process.env.PLAYWRIGHT_SKIP_SERVER
  ? null
  : {
      command: `npm run serve-e2e -- --port ${APP_PORT}`,
      url: APP_BASE_URL + ":" + APP_PORT,
      reuseExistingServer: false,
      env: { ...process.env, VITE_APP_PRELOAD_STATE: "false" },
    };

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.PLAYWRIGHT_REPORTER || "html",
  testIgnore: process.env.PLAYWRIGHT_TEST_IGNORE || undefined,
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
