#!/usr/bin/env node
/**
 * Emit DESIGN.md and the per-module / per-page-template files under `design/`.
 *
 * WHY THIS EXISTS. The seven `machine/*.yaml` contracts are the authority and
 * they stay the authority — nothing here is authored. But they assume a reader
 * with the package on disk and a budget to open seven files. An agent that has
 * a URL and a context window has neither, and the package is published
 * restricted, so an agent outside a consumer repo can reach none of it. This
 * emits the same facts as Markdown, split so that ONE fetch answers one
 * question:
 *
 *   DESIGN.md                    the system: scales, rules, floors, the spine,
 *                                and the index of everything below.
 *   design/tokens.md             every token value, with the note recording
 *                                which light values were computed rather than
 *                                drawn. Split out because inlined it was the
 *                                largest thing in DESIGN.md, and it is wanted
 *                                only when picking a value — not when working
 *                                out which module to reach for.
 *   design/pages/<archetype>.md  a page template: section order, what is
 *                                load-bearing, the band grammar, the evidence.
 *   design/<ns>/<slug>.md        one module: what it is for, its props, what
 *                                it is NOT for, and what you must not do.
 *
 * Each emitted file repeats the non-negotiables and the polarity rule rather
 * than linking to them. That duplication is deliberate: the failure mode this
 * package keeps shipping is a light surface without the `light` class (text at
 * 1.08:1) and a `chrome.*` token on a surface that flips, and both are made by
 * an agent that read one file and never followed a link out of it.
 *
 * THE SOURCES, and which fact each one owns:
 *   design-tokens.json        token values
 *   machine/context.yaml      which module to reach for; props, polarity, seen
 *   machine/components.yaml   what you must not do with the one you picked
 *   machine/compositions.yaml page archetypes, the spine, route evidence
 *   machine/layouts.yaml      the scales, and the marketing band grammar
 *   machine/rules.yaml        must / must_not / ask_first_when / surface roles
 *   machine/accessibility.yaml contrast floors and theming classes
 *
 * `--check` re-emits and diffs without writing, so CI fails on a contract edit
 * that was not followed by `npm run design`. Same idiom as
 * generate-token-docs.mjs, and for the same reason: a document that says it is
 * generated is a document nobody re-reads.
 *
 *   node scripts/generate-design-md.mjs [--check]
 */

import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import yaml from 'js-yaml'

const root = resolve(import.meta.dirname, '..')
const check = process.argv.includes('--check')

const readYaml = (p) => yaml.load(readFileSync(resolve(root, p), 'utf8'))
const tokens = JSON.parse(readFileSync(resolve(root, 'design-tokens.json'), 'utf8'))
const context = readYaml('machine/context.yaml')
const components = readYaml('machine/components.yaml')
const compositions = readYaml('machine/compositions.yaml')
const layouts = readYaml('machine/layouts.yaml')
const rules = readYaml('machine/rules.yaml')
const a11y = readYaml('machine/accessibility.yaml')

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))

// ---------------------------------------------------------------- formatting

/**
 * The contracts are YAML, so their prose is plain text: a `|` in a description
 * would end a table cell, and a bare `<section>` would render as an element and
 * vanish. Tags already inside backticks are left alone.
 */
const prose = (s) => {
  // Split on code spans and rewrite only what is OUTSIDE them. Doing it with a
  // lookaround instead put backticks INSIDE a span — `design/<module>.md`
  // came out as `design/`<module>`.md`, which renders as broken code with a
  // stray tag. Anything already in backticks is by definition already safe.
  const parts = String(s ?? '')
    .replace(/\r?\n+/g, ' ')
    .split(/(`[^`]*`)/)
  return parts
    .map((part, i) =>
      i % 2
        ? part
        : part
            .replace(/<(\/?[a-zA-Z][a-zA-Z0-9-]*)>/g, '`<$1>`')
            // `__tests__/roles.test.ts` unbackticked is a pair of emphasis markers.
            .replace(/(__tests__\/[\w./-]+)/g, '`$1`'),
    )
    .join('')
    .trim()
}

/** As `prose`, plus the pipe escape a table cell needs and prose does not. */
const cell = (s) =>
  prose(s)
    // Some contract prose pre-escapes its pipes (`Dimension \| Skene`), so
    // normalise before escaping or the doc renders a literal backslash.
    .replace(/\\\|/g, '|')
    .replace(/\|/g, '\\|')

const code = (s) => '`' + String(s) + '`'
const list = (xs) => xs.map((x) => `- ${x}`).join('\n')
const codeList = (xs) => xs.map(code).join(', ')

/**
 * The lead sentence of a `useFor`, for index tables. The whole paragraph is the
 * module page's job; repeating it in a list of thirteen candidates the file
 * explicitly says are "not a recommendation" was a third of a page template.
 */
const firstSentence = (s) => {
  const t = cell(s ?? '—')
  const cut = t.search(/\.(\s|$)/)
  const one = cut === -1 ? t : t.slice(0, cut + 1)
  return one.length > 150 ? one.slice(0, 147).trimEnd() + '…' : one
}

/** A section only when it has something in it — no empty headings. */
function section(heading, body) {
  const text = Array.isArray(body) ? body.filter(Boolean).join('\n\n') : body
  if (!text || !String(text).trim()) return null
  return `## ${heading}\n\n${String(text).trim()}`
}

function table(headers, rows) {
  if (!rows.length) return null
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.map(cell).join(' | ')} |`),
  ].join('\n')
}

const doc = (parts) => parts.filter(Boolean).join('\n\n') + '\n'

const banner = (sources) =>
  [
    '<!-- @design:generated -->',
    '',
    `_Generated by \`scripts/generate-design-md.mjs\` from ${sources.map(code).join(', ')}._`,
    '_Do not edit. Change the source and run `npm run design`; `npm run design:check` fails the build if this file is stale._',
    `_@skene/design-system ${pkg.version}._`,
  ].join('\n')

