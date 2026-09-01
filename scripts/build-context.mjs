/**
 * Emit `machine/context.yaml` — what every module can be USED FOR, for an agent
 * deciding which one to reach for.
 *
 *   node scripts/build-context.mjs           write
 *   node scripts/build-context.mjs --check    fail if the committed file differs
 *
 * ## Why this exists next to components.yaml rather than inside it
 *
 * `machine/components.yaml` answers "what must I not do with this" — its `rules`
 * are prohibitions, and they are correct. Nothing shipped answers "what else is
 * this good for". The two files that did — `scripts/usage-data.json` and the
 * generated `inventory.json` — were both outside `package.json` `files`, so a
 * consuming agent had never seen either. (`inventory.json` ships as of
 * 2026-08-27, exported as `@skene/design-system/inventory.json`; it is what
 * turns a `seen:` case id into something a reader can actually look at.)
 * What it does see is the file-header
 * comment, which says what the component was BUILT for. That framing is exactly
 * what makes a reader write a near-copy instead of reusing what is there, and
 * the ten duplicate clusters in this package are the receipt.
 *
 * ## Derived vs authored, and why the split is the whole design
 *
 * Everything mechanical is derived here — exports, client boundary, what a
 * module composes, whether it forces a theme, which gallery cases show it, and
 * the full prop table with types and defaults. Judgement is authored in
 * `scripts/context-data.json` and is the only part a human writes.
 *
 * The join is what makes a reuse claim checkable. Every `alsoFor` and `watchFor`
 * entry carries `via:`, and `via` must name a prop, a default or an export that
 * appears in the derived block — enforced in `__tests__/context.test.ts`. A
 * claim that cannot cite one is a claim somebody guessed, and guessed reuse
 * advice is worse than none: it sends an agent to the wrong component with
 * confidence.
 *
 * ## Why the authored side is JSON when the output is YAML
 *
 * Nothing in this repository parses YAML — `machine/*.yaml` is hand-maintained
 * and, until this file, unvalidated. Authoring in JSON keeps the toolchain at
 * zero new dependencies and matches `usage-data.json`, which this replaces. The
 * OUTPUT is YAML because it sits beside the four `machine/*.yaml` contracts an
 * agent already reads, and a lone JSON file in that folder is a file that gets
 * missed.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'machine/context.yaml')
const DATA = resolve(ROOT, 'scripts/context-data.json')
const GALLERY = 'docs-app/app/components/page.tsx'

export const LAYERS = [
  { dir: 'src/ui', layer: 'ui', singular: 'ui' },
  { dir: 'src/patterns', layer: 'patterns', singular: 'pattern' },
  { dir: 'src/sections', layer: 'sections', singular: 'section' },
]

/** shadcn files use `export { A, B }`; ours use `export function A`. Both count. */
export function exportsOf(src) {
  const out = new Set()
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim()
      if (name && /^[A-Z]/.test(name)) out.add(name)
    }
  }
  // Underscore included, or SCREAMING_SNAKE exports truncate at the first `_`:
  // PILL_NAV_FROSTED_STYLE derived as `PILL`, PILL_NAV_POSITION collapsed into
  // the same wrong name and vanished from the Set, INTEGRATION_ANIMATION_CARDS
  // read `INTEGRATION` and PROSE_CODE read `PROSE`. Every `via:` citing one of
  // those names was checkable against a symbol the package does not export.
  for (const m of src.matchAll(/export (?:function|const) ([A-Z][A-Za-z0-9_]*)/g)) out.add(m[1])
  return [...out]
}

/**
 * Which package modules this one imports. Relative specifiers only: a lucide or
 * radix import says nothing about reuse inside the package, and the question
 * this answers is "if I take this, what else comes with it".
 */
export function composesOf(src) {
  const out = new Set()
  for (const m of src.matchAll(/from '(\.\.?\/[^']+)'/g)) {
    const spec = m[1].replace(/\.js$/, '')
    if (spec.includes('lib/utils')) continue
    const parts = spec.split('/').filter((p) => p !== '.' && p !== '..')
    out.add(parts.length > 1 ? parts.join('/') : `same-layer/${parts[0]}`)
  }
  return [...out]
}

/** Block and line comments, gone. Prose about a mechanism is not the mechanism. */
export function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/[^\n]*$/gm, '')
}

