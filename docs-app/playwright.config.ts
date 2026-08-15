import { defineConfig, devices } from '@playwright/test'

/**
 * Visual coverage for the package.
 *
 * The 26 unit tests are structural — token coverage, client boundaries,
 * dependency shape. Nothing looked at a rendered primitive until now, which
 * meant a broken component could ship with a green suite.
 *
 * docs-app is the natural harness: it already renders every primitive and
 * pattern, and consumes the package exactly as an app would, so a failure here
 * is a real failure rather than a fixture drifting.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  timeout: 120_000,
  expect: {
    // threshold 0.04, not pixelmatch's usual 0.1-0.2. This gate exists to catch
    // a token changing value, and at 0.2 it demonstrably does not: pixelmatch
    // allows a YIQ delta of 35215 * threshold^2, so 0.2 allows 1408, while the
    // colour changes this package actually ships land between 86 and 316.
    // Three shadcn slots were repainted — including the active sidebar item —
    // and these snapshots reported 3/3 green. 0.04 allows 56, below the
    // smallest of them.
    //
    // maxDiffPixelRatio carries the anti-aliasing tolerance instead, which is
    // the right knob: text rasterisation moves a few hundred pixels per run,
    // against a budget of ~2,300 on a 1280x900 capture.
    toHaveScreenshot: { maxDiffPixelRatio: 0.002, threshold: 0.04, animations: 'disabled', scale: 'css' },
  },
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{platform}{ext}',
  use: {
    baseURL: 'http://127.0.0.1:3210',
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 1,
    timezoneId: 'UTC',
    locale: 'en-US',
  },
  webServer: {
    // NODE_ENV pinned: a stray development value makes next build emit a hybrid
    // bundle whose React internals disagree, which crashes prerendering on a
    // different random page each run.
    command: 'NODE_ENV=production npx next build && npx next start -p 3210',
    url: 'http://127.0.0.1:3210',
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