// ------------------------------------------------------------------- indexes

const modules = context.modules
const moduleIds = Object.keys(modules)

/** `sections/artifact-shell` -> `design/sections/artifact-shell.md`. */
const modulePath = (id) => `design/${id}.md`

/**
 * components.yaml keys on the component name and carries the module path in
 * its `import` field, with a `.tsx` context.yaml does not have. Join on that.
 */
const constraintsByModule = new Map()
for (const group of ['primitives', 'patterns', 'sections']) {
  for (const [name, entry] of Object.entries(components[group] ?? {})) {
    const imp = entry?.import
    if (typeof imp !== 'string') continue
    const id = imp.replace(/^@skene\/design-system\//, '').replace(/\.tsx$/, '')
    if (!modules[id]) continue
    constraintsByModule.set(id, { name, group, entry })
  }
}

/** module -> the page archetypes that carry it, and how load-bearing it is. */
const usedBy = new Map()
for (const [archetype, spec] of Object.entries(compositions.archetypes)) {
  for (const id of spec.load_bearing ?? []) {
    if (!usedBy.has(id)) usedBy.set(id, [])
    usedBy.get(id).push({ archetype, role: 'load-bearing', of: spec.instances })
  }
  for (const opt of spec.optional ?? []) {
    if (!usedBy.has(opt.module)) usedBy.set(opt.module, [])
    usedBy.get(opt.module).push({ archetype, role: `optional, in ${opt.in} of ${opt.of}` })
  }
  // An archetype derived from too few routes to intersect lists `observed`
  // instead of `optional` — a flat record of what was there, explicitly not
  // generalised. Dropping it loses the home page, the densest route in the
  // corpus and the only recorded evidence for five modules.
  for (const id of spec.observed ?? []) {
    if (!usedBy.has(id)) usedBy.set(id, [])
    usedBy.get(id).push({
      archetype,
      role: `observed on ${spec.instances} route${spec.instances === 1 ? '' : 's'}`,
    })
  }
}

const intentIndex = new Map()
for (const [id, m] of Object.entries(modules)) {
  for (const tag of m.intent ?? []) {
    if (!intentIndex.has(tag)) intentIndex.set(tag, [])
    intentIndex.get(tag).push(id)
  }
}

const unproven = moduleIds.filter((id) => (modules[id].seen ?? []).length === 0)

/**
 * The adjudicated duplicate clusters, read out of inventory.json rather than
 * quoted. This file cited the registry from the start, because the prose around
 * it said "twenty measured clusters" in seven places with nothing behind it —
 * while README said "the ten resolved design decisions" two rows above saying
 * twenty. Those seven were corrected on 2026-09-01 and are now gated by
 * `agent-entry-point.test.ts`; deriving it here stays the reason this file
 * never had to be one of them.
 */
const decisions = (
  JSON.parse(readFileSync(resolve(root, 'docs-app/app/decisions/inventory.json'), 'utf8'))
    .decisions ?? []
)
const resolvedDecisions = decisions.filter((d) => d.status === 'resolved').length

// ------------------------------------------------- blocks repeated per-file

/**
 * The three rules that have actually shipped defects, restated in full in
 * every emitted file. See the header for why this is not a link.
 */
const NON_NEGOTIABLES = `## Rules that are not negotiable

1. **\`chrome.*\` is invariant and cannot invert.** \`color.chrome.surface.*\` and
   \`color.chrome.text.*\` are always dark. Use them only on a surface that never
   flips — a terminal, a log panel, a code frame. Anything on a surface that
   flips uses the theme-aware \`color.text.*\` / \`color.surface.*\`. The two share
   their dark values and diverge only in light, so the wrong pick looks correct
   until someone opens light mode.
2. **A light surface on a dark page needs the \`light\` class on its own root.**
   Without it the mode-aware tokens resolve to their dark values against a light
   fill. That has shipped text at 1.08:1. Check the module's \`polarity\` first —
   \`applies-light\` means the module already does this for you.
3. **Content is props.** No section hardcodes copy.

Theming is ${a11y.theming.mode.replace(/_/g, '-')} and the package ships base mode \`${a11y.theming.base_mode_shipped}\`. Contrast floors: body text ${a11y.contrast.floors.body_text}:1, large text ${a11y.contrast.floors.large_text}:1 (${a11y.contrast.standard}).`

const REACH_LADDER = `## Reach in this order

${rules.priority_order
  // The paths end in `*`, which markdown reads as emphasis across list items.
  .map((p) => p.replace(/(@skene\/design-system\/[\w/*.-]+)/g, '`$1`'))
  .map((p, i) => `${i + 1}. ${p}`)
  .join('\n')}

Ask first when: ${rules.ask_first_when.map((r) => code(r)).join(', ')}.`

// ------------------------------------------------------------ module pages

/**
 * `ArtFrame.kind` is typed `ArtFrameKind`, which is required, and whose three
 * legal values used to appear only under Constraints eighty lines below — the
 * Props table named a type it never defined. An agent reading top-down met a
 * required prop with an opaque type and no values, on the one prop whose own
 * documentation says picking wrong "is not a styling slip, it is a miscue".
 * components.yaml has the values; this puts them where the prop is read.
 */
function allowedValuesFor(id) {
  const entry = constraintsByModule.get(id)?.entry
  const out = new Map()
  for (const [key, allowed] of Object.entries(entry?.props ?? {})) {
    if (Array.isArray(allowed)) out.set(key, allowed)
  }
  return out
}

function propsTable(props, id) {
  const allowed = allowedValuesFor(id)
  const rows = []
  for (const [exportName, fields] of Object.entries(props ?? {})) {
    for (const [prop, spec] of Object.entries(fields ?? {})) {
      const s = typeof spec === 'object' && spec !== null ? spec : { type: spec }
      const values = allowed.get(`${exportName}.${prop}`)
      rows.push([
        code(exportName),
        code(prop),
        // Raw pipe: `cell` escapes it for the table, and escaping here too
        // emitted `\\|` into the rendered doc.
        values ? values.map((v) => `'${v}'`).join(' | ') : code(s.type ?? '—'),
        s.required ? '**yes**' : '',
        s.default !== undefined ? code(s.default) : '',
      ])
    }
  }
  return table(['export', 'prop', 'type / allowed', 'required', 'default'], rows)
}

function constraintBlock(id) {
  const found = constraintsByModule.get(id)
  if (!found) return null
  const { name, entry } = found
  const parts = []
  if (entry.variants) parts.push(`**Variants** — ${codeList(entry.variants)}`)
  if (entry.sizes) parts.push(`**Sizes** — ${codeList(entry.sizes)}`)
  if (entry.props) {
    const rows = Object.entries(entry.props).map(([k, v]) => [
      code(k),
      Array.isArray(v) ? codeList(v) : cell(v),
    ])
    parts.push(table(['prop', 'allowed'], rows))
  }
  if (entry.rules) parts.push(list(entry.rules.map(prose)))
  if (!parts.length) return null
  return section(
    'Constraints',
    [`From \`machine/components.yaml\` (\`${found.group}.${name}\`).`, ...parts].join('\n\n'),
  )
}

function moduleDoc(id) {
  const m = modules[id]
  const facts = [
    ['import', code(m.import)],
    ['polarity', m.polarity ? code(m.polarity) : '—'],
    ['boundary', m.client ? '`"use client"` — client component' : 'server-renderable'],
    ['intent', (m.intent ?? []).map(code).join(', ') || '—'],
  ]

  const seen = m.seen ?? []
  const seenBlock = seen.length
    ? section(
        'Rendered in',
        `Gallery cases with a committed light and dark baseline: ${codeList(seen)}.`,
      )
    : section(
        'Rendered in',
        `**Nothing in this repository has ever rendered this module.** Its \`seen\` list is
empty, so every claim on this page is unproven — there is no baseline behind it.
Treat the props and the polarity as documentation of intent, not of behaviour.`,
      )

  const users = usedBy.get(id) ?? []

  return doc([
    `# ${id}`,
    banner(['machine/context.yaml', 'machine/components.yaml', 'machine/compositions.yaml']),
    table(['', ''], facts),
    section('Use for', m.useFor),
    section('Exports', codeList(m.exports ?? [])),
    section('Props', propsTable(m.props, id)),
    m.types
      ? section(
          'Types — not components',
          [
            `These are TypeScript types, not exports you can render. \`<${
              Object.keys(m.types)[0]
            } />\` is not a component; the type describes the shape of a value you pass to one of the exports above. The name usually reads like a component, which is why this heading says so.`,
            table(
              ['type', 'shape'],
              Object.entries(m.types).map(([t, shape]) => [
                code(t),
                typeof shape === 'object' ? Object.keys(shape).map(code).join(', ') : cell(shape),
              ]),
            ),
          ].join('\n\n'),
        )
      : null,
    m.accepts
      ? section(
          'Accepts',
          table(
            ['export', 'props passed through'],
            Object.entries(m.accepts).map(([k, v]) => [code(k), code(v)]),
          ),
        )
      : null,
    (m.alsoFor ?? []).length
      ? section(
          'Also for',
          [
            'Every claim cites the prop, default or export that makes it true. A claim that cannot cite one is rejected by a test.',
            table(
              ['claim', 'via'],
              m.alsoFor.map((c) => [cell(c.claim), code(c.via)]),
            ),
          ].join('\n\n'),
        )
      : null,
    (m.notFor ?? []).length
      ? section(
          'Not for — reach for this instead',
          table(
            ['instead', 'why'],
            m.notFor.map((n) => [code(n.instead), cell(n.why)]),
          ),
        )
      : null,
    (m.sameAs ?? []).length
      ? section(
          'Easy to confuse with',
          `${codeList(m.sameAs)}\n\nThese edges are symmetric — the same pairing is recorded from the other side.`,
        )
      : null,
    (m.watchFor ?? []).length
      ? section(
          'Watch for',
          table(
            ['note', 'via'],
            m.watchFor.map((w) => [cell(w.note ?? w), w.via ? code(w.via) : '']),
          ),
        )
      : null,
    (m.overrides ?? []).length
      ? section(
          'Reachable from outside',
          `${codeList(m.overrides)}${
            (m.overrides ?? []).includes('style')
              ? '\n\n`style` means this module writes an inline style that beats any class you pass.'
              : ''
          }`,
        )
      : null,
    (m.customProperties ?? []).length
      ? section('Custom properties', codeList(m.customProperties))
      : null,
    (m.composes ?? []).length ? section('Composes', codeList(m.composes)) : null,
    constraintBlock(id),
    seenBlock,
    users.length
      ? section(
          'Page templates that carry it',
          table(
            ['template', 'role'],
            users.map((u) => [`[${u.archetype}](../pages/${u.archetype}.md)`, u.role]),
          ),
        )
      : null,
    NON_NEGOTIABLES,
    `---\n\nSystem-wide tokens, scales and the full module index: [DESIGN.md](../../DESIGN.md).`,
  ])
}

// -------------------------------------------------------------- page templates

const marketing = layouts.marketing

function bandGrammar() {
  const parts = [
    `Source: \`${marketing.source.file}\` in \`${marketing.source.repo}\`, proven on ${marketing.source.proven_on}, transcribed ${marketing.source.transcribed}. The template component itself (\`${marketing.template.component}\`) is **not** shipped in this package — what follows is the contract it enforces, so a page built from these sections lands in the same grammar as the pages that ship.`,
    `**Page shape.** ${prose(marketing.page_shape)}`,
    `**DOM.** ${prose(marketing.dom.shape)} — ${prose(marketing.dom.why)}`,
  ]

  const ga = marketing.ground_alternation
  parts.push(
    [
      `**Ground.** ${prose(ga.rule)}.`,
      list(
        [
          `Cycle by band index: ${Object.entries(ga.cycle)
            .map(([i, g]) => `${i} → \`${g}\``)
            .join(', ')}. Starts on \`${ga.starts_on}\`. ${prose(ga.why_starts_on_page)}`,
          `Cream is not a ground. ${prose(ga.cream_is_not_a_ground)}`,
          ga.override?.exists
            ? `An override exists, for ${prose(ga.override.for)}. Watch for: ${prose(ga.override.watch_for)}`
            : null,
        ].filter(Boolean),
      ),
    ].join('\n\n'),
  )

  if (marketing.mirroring) {
    parts.push(
      `**Mirroring.** ${prose(marketing.mirroring.rule)}. ${prose(marketing.mirroring.why)} ${prose(
        marketing.mirroring.only_mirrorable_bands_take_a_turn ?? '',
      )}`,
    )
  }

  if (marketing.rhythm) {
    const r = marketing.rhythm
    parts.push(
      [
        `**Rhythm.** default \`${r.default}\`, tight \`${r.tight}\` (${prose(r.tight_when)}), tall \`${r.tall}\` (${prose(r.tall_when)}).`,
        r.why_literal ? `Written as literal px on purpose: ${prose(r.why_literal)}` : null,
      ]
        .filter(Boolean)
        .join(' '),
    )
  }

  return parts.join('\n\n')
}

