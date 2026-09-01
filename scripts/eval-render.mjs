#!/usr/bin/env node
/**
 * eval-render — render a candidate and measure contrast on real pixels.
 *
 * `scripts/eval.mjs` reads source: imports, class strings, props. That catches
 * a `chrome.*` token on a flipping surface and a light ground with no `light`
 * class, but only where the mistake is visible in the text of the file. The
 * defect this package keeps shipping is not visible there. Text at 1.08:1
 * happens when a token RESOLVES wrong against a ground three ancestors up —
 * nothing in the candidate's own source says so, and no amount of reading it
 * will.
 *
 * So this renders. The candidate is bundled against the package's real `dist/`,
 * server-rendered, given a stylesheet Tailwind generates by scanning `dist/` and
 * the candidate, and loaded in Chromium. Then every run of visible text is
 * measured: its computed colour, the first opaque background above it, and the
 * ratio between them against the floors in `machine/accessibility.yaml`.
 *
 * WHAT IT WILL NOT CLAIM. A text run sitting on a background IMAGE has no
 * computable ground — the package's textured fields are exactly that — so those
 * are reported as `unknown`, never as a pass. A checker that silently scored
 * them green would be worse than no checker, which is the failure mode two of
 * the source checks already shipped.
 *
 * Both themes, because that is where the bug lives: `chrome.*` and `themed`
 * share their dark values and diverge only in light, so a wrong pick looks
 * correct until someone opens light mode.
 *
 *   node scripts/eval-render.mjs [--candidates <dir>] [--case <name>]
 *                                [--shot] [--json]
 *
 * `--shot` also writes a PNG per candidate per theme beside the candidate.
 */

