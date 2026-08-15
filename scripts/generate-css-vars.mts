#!/usr/bin/env tsx
/**
 * Emit CSS custom properties from design-tokens.json into a target stylesheet.
 *
 * Replaces the previous version, which had never run successfully in this repo:
 * it searched for a literal `.dark {` selector and threw
 * `Could not find .dark { in app/globals.css` because this app uses `.is-dark`.
 * The generator had been written against skene-marketing-website's layering
 * model, which is why that repo carries a hand-pasted copy of its output.
 *
 * ## Three blocks, not two
 *
 *   :root          mode-invariant tokens (`$value`)
 *   :root, .light  the light value of every mode-aware token (`$modes.light`)
 *   .dark          the dark value of every mode-aware token (`$modes.dark`)
 *
 * `:root, .light` rather than `:root:not(.dark)` is load-bearing. The dashboard
 * needs a light subtree nested *inside* a dark one (a light panel inside the
 * dark sidebar). `:root` only ever matches <html>, so it cannot express that.
 * Two explicit classes nest in either direction, arbitrarily deep.
 *
 * `--base-mode` decides which mode also seeds the bare `:root` block, so a
 * document with no theme class still renders sensibly. The dashboard is
 * light-default and the marketing site is dark-default (<html class="dark">),
 * which is precisely why this is a flag and not a constant in the token file.
 *
 * ## Naming
 *
 * Tokens are authored camelCase (good TS ergonomics via lib/design-tokens.ts)
 * and always emitted kebab-case. The old code path emitted camelCase for some
 * groups and kebab for others, because design-tokens.json was migrated
 * kebab -> camel at some point and nothing downstream was regenerated. That is
 * the root of the ~47 name mismatches between this repo and the marketing site.
 *
 * Usage:
 *   tsx scripts/generate-css-vars.mts [--check] [--target <css>] [--base-mode light|dark]
 */

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const repoRoot = resolve(import.meta.dirname, '..')

interface Args {
  check: boolean
  target: string
  baseMode: string
  json: string
}

function parseArgs(argv: string[]): Args {
  const get = (flag: string, fallback: string): string => {
    const i = argv.indexOf(flag)
    return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback
  }
  return {
    check: argv.includes('--check'),
    target: resolve(repoRoot, get('--target', 'app/globals.css')),
    baseMode: get('--base-mode', 'light'),
    json: resolve(repoRoot, get('--json', 'design-tokens.json')),
  }
}

const MARKERS = {
  base: ['/* @generated:tokens-start */', '/* @generated:tokens-end */'],
  light: ['/* @generated:tokens-light-start */', '/* @generated:tokens-light-end */'],
  dark: ['/* @generated:tokens-dark-start */', '/* @generated:tokens-dark-end */'],
  theme: ['/* @generated:theme-start */', '/* @generated:theme-end */'],
} as const

/**
 * The single naming rule. No per-token overrides — that is what makes the
 * output auditable.
 *   midGray   -> mid-gray
 *   deep2     -> deep-2
 *   lineHeight-> line-height
 *   "0.5"     -> 0-5
 *   h2        -> h2      (stays)
 * Purely numeric segments and things like "2xl" pass through.
 *
 * The digit split requires **two or more** preceding letters. A single letter
 * followed by a digit is a unit, not a word plus an index: `h1`/`h2` are
 * heading sizes and must not become `h-1`/`h-2`, whereas `deep2` and `chart1`
 * genuinely are word-plus-index.
 */
export function kebab(segment: string): string {
  if (/^\d/.test(segment)) return segment.replace(/\./g, '-')
  return segment
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z]{2,})(\d)/g, '$1-$2')
    .replace(/\./g, '-')
    .toLowerCase()
}

interface Entry {
  name: string
  value: string
  group: string
}

interface Collected {
  base: Entry[]
  modes: Map<string, Entry[]>
  /** token path -> declared modes, for validation reporting */
  problems: string[]
}

const MODES = ['light', 'dark'] as const

function collect(tokens: Record<string, unknown>): Collected {
  const base: Entry[] = []
  const modes = new Map<string, Entry[]>(MODES.map((m) => [m, []]))
  const problems: string[] = []

  function walk(node: unknown, path: string[], group: string): void {
    if (typeof node !== 'object' || node === null) return
    const obj = node as Record<string, unknown>

    const hasValue = typeof obj.$value === 'string'
    const hasModes = typeof obj.$modes === 'object' && obj.$modes !== null

    if (hasValue || hasModes) {
      if (path.length === 0) throw new Error('token at the group root has no name')
      const name = '--' + path.map(kebab).join('-')
      const dotted = path.join('.')

      if (hasValue && hasModes) {
        problems.push(`${dotted}: declares both $value and $modes`)
        return
      }

      if (hasValue) {
        base.push({ name, value: obj.$value as string, group })
        return
      }

      const declared = obj.$modes as Record<string, unknown>
      const missing = MODES.filter((m) => typeof declared[m] !== 'string')
      if (missing.length) {
        // Silent partial coverage is how 15 of 150 tokens ended up with a light
        // value and the other 135 quietly did not.
        problems.push(`${dotted}: $modes missing ${missing.join(', ')}`)
        return
      }
      for (const m of MODES) {
        modes.get(m)!.push({ name, value: declared[m] as string, group })
      }
      return
    }

    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('$') || key === 'version' || key === 'lastUpdated') continue
      walk(value, [...path, key], group)
    }
  }

  for (const [topKey, subtree] of Object.entries(tokens)) {
    if (topKey.startsWith('$') || topKey === 'version' || topKey === 'lastUpdated') continue

    // A group may opt out of the group-name prefix via `$cssPrefix`. Exactly one
    // group needs it: the shadcn semantic slots are addressed by bare name
    // (`--card`, `--ring`) because that is the contract every shadcn component
    // and `@theme inline` mapping already depends on. Renaming them to
    // `--shadcn-card` would mean rewriting every primitive in both apps for no
    // gain. Everything else keeps the prefix, which is what makes the emitted
    // namespace predictable.
    const group = subtree as Record<string, unknown>
    const prefix = typeof group?.$cssPrefix === 'string' ? group.$cssPrefix : topKey
    walk(subtree, prefix === '' ? [] : [prefix], topKey)
  }

  return { base, modes, problems }
}

