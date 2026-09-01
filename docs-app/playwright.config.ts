import { defineConfig, devices } from '@playwright/test'

/**
 * The prefix every route in this app is served under.
 *
 * `next.config.ts` derives `basePath` from `designDocs` in the package
 * manifest, so nothing here is served at `/`. Derived from the same field
 * rather than written out, because the two drifting apart is exactly the
 * failure this constant exists to have fixed once.
 */
const BASE_PATH = new URL(
  (require('../package.json') as { designDocs: string }).designDocs,
).pathname.replace(/\/$/, '')

const ORIGIN = 'http://127.0.0.1:3210'

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
    /*
      Trailing slash, and the specs navigate with RELATIVE paths. A leading
      slash in `page.goto` is resolved against the origin and discards the
      basePath, which would send every test to a 404 that still screenshots.
    */
    baseURL: `${ORIGIN}${BASE_PATH}/`,
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
    /*
      The basePath, not the bare origin. `basePath` means `/` is a 404, and
      Playwright's readiness probe treats a 404 as not-ready, so polling the
      origin never succeeds: the job sat until the 300s webServer timeout and
      reported `Timed out waiting 300000ms from config.webServer` with no other
      output, which reads like a slow or hanging build rather than a URL that
      was never going to answer. Locally it was invisible, because
      `reuseExistingServer` skips the probe outside CI.
    */
    url: `${ORIGIN}${BASE_PATH}`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
})
