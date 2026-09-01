/**
 * The agent entry point.
 *
 * Seven thousand lines of machine-readable contracts shipped from 2026-08-13
 * and were pointed at only by README prose. That works for an agent reading
 * top-down; it does nothing for one that lands in the directory, looks for
 * `AGENTS.md`, finds nothing and starts guessing. The contracts were readable
 * and undiscoverable, which is most of the way to not existing.
 *
 * These assert against Vercel's agent-readability spec, the parts of it that
 * apply to a package rather than a website:
 *
 *   - a skill file at one of the accepted paths (/AGENTS.md, /CLAUDE.md, …),
 *     carrying at least two of installation, configuration, usage;
 *   - an llms.txt at the root, non-empty, as the machine-readable index;
 *   - code blocks fenced with a language identifier.
 *
 * The site-level half of that spec — sitemap.xml, sitemap.md, robots.txt,
 * canonical links, JSON-LD, markdown mirrors, content negotiation — is about
 * serving pages over HTTP and belongs to `docs-app`, not here. It is not
 * checked in this file and its absence here is not a gap.
 *
 * The rest is this repository's usual concern: a pointer that names a file
 * which has moved is worse than no pointer, so every path named in either
 * entry point is resolved, and every contract on disk has to be named in both.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync, lstatSync, readlinkSync } from 'node:fs'
import { resolve } from 'node:path'
import { load } from 'js-yaml'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')
const pkg = JSON.parse(read('package.json'))
const agents = read('AGENTS.md')
const llms = read('llms.txt')

describe('the skill file', () => {
  it('sits at a path the spec accepts', () => {
    // /AGENTS.md is the first of them. /CLAUDE.md is another, and is a symlink
    // rather than a copy: two files saying the same thing is two files that
    // disagree by next quarter.
    expect(existsSync(resolve(ROOT, 'AGENTS.md'))).toBe(true)
    expect(lstatSync(resolve(ROOT, 'CLAUDE.md')).isSymbolicLink()).toBe(true)
    expect(readlinkSync(resolve(ROOT, 'CLAUDE.md'))).toBe('AGENTS.md')
  })

  it('carries installation, configuration and usage', () => {
    // The spec asks for at least two of the three. All three are here because
    // the first draft of this file had none of them: it explained the
    // contracts to an agent working INSIDE the repo and said nothing to the
    // far more common one trying to consume the package from outside.
    for (const heading of ['## Installation', '## Configuration', '## Usage']) {
      expect(agents, `AGENTS.md is missing ${heading}`).toContain(heading)
    }
  })

  it('fences every code block with a language', () => {
    // Spec requirement, and the reason for it is practical: an unlabelled block
    // is one an agent has to guess the language of before it can copy it.
    const fences = [...agents.matchAll(/^```(\w*)/gm)].map((m) => m[1])
    // Opening fences are the even-indexed ones; closers are bare.
    const openers = fences.filter((_, i) => i % 2 === 0)
    expect(openers.length, 'no code blocks at all').toBeGreaterThan(3)
    expect(openers.filter((l) => !l), 'unlabelled code fence in AGENTS.md').toEqual([])
  })

  it('ships in the tarball', () => {
    // A skill file nothing installs is a skill file for this repository only,
    // and the consumers are the audience.
    for (const f of ['AGENTS.md', 'llms.txt']) expect(pkg.files).toContain(f)
  })
})

describe('llms.txt', () => {
  it('is not empty and leads with the skill file', () => {
    expect(llms.trim().length).toBeGreaterThan(200)
    expect(llms).toContain('AGENTS.md')
  })

  it('is a plain-text index, not markup', () => {
    expect(llms, 'llms.txt should not contain HTML').not.toMatch(/<[a-z]+[\s>]/i)
  })
})

describe('every pointer resolves', () => {
  /**
   * Repo-relative paths named in a link or in backticks.
   *
   * Deliberately narrow. AGENTS.md also names paths in the CONSUMER's tree —
   * `src/app/globals.css` is where their stylesheet lives, not a file here —
   * and resolving those against this repo is how a correct instruction gets
   * "fixed" into a wrong one.
   */
  const pathsIn = (src: string) =>
    [
      ...[...src.matchAll(/\]\(\/([^)]+)\)/g)].map((m) => m[1]),
      ...[...src.matchAll(/`((?:machine|docs|__tests__)\/[\w./-]+)`/g)].map((m) => m[1]),
    ].filter((p) => !p.includes('*'))

  it.each([
    ['AGENTS.md', agents],
    ['llms.txt', llms],
  ])('%s names only files that exist', (name, src) => {
    const missing = [...new Set(pathsIn(src))].filter((p) => !existsSync(resolve(ROOT, p)))
    expect(missing, `${name} points at paths that do not exist`).toEqual([])
  })

  it('both entry points name every contract on disk', () => {
    // The ratchet. A seventh contract added to machine/ has to be written into
    // both indexes before this passes — which is the only way an index stays
    // true, since nothing else makes adding a file and listing it the same act.
    const contracts = readdirSync(resolve(ROOT, 'machine')).filter((f) => f.endsWith('.yaml'))
    expect(contracts.length).toBeGreaterThan(4)
    for (const c of contracts) {
      expect(agents, `AGENTS.md does not name machine/${c}`).toContain(`machine/${c}`)
      expect(llms, `llms.txt does not name machine/${c}`).toContain(`machine/${c}`)
    }
  })

  it('names context.yaml before any other contract, in both', () => {
    // Read order is the substance of the index. components.yaml's own header
    // says to read context.yaml first and come back; an entry point that
    // listed them the other way round would contradict the file it points at.
    for (const [name, src] of [
      ['AGENTS.md', agents],
      ['llms.txt', llms],
    ] as const) {
      const first = src.indexOf('machine/context.yaml')
      const others = ['components', 'rules', 'tokens', 'layouts', 'accessibility'].map((c) =>
        src.indexOf(`machine/${c}.yaml`),
      )
      expect(first, `${name} does not name context.yaml`).toBeGreaterThan(-1)
      expect(Math.min(...others), `${name} names another contract before context.yaml`).toBeGreaterThan(first)
    }
  })
})

