/**
 * The chip cluster, tabulated — as a test rather than as a table.
 *
 * `docs/sections.md` §2 is the record of this package's messiest overlap: seven
 * small-label shapes, five radii, three sizes. Its most useful sentence is about
 * how the table itself failed:
 *
 *   PlanCard's tier chip and WindowStatus were almost the same spec reached
 *   independently, agreeing on radius, size, mono, uppercase and padding, and
 *   disagreeing on exactly one value: tracking, 0.05em against 0.08em. Earlier
 *   revisions of that table had no tracking column and so recorded them as
 *   identical. "An unmanaged cluster drifts in the column nobody is looking at."
 *
 * A prose table cannot fix that, because the fix is to keep looking. This file
 * is the looking. Two halves:
 *
 *   REGISTRY  — every chip's measured spec, pinned to its source. A chip whose
 *               radius, size, voice or tracking moves fails here, including in
 *               a column a future editor forgets to widen the table for.
 *   COVERAGE  — every chip-shaped class literal in `src` is classified, as a
 *               chip or explicitly as something else. A tenth shape cannot land
 *               unnoticed, which is how the cluster grew from the documented
 *               seven to the nine below without anyone writing it down.
 *
 * Adding a chip means adding a REGISTRY row. That is the cost, and it is the
 * point: the cluster is allowed to grow, it is not allowed to grow silently.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '..')
const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8')

type Spec = {
  /** Where it is drawn. */
  file: string
  /**
   * A distinctive slice of the class literal, used to find it. It is not a
   * stable id and is not meant to be: editing the chip's own geometry is what
   * should bring someone here.
   */
  anchor: string
  radius: string
  /** As authored — a utility, or the custom property when it comes from style. */
  size: string
  mono: boolean
  upper: boolean
  /** The column whose absence let two chips read as identical. */
  tracking: string | null
  /**
   * Set when the chip does not draw its own geometry but composes another and
   * overrides one value. Radius, size and voice are then asserted against that
   * chip's file — which is the honest reading, since changing `Chip` changes
   * this one too, and a row that restated the numbers locally would go on
   * claiming them after `Chip` moved.
   */
  composes?: string
  /** What the shape is FOR. The reason two rows may look alike and both stay. */
  carries: string
}

/**
 * Nine, not the seven docs/sections.md tabulates. `TagChip` and `CheckChip` are
 * the two it never had — the same 11px mono tag written twice, in parallel, and
 * recorded as a KNOWN DUPLICATE in `evaluator-check.tsx`'s own header rather
 * than in the table that exists to hold exactly this.
 */
const CHIPS: Record<string, Spec> = {
  Badge: {
    file: 'src/ui/badge.tsx',
    anchor: 'inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold',
    radius: 'rounded-sm',
    size: 'text-xs',
    mono: false,
    upper: false,
    tracking: null,
    carries: 'product-surface status — Active, Pending, Archived',
  },
  Eyebrow: {
    file: 'src/patterns/marketing.tsx',
    anchor: 'inline-block rounded-sm border px-2 py-1 font-mono uppercase',
    radius: 'rounded-sm',
    // Not a utility: the only chip whose size and tracking come from tokens
    // through `style`, which is why it is the only one that can claim
    // font.tracking.eyebrow.
    size: 'var(--font-size-pill)',
    mono: true,
    upper: true,
    tracking: 'var(--font-tracking-eyebrow)',
    carries: 'the section-heading kicker on a marketing band',
  },
  StatChipAndMetaChip: {
    file: 'src/sections/stat-chip.tsx',
    anchor: 'inline-flex items-center rounded-full border px-3 py-1 text-[12px] leading-none',
    radius: 'rounded-full',
    size: 'text-[12px]',
    mono: false,
    upper: false,
    tracking: null,
    carries: 'prose beside a heading — a fact ("121 stars") or a promise ("… ROADMAP")',
  },
  Chip: {
    file: 'src/sections/chip.tsx',
    anchor: 'shrink-0 rounded-[5px] px-[7px] py-1 font-mono text-[10px] uppercase',
    radius: 'rounded-[5px]',
    size: 'text-[10px]',
    mono: true,
    upper: true,
    tracking: 'tracking-[0.08em]',
    carries: 'a state or an identity token — HEALTHY, LIVE, a plan tier',
  },
  WindowStatus: {
    file: 'src/sections/product-window.tsx',
    // Composes Chip and overrides one value. That override IS the row: it is
    // the 0.05em against Chip's 0.08em, carried rather than flattened because
    // both shipped and both were signed off in a browser.
    anchor: "tracking-[0.05em]",
    radius: 'rounded-[5px]',
    size: 'text-[10px]',
    mono: true,
    upper: true,
    tracking: 'tracking-[0.05em]',
    composes: 'Chip',
    carries: "the window title bar's right-hand status slot",
  },
  WindowChip: {
    file: 'src/sections/product-window.tsx',
    anchor: 'rounded-md px-[9px] py-1.5 font-mono text-[11px] uppercase',
    radius: 'rounded-md',
    size: 'text-[11px]',
    mono: true,
    upper: true,
    tracking: null,
    carries: "a toolbar's filter or breadcrumb segment",
  },
  TagChip: {
    file: 'src/sections/key-value-table.tsx',
    anchor: 'rounded-sm border px-[8px] py-[1px]',
    radius: 'rounded-sm',
    size: 'text-[11px]',
    mono: true,
    upper: false,
    tracking: null,
    carries: 'an identifier reproduced verbatim — Secret, a table name, an operand role',
  },
  CheckChip: {
    file: 'src/sections/evaluator-check.tsx',
    anchor: 'max-w-full rounded-sm px-[8px] py-[1px] font-mono text-[11px] font-normal',
    radius: 'rounded-sm',
    size: 'text-[11px]',
    mono: true,
    upper: false,
    tracking: null,
    carries: 'the same identifier as TagChip — see the duplicate assertion below',
  },
  StatPill: {
    file: 'src/sections/artifact-shell.tsx',
    anchor: 'whitespace-nowrap rounded-full border px-[8px] py-[4px] font-sans text-[11px]',
    radius: 'rounded-full',
    size: 'text-[11px]',
    mono: false,
    upper: false,
    tracking: null,
    carries: "an artifact header's measured status",
  },
}

