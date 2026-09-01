#!/usr/bin/env node
/**
 * eval — score a page an agent built against the contracts it was given.
 *
 * WHY THIS EXISTS. Everything else in this repository checks the documents
 * against each other: `tokens:check` proves brand.md matches the JSON,
 * `design:check` proves DESIGN.md matches the YAML, `agent-entry-point` proves
 * the counts in the prose are real. All of that is internal consistency. None
 * of it has ever measured the thing the contracts exist for — whether an agent
 * handed them builds a page that is actually on-brand.
 *
 * This does. A case is a brief. A candidate is the `.tsx` an agent wrote from
 * it. The scorer reads the candidate the same way `machine/compositions.yaml`
 * was derived — imports in source order — and applies checks that each encode a
 * defect this package has SHIPPED, not a defect someone imagined. Every check
 * names the contract it comes from, so a failure is a citation rather than an
 * opinion.
 *
 * THE LOOP, which is the point and not the scoring:
 *
 *   1. Run the cases. Read the failures.
 *   2. A failure that the contracts already forbid is a DOCS failure — the
 *      guidance did not reach the agent. Fix the guidance, regenerate.
 *   3. A failure the contracts do NOT forbid is a CONTRACT gap. Decide the
 *      rule, write it into `machine/*.yaml`, and add the check here so it can
 *      never be argued about again.
 *   4. A finding that recurs across cases becomes a deterministic check. A
 *      finding that appears once is recorded, not generalised — the same
 *      standard `compositions.yaml` holds itself to.
 *
 * WHAT THIS DOES NOT DO. It does not render. Contrast on real pixels needs a
 * browser and belongs with `npm run visual`, which already has the pinned
 * container. It does not call a model: candidates are files on disk, so this
 * runs in CI with no key, no cost and no flake. Generating candidates from a
 * brief is the half that needs an agent, and `--candidates` takes a directory
 * so that harness can drop its output here without this file changing.
 *
 *   node scripts/eval.mjs [--case <name>] [--candidates <dir>] [--json]
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import yaml from 'js-yaml'

const root = resolve(import.meta.dirname, '..')
const readYaml = (p) => yaml.load(readFileSync(resolve(root, p), 'utf8'))

const context = readYaml('machine/context.yaml')
const components = readYaml('machine/components.yaml')
const compositions = readYaml('machine/compositions.yaml')
const layouts = readYaml('machine/layouts.yaml')
const rules = readYaml('machine/rules.yaml')

const modules = context.modules

/**
 * components.yaml keys on the component name and carries the module path in its
 * `import` field, with a `.tsx` context.yaml does not have. Same join the
 * generator makes — it is where the enum values for a prop live.
 */
const constraintsByModule = new Map()
for (const group of ['primitives', 'patterns', 'sections']) {
  for (const [name, entry] of Object.entries(components[group] ?? {})) {
    const imp = entry?.import
    if (typeof imp !== 'string') continue
    const id = imp.replace(/^@skene\/design-system\//, '').replace(/\.tsx$/, '')
    if (modules[id]) constraintsByModule.set(id, { name, entry })
  }
}

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? null : args[i + 1]
}
const asJson = args.includes('--json')
/**
 * Measure mode: report, do not enforce. The `bad-*` naming convention is a
 * property of the committed FIXTURES, which assert the scorer. A generated
 * candidate carries no such claim, and its failures are the finding — exiting
 * non-zero on them would turn a result about the model into a red build.
 */
const measure = args.includes('--measure')
const onlyCase = flag('case')
const candidatesDir = flag('candidates') ?? 'evals/candidates'

// ------------------------------------------------------------------ parsing

/**
 * Imports from this package, in source order.
 *
 * Source order is what `compositions.yaml` was derived from — it tracks render
 * order closely and is not the DOM, and the corpus header says so. Using the
 * same reading here means a candidate is measured against the recipe the same
 * way the recipe was measured out of real routes.
 */
