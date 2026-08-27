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
    // modules". Both files make other true module counts — "the 8 modules that
    // need `use client`" — and a test that flattened those into one rule would
    // be satisfied by deleting the useful ones.
    expect(src(), `does not state the real total of ${counts.modules} modules`).toContain(
      `${counts.modules} modules`,
    )
  })
})
