import { expect, test, type Locator, type Page } from '@playwright/test'

/**
 * Per-component visual baselines, captured from /components.
 *
 * gallery.spec.ts takes one snapshot per PAGE. That was the whole visual gate
 * for a package of 29 primitives, 7 patterns and 9 sections, and it is too
 * coarse to be useful: three shadcn token values were repainted at once — one
 * of them the active sidebar item — and it reported 3/3 green. The marketing
 * repo's per-component suite is what actually caught this package's
 * regressions, so this is that suite, moved in.
 *
 * Two things it does that the page suite does not:
 *
 * 1. One snapshot per component, so a diff names a culprit instead of saying
 *    "the index page changed". Failures are collected rather than thrown, so
 *    one drifted component does not hide the other forty-four.
 *
 * 2. Every case is captured in BOTH modes. The mode class goes on <html>, not
 *    on a wrapper div, for two reasons. Radix portals dialogs, popovers, menus,
 *    tooltips and select content to document.body, where a wrapper's `.light`
 *    cannot reach them — half the shadcn palette lives in exactly those
 *    surfaces. And the package exists because its two consumers invert: several
 *    tokens differ only in light, so a dark-only gallery is blind to them by
 *    construction. That is the class of bug that produced the light-mode brand
 *    palette work in the first place.
 *
 * The case list is read out of the DOM, so adding a <Case> to the page adds
 * baselines with no change here. See app/components/page.tsx for the contract.
 *
 * Run:     bash ../scripts/visual.sh          (update)
 *          VISUAL_MODE=verify bash ../scripts/visual.sh
 */

const ROUTE = '/components'
const MODES = ['dark', 'light'] as const

/**
 * Belt to Playwright's `animations: 'disabled'` braces. Playwright freezes
 * animations at capture time; this also kills transitions, which Radix uses for
 * the open/close states of every overlay on the page.
 */
const FREEZE_CSS = `
  :root { --visual-freeze-marker: 1; }
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
`

interface Case {
  name: string
  /** How to reveal the overlay: click or hover `[data-visual-act]`. */
  open: 'click' | 'hover' | null
  /** Selector for the portalled surface to capture as `<name>-open`. */
  content: string | null
}

/** Somewhere guaranteed to be page padding, so nothing is left in :hover. */
async function parkPointer(page: Page): Promise<void> {
  await page.mouse.move(0, 0)
}

async function prepare(page: Page, mode: (typeof MODES)[number]): Promise<Case[]> {
  await page.goto(ROUTE, { waitUntil: 'networkidle' })

  // A font swap after capture is the most common false diff, and
  // document.fonts.ready alone resolves happily when a font never loaded — the
  // page then renders in the fallback, every line box changes height, and the
  // drift down the page looks exactly like a CSS regression.
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  const fonts = await page.evaluate(() => ({
    sans: document.fonts.check('16px Geist'),
    mono: document.fonts.check('16px "Geist Mono"'),
  }))
  expect(
    fonts,
    'Geist did not load; the snapshots would capture fallback metrics',
  ).toEqual({ sans: true, mono: true })

  // The APP's stylesheet, not the one this test injects. Both matter and only
  // one of them was checked.
  //
  // Found on 2026-08-13 in a sibling app whose dev server was returning 500 for
  // its CSS chunk: every page rendered with no Tailwind and no tokens, and a
  // harness sampling it reported real numbers about a page that never looked
  // that way — black-on-olive from UA defaults, read as a contrast failure on
  // copy that was correct. Turbopack injects CSS through JS, so `networkidle`
  // can fire in the gap even when the compile succeeded.
  //
  // A token is the right probe: `--color-brand-peach` only exists if the
  // package's own stylesheet loaded, so this fails when the import chain breaks
  // as well as when the server does.
  // Compared as a NUMBER, not as the string the token was authored as. The
  // first version asserted `'0.2rem'` and failed on its first run against a
  // page that was rendering perfectly: the minifier writes `.2rem`, and a
  // leading zero is not a fact about whether the stylesheet loaded. A guard
  // that fails toward FAIL is worse than no guard — it sends you to fix
  // something that was right.
  const tokensLive = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    return {
      peach: root.getPropertyValue('--color-brand-peach').trim(),
      spacing: parseFloat(root.getPropertyValue('--spacing')),
    }
  })
  expect(
    tokensLive.peach.toLowerCase(),
    'the design system stylesheet has not applied; every snapshot would capture an unstyled page',
  ).toBe('#fec089')
  // 0.2rem, not Tailwind's 0.25rem default: if this reads 0.25 the package
  // stylesheet is missing while Tailwind's own is present, which renders a page
  // that looks nearly right and is 25% loose in every direction.
  expect(tokensLive.spacing, '--spacing is not the package value').toBeCloseTo(0.2, 5)

  await page.addStyleTag({ content: FREEZE_CSS })
  const frozen = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue('--visual-freeze-marker')
      .trim(),
  )
  expect(frozen, 'FREEZE_CSS did not apply; animations are live').toBe('1')

  // The mode goes on the document element so portalled content inherits it.
  await page.evaluate((m) => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(m)
  }, mode)

  // SectionBackdrop and FinalCta paint shipped .webp textures as CSS
  // background-images, which are only fetched once their element is painted. A
  // capture that races the decode is a false diff, and it presents as one
  // section changing while everything around it holds. Scroll the whole page so
  // every backdrop is realised, then wait the network out.
  await page.evaluate(async () => {
    for (const img of Array.from(document.images)) {
      img.loading = 'eager'
      img.decoding = 'sync'
    }
    const step = window.innerHeight
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 16))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})

  const cases = await page.locator('[data-visual]').evaluateAll((nodes) =>
    nodes.map((n) => ({
      name: n.getAttribute('data-visual') ?? '',
      open: n.getAttribute('data-visual-open') as 'click' | 'hover' | null,
      content: n.getAttribute('data-visual-content'),
    })),
  )
  expect(cases.length, 'no [data-visual] cases found in the gallery').toBeGreaterThan(0)

  await parkPointer(page)
  await page.waitForTimeout(150)
  return cases
}