function importsOf(src) {
  const out = []
  const re = /import\s+(?:type\s+)?(?:\{([^}]*)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g
  for (const [, named, dflt, from] of src.matchAll(re)) {
    const names = named
      ? named
          .split(',')
          .map((n) => n.trim().split(/\s+as\s+/)[0].trim())
          .filter(Boolean)
      : [dflt]
    out.push({ from, names })
  }
  return out
}

const PKG = '@skene/design-system'
const moduleIdOf = (from) =>
  from.startsWith(`${PKG}/`) ? from.slice(PKG.length + 1).replace(/\.tsx?$/, '') : null

/** Every className string in the file, including template literals. */
function classNames(src) {
  const out = []
  for (const [, v] of src.matchAll(/class(?:Name)?=\{?["'`]([\s\S]*?)["'`]\}?/g)) out.push(v)
  for (const [, v] of src.matchAll(/\bcn\(([\s\S]*?)\)/g)) out.push(v)
  return out
}

/**
 * JSX elements with their attribute names, scanned rather than regexed.
 *
 * A regex cannot do this: `columns={[{ header: 'Field' }]}` nests braces and
 * quotes inside one attribute, so matching to the next `>` truncates the tag
 * mid-value and invents attributes out of the remainder. This walks the tag
 * tracking depth and records identifiers followed by `=` at depth zero.
 */
export function jsxElements(src) {
  const out = []
  const re = /<([A-Z][\w.]*)/g
  let m
  while ((m = re.exec(src))) {
    const name = m[1]
    let i = re.lastIndex
    let depth = 0
    let quote = null
    const attrs = []
    let word = ''
    for (; i < src.length; i += 1) {
      const c = src[i]
      if (quote) {
        if (c === quote) quote = null
        continue
      }
      if (c === '"' || c === "'" || c === '`') { quote = c; continue }
      if (c === '{' || c === '[' || c === '(') { depth += 1; continue }
      if (c === '}' || c === ']' || c === ')') { depth -= 1; continue }
      if (depth > 0) continue
      if (c === '>') break
      if (/[\w-]/.test(c)) { word += c; continue }
      if (c === '=' && word) { attrs.push(word); word = ''; continue }
      word = ''
    }
    out.push({ name, attrs, at: m.index })
  }
  return out
}

/** JSX element names in the order they first appear in the body. */
function usageOrder(src, names) {
  const body = src.slice(src.lastIndexOf('import') === -1 ? 0 : src.indexOf('\n', src.lastIndexOf('from')))
  return names
    .map((n) => ({ name: n, at: body.indexOf(`<${n}`) }))
    .filter((x) => x.at !== -1)
    .sort((a, b) => a.at - b.at)
    .map((x) => x.name)
}

// ------------------------------------------------------------------- checks
//
// Each returns { id, cites, status: 'pass'|'fail'|'skip', detail }.
// `cites` is the contract the rule comes from. A check with no citation is an
// opinion and does not belong here.

/** module id -> the module entry, for every package import in the candidate. */
function usedModules(src) {
  const seen = new Map()
  for (const { from, names } of importsOf(src)) {
    const id = moduleIdOf(from)
    if (id) seen.set(id, names)
  }
  return seen
}

function checkLoadBearing(src, kase) {
  const spec = compositions.archetypes[kase.archetype]
  const required = spec?.load_bearing ?? []
  if (!required.length) {
    return {
      id: 'load_bearing',
      cites: `compositions.yaml archetypes.${kase.archetype}`,
      status: 'skip',
      detail: `${kase.archetype} has an empty load_bearing — too few routes to intersect, so there is nothing every page of this kind must carry.`,
    }
  }
  const used = usedModules(src)
  const missing = required.filter((id) => !used.has(id))
  return {
    id: 'load_bearing',
    cites: `compositions.yaml archetypes.${kase.archetype}.load_bearing`,
    status: missing.length ? 'fail' : 'pass',
    detail: missing.length
      ? `missing ${missing.join(', ')} — in EVERY route of this archetype. Without it the page is a different shape.`
      : `carries all of ${required.join(', ')}.`,
  }
}

function checkModulesExist(src) {
  const unknown = [...usedModules(src).keys()].filter(
    (id) => !modules[id] && !['tokens', 'utils', 'styles.css'].includes(id),
  )
  return {
    id: 'module_exists',
    cites: 'context.yaml modules',
    status: unknown.length ? 'fail' : 'pass',
    detail: unknown.length
      ? `imports ${unknown.join(', ')}, which this package does not export. An invented module is the failure the 89-module index exists to prevent.`
      : 'every package import resolves to a real module.',
  }
}

function checkNotFor(src) {
  const used = usedModules(src)
  const hits = []
  for (const [id, names] of used) {
    for (const edge of modules[id]?.notFor ?? []) {
      // The edge names an EXPORT of the better module. Only a real collision
      // counts: the candidate uses this module and not the one pointed at.
      const better = [...used.keys()].some((other) =>
        (modules[other]?.exports ?? []).includes(edge.instead),
      )
      if (!better && names.some((n) => (modules[id]?.exports ?? []).includes(n))) {
        hits.push({ id, instead: edge.instead, why: edge.why })
      }
    }
  }
  return {
    id: 'not_for',
    cites: 'context.yaml notFor',
    status: 'skip',
    detail: hits.length
      ? `${hits.length} notFor edge(s) touch the modules used. These are advisory here — an edge fires on intent, which source cannot see. Review: ${hits
          .slice(0, 3)
          .map((h) => `${h.id} → ${h.instead}`)
          .join('; ')}`
      : 'no notFor edge touches the modules used.',
  }
}

/**
 * The 1.08:1 defect, made checkable.
 *
 * A module whose polarity is `inherits` puts no theme class on its own root. On
 * a light fill it resolves mode-aware tokens to their DARK values, which has
 * shipped text at 1.08:1. So: if the candidate paints a light ground anywhere,
 * something in that subtree has to carry `light`.
 */
function checkPolarity(src) {
  // Tokenised, not substring-matched. `\blight\b` matches INSIDE
  // `bg-brand-light` — the very utility that paints the light ground — so the
  // first cut of this check reported the defect as its own fix and passed the
  // fixture built to fail it.
  const tokens = classNames(src).flatMap((c) => c.split(/[\s,]+/).filter(Boolean))
  const LIGHT_GROUNDS = ['bg-brand-light', 'bg-brand-cream', 'bg-white', 'bg-surface-cream']
  const paintsLight = tokens.some((t) => LIGHT_GROUNDS.includes(t))
  const declaresLight = tokens.includes('light')
  const inherits = [...usedModules(src).keys()].filter((id) => modules[id]?.polarity === 'inherits')
  if (!paintsLight) {
    return {
      id: 'polarity',
      cites: 'rules.yaml wrap_dark_subtrees_in_dark_class; context.yaml polarity',
      status: 'skip',
      detail: 'paints no light ground, so nothing is owed the `light` class.',
    }
  }
  return {
    id: 'polarity',
    cites: 'rules.yaml wrap_dark_subtrees_in_dark_class; context.yaml polarity',
    status: declaresLight ? 'pass' : 'fail',
    detail: declaresLight
      ? 'paints a light ground and carries the `light` class.'
      : `paints a light ground with no \`light\` class in scope. ${
          inherits.length
            ? `${inherits.join(', ')} ${inherits.length === 1 ? 'is' : 'are'} polarity \`inherits\` and will resolve dark tokens onto it.`
            : ''
        } This is how text shipped at 1.08:1.`,
  }
}

function checkArbitraryHex(src) {
  const hits = classNames(src)
    .flatMap((c) => [...c.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]))
    .filter((v, i, a) => a.indexOf(v) === i)
  return {
    id: 'arbitrary_hex',
    cites: 'rules.yaml must_not.arbitrary_hex_in_classnames',
    status: hits.length ? 'fail' : 'pass',
    detail: hits.length
      ? `literal ${hits.join(', ')} in a class string. Use the token; a hex here does not invert and does not move when the palette does.`
      : 'no literal hex in any class string.',
  }
}

/**
 * `chrome.*` is invariant and always dark. On a surface that flips it is
 * correct in dark and wrong in light, which is why the wrong pick looks right
 * until someone opens light mode.
 */
function checkChrome(src) {
  const chrome = classNames(src)
    .flatMap((c) => [...c.matchAll(/\b(?:bg|text|border)-chrome-[\w-]+/g)].map((m) => m[0]))
    .filter((v, i, a) => a.indexOf(v) === i)
  if (!chrome.length) {
    return {
      id: 'chrome_role',
      cites: 'rules.yaml surface_roles.chrome',
      status: 'skip',
      detail: 'uses no chrome.* utility.',
    }
  }
  const fixedDark = /\b(dark|chrome)\b/.test(src) && /class(?:Name)?=\{?["'`][^"'`]*\bdark\b/.test(src)
  return {
    id: 'chrome_role',
    cites: 'rules.yaml surface_roles.chrome',
    status: fixedDark ? 'pass' : 'fail',
    detail: fixedDark
      ? `${chrome.join(', ')} inside a subtree marked dark — a fixed-dark surface, which is what chrome.* is for.`
      : `${chrome.join(', ')} on a surface that follows the theme. chrome.* cannot invert; use the theme-aware text-*/surface-* instead, or mark the subtree dark if it is genuinely a terminal or a log panel.`,
  }
}

/** "a page declares no ground, ever — it is a function of band index". */
function checkDeclaresGround(src) {
  const ga = layouts.marketing.ground_alternation
  const grounds = classNames(src)
    .flatMap((c) => [...c.matchAll(/\bbg-surface-deep(?:-2)?\b/g)].map((m) => m[0]))
  return {
    id: 'page_declares_ground',
    cites: 'layouts.yaml marketing.ground_alternation',
    status: grounds.length ? 'fail' : 'pass',
    detail: grounds.length
      ? `${grounds.length} band(s) paint their own ground (${[...new Set(grounds)].join(', ')}). ${prose(ga.rule)}. A page that sets ground per band has re-invented per-page grounds, which is the failure the alternation was written to end.`
      : 'declares no ground; the alternation is left to band position.',
  }
}

/** "tall_when: once per page — the page's signature band". */
function checkRhythm(src) {
  const r = layouts.marketing.rhythm
  // Match the responsive half, not the base. `py-[128px]` is ALSO the `md:`
  // step of the DEFAULT rhythm (`py-[96px] md:py-[128px]`), so counting the
  // base utility reported two tall bands on a page that had none.
  const tallMarker = r.tall.split(/\s+/).find((u) => u.startsWith('md:')) ?? r.tall
  const tall = (src.match(new RegExp(escapeRe(tallMarker), 'g')) ?? []).length
  return {
    id: 'rhythm_tall_once',
    cites: 'layouts.yaml marketing.rhythm.tall_when',
    status: tall > 1 ? 'fail' : 'pass',
    detail:
      tall > 1
        ? `${tall} bands use the tall rhythm (\`${r.tall}\`). It is once per page — the signature band. More than one and there is no signature.`
        : `${tall} tall band.`,
  }
}

/** `render_marketing_cards_as_feature_row` is in rules.must, not advice. */
function checkMarketingCard(src) {
  const used = usedModules(src)
  const usesCard = used.has('ui/card')
  const usesFeatureRow = used.has('sections/feature-row')
  const gridded = /\bgrid-cols-[23]\b/.test(src)
  if (!usesCard || !gridded) {
    return {
      id: 'marketing_card',
      cites: 'rules.yaml must.render_marketing_cards_as_feature_row',
      status: 'skip',
      detail: 'no Card in a marketing grid.',
    }
  }
  return {
    id: 'marketing_card',
    cites: 'rules.yaml must.render_marketing_cards_as_feature_row',
    status: usesFeatureRow ? 'pass' : 'fail',
    detail: usesFeatureRow
      ? 'uses FeatureRow for the marketing cards.'
      : 'Card in a 2- or 3-up marketing grid. FeatureRow is what a marketing card is; Card in a grid gains a 600px floor per cell.',
  }
}

/** "import_primitives_from_the_package_not_a_local_copy". */
function checkLocalCopy(src) {
  const local = importsOf(src)
    .map((i) => i.from)
    .filter((f) => /^[./]/.test(f) && /\/(ui|components)\//.test(f))
  return {
    id: 'local_copy',
    cites: 'rules.yaml must.import_primitives_from_the_package_not_a_local_copy',
    status: local.length ? 'fail' : 'pass',
    detail: local.length
      ? `imports ${local.join(', ')} locally. A copied primitive stops moving when the package does.`
      : 'every primitive comes from the package.',
  }
}

/** Content is props: no section hardcodes copy — the page supplies it. */
function checkContentIsProps(src) {
  const spec = compositions.archetypes
  void spec
  return {
    id: 'content_is_props',
    cites: 'rules.yaml; layouts.yaml marketing.page_shape',
    status: 'skip',
    detail:
      'not machine-checkable from one file — a page SUPPLYING copy and a section HARDCODING it look identical here. Belongs to review, or to a check inside the package rather than over a candidate.',
  }
}


/**
 * Does the candidate call components that exist, with props they take?
 *
 * The gap this closes was found by building a page by hand and then probing
 * the scorer with a deliberately broken one: `kind="purple"` on a required
 * enum, invented `spin`/`elevation` props, and `KeyValueRow` — a TYPE — used
 * as a component. It scored 6/6, identical to the correct page, because every
 * other check reads imports and class strings. All ten committed fixtures
 * turned out to call APIs that do not exist, and nothing noticed.
 */
function checkProps(src) {
  const used = usedModules(src)
  const byExport = new Map()
  const typeOnly = new Map()
  const allowedValues = new Map()
  for (const [id] of used) {
    const m = modules[id]
    if (!m) continue
    for (const e of m.exports ?? []) byExport.set(e, id)
    for (const t of Object.keys(m.types ?? {})) if (!byExport.has(t)) typeOnly.set(t, id)
  }
  // Enum values live in components.yaml, keyed `Export.prop`.
  for (const [id] of used) {
    const entry = constraintsByModule.get(id)?.entry
    for (const [k, v] of Object.entries(entry?.props ?? {})) {
      if (Array.isArray(v)) allowedValues.set(k, v)
    }
  }

  const FREE = new Set(['className', 'key', 'style', 'children', 'ref', 'id'])
  const problems = []

  for (const el of jsxElements(src)) {
    const moduleId = byExport.get(el.name)
    if (!moduleId) {
      if (typeOnly.has(el.name)) {
        problems.push(
          `\`<${el.name}>\` is a TYPE in ${typeOnly.get(el.name)}, not a component — it describes the shape of a value you pass to an export, and cannot be rendered.`,
        )
      }
      // A name imported from nowhere in the package is either local or an
      // invented module, and `module_exists` already owns that case.
      continue
    }
    const spec = modules[moduleId]?.props?.[el.name]
    if (!spec) continue

    const known = new Set(Object.keys(spec))
    const passthrough = Boolean(modules[moduleId]?.accepts?.[el.name])
    for (const a of el.attrs) {
      if (FREE.has(a) || /^(data|aria)-/.test(a)) continue
      if (known.has(a)) continue
      if (passthrough) continue
      problems.push(`\`${el.name}\` takes no prop \`${a}\` (${moduleId}).`)
    }
    for (const [prop, p] of Object.entries(spec)) {
      const required = typeof p === 'object' && p !== null && p.required
      if (required && prop !== 'children' && !el.attrs.includes(prop)) {
        problems.push(`\`${el.name}\` is missing required prop \`${prop}\` (${moduleId}).`)
      }
    }
    for (const a of el.attrs) {
      const allowed = allowedValues.get(`${el.name}.${a}`)
      if (!allowed) continue
      const m = new RegExp(`\\b${a}=["']([^"']*)["']`).exec(src.slice(el.at))
      if (m && !allowed.includes(m[1])) {
        problems.push(
          `\`${el.name}.${a}="${m[1]}"\` is not one of ${allowed.map((v) => `\`${v}\``).join(', ')}.`,
        )
      }
    }
  }

  return {
    id: 'props_exist',
    cites: 'context.yaml exports/props/types; components.yaml props',
    status: problems.length ? 'fail' : 'pass',
    detail: problems.length ? problems.slice(0, 6).join(' ') : 'every component and prop is one the module declares.',
  }
}

const CHECKS = [
  checkLoadBearing,
  checkModulesExist,
  checkProps,
  checkPolarity,
  checkArbitraryHex,
  checkChrome,
  checkDeclaresGround,
  checkRhythm,
  checkMarketingCard,
  checkLocalCopy,
  checkNotFor,
  checkContentIsProps,
]

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const prose = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()

// --------------------------------------------------------------------- run

function scoreCandidate(src, kase) {
  const results = CHECKS.map((fn) => fn(src, kase))
  const scored = results.filter((r) => r.status !== 'skip')
  return {
    results,
    passed: scored.filter((r) => r.status === 'pass').length,
    failed: scored.filter((r) => r.status === 'fail').length,
    scored: scored.length,
  }
}

export function run({ caseFilter = null, dir = 'evals/candidates' } = {}) {
  const casesDir = resolve(root, 'evals/cases')
  const cases = readdirSync(casesDir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => ({ name: basename(f, '.yaml'), ...yaml.load(readFileSync(join(casesDir, f), 'utf8')) }))
    .filter((c) => !caseFilter || c.name === caseFilter)

  const report = []
  for (const kase of cases) {
    const candDir = resolve(root, dir, kase.name)
    if (!existsSync(candDir)) {
      report.push({ case: kase.name, candidates: [], note: 'no candidates' })
      continue
    }
    const candidates = readdirSync(candDir)
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => {
        const src = readFileSync(join(candDir, f), 'utf8')
        return { label: basename(f, '.tsx'), ...scoreCandidate(src, kase) }
      })
    report.push({ case: kase.name, archetype: kase.archetype, brief: kase.brief, candidates })
  }
  return report
}

function main() {
  const report = run({ caseFilter: onlyCase, dir: candidatesDir })
  if (asJson) {
    console.log(JSON.stringify(report, null, 2))
    return
  }

  let anyUnexpected = false
  for (const entry of report) {
    console.log(`\n\x1b[1m${entry.case}\x1b[0m — ${entry.archetype ?? '?'}`)
    if (!entry.candidates.length) {
      console.log('  no candidates')
      continue
    }
    for (const c of entry.candidates) {
      // A fixture named `bad-*` is SUPPOSED to fail. The loop is only honest if
      // the scorer is known to catch what it claims to, so the fixtures assert
      // the scorer rather than the design system.
      const expectFail = !measure && c.label.startsWith('bad-')
      const ok = measure ? true : expectFail ? c.failed > 0 : c.failed === 0
      if (!ok) anyUnexpected = true
      const mark = ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'
      const mk = measure ? (c.failed ? '\x1b[31m✗\x1b[0m' : '\x1b[32m✓\x1b[0m') : mark
      console.log(`  ${mk} ${c.label}  ${c.passed}/${c.scored} checks pass${
        expectFail ? `  (fixture, expected to fail)` : ''
      }`)
      for (const r of c.results) {
        if (r.status === 'pass') continue
        const tag = r.status === 'fail' ? '\x1b[31mFAIL\x1b[0m' : '\x1b[90mskip\x1b[0m'
        console.log(`      ${tag} ${r.id}  [${r.cites}]`)
        if (r.status === 'fail') console.log(`           ${r.detail}`)
      }
    }
  }
  console.log()
  if (anyUnexpected) {
    console.error('a candidate scored differently than its name claims. See evals/README.md.')
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main()
