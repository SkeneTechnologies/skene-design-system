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
      // The two leaves that are neither. Both were split out of DESIGN.md for
      // the same reason — inlined, the token values and the module indexes were
      // together 82% of it, paid for by every agent that opened it to check a
      // rule or a scale. Any OTHER unexpected file is an orphan: a module
      // renamed without regenerating leaves its old page behind.
      'design/tokens.md',
      'design/index.md',
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

  /**
   * Shipped AND served, which is not a contradiction.
   *
   * These were briefly split — the tree pulled from the tarball on the argument
   * that it cost every install ~136k tokens. That number was misleading: tokens
   * are only spent when something READS them, and on disk the tree is 708KB
   * beside 13MB of assets. Removing it saved nothing measurable and broke the
   * one consumer that publishes it, which installs the package and would have
   * served the files straight out of `node_modules`.
   *
   * So both. An agent with the checkout reads `node_modules/.../design/`; an
   * agent with only a URL fetches the same path over HTTP. Shipping never
   * prevented serving.
   */
  it('ships the tree and serves it', () => {
    expect(pkg.files).toContain('DESIGN.md')
    expect(pkg.files).toContain('design')
    expect(pkg.exports['./DESIGN.md']).toBe('./DESIGN.md')
    expect(pkg.exports['./design/*']).toBe('./design/*')
    // A route that does not exist makes the served half a dead pointer, which
    // is the failure `llms.txt` already shipped once with inventory.json.
    for (const r of [
      'docs-app/app/DESIGN.md/route.ts',
      'docs-app/app/design/[...path]/route.ts',
      'docs-app/app/styles.css/route.ts',
    ]) {
      expect(existsSync(resolve(ROOT, r)), `${r} is missing, so the served half does not exist`).toBe(true)
    }
  })

  // Restated per-file on purpose — an agent that opens one module page and
  // follows no link out of it still has to be told. See the generator header.
  //
  // A MODULE page carries the rules it can actually break, computed from its
  // own polarity, namespace and prose; the generic block was 228 tokens on
  // every leaf and told thirteen modules to worry about a class they apply
  // themselves. Everything else — DESIGN.md, the page templates, the index,
  // the token values — keeps the full set, because those are the files where
  // composition is decided and all three bind.
  it.each(emitted())('%s carries the rules that bind it', (file) => {
    const body = read(file)
    const isModulePage =
      file.startsWith('design/') &&
      !file.startsWith('design/pages/') &&
      !['design/index.md', 'design/tokens.md'].includes(file)
    expect(body).toContain(isModulePage ? 'What binds this module' : 'Rules that are not negotiable')
  })

  // The point of computing it is that the polarity line MATCHES the module.
  // Generic text that happens to be shorter would be no better than before.
  it.each(moduleIds)('%s states its own polarity, not a generic rule', (id) => {
    const body = read(`design/${id}.md`)
    const polarity = (context.modules[id] as { polarity?: string }).polarity
    if (!polarity) return
    expect(body).toContain(`Polarity \`${polarity}\``)
    // A module that brings its own ground must not be told to add the class.
    if (polarity === 'applies-light') expect(body).toContain('do NOT owe it the light class')
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
