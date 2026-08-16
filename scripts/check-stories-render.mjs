#!/usr/bin/env node
/**
 * Render every story and fail on anything that throws, logs an error, or comes
 * out empty.
 *
 * ## Why this exists next to `storybook build`
 *
 * `storybook build` compiles the stories. It does not run them. A story that
 * type-checks, bundles and then throws on mount — a missing required prop
 * behind a `render`, a Radix primitive used outside its provider, invalid HTML
 * nesting — builds green and fails in a reviewer's browser. That is the worst
 * place to find it, because by then the gallery has already taught someone that
 * the component is broken.
 *
 * On the run that introduced this file it caught a real one: `AgentCallout`
 * wraps `children` in its own `<p>`, so a story passing a `<p>` produced
 * `<p>` inside `<p>`. React reports that as a console error and the browser
 * repairs it by closing the outer paragraph early, so the rendered tree does not
 * match the written one. Nothing else in the pipeline had an opinion about it.
 *
 * ## The settle, which is the part to not "simplify"
 *
 * It waits for `#storybook-root` to have content rather than sleeping a fixed
 * amount. A fixed 220ms was tried first and flagged 32 stories — and the
 * pattern gave it away: exactly the FIRST TWO stories of every client
 * component and none of the rest. A newly-loaded lazy chunk renders later than
 * a warm one. Every one of those 32 was a false failure produced by the
 * harness, not by the story.
 *
 * Lengthening the sleep would have moved the threshold without fixing the
 * class. Waiting on the actual condition removes it.
 *
 * Usage: start Storybook (`npm run storybook`) and `npm run stories:render`,
 * or pass a base URL as the first argument.
 */

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.argv[2] ?? process.env.STORYBOOK_URL ?? 'http://localhost:6006'
const INDEX = join(ROOT, 'storybook-static', 'index.json')

if (!existsSync(INDEX)) {
  console.error(`no ${INDEX} — run 'npm run storybook:build' first.`)
  process.exit(1)
}

// Playwright lives in docs-app, which is where the visual suite already keeps
// it. Importing it from there rather than adding a second copy at the root.
const { chromium } = await import(join(ROOT, 'docs-app/node_modules/@playwright/test/index.mjs'))

const ids = Object.values(JSON.parse(readFileSync(INDEX, 'utf8')).entries)
  .filter((e) => e.type === 'story')
  .map((e) => e.id)

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const bad = []
let n = 0

for (const id of ids) {
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e).split('\n')[0]))
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push('console: ' + m.text().split('\n')[0])
  })

  try {
    await page.goto(`${BASE}/iframe.html?id=${id}&viewMode=story`, {
      waitUntil: 'load',
      timeout: 30000,
    })
    await page.waitForFunction(
      () => (document.querySelector('#storybook-root')?.innerHTML ?? '').trim().length > 0,
      null,
      { timeout: 15000 },
    )
    await page.waitForTimeout(120)
    const root = await page.$('#storybook-root')
    const box = root ? await root.boundingBox() : null
    if (!box || box.width < 2 || box.height < 2) {
      errs.push(`ZERO-SIZE ${box?.width}x${box?.height}`)
    }
  } catch (e) {
    errs.push('NAV: ' + String(e).split('\n')[0])
  }

  // Noise that says nothing about the story.
  const real = errs.filter((e) => !/favicon|Download the React DevTools/i.test(e))
  if (real.length) bad.push({ id, errs: [...new Set(real)].slice(0, 3) })

  await page.close()
  if (++n % 80 === 0) console.log(`  …${n}/${ids.length}`)
}

await browser.close()

console.log(`rendered ${ids.length} stories, ${bad.length} with problems`)
for (const x of bad) {
  console.error(`\n  ${x.id}`)
  for (const e of x.errs) console.error(`     ${e}`)
}
process.exit(bad.length ? 1 : 0)