describe('the counts quoted to agents are true', () => {
  // The README told agents "the package has 79 modules" for long enough that
  // the real number reached 89. A count in a document an agent is meant to
  // trust is a claim like any other.
  const counts = JSON.parse(read('docs-app/app/decisions/inventory.json')).counts as {
    modules: number
  }

  it.each([
    ['AGENTS.md', () => agents],
    ['README.md', () => read('README.md')],
  ])('%s quotes the real module count', (_name, src) => {
    // Presence of the CURRENT figure, not "every number before the word
    // modules". Both files make other true module counts, and a test that
    // flattened those into one rule would be satisfied by deleting the useful
    // ones. They are checked one by one below instead.
    expect(src(), `does not state the real total of ${counts.modules} modules`).toContain(
      `${counts.modules} modules`,
    )
  })

  // Every count above was the only one checked, and on 2026-09-01 an audit
  // found four more that had gone wrong, each in a sentence an agent acts on:
  //
  //   - AGENTS.md said "only the 8 modules that need it carry the directive"
  //     when 28 do. That number traced to a real bug: build-inventory.mjs
  //     matched only `'use client'` and 21 of the 29 directives in src are
  //     written `"use client";`, so inventory.json — the file a consumer reads
  //     to decide whether a deep import keeps its server boundary — was wrong
  //     for 21 of 89 modules.
  //   - llms.txt said 331 token values against 241 on disk.
  //   - llms.txt said the pages skill tabulates eight archetypes; it is ten,
  //     and the skill itself says ten. The index was wrong about the file it
  //     indexes.
  //   - README's gallery paragraph said "79 of the 89 modules as 85 cases, and
  //     the ten that gained no case" against 88, 97 and one — and that
  //     paragraph was ITSELF the correction of an earlier staleness, written
  //     to explain how the previous figure had rotted.
  //
  // The pattern is the point. A count nobody derives goes stale, the prose
  // around it goes on sounding careful, and the more confidently a sentence
  // explains a past drift the less likely anyone is to re-check it. Each one
  // below reads its figure out of the generated source.
  const inventory = JSON.parse(read('docs-app/app/decisions/inventory.json')) as {
    modules: { module: string; client?: boolean; cases?: unknown[] }[]
  }

  it('AGENTS.md quotes the real number of client modules', () => {
    const clients = inventory.modules.filter((m) => m.client).length
    expect(agents, `does not state the real ${clients} client modules`).toContain(
      `${clients} modules that need`,
    )
  })

  it('llms.txt quotes the real token count', () => {
    const json = JSON.parse(read('design-tokens.json')) as Record<string, unknown>
    const isLeaf = (x: unknown): boolean =>
      typeof x === 'object' && x !== null && ('$value' in x || '$modes' in x)
    const count = (node: Record<string, unknown>, top = false): number =>
      Object.entries(node).reduce((n, [k, v]) => {
        if (top && (k.startsWith('$') || k === 'version' || k === 'lastUpdated')) return n
        if (isLeaf(v)) return n + 1
        if (typeof v === 'object' && v !== null) return n + count(v as Record<string, unknown>)
        return n
      }, 0)
    expect(llms).toContain(`${count(json, true)} token values`)
  })

  it('llms.txt quotes the real archetype count, the way the skill it indexes does', () => {
    const compositions = load(read('machine/compositions.yaml')) as {
      archetypes: Record<string, unknown>
    }
    const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
    const n = Object.keys(compositions.archetypes).length
    const word = words[n] ?? String(n)
    expect(llms, `llms.txt does not say ${word} archetypes`).toContain(`${word} archetypes`)
    expect(
      read('skills/skene-design-system-pages/SKILL.md'),
      `the pages skill does not say ${word} archetypes`,
    ).toContain(`${word.charAt(0).toUpperCase()}${word.slice(1)} archetypes`)
  })

  // "twenty measured clusters" was quoted in SEVEN places — README, AGENTS,
  // both halves of the component skill, a test comment, compositions.yaml and
  // build-context.mjs — with nothing behind it, while README said "the ten
  // resolved design decisions" two rows above saying twenty. Ten is what the
  // registry holds. Every surface now quotes it, and this is what keeps them
  // quoting it: the count comes from inventory.json, not from the prose.
  it.each([
    'README.md',
    'AGENTS.md',
    'skills/skene-design-system/SKILL.md',
    '__tests__/context.test.ts',
    'scripts/build-context.mjs',
    'machine/compositions.yaml',
  ])('%s does not quote a cluster count the registry cannot back', (file) => {
    const decisions = JSON.parse(read('docs-app/app/decisions/inventory.json')).decisions as unknown[]
    // Flatten first. The claim is wrapped prose in every one of these files and
    // three of them wrap it mid-phrase behind a comment prefix (` * `, `# `,
    // YAML block indent) — the first cut of this gate matched a single line and
    // was blind to `ten adjudicated\n * clusters`, which is to say blind to two
    // of the six files it claimed to cover.
    const body = read(file).replace(/^[\s*#]+/gm, ' ').replace(/\s+/g, ' ')
    const CARDINAL: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
      nine: 9, ten: 10, eleven: 11, twelve: 12, twenty: 20, thirty: 30,
    }
    const ORDINAL: Record<string, number> = {
      tenth: 10, eleventh: 11, twelfth: 12, 'twenty-first': 21, 'twenty-second': 22,
    }
    const qualifier = '(?:adjudicated |documented |measured |duplicate )?'
    for (const [, word] of body.matchAll(
      new RegExp(String.raw`\b([\w-]+) ${qualifier}clusters?\b`, 'g'),
    )) {
      const w = word.toLowerCase()
      // An ordinal is a different claim — "an eleventh cluster" says this is
      // the NEXT one, so it must be n+1. Dropping ordinals as unparseable is
      // how the first cut passed `the twenty-first duplicate cluster` while
      // the registry held ten.
      if (w in ORDINAL) {
        expect(
          ORDINAL[w],
          `${file} calls something the ${w} cluster; the registry holds ${decisions.length}, so the next is ${decisions.length + 1}`,
        ).toBe(decisions.length + 1)
      } else if (w in CARDINAL) {
        expect(
          CARDINAL[w],
          `${file} quotes ${CARDINAL[w]} clusters; inventory.json holds ${decisions.length} adjudicated decisions`,
        ).toBe(decisions.length)
      }
    }
  })

  /**
   * One origin, in the manifest, and nothing may name another.
   *
   * `design/` is served rather than shipped, so every document that routes an
   * agent to it is naming a URL rather than a path on disk. Two documents
   * naming two origins is the same defect as a count quoted in two places —
   * except a wrong origin fails as a 404 in someone else's editor, where
   * nobody here will see it.
   */
  it('every document names the one origin the manifest records', () => {
    const pkg = JSON.parse(read('package.json')) as { designDocs?: string }
    const docs = pkg.designDocs
    expect(docs, 'package.json has no designDocs origin').toBeTruthy()
    const origin = String(docs).replace(/\/$/, '')
    for (const file of ['DESIGN.md', 'AGENTS.md', 'llms.txt']) {
      expect(read(file), `${file} does not name ${origin}`).toContain(origin)
    }
    // Any OTHER skene.ai docs path is a second address for one tree.
    for (const file of ['DESIGN.md', 'AGENTS.md', 'llms.txt', 'README.md']) {
      const others = [...read(file).matchAll(/https:\/\/[\w.]*skene\.ai\/[\w/-]*docs?[\w/-]*/g)]
        .map((m) => m[0])
        .filter((u) => !u.startsWith(origin))
      expect(others, `${file} names a docs origin other than ${origin}`).toEqual([])
    }
  })

  /**
   * The routes that make the origin real, and the basePath that puts them under
   * it. A tree announced at a URL and served at the root of a different one is
   * a dead pointer with extra steps.
   */
  it('the docs app is mounted under the path the origin names', () => {
    const pkg = JSON.parse(read('package.json')) as { designDocs: string }
    const expected = new URL(pkg.designDocs).pathname.replace(/\/$/, '')
    const config = read('docs-app/next.config.ts')
    expect(config, 'next.config.ts does not set basePath').toContain('basePath')
    // Derived from the manifest, not retyped — a hardcoded copy is a second
    // place the origin lives.
    expect(config).toContain('designDocs')
    expect(expected).toBe('/resources/docs')
  })

  it('the README gallery paragraph quotes the real case coverage', () => {
    const withCases = inventory.modules.filter((m) => (m.cases ?? []).length > 0)
    const cases = inventory.modules.reduce((n, m) => n + (m.cases ?? []).length, 0)
    const readme = read('README.md')
    expect(readme, 'README does not state the real rendered-module count').toContain(
      `${withCases.length} of the ${inventory.modules.length} modules as ${cases} cases`,
    )
  })
})
