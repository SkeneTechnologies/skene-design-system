/**
 * The page-composition contract.
 *
 * `machine/context.yaml` answers "what is FeatureRow for" for 89 modules, with
 * prop signatures and all. It has never answered the question an agent actually
 * arrives with, which is "I have to build a features page — what goes in it, in
 * what order?" The answer existed only in the marketing site's route files, and
 * `docs-app` is not in `files`, so no consumer could reach it.
 *
 * `machine/compositions.yaml` is that answer, derived from 19 routes that were
 * actually built rather than from a taxonomy someone liked the shape of. These
 * tests exist because a recipe is a claim like any other, and this package has
 * a documented history of confident claims that named things which were not
 * there — the whole `via` citation mechanism in context.yaml is scar tissue
 * from it.
 *
 * So: every module a recipe names must exist, and every recipe must say which
 * route it came from. A recipe with no citation is a guess wearing a contract's
 * clothes, and the failure mode is an agent building a page out of components
 * nobody has put next to each other.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { load } from 'js-yaml'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')
const PATH = 'machine/compositions.yaml'

const doc = existsSync(resolve(ROOT, PATH))
  ? (load(read(PATH)) as Record<string, unknown>)
  : null

/**
 * Module ids exactly as `machine/context.yaml` keys them: layer-qualified,
 * `sections/artifact-shell` rather than `artifact-shell`.
 *
 * The first version of this file matched bare kebab-case tokens against the
 * inventory's unqualified names, which was crude in both directions — it missed
 * every real reference because they carry a layer prefix, and it flagged
 * `product-page` and `skene-marketing-website` as undeclared modules because
 * they are hyphenated. Layer-qualified ids are unambiguous, and they mean a
 * recipe greps straight across to the entry that describes what it names.
 */
const known = new Set(
  Object.keys((load(read('machine/context.yaml')) as { modules: Record<string, unknown> }).modules),
)

describe('machine/compositions.yaml', () => {
  it('exists and parses', () => {
    expect(existsSync(resolve(ROOT, PATH)), `${PATH} is missing`).toBe(true)
    expect(doc, `${PATH} is not valid YAML`).toBeTruthy()
  })

  it('names only modules this package actually ships', () => {
    // The load-bearing assertion. A recipe naming `sections/hero` because it
    // sounds like it should exist is exactly the defect this file prevents, and
    // it is invisible to a human skimming a plausible list.
    //
    // Checked against context.yaml's keys rather than a hand-kept list, so a
    // module renamed in src fails here without anyone remembering a second copy.
    const refs = new Set(JSON.stringify(doc).match(/(?:ui|patterns|sections)\/[a-z0-9-]+/g) ?? [])
    expect(refs.size, 'no module references found — has the schema changed?').toBeGreaterThan(20)
    expect(
      [...refs].filter((r) => !known.has(r)),
      'these are named as modules but this package ships no such module',
    ).toEqual([])
  })

  it('every archetype cites the routes it was derived from', () => {
    // Derived, not invented. The citation is what lets the next person check,
    // and it is the difference between a contract and a preference.
    // `routes` is a mapping of route -> the modules that route imports, not a
    // bare list of names. That is the stronger shape: the evidence for the
    // recipe sits beside the recipe, so checking it needs no second file.
    const archetypes = (doc as {
      archetypes: Record<string, { routes?: Record<string, string[]> }>
    }).archetypes
    expect(Object.keys(archetypes).length, 'no archetypes').toBeGreaterThan(2)

    const uncited = Object.entries(archetypes)
      .filter(([, v]) => !v.routes || Object.keys(v.routes).length === 0)
      .map(([k]) => k)
    expect(uncited, 'archetypes with no route citation').toEqual([])

    // And the citation has to be a route, not a label someone typed.
    const bad = Object.entries(archetypes).flatMap(([k, v]) =>
      Object.keys(v.routes ?? {})
        .filter((r) => !r.endsWith('page.tsx'))
        .map((r) => `${k}: ${r}`),
    )
    expect(bad, 'route citations that do not name a page file').toEqual([])
  })

  it('never claims a module is load-bearing on a single instance', () => {
    // With one observed route nothing can be shown to RECUR, so a load_bearing
    // list there would be one page's import list promoted to a rule. That is
    // how a house style becomes a contract nobody agreed to.
    const archetypes = (doc as {
      archetypes: Record<string, { instances?: number; load_bearing?: unknown[] }>
    }).archetypes
    const overclaimed = Object.entries(archetypes)
      .filter(([, v]) => (v.instances ?? 0) < 2 && (v.load_bearing?.length ?? 0) > 0)
      .map(([k]) => k)
    expect(overclaimed, 'load_bearing asserted from a single route').toEqual([])
  })

  it('says what the corpus does not cover', () => {
    // Home and pricing import no section from this package, so there is no
    // observed recipe for either. A contract that quietly omits that reads as
    // complete. `seen: []` in context.yaml is the precedent: an unproven thing
    // is marked, not dropped.
    const nc = (doc as { not_covered?: unknown[] }).not_covered
    expect(Array.isArray(nc) && nc.length > 0, 'nothing recorded as not covered').toBe(true)
    expect(JSON.stringify(nc)).toMatch(/pricing/)
  })
})
