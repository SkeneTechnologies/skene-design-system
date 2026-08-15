/**
 * The context contract.
 *
 * `machine/context.yaml` is the first thing a consuming agent should read: what
 * each module is for, and — the part nothing else in this package answers —
 * what else it can be used for. These four gates exist because every failure
 * mode of a file like that is silent. A module added without an entry is a
 * component nobody will find. A stale generated file is advice about a prop
 * that no longer exists. A reuse claim with no citation is a guess, and a guess
 * sends an agent to the wrong component with confidence.
 *
 * The ALLOWLIST is the authoring backlog, in the open. It shrinks to empty as
 * entries land; it must never grow.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'
// @ts-expect-error — the generator is plain JS on purpose; nothing in this repo
// parses YAML, and keeping it dependency-free is why the authored half is JSON.
import { derive, render } from '../scripts/build-context.mjs'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')
const data = JSON.parse(readFileSync(resolve(ROOT, 'scripts/context-data.json'), 'utf8'))
const entries = derive() as Array<{
  key: string
  layer: string
  exports: string[]
  overrides: { surfaces: string[]; customProperties: string[] }
  props: Record<string, Record<string, { type: string; default?: string }>>
  types: Record<string, Record<string, { type: string }>>
}>
const authored: Array<{
  module: string
  useFor: string
  alsoFor?: Array<{ claim: string; via: string }>
  watchFor?: Array<{ note: string; via: string }>
  notFor?: Array<{ instead: string; why: string }>
  sameAs?: string[]
}> = data.modules

/**
 * Modules with no authored context yet. Every name here is a module an agent
 * cannot be advised about. Delete names; never add them.
 *
 * Empty since 2026-08-13. It landed computed — `entries.filter(not authored)` —
 * which is a gate that can never fail, because the exception list was derived
 * from the very thing it was meant to police. Written out by hand now, which is
 * the only form of allowlist worth having.
 */
const ALLOWLIST = new Set<string>([])

describe('coverage', () => {
  it('every module has an authored entry, or is on the shrinking allowlist', () => {
    const missing = entries
      .filter((e) => !authored.some((a) => a.module === e.key))
      .map((e) => e.key)
      .filter((k) => !ALLOWLIST.has(k))
    expect(missing, 'modules with no context and no allowlist entry').toEqual([])
  })

  it('the allowlist only names modules that exist', () => {
    const keys = new Set(entries.map((e) => e.key))
    expect([...ALLOWLIST].filter((k) => !keys.has(k))).toEqual([])
  })
})

describe('no orphans', () => {
  it('every authored entry maps to a module on disk', () => {
    const keys = new Set(entries.map((e) => e.key))
    // Catches the case this package will actually hit: a consolidation deletes
    // a module and leaves its advice behind, still recommending it.
    expect(authored.map((a) => a.module).filter((m) => !keys.has(m))).toEqual([])
  })

  it('finds every source module exactly once', () => {
    const onDisk = ['ui', 'patterns', 'sections'].flatMap((layer) =>
      readdirSync(resolve(ROOT, 'src', layer))
        .filter((f) => /\.tsx?$/.test(f))
        .map((f) => `${layer}/${f.replace(/\.tsx?$/, '')}`),
    )
    expect(entries.map((e) => e.key).sort()).toEqual(onDisk.sort())
  })
})

