# Sections — which one to use

> Machine-readable companion: `machine/context.yaml` carries the same judgement
> per module, plus the derived prop table each claim is checked against. This
> file is the prose; that file is the one to grep.

There was no guidance for this. `docs/` predates sections entirely, the README
does not mention them, and `machine/components.yaml` covers primitives and
sections but not patterns. Everything below is measured from the source, not
recalled.

## The three layers, and how to tell which you want

| layer | is | example | import |
|---|---|---|---|
| `ui/` | a **control** | `Button`, `Table` | `@skene/design-system/ui/button` |
| `patterns/` | **page furniture** — a recurring treatment, not a whole band | `Eyebrow`, `PillNav`, `DitherOverlay` | `.../patterns/marketing` |
| `sections/` | a **whole band of a page**, carrying layout and an argument | `FeatureRow`, `PlanCard`, `FinalCta` | `.../sections/feature-row` |

If you are reaching for a section to render one small thing, you want a pattern
or a primitive. If you are composing four primitives and re-deriving a layout,
the section probably already exists.

## Decision paths

**I need a band with copy on one side and a visual on the other.**
Dark → `FeatureRow`. Cream/inverted → `LightSectionCard`. They are the same
shape at opposite polarity; see the overlap note below.

**I need to frame a screenshot or mock.**
A customer's product, or Skene's own UI → `ProductWindow` (`tone="light"` is the
default and means the customer's tool; `tone="dark"` reads as Skene's). Code,
CLI output, a diff → `Terminal`.

**I need texture behind something.** Four things do this; pick by scope:

| use | when |
|---|---|
| `SectionBackdrop` | a halftone field behind a mock **inside a feature row** |
| `HeroBackdrop` | a dark hero **strip** fading into the page |
| `DitheredMedia` | a **full hero composition** — media, dither, gradient, content |
| `DitherOverlay` | the raw **layer**, when you are composing your own stack |

**I need Skene to say something on the page.** `AgentCallout` — avatar, claim,
evidence. Not a paragraph under a chart: a bare sentence there reads as a
caption, and this is a verdict. The avatar defaults to `SkeneMark`, which is the
real symbol; do not draw a ring or a letter "S" as a stand-in anywhere.

**I need to show a state versus a suggestion.** A measured state → `Finding`
(status `good | warn | danger`) or `ScoreRing` for a score out of a scale. A
proposal → `RecommendationCard`, which deliberately has no status colour: an
amber pill on a suggestion teaches the reader that amber means two things.

**I need questions and answers.** `FaqBand` + `FaqRow` — the cream band, the
two-column split, the hairline per row and the round toggle. `ui/accordion` is
the primitive underneath and is the wrong level to compose a band from.

**I need to show which surface Skene runs on.** `SurfaceTiles` + `SurfaceTile`,
with `SurfaceDetail` as a sibling under the row. Not `OverviewTiles` — that one
is caption/number/note and nothing in it can be "selected".

**I need a stack of numbered steps inside a cream card.**
`LightSectionCard` with `NumberedStep`s in `children` — but `NumberedStep` is
built from the invariant `chrome.text.*` roles, so on cream its heading and body
render `#faf1e9` on `#faf1e9`. Pass
`className="[&_h3]:text-text-primary [&>div]:text-text-muted"` until the pattern
takes theme-aware roles. The `light-section-card-steps` case renders it with the
overrides in place.

**I need a small label.** See the chip overlap below — this is the messiest area.

**I need to show one thing sitting between two others.**
`Bridge` — a cream band of N cards with arrows interleaved between them, one of
them `featured` and dark. The tone difference is the argument: three cards in one
tone read as three peers and the band says nothing. It is the package's one
*doubly* nested inversion (`light` band, `dark` card inside it), so read rule 2
below before changing anything in it.

**I need a closing call to action.**
Full-bleed textured band → `FinalCta` (ships `pixel-bg.webp` by default). A cream
panel with copy and buttons → `LightSectionCard`.

## Overlaps, measured — and the decision for each

### 1. `FeatureRow` vs `LightSectionCard` — keep both, fix the API — APPLIED

Near-identical prop sets, and they used to disagree on names for the same
concepts:

| concept | `FeatureRow` (was) | `LightSectionCard` | now |
|---|---|---|---|
| the line under the title | `subtitle` | `lede` | `lede` |
| the buttons | `action` | `actions` | `actions` |

**Decision: keep both components, standardise the names.** The polarity
difference is real — `LightSectionCard` carries the `light` class and inverts,
`FeatureRow` does not — and collapsing them into one with a `tone` prop would put
a load-bearing accessibility mechanism behind a styling-shaped flag. But two
names for one concept is drift that will be copied. Standardised on `lede` and
`actions`; `FeatureRow` was the one that moved.

