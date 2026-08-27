/**
 * The three Agent Skills.
 *
 * AGENTS.md is read by an agent that already knows to look for it. A skill is
 * read by one that does not: it is routed to by its `description`, on a trigger
 * the agent never went looking for. That is the whole point of shipping them,
 * and it is also the whole risk — a skill whose description overlaps another's
 * fires at the wrong moment, and a skill that names a file that has moved sends
 * the agent somewhere that is not there.
 *
 * The split is by MOMENT, not by surface:
 *
 *   skene-design-system-setup  — you are adding the package to a repo
 *   skene-design-system        — you are writing or changing one component
 *   skene-design-system-pages  — you are assembling a whole page
 *
 * Surface would have been the wrong axis: dashboard visuals render ON marketing
 * pages, so a marketing/product split would misroute every artifact section.
 *
 * These gates are the usual kind for this repository: a claim quoted to an
 * agent is a claim like any other, so the intent vocabulary inlined in the
 * component skill is compared against the one context.yaml actually declares,
 * and every repo-relative path any skill names is resolved.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { load as parse } from 'js-yaml'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')
const pkg = JSON.parse(read('package.json'))

const NAMES = [
  'skene-design-system',
  'skene-design-system-setup',
  'skene-design-system-pages',
] as const

const skills = NAMES.map((name) => {
  const src = read(`skills/${name}/SKILL.md`)
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/)
  return { name, src, front: fm ? (parse(fm[1]) as Record<string, string>) : null, body: src.slice(fm?.[0].length ?? 0) }
})

describe('the skills exist and are addressable', () => {
  it('has exactly the three, and no fourth nobody wired up', () => {
    const dirs = readdirSync(resolve(ROOT, 'skills'))
    expect(dirs.sort()).toEqual([...NAMES].sort())
  })

  it.each(skills)('$name has frontmatter whose name matches its directory', (skill) => {
    expect(skill.front, `${skill.name}/SKILL.md has no YAML frontmatter`).not.toBeNull()
    expect(skill.front!.name).toBe(skill.name)
  })

  it.each(skills)('$name has a description that can route to it', (skill) => {
    // The description IS the trigger. A one-liner that says what the skill is
    // about, rather than when to reach for it, never fires.
    const d = skill.front!.description ?? ''
    expect(d.length, 'description too short to route on').toBeGreaterThan(200)
    expect(d, 'description does not say when to use it').toMatch(/^Use when /)
    expect(d, 'description does not name the package it depends on').toContain('@skene/design-system')
  })
})

describe('the three triggers do not overlap', () => {
  // Three skills over one package is three chances to fire the wrong one. Each
  // description has to send the agent to the other two by name for the moments
  // it does not cover — which is also the only cross-reference an agent sees
  // before it has opened any of them.
  it.each(skills)('$name excludes the other two by name', (skill) => {
    const d = skill.front!.description
    expect(d, `${skill.name} has no exclusion clause`).toContain('Do NOT use for')
    for (const other of NAMES) {
      if (other === skill.name) continue
      expect(d, `${skill.name} does not hand off to ${other}`).toContain(other)
    }
  })
})

describe('every path a skill names resolves', () => {
  // Same rule as agent-entry-point.test.ts, and the same narrowing: the setup
  // skill names paths in the CONSUMER's tree (`~/.npmrc`, `src/app/globals.css`,
  // `node_modules/...`) which do not exist here and must not be resolved.
  const pathsIn = (src: string) =>
    [...src.matchAll(/`((?:machine|docs|__tests__|skills)\/[\w./-]+)`/g)].map((m) => m[1])

  it.each(skills)('$name points only at files that exist', (skill) => {
    const missing = [...new Set(pathsIn(skill.src))].filter((p) => !existsSync(resolve(ROOT, p)))
    expect(missing, `${skill.name} points at paths that do not exist`).toEqual([])
  })
})

describe('what the skills quote is true', () => {
  const context = parse(read('machine/context.yaml')) as {
    counts: Record<string, number>
    intents: Record<string, string>
  }

  it('the intent vocabulary inlined in the component skill is the one context.yaml declares', () => {
    // The reason to inline it at all is that the tag list is useless as a
    // pointer: an agent that has to open context.yaml to learn the tags has
    // already paid the cost the reverse index exists to avoid. The cost of
    // inlining is that it can drift, which is what this gate is for.
    const skill = skills.find((s) => s.name === 'skene-design-system')!
    const rows = [...skill.body.matchAll(/^\| `([a-z-]+)` \|/gm)].map((m) => m[1])
    expect(rows.sort()).toEqual(Object.keys(context.intents).sort())
  })

  it('the counts the skills quote match the source', () => {
    const skill = skills.find((s) => s.name === 'skene-design-system')!
    expect(skill.src).toContain(`${context.counts.modules} modules`)
  })

  it('the unproven-module count is the real number of seen: [] modules', () => {
    // This one was quoted as nine in the first draft of the skill and ten in
    // AGENTS.md, which is the exact failure mode the `seen` field exists to
    // prevent: a claim about how much has been proven, itself unproven. It is
    // also the count most likely to move, since it drops every time a module
    // gets its first gallery case.
    const { modules } = parse(read('machine/context.yaml')) as {
      modules: Record<string, { seen?: unknown[] }>
    }
    const unproven = Object.values(modules).filter(
      (m) => m && typeof m === 'object' && Array.isArray(m.seen) && m.seen.length === 0,
    ).length
    expect(unproven, 'no module is unproven — the gate has nothing to check').toBeGreaterThan(0)
    const spelled = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][unproven]
    for (const [name, src] of [
      ['skills/skene-design-system/SKILL.md', skills.find((s) => s.name === 'skene-design-system')!.src],
      ['AGENTS.md', read('AGENTS.md')],
    ] as const) {
      expect(
        src.toLowerCase(),
        `${name} does not state the real unproven-module count of ${unproven}`,
      ).toContain(`${spelled} modules are in that state`)
    }
  })

  it('the archetypes the pages skill tabulates are the ones compositions.yaml carries', () => {
    const comps = parse(read('machine/compositions.yaml')) as {
      archetypes: Record<string, { confidence: string; instances: number }>
    }
    const skill = skills.find((s) => s.name === 'skene-design-system-pages')!
    const rows = [...skill.body.matchAll(/^\| `([a-z-]+)` \| (derived|pair|single) \((\d+)\)/gm)]
    expect(rows.length, 'the archetype table did not parse').toBeGreaterThan(4)
    const tabulated = Object.fromEntries(rows.map((m) => [m[1], { confidence: m[2], instances: Number(m[3]) }]))
    expect(tabulated).toEqual(
      Object.fromEntries(
        Object.entries(comps.archetypes).map(([id, a]) => [
          id,
          { confidence: a.confidence, instances: a.instances },
        ]),
      ),
    )
  })

  it('the spine the pages skill tabulates matches compositions.yaml', () => {
    const comps = parse(read('machine/compositions.yaml')) as {
      spine: { module: string; in: number; of: number }[]
    }
    const skill = skills.find((s) => s.name === 'skene-design-system-pages')!
    const rows = [...skill.body.matchAll(/^\| `([\w/-]+)` \| (\d+) \| (\d+) \|/gm)].map((m) => ({
      module: m[1],
      in: Number(m[2]),
      of: Number(m[3]),
    }))
    expect(rows).toEqual(comps.spine.map((s) => ({ module: s.module, in: s.in, of: s.of })))
  })
})

describe('the skills ship', () => {
  it('is in package.json files, so a consumer gets them from node_modules', () => {
    // A skill that only exists in this repository routes nothing: every agent
    // it is written for is working in a CONSUMER repo, reading the installed
    // package.
    expect(pkg.files).toContain('skills')
  })

  it.each(['AGENTS.md', 'llms.txt'])('%s names all three', (entry) => {
    const src = read(entry)
    for (const name of NAMES) {
      expect(src, `${entry} does not name skills/${name}`).toContain(`skills/${name}`)
    }
  })
})