describe('referential integrity', () => {
  const exportsByModule = new Map(entries.map((e) => [e.key, e.exports]))
  const allExports = new Set(entries.flatMap((e) => e.exports))

  it('every notFor.instead names a real export', () => {
    const dangling = authored
      .flatMap((a) => (a.notFor ?? []).map((n) => ({ module: a.module, instead: n.instead })))
      .filter((n) => !allExports.has(n.instead))
    expect(dangling, 'notFor points at something this package does not export').toEqual([])
  })

  it('every sameAs target resolves to a module, and to its export when one is named', () => {
    const bad: string[] = []
    for (const a of authored) {
      for (const target of a.sameAs ?? []) {
        const [mod, symbol] = target.split('#')
        const found = exportsByModule.get(mod)
        if (!found) bad.push(`${a.module} -> ${target} (no such module)`)
        else if (symbol && !found.includes(symbol)) bad.push(`${a.module} -> ${target} (no such export)`)
      }
    }
    expect(bad).toEqual([])
  })

  it('every alsoFor and watchFor cites a prop, default or export that exists', () => {
    // The anti-invention gate. `via` must name something in the derived block:
    // a prop, a default, an export. A claim that cannot cite one is a claim
    // somebody reasoned their way to rather than read.
    const bad: string[] = []
    for (const a of authored) {
      const entry = entries.find((e) => e.key === a.module)
      if (!entry) continue
      const vocabulary = new Set<string>(entry.exports)
      for (const [owner, props] of Object.entries(entry.props)) {
        for (const [prop, meta] of Object.entries(props)) {
          vocabulary.add(prop)
          vocabulary.add(`${owner}.${prop}`)
          if (meta.default !== undefined) vocabulary.add(meta.default.replace(/^'|'$/g, ''))
        }
      }
      // Not every claim is about a prop. "the accent is an inline style, so a
      // text-* utility will not win" and "there is no use client here, so no
      // disclosure behaviour" are both checkable — against the override
      // surfaces, which are derived from the same source. What is NOT allowed
      // is citing a mechanism the module does not have.
      // Row and item shapes count too: half the reuse in this package is
      // "the row's `note` is a ReactNode, so a chip goes there as easily as a
      // sentence", and that claim is about a type, not a prop.
      for (const [name, fields] of Object.entries(entry.types)) {
        vocabulary.add(name)
        for (const field of Object.keys(fields)) vocabulary.add(`${name}.${field}`)
      }
      for (const surface of entry.overrides.surfaces) vocabulary.add(surface)
      for (const prop of entry.overrides.customProperties) vocabulary.add(prop)
      for (const item of [...(a.alsoFor ?? []), ...(a.watchFor ?? [])]) {
        const cited = [...vocabulary].some((token) => item.via.includes(token))
        if (!cited) bad.push(`${a.module}: via "${item.via}" names nothing in the module`)
      }
    }
    expect(bad).toEqual([])
  })

  it('requires a useFor on every authored entry, and reuse claims where they matter', () => {
    for (const a of authored) {
      expect(a.useFor?.trim(), `${a.module} has no useFor`).toBeTruthy()
      if (a.module.startsWith('ui/')) continue
      expect(a.alsoFor?.length ?? 0, `${a.module} claims no second use`).toBeGreaterThan(0)
      expect(a.notFor?.length ?? 0, `${a.module} names nothing it is wrong for`).toBeGreaterThan(0)
    }
  })
})

describe('freshness', () => {
  it('the committed machine/context.yaml is what the generator emits', () => {
    // Byte-for-byte, exactly like tokens:check. A generated file that can drift
    // from its source is a file that documents last month.
    expect(readFileSync(resolve(ROOT, 'machine/context.yaml'), 'utf8')).toBe(render(entries, data))
  })
})

// The eleven illustrations had no machine context until 0.9.10 — an agent
// could find the component and then had to read prose to learn which field
// belongs behind which artifact. These gates hold the same bar the module
// entries hold: every asset the package exposes is described, every file it
// names exists, and nothing claims a consumer it does not have.
describe('assets', () => {
  const assets = (load(read('machine/context.yaml')) as { assets?: Record<string, Record<string, unknown>> }).assets ?? {}

  it('describes every asset that asset-urls exposes', () => {
    const src = read('src/asset-urls.ts')
    const keys = [...src.matchAll(/(\w+):\s*new URL\('\.\.\/assets\//g)].map((m) => m[1])
    expect(keys.length).toBeGreaterThan(8)
    expect(Object.keys(assets).sort()).toEqual(keys.sort())
  })

  it('gives every asset a useFor and a notFor', () => {
    for (const [key, a] of Object.entries(assets)) {
      expect(a.useFor, `${key} has no useFor`).toBeTruthy()
      expect(a.notFor, `${key} has no notFor`).toBeTruthy()
    }
  })

  it('names a file that exists, with its real weight', () => {
    for (const [key, a] of Object.entries(assets)) {
      const file = String(a.file)
      expect(existsSync(resolve(ROOT, file)), `${key} names ${file}, which is not there`).toBe(true)
      expect(statSync(resolve(ROOT, file)).size, `${key} bytes is stale`).toBe(a.bytes)
    }
  })

  it('claims no consumer that does not reference the file', () => {
    for (const [key, a] of Object.entries(assets)) {
      const file = String(a.file).replace('assets/', '')
      for (const mod of (a.usedBy as string[]) ?? []) {
        const body = read(`src/${mod}.tsx`)
        expect(body.includes(file), `${key} claims ${mod}, which does not reference ${file}`).toBe(true)
      }
    }
  })
})
