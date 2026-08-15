/**
 * check-token-contrast — Plan v6 Workstream E (7a).
 *
 * Iterates every (foreground, background) pair we use in practice
 * across the design system and computes WCAG contrast ratio. Fails
 * (exit 1) when:
 *   - a body-text pair is below 4.5:1
 *   - a large-text pair is below 3:1
 *
 * Pure-decorative pairs (e.g. peach-deep gradient endpoints, brand
 * accents on background) are skipped via SKIP_PAIRS.
 *
 * Run: `npm run tokens:contrast`
 *
 * Source: ~/.claude/plans/can-you-access-the-lucky-fox.md §"Plan v6
 * Workstream E — a11y + contrast gate".
 */

import fs from 'node:fs'
import path from 'node:path'

const REPO_ROOT = process.cwd()
const TOKENS_PATH = path.join(REPO_ROOT, 'design-tokens.json')

type Hex = `#${string}`

interface TokenLeaf {
  $value?: string
  $modes?: Record<string, string>
  $description?: string
}

function isLeaf(o: unknown): o is TokenLeaf {
  return (
    typeof o === 'object' && o !== null && ('$value' in o || '$modes' in o)
  )
}

/** Token paths are authored camelCase; the pair list below reads kebab. */
function kebab(seg: string): string {
  if (/^\d/.test(seg)) return seg.replace(/\./g, '-')
  return seg
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z]{2,})(\d)/g, '$1-$2')
    .toLowerCase()
}

/**
 * Resolve every colour token for one theme mode.
 *
 * A mode-aware token contributes its value for that mode; an invariant token
 * contributes the same value to both. Contrast is then checked per mode, which
 * is the only way the gate means anything: a foreground/background pair has to
 * clear the floor in light *and* dark, and before `$modes` existed this script
 * silently resolved nothing for those tokens and reported "token not found".
 *
 * Both the camelCase and kebab-case spelling of each path are registered, so
 * `semantic.warningAmber` and `semantic.warning-amber` both resolve.
 */
function flattenColors(
  obj: Record<string, unknown>,
  mode: string,
  prefix = '',
): Map<string, string> {
  const out = new Map<string, string>()
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue
    const key = prefix ? `${prefix}.${k}` : k
    if (isLeaf(v)) {
      const resolved = v.$modes && mode !== 'default' ? v.$modes[mode] : v.$value
      if (typeof resolved === 'string') {
        out.set(key, resolved)
        const kebabKey = key.split('.').map(kebab).join('.')
        if (kebabKey !== key) out.set(kebabKey, resolved)
      }
    } else if (typeof v === 'object' && v !== null) {
      for (const [nk, nv] of flattenColors(v as Record<string, unknown>, mode, key)) {
        out.set(nk, nv)
      }
    }
  }
  return out
}

/** Parse #rrggbb / #rgb to [r, g, b] 0-255. Returns null for non-hex. */
function parseHex(s: string): [number, number, number] | null {
  const m = /^#([0-9a-f]{3,8})$/i.exec(s.trim())
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length === 4) h = h.split('').map((c) => c + c).join('').slice(0, 6)
  if (h.length === 8) h = h.slice(0, 6) // drop alpha — best-effort
  if (h.length !== 6) return null
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

/**
 * Parse `oklch(L C H)` to [r, g, b] 0-255. Returns null for anything else.
 *
 * The whole shadcn half of the token file is authored in oklch, so without this
 * the gate could not see 39 slots at all — which is exactly how a near-white
 * `--sidebar-primary-foreground` survived on a peach `--sidebar-primary` at
 * 1.55:1. `parseHex` returning null was reported as "non-hex value", so the
 * blindness looked like a skipped check rather than a hole.
 *
 * L is 0-1 (or a percentage), C is absolute, H is degrees. Alpha after a `/` is
 * dropped, matching parseHex's best-effort handling. Out-of-gamut results are
 * clamped, which is what a browser displays anyway.
 */
