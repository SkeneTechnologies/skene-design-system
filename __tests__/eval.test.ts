/**
 * The eval scorer, scored.
 *
 * `npm run eval` measures candidates against the contracts. This measures the
 * scorer, because a check that silently stops firing is worse than no check —
 * it converts "nobody looked" into "it passed". Two of the checks in this file
 * shipped broken on their first write and both failed OPEN, reporting a clean
 * page:
 *
 *   - `rhythm_tall_once` counted `py-[128px]`, which is also the `md:` step of
 *     the DEFAULT rhythm, so it reported two tall bands on pages with none.
 *   - `polarity` tested `/\blight\b/` against the class string, which matches
 *     inside `bg-brand-light` — the very utility that paints the light ground.
 *     The check read its own defect as its fix and passed the fixture written
 *     to fail it.
 *
 * So the fixtures are the assertion: each `bad-*` candidate is built to break
 * exactly one rule, and this pins which check must catch it. Add a check to
 * `scripts/eval.mjs` and it needs a fixture here, or nothing proves it works.
 */

import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'
import { run } from '../scripts/eval.mjs'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')

type Result = { id: string; status: string; cites: string; detail: string }
type Candidate = { label: string; results: Result[]; passed: number; failed: number; scored: number }
type Entry = { case: string; archetype?: string; candidates: Candidate[] }

const report = run() as Entry[]
const all = report.flatMap((e) => e.candidates.map((c) => ({ ...c, case: e.case })))
const failedIds = (c: Candidate) => c.results.filter((r) => r.status === 'fail').map((r) => r.id).sort()

/**
 * The contract of this suite: fixture -> the ONE rule it breaks. A fixture that
 * trips a second check is not a better fixture, it is an ambiguous one — the
 * failure no longer tells you which check did the work.
 */
const EXPECTED: Record<string, string[]> = {
  'product-security/bad-missing-load-bearing': ['load_bearing'],
  'product-security/bad-invented-module': ['module_exists'],
  'product-security/bad-light-without-class': ['polarity'],
  'product-security/bad-hex-and-chrome': ['arbitrary_hex', 'chrome_role'],
  'product-security/bad-page-declares-ground': ['page_declares_ground'],
  'product-security/bad-two-tall-bands': ['rhythm_tall_once'],
  'product-security/bad-card-grid-and-local-copy': ['local_copy', 'marketing_card'],
  'use-case-analytics/bad-half-the-shape': ['load_bearing'],
}

describe('the eval scorer', () => {
  it('has cases, and every case has candidates', () => {
    expect(report.length).toBeGreaterThan(1)
    for (const e of report) expect(e.candidates.length, `${e.case} has no candidates`).toBeGreaterThan(1)
  })

  it('every case names an archetype that compositions.yaml carries', () => {
    const compositions = load(read('machine/compositions.yaml')) as {
      archetypes: Record<string, unknown>
    }
    for (const e of report) {
      expect(
        Object.keys(compositions.archetypes),
        `${e.case} names archetype ${e.archetype}`,
      ).toContain(e.archetype)
    }
  })

  it.each(Object.entries(EXPECTED))('%s fails exactly %s', (key, expected) => {
    const [caseName, label] = key.split('/')
    const c = all.find((x) => x.case === caseName && x.label === label)
    expect(c, `no candidate ${key}`).toBeDefined()
    expect(failedIds(c as Candidate)).toEqual([...expected].sort())
  })

  it.each(all.filter((c) => c.label === 'good').map((c) => c.case))(
    '%s/good passes every check that applies',
    (caseName) => {
      const c = all.find((x) => x.case === caseName && x.label === 'good') as Candidate
      expect(failedIds(c)).toEqual([])
      expect(c.scored, 'a candidate that skips every check proves nothing').toBeGreaterThan(4)
    },
  )

  // A check with no fixture is a claim nobody has tested. This is the gate that
  // makes adding one to eval.mjs also mean adding evidence that it fires.
  it('every check that can fail has a fixture that makes it fail', () => {
    const canFail = new Set(
      all.flatMap((c) => c.results.filter((r) => r.status !== 'skip').map((r) => r.id)),
    )
    const covered = new Set(Object.values(EXPECTED).flat())
    // `module_exists` and the rest are covered; anything scoreable that no
    // fixture breaks is listed here so the gap is visible rather than assumed.
    const uncovered = [...canFail].filter((id) => !covered.has(id)).sort()
    expect(uncovered, 'scoreable checks with no failing fixture').toEqual([])
  })

  // Every check cites the contract it comes from. A check with no citation is
  // an opinion, and this repository's whole premise is that a rule an agent is
  // asked to follow can be traced to the file that decided it.
  it('every check cites a contract file that exists', () => {
    const seen = new Map<string, string>()
    for (const c of all) for (const r of c.results) seen.set(r.id, r.cites)
    expect(seen.size).toBeGreaterThan(8)
    for (const [id, cites] of seen) {
      expect(cites, `${id} has no citation`).toBeTruthy()
      const files = [...cites.matchAll(/([\w-]+\.yaml)/g)].map((m) => m[1])
      expect(files.length, `${id} cites no contract file: "${cites}"`).toBeGreaterThan(0)
      for (const f of files) {
        expect(existsSync(resolve(ROOT, 'machine', f)), `${id} cites machine/${f}, which does not exist`).toBe(true)
      }
    }
  })

  it('ships the cases and candidates so the loop is reproducible', () => {
    const pkg = JSON.parse(read('package.json')) as { files: string[]; scripts: Record<string, string> }
    expect(pkg.scripts.eval).toBeTruthy()
    expect(pkg.files).toContain('evals')
    expect(readdirSync(resolve(ROOT, 'evals/cases')).filter((f) => f.endsWith('.yaml')).length).toBeGreaterThan(1)
  })
})
