import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3001;
const APP_BASE_URL = `http://localhost:${APP_PORT}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: APP_BASE_URL,
    trace: "on-first-retry",
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