/**
 * The four-value vocabulary is declared at the head of context.yaml. The one
 * that misleads is `applies-both`: it does NOT mean "safe either way", it means
 * the module has a light form and a dark form and something has to choose.
 */
const POLARITY_MEANS = {
  'applies-light': 'Puts `light` on its own root. It brings its own ground — you owe it nothing.',
  'applies-dark': 'Puts `dark` on its own root. A dark subtree wherever you place it.',
  'applies-both':
    'Has both forms and applies one of them. Which one is a call-site decision — read the module page before you place it on a ground that flips.',
  inherits:
    'Puts no theme class on its root; it takes the page. Place it on a light fill and the `light` class is yours to add, or it renders dark tokens on a light ground.',
}

/**
 * Grouped, not one row per module. The per-module table restated the identical
 * `inherits` sentence for thirteen of fifteen rows — 723 tokens, a fifth of the
 * page template, to say one thing thirteen times. The rule is stated once and
 * the modules are listed against it.
 */
function polarityObligations(ids) {
  const byPolarity = new Map()
  for (const id of ids) {
    const p = modules[id]?.polarity
    if (!p) continue
    if (!byPolarity.has(p)) byPolarity.set(p, [])
    byPolarity.get(p).push(id)
  }
  const order = ['applies-light', 'applies-dark', 'applies-both', 'inherits']
  const rows = [...byPolarity.entries()]
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([p, list]) => [code(p), POLARITY_MEANS[p] ?? '', list.map(code).join(', ')])
  return table(['polarity', 'what you owe it', 'modules in this template'], rows)
}

