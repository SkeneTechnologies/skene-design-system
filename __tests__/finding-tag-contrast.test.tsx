import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Finding, type FindingStatus } from '../src/sections/finding-card.js'

/**
 * The check `npm run tokens:contrast` structurally cannot be.
 *
 * That script scores declared token PAIRS: a foreground token, a background
 * token, a row in a table. `Finding`'s tag has no such pair. Its background is
 * computed at render time by `color-mix` FROM its foreground, so there is no
 * row for it and there never can be without teaching that table to evaluate
 * `color-mix`. The defect surfaced the only way it could — a consumer rendered
 * the component on `/developers` and measured pixels:
 *
 *     danger  rgb(196,66,57)  on rgb(244,221,219)   3.88
 *     good    rgb(103,117,82) on rgb(228,230,224)   3.94
 *     warn    rgb(136,106,47) on rgb(234,228,218)   4.00
 *
 * against a 4.5:1 floor, at 9px, which is small text under WCAG 2.2 by any
 * reading. Nine failures across three states, and skene-site reverted its two
 * uses rather than ship them.
 *
 * So this test does what the consumer did, in the package. It RENDERS the
 * component, reads the two colours and the tint percentage back out of the
 * inline style it actually emitted, composites the tint over the card fill the
 * component actually chose, and scores the result. Nothing here is a
 * transcription of what the source is believed to say: change the tint, the
 * ink, the card fill or the type size and this recomputes rather than going
 * stale.
 *
 * The three grounds it reproduces, byte for byte, are the ones above — see the
 * `reproduces the numbers the consumer measured` case, which pins the OLD
 * arithmetic so the fix cannot be claimed by a change to the maths.
 */

const ROOT = resolve(__dirname, '..')
const FLOOR = 4.5

/* ── tokens ──────────────────────────────────────────────────────────────── */

type Mode = 'light' | 'dark'

/** Authored camelCase; the CSS custom properties are kebab. */
function kebab(seg: string): string {
  if (/^\d/.test(seg)) return seg.replace(/\./g, '-')
  return seg
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z]{2,})(\d)/g, '$1-$2')
    .toLowerCase()
}

/** `--color-…` → hex, per mode. Invariant tokens answer the same in both. */
function loadTokens(mode: Mode): Map<string, string> {
  const raw = JSON.parse(readFileSync(resolve(ROOT, 'design-tokens.json'), 'utf8'))
  const out = new Map<string, string>()
  const walk = (node: unknown, path: string[]): void => {
    if (typeof node !== 'object' || node === null) return
    const leaf = node as { $value?: string; $modes?: Record<string, string> }
    if ('$value' in leaf || '$modes' in leaf) {
      const value = leaf.$modes ? leaf.$modes[mode] : leaf.$value
      if (typeof value === 'string') out.set(`--${path.map(kebab).join('-')}`, value)
      return
    }
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (k.startsWith('$')) continue
      walk(v, [...path, k])
    }
  }
  walk(raw, [])
  return out
}

/* ── colour ──────────────────────────────────────────────────────────────── */

type Rgb = [number, number, number]

function hexToRgb(hex: string): Rgb {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb
}

const toLinear = (c: number): number => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

const fromLinear = (c: number): number => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
  return Math.min(255, Math.max(0, v)) * 255
}

function rgbToOklab([r, g, b]: Rgb): Rgb {
  const [R, G, B] = [toLinear(r), toLinear(g), toLinear(b)]
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B)
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B)
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function oklabToRgb([L, a, b]: Rgb): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

/**
 * `color-mix(in oklab, C P%, transparent)`, then composited over `ground`.
 *
 * `transparent` is `rgba(0,0,0,0)`, and CSS interpolates with PREMULTIPLIED
 * alpha, so the un-premultiplied result is C itself at alpha P — it is a tint,
 * not a darkening. The oklab round trip is kept anyway rather than shortcut,
 * because it is the operation the browser performs and skipping it would make
 * this a model of the fix instead of a model of the render.
 */