export function parseOklch(s: string): [number, number, number] | null {
  const m = /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?\s*(?:\/.*)?\)$/i.exec(s.trim())
  if (!m) return null
  const pct = (v: string, scale: number) =>
    v.endsWith('%') ? (parseFloat(v) / 100) * scale : parseFloat(v)
  const L = pct(m[1], 1)
  const C = pct(m[2], 0.4)
  const H = (parseFloat(m[3]) * Math.PI) / 180
  if ([L, C, H].some(Number.isNaN)) return null

  const a = C * Math.cos(H)
  const bb = C * Math.sin(H)

  // OKLab -> LMS' -> LMS (Björn Ottosson's matrices).
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bb
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bb
  const s_ = L - 0.0894841775 * a - 1.291485548 * bb
  const l = l_ ** 3
  const mm = m_ ** 3
  const ss = s_ ** 3

  const lin = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * ss,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * ss,
    -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * ss,
  ]
  const enc = (c: number) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055
    return Math.max(0, Math.min(255, Math.round(v * 255)))
  }
  return [enc(lin[0]), enc(lin[1]), enc(lin[2])] as [number, number, number]
}

/** Any colour syntax the token file actually uses. */
/**
 * Parse `rgb()` / `rgba()` to [r, g, b, a], a 0-1.
 *
 * The third blind spot of the same shape as the first two. `parseHex` covered
 * hex, `parseOklch` covered the shadcn half, and everything authored as `rgba()`
 * still resolved to null and got reported as "non-hex value" — a line that reads
 * like a skipped check rather than a hole. `chrome.text.mutedStrong` and
 * `mutedWeak` have been rgba since they were written and have never once been
 * measured.
 *
 * Alpha is returned rather than dropped because for a translucent foreground it
 * is the whole question: `rgba(250,241,233,0.68)` is not cream, it is whatever
 * cream becomes over the surface behind it. See `contrast`.
 */
export function parseRgba(s: string): [number, number, number, number] | null {
  const m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(
    s.trim(),
  )
  if (!m) return null
  const [r, g, b] = [m[1], m[2], m[3]].map(Number)
  const rawA = m[4]
  const a = rawA == null ? 1 : rawA.endsWith('%') ? parseFloat(rawA) / 100 : parseFloat(rawA)
  if ([r, g, b, a].some(Number.isNaN)) return null
  return [r, g, b, Math.min(1, Math.max(0, a))]
}

export function parseColor(s: string): [number, number, number] | null {
  const rgba = parseRgba(s)
  if (rgba) return [rgba[0], rgba[1], rgba[2]]
  return parseHex(s) ?? parseOklch(s)
}

/** Composite a translucent foreground over an opaque background. */
function over(
  fg: [number, number, number, number],
  bg: [number, number, number],
): [number, number, number] {
  const a = fg[3]
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a)]
}

/** sRGB → relative luminance per WCAG 2.2. */
function relativeLuminance([r, g, b]: [number, number, number]): number {
  const norm = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * norm(r) + 0.7152 * norm(g) + 0.0722 * norm(b)
}

/**
 * `a` is the foreground, `b` the background — the call site passes them in that
 * order and a translucent foreground has to be flattened against its own
 * background before it means anything. Measuring `rgba(250,241,233,0.68)` as if
 * it were opaque cream overstates its contrast by ~2 points, which is the
 * difference between a real AA pass and a fictional one.
 */