function pageDoc(archetype) {
  const spec = compositions.archetypes[archetype]
  const loadBearing = spec.load_bearing ?? []
  const optional = (spec.optional ?? []).map((o) => o.module)
  const observed = spec.observed ?? []
  const all = [...new Set([...loadBearing, ...optional, ...observed])]

  const confidenceNote = {
    derived: '3+ routes, a real intersection.',
    pair: 'Two routes. An intersection of two is a coincidence until a third confirms it.',
    single: 'One route. Recorded, not generalised — do not read it as a recommendation.',
  }[spec.confidence]

  const routeRows = Object.entries(spec.routes ?? {}).map(([route, mods]) => [
    code(route),
    mods.map(code).join(' → '),
  ])

  return doc([
    `# ${archetype} — page template`,
    banner(['machine/compositions.yaml', 'machine/layouts.yaml', 'machine/context.yaml']),
    table(
      ['', ''],
      [
        ['confidence', `${code(spec.confidence)} — ${confidenceNote}`],
        ['built', `${spec.instances} route${spec.instances === 1 ? '' : 's'}`],
      ],
    ),
    section('What this shape argues', spec.argues),
    section(
      'Load-bearing',
      loadBearing.length
        ? [
            'In **every** route of this archetype. Leave one out and the page is a different shape.',
            table(
              ['module', 'use for'],
              loadBearing.map((id) => [
                `[${id}](../${id}.md)`,
                cell(modules[id]?.useFor ?? '—'),
              ]),
            ),
          ].join('\n\n')
        : 'Nothing appears in every route of this archetype.',
    ),
    (spec.optional ?? []).length
      ? section(
          'Optional',
          [
            '`in N of M` is a count of what was built, not a recommendation. Pick for the claim you are making, then open that module for the rest.',
            table(
              ['module', 'in', 'for'],
              spec.optional.map((o) => [
                `[${o.module}](../${o.module}.md)`,
                `${o.in} of ${o.of}`,
                firstSentence(modules[o.module]?.useFor),
              ]),
            ),
          ].join('\n\n'),
        )
      : null,
    observed.length
      ? section(
          'Observed',
          [
            `Too few routes to intersect, so this is what was **there**, not what is required — the file records it rather than generalising it. Read it as evidence of how these modules have been composed together, and pick for the claim you are making.`,
            table(
              ['module', 'for'],
              observed.map((id) => [`[${id}](../${id}.md)`, firstSentence(modules[id]?.useFor)]),
            ),
          ].join('\n\n'),
        )
      : null,
    spec.watch_for ? section('Watch for', spec.watch_for) : null,
    section('Polarity obligations', polarityObligations(all)),
    section('Band grammar', bandGrammar()),
    section(
      'Evidence',
      [
        `Read as imports per route, in source order — close to render order, not the DOM. Corpus: \`${compositions.corpus.source}\` @ \`${compositions.corpus.commit}\`, ${compositions.corpus.routes_read} routes read.`,
        table(['route', 'modules, in import order'], routeRows),
      ].join('\n\n'),
    ),
    REACH_LADDER,
    NON_NEGOTIABLES,
    `---\n\nThe other page templates and the full module index: [DESIGN.md](../../DESIGN.md).`,
  ])
}