function tintOver(color: Rgb, percent: number, ground: Rgb): Rgb {
  const alpha = percent / 100
  const mixed = oklabToRgb(rgbToOklab(color).map((c) => (c * alpha) / alpha) as Rgb)
  return mixed.map((c, i) => Math.round(alpha * c + (1 - alpha) * ground[i])) as Rgb
}

function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/* ── what the component actually renders ─────────────────────────────────── */

/** Tailwind's own `white`, which is not a token and has no entry to look up. */
const BG_CLASS_FALLBACK: Record<string, string> = { 'bg-white': '#ffffff' }

interface Rendered {
  ink: string
  graphic: string
  percent: number
  fillClass: string
  fontSize: string
}

/**
 * Read the pair back out of the markup rather than out of the source.
 *
 * The tag's colours arrive as an inline `style`, the card's fill as a class on
 * the root, and the type size as a utility. All three are inputs to the score,
 * so all three are parsed: a future edit that changes any of them changes what
 * this test measures instead of leaving it measuring the old thing.
 */
function render(status: FindingStatus, onLight: boolean): Rendered {
  const html = renderToStaticMarkup(
    <Finding status={status} onLight={onLight} tag="MISSING" title="signup_started" />,
  )

  const tag = html.match(/<span class="([^"]*text-\[9px\][^"]*)" style="([^"]*)"/)
  expect(tag, `no 9px tag span found in the rendered ${status} finding`).not.toBeNull()

  const style = tag![2]
  const mix = style.match(/color-mix\(in oklab,\s*var\((--[\w-]+)\)\s*([\d.]+)%,\s*transparent\)/)
  expect(mix, `the tag background is not a color-mix tint: ${style}`).not.toBeNull()

  const ink = style.match(/(?:^|;)color:\s*var\((--[\w-]+)\)/)
  expect(ink, `the tag ink is not a token: ${style}`).not.toBeNull()

  const fill = html.match(/<div class="[^"]*\b(bg-[\w-]+)\b[^"]*"/)
  expect(fill, 'no card fill class found on the Finding root').not.toBeNull()

  return {
    ink: ink![1],
    graphic: mix![1],
    percent: Number(mix![2]),
    fillClass: fill![1],
    fontSize: tag![1].match(/text-\[(\d+px)\]/)![1],
  }
}

/**
 * The two coherent grounds. `onLight` switches the CARD; the mode class on an
 * ancestor switches the TOKENS. A light card inside a `ProductWindow` gets the
 * light values — that is the combination the consumer measured — and a dark
 * card on a dark page gets the dark ones.
 */
const GROUNDS: { name: string; onLight: boolean; mode: Mode }[] = [
  { name: 'light card, light tokens', onLight: true, mode: 'light' },
  { name: 'dark card, dark tokens', onLight: false, mode: 'dark' },
]

const STATUSES: FindingStatus[] = ['danger', 'good', 'warn']

/**
 * One pair that does NOT clear, recorded rather than waived.
 *
 * `Finding`'s dark card is `chrome.surface.2` (#212121). The dark `*OnTint`
 * values are the base tokens unchanged, derived on the ground `StatPill` sits
 * on inside an `AppWindow` — `surface.1`, #171717 — where error-red at a 12%
 * tint measures 4.55 and clears. This card is one rung LIGHTER than that, and
 * the same ink on the same tint measures 4.06.
 *
 * It is not fixable from this component: the ink is already the darkest…
 * lightest value the token set offers for dark, and a tint low enough to
 * rescue it (about 3%) is not a tint. Closing it means either a new dark
 * on-tint value or moving the card to `surface.1`, and `machine/rules.yaml`
 * makes a token value change and a surface-role reassignment both ask-first.
 * So it is asserted at its measured value: it cannot drift, it cannot get
 * worse unnoticed, and whoever fixes it has to come here and say so.
 */