function render(entries: Entry[], indent: string): string {
  if (entries.length === 0) return `${indent}/* none */`
  const grouped = new Map<string, Entry[]>()
  for (const e of entries) {
    const list = grouped.get(e.group)
    if (list) list.push(e)
    else grouped.set(e.group, [e])
  }
  const rows: string[] = []
  for (const [group, list] of grouped) {
    rows.push(`${indent}/* ${group} (${list.length}) */`)
    for (const { name, value } of list) rows.push(`${indent}${name}: ${value};`)
    rows.push('')
  }
  return rows.join('\n').trimEnd()
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Replace the content between a marker pair. Throws if the pair is absent. */
function replaceBlock(
  css: string,
  [start, end]: readonly [string, string],
  body: string,
): string {
  if (!css.includes(start) || !css.includes(end)) {
    throw new Error(
      `Missing marker pair in target stylesheet:\n  ${start}\n  ${end}\n` +
        `Add both markers to the stylesheet (inside the selector block they ` +
        `belong to) and re-run. The generator never inserts selectors itself — ` +
        `guessing where a rule belongs is how the previous version broke.`,
    )
  }
  const re = new RegExp(`${escapeRegExp(start)}[\\s\\S]*?${escapeRegExp(end)}`, 'gm')
  return css.replace(re, `${start}\n${body}\n  ${end}`)
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))

  if (!MODES.includes(args.baseMode as (typeof MODES)[number])) {
    console.error(`--base-mode must be one of: ${MODES.join(', ')}`)
    process.exit(1)
  }

  const tokens = JSON.parse(await readFile(args.json, 'utf8')) as Record<string, unknown>
  const { base, modes, problems } = collect(tokens)

  if (problems.length) {
    console.error(`design-tokens.json has ${problems.length} problem(s):`)
    for (const p of problems) console.error(`  - ${p}`)
    process.exit(1)
  }

  const baseModeEntries = modes.get(args.baseMode)!
  const cssRaw = await readFile(args.target, 'utf8')

  // The bare :root carries mode-invariant tokens plus the base mode's values,
  // so a document with no theme class still renders.
  let next = replaceBlock(cssRaw, MARKERS.base, render([...base, ...baseModeEntries], '  '))
  next = replaceBlock(next, MARKERS.light, render(modes.get('light')!, '  '))
  next = replaceBlock(next, MARKERS.dark, render(modes.get('dark')!, '  '))

  // Registering each colour with Tailwind is what turns a custom property into
  // a utility (`--color-brand-peach` -> `bg-brand-peach`, `text-brand-peach`).
  // Generating these alongside the values means a new colour token cannot ship
  // without its utility, and a removed one cannot leave a dangling class.
  //
  // The mapping is deliberately self-referential rather than a literal: inside
  // `@theme inline` that makes the utility emit `var(--color-x)`, so a `.dark`
  // subtree still re-resolves it at runtime. Inlining the literal would freeze
  // every utility to the base mode.
  //
  // Colours only. `--font-size-*` would need Tailwind's `--text-*` namespace to
  // generate anything, and `--radius-*` / `--spacing-*` would collide with the
  // shadcn calc ladder and the v4 spacing base that are declared by hand.
  // Two shapes feed the theme block.
  //
  //   color.*   already named --color-*, so it registers as itself
  //   shadcn.*  named bare (--card, --ring), so it needs the --color- prefix
  //             added to become a utility: --color-card: var(--card) gives
  //             bg-card / text-card / border-card
  //
  // Non-colour shadcn slots are excluded. --primary-rgb is a bare triple for
  // rgba() interpolation and --switch-thumb is a component part; registering
  // either as a colour would produce a utility that emits invalid CSS.
  const NON_COLOUR = new Set(['--primary-rgb'])
  const themeEntries = [...base, ...baseModeEntries]
    .filter((e) => (e.group === 'color' || e.group === 'shadcn') && !NON_COLOUR.has(e.name))
    .map((e) => ({
      ...e,
      name: e.group === 'shadcn' ? `--color-${e.name.slice(2)}` : e.name,
      value: `var(${e.name})`,
    }))
    .sort((a, b) => (a.name < b.name ? -1 : 1))
  next = replaceBlock(next, MARKERS.theme, render(themeEntries, '  '))

  const summary =
    `${base.length} invariant + ${modes.get('light')!.length} light + ` +
    `${modes.get('dark')!.length} dark (base mode: ${args.baseMode})`

  if (args.check) {
    if (next !== cssRaw) {
      console.error(
        `drift: ${args.target} differs from generator output. Run \`npm run tokens\`.`,
      )
      process.exit(1)
    }
    console.log(`tokens:css in sync — ${summary}`)
    return
  }

  if (next !== cssRaw) {
    await writeFile(args.target, next, 'utf8')
    console.log(`wrote ${summary} to ${args.target}`)
  } else {
    console.log(`tokens:css unchanged — ${summary}`)
  }
}

// Only run when invoked as a script. Without this guard, importing `kebab` from
// a unit test executes main() and exits the test runner.
const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href

if (invokedDirectly) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err)
    process.exit(1)
  })
}