// ------------------------------------------------------------------ DESIGN.md

const isLeaf = (x) => typeof x === 'object' && x !== null && ('$value' in x || '$modes' in x)
const skipKey = (k) => k.startsWith('$') || k === 'version' || k === 'lastUpdated'

function* walkTokens(node, path = []) {
  for (const [key, value] of Object.entries(node)) {
    if (path.length === 0 && skipKey(key)) continue
    if (isLeaf(value)) yield [[...path, key].join('.'), value]
    else if (typeof value === 'object' && value !== null) yield* walkTokens(value, [...path, key])
  }
}

const tokenGroups = Object.keys(tokens).filter((k) => !skipKey(k))
const groupLeaves = (group) => [...walkTokens(tokens[group], [])]
const allLeaves = tokenGroups.flatMap(groupLeaves)

/** Values whose note says the light value was computed, not designed. */
const derivedCount = allLeaves.filter(([, leaf]) =>
  String(leaf.$description ?? '').includes('DERIVED'),
).length

function tokenTables() {
  const out = []
  for (const group of tokenGroups) {
    const rows = []
    for (const [path, leaf] of groupLeaves(group)) {
      const value = leaf.$modes
        ? Object.entries(leaf.$modes)
            .map(([mode, v]) => `${mode} \`${v}\``)
            .join(' · ')
        : code(leaf.$value)
      rows.push([code(`${group}.${path}`), value, cell(leaf.$description ?? '')])
    }
    const t = table(['token', 'value', 'note'], rows)
    if (t) out.push(`### ${group}\n\n${t}`)
  }
  return out.join('\n\n')
}

