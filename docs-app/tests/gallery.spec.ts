import { test, expect } from '@playwright/test'

/**
 * One snapshot per page. The pages are dense on purpose, so a single diff
 * covers every primitive and pattern rather than needing one test each.
 */
const PAGES = [
  ['index', '/'],
  ['surfaces', '/surfaces'],
  ['pages', '/pages'],
] as const

for (const [name, path] of PAGES) {
  test(name, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' })
    // A font swap after capture is the most common false diff, and
    // document.fonts.ready alone resolves happily when a font never loaded.
    await page.evaluate(() => document.fonts.ready)
    const ok = await page.evaluate(() => document.fonts.check('16px Geist'))
    expect(ok, 'Geist did not load; the snapshot would capture fallback metrics').toBe(true)
    await page.addStyleTag({
      content: '*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important}',
    })
    await page.waitForTimeout(200)
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true })
  })
}
