#!/usr/bin/env node
/**
 * Emit the two token documents that claimed to be generated and were not:
 * the `@tokens:generated` block in docs/brand.md, and machine/tokens.yaml.
 *
 * Both arrived from skene-dashboard carrying a header naming a generator
 * (`scripts/generate-tokens.ts`, `scripts/sync-design-system-machine.mts`)
 * that does not exist in this repository. Nothing had rewritten either since
 * the move, and the drift was not small: between them they listed 137 of 221
 * tokens, collapsed every mode-aware token to its dark value, and omitted the
 * whole of `color.chrome.*` — the invariant-dark role the README singles out
 * as the one thing to get right. A document that says it is generated is a
 * document nobody re-reads, which is why this failure is quiet and why the
 * `--check` mode below matters more than the generation does.
 *
 * The two emissions differ on purpose:
 *
 * - brand.md is for a human choosing a colour, so it is one table per group
 *   with the description in it, and mode-aware values shown as both modes
 *   side by side. A single collapsed value is what made the old table wrong
 *   in a way that reads as right.
 * - machine/tokens.yaml is a contract, so it keeps the authored shape —
 *   `$value` or `$modes`, plus `$description` where the JSON has one. The
 *   descriptions carry the derivation rationale (every light brand value is
 *   the least-darkened hue-preserving colour clearing 4.5:1), which is the
 *   fact an agent needs before it substitutes one.
 *
 * `--check` re-emits and diffs without writing, so CI fails on a JSON edit
 * that was not followed by `npm run tokens`.
 *
 *   node scripts/generate-token-docs.mjs [--check]
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const JSON_PATH = resolve(root, 'design-tokens.json')
const BRAND = resolve(root, 'docs/brand.md')
const YAML = resolve(root, 'machine/tokens.yaml')
const START = '<!-- @tokens:generated:start -->'
const END = '<!-- @tokens:generated:end -->'

const check = process.argv.includes('--check')
const json = JSON.parse(readFileSync(JSON_PATH, 'utf8'))

const isLeaf = (x) => typeof x === 'object' && x !== null && ('$value' in x || '$modes' in x)
/** `$`-prefixed groups are prose and anti-patterns, not values. See the README. */
const skip = (k) => k.startsWith('$') || k === 'version' || k === 'lastUpdated'

/** Depth-first walk yielding `[dottedPath, leaf]` in authored order. */
function* walk(node, path = []) {
  for (const [key, value] of Object.entries(node)) {
    if (path.length === 0 && skip(key)) continue
    if (isLeaf(value)) yield [[...path, key].join('.'), value]
    else if (typeof value === 'object' && value !== null) yield* walk(value, [...path, key])
  }
}

const groups = Object.keys(json).filter((k) => !skip(k))

// ---------------------------------------------------------------- brand.md

const cell = (s) => String(s).replace(/\|/g, '\\|')

/**
 * Both modes, not one. A mode-aware token rendered as a single hex is the
 * defect this generator replaced: `color.brand.peach` read `#fec089` in a
 * table consulted by people picking colours for a light surface, where it
 * is `#89684a`.
 */
function valueCell(leaf) {
  if (leaf.$modes) {
    return Object.entries(leaf.$modes)
      .map(([mode, v]) => `${mode} \`${v}\``)
      .join(' · ')
  }
  return `\`${leaf.$value}\``
}

function brandBlock() {
  const modeAware = [...walk(json)].filter(([, l]) => l.$modes).length
  const total = [...walk(json)].length
  const out = [
    START,
    '',
    '_Generated from `design-tokens.json` by `scripts/generate-token-docs.mjs`. Do not edit',
    'between the markers — change the JSON and run `npm run tokens`. `npm run tokens:check`',
    'fails the build if this block is stale._',
    '',
    `_Source version ${json.version}, ${total} tokens, of which ${modeAware} are mode-aware and`,
    'shown here in every mode they declare._',
    '',
  ]
  for (const group of groups) {
    const rows = [...walk({ [group]: json[group] })]
    if (!rows.length) continue
    out.push(`### ${group}`, '')
    out.push('| Token | Value | Description |', '| --- | --- | --- |')
    for (const [path, leaf] of rows) {
      out.push(`| \`${path}\` | ${valueCell(leaf)} | ${cell(leaf.$description ?? '')} |`)
    }
    out.push('')
  }
  out.push(END)
  return out.join('\n')
}

// -------------------------------------------------------- machine/tokens.yaml

/** Numeric and reserved-looking keys have to survive a YAML round trip. */
const yKey = (k) => (/^[A-Za-z_][A-Za-z0-9_-]*$/.test(k) ? k : JSON.stringify(k))
const yStr = (v) => JSON.stringify(String(v))

function emitYaml(node, depth = 0) {
  const pad = '  '.repeat(depth)
  const lines = []
  for (const [key, value] of Object.entries(node)) {
    if (depth === 0 && skip(key)) continue
    if (isLeaf(value)) {
      lines.push(`${pad}${yKey(key)}:`)
      if (value.$modes) {
        lines.push(`${pad}  $modes:`)
        for (const [mode, v] of Object.entries(value.$modes)) {
          lines.push(`${pad}    ${mode}: ${yStr(v)}`)
        }
      } else {
        lines.push(`${pad}  $value: ${yStr(value.$value)}`)
      }
      if (value.$description) lines.push(`${pad}  $description: ${yStr(value.$description)}`)
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${pad}${yKey(key)}:`)
      lines.push(...emitYaml(value, depth + 1))
    }
  }
  return lines
}

function yamlFile() {
  const total = [...walk(json)].length
  return [
    '# Generated from design-tokens.json by scripts/generate-token-docs.mjs.',
    '# Do not edit by hand — change the JSON and run `npm run tokens`.',
    '#',
    '# Mode-aware tokens keep both modes. The version of this file that shipped',
    '# through 0.9.1 flattened them to dark and dropped color.chrome.* entirely,',
    '# so an agent reading it for the invariant-dark role found nothing and had',
    '# no way to tell the role was missing rather than absent from the system.',
    '#',
    `# Source version ${json.version}, ${total} tokens.`,
    `version: ${yStr(json.version)}`,
    `lastUpdated: ${yStr(json.lastUpdated)}`,
    ...emitYaml(json),
    '',
  ].join('\n')
}

// ------------------------------------------------------------------- write

const brand = readFileSync(BRAND, 'utf8')
const s = brand.indexOf(START)
const e = brand.indexOf(END)
if (s === -1 || e === -1) {
  console.error(`docs/brand.md is missing ${START} / ${END}`)
  process.exit(1)
}
const nextBrand = brand.slice(0, s) + brandBlock() + brand.slice(e + END.length)
const nextYaml = yamlFile()

const stale = [
  ['docs/brand.md', brand !== nextBrand],
  ['machine/tokens.yaml', readFileSync(YAML, 'utf8') !== nextYaml],
].filter(([, changed]) => changed)

if (check) {
  if (stale.length) {
    console.error(
      `token docs are stale: ${stale.map(([f]) => f).join(', ')}\nrun \`npm run tokens\``,
    )
    process.exit(1)
  }
  console.log(`token docs unchanged — ${[...walk(json)].length} tokens`)
} else {
  writeFileSync(BRAND, nextBrand)
  writeFileSync(YAML, nextYaml)
  console.log(
    `token docs: ${[...walk(json)].length} tokens -> docs/brand.md, machine/tokens.yaml`,
  )
}