Applied 2026-08-12. `FeatureRow` now takes `lede` and `actions`; the old names
are gone rather than aliased, because an alias keeps the drift readable in call
sites and this package has no external consumers to break. Note that `PlanCard`
keeps its own singular `action` — that is one button by design, not the same
slot, and it is not part of this rename.

### 2. Chips — nine shapes, six radii, four sizes — RESOLVED

| component | radius | size | mono | upper | tracking | carries |
|---|---|---|---|---|---|---|
| `Badge` (ui) | `rounded-sm` | `text-xs` | no | no | — | product status: Active, Pending |
| `Eyebrow` (pattern) | `rounded-sm` | `--font-size-pill` | yes | yes | `--font-tracking-eyebrow` | a section kicker |
| `StatChip` | `rounded-full` | 12px | no | no | — | a fact, in prose |
| `MetaChip` | `rounded-full` | 12px | part | part | `0.07em` on the state word | a promise, in prose |
| `Chip` | `rounded-[5px]` | 10px | yes | yes | `0.08em` | a state or tier token |
| `WindowStatus` | = `Chip` | = `Chip` | yes | yes | `0.05em` (override) | a window's status slot |
| `WindowChip` | `rounded-md` | 11px | yes | yes | — | a toolbar segment |
| `TagChip` | `rounded-sm` | 11px | yes | no | — | an identifier, verbatim |
| `CheckChip` | `rounded-sm` | 11px | yes | no | — | **the same identifier — duplicate** |

Nine, not the seven this table carried for two weeks. `TagChip` and `CheckChip`
are the two it never had, and they are the same eleven-pixel mono tag written
twice in parallel. `evaluator-check.tsx` records the duplicate in its own header
— "Both are defensible; two of them shipping is not" — which is the right
instinct filed in the wrong place: a duplicate recorded in one of the two files
is invisible from the other, and invisible to this table, which exists to hold
exactly this.

That is the same failure as the original entry below, one level up. The table
caught a drift in a column it had; it could not catch a row it did not have.

**The measurement that started this.** `PlanCard`'s inline tier chip and
`WindowStatus` were *almost the same spec reached independently* — agreeing on
`rounded-[5px]`, `font-mono`, `10px`, `uppercase` and `px-[7px] py-1`, and
disagreeing on exactly one value: tracking, `0.05em` against `0.08em`. Earlier
revisions of this table had no tracking column and so recorded them as
identical. They were not, and that omission is the point:

> An unmanaged cluster drifts in the column nobody is looking at.

**Decisions, in order of value:**

1. **`PlanCard`'s inline tier chip should not exist** — it is `WindowStatus`
   under another name. **Applied 2026-08-12.** `src/sections/chip.tsx` exports
   `Chip` with three tones (`neutral`, `healthy`, `live`); `PlanCard`'s tier
   marker and `WindowStatus` both render it. `WindowStatus` stays as the name
   for the title bar's right-hand slot, because a status is what a caller looks
   for there. Gallery case `section-chip`.

2. **`Badge` and `Eyebrow` stay, and stay apart.** `Badge` is the shadcn
   primitive for product-surface status; `Eyebrow` is the marketing
   section-heading kicker, and it is the only chip in the cluster whose size and
   tracking come from tokens through `style` rather than from utilities — which
   is what lets it claim `font.tracking.eyebrow`, a token that existed with
   nothing rendering it. **Standing, and it holds in the source:** `Eyebrow`
   appears in no file under `src/ui`, and the one place `Badge` is reached for
   outside a product surface is `CheckChip`, inside a *depiction* of one. This
   was never pending work; it was recorded as "not yet applied" when there was
   nothing to apply.

3. **`StatChip` / `MetaChip` keep the pill.** They were asked to adopt the
   window chips' rectangle or say why not. **Resolved: why not**, and the rule
   generalises — *a token gets the rectangle, prose gets the pill*. The window
   chips carry tokens (LIVE, PRO): short, grammarless, read as symbols, and
   correctly set in 10px mono caps. These two carry prose ("121 stars",
   "Turnkey dollar-revenue view"), where mono caps at 10px costs legibility and
   asserts a register the words do not have — the same objection `TagChip`'s
   header raises about uppercasing a table name. `MetaChip` is the proof: it
   already draws both treatments in one chip, prose in the pill's own type and
   the state word mono, uppercased and tracked, because that half *is* a token.
   The argument is written out in `src/sections/stat-chip.tsx`'s header; the
   private `Pill` stays parameterised so reopening it is one change, not two.

