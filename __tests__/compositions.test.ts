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

  it('says what the corpus does not cover, and never both ways about one route', () => {
    // A contract that quietly omits what it did not read reads as complete.
    // `seen: []` in context.yaml is the precedent: an unproven thing is marked,
    // not dropped.
    //
    // The second half of this is the one with scar tissue. v0.13.0 shipped this
    // file recording `(site)/page.tsx` and `(site)/pricing/page.tsx` under
    // `not_covered` as importing no section from this package. Both imported
    // heavily — seventeen modules and nine — at the very commit `corpus.commit`
    // names, and they were the two densest routes in the corpus. Six modules
    // appeared nowhere in the file as a result, two of them `sections/feature-row`
    // (which machine/rules.yaml MANDATES for a marketing card) and
    // `sections/final-cta` (the closer), so an agent following the archetypes
    // built a page with neither.
    //
    // The old assertion here was `toMatch(/pricing/)` — it passed because the
    // false claim mentioned pricing, which is the whole problem with asserting
    // on the presence of a word. Being covered and being uncovered are the two
    // halves of one corpus; a route can be in exactly one of them.
    const nc = (doc as { not_covered?: { route?: string }[] }).not_covered
    expect(Array.isArray(nc) && nc.length > 0, 'nothing recorded as not covered').toBe(true)
    expect(JSON.stringify(nc), 'the alternatives subtree is no longer recorded').toMatch(
      /alternatives/,
    )

    const cited = new Set(
      Object.values(
        (doc as { archetypes: Record<string, { routes?: Record<string, string[]> }> }).archetypes,
      ).flatMap((a) => Object.keys(a.routes ?? {})),
    )
    expect(
      nc!.map((n) => n.route).filter((r): r is string => !!r && cited.has(r)),
      'these routes are cited by an archetype AND recorded as not covered',
    ).toEqual([])
  })
})

/**
 * The file against itself.
 *
 * Every number in `compositions.yaml` is derived from the `routes:` maps that
 * sit beside it, so every number is recomputable — and until 2026-08-27 none of
 * them was checked. The corpus lost two routes, every `in: N, of: M` in the file
 * went two short, and the suite reported green because it only ever asked
 * whether the named modules existed.
 *
 * What these cannot check is whether the corpus is COMPLETE. That needs someone
 * to re-read the consumer, which is how the original defect was found and is
 * recorded in `corpus.history`. What they can check is that the file never again
 * states a count its own evidence does not support.
 */
describe('compositions.yaml is consistent with its own citations', () => {
  interface Archetype {
    instances?: number
    load_bearing?: string[]
    optional?: { module: string; in: number; of: number }[]
    observed?: string[]
    routes?: Record<string, string[]>
  }
  const archetypes = (doc as { archetypes: Record<string, Archetype> }).archetypes
  const corpus = (doc as { corpus: Record<string, number> }).corpus
  const spine = (doc as { spine: { module: string; in: number; of: number }[] }).spine

  /** Route -> its import list, flattened across every archetype. */
  const routes: Record<string, string[]> = Object.fromEntries(
    Object.values(archetypes).flatMap((a) => Object.entries(a.routes ?? {})),
  )
  const all = Object.keys(routes)

  it('the corpus counts are the citations counted', () => {
    expect(all.length, 'routes_composing_sections is not the number of routes cited').toBe(
      corpus.routes_composing_sections,
    )
    // The one number with no citation behind it: how many route files exist on
    // the branch. It can only be checked by reading the consumer, so it is
    // checked for internal arithmetic instead.
    expect(corpus.routes_read).toBe(
      corpus.routes_composing_sections + corpus.routes_importing_nothing,
    )
    const seen = new Set(Object.values(routes).flat())
    expect(seen.size, 'modules_seen is not the number of distinct modules cited').toBe(
      corpus.modules_seen,
    )
  })

  it('every spine count is the count of routes that cite the module', () => {
    for (const s of spine) {
      const n = all.filter((r) => routes[r].includes(s.module)).length
      expect({ module: s.module, in: s.in, of: s.of }).toEqual({
        module: s.module,
        in: n,
        of: all.length,
      })
    }
  })

  it.each(Object.entries(archetypes))('%s: instances is its route count', (_id, a) => {
    expect(a.instances).toBe(Object.keys(a.routes ?? {}).length)
  })

  it.each(Object.entries(archetypes))('%s: load_bearing appears in every route', (_id, a) => {
    const rs = Object.keys(a.routes ?? {})
    const notEverywhere = (a.load_bearing ?? []).filter(
      (m) => !rs.every((r) => routes[r].includes(m)),
    )
    expect(notEverywhere, 'named load_bearing but missing from a cited route').toEqual([])
  })

  it.each(Object.entries(archetypes))('%s: every optional count is recomputable', (_id, a) => {
    const rs = Object.keys(a.routes ?? {})
    for (const o of a.optional ?? []) {
      const n = rs.filter((r) => routes[r].includes(o.module)).length
      expect({ module: o.module, in: o.in, of: o.of }).toEqual({
        module: o.module,
        in: n,
        of: rs.length,
      })
    }
  })

  it.each(Object.entries(archetypes))('%s: no module in a route goes undeclared', (_id, a) => {
    // A module a cited route imports but the recipe never names is the shape
    // the two dropped routes took at the file level: present in the evidence,
    // absent from the guidance.
    const declared = new Set([
      ...(a.load_bearing ?? []),
      ...(a.optional ?? []).map((o) => o.module),
      ...(a.observed ?? []),
    ])
    const undeclared = [...new Set(Object.values(a.routes ?? {}).flat())].filter(
      (m) => !declared.has(m),
    )
    expect(undeclared, 'imported by a cited route, named by no recipe').toEqual([])
  })
})