/**
 * Whether the module forces a theme on its own subtree.
 *
 * This is the single most repeated gotcha in the package — a `light` class on a
 * root is load-bearing, not decoration, and the two bugs that shipped invisible
 * were both a missing one. It is also fully derivable, so nobody should be
 * hand-writing it: a literal `light`/`dark` at the head of a class string is the
 * whole tell.
 */
export function polarityOf(src) {
  const applies = new Set()
  // Comments first, or this reads the prose instead of the code: every one of
  // these files EXPLAINS the mechanism in its header, so `light` and `dark`
  // appear in sentences in modules that apply neither. faq-band derived as
  // applies-both from two words in its own documentation.
  const code = stripComments(src)
  // A theme class is followed by another utility — `'light grid …'`. Requiring
  // that trailing token is what separates a class from `tone="dark"`, which
  // names a prop value and applies nothing.
  for (const m of code.matchAll(/['"`](light|dark) [a-z[]/g)) applies.add(m[1])
  if (applies.has('light') && applies.has('dark')) return 'applies-both'
  if (applies.has('light')) return 'applies-light'
  if (applies.has('dark')) return 'applies-dark'
  return 'inherits'
}

/**
 * The prop table, with types and defaults.
 *
 * The highest-leverage derivation in this file: most reuse claims take the form
 * "prop X is a ReactNode, so it also does Y", and without the table that claim
 * is unfalsifiable. With it, `via` becomes a lookup.
 */
export function propsOf(src) {
  const out = {}
  for (const m of src.matchAll(/export interface (\w+)Props \{([\s\S]*?)\n\}/g)) {
    const owner = m[1]
    const fields = {}
    // `[,;]?` not `,?`: our own interfaces separate members with commas, the
    // vendored shadcn ones with semicolons, and stripping only the comma is how
    // `ui/card`'s `variant` derived as `CardVariant;`.
    for (const f of m[2].matchAll(/^ {2}(\w+)(\??):\s*([^\n]+?)[,;]?$/gm)) {
      const [, name, optional, type] = f
      if (name === 'className') continue
      fields[name] = { type: type.trim().replace(/[,;]$/, ''), required: optional !== '?' }
    }
    // Defaults live in the destructuring, not the interface.
    const sig = src.match(
      new RegExp(`export function ${owner}\\(\\{([\\s\\S]*?)\\}:\\s*${owner}Props`),
    )
    if (sig) {
      for (const d of sig[1].matchAll(/(\w+)\s*=\s*([^,\n]+)/g)) {
        if (fields[d[1]]) fields[d[1]].default = d[2].trim()
      }
    }
    if (Object.keys(fields).length) out[owner] = fields
  }
  return out
}

/**
 * The prop table for a module that declares no `XProps` interface of its own.
 *
 * ## Why this exists
 *
 * `propsOf` reads `export interface <Owner>Props { … }` out of the source,
 * which is how every `sections/*` and `patterns/*` module is written. The
 * `ui/*` layer is shadcn and is written the other way round: the parameter type
 * is inline and structural — `React.ComponentProps<"button">`,
 * `React.ComponentProps<typeof AccordionPrimitive.Item>`, a `VariantProps<…>`
 * intersection — so `propsOf` found nothing and all 30 `ui/*` modules shipped a
 * context entry with no prop signature at all. That is the layer `rules.yaml`
 * `priority_order` tells an agent to reach for FIRST, so the one layer with the
 * strongest "use this" instruction was the one with the least information about
 * how to call it, and a reader had to open `dist/*.d.ts` by hand or guess.
 *
 * ## Why `dist/*.d.ts` and not the source
 *
 * The source hides the two facts that matter behind indirection: a cva variant
 * table is a runtime object, and `React.ComponentProps<typeof X>` is a type
 * TypeScript has to resolve. `tsc` has already done both by the time it writes
 * the `.d.ts`, which is where a `variant` union appears as the literal string
 * of its members. `dist/` is committed and shipped, so this adds no build-order
 * dependency that a consumer could miss — but it does mean `npm run context`
 * must run AFTER `tsc`, which is why the `build` script was reordered.
 *
 * ## What comes out
 *
 * `props` in exactly the shape `propsOf` produces, so nothing downstream needs
 * a second parser: the module's OWN fields (a declared `XProps` body, an inline
 * `& { … }`, or a cva variant table) with types and, where the source
 * destructuring or a `defaultVariants` block states one, defaults.
 * `accepts` is emitted beside it and is the other half of the answer: the base
 * type each export spreads onto its element, which is what tells a caller that
 * `onClick`, `id` and `aria-*` reach the DOM without being declared anywhere.
 */
const DIST = resolve(ROOT, 'dist')

const stripNullish = (t) =>
  t.replace(/\s*\|\s*null\s*\|\s*undefined\s*$/, '').replace(/\s*\|\s*undefined\s*$/, '').trim()

const oneLine = (t) => t.replace(/\s+/g, ' ').trim()

/**
 * Split `A, Pick<B, "x" | "y">, C` on the commas that separate types, not the
 * ones inside a type argument list. `String.split(',')` shreds every `Pick<…>`
 * and `Omit<…>` in the package.
 */
function splitTopLevel(clause) {
  const out = []
  let depth = 0
  let buf = ''
  for (const ch of clause) {
    if (ch === '<' || ch === '(' || ch === '[' || ch === '{') depth++
    else if (ch === '>' || ch === ')' || ch === ']' || ch === '}') depth--
    if (ch === ',' && depth === 0) {
      out.push(buf)
      buf = ''
      continue
    }
    buf += ch
  }
  if (buf.trim()) out.push(buf)
  return out.map((t) => t.trim()).filter(Boolean)
}

/** `{ a?: T; b: U }` body -> field map. Shared by the interface and inline paths. */
function fieldsOfBody(body) {
  const fields = {}
  for (const f of body.matchAll(/^\s*(\w+)(\??):\s*([^\n]+?);?\s*$/gm)) {
    const [, name, optional, type] = f
    if (name === 'className') continue
    fields[name] = { type: stripNullish(oneLine(type)), required: optional !== '?' }
  }
  return fields
}

/**
 * cva variant tables, as `tsc` widened them.
 *
 * `declare const buttonVariants: (props?: ({ variant?: "link" | "default" … })`
 * is the only place the allowed values of `variant` and `size` are written down
 * as data. Reading the source instead would mean evaluating the cva call.
 */
export function cvaVariantsOfDts(dts) {
  const out = {}
  for (const m of dts.matchAll(/declare const (\w+):\s*\(props\?:\s*\(\{([\s\S]*?)\n\}\s*&/g)) {
    out[m[1]] = fieldsOfBody(m[2])
  }
  return out
}

/** `export interface XProps extends A, B { … }` -> its own body and its bases. */
function interfacesOfDts(dts) {
  const out = {}
  for (const m of dts.matchAll(/export interface (\w+)((?:\s+extends\s+[^{]+)?)\s*\{([\s\S]*?)\n\}/g)) {
    out[m[1]] = { extends: oneLine(m[2].replace(/^\s*extends\s+/, '')), fields: fieldsOfBody(m[3]) }
  }
  return out
}

/**
 * Every exported component in a `.d.ts`, with the type expression it takes.
 *
 * Three declaration shapes ship here and all three are load-bearing:
 * `declare function X({ … }: T)` (most of shadcn), `declare const X: React.FC<T>`
 * and `declare const X: React.ForwardRefExoticComponent<T & React.RefAttributes<E>>`
 * (the Radix roots and triggers that are re-exported untouched). A cva builder
 * matches none of them, which is what keeps `buttonVariants` out of the table:
 * it returns a class string and is not a component.
 */
function componentsOfDts(dts) {
  const out = []
  const JSX = String.raw`(?:React\.|import\("react"\)\.)?JSX\.Element`
  for (const m of dts.matchAll(new RegExp(String.raw`declare function (\w+)\(\{([^}]*)\}:\s*([\s\S]*?)\):\s*${JSX}`, 'g'))) {
    out.push({ name: m[1], destructured: m[2], type: oneLine(m[3]) })
  }
  for (const m of dts.matchAll(new RegExp(String.raw`declare const (\w+):\s*\(\{([^}]*)\}:\s*([\s\S]*?)\)\s*=>\s*${JSX}`, 'g'))) {
    out.push({ name: m[1], destructured: m[2], type: oneLine(m[3]) })
  }
  for (const m of dts.matchAll(/declare const (\w+):\s*(?:React\.|import\("react"\)\.)?(FC|ForwardRefExoticComponent)<([\s\S]*?)>;/g)) {
    out.push({ name: m[1], destructured: '', type: oneLine(m[3]) })
  }
  return out
}

/** `React.RefAttributes<…>` is noise in an answer about props. */
const dropRefAttributes = (t) =>
  oneLine(t.replace(/\s*&\s*(?:React\.|import\("react"\)\.)?RefAttributes<[^>]*>/g, ''))

/**
 * Defaults, which live in the implementation and never in the `.d.ts`.
 *
 * Two sources, and both are needed: `asChild = false` in the destructuring, and
 * the `defaultVariants` block of the cva call, which is what makes
 * `variant="default"` true without any caller writing it.
 */
function defaultsOfSource(src, name) {
  const out = {}
  const sig = src.match(new RegExp(String.raw`function ${name}\(\{([\s\S]*?)\}\s*:`))
  if (sig) for (const d of sig[1].matchAll(/(\w+)\s*=\s*([^,\n]+)/g)) out[d[1]] = d[2].trim()
  return out
}

function cvaDefaultsOfSource(src, builder) {
  const at = src.indexOf(`const ${builder} = cva(`)
  if (at === -1) return {}
  const next = src.indexOf('= cva(', at + 6)
  const scope = src.slice(at, next === -1 ? undefined : next)
  const block = scope.match(/defaultVariants:\s*\{([^}]*)\}/)
  if (!block) return {}
  const out = {}
  for (const d of block[1].matchAll(/(\w+):\s*"?([\w-]+)"?/g)) out[d[1]] = d[2]
  return out
}

/**
 * The whole fallback: props and `accepts` for one module, from its shipped
 * types. Returns empty objects when there is no `.d.ts`, which is the honest
 * answer for a module `tsc` has not emitted yet.
 */
export function dtsContractOf(layer, module, src) {
  let dts
  try {
    dts = readFileSync(resolve(DIST, layer, `${module}.d.ts`), 'utf8')
  } catch {
    return { props: {}, accepts: {} }
  }
  const cva = cvaVariantsOfDts(dts)
  const ifaces = interfacesOfDts(dts)
  const props = {}
  const accepts = {}

  for (const c of componentsOfDts(dts)) {
    const fields = {}
    const bases = []
    // The parameter type is an intersection; each arm is either the module's
    // own shape (a declared interface, an inline object, a variant table) or a
    // base the component spreads. An interface arm is resolved rather than
    // recorded: `ButtonProps extends React.ButtonHTMLAttributes<…>,
    // VariantProps<typeof buttonVariants>` carries the variant table one level
    // down, and stopping at the interface name is how `variant` and `size` —
    // the two props anybody actually needs to look up — went missing on the
    // first pass. Hence a worklist, with a seen-set so a self-referential
    // extends cannot spin.
    const work = dropRefAttributes(c.type).split(/\s&\s/)
    const done = new Set()
    while (work.length) {
      const arm = work.shift().trim()
      if (!arm || done.has(arm)) continue
      done.add(arm)
      const iface = ifaces[arm] ?? ifaces[arm.replace(/^(?:Omit|Pick)<\s*/, '').replace(/\s*,[\s\S]*$/, '')]
      if (iface) {
        Object.assign(fields, iface.fields)
        // Top-level commas only: `Pick<A, "x" | "y">` must stay one arm.
        if (iface.extends) work.push(...splitTopLevel(iface.extends))
        continue
      }
      const variantOf = arm.match(/^VariantProps<typeof (\w+)>$/)
      if (variantOf && cva[variantOf[1]]) {
        Object.assign(fields, cva[variantOf[1]])
        for (const [k, v] of Object.entries(cvaDefaultsOfSource(src, variantOf[1]))) {
          if (fields[k]) fields[k].default = v
        }
        continue
      }
      if (arm.startsWith('{')) {
        Object.assign(fields, fieldsOfBody(arm.replace(/^\{|\}$/g, '').replace(/;\s*/g, ';\n')))
        continue
      }
      bases.push(arm)
    }
    for (const [k, v] of Object.entries(defaultsOfSource(src, c.name))) {
      if (fields[k]) fields[k].default = v
    }
    if (Object.keys(fields).length) props[c.name] = fields
    if (bases.length) accepts[c.name] = bases.join(' & ')
  }
  return { props, accepts }
}

/**
 * The exported ROW and ITEM shapes — `CurvePoint`, `DiscoveryEvent`,
 * `Integration`, `VerifyRequirement`.
 *
 * Separate from the prop table because they are a different question. A prop
 * says what the component accepts; these say what one entry in a list it renders
 * looks like, and half the reuse in this package is "the row's `note` is a
 * ReactNode, so a chip goes there as easily as a sentence". Without them, a
 * claim about a row cites nothing and is rejected as a guess.
 */
export function typesOf(src) {
  const out = {}
  for (const m of src.matchAll(/export interface (\w+)(?: extends \w+)? \{([\s\S]*?)\n\}/g)) {
    const name = m[1]
    if (name.endsWith('Props')) continue
    const fields = {}
    for (const f of m[2].matchAll(/^ {2}(\w+)(\??):\s*([^\n]+?),?$/gm)) {
      fields[f[1]] = { type: f[3].trim().replace(/,$/, ''), required: f[2] !== '?' }
    }
    if (Object.keys(fields).length) out[name] = fields
  }
  return out
}

/**
 * Override surfaces: what a caller can and cannot reach from outside.
 *
 * The second-biggest class of reuse advice in this package is not about props at
 * all — it is "the accent is an inline style, so a `text-*` utility will not win
 * against it", or "there is no `use client` here, so no disclosure behaviour".
 * Those claims are checkable, just not against the prop table, so they are
 * derived here and `via` may cite them.
 *
 * `style` means the module writes at least one inline style, which beats every
 * class a caller passes. `className` means the root merges one through `cn`.
 * `custom-properties` are the `--…` names it reads or sets, which is the third
 * way a caller can reach in.
 */
export function mechanismsOf(src) {
  const code = stripComments(src)
  const out = []
  if (/style=\{\{/.test(code)) out.push('style')
  if (/className,?\s*\)/.test(code) || /cn\(/.test(code)) out.push('className')
  if (/^['"]use client['"]/.test(src.trimStart())) out.push('use client')
  const vars = [...new Set([...code.matchAll(/(--[a-z][\w-]*)/g)].map((m) => m[1]))]
  return { surfaces: out, customProperties: vars.filter((v) => !v.startsWith('--color-')).slice(0, 8) }
}

/** Case names are read out of the gallery, so a rename there breaks the link loudly. */
const galleryCases = new Set(
  [...readFileSync(resolve(ROOT, GALLERY), 'utf8').matchAll(/<Case[\s\S]{0,200}?name="([^"]+)"/g)].map(
    (m) => m[1],
  ),
)
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
export function seenOf(layer, singular, module) {
  const explicit = EXPLICIT[`${layer}/${module}`]
  if (explicit) return explicit.filter((c) => galleryCases.has(c))
  const guess = `${singular}-${module}`
  return galleryCases.has(guess) ? [guess] : []
}

/** Every module in the package, with everything derivable about it. */
export function derive() {
  const out = []
  for (const { dir, layer, singular } of LAYERS) {
    for (const file of readdirSync(resolve(ROOT, dir)).sort()) {
      if (!file.endsWith('.tsx') && !file.endsWith('.ts')) continue
      const module = file.replace(/\.tsx?$/, '')
      const src = readFileSync(resolve(ROOT, dir, file), 'utf8')
      // `ui/*` is read from `dist/*.d.ts` unconditionally, the other two layers
      // from their own source with the `.d.ts` as the fallback.
      //
      // Not a preference — `propsOf` is wrong on shadcn source and right on
      // ours, because the two are written in different dialects. Our interfaces
      // separate members with `,` and shadcn's with `;`, and `propsOf`'s field
      // pattern only strips the comma: `ui/card`'s `variant` derived as the
      // type `CardVariant;`, semicolon included, and every consumer looking it
      // up got a type that does not exist. That is also why nine `ui/*` modules
      // looked covered — they declare an `XProps` interface, so `propsOf`
      // matched and produced a table with the wrong types in it and no
      // defaults, while the other 21 produced nothing at all.
      //
      // The `.d.ts` has neither problem: `tsc` has already resolved
      // `VariantProps<…>` into its literal union and normalised the members, so
      // one path covers all 30. `propsOf`'s comma-only strip is fixed below
      // regardless, because a latent parser bug is not a thing to leave in
      // place because nothing currently reaches it.
      const ownProps = propsOf(src)
      const fromDts =
        layer !== 'ui' && Object.keys(ownProps).length
          ? { props: ownProps, accepts: {} }
          : dtsContractOf(layer, module, src)
      out.push({
        key: `${layer}/${module}`,
        layer,
        module,
        import: `@skene/design-system/${layer === 'ui' ? 'ui' : layer}/${module}`,
        exports: exportsOf(src),
        client: src.trimStart().startsWith("'use client'") || src.trimStart().startsWith('"use client"'),
        composes: composesOf(src),
        polarity: polarityOf(src),
        seen: seenOf(layer, singular, module),
        overrides: mechanismsOf(src),
        props: fromDts.props,
        accepts: fromDts.accepts,
        types: typesOf(src),
      })
    }
  }
  return out
}

/* ── YAML emission ────────────────────────────────────────────────────────── */

const needsQuote = (s) =>
  s === '' || /^[-?:,[\]{}#&*!|>'"%@`]/.test(s) || /:\s|\s#|^\s|\s$|[\n"']/.test(s) || /^(yes|no|true|false|null|on|off)$/i.test(s)

const scalar = (v) => {
  if (typeof v === 'boolean' || typeof v === 'number') return String(v)
  const s = String(v)
  return needsQuote(s) ? JSON.stringify(s) : s
}

/**
 * A scalar sitting INSIDE a `{ … }` flow mapping, where the rules are stricter.
 *
 * `type: CurvePoint[]` is valid as a block scalar and invalid in flow: the `[`
 * opens a sequence and the parser dies on the next comma. That shipped — 26
 * prop types, every array in the package, in the one file README.md tells an
 * agent to read first. A consumer calling yaml.load got an exception; one with
 * a try/except got silence and fell back to guessing, which is precisely what
 * this file exists to prevent.
 *
 * So flow scalars are quoted on any indicator, not just the block set.
 */
const flowScalar = (v) => {
  if (typeof v === 'boolean' || typeof v === 'number') return String(v)
  const s = String(v)
  return needsQuote(s) || /[[\]{},]/.test(s) ? JSON.stringify(s) : s
}

/** Folded block for prose, so a paragraph stays readable at 80 columns. */
function block(text, indent) {
  const pad = ' '.repeat(indent)
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > 78 - indent) {
      lines.push(line.trim())
      line = w
    } else line = (line + ' ' + w).trim()
  }
  if (line) lines.push(line.trim())
  return `>-\n${lines.map((l) => pad + l).join('\n')}`
}

function emit(entry, authored) {
  const L = []
  const p = (s) => L.push(s)
  p(`  ${entry.key}:`)
  p(`    import: ${scalar(entry.import)}`)
  p(`    exports: [${entry.exports.join(', ')}]`)
  if (entry.client) p(`    client: true`)
  if (entry.composes.length) p(`    composes: [${entry.composes.join(', ')}]`)
  p(`    polarity: ${entry.polarity}`)
  p(`    seen: [${entry.seen.join(', ')}]`)
  if (entry.overrides.surfaces.length) p(`    overrides: [${entry.overrides.surfaces.join(', ')}]`)
  if (entry.overrides.customProperties.length)
    p(`    customProperties: [${entry.overrides.customProperties.join(', ')}]`)

  const propOwners = Object.keys(entry.props)
  if (propOwners.length) {
    p(`    props:`)
    for (const owner of propOwners) {
      p(`      ${owner}:`)
      for (const [name, meta] of Object.entries(entry.props[owner])) {
        const bits = [`type: ${flowScalar(meta.type)}`]
        if (meta.required) bits.push('required: true')
        if (meta.default !== undefined) bits.push(`default: ${flowScalar(meta.default)}`)
        p(`        ${name}: { ${bits.join(', ')} }`)
      }
    }
  }

  const acceptOwners = Object.keys(entry.accepts ?? {})
  if (acceptOwners.length) {
    p(`    accepts:`)
    for (const owner of acceptOwners) p(`      ${owner}: ${scalar(entry.accepts[owner])}`)
  }

  const typeNames = Object.keys(entry.types)
  if (typeNames.length) {
    p(`    types:`)
    for (const name of typeNames) {
      p(`      ${name}:`)
      for (const [field, meta] of Object.entries(entry.types[name])) {
        p(`        ${field}: { type: ${flowScalar(meta.type)}${meta.required ? ', required: true' : ''} }`)
      }
    }
  }

  if (!authored) {
    p(`    # TODO: no authored context yet — see scripts/context-data.json`)
    return L.join('\n')
  }

  p(`    useFor: ${block(authored.useFor, 6)}`)
  // The inverse index. useFor answers "what is this for"; intent answers
  // "what do I have for this job", which is the question an agent building a
  // page actually asks. Tags come from the controlled `intents` vocabulary at
  // the head of the file — see __tests__/context.test.ts.
  if (authored.intent?.length) p(`    intent: [${authored.intent.join(', ')}]`)
  for (const [field, itemKey] of [['alsoFor', 'claim'], ['watchFor', 'note']]) {
    if (!authored[field]?.length) continue
    p(`    ${field}:`)
    for (const item of authored[field]) {
      p(`      - ${itemKey}: ${block(item[itemKey], 10)}`)
      p(`        via: ${scalar(item.via)}`)
    }
  }
  if (authored.notFor?.length) {
    p(`    notFor:`)
    for (const item of authored.notFor) {
      p(`      - instead: ${scalar(item.instead)}`)
      p(`        why: ${block(item.why, 10)}`)
    }
  }
  if (authored.sameAs?.length) p(`    sameAs: [${authored.sameAs.join(', ')}]`)
  return L.join('\n')
}

/**
 * The controlled vocabulary, emitted ahead of the modules so it is the first
 * thing read. It is a contract rather than folklore precisely because it is
 * closed: `__tests__/context.test.ts` rejects a module tag that is not declared
 * here, and a tag declared here that no module uses. A vocabulary that anyone
 * can extend at the call site indexes nothing — twenty tags that mean one thing
 * each beat eighty that overlap.
 */
function emitIntents(intents) {
  const lines = ['intents:']
  for (const [tag, definition] of Object.entries(intents ?? {})) {
    lines.push(`  ${tag}: ${block(definition, 4)}`)
  }
  return lines.join('\n')
}

export function render(entries, data) {
  const authored = new Map(data.modules.map((m) => [m.module, m]))
  const counts = entries.reduce((a, e) => ({ ...a, [e.layer]: (a[e.layer] ?? 0) + 1 }), {})
  const written = entries.filter((e) => authored.has(e.key)).length

  const head = `# @generated by scripts/build-context.mjs — do not edit.
# Authored half: scripts/context-data.json. Derived half: the source files.
#
# WHAT THIS IS: which component to reach for, and what each one can also be used
# for. machine/components.yaml says what you must not do; this says what the
# thing is good for. Read this first, then that.
#
# Every alsoFor/watchFor entry carries \`via\`, naming the prop, default or export
# that makes the claim true. A claim with no via does not ship — see
# __tests__/context.test.ts.
#
# polarity: applies-light | applies-dark | applies-both | inherits
#   Whether the module puts a theme class on its own root. A light surface on a
#   dark page needs one, and a missing one renders cream on cream.
# seen: gallery case ids under docs-app /components. An empty list means nothing
#   in this repository has ever rendered it — treat its claims as unproven. The
#   ids resolve in the shipped \`@skene/design-system/inventory.json\`, which
#   carries every module's cases, exports and line count beside the ten resolved
#   design decisions. Until 2026-08-27 that file sat outside \`files\`, so a
#   \`seen:\` entry was a pointer a consuming agent could not follow.
# overrides: what a caller can reach from outside. style means the module writes
#   at least one inline style, which beats any class you pass; className means
#   the root merges yours through cn; use client means it carries the directive.
# intent: the reverse index. Every entry below answers \"what is this module
#   for\"; intent answers the question an agent building a page asks instead —
#   \"I need a band that contrasts two options, what do I have?\". Grep the
#   \`intents:\` vocabulary below for the job, then grep this file for the tag.
#   Tags are a closed set: only what \`intents:\` declares can appear.
# props: the module's OWN fields, per export. Read from an \`export interface
#   <Owner>Props\` in the source where one exists, and otherwise from the
#   shipped \`dist/<layer>/<module>.d.ts\` — which is how the whole \`ui/*\`
#   layer is covered, since shadcn declares its parameter types inline.
#   Defaults come from the implementation: a destructuring default, or a cva
#   \`defaultVariants\` block.
# accepts: the base type each export spreads onto its element. It is why
#   \`onClick\`, \`id\` and \`aria-*\` work on a module that declares none of
#   them, and it is the difference between "this takes three props" and "this
#   takes three props and everything a <button> takes".

version: "1.0.0"
counts: { modules: ${entries.length}, ui: ${counts.ui ?? 0}, patterns: ${counts.patterns ?? 0}, sections: ${counts.sections ?? 0}, authored: ${written}, assets: ${deriveAssets().length}, intents: ${Object.keys(data.intents ?? {}).length} }

${emitIntents(data.intents)}
modules:`
  const body = [head, ...entries.map((e) => emit(e, authored.get(e.key)))].join('\n')
  return body + emitAssets(deriveAssets(), data.assets) + '\n'
}

/* ── assets ───────────────────────────────────────────────────────────────── */

/**
 * The illustrations were the one part of this package with no machine context.
 * `machine/context.yaml` answered "which module do I reach for" for all 79 code
 * modules and said nothing about the eleven files they paint, so an agent
 * changing a page could find the component and then had to read prose to learn
 * which field belongs behind which artifact. The pairing is not decorative —
 * the three card fields follow the live site, so the same backdrop always sits
 * behind the same kind of artifact.
 *
 * Derived here: the key, the file, its weight, and which modules reference it.
 * Authored in context-data.json: useFor and notFor, same contract as a module.
 */
function deriveAssets() {
  const src = readFileSync(resolve(ROOT, 'src/asset-urls.ts'), 'utf8')
  const out = []
  // `/** doc */\n  key: new URL('../assets/file', …)`
  // The negative lookahead matters: without it the capture runs from the FILE
  // doc comment all the way to the first key, and every asset inherits the
  // module's description instead of its own. Caught by reading the output.
  const re = /\/\*\*((?:(?!\*\/)[\s\S])*?)\*\/\s*(\w+):\s*new URL\('\.\.\/assets\/([^']+)'/g
  for (const m of src.matchAll(re)) {
    const doc = m[1].replace(/\s*\*\s*/g, ' ').trim()
    const key = m[2]
    const file = m[3]
    let bytes = 0
    try {
      bytes = statSync(resolve(ROOT, 'assets', file)).size
    } catch {}
    const usedBy = []
    for (const { dir, layer } of LAYERS) {
      for (const f of readdirSync(resolve(ROOT, dir))) {
        if (!f.endsWith('.tsx')) continue
        const body = readFileSync(resolve(ROOT, dir, f), 'utf8')
        if (body.includes(file)) usedBy.push(`${layer}/${f.replace(/\.tsx$/, '')}`)
      }
    }
    out.push({ key, file, bytes, doc, usedBy: usedBy.sort() })
  }
  return out
}

function emitAssets(assets, authored) {
  const by = new Map((authored ?? []).map((a) => [a.key, a]))
  const lines = ['', 'assets:']
  for (const a of assets) {
    const w = by.get(a.key)
    lines.push(`  ${a.key}:`)
    lines.push(`    import: "import { assetUrls } from '@skene/design-system/asset-urls'"`)
    lines.push(`    file: assets/${a.file}`)
    lines.push(`    bytes: ${a.bytes}`)
    lines.push(`    kind: ${a.file.endsWith('.svg') ? 'mark' : 'texture'}`)
    lines.push(`    usedBy: [${a.usedBy.join(', ')}]`)
    if (a.doc) lines.push(`    is: ${block(a.doc, 6)}`)
    if (w?.useFor) lines.push(`    useFor: ${block(w.useFor, 6)}`)
    if (w?.notFor) lines.push(`    notFor: ${block(w.notFor, 6)}`)
  }
  return lines.join('\n')
}

/* ── main ─────────────────────────────────────────────────────────────────── */

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const data = JSON.parse(readFileSync(DATA, 'utf8'))
  const entries = derive()
  const next = render(entries, data)
  const check = process.argv.includes('--check')
  const current = (() => {
    try {
      return readFileSync(OUT, 'utf8')
    } catch {
      return null
    }
  })()

  if (check) {
    if (current !== next) {
      console.error('context:check FAILED — machine/context.yaml is stale. Run `npm run context`.')
      process.exit(1)
    }
    const authored = data.modules.length
    console.log(`context in sync — ${entries.length} modules, ${authored} authored`)
  } else {
    writeFileSync(OUT, next)
    console.log(
      `context: ${entries.length} modules, ${data.modules.length} authored -> ${OUT}`,
    )
  }
}