describe('chip registry — every shape still measures what the table says', () => {
  it.each(Object.entries(CHIPS))('%s', (name, spec) => {
    const src = read(spec.file)
    expect(src, `${name}: anchor not found in ${spec.file} — the chip moved or was reworded`).toContain(
      spec.anchor,
    )

    // Geometry is asserted where it is drawn: the chip's own file, or the one
    // it composes. The window around the anchor covers the `style` block for
    // the single chip whose size is a custom property rather than a utility.
    const geometry = spec.composes ? read(CHIPS[spec.composes].file) : src
    const at = geometry.indexOf(spec.composes ? CHIPS[spec.composes].anchor : spec.anchor)
    const region = geometry.slice(Math.max(0, at - 400), at + 600)

    expect(region, `${name}: radius`).toContain(spec.radius)
    expect(region, `${name}: size`).toContain(spec.size)
    expect(region.includes('font-mono'), `${name}: mono`).toBe(spec.mono)
    expect(region.includes('uppercase'), `${name}: uppercase`).toBe(spec.upper)
    // Tracking is asserted on the chip's OWN file either way: it is the column
    // WindowStatus overrides, and the whole reason this row exists.
    if (spec.tracking) expect(src, `${name}: tracking`).toContain(spec.tracking)
  })

  it('every row says what it carries, because look-alike is not the question', () => {
    // Two chips may measure the same and both stay — StatChip and MetaChip do,
    // deliberately, since a flag would let a roadmap marker default into a live
    // claim. What is never allowed is a row that cannot say what it is for.
    for (const [name, spec] of Object.entries(CHIPS)) {
      expect(spec.carries.length, `${name} has no stated job`).toBeGreaterThan(20)
    }
  })

  it('point 2 holds: Badge stays product-side, Eyebrow stays marketing-side', () => {
    // docs/sections.md §2 point 2 is a decision to keep two chips apart, and it
    // sat labelled "not yet applied" for a fortnight because there was nothing
    // to apply. A standing decision with nothing behind it is indistinguishable
    // from a forgotten one, so it gets a gate instead of a label.
    const ui = readdirSync(resolve(ROOT, 'src/ui'))
    for (const f of ui) {
      expect(read(`src/ui/${f}`), `${f} reaches for the marketing kicker`).not.toMatch(/\bEyebrow\b/)
    }

    // Badge is the product-surface primitive. One section imports it —
    // `evaluator-check`, whose CheckChip sits inside a DEPICTION of a product
    // surface, which is the same side of the line. A second importer is a
    // question, not a failure: add it here with its reason, or use Eyebrow.
    const importers = ['src/sections', 'src/patterns'].flatMap((dir) =>
      readdirSync(resolve(ROOT, dir))
        .filter((f) => /\.tsx?$/.test(f))
        .filter((f) => /from '\.\.\/ui\/badge/.test(read(`${dir}/${f}`)))
        .map((f) => `${dir}/${f}`),
    )
    expect(importers).toEqual(['src/sections/evaluator-check.tsx'])
  })

  it('TagChip and CheckChip are still the same spec, which is the open item', () => {
    // Recorded, not laundered. `evaluator-check.tsx` names this duplicate in its
    // own header and asks for one of the two to win. Since then `TagChip` has
    // won by adoption — `evaluator-verify.tsx` and `lifecycle-canvas.tsx` both
    // import it, so two of the three modules in this artifact family already
    // render it and only `evaluator-check` keeps a private copy.
    //
    // This asserts the duplicate rather than the fix, so that resolving it is
    // what turns this test red and makes someone delete the assertion. Left
    // failing-open on purpose: merging them changes CheckChip's box from a
    // `div`/`inline-flex` to TagChip's `span`/`inline-block`, which moves
    // pixels, and this repository does not change pixels without regenerating
    // `docs-app/tests/__screenshots__` in the Playwright container.
    const t = CHIPS.TagChip
    const c = CHIPS.CheckChip
    expect([c.radius, c.size, c.mono, c.upper, c.tracking]).toEqual([
      t.radius,
      t.size,
      t.mono,
      t.upper,
      t.tracking,
    ])
    expect(read('src/sections/evaluator-check.tsx'), 'the duplicate is no longer recorded').toContain(
      'KNOWN DUPLICATE',
    )
  })
})

/**
 * Chip-shaped class literals in `src`, and what each one is.
 *
 * Deliberately a wide net over a clever one: a radius, a small type size, and a
 * fill or a border on one line. It catches round things that are not chips, and
 * those get named here rather than filtered by a heuristic that would also hide
 * the next real chip. Keyed by a slice of the literal, so a chip whose geometry
 * changes fails here as well as in the registry.
 */
const NOT_A_CHIP: Array<[string, string]> = [
  ['rounded-[4px] px-4 py-2 font-mono text-xs', 'pill-nav-mobile-menu: the drawer trigger, a button'],
  ['z-[200] overflow-hidden rounded-md border', 'ui/tooltip: the floating panel'],
  ['h-[34px] w-[34px] shrink-0 items-center justify-center self-start rounded-full', 'journey-track: a step node'],
  ['gap-[10px] rounded-lg px-[10px] py-[8px] text-[13px]', 'evaluator-panel: a detail row, not a label'],
  ['size-8 shrink-0 items-center justify-center overflow-hidden rounded-full', 'ask-widget: the avatar'],
  ['rounded-full bg-brand-peach px-5 py-2.5 text-[13px] font-medium', 'ask-widget: the submit button'],
  ['h-7 w-7 shrink-0 place-items-center rounded-full border', 'faq-band: the open/close toggle'],
  ['size-[24px] shrink-0 place-items-center rounded-full bg-brand-peach', 'pr-review: the comment count circle'],
  ['h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border', 'pipeline-stepper: a step node'],
]

/**
 * Chip-shaped, and NOT in the registry above, each with why it is out of scope.
 * An entry here is a deferral in the open — the same shape as
 * `stories/BACKLOG.json`. It may shrink; it should not grow.
 */
const UNTABULATED: Array<[string, string]> = [
  [
    'rounded-full px-2.5 py-1 text-[12px] leading-none text-text-primary',
    'surface-tiles: the selected tile marker, scoped to one component',
  ],
  [
    'inline-block rounded-md border border-chrome-line-on-light bg-brand-light px-2.5 py-1.5 font-mono text-[12px]',
    "surface-tiles: SurfaceDetail's `code` chip — a command, documented as a mono chip rather than a terminal",
  ],
  [
    'whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium',
    'card-animation-integrations: a status pill inside a scene with no gallery case (seen: [])',
  ],
  [
    'inline-block rounded-lg border border-black/12 bg-[#faf1e9] px-1.5 py-0.5 font-mono text-xs',
    'card-animation-integrations: a mono chip on hardcoded hex, in the same unproven scene',
  ],
  [
    'rounded-full border border-terminal-chrome-github-border px-[8px] py-[4px] font-sans text-[11px]',
    'pr-review: a GitHub-chrome meta chip, deliberately borrowing GitHub’s palette rather than this package’s',
  ],
]

describe('chip coverage — no tenth shape lands untabulated', () => {
  const found: string[] = []
  const walk = (dir: string) => {
    for (const e of readdirSync(resolve(ROOT, dir), { withFileTypes: true })) {
      if (e.isDirectory()) walk(`${dir}/${e.name}`)
      else if (/\.tsx?$/.test(e.name)) {
        for (const line of read(`${dir}/${e.name}`).split('\n')) {
          for (const m of line.matchAll(/'([^']*rounded-[^']*)'|"([^"]*rounded-[^"]*)"/g)) {
            const s = m[1] ?? m[2]
            if (!/text-\[(9|10|11|12|13)px\]|text-xs/.test(s)) continue
            if (!/border|bg-|px-/.test(s)) continue
            found.push(s)
          }
        }
      }
    }
  }
  walk('src')

  const classified = [
    ...Object.values(CHIPS).map((c) => c.anchor),
    ...NOT_A_CHIP.map(([k]) => k),
    ...UNTABULATED.map(([k]) => k),
  ]

  it('finds the cluster at all, so a broken scan cannot pass by finding nothing', () => {
    expect(found.length).toBeGreaterThan(12)
  })

  it('every chip-shaped literal is either registered or explained', () => {
    const orphans = found.filter((s) => !classified.some((k) => s.includes(k)))
    expect(
      orphans,
      'a new small-label shape. Add a REGISTRY row if it is a chip, or a NOT_A_CHIP / UNTABULATED line saying what it is',
    ).toEqual([])
  })

  it('the deferral list only names shapes that still exist', () => {
    const stale = [...NOT_A_CHIP, ...UNTABULATED].filter(([k]) => !found.some((s) => s.includes(k)))
    expect(stale.map(([, why]) => why), 'classified, but no longer in the source').toEqual([])
  })
})
