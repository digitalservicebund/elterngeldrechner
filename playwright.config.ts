import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3001;
const APP_BASE_URL = `http://127.0.0.1:${APP_PORT}`;

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
    command: `PORT=${APP_PORT} npm run start`,
    url: APP_BASE_URL,
    reuseExistingServer: false,
    env: { ...process.env, REACT_APP_PRELOAD_STATE: "false" },
  },
});
