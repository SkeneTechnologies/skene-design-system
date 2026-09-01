/**
 * Emit the component inventory as JSON, scanned from source.
 *
 * The catalogue page could have been hand-written. It would then be wrong within
 * a week and wrong silently — a page that claims to list everything is worse
 * than no page when it misses things. This reads the actual exports, so a new
 * component appears without anyone remembering to add it.
 *
 *   node scripts/build-inventory.mjs
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'docs-app/app/decisions/inventory.json')

/** shadcn files use `export { A, B }`; ours use `export function A`. Both count. */
function exportsOf(src) {
  const out = new Set()
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim()
      if (name && /^[A-Z]/.test(name)) out.add(name)
    }
  }
  // Underscore included — same fix as scripts/build-context.mjs `exportsOf`:
  // without it SCREAMING_SNAKE exports truncate at the first underscore.
  for (const m of src.matchAll(/export (?:function|const) ([A-Z][A-Za-z0-9_]*)/g)) out.add(m[1])
  return [...out]
}

/** First prose line of the leading block comment — the "why", not the signature. */
function summaryOf(src) {
  const m = src.match(/\/\*\*\s*\n \* ([^\n]+)((?:\n \* [^\n]+)*)/)
  if (!m) return ''
  const rest = (m[2] || '').split('\n').map((l) => l.replace(/^ \* ?/, '').trim())
  const first = [m[1].trim()]
  for (const line of rest) {
    if (!line) break
    first.push(line)
  }
  return first.join(' ').trim()
}

/**
 * Where a module can be SEEN.
 *
 * /components is another session's per-component gallery; each snapshot target
 * is marked `data-visual="<case>"`. The case names are read out of that page
 * rather than restated, so a case renamed there stops resolving here instead of
 * linking to nothing.
 *
 * The mapping is not mechanical and cannot be made so:
 *   - `dither` exports two things and the gallery shows one of them
 *   - `marketing` is one module behind FOUR cases
 *   - `section-backdrop` drops the layer prefix it would otherwise take
 * so those are declared. Everything else falls back to `<layer>-<module>`.
 */
const GALLERY = 'docs-app/app/components/page.tsx'
const galleryCases = new Set(
  [...readFileSync(resolve(ROOT, GALLERY), 'utf8').matchAll(/<Case[\s\S]{0,200}?name="([^"]+)"/g)].map(
    (m) => m[1],
  ),
)
const SINGULAR = { ui: 'ui', patterns: 'pattern', sections: 'section' }
/** module key -> the case(s) that show it, where the guess would be wrong. */
const EXPLICIT = {
  'patterns/dither': ['pattern-dithered-media'],
  'patterns/marketing': [
    'pattern-pill-nav',
    'pattern-display-heading',
    'pattern-numbered-step',
    'pattern-split-auth',
  ],
    'sections/section-backdrop': ['section-backdrop'],
  // ui-card-surface exercises the `surface` variant; ui-card is the default,
  // and keeping both is what proves the variant was additive.
  'ui/card': ['ui-card', 'ui-card-surface'],
  'sections/light-section-card': ['section-light-section-card', 'light-section-card-steps'],
  // Two cases each: the plain one proves the eyebrow slot is inert when
  // omitted, the -eyebrow one exercises it.
  'sections/trust-panel': ['section-trust-panel', 'section-trust-panel-eyebrow'],
  'sections/final-cta': ['section-final-cta', 'section-final-cta-eyebrow'],
  // Two cases each, at two states, because one frame proves one state.
  // `card-animation-integrations` cycles four details on a GSAP loop, so the
  // pair is captured at two playheads — 2.5s and 9.5s — and either frame alone
  // would let a component that never swapped pass. `journey-signal-scene` picks
  // one of three hand-placed layouts by measuring its container and carries a
  // GTM/Engineering toggle, so the pair holds WIDE+GTM and MEDIUM+Engineering;
  // the `-medium` one is where every defect filed against it shows.
  'sections/card-animation-integrations': [
    'section-card-animation-integrations',
    'section-card-animation-integrations-last',
  ],
  'sections/journey-signal-scene': [
    'section-journey-signal-scene',
    'section-journey-signal-scene-medium',
  ],
}
/** Modules with no gallery case but a live demo on a composed route. */
const DEMO_ROUTE = {
  'sections/pipeline-stepper': '/sections',
  'sections/ask-widget': '/sections',
  'sections/annotated-curve': '/sections',
  'sections/light-section-card': '/sections',
  'sections/stat-chip': '/sections',
  'sections/feature-row': '/sections',
  'sections/plan-card': '/sections',
  'sections/final-cta': '/sections',
  'sections/footer': '/sections',
  'sections/product-window': '/sections',
  'sections/bridge': '/sections',
  'sections/journey-track': '/sections',
}

