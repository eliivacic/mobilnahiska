import { defineConfig, devices } from "@playwright/test";

// E2E tests run against a local dev server and the real (test) Supabase
// project. No email provider is configured in this environment
// (RESEND_API_KEY unset — see src/lib/email.ts), so inquiry/notification
// emails naturally no-op here instead of sending real mail; that's the
// intended "test transport" for these tests, not a workaround.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
