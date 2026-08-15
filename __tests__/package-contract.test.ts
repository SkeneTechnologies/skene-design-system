/**
 * The contract a consuming app depends on.
 *
 * Every assertion here corresponds to something that fails *silently* — the
 * build succeeds, nothing warns, and the breakage shows up as "the components
 * look wrong" in an app somebody else owns.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { load } from 'js-yaml'
import { satisfies } from 'semver'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')
const pkg = JSON.parse(read('package.json'))

describe('Tailwind source registration', () => {
  it('declares @source for its own dist', () => {
    // Tailwind v4 hard-excludes node_modules from automatic content detection,
    // and there is no config file to override that. Without this line the
    // package contributes no classes and every primitive renders unstyled.
    //
    // Verified empirically against a real consumer with the package installed
    // into node_modules: with the directive, .rounded-sm / .bg-brand-peach /
    // .text-muted-foreground / .border-border / .animate-in / .shadow-xs all
    // generate and the output is 73,507 bytes. With it removed, none generate
    // and the output is 20,778 bytes.
    expect(read('styles/index.css')).toMatch(/^@source\s+"\.\.\/dist\/\*\*\/\*\.js";/m)
  })

  it('does not import tailwindcss itself', () => {
    // Preflight and utility generation must happen exactly once, in the app.
    // Importing it from a dependency stylesheet gives duplicate preflight.
    //
    // Comments are stripped first: index.css documents the line the *consumer*
    // is supposed to write, and a naive match flags that prose as a violation.
    const css = read('styles/index.css').replace(/\/\*[\s\S]*?\*\//g, '')
    expect(css).not.toMatch(/@import\s+["']tailwindcss["']/)
  })

  it('declares every plugin its stylesheets load as a runtime dependency', () => {
    // `styles/index.css` carries `@plugin "tailwindcss-animate"`, and the
    // package declared that plugin under devDependencies. It resolved fine
    // here — the devDependency is installed — and every consumer's very first
    // build died on `Can't resolve 'tailwindcss-animate'`, at the import of
    // styles.css, before anything of theirs was compiled.
    //
    // Nothing in this repository could see it. The docs-app builds inside the
    // repo, so it has the devDependency too. Found by installing the package
    // into a clean app, which is the only place the distinction is observable.
    //
    // `@plugin` and `@import` resolve relative to the file that declares them,
    // so the requirement is this package's, not the consumer's, and a consumer
    // adding the plugin to its own package.json is a workaround for a defect
    // here.
    const runtime = new Set([
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
    ])
    const declared: string[] = []
    for (const file of readdirSync(resolve(ROOT, 'styles'))) {
      const css = read(`styles/${file}`).replace(/\/\*[\s\S]*?\*\//g, '')
      for (const m of css.matchAll(/@(?:plugin|import)\s+["']([^"']+)["']/g)) {
        // Relative paths resolve within the package and need no declaration.
        // "tailwindcss" is the one bare specifier that must NOT be imported
        // here at all, which the test above already covers.
        if (!m[1].startsWith('.') && m[1] !== 'tailwindcss') declared.push(m[1])
      }
    }
    expect(declared.length).toBeGreaterThan(0)
    const missing = declared.filter((d) => !runtime.has(d))
    expect(
      missing,
      `${missing.join(', ')} loaded by a shipped stylesheet but not in dependencies ` +
        'or peerDependencies. A consumer install will fail on it.',
    ).toEqual([])
  })

  it('keeps the non-default spacing base', () => {
    // Tailwind ships 0.25rem. Both apps have shipped 0.2rem for their whole
    // life, and in v4 the spacing scale is dynamic, so reverting would grow
    // every padding, margin, gap, width and height by 25% at once.
    expect(read('styles/index.css')).toMatch(/--spacing:\s*0\.2rem/)
  })
})

describe('client boundaries', () => {
  const clientSources = readdirSync(resolve(ROOT, 'src/ui')).filter((f) =>
    read(`src/ui/${f}`).startsWith('"use client"'),
  )

  it('has client components to check', () => {
    expect(clientSources.length).toBeGreaterThan(10)
  })

  it('preserves "use client" in every built file that had it', () => {
    // This is why the build is tsc and not a bundler: bundlers merge modules,
    // and a directive is only meaningful at the top of one. Losing it produces
    // "You're importing a component that needs useState" in the consumer.
    if (!existsSync(resolve(ROOT, 'dist/ui'))) return
    const lost = clientSources.filter(
      (f) => !read(`dist/ui/${f.replace(/\.tsx$/, '.js')}`).startsWith('"use client"'),
    )
    expect(lost, `directive lost in: ${lost.join(', ')}`).toEqual([])
  })

  it('leaves the barrel server-safe', () => {
    // A directive here would poison Card, Badge, Table and Alert, which are
    // server-renderable, for every consumer importing from the package root.
    if (!existsSync(resolve(ROOT, 'dist/index.js'))) return
    expect(read('dist/index.js').startsWith('"use client"')).toBe(false)
  })
})

describe('dependency shape', () => {
  it('peers only the singletons', () => {
    // Two copies of these break at runtime: React with "invalid hook call",
    // next-themes by making useTheme() inside sonner's Toaster return the
    // default, so toasts render in the wrong theme with no error at all.
    expect(Object.keys(pkg.peerDependencies).sort()).toEqual(
      ['next-themes', 'react', 'react-dom', 'tailwindcss'].sort(),
    )
  })

  it('bundles Radix rather than peering it', () => {
    // Radix contexts live entirely within one component tree, so a duplicate
    // costs a few KB and behaves identically. Peering ~18 packages would make
    // both apps range-match them forever, which is the manual-sync failure
    // this package exists to remove.
    const radix = Object.keys(pkg.dependencies).filter((d) => d.startsWith('@radix-ui/'))
    expect(radix.length).toBeGreaterThan(10)
    expect(Object.keys(pkg.peerDependencies).some((d) => d.startsWith('@radix-ui/'))).toBe(false)
  })

  it('has no prepare script', () => {
    // npm runs `prepare` for git dependencies, turning every cold CI install
    // into a full devDependency install of this repo in a temp dir.
    expect(pkg.scripts.prepare).toBeUndefined()
  })

  it('ships dist, styles and the token source', () => {
    for (const f of ['dist', 'styles', 'design-tokens.json']) {
      expect(pkg.files).toContain(f)
    }
  })
})

describe('every export subpath resolves to a file that exists', () => {
  // `./theme.css` pointed at `styles/theme.css` from the day the map was
  // written. That file has never existed. Nothing caught it: an exports entry
  // is a plain string, no tool validates the target, and the failure only
  // surfaces in a consumer that happens to import that subpath — where it
  // reads as the consumer's bug. Removed in 0.4.0, and this is the guard that
  // stops the next one being added.
  //
  // Wildcard subpaths are checked at their directory, since `./ui/*` maps to a
  // pattern rather than a path. Anything under dist/ is skipped when dist is
  // absent, matching the client-boundary tests above: a fresh clone has not
  // built yet, and failing there would mean `npm test` could not run before
  // `npm run build`.
  const distBuilt = existsSync(resolve(ROOT, 'dist'))

  const targets: [string, string][] = []
  const walk = (subpath: string, entry: unknown) => {
    if (typeof entry === 'string') targets.push([subpath, entry])
    else if (entry && typeof entry === 'object')
      for (const v of Object.values(entry as Record<string, unknown>)) walk(subpath, v)
  }
  for (const [subpath, entry] of Object.entries(pkg.exports)) walk(subpath, entry)

  it('has the full export map to check', () => {
    // If this collapses the loop below is asserting nothing, which is worse
    // than failing.
    expect(targets.length).toBeGreaterThan(15)
  })

  it.each(targets)('%s -> %s exists', (_subpath, target) => {
    const path = target.includes('*') ? target.slice(0, target.indexOf('*')) : target
    if (path.startsWith('./dist/') && !distBuilt) return
    expect(existsSync(resolve(ROOT, path)), `${target} is exported but not on disk`).toBe(true)
  })
})

describe('the documented install resolves this version', () => {
  // This line has gone stale four times: shipped at ^0.1.0 against 0.2.0, at
  // ^0.4.0 against 0.6.0, at ^0.6.0 against 0.8.0, and — an hour after being
  // fixed by hand — at ^0.8.0 against the 0.9.0 released on top of it. A caret
  // range on a 0.x version does not cross a minor, so each of those documented
  // an install that resolves nothing.
  //
  // Four manual fixes is the evidence that it is not a memory problem. The test
  // is the fix; the number is the thing the test checks.
  it('README pins a range that includes package.json version', () => {
    const version = JSON.parse(read('package.json')).version as string
    const ranges = [...read('README.md').matchAll(/#semver:([^"'`\s]+)/g)].map((m) => m[1])
    expect(ranges.length, 'no #semver: range documented in the README').toBeGreaterThan(0)
    for (const range of ranges) {
      expect(
        satisfies(version, range),
        `README documents #semver:${range}, which does not resolve ${version}`,
      ).toBe(true)
    }
  })
})

describe('the agent contract parses', () => {
  // Every file in machine/ is YAML that some agent is expected to LOAD, and
  // until 2026-08-13 nothing here read one. `machine/context.yaml` shipped
  // unparseable: 26 prop types of the form `type: CurvePoint[]` inside a flow
  // mapping, where `[` opens a sequence and the parser dies on the next comma.
  // It was the file README.md lists first and labels "Start here", and the file
  // components.yaml forwards to — so the one document every agent is told to
  // read before writing a component was the one document no agent could load.
  //
  // The tests that existed asserted the file EXISTS and that the README MENTIONS
  // it. Same shape as the phantom `./theme.css` the export-map test above was
  // written for: presence checked, validity not.
  const files = readdirSync(resolve(ROOT, 'machine')).filter((f) => f.endsWith('.yaml'))

  it('finds every machine file', () => {
    expect(files.length).toBeGreaterThanOrEqual(6)
  })

  it.each(files)('machine/%s is valid YAML', (file) => {
    expect(() => load(read(`machine/${file}`))).not.toThrow()
  })

  it('every component the contract claims to export exists in this package', () => {
    // machine/components.yaml documented ten components under `dashboard_chrome`
    // whose `path:` pointed into skene-dashboard — so the package's own contract
    // told an agent to open files the package does not contain. Renamed to
    // `consumer_overlay` on 2026-08-14 with the repo named in the key.
    //
    // The rule this encodes: an `import:` is a promise THIS package keeps, and
    // it must resolve here. A `path:` is a statement about somebody else's repo
    // and is allowed to point outward, but only under a key that says so.
    const doc = load(read('machine/components.yaml')) as Record<string, unknown>
    const imports: string[] = []
    const walk = (node: unknown) => {
      if (Array.isArray(node)) return node.forEach(walk)
      if (!node || typeof node !== 'object') return
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        if (k === 'import' && typeof v === 'string') imports.push(v)
        else walk(v)
      }
    }
    walk(doc)
    expect(imports.length, 'no import: entries found — the walk is broken').toBeGreaterThan(30)

    const missing = imports.filter((spec) => {
      const rel = spec.replace(/^@skene\/design-system\//, '')
      // The contract writes source paths (ui/button.tsx); the export map points
      // at dist. Check the source, which is what a reader would open.
      return !existsSync(resolve(ROOT, 'src', rel))
    })
    expect(missing, 'contract names components this package does not contain').toEqual([])
  })

  it('anything pointing outside the package says whose it is', () => {
    const doc = load(read('machine/components.yaml')) as {
      consumer_overlay?: { repo?: string; components?: Record<string, { path?: string }> }
    }
    const overlay = doc.consumer_overlay
    if (!overlay) return
    expect(overlay.repo, 'consumer_overlay must name the repo it describes').toBeTruthy()
    for (const [name, entry] of Object.entries(overlay.components ?? {})) {
      expect(entry.path, `${name} has no path`).toBeTruthy()
      expect(
        existsSync(resolve(ROOT, 'src', String(entry.path))),
        `${name} is listed as a consumer component but exists here — move it into the contract proper`,
      ).toBe(false)
    }
  })

  it('context.yaml loads as the shape its consumers index into', () => {
    const doc = load(read('machine/context.yaml')) as {
      counts?: { modules?: number }
      modules?: Record<string, { import?: string; useFor?: string }>
    }
    const modules = doc.modules ?? {}
    expect(Object.keys(modules).length).toBe(doc.counts?.modules)
    // A parse that yields a string, or a list, would satisfy `not.toThrow`
    // above and be useless. Assert the two fields an agent actually reads.
    for (const [key, entry] of Object.entries(modules)) {
      expect(entry.import, `${key} has no import`).toBeTruthy()
      expect(entry.useFor, `${key} has no useFor`).toBeTruthy()
    }
  })

  // Both token documents claimed a generator that does not exist in this repo,
  // and neither had been rewritten since arriving from skene-dashboard. The
  // damage was not a stale hex or two: between them they carried 137 of 221
  // tokens, showed every mode-aware token collapsed to its dark value, and
  // omitted `color.chrome.*` in its entirety — the invariant-dark role the
  // README names as the one thing to get right. An agent looking there for it
  // found nothing, with no way to tell "missing from the document" from "not
  // in the system".
  //
  // `npm run tokens:check` is the live gate. This is the coverage half of it,
  // asserting the property rather than the byte equality: the check gate would
  // stay green if the generator itself started dropping a role, because it
  // compares the generator's output to the generator's output.
  // The contracts tell an agent to open specific files — `machine/rules.yaml`
  // goes as far as "trust that file over this one" about the contrast gate's
  // KNOWN_GAPS. Those files were NOT in the tarball: `files` listed neither
  // `scripts` nor `__tests__`, so a consuming agent following the instruction
  // got ENOENT, with nothing to distinguish "the file moved" from "the claim
  // was invented". Shipping them is cheaper than weakening the contracts, and
  // this is the gate that keeps them shipped.
  it('every repo file the contracts tell an agent to open is in the tarball', () => {
    const pointers = [
      'scripts/check-token-contrast.ts',
      '__tests__/roles.test.ts',
      '__tests__/package-contract.test.ts',
      'CHANGELOG.md',
    ]
    const files = JSON.parse(read('package.json')).files as string[]
    for (const pointer of pointers) {
      expect(existsSync(resolve(ROOT, pointer)), `${pointer} does not exist`).toBe(true)
      const top = pointer.split('/')[0]
      expect(
        files.includes(top),
        `package.json "files" omits ${top}, so ${pointer} is cited by the contracts but absent from the package`,
      ).toBe(true)
    }
  })

  // The containment test above passes while the prose beside it names the wrong
  // tag — which it has done five times, most recently INSIDE the sentence
  // claiming the install was verified. Containment is not the claim the prose
  // makes; "resolves vX" is, and it is the one a reader acts on.
  it('the README names the version its documented range actually resolves', () => {
    const version = JSON.parse(read('package.json')).version as string
    const claims = [...read('README.md').matchAll(/resolves `v([0-9][^`]*)`/g)].map((m) => m[1])
    expect(claims.length, 'the README no longer states which version the range resolves').toBe(1)
    expect(
      claims[0],
      `README says the range resolves v${claims[0]}; the package is ${version}`,
    ).toBe(version)
  })

  // The README's usage sample said `tokens.color.brand.peach // "#fec089"` for
  // five releases. That is the DARK value alone; peach is mode-aware, so
  // copying the line put `[object Object]` into a style value — and the
  // paragraph directly beneath it already explained that mode-aware tokens
  // surface as `{light, dark}`. A code sample is a claim about the export, so
  // it is checked against the export.
  it('the README usage sample matches what the package actually exports', () => {
    const source = JSON.parse(read('design-tokens.json')) as Record<string, unknown>
    const readme = read('README.md')
    const samples = [...readme.matchAll(/^tokens\.color\.([^\s]+)\s+\/\/ (.+)$/gm)]
    expect(samples.length, 'the README no longer shows a tokens.color.* sample').toBeGreaterThan(2)

    for (const [, path, comment] of samples) {
      // `surface[0]` in JS is the `"0"` key in the JSON.
      const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.')
      const leaf = keys.reduce<any>((o, k) => o?.[k], source.color)
      expect(leaf, `README documents tokens.color.${path}, which does not exist`).toBeTruthy()
      const actual = leaf.$modes ?? leaf.$value
      // The comment is JS-ish, not JSON: `{ light: "#..", dark: "#.." }`.
      const expected =
        typeof actual === 'object'
          ? `{ ${Object.entries(actual).map(([m, v]) => `${m}: "${v}"`).join(', ')} }`
          : `"${actual}"`
      expect(
        comment.trim(),
        `README says tokens.color.${path} is ${comment.trim()}`,
      ).toBe(expected)
    }
  })

  // `glyph-badge` and `traffic-lights` were extracted in 0.9.x specifically so a
  // consumer could stop keeping local copies, and then were not exported from
  // the root barrel — reachable only at `./sections/*`, which is not where that
  // consumer imports from. It reported the gap rather than hitting a wall, but
  // an export map with a hole in it is the same class of defect as the
  // `./theme.css` entry that pointed at a file which never existed.
  it('every section module is reachable from the root barrel', () => {
    const barrel = read('src/index.ts')
    const modules = readdirSync(resolve(ROOT, 'src/sections'))
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => f.replace(/\.tsx$/, ''))
    expect(modules.length).toBeGreaterThan(40)
    const missing = modules.filter((m) => !barrel.includes(`./sections/${m}.js`))
    expect(
      missing,
      `not exported from src/index.ts: ${missing.join(', ')}`,
    ).toEqual([])
  })

  it('the token documents carry every token in design-tokens.json', () => {
    interface Leaf {
      $value?: unknown
      $modes?: Record<string, string>
    }
    const isLeaf = (x: unknown): x is Leaf =>
      typeof x === 'object' && x !== null && ('$value' in x || '$modes' in x)
    const skip = (k: string) => k.startsWith('$') || k === 'version' || k === 'lastUpdated'

    // Pairs, not paths that get re-resolved afterwards. Resolving a dotted
    // path back through the JSON is wrong here: `spacing.0.5` is one key
    // containing a dot, and splitting it walks into nothing.
    const leaves = (
      node: Record<string, unknown>,
      prefix: string[] = [],
    ): Array<[string, Leaf]> =>
      Object.entries(node).flatMap(([key, value]): Array<[string, Leaf]> => {
        if (prefix.length === 0 && skip(key)) return []
        if (isLeaf(value)) return [[[...prefix, key].join('.'), value]]
        if (typeof value === 'object' && value !== null)
          return leaves(value as Record<string, unknown>, [...prefix, key])
        return []
      })

    const source = JSON.parse(read('design-tokens.json')) as Record<string, unknown>
    const expected = leaves(source)
    expect(expected.length).toBeGreaterThan(200)

    const yaml = load(read('machine/tokens.yaml')) as Record<string, unknown>
    expect(leaves(yaml).map(([p]) => p).sort()).toEqual(expected.map(([p]) => p).sort())

    // The markdown is a table, so the assertion is per row rather than by
    // shape. Mode-aware tokens must show both modes: one collapsed value is
    // what made the old table wrong in a way that reads as right.
    const brand = read('docs/brand.md')
    for (const [path, leaf] of expected) {
      expect(brand, `docs/brand.md omits ${path}`).toContain(`| \`${path}\` |`)
      if (!leaf.$modes) continue
      for (const [mode, value] of Object.entries(leaf.$modes)) {
        expect(brand, `docs/brand.md drops the ${mode} value of ${path}`).toContain(
          `${mode} \`${value}\``,
        )
      }
    }
  })
})

describe('no HTML entities in shipped JSX', () => {
  // `&check;` shipped in skene-site as six literal characters while `&harr;`
  // two rows away rendered correctly. The JSX entity table is a SUBSET of
  // HTML5's and it differs by compiler: this repo's own tsc, given the two as
  // adjacent text children, emits "&check;" undecoded and "\u2194" decoded.
  // Entities in props never decode under any compiler, because a prop is a
  // string literal and nothing parses it as markup.
  //
  // So the rule is not "know which table your bundler ships". It is "write the
  // character" — a literal glyph costs nothing and cannot be wrong. Recorded in
  // machine/rules.yaml under must_not; this is the part that enforces it.
  const files: string[] = []
  const walk = (dir: string) => {
    for (const entry of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
      if (entry.isDirectory()) walk(`${dir}/${entry.name}`)
      else if (/\.tsx$/.test(entry.name)) files.push(`${dir}/${entry.name}`)
    }
  }
  walk('src')

  it('scans every shipped component', () => {
    expect(files.length).toBeGreaterThan(70)
  })

  it.each(files)('%s has no named entity', (file) => {
    const offenders = [...read(file).matchAll(/&[a-zA-Z][a-zA-Z0-9]{1,30};/g)].map((m) => m[0])
    expect(offenders, `write the character instead: ${offenders.join(' ')}`).toEqual([])
  })
})

describe('the agent contract is discoverable', () => {
  // A shipped file nothing points at is a file nothing reads. `machine/` and
  // `docs/` have shipped since 0.1.0 and the README mentioned neither, so the
  // only way an agent found them was by listing the package directory. That is
  // the same class of silent failure as the phantom `./theme.css` above: no
  // error anywhere, and the consequence shows up as somebody rebuilding a
  // component that already exists.
  const readme = read('README.md')

  it('ships the context contract', () => {
    expect(existsSync(resolve(ROOT, 'machine/context.yaml'))).toBe(true)
  })

  it('README points at it, first', () => {
    expect(readme).toMatch(/machine\/context\.yaml/)
    // Before Install: an agent that stops reading after the install snippet
    // still has to have passed it.
    expect(readme.indexOf('machine/context.yaml')).toBeLessThan(readme.indexOf('## Install'))
  })

  it('README names the other three contracts', () => {
    for (const file of ['machine/components.yaml', 'machine/rules.yaml', 'docs/sections.md']) {
      expect(readme, `${file} is shipped but unmentioned`).toMatch(file)
    }
  })

  it('components.yaml forwards to the context file', () => {
    expect(read('machine/components.yaml')).toMatch(/^context: machine\/context\.yaml$/m)
  })
})
