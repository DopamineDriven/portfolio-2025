import { join, relative } from "node:path";
import { defineConfig, devices } from "@playwright/test";

// This config is loaded as a native ES module (apps/web is `type: module`), so
// `import.meta.dirname` — not `__dirname` — resolves to apps/web. The Next dev
// server must be started through the root turbo script (never `next dev` from
// inside apps/web — that corrupts the turbo cache), so the webServer runs
// `pnpm run:web` with its cwd set to the monorepo root.
const appDir = import.meta.dirname;
const repoRoot = join(appDir, "..", "..");
const baseURL = "http://localhost:3030";
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: join(appDir, "src/__e2e__"),
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  tsconfig: relative(process.cwd(), "tsconfig.json"),
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: { timeout: 10000 },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "on"
  },
  projects: [
    {
      name: "chromium",
      // Drive the full Chromium binary (new headless) instead of the
      // lightweight chrome-headless-shell, which was the source of the
      // browser-launch / headless instability we hit.
      use: { ...devices["Desktop Chrome"], channel: "chromium" }
    }
  ],
  webServer: [
    {
      name: "web-next",
      command: "pnpm run:web-next",
      cwd: repoRoot,
      url: baseURL,
      reuseExistingServer: !isCI,
      timeout: 120000,
      stdout: "ignore",
      stderr: "pipe"
    },
    {
      command: "pnpm run:ws-server",
      cwd: repoRoot,
      timeout: 120000,
      stdout: "ignore",
      reuseExistingServer: true,
      stderr: "pipe",
      url: "ws://localhost:4000",
      name: "ws-server"
    }
  ]
});
