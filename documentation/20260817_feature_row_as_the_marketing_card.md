# `FeatureRow` becomes the marketing card, and the contract says so

**Status:** design, pre-implementation
**Raised by:** skene-site, on a founder instruction: *"The design system contract should enforce
always to use the FeatureRow components in the pages for the cards."*
**Supersedes:** the two `notFor` entries on `sections/feature-row` that route callers away to
`ui/card` and `LightSectionCard`.

## What changes

Today the contract offers three cards for a marketing page and lets the caller choose:

| shape | component | live count in skene-site |
|---|---|---|
| full band, copy beside a visual | `FeatureRow` | 50 |
| cell in a 2–3-up grid | `Card variant="surface"` | 51 |
| whole band, cream, inverted | `LightSectionCard` | 2 |

After this change there is one, and `machine/rules.yaml` carries it under `must:` so skene-site's
`design-system-rules.test.ts` — which reads rules out of the installed package at run time rather
than transcribing them — fails the build when a route renders a marketing card any other way.

## Why the current `notFor` entries are being reversed rather than deleted

Both were right about a real property and wrong about what follows from it.

**The 3-up grid entry** says *"This is a full page band with a 600px floor and a two-column split."*
The floor is no longer unconditional: v0.9.18 made a row with no `visual` drop its second cell, its
floor and its split grid. So the objection now applies only to a grid cell that carries a visual, and
skene-site's do not. The shape argument survives; the blocking argument does not.

**The cream-band entry** says the two components *"were kept separate rather than merged behind a
`tone` prop because the polarity difference is the `light` mechanism, not a style."* That is still
true and this change does not merge them. `LightSectionCard` keeps its export, its story and its
mechanism; what it loses is the claim to be a *marketing section band*, because a page that alternates
one repeating object cannot also alternate polarity without the cream band reading as a different
system — which is the exact defect this whole line of work started from.

## The cost, measured, so it is not rediscovered later

**The glossary is the sharp edge.** `/resources/glossary` renders 18 term cells at 159px each; the
page is 4,401px. As full bands *with* visuals they would be 18 × 624 = **11,232px**, and across all 51
cells the site would gain **30,600px** of forced minimum height.

The adopted answer is that grid cells convert to **copy-only** rows — no visual, so no floor — which
keeps them near their current height while making them `FeatureRow`. That is a real narrowing of
"every card looks the same": a copy-only row and a row with a visual are the same component and not
the same picture. It is recorded here rather than smoothed over, and it is one line to reverse.

**Alternation does not reach grid cells.** A 2-up cell has no side to mirror. The `L R L R` rhythm
this change exists to produce applies to section bands only.

**`light` is load-bearing where it is being removed.** Without it every mode-aware token in the
subtree keeps its dark value against a cream fill: `text.primary` resolves to `#faf1e9` on `#faf1e9`,
type that is absent rather than dim, and no build step catches it. The two conversions must be
measured against rendered pixels, not read.

## What was checked before writing the rule

- **A `density`/`compact` prop on `FeatureRow`** so a grid cell could keep its 159px. Rejected: the
  copy-only path added in 0.9.18 already produces a content-height row, so the prop would be a second
  mechanism for a result the component already gives.
- **A `tone` prop to absorb `LightSectionCard`.** Rejected again, for the reason `docs/sections.md`
  gives — the difference is the `light` mechanism, not a style — and this change does not need it.
- **Leaving the rule as documentation without a test.** Rejected on the evidence in the enforcing
  file's own header: `arbitrary_hex_in_classnames` and
  `import_primitives_from_the_package_not_a_local_copy` sat in `must`/`must_not` across three
  consuming applications with nothing checking either. A rule an agent reads and no machine enforces
  is a suggestion.

## Verification

1. `npm run verify` — 226 passed | 8 skipped today. The four red contrast rows are the pre-existing
   waived pairs (the `Code` chip measured in the mode it never renders in, shadcn's destructive
   button), not new.
2. `context.test.ts` enforces that every `alsoFor`/`watchFor` entry carries a `via` naming a real
   prop, default or export. A reversed `notFor` that contradicts a `useFor` elsewhere is the failure
   this suite is shaped to catch, so `light-section-card` and `ui/card` must be edited in the same
   change, not after it.
3. In skene-site: the new test must be seen **failing** with a count near 53 before any conversion
   lands. A guard only ever observed passing is what this estate has already paid for twice.