/**
 * The values live in their own leaf. Inlined they were two thirds of DESIGN.md
 * — 241 rows carrying the derivation rationale, which is the fact you need when
 * you are picking a colour and dead weight in the file you opened to find out
 * which module to reach for. DESIGN.md keeps the summary below, so the index
 * still says what exists and what it costs to open.
 */
function tokensDoc() {
  const modeAware = allLeaves.filter(([, leaf]) => leaf.$modes).length
  return doc([
    '# Tokens',
    banner(['design-tokens.json', 'machine/accessibility.yaml']),
    `${allLeaves.length} values, ${modeAware} of them mode-aware and shown here in every mode they declare. Source version ${
      tokens.version ?? '—'
    }.`,
    section(
      'How to read a value',
      `A single value is **invariant**: the same colour in light and dark. A value
shown as \`light … · dark …\` resolves against whichever theme class is in scope,
which is why the \`light\` class on a light surface is not optional.

The \`note\` column is not commentary. ${derivedCount} of these values are marked
DERIVED — a light-mode value computed as the least-darkened hue-preserving
colour that cleared the ${a11y.contrast.floors.body_text}:1 floor, rather than a
colour anyone drew. The note is where that is recorded, and it is the fact you
need before substituting one. Several notes also record a token whose name reads
like a sibling of another and is not; those are the traps, and they are written
down because each one has already shipped.`,
    ),
    section(
      'Prefer the token over the literal',
      table(
        ['use', 'not'],
        (a11y.prefer_tokens_over_hex ?? []).map((p) => [code(p.use), code(p.not)]),
      ),
    ),
    section('Values', tokenTables()),
    NON_NEGOTIABLES,
    `---\n\nScales, contrast pairs, the module index and the page templates: [DESIGN.md](../DESIGN.md).`,
  ])
}

/** Group, count, and how many invert — the index row, not the values. */
function tokenSummary() {
  const rows = tokenGroups.map((group) => {
    const leaves = groupLeaves(group)
    const modeAware = leaves.filter(([, leaf]) => leaf.$modes).length
    return [
      code(group),
      String(leaves.length),
      modeAware ? `${modeAware} mode-aware` : 'all invariant',
    ]
  })
  const modeAware = allLeaves.filter(([, leaf]) => leaf.$modes).length
  return [
    `The ${allLeaves.length} values are in **[design/tokens.md](design/tokens.md)** — their own fetch, because you need them only when picking a value, and their notes carry the derivation rationale that makes them long.`,
    table(['group', 'tokens', 'inverts?'], rows),
    `${modeAware} values are mode-aware and resolve against whichever theme class is in scope; the rest are the same in both modes. \`color.chrome.*\` is the sub-tree that must NEVER be used where the surface flips — see the rules above.`,
  ].join('\n\n')
}

function scaleBlock() {
  const s = layouts.shipped_here
  const parts = [
    `Verified ${s.verified}.`,
    `**Spacing.** Base \`${s.spacing_scale.base}\`. ${prose(s.spacing_scale.warning)}`,
    table(
      ['step', 'intended px', 'css var', 'what Tailwind actually emits'],
      s.spacing_scale.steps.map((x) => [code(x.step), x.px, code(x.css_var), x.tailwind_px]),
    ),
    `**Radius.** Base \`${s.radius_scale.base}\`.`,
    table(
      ['utility', 'approx'],
      s.radius_scale.canonical.map((r) => [code(r.utility), r.approx]),
    ),
    `**Breakpoints.**`,
    table(
      ['prefix', 'min-width', 'css var'],
      (s.breakpoints ?? []).map((b) => [code(b.prefix), b.min_width, code(b.css_var)]),
    ),
  ]
  return parts.filter(Boolean).join('\n\n')
}

const NAMESPACES = ['ui', 'patterns', 'sections']
const idsIn = (ns) => moduleIds.filter((id) => id.startsWith(`${ns}/`))

/**
 * The two module indexes, in their own leaf.
 *
 * Inlined they were 8.9k of DESIGN.md's 12.3k — 72% of the orienting file was
 * two overlapping answers to "which module?", paid for by every agent that
 * opened it to check a rule or a scale. They are one fetch now, and DESIGN.md
 * says what they cost before you spend it.
 *
 * `from` is where the links resolve from: `design/index.md` is one level below
 * DESIGN.md, so the same module path needs a different prefix in each.
 */