function visualsFor(layer, module) {
  const key = `${layer}/${module}`
  const explicit = EXPLICIT[key]
  if (explicit) return explicit.filter((c) => galleryCases.has(c))
  const guess = `${SINGULAR[layer]}-${module}`
  return galleryCases.has(guess) ? [guess] : []
}

const LAYERS = [
  { dir: 'src/ui', layer: 'ui', importBase: '@skene/design-system/ui' },
  { dir: 'src/patterns', layer: 'patterns', importBase: '@skene/design-system/patterns' },
  { dir: 'src/sections', layer: 'sections', importBase: '@skene/design-system/sections' },
]

/**
 * Authored reuse guidance, keyed by module.
 *
 * Reads `scripts/context-data.json`, the authored half of `machine/context.yaml`
 * — the same prose, now covering all 77 modules instead of 21 and, unlike this
 * inventory, actually shipped to consumers. It used to read `usage-data.json`,
 * which was this page's private file: the guidance existed but no installed
 * package carried it.
 *
 * The field names differ by one (`useFor` here was `purpose`) and the claims now
 * carry a `via` citation, so they are flattened back to strings for the page,
 * which renders prose.
 */
const USAGE = Object.fromEntries(
  JSON.parse(readFileSync(resolve(ROOT, 'scripts/context-data.json'), 'utf8')).modules.map((m) => [
    m.module.split('/').pop(),
    {
      module: m.module.split('/').pop(),
      purpose: m.useFor,
      alsoFor: (m.alsoFor ?? []).map((a) => a.claim),
      watchFor: (m.watchFor ?? []).map((w) => w.note),
      notFor: (m.notFor ?? []).map((n) => n.why),
    },
  ]),
)

