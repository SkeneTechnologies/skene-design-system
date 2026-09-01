/**
 * DESIGN.md and the tree under `design/` are a second surface over the same
 * contracts, for an agent that has a context budget rather than a checkout.
 * `npm run design:check` is the live gate on staleness — it re-emits and diffs.
 *
 * This is the coverage half, asserting the properties the byte-diff cannot:
 * the check gate compares the generator's output to the generator's output, so
 * it stays green if the generator itself starts dropping every module whose id
 * has a hyphen in it. And a cross-link that resolves to nothing is the exact
 * failure this repository has already shipped once — `llms.txt` pointed at
 * `inventory.json` for weeks while `files` did not carry it, so a `seen:` entry
 * was a pointer a consuming agent could not follow.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { load } from 'js-yaml'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')

const context = load(read('machine/context.yaml')) as { modules: Record<string, unknown> }
const compositions = load(read('machine/compositions.yaml')) as {
  archetypes: Record<string, unknown>
}
const pkg = JSON.parse(read('package.json')) as { files: string[]; exports: Record<string, unknown> }

const moduleIds = Object.keys(context.modules)
const archetypes = Object.keys(compositions.archetypes)

/** Every emitted markdown file, by repo-relative path. */
function emitted(): string[] {
  const out: string[] = ['DESIGN.md']
  const walk = (dir: string) => {
    for (const entry of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
      const p = `${dir}/${entry.name}`
      if (entry.isDirectory()) walk(p)
      else if (entry.name.endsWith('.md')) out.push(p)
    }
  }
  walk('design')
  return out
}

describe('DESIGN.md', () => {
  it('exists and names itself generated', () => {
    expect(read('DESIGN.md')).toContain('<!-- @design:generated -->')
  })

  it.each(moduleIds)('%s has a module page', (id) => {
    expect(existsSync(resolve(ROOT, `design/${id}.md`))).toBe(true)
  })

  it.each(archetypes)('%s has a page template', (name) => {
    expect(existsSync(resolve(ROOT, `design/pages/${name}.md`))).toBe(true)
  })

  it('emits nothing that is not a module, an archetype or a named leaf', () => {
    const expected = new Set([
      'DESIGN.md',
      // The one leaf that is neither: the token values, split out of DESIGN.md
      // because they are the largest thing in it and are wanted only when
      // picking a value. Any OTHER unexpected file is an orphan — a module
      // renamed without regenerating leaves its old page behind.
      'design/tokens.md',
      ...moduleIds.map((id) => `design/${id}.md`),
      ...archetypes.map((a) => `design/pages/${a}.md`),
    ])
    expect(emitted().filter((f) => !expected.has(f))).toEqual([])
  })

  // The split is only a win if DESIGN.md actually got lighter and the values
  // all survived the move. A summary table that quietly dropped a group would
  // read as a deliberate abridgement rather than a bug.
  it('design/tokens.md carries every token value, and DESIGN.md carries none', () => {
    const tokensMd = read('design/tokens.md')
    const designMd = read('DESIGN.md')
    const json = JSON.parse(read('design-tokens.json')) as Record<string, unknown>
    const isLeaf = (x: unknown) =>
      typeof x === 'object' && x !== null && ('$value' in x || '$modes' in x)
    const paths: string[] = []
    const walk = (node: Record<string, unknown>, trail: string[] = []) => {
      for (const [k, v] of Object.entries(node)) {
        if (trail.length === 0 && (k.startsWith('$') || k === 'version' || k === 'lastUpdated'))
          continue
        if (isLeaf(v)) paths.push([...trail, k].join('.'))
        else if (typeof v === 'object' && v !== null) walk(v as Record<string, unknown>, [...trail, k])
      }
    }
    walk(json)
    expect(paths.length).toBeGreaterThan(200)
    expect(paths.filter((t) => !tokensMd.includes(`\`${t}\``))).toEqual([])
    expect(
      designMd.length,
      'DESIGN.md is no smaller than the values it delegates — the split did not happen',
    ).toBeLessThan(tokensMd.length * 2)
  })

  // The whole design of this surface is one fetch per question, which is worth
  // nothing if the link in the row you found points at a file that is not there.
  it.each(emitted())('%s links only to files that exist', (file) => {
    const body = read(file)
    const broken: string[] = []
    for (const [, target] of body.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|#|mailto:)/.test(target)) continue
      const resolved = resolve(ROOT, dirname(file), target)
      if (!existsSync(resolved)) broken.push(target)
    }
    expect(broken, `${file} links to missing files`).toEqual([])
  })

  // Same failure as the contracts' own pointer test: a document telling an
  // agent to open `design/pages/product-page.md` is a lie if the tarball has
  // no `design/`.
  it('ships in the tarball', () => {
    expect(pkg.files).toContain('DESIGN.md')
    expect(pkg.files).toContain('design')
    expect(pkg.exports['./DESIGN.md']).toBe('./DESIGN.md')
    expect(pkg.exports['./design/*']).toBe('./design/*')
  })

  // Restated per-file on purpose — an agent that opens one module page and
  // follows no link out of it still has to be told. See the generator header.
  it.each(emitted())('%s carries the non-negotiable rules', (file) => {
    expect(read(file)).toContain('Rules that are not negotiable')
  })

  it('warns on every module nothing has ever rendered', () => {
    const unproven = moduleIds.filter(
      (id) => ((context.modules[id] as { seen?: unknown[] }).seen ?? []).length === 0,
    )
    for (const id of unproven) {
      expect(read(`design/${id}.md`)).toContain('has ever rendered this module')
    }
  })
})