import { build } from 'esbuild'
import { mkdirSync, readFileSync, readdirSync, writeFileSync, existsSync, rmSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { renderToStaticMarkup } from 'react-dom/server'
import yaml from 'js-yaml'

const root = resolve(import.meta.dirname, '..')
const a11y = yaml.load(readFileSync(resolve(root, 'machine/accessibility.yaml'), 'utf8'))
const FLOORS = a11y.contrast.floors

const args = process.argv.slice(2)
const flag = (n, d = null) => {
  const i = args.indexOf(`--${n}`)
  return i === -1 ? d : args[i + 1]
}
const dir = flag('candidates', 'evals/candidates')
const onlyCase = flag('case')
const wantShot = args.includes('--shot')
const asJson = args.includes('--json')

const WORK = resolve(root, 'evals/runs/.render')

/**
 * The pre-installed browser, not one Playwright would download. The npm package
 * pins a build number that need not match what the image ships, and the
 * mismatch surfaces as "Executable doesn't exist" naming a directory that was
 * never there. Resolve what IS there instead.
 */
function chromiumPath() {
  const base = '/opt/pw-browsers'
  if (!existsSync(base)) return undefined
  const dirs = readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort()
  for (const d of dirs.reverse()) {
    const exe = join(base, d, 'chrome-linux', 'chrome')
    if (existsSync(exe)) return exe
  }
  return undefined
}

// ------------------------------------------------------------------- build

/** Tailwind must SCAN the package, or every utility only it uses is absent. */
function buildStylesheet() {
  mkdirSync(WORK, { recursive: true })
  const input = join(WORK, 'in.css')
  const output = join(WORK, 'out.css')
  writeFileSync(
    input,
    [
      '@import "tailwindcss";',
      `@import "${resolve(root, 'styles/index.css')}";`,
      `@source "${resolve(root, 'dist')}";`,
      `@source "${resolve(root, 'evals')}";`,
      '',
    ].join('\n'),
  )
  execFileSync(resolve(root, 'node_modules/.bin/tailwindcss'), ['-i', input, '-o', output], {
    cwd: root,
    stdio: 'pipe',
  })
  const css = readFileSync(output, 'utf8')
  if (!/min-h-14|py-\[128px\]/.test(css)) {
    throw new Error('stylesheet does not carry package utilities — the @source did not take')
  }
  return css
}

async function ssr(file, i) {
  const out = join(WORK, `bundle-${i}.mjs`)
  await build({
    entryPoints: [file],
    bundle: true,
    format: 'esm',
    outfile: out,
    jsx: 'automatic',
    platform: 'node',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    alias: { '@skene/design-system': resolve(root, 'dist') },
    logLevel: 'silent',
  })
  const mod = await import(`${out}?t=${Date.now()}`)
  const Page = mod.default
  if (typeof Page !== 'function') throw new Error('candidate has no default export component')
  return renderToStaticMarkup(Page())
}

const page = (body, css, theme) => `<!doctype html>
<html class="${theme}"><head><meta charset="utf-8"><style>${css}</style>
<style>body{margin:0;background:var(--color-surface-0);color:var(--color-text-primary)}</style>
</head><body><main>${body}</main></body></html>`

// ------------------------------------------------------------- measurement

/**
 * Runs in the page. Every element that owns visible text, its computed colour,
 * and the first ancestor with an opaque background. An element whose ground is
 * an image is reported rather than scored — see the header.
 */
const PROBE = `() => {
  // Convert ANY CSS colour through the canvas, not a regex.
  //
  // The first cut parsed \`rgba?(...)\` only. Chromium returns these components'
  // colours as \`oklch(...)\`, so eleven of twelve text runs on the first page
  // measured were silently skipped and the checker reported no failures while
  // looking at 8% of the page — the same fail-open as the two source checks.
  // The canvas normalises oklch, lab, color(), hex and named colours alike, and
  // anything it cannot parse stays null and is REPORTED rather than dropped.
  const cv = document.createElement('canvas')
  cv.width = cv.height = 1
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  const toRgb = (css) => {
    if (!css) return null
    ctx.clearRect(0, 0, 1, 1)
    ctx.fillStyle = '#000'
    ctx.fillStyle = css
    // An unparseable value leaves fillStyle at the previous colour, so a
    // transparent input is the only legitimate way to land back on black.
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    return { rgb: [d[0], d[1], d[2]], a: d[3] / 255 }
  }
  const lum = ([r, g, b]) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4) }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const out = []
  for (const el of document.querySelectorAll('body *')) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ')
    if (!own) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue

    const size = parseFloat(cs.fontSize)
    const weight = Number(cs.fontWeight) || 400
    const large = size >= 24 || (size >= 18.66 && weight >= 700)
    const text = own.length > 60 ? own.slice(0, 57) + '...' : own

    const fg = toRgb(cs.color)
    if (!fg) { out.push({ text, large, ground: 'unreadable-colour', raw: cs.color }); continue }
    if (fg.a === 0) continue

    let node = el, bg = null, image = false
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node)
      if (s.backgroundImage && s.backgroundImage !== 'none') { image = true; break }
      const b = toRgb(s.backgroundColor)
      if (b && b.a >= 0.999) { bg = b; break }
      node = node.parentElement
    }
    if (!bg && !image) {
      const b = toRgb(getComputedStyle(document.body).backgroundColor)
      if (b && b.a >= 0.999) bg = b
    }
    if (image || !bg) { out.push({ text, large, ground: image ? 'image' : 'transparent' }); continue }

    const L1 = lum(fg.rgb), L2 = lum(bg.rgb)
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
    out.push({
      text, large, ratio: Math.round(ratio * 100) / 100,
      fg: 'rgb(' + fg.rgb.join(', ') + ')', bg: 'rgb(' + bg.rgb.join(', ') + ')',
    })
  }
  return out
}`

async function measure(browser, html, theme) {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await p.setContent(html, { waitUntil: 'load' })
  // `evaluate` with a string evaluates it as an EXPRESSION, so passing the
  // arrow source alone returns an unserializable function, not its result.
  const runs = await p.evaluate(`(${PROBE})()`)
  const shot = wantShot ? await p.screenshot({ fullPage: true }) : null
  await p.close()

  const failures = []
  let unknown = 0
  const unreadable = runs.filter((r) => r.ground === 'unreadable-colour')
  if (unreadable.length) {
    // Never silent. A colour the canvas cannot read is a gap in THIS harness,
    // and reporting zero failures because the measurement failed is the exact
    // thing this file exists to stop.
    throw new Error(
      `cannot read ${unreadable.length} computed colour(s), e.g. "${unreadable[0].raw}" — the harness cannot measure this page`,
    )
  }
  for (const r of runs) {
    if (r.ground) { unknown += 1; continue }
    const floor = r.large ? FLOORS.large_text : FLOORS.body_text
    if (r.ratio < floor) failures.push({ ...r, floor, theme })
  }
  return { theme, measured: runs.length, scored: runs.length - unknown, unknown, failures, shot }
}

// --------------------------------------------------------------------- run

export async function render({ dir: d = 'evals/candidates', caseFilter = null } = {}) {
  const { chromium } = await import('playwright')
  const css = buildStylesheet()
  const exe = chromiumPath()
  const browser = await chromium.launch(exe ? { executablePath: exe } : {})

  const report = []
  let i = 0
  try {
    const base = resolve(root, d)
    for (const kase of readdirSync(base).filter((c) => !caseFilter || c === caseFilter)) {
      const caseDir = join(base, kase)
      for (const f of readdirSync(caseDir).filter((f) => f.endsWith('.tsx'))) {
        const label = basename(f, '.tsx')
        i += 1
        try {
          const body = await ssr(join(caseDir, f), i)
          const themes = []
          for (const theme of ['dark', 'light']) {
            const m = await measure(browser, page(body, css, theme), theme)
            if (m.shot) {
              // Never beside a committed fixture: a binary that lands in
              // evals/candidates/ is a build artifact in the corpus.
              const shots = resolve(root, 'evals/runs/shots', kase)
              mkdirSync(shots, { recursive: true })
              writeFileSync(join(shots, `${label}.${theme}.png`), m.shot)
            }
            delete m.shot
            themes.push(m)
          }
          report.push({ case: kase, label, themes })
        } catch (err) {
          // Keep the whole message: a candidate that will not build is the
          // most informative failure there is — it means the page imports
          // something the package does not export, which is precisely what
          // `props_exist` reports from source and this confirms at link time.
          report.push({ case: kase, label, error: err.message.replace(/\s+/g, ' ').slice(0, 300) })
        }
      }
    }
  } finally {
    await browser.close()
    rmSync(WORK, { recursive: true, force: true })
  }
  return report
}

async function main() {
  const report = await render({ dir, caseFilter: onlyCase })
  if (asJson) return void console.log(JSON.stringify(report, null, 2))

  let bad = 0
  for (const c of report) {
    if (c.error) {
      bad += 1
      console.log(`\n\x1b[31m✗\x1b[0m ${c.case}/${c.label}  did not render: ${c.error}`)
      continue
    }
    const fails = c.themes.flatMap((t) => t.failures)
    const mark = fails.length ? '\x1b[31m✗\x1b[0m' : '\x1b[32m✓\x1b[0m'
    if (fails.length) bad += 1
    const counts = c.themes
      .map((t) => `${t.theme} ${t.scored} scored${t.unknown ? `, ${t.unknown} unscorable` : ''}`)
      .join(' · ')
    console.log(`\n${mark} ${c.case}/${c.label}  ${counts}`)
    for (const f of fails) {
      console.log(
        `    \x1b[31m${f.ratio}:1\x1b[0m against a ${f.floor}:1 floor  [${f.theme}${f.large ? ', large' : ''}]`,
      )
      console.log(`      "${f.text}"  ${f.fg} on ${f.bg}`)
    }
  }
  console.log()
  if (bad) process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}
