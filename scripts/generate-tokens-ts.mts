#!/usr/bin/env tsx
/**
 * Emit design-tokens.json as a typed TypeScript constant.
 *
 * Mode-aware tokens surface as `{ light, dark }` rather than collapsing to one
 * mode. A caller that wants a single colour has to say which; a caller that
 * wants both gets both. Collapsing would bake one theme into the export, and
 * the two consuming apps have opposite defaults.
 *
 * Handling `$modes` explicitly matters more than it looks. Treating `$value` as
 * the only leaf shape makes a mode-aware token indistinguishable from an
 * ordinary nested group, so the walker descends into it and emits nothing — the
 * token disappears from the artifact while every drift check stays green,
 * because the generator is perfectly consistent about dropping it.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const OUT = resolve(root, 'src/tokens/index.ts')

type Modes = Record<string, string>
interface Leaf {
  $value?: string | number
  $modes?: Modes
}

const isLeaf = (x: unknown): x is Leaf =>
  typeof x === 'object' && x !== null && ('$value' in x || '$modes' in x)

/** "peach-text" -> "peachText" */
const camel = (k: string) => k.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase())

/** Numeric or hyphenated keys need quoting in an object literal. */
const safeKey = (k: string) => (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k))

type Tree = { [k: string]: Tree | string | number | Modes }

function build(node: unknown): Tree {
  const out: Tree = {}
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    if (key.startsWith('$') || key === 'version' || key === 'lastUpdated') continue
    if (isLeaf(value)) {
      out[camel(key)] = value.$modes ?? (value.$value as string | number)
    } else if (typeof value === 'object' && value !== null) {
      out[camel(key)] = build(value)
    }
  }
  return out
}

function emit(tree: Tree, indent = 0): string {
  const pad = '  '.repeat(indent)
  const inner = '  '.repeat(indent + 1)
  const lines = ['{']
  for (const [k, v] of Object.entries(tree)) {
    lines.push(
      typeof v === 'object' && v !== null
        ? `${inner}${safeKey(k)}: ${emit(v as Tree, indent + 1)},`
        : `${inner}${safeKey(k)}: ${JSON.stringify(v)},`,
    )
  }
  lines.push(`${pad}}`)
  return lines.join('\n')
}

const json = JSON.parse(
  await readFile(resolve(root, 'design-tokens.json'), 'utf8'),
) as Record<string, unknown>

const header =
  `// Generated from design-tokens.json by scripts/generate-tokens-ts.mts.\n` +
  `// Do not edit by hand — change the JSON and run \`npm run tokens\`.\n` +
  `// Source version: ${json.version}\n` +
  `// Last updated: ${json.lastUpdated}\n`

await mkdir(dirname(OUT), { recursive: true })
await writeFile(
  OUT,
  `${header}\nexport const tokens = ${emit(build(json))} as const\n\n` +
    `export type Tokens = typeof tokens\n`,
  'utf8',
)
console.log(`wrote ${OUT}`)