function moduleIndexes(from) {
  const path = (id) => (from === 'design' ? `${id.split('/')[0]}/${id.split('/')[1]}.md` : modulePath(id))

  // Lead sentence, not the whole paragraph. Inlined in full this was 6,371 of
  // the index's 8,895 tokens — 89 paragraphs, the second listing of a set the
  // intent index above already covers, on the one route that has to be cheap
  // because it is what you open when you do NOT know what you are looking for.
  // The full prose is one fetch away in the module's own page.
  const catalogue = NAMESPACES.map((ns) => {
    const ids = idsIn(ns)
    const t = table(
      ['module', 'for'],
      ids.map((id) => [`[${id}](${path(id)})`, firstSentence(modules[id].useFor)]),
    )
    return t ? `### ${ns}/ — ${ids.length} modules\n\n${t}` : null
  })
    .filter(Boolean)
    .join('\n\n')

  const intentRows = [...intentIndex.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([tag, ids]) => [
      code(tag),
      cell(context.intents?.[tag] ?? ''),
      ids.map((id) => `[${id.split('/')[1]}](${path(id)})`).join(', '),
    ])

  return { catalogue, intentRows }
}

function indexDoc() {
  const { catalogue, intentRows } = moduleIndexes('design')
  return doc([
    '# Module index',
    banner(['machine/context.yaml']),
    `All ${moduleIds.length} modules, two ways. Find the row, open that one file, stop — each module page is self-sufficient and costs about a tenth of this one.`,
    section(
      'By intent — read this backwards',
      [
        `You know what you are trying to DO. The tag takes you to the candidates without reading ${moduleIds.length} entries. The vocabulary is closed and declared at the head of \`machine/context.yaml\`.`,
        table(['intent', 'means', 'modules'], intentRows),
      ].join('\n\n'),
    ),
    section('By namespace', catalogue),
    NON_NEGOTIABLES,
    `---\n\nRules, scales, contrast floors and the page templates: [DESIGN.md](../DESIGN.md).`,
  ])
}

