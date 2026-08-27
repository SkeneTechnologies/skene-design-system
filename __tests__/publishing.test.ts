/**
 * The publish contract.
 *
 * This package is moving from a git dependency to a published one, because
 * several product repos are about to retire their own design systems in favour
 * of it and a git dependency makes every one of them clone 36 MB of history on
 * every cold CI install.
 *
 * Publishing adds a failure mode the git-dependency path never had: a
 * credential. The repository is PUBLIC, so a token committed here is a token
 * published. Half of this file exists for that one sentence.
 *
 * The other half is the same argument the rest of this suite makes — a claim
 * with nothing behind it drifts. The README's `#semver:` range went stale four
 * times before a test was pointed at it. The publish path gets its test first
 * rather than fourth.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { load } from 'js-yaml'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')
const pkg = JSON.parse(read('package.json'))

describe('a token cannot be committed', () => {
  it('.npmrc is ignored', () => {
    // `npm config set //registry.npmjs.org/:_authToken=...` run inside the
    // project writes a PROJECT .npmrc with the token in plaintext. That is the
    // whole leak: not a mistake anyone makes deliberately, just the default
    // place npm puts a credential when you are standing in the wrong directory.
    const ignored = read('.gitignore')
      .split('\n')
      .map((l) => l.trim())
      .includes('.npmrc')
    expect(ignored, '.gitignore must contain a bare `.npmrc` line').toBe(true)
  })

  it('git agrees that it is ignored', () => {
    // The line above could be shadowed by a later negation. Ask git, which is
    // the thing that actually decides.
    const status = execFileSync('git', ['check-ignore', '-q', '.npmrc'], {
      cwd: ROOT,
      stdio: 'ignore',
    })
    expect(status).toBeDefined()
  })

  it('no .npmrc is tracked, now or as a leftover', () => {
    const tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n')
      .filter((f) => f.endsWith('.npmrc'))
    expect(tracked, 'an .npmrc is tracked in a public repository').toEqual([])
  })

  it('no tracked file carries a real npm auth token', () => {
    // Belt to the braces above: a token can also arrive pasted into a workflow,
    // a script or a doc example.
    //
    // Matching `_authToken` alone would be wrong — the README documents the
    // line a consumer has to write, and `_authToken=<token>` is the correct
    // thing for it to say. A test that cannot tell a placeholder from a
    // credential gets satisfied by deleting the documentation, which leaves the
    // consumer guessing and the repo no safer. So this matches the VALUE, in
    // the two shapes npm actually issues: `npm_…` for granular and classic
    // tokens, and a bare UUID for the legacy ones.
    const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
      .filter((f) => /\.(json|ya?ml|md|mjs|ts|tsx|sh|npmrc)$/.test(f))
      .filter((f) => f !== '__tests__/publishing.test.ts' && f !== 'package-lock.json')
    const TOKEN =
      /npm_[A-Za-z0-9]{30,}|_authToken\s*=\s*["']?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
    const offenders = files.filter((f) => TOKEN.test(read(f)))
    expect(offenders, 'these look like they contain a real npm token').toEqual([])
  })
})

describe('the package is publishable', () => {
  it('publishes restricted, to a named registry', () => {
    // `access: restricted` is not a preference. The licence is UNLICENSED and
    // the LICENSE file grants no right to use; publishing this public would
    // contradict the file shipped inside it.
    expect(pkg.publishConfig?.access).toBe('restricted')
    expect(pkg.publishConfig?.registry, 'publishConfig names no registry').toMatch(/^https:\/\//)
  })

  it('the registry keeps the @skene scope usable', () => {
    // The reason this is npmjs and not GitHub Packages. GitHub Packages
    // requires the scope to equal the repository owner, which would make this
    // `@skenetechnologies/design-system` and rewrite the import specifier in
    // every file of every consumer — the exact churn the consolidation exists
    // to avoid. If the registry ever moves, the scope has to be re-checked
    // against it, and this is where that gets noticed.
    expect(pkg.name).toBe('@skene/design-system')
    if (pkg.publishConfig?.registry?.includes('npm.pkg.github.com')) {
      expect(
        pkg.name.startsWith('@skenetechnologies/'),
        'GitHub Packages requires the scope to be the repo owner; rename or change registry',
      ).toBe(true)
    }
  })

  it('a publish rebuilds rather than trusting the working tree', () => {
    // dist/ is committed, so `npm publish` from a stale checkout would ship
    // whatever bytes happened to be on disk. prepublishOnly runs the same
    // verify CI runs, which ends in a build.
    expect(pkg.scripts.prepublishOnly, 'no prepublishOnly').toBeDefined()
    expect(pkg.scripts.prepublishOnly).toMatch(/verify|build/)
  })

  it('still has no prepare script', () => {
    // Asserted in package-contract too, and worth repeating from this side:
    // prepublishOnly and prepare look interchangeable and are not. npm runs
    // `prepare` for GIT dependencies, turning every cold consumer install into
    // a full devDependency install of this repo in a temp dir. Consumers are
    // still on the git path until they migrate, so adding one now would slow
    // down exactly the people this work is meant to speed up.
    expect(pkg.scripts.prepare).toBeUndefined()
  })
})

describe('the publish workflow', () => {
  const path = '.github/workflows/publish.yml'

  it('exists', () => {
    expect(existsSync(resolve(ROOT, path)), `${path} is missing`).toBe(true)
  })

  const wf = existsSync(resolve(ROOT, path)) ? (load(read(path)) as Record<string, never>) : null

  it('is valid YAML that GitHub would accept', () => {
    expect(wf).toBeTruthy()
    // `on:` parses as boolean true in YAML 1.1 — the classic Actions gotcha.
    const triggers = (wf as never)['on'] ?? (wf as never)[true as never]
    expect(triggers, 'no triggers').toBeTruthy()
  })

  it('fires on version tags', () => {
    const triggers = ((wf as never)['on'] ?? (wf as never)[true as never]) as {
      push?: { tags?: string[] }
    }
    expect(triggers.push?.tags?.some((t) => t.startsWith('v')), 'not tag-triggered').toBe(true)
  })

  it('takes its credential from a secret, through the environment', () => {
    const src = read(path)
    expect(src).toMatch(/NODE_AUTH_TOKEN:\s*\$\{\{\s*secrets\./)
  })

  it('never writes an npmrc by hand', () => {
    // setup-node writes the runner's .npmrc from registry-url + NODE_AUTH_TOKEN.
    // Doing it manually means a token in a shell line, which means a token in
    // the job log the first time someone adds `set -x`.
    const src = read(path)
    expect(src).not.toMatch(/_authToken/)
    expect(src, 'writes .npmrc directly').not.toMatch(/(echo|cat|printf|tee)[^\n]*\.npmrc/)
  })

  it('refuses to publish a tag that disagrees with package.json', () => {
    // The version string in this repo has drifted from reality four times.
    // A tag that says v0.13.0 over a package.json that says 0.12.0 publishes
    // the wrong number to every consumer at once, and unpublishing is not a
    // thing you get to do twice.
    const src = read(path)
    expect(src, 'no tag/version agreement check').toMatch(/version/i)
    expect(src).toMatch(/GITHUB_REF|github\.ref/)
  })

  it('asks for no more permission than publishing needs', () => {
    // Publishing to npmjs needs nothing from GitHub. A workflow holding
    // write scopes it never uses is the blast radius of the next mistake.
    const perms = (wf as never as { permissions?: Record<string, string> }).permissions
    expect(perms, 'permissions not pinned; the default token is read-write').toBeTruthy()
    for (const [scope, level] of Object.entries(perms!)) {
      expect(`${scope}:${level}`, 'publishing needs no write scope').toMatch(/:(read|none)$/)
    }
  })
})

describe('the run leaves nothing behind', () => {
  it('no scratch run log is shipped', () => {
    // .runlog/ is this session's working file. It is useful while the work is
    // in flight and noise in a package a dozen repos install.
    expect(existsSync(resolve(ROOT, '.runlog')), 'delete .runlog before merging').toBe(false)
    expect(pkg.files).not.toContain('.runlog')
  })

  it('every path in files exists', () => {
    // A `files` entry naming nothing publishes a package missing whatever the
    // entry was for, and npm does not warn.
    const missing = (pkg.files as string[]).filter((f) => !existsSync(resolve(ROOT, f)))
    expect(missing, 'files names paths that do not exist').toEqual([])
  })

  it('ships the machine contracts an agent is told to read', () => {
    // The README points agents at machine/context.yaml first. If that is not in
    // the tarball, every consuming agent gets ENOENT from the instruction.
    for (const f of readdirSync(resolve(ROOT, 'machine'))) {
      expect(f.endsWith('.yaml'), `machine/${f} is not YAML`).toBe(true)
    }
    expect(pkg.files).toContain('machine')
  })
})