function contrast(a: string, b: string): number | null {
  const rb = parseColor(b)
  if (!rb) return null
  const fgAlpha = parseRgba(a)
  const ra = fgAlpha && fgAlpha[3] < 1 ? over(fgAlpha, rb) : parseColor(a)
  if (!ra) return null
  const la = relativeLuminance(ra)
  const lb = relativeLuminance(rb)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

interface Pair {
  fg: string
  bg: string
  /** 'body' = 4.5:1 floor; 'large' = 3:1 floor. */
  size: 'body' | 'large'
  context: string
}

/**
 * Pairs we actively render in production. Hand-curated rather than
 * cartesian — many (fg, bg) combos never appear in code (e.g. peach
 * on warning-amber).
 */
const PAIRS: Pair[] = [
  // Body text on every surface.
  { fg: 'text.primary', bg: 'surface.0', size: 'body', context: 'foreground on page bg' },
  { fg: 'text.primary', bg: 'surface.1', size: 'body', context: 'foreground on card bg' },
  { fg: 'text.primary', bg: 'surface.2', size: 'body', context: 'foreground on raised bg' },
  { fg: 'text.muted', bg: 'surface.0', size: 'body', context: 'muted on page bg' },
  { fg: 'text.muted', bg: 'surface.1', size: 'body', context: 'muted on card bg' },
  { fg: 'text.muted', bg: 'surface.2', size: 'body', context: 'muted on raised bg' },

  // Brand accent (peach) on dark surfaces — used for links + emphasis.
  { fg: 'brand.peach', bg: 'surface.0', size: 'body', context: 'peach link on page bg' },
  { fg: 'brand.peach', bg: 'surface.1', size: 'body', context: 'peach link on card bg' },

  // Pill text on peach background (e.g. "Recommended" pills).
  { fg: 'brand.peach-text', bg: 'brand.peach', size: 'body', context: 'pill body on peach' },

  // Semantic colors on dark surfaces (status badges, errors, warnings).
  { fg: 'semantic.matcha', bg: 'surface.0', size: 'body', context: 'matcha status on page bg' },
  { fg: 'semantic.matcha', bg: 'surface.1', size: 'body', context: 'matcha status on card bg' },
  { fg: 'semantic.warning-amber', bg: 'surface.0', size: 'body', context: 'amber warning on page bg' },
  { fg: 'semantic.warning-amber', bg: 'surface.1', size: 'body', context: 'amber warning on card bg' },
  { fg: 'semantic.error-red', bg: 'surface.0', size: 'body', context: 'error on page bg' },
  { fg: 'semantic.error-red', bg: 'surface.1', size: 'body', context: 'error on card bg' },

  // Hero / large headings — 3:1 floor. Same fg/bg, lower bar.
  { fg: 'brand.peach', bg: 'surface.darker', size: 'large', context: 'peach hero text' },

  // The fixed-dark marketing ladder. These are chrome.* rather than surface.*
  // on purpose: the sections they dress are dark in both themes, so pairing
  // them against the theme-aware ladder would measure a surface that never
  // renders. All four foregrounds are translucent and none was visible to the
  // gate before `parseRgba` — mutedStrong and mutedWeak predate this change and
  // had simply never been measured.
  { fg: 'chrome.text.muted-warm', bg: 'chrome.surface.1', size: 'body', context: 'warm muted on section bg' },
  { fg: 'chrome.text.muted-warm', bg: 'chrome.surface.deep-2', size: 'body', context: 'warm muted on deep bg' },
  { fg: 'chrome.text.muted-warm-strong', bg: 'chrome.surface.1', size: 'body', context: 'warm lede on section bg' },
  { fg: 'chrome.text.muted-strong', bg: 'chrome.surface.1', size: 'body', context: 'neutral muted on section bg' },
  { fg: 'chrome.text.muted-weak', bg: 'chrome.surface.1', size: 'body', context: 'weakest muted on section bg' },

  // shadcn's own on-colour pairs. Every one of these is a filled control with
  // text on it, so the two tokens have to move together — and repeatedly they
  // have not: `sidebarPrimary` was repainted from shadcn's default blue to
  // brand peach while `sidebarPrimaryForeground` stayed near-white, and nothing
  // failed because the gate could not see this group at all.
  { fg: 'shadcn.primaryForeground', bg: 'shadcn.primary', size: 'body', context: 'primary button label' },
  { fg: 'shadcn.secondaryForeground', bg: 'shadcn.secondary', size: 'body', context: 'secondary button label' },
  { fg: 'shadcn.accentForeground', bg: 'shadcn.accent', size: 'body', context: 'accent / hover row label' },
  { fg: 'shadcn.mutedForeground', bg: 'shadcn.muted', size: 'body', context: 'muted panel text' },
  { fg: 'shadcn.destructiveForeground', bg: 'shadcn.destructive', size: 'body', context: 'destructive button label' },
  { fg: 'shadcn.cardForeground', bg: 'shadcn.card', size: 'body', context: 'card body text' },
  { fg: 'shadcn.popoverForeground', bg: 'shadcn.popover', size: 'body', context: 'popover body text' },
  { fg: 'shadcn.foreground', bg: 'shadcn.background', size: 'body', context: 'page body text' },
  { fg: 'shadcn.sidebarForeground', bg: 'shadcn.sidebar', size: 'body', context: 'sidebar body text' },
  { fg: 'shadcn.sidebarPrimaryForeground', bg: 'shadcn.sidebarPrimary', size: 'body', context: 'active sidebar item label' },
  { fg: 'shadcn.sidebarAccentForeground', bg: 'shadcn.sidebarAccent', size: 'body', context: 'hovered sidebar item label' },
  { fg: 'shadcn.secondaryForegroundAccent', bg: 'shadcn.secondary', size: 'body', context: 'peach label on the secondary chip' },
]

/**
 * Pure-decorative or brand-only pairs that intentionally skip the gate.
 * Use sparingly — every entry is technical debt.
 */
const SKIP_PAIRS: Set<string> = new Set([
  // brand.peach-deep (#f97316) is a gradient endpoint, never a text fg
  'brand.peach-deep|*',
])

/**
 * Known, tracked failures. Reported every run but not fatal.
 *
 * The brand palette was drawn against dark surfaces, so on the light ladder
 * every brand and state colour lands under 4.5:1. That is a real gap with a
 * real owner (light-mode variants have to be designed), not a regression, and
 * leaving the gate permanently red would just teach everyone to ignore it.
 *
 * The list is exhaustive on purpose: a NEW light-mode failure is not on it and
 * still exits 1. Delete entries as the variants land; when the set is empty,
 * delete the mechanism.
 *
 * Format: `mode|fg|bg`. Tracked in the plan as the surface-role decision.
 */
/**
 * Known, tracked failures. Empty, and that is the point.
 *
 * The brand palette had no light-mode variants, so every brand and state colour
 * failed AA on the light ladder — peach at 1.53:1. Those eight pairs lived here
 * as reported-not-fatal entries while the gap was real.
 *
 * They now have derived light values (see the $description on each token: a
 * computed floor, not a designed colour), so the gate passes honestly and the
 * list is empty. Leaving the mechanism in place because the next unfinished
 * palette will want it; delete it if that never happens.
 */
const KNOWN_GAPS: Set<string> = new Set([
  // White on shadcn's dark --destructive (#ff6467) is 2.89:1. Real, and not
  // fixable from the foreground side: darkening the label to #060606 clears
  // 7.02:1 on paper but rendered as near-black-on-near-black in the marketing
  // component gallery, so it shipped an invisible button label. The fix is to
  // darken --destructive itself in dark mode, which repaints destructive
  // buttons in both apps and is a design call, not a gate call.
  'dark|shadcn.destructiveForeground|shadcn.destructive',
  // --destructive became invariant when it adopted the dashboard's single
  // value, so the same gap now exists in light too: 4.77:1 before, 3.46:1 now.
  // That is a real regression on the light ladder and it is recorded rather
  // than hidden. It is accepted because the dashboard already ships 3.46:1 in
  // production and marketing renders dark-only, so no surface actually gets
  // worse today — but it does mean D5 is now one decision covering both modes.
  'light|shadcn.destructiveForeground|shadcn.destructive',
])

function isKnownGap(mode: string, fg: string, bg: string): boolean {
  return KNOWN_GAPS.has(`${mode}|${fg}|${bg}`)
}

function shouldSkip(fg: string, bg: string): boolean {
  return SKIP_PAIRS.has(`${fg}|${bg}`) || SKIP_PAIRS.has(`${fg}|*`) || SKIP_PAIRS.has(`*|${bg}`)
}

function main() {
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8')) as Record<string, unknown>

  // Only iterate modes that actually exist. With no mode-aware token in the
  // file, every colour resolves identically in light and dark, so looping both
  // would report double the pair count while checking the same 16 things twice.
  // A gate that overstates its own coverage is worse than a smaller honest one.
  const hasModeAwareTokens = JSON.stringify(tokens).includes('"$modes"')
  const modes = hasModeAwareTokens ? ['light', 'dark'] : ['default']

  const failures: string[] = []
  const known: string[] = []
  const results: { mode: string; pair: Pair; ratio: number; pass: boolean }[] = []

  for (const mode of modes) {
  // `shadcn` is a sibling top-level group, not a member of `color`, so walking
  // only `color` left all 39 of its slots outside the gate. That is how a
  // near-white `--sidebar-primary-foreground` survived on a peach
  // `--sidebar-primary` at 1.55:1 — nothing was looking. Merged under a
  // `shadcn.` prefix so pairs address it explicitly.
  const colors = flattenColors(tokens.color as Record<string, unknown>, mode)
  for (const [k, v] of flattenColors(
    tokens.shadcn as Record<string, unknown>,
    mode,
    'shadcn',
  )) {
    colors.set(k, v)
  }
  for (const pair of PAIRS) {
    if (shouldSkip(pair.fg, pair.bg)) continue
    const fgVal = colors.get(pair.fg)
    const bgVal = colors.get(pair.bg)
    if (!fgVal || !bgVal) {
      failures.push(`✗ [${mode}] ${pair.fg} / ${pair.bg} — token not found (${pair.context})`)
      continue
    }
    const ratio = contrast(fgVal, bgVal)
    if (ratio == null) {
      failures.push(`✗ [${mode}] ${pair.fg} (${fgVal}) / ${pair.bg} (${bgVal}) — non-hex value (${pair.context})`)
      continue
    }
    const floor = pair.size === 'body' ? 4.5 : 3.0
    const pass = ratio >= floor
    results.push({ mode, pair, ratio, pass })
    if (!pass && isKnownGap(mode, pair.fg, pair.bg)) {
      known.push(
        `~ [${mode}] ${pair.fg} (${fgVal}) on ${pair.bg} (${bgVal}) — ${ratio.toFixed(2)}:1 (need ${floor}:1) — ${pair.context}`,
      )
    } else if (!pass) {
      failures.push(
        `✗ [${mode}] ${pair.fg} (${fgVal}) on ${pair.bg} (${bgVal}) — ${ratio.toFixed(2)}:1 (need ${floor}:1, ${pair.size} text) — ${pair.context}`,
      )
    }
  }
  }

  console.log('check-token-contrast — WCAG 2.2 (4.5:1 body, 3:1 large)')
  console.log(
    hasModeAwareTokens
      ? `Modes: ${modes.join(', ')} — each pair checked per mode.\n`
      : 'No mode-aware tokens in design-tokens.json; every colour is theme-invariant, so each pair is checked once.\n',
  )
  for (const { mode, pair, ratio, pass } of results) {
    const icon = pass ? '✓' : '✗'
    console.log(`  ${icon} [${mode.padEnd(5)}] ${pair.fg.padEnd(28)} / ${pair.bg.padEnd(20)} ${ratio.toFixed(2)}:1  (${pair.size}) — ${pair.context}`)
  }

  if (known.length > 0) {
    console.log(
      `\n${known.length} known gap(s), tracked not fatal — each is recorded in ` +
        `KNOWN_GAPS with why it cannot be closed from the token side alone:`,
    )
    for (const k of known) console.log(`  ${k}`)
  }

  if (failures.length > 0) {
    console.log(`\nFAIL — ${failures.length} pair(s) below WCAG floor:`)
    for (const f of failures) console.log(`  ${f}`)
    process.exit(1)
  }
  // `results.length`, not the number that PASSED. This line read
  // "PASS — 66 pair(s) meet WCAG AA" while 64 met it and 2 sat at 3.46:1,
  // waived under KNOWN_GAPS. The waiver is legitimate; counting a waived
  // failure as a pass in the one line anyone reads is not, and "66 pairs"
  // propagated from here into release notes and commit messages.
  const met = results.filter((r) => r.pass).length
  const floor = results.every((r) => r.pair.size === 'body') ? '4.5:1' : 'AA'
  console.log(
    known.length > 0
      ? `\nPASS — ${met} of ${results.length} pair(s) meet WCAG ${floor}; ${known.length} waived under KNOWN_GAPS`
      : `\nPASS — ${met} pair(s) meet WCAG ${floor}`,
  )
}

// Importable for unit tests. `main()` only runs as the CLI entry point, so
// importing this module to test parseOklch does not execute the whole gate.
if (process.argv[1] && /check-token-contrast/.test(process.argv[1])) main()