function designMd() {
  const pageRows = Object.entries(compositions.archetypes).map(([name, spec]) => [
    `[${name}](design/pages/${name}.md)`,
    code(spec.confidence),
    String(spec.instances),
    cell(spec.argues),
  ])

  return doc([
    '# Skene design system — DESIGN.md',
    banner([
      'design-tokens.json',
      'machine/context.yaml',
      'machine/compositions.yaml',
      'machine/layouts.yaml',
      'machine/rules.yaml',
      'machine/accessibility.yaml',
    ]),
    `${context.counts.modules} modules, ${
      Object.keys(compositions.archetypes).length
    } page templates, ${[...walkTokens(tokens)].length} tokens.`,
    section(
      'How to read this',
      [
        `One fetch per question. This file is the short one: the rules that cannot be
broken, the scales, the contrast floors, the page archetypes, and where
everything else is. Nothing below needs you to have read anything above it.

Then open **one** more file. Each is self-contained — it restates the rules
rather than linking back here, so you never need two open at once.`,
        table(
          ['you are', 'open', 'roughly'],
          [
            ['finding a module, by intent or by name', '`design/index.md`', '9k tokens'],
            ['reaching for one module you can name', '`design/<module>.md`', '2k'],
            ['building a whole page', '`design/pages/<archetype>.md`', '3k'],
            ['picking a colour or a value', '`design/tokens.md`', '7k'],
          ],
        ),
        `Do not read the tree. There are ${
          moduleIds.length + Object.keys(compositions.archetypes).length + 3
        } files here and together they are
larger than the YAML they were generated from — the split buys you a cheap
answer to ONE question, not a cheap corpus. Read the row, open the file, stop.`,
      ].join('\n\n'),
    ),
    NON_NEGOTIABLES,
    section(
      'Surface roles',
      [
        table(
          ['role', 'tokens', 'behaviour', 'use for'],
          Object.entries(rules.surface_roles)
            .filter(([, v]) => typeof v === 'object')
            .map(([role, v]) => [code(role), code(v.tokens), cell(v.behaviour), cell(v.use_for)]),
        ),
        prose(rules.surface_roles.warning),
      ].join('\n\n'),
    ),
    REACH_LADDER,
    section(
      'Must',
      list(rules.must.map((r) => code(r))) +
        '\n\n**Must not**\n\n' +
        list(rules.must_not.map((r) => code(r))),
    ),
    section('Page templates', table(['template', 'confidence', 'routes', 'what it argues'], pageRows)),
    section(
      'The spine',
      [
        'The bands that recur across the whole corpus, whatever the archetype.',
        table(
          ['module', 'in', 'note'],
          compositions.spine.map((s) => [
            `[${s.module}](${modulePath(s.module)})`,
            `${s.in} of ${s.of}`,
            cell(s.note),
          ]),
        ),
      ].join('\n\n'),
    ),
    section(
      'Finding a module',
      [
        `All ${moduleIds.length} of them are indexed in **[design/index.md](design/index.md)** — by intent, which is the one to read when you know what you are trying to DO rather than what it is called, and by namespace. Kept out of this file because it is the largest thing in it and answers a different question from the rules and scales here.`,
        table(
          ['namespace', 'modules', 'what lives there'],
          [
            ['`ui/`', String(idsIn('ui').length), 'the primitives — buttons, inputs, tables, overlays'],
            ['`patterns/`', String(idsIn('patterns').length), 'page furniture and surface treatments'],
            ['`sections/`', String(idsIn('sections').length), 'whole marketing bands and drawn artifacts'],
          ],
        ),
        `Before you write a component, look there. ${decisions.length} collisions where one visual object was drawn twice have already been adjudicated — every one by somebody who could not find the first.`,
      ].join('\n\n'),
    ),
    section('Scales', scaleBlock()),
    section('Tokens', tokenSummary()),
    section(
      'Contrast',
      [
        `${a11y.contrast.standard}. Body text ${a11y.contrast.floors.body_text}:1, large text ${a11y.contrast.floors.large_text}:1.`,
        'Pairs the build checks on every commit:',
        table(
          ['foreground', 'background', 'size', 'context'],
          (a11y.pairs ?? []).map((p) => [code(p.fg), code(p.bg), p.size, cell(p.context)]),
        ),
        (a11y.skip_pairs ?? []).length
          ? `**Excused from the gate:** ${codeList(a11y.skip_pairs)} — excused against *every* background, so the gate cannot catch a misuse of it.`
          : null,
      ]
        .filter(Boolean)
        .join('\n\n'),
    ),
    section(
      'Known gaps',
      [
        unproven.length
          ? `**Unproven modules.** Nothing in this repository has ever rendered ${
              unproven.length === 1 ? 'this module' : 'these modules'
            }, so ${unproven.length === 1 ? 'its' : 'their'} claims have no baseline behind them: ${codeList(
              unproven,
            )}.`
          : null,
        ...(rules.known_gaps ?? []).map((g) => `**${g.id}.** ${prose(g.detail)}`),
        (compositions.not_covered ?? []).length
          ? [
              '**Not covered by any page template.** An uncovered surface is written down, never dropped — the same precedent as an empty `seen` list.',
              ...compositions.not_covered.map((n) =>
                list(
                  [
                    `${n.route ? code(n.route) : `**${prose(n.what)}**`} — ${prose(n.why)}`,
                    n.matters_because ? `Matters because: ${prose(n.matters_because)}` : null,
                    n.consequence_for_this_file
                      ? `What that means here: ${prose(n.consequence_for_this_file)}`
                      : null,
                  ].filter(Boolean),
                ),
              ),
            ].join('\n\n')
          : null,
      ]
        .filter(Boolean)
        .join('\n\n'),
    ),
  ])
}

// -------------------------------------------------------------------- emit

const emissions = new Map()
emissions.set('DESIGN.md', designMd())
emissions.set('design/tokens.md', tokensDoc())
emissions.set('design/index.md', indexDoc())
for (const id of moduleIds) emissions.set(modulePath(id), moduleDoc(id))
for (const archetype of Object.keys(compositions.archetypes)) {
  emissions.set(`design/pages/${archetype}.md`, pageDoc(archetype))
}

/** Every .md under design/, so a renamed module leaves no orphan behind. */
function existingUnder(dir) {
  const abs = resolve(root, dir)
  if (!existsSync(abs)) return []
  const out = []
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name)
      if (e.isDirectory()) walk(p)
      else if (e.name.endsWith('.md')) out.push(relative(root, p))
    }
  }
  walk(abs)
  return out
}

if (check) {
  const problems = []
  for (const [path, content] of emissions) {
    const abs = resolve(root, path)
    if (!existsSync(abs)) problems.push(`missing: ${path}`)
    else if (readFileSync(abs, 'utf8') !== content) problems.push(`stale: ${path}`)
  }
  for (const path of existingUnder('design')) {
    if (!emissions.has(path)) problems.push(`orphan: ${path}`)
  }
  if (problems.length) {
    console.error('design docs are out of date. Run `npm run design`.\n')
    console.error(problems.map((p) => `  ${p}`).join('\n'))
    process.exit(1)
  }
  console.log(`design docs up to date (${emissions.size} files).`)
} else {
  for (const path of existingUnder('design')) {
    if (!emissions.has(path)) rmSync(resolve(root, path))
  }
  for (const [path, content] of emissions) {
    const abs = resolve(root, path)
    mkdirSync(dirname(abs), { recursive: true })
    writeFileSync(abs, content)
  }
  console.log(
    `wrote ${emissions.size} files: DESIGN.md, design/index.md, design/tokens.md, ${moduleIds.length} modules, ${
      Object.keys(compositions.archetypes).length
    } page templates.`,
  )
}