test('gallery is reachable and every component is claimed by a case', async ({ page }) => {
  const res = await page.goto(ROUTE, { waitUntil: 'domcontentloaded' })
  expect(res?.status()).toBe(200)
  const names = await page
    .locator('[data-visual]')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('data-visual')))
  // Guards against a silent regression to the coarse coverage this replaced:
  // if someone deletes cases, the suite must fail rather than quietly shrink.
  //
  // Raised 45 → 79 on 2026-08-13 with the sixteen product-artifact cases. Those
  // sections had shipped with no case at all, which meant no baseline, which
  // meant the duplication findings against them — one caption strip written out
  // four times, VerifyRow copied line-for-line — had no way to be proven
  // harmless. A merge that cannot be shown to change nothing is not a merge.
  //
  // Raised 81 → 82 on 2026-08-27 with `section-logo-row`, for the third time
  // and for the same reason: `LogoRow` had no case, so no baseline covered it,
  // so it shipped every spacing value at 80% of the number its own comments
  // claimed and this suite reported green. That is now twice that a module with
  // no case has been the one carrying the defect, which makes the count below a
  // ratchet on the class rather than a tally.
  //
  // Raised 82 → 87 on 2026-08-28 with the five straightforward modules off that
  // list: `section-code`, `pattern-pill-nav-frosted`, `section-surface-cards`,
  // `section-team-card` and `section-integrations-highlight`. It was the third
  // of those five sittings that made the point for the third time — writing
  // `section-integrations-highlight` found the band rendering its animation at
  // 0x0, in a module whose only defence was that nothing had ever looked at it.
  // Four modules still have no case (`docs/sections.md` names them and ranks
  // them); `ui/sonner` is the only one that is meant to be there.
  expect(names.length).toBeGreaterThanOrEqual(87)
  expect(new Set(names).size, 'duplicate data-visual names').toBe(names.length)
})

for (const mode of MODES) {
  test(`components — ${mode}`, async ({ page }) => {
    const cases = await prepare(page, mode)
    const failures: string[] = []

    /**
     * One thing to know before reading a failure list here: these are ELEMENT
     * captures, and an element's rasterisation depends on where it sits on the
     * page. Change the height of any case and every case below it lands on a
     * different fractional Y, which comes back as a ±1px capture height or as a
     * scatter of sub-pixel deltas — mean under 2/255, invisible side by side,
     * and reported exactly like a real regression.
     *
     * Measured 2026-08-13: a 1px taller chip in `section-faq-band` moved 64
     * baselines, of which 2 were the change and 62 were the reflow behind it.
     * So when a change alters any case's height, predict the tail as well as
     * the diff, and classify the moved files (compare sizes, then mean delta)
     * before rebaselining. A list you cannot account for is a list you are
     * about to accept blind.
     */
    const shoot = async (target: Locator, name: string) => {
      try {
        await expect(target).toHaveScreenshot(`${name}-${mode}.png`)
      } catch (err) {
        // Collected, not thrown: one drifted component must not hide the rest.
        failures.push(`${name}-${mode}: ${(err as Error).message.split('\n')[0]}`)
      }
    }

    for (const c of cases) {
      const root = page.locator(`[data-visual="${c.name}"]`)
      await parkPointer(page)
      await root.scrollIntoViewIfNeeded()
      await shoot(root, c.name)

      if (!c.content) continue

      const content = page.locator(c.content)
      try {
        const act = root.locator('[data-visual-act]')
        if (c.open === 'hover') await act.hover()
        else await act.click()
        await content.waitFor({ state: 'visible', timeout: 10_000 })
        await page.waitForTimeout(120)
        await shoot(content, `${c.name}-open`)
      } catch (err) {
        failures.push(`${c.name}-open-${mode}: ${(err as Error).message.split('\n')[0]}`)
      } finally {
        // One close path for every overlay kind: Escape dismisses the ones with
        // a dismissable layer, moving the pointer away dismisses the hover ones,
        // and a case may ship its own closer for anything neither reaches.
        await page.keyboard.press('Escape').catch(() => {})
        await parkPointer(page)
        const closer = root.locator('[data-visual-close]')
        if (await closer.count()) await closer.click().catch(() => {})
        await content.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {})
      }
    }

    expect(
      failures,
      `${failures.length} snapshot(s) drifted in ${mode}:\n${failures.join('\n')}`,
    ).toEqual([])
  })
}