const modules = []
for (const { dir, layer, importBase } of LAYERS) {
  // `.ts` as well as `.tsx`, matching scripts/build-context.mjs. A module with
  // no JSX is still a module: `patterns/pill-nav-frosted` is two constants, the
  // frosted wash and the position classes. Filtering on `.tsx` alone dropped it
  // from this file while machine/context.yaml carried it — 88 modules here
  // against 89 there — so the page whose whole premise is that it lists
  // everything was one short, and silently, which is the failure the header of
  // this file says it exists to prevent.
  for (const file of readdirSync(resolve(ROOT, dir)).sort()) {
    if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue
    const src = readFileSync(resolve(ROOT, dir, file), 'utf8')
    const name = file.replace(/\.tsx?$/, '')
    modules.push({
      module: name,
      layer,
      import: `${importBase}/${name}`,
      exports: exportsOf(src),
      summary: summaryOf(src),
      // Both quote styles. This matched only the single-quoted form until
      // 2026-09-01, and 21 of the 29 directives in src are written
      // `"use client";` — so this file reported 7 client modules where
      // machine/context.yaml reported 28, and the README's "the 8 modules that
      // need it" traces back to here. An agent reading inventory.json to decide
      // whether a deep import keeps its server boundary got the wrong answer
      // for 21 of 89 modules, and silently.
      client: /^['"]use client['"]/.test(src.trimStart()),
      lines: src.split('\n').length,
      /** Gallery cases that show this module, isolated and in both modes. */
      cases: visualsFor(layer, name),
      /** A composed route where it is shown in context, when there is one. */
      demo: DEMO_ROUTE[`${layer}/${name}`] ?? null,
      usage: USAGE[name] ?? null,
    })
  }
}

/**
 * The open decisions, from docs/sections.md. Hand-written on purpose: a decision
 * is a judgement, and deriving it from source would only restate the duplication
 * rather than say what to do about it.
 */
const decisions = [
  {
    id: 'band-polarity',
    title: 'A band with copy and a visual',
    status: 'resolved',
    options: ['FeatureRow', 'LightSectionCard'],
    verdict: 'Kept both. Prop names standardised — FeatureRow moved to lede/actions.',
    detail:
      'Near-identical prop sets that disagreed on names for the same concepts: subtitle vs lede, action vs actions. The polarity difference is real — LightSectionCard carries the `light` class and inverts — so collapsing them behind a tone flag would hide a load-bearing accessibility mechanism behind something that looks like styling. Applied: FeatureRow renamed, all call sites updated.',
    evidence: [
      'FeatureRow: title, lede, children, actions, visual, reverse',
      'LightSectionCard: title, lede, children, actions, visual, reverse',
    ],
  },
  {
    id: 'chips',
    title: 'Small labels',
    status: 'partly-applied',
    options: [
      'Chip',
      'Badge',
      'Eyebrow',
      'StatChip',
      'MetaChip',
      'WindowStatus',
      'WindowChip',
      'TagChip',
      'CheckChip',
    ],
    verdict:
      'Nine shapes, not the seven this decision carried for a fortnight. Chip extracted (PlanCard tier + WindowStatus). Badge/Eyebrow stay apart, now gated. StatChip/MetaChip keep the pill: a token gets the rectangle, prose gets the pill. TagChip vs CheckChip is the one still open — decided, not applied, because it moves pixels.',
    detail:
      'PlanCard\u2019s inline tier chip and WindowStatus were almost the same spec reached independently \u2014 rounded-[5px], font-mono, 10px, uppercase, px-[7px] py-1 \u2014 and disagreed on tracking alone, 0.05em against 0.08em. Earlier revisions of the table had no tracking column and recorded them as identical: an unmanaged cluster drifts in the column nobody is looking at. Applied 2026-08-12 as sections/chip.tsx, the tracking difference carried rather than flattened because both values shipped and were verified in a browser. The same failure then repeated one level up \u2014 the table caught a drift in a column it had, and could not catch a row it did not have, so TagChip and CheckChip were the same 11px mono tag written twice with the duplicate recorded only in evaluator-check.tsx\u2019s own header. The table is a test now: __tests__/chip-cluster.test.ts pins every row against source and fails when a tenth shape lands unrecorded.',
    evidence: [
      'Badge          rounded-sm    text-xs',
      'Eyebrow        rounded-sm    --font-size-pill  mono upper  --font-tracking-eyebrow',
      'StatChip       rounded-full  12px                          prose: a fact',
      'MetaChip       rounded-full  12px              part        prose: a promise',
      'Chip           rounded-[5px] 10px              mono upper  0.08em',
      'WindowStatus   = Chip, tracking overridden to              0.05em',
      'PlanCard tier  = Chip, neutral tone',
      'WindowChip     rounded-md    11px              mono upper',
      'TagChip        rounded-sm    11px              mono        an identifier, verbatim',
      'CheckChip      rounded-sm    11px              mono        THE SAME \u2014 alias it to TagChip',
    ],
  },
  {
    id: 'texture',
    title: 'Texture behind content',
    status: 'resolved',
    options: ['SectionBackdrop', 'HeroBackdrop', 'DitheredMedia', 'DitherOverlay'],
    verdict: 'No overlap once scoped. Pick by what you are dressing.',
    detail:
      'SectionBackdrop is the field behind a mock inside a feature row. HeroBackdrop is a hero strip. DitheredMedia is a full hero composition. DitherOverlay is the raw layer for composing your own stack.',
    evidence: [],
  },
  {
    id: 'frames',
    title: 'Framed content',
    status: 'resolved',
    options: ['ProductWindow', 'Terminal'],
    verdict: 'No change. Different objects, read differently on purpose.',
    detail:
      'Terminal is monospace with traffic lights and frames code or CLI output. ProductWindow frames a product mock and inverts to light by default, where light means the customer’s tool rather than Skene’s.',
    evidence: [],
  },
{
    id: 'steppers',
    title: 'A track of steps',
    status: 'resolved',
    options: ['PipelineStepper', 'JourneyTrack'],
    verdict: 'Kept both. The state vocabulary is the argument, not the geometry.',
    detail:
      'Measured 2026-08-13 and near-identical: p-[22px] against p-7 (the same 22.4px), the same title and subtitle specs, the same flex-to-row list, the same 55% border / 12% fill ring mix, and connectors whose ml-[N] is the ring diameter halved in both. What differs is what a step MEANS — done | active | pending is progress, good | warn | danger is health — and a component that carried both would have to be told which vocabulary it is speaking. Same verdict as band-polarity: the difference is real and it is not styling.',
    evidence: [
      'PipelineStepper: 38px ring, ml-[18px] connector, done | active | pending',
      'JourneyTrack: 34px ring, ml-[17px] connector, good | warn | danger',
    ],
  },
  {
    id: 'lifted-card',
    title: 'A card lifted out of its row',
    status: 'resolved',
    options: ['PlanCard', 'BridgeNode'],
    verdict: 'Kept both. The same card at inverted polarity.',
    detail:
      'Identical radius, padding, lift and shadow token, and the same kicker → title → mt-auto list structure. The only difference is which way the theme points: PlanCard featured is cream in a dark grid, BridgeNode featured is near-black in a cream band. Collapsing them behind a tone prop is the exact move band-polarity rejected — it puts the light/dark class, which is load-bearing for legibility, behind a flag that reads as styling.',
    evidence: [
      'PlanCard featured: light border-brand-light bg-brand-light md:-translate-y-3, shadow-modal',
      'BridgeNode featured: dark border-chrome-line-subtle bg-chrome-surface-1 md:-translate-y-3, shadow-modal',
    ],
  },
  {
    id: 'terminals',
    title: 'A terminal frame',
    status: 'decided',
    options: ['Terminal', 'TerminalBlock'],
    verdict: 'One object drawn twice, at 8px and 12px. Neither is deprecated; the radii need settling.',
    detail:
      'Same tokens, same 10px traffic lights, same mono body — but Terminal draws its frame from the .skene-terminal class in effects.css at 8px radius, and TerminalBlock draws its own through ArtPanel at 12px. Two terminals that do not match is worse than either. patterns/terminal is the documented one and has a case; TerminalBlock has the copy button, is the client boundary, and skene-site renders it on five routes. An @deprecated tag went on TerminalBlock briefly and was retracted the same day: it is the half with the feature, so the tag pointed readers away from the only one that could do the job. What actually needs settling is which radius wins, which is a visual decision and owed its own baseline movement.',
    evidence: [
      'effects.css .skene-terminal: --radius-panel (8px), traffic lights as a ::before',
      'TerminalBlock: ArtPanel rounded-xl (12px), three explicit size-[10px] spans',
    ],
  },
  {
    id: 'textured-field',
    title: 'The halftone field',
    status: 'decided',
    options: ['ArtFrame', 'SectionBackdrop'],
    verdict: 'Not equivalent, and not merged. Measured difference recorded.',
    detail:
      'They load the SAME three image files under different key names — gh/db/jr against github/schema/journey — and independently arrived at the same 6% inset and 22rem floor. But ArtFrame also carries rounded-xl, an opaque bg-surface-deep-2 under the texture, and a non-row padding variant, so a merge changes pixels rather than being the neutral consolidation it looks like. Anyone taking it must predict the baseline diffs in the PR description before running the suite.',
    evidence: [
      'artifact-shell: { gh: card2_bg, db: card3_bg, jr: card1_bg }, p-[6%], min-h 22rem, rounded-xl, bg-surface-deep-2',
      'section-backdrop: { journey: card1_bg, github: card2_bg, schema: card3_bg }, inset 6%, minHeight 22rem',
    ],
  },
  {
    id: 'shared-shell',
    title: 'Tiles and cards that share a shell',
    status: 'resolved',
    options: ['OverviewTile', 'CheckResult', 'ValueCard', 'QuestionCard'],
    verdict: 'Kept apart. Only the shell matches; the contents are different objects.',
    detail:
      'OverviewTile and CheckResult have a byte-identical root class string, and ValueCard and QuestionCard share a 14px radius and 22.4px padding. Measured further, the insides disagree on purpose: OverviewTile is a 9px mono caption over a 24px number, CheckResult an 11px sans caption over 14px bold; the two cards carry different peach washes and different height floors. Extracting the shell would mean one shared line of classes and two components that still cannot be substituted, so it was not done. StatChip and MetaChip WERE collapsed onto a private Pill base, because there the whole box matched and only three tokens differed.',
    evidence: [
      'OverviewTile / CheckResult root: min-w-0 rounded-sm border border-border bg-card p-[12px]',
      'OverviewTile caption 9px mono 0.9px vs CheckResult 11px sans 0.16em',
    ],
  },
  {
    id: 'note-strip',
    title: 'The note under an artifact',
    status: 'partly-applied',
    options: ['EvaluatorNote', 'flow-diagram note', 'evaluator-check note'],
    verdict: 'Two of four merged. Two differ for reasons worth keeping.',
    detail:
      'evaluator-verify now renders EvaluatorNote. evaluator-check keeps its own because it has no [&_code] rules — a <code> in its note renders as body text there and as mono foreground everywhere else, so adopting the shared part is a pixel change owed its own baseline movement. flow-diagram keeps a <p> where the shared part is a <div>, because prose under a figure is a paragraph.',
    evidence: [
      'evaluator-list EvaluatorNote: mt-[12px] text-[12px] text-muted-foreground [&_code]:font-mono [&_code]:text-foreground [&_code]:wrap-anywhere',
      'evaluator-check: the same strip with no [&_code] rules',
    ],
  },
]

/** Archetypes with no form in the package. Named so the gap is visible here too. */
const unbuilt = [
]

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(
  OUT,
  JSON.stringify(
    {
      generated: 'by scripts/build-inventory.mjs — do not edit by hand',
      modules,
      decisions,
      unbuilt,
      gallery: { route: '/components', cases: galleryCases.size },
      counts: {
        modules: modules.length,
        exports: modules.reduce((n, m) => n + m.exports.length, 0),
        ui: modules.filter((m) => m.layer === 'ui').length,
        patterns: modules.filter((m) => m.layer === 'patterns').length,
        sections: modules.filter((m) => m.layer === 'sections').length,
        noVisual: modules.filter((m) => m.cases.length === 0 && !m.demo).length,
        withUsage: modules.filter((m) => m.usage).length,
      },
    },
    null,
    2,
  ) + '\n',
)

console.log(
  `inventory: ${modules.length} modules, ` +
    `${modules.reduce((n, m) => n + m.exports.length, 0)} exports, ` +
    `${decisions.filter((d) => d.status !== 'resolved').length} open decisions -> ${OUT}`,
)