4. **`TagChip` vs `CheckChip` — decided, not yet applied.** `TagChip` has won by
   adoption: `evaluator-verify.tsx` and `lifecycle-canvas.tsx` both import it,
   so two of the three modules in this artifact family already render it and
   only `evaluator-check` keeps a private copy. Rendered side by side the two
   resolve to the same radius, padding, size, voice and both colour pairs;
   what differs is that `CheckChip` emits a `<div>` with `inline-flex` (it
   composes `ui/badge`, which contributes a `div`, a `data-slot` and focus-ring
   rules to an element that cannot take focus, while tw-merge overrides every
   visual property the primitive brought) against `TagChip`'s `<span>` with
   `inline-block` and the prototype's 4px flow margin. **`CheckChip` should
   become a `TagChip` alias** with `className="m-0"`, the escape `TagChip`'s
   header already documents for a flex parent.

   Not applied here because it moves pixels — `div`/`inline-flex` to
   `span`/`inline-block` changes vertical alignment against surrounding text —
   and `section-evaluator-check-{light,dark}-linux.png` would have to be
   regenerated with `npm run visual:update`, which needs the Playwright
   container. A refactor that changes pixels silently is not one.

**The table is now a test.** `__tests__/chip-cluster.test.ts` pins every row's
radius, size, voice and tracking against the source, and separately requires
that every chip-shaped class literal in `src` is either a registered row or a
named exception. A drift in a column nobody widened the table for fails; so does
a tenth shape landing unrecorded. Five shapes are in that file's `UNTABULATED`
list — a marker on a surface tile, `SurfaceDetail`'s `code` chip, two inside
`card-animation-integrations` (one of them on hardcoded hex, in a scene with no
gallery case), and `PrReview`'s GitHub-chrome meta chip, which borrows GitHub's
palette on purpose. That list is a deferral in the open, the same shape as
`stories/BACKLOG.json`: it may shrink, it should not grow.

### 3. `ProductWindow` vs `Terminal` — no change

Both frame content in a titled chrome, but `Terminal` is monospace with traffic
lights and `ProductWindow` inverts to light by default. They read as different
objects to a reader, which is the point.

## Rules that apply to every section

These were each a real bug in the session that built them.

1. **`chrome.*` is invariant and cannot invert.** Use it only on always-dark
   surfaces. Anything on a surface that flips uses the theme-aware `text.*` role.
2. **A light surface on a dark page needs the `light` class on its root**, or
   mode-aware tokens resolve to their dark value against the fill —
   `semantic.matcha`'s dark value `#d7f4ab` on `#faf1e9` is 1.08:1. (This read
   1.16:1, which is the retired figure for matcha's *light* value on a light
   surface, borrowed from a table that has since been corrected. Different pair,
   and that one now measures 4.50:1. The number here is the one that matters:
   what a missing `light` class actually renders.)
3. **Content is props.** No section hardcodes Skene copy.
4. **Interactive parts live in their own module**, so `use client` does not draw
   the boundary around server-renderable siblings.

## Known gaps

None from the captured demo. `journey-track`, `value-cards`, `question-grid`,
`trust-panel` and `comparison-table` shipped on 2026-08-12; `ScoreRing`,
`AgentCallout`, `RecommendationCard`, `FaqBand` and `SurfaceTiles` /
`SurfaceDetail` on 2026-08-13, closing the seven elements listed in
the 2026-08-13 gap analysis. `patterns/` now has its own
block in `machine/components.yaml`.

Visual coverage is a live gap again, and this paragraph is where it hid. The 16
product-artifact sections that carried no gallery case, and so no light/dark
baseline, each got one in `290a19f`, which took `noVisual` to 1: `sonner`, a
toast host that renders nothing until something calls it, so there is no state
to snapshot. That was true on 2026-08-15 and this paragraph went on asserting it
while 10 modules accumulated with no case:

    sonner                        pill-nav-frosted
    pill-nav-mobile-menu          card-animation-integrations
    code                          integrations-highlight
    journey-signal-scene          logo-row
    surface-cards                 team-card

`sonner` is the only justified one. The other nine are unproven — `seen: []` in
`machine/context.yaml`, whose own header says an empty list means nothing in
this repository has ever rendered the module, so treat its claims as unproven.

Two mechanisms failed here, not one. The list went stale because a hand-typed
count has no gate behind it — `__tests__/docs-counts.test.ts` now reads the
figure out of this paragraph and fails when it drifts. And `pill-nav-frosted`
was missing from `/decisions` entirely rather than merely uncounted:
`scripts/build-inventory.mjs` filtered on `.tsx`, and that module is the
package's only `.ts` one, so the page built to list everything listed 88 of 89.
Fixed; it now matches `build-context.mjs` and takes both extensions.

Filter `no visual` on `/decisions` for the live list — that page is generated
from the source, this paragraph is not, so trust it over this one.