const BELOW_FLOOR: Record<string, number> = {
  'dark card, dark tokens/danger': 4.06,
}

function score(status: FindingStatus, ground: (typeof GROUNDS)[number]): {
  ratio: number
  ink: Rgb
  tinted: Rgb
  rendered: Rendered
} {
  const tokens = loadTokens(ground.mode)
  const rendered = render(status, ground.onLight)

  const resolve1 = (name: string): string => {
    const v = tokens.get(name)
    expect(v, `${name} is not a colour token`).toBeDefined()
    return v!
  }

  const fill =
    BG_CLASS_FALLBACK[rendered.fillClass] ??
    resolve1(`--color-${rendered.fillClass.replace(/^bg-/, '')}`)

  const ink = hexToRgb(resolve1(rendered.ink))
  const tinted = tintOver(hexToRgb(resolve1(rendered.graphic)), rendered.percent, hexToRgb(fill))
  return { ratio: contrast(ink, tinted), ink, tinted, rendered }
}

describe('Finding tag contrast, computed from what it renders', () => {
  it('is still 9px, which is what puts it under the body floor', () => {
    // If this ever grows past large-text size the floor argument changes, and
    // that is a decision to take deliberately rather than to inherit.
    for (const status of STATUSES) expect(render(status, true).fontSize).toBe('9px')
  })

  it('reproduces the numbers the consumer measured, so the maths is not the fix', () => {
    // The OLD arithmetic — full-strength ink on an 18% tint of itself — scored
    // against the grounds skene-site reported off real pixels on /developers.
    // These are the exact rgb() triples in ask r. If this case ever drifts, the
    // compositing model changed and every other number here is worth nothing.
    const tokens = loadTokens('light')
    const white: Rgb = [255, 255, 255]
    const before: [FindingStatus, string, Rgb, number][] = [
      ['danger', '--color-semantic-error-red', [244, 221, 219], 3.88],
      ['good', '--color-semantic-matcha', [228, 230, 224], 3.94],
      ['warn', '--color-semantic-warning-amber', [234, 228, 218], 4.0],
    ]
    for (const [, token, ground, ratio] of before) {
      const base = hexToRgb(tokens.get(token)!)
      const tinted = tintOver(base, 18, white)
      expect(tinted).toEqual(ground)
      expect(contrast(base, tinted)).toBeCloseTo(ratio, 1)
    }
  })

  it('no longer paints the ink and the tint from one token', () => {
    for (const ground of GROUNDS) {
      for (const status of STATUSES) {
        const { rendered } = score(status, ground)
        expect(
          rendered.ink,
          `${status} still takes its ink from its own graphic colour`,
        ).not.toBe(rendered.graphic)
      }
    }
  })

  it('clears 4.5:1 in every state on every ground it renders on', () => {
    const failures: string[] = []
    const report: string[] = []

    for (const ground of GROUNDS) {
      for (const status of STATUSES) {
        const { ratio, ink, tinted, rendered } = score(status, ground)
        const key = `${ground.name}/${status}`
        const line = `${key}: rgb(${ink}) on rgb(${tinted}) at ${rendered.percent}% = ${ratio.toFixed(2)}`
        report.push(line)

        // Collected, never thrown mid-loop: one drifted pair must not hide
        // the other five. The first version threw on the recorded exception
        // and reported exactly one line when the ink swap was backed out, so
        // the three failures the guard exists for were invisible.
        const recorded = BELOW_FLOOR[key]
        if (recorded !== undefined) {
          if (Math.abs(ratio - recorded) > 0.05) {
            failures.push(`${line}  — recorded at ${recorded}; update BELOW_FLOOR or close it`)
          }
          continue
        }
        if (ratio < FLOOR) failures.push(line)
      }
    }

    expect(failures, `below the ${FLOOR}:1 floor:\n  ${failures.join('\n  ')}\n\nall:\n  ${report.join('\n  ')}`).toEqual([])
  })
})
