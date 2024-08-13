import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3001;
const APP_BASE_URL = `http://localhost:${APP_PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "blob" : "html",
  use: {
    baseURL: process.env.TEST_PRODUCTION
      ? "https://familienportal.de/familienportal/meta/egr/"
      : APP_BASE_URL,
    trace: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: {
      // accounts for tiny differences in font rendering between systems
      maxDiffPixelRatio: 0.06,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run serve-e2e -- --port ${APP_PORT}`,
    url: APP_BASE_URL,
    reuseExistingServer: false,
    env: { ...process.env, VITE_APP_PRELOAD_STATE: "false" },
  },
});
