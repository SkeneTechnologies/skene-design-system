---
name: skene-design-system-pages
description: "Use when assembling a WHOLE page or a multi-section band in a repository that depends on @skene/design-system — a features page, a use-case page, a developer page, a comparison or /vs/ page, a community, company, hub or landing page — and when deciding what sections a page should carry, in what order, or whether a band is missing. Triggers include: building a new marketing route, restructuring an existing page, asking which sections a page of this kind usually has, or reviewing a page for a band it should have and does not. Do NOT use for picking or writing a single component (that is skene-design-system) or for installing and configuring the package (that is skene-design-system-setup)."
---

# Composing a page with @skene/design-system

Read `machine/compositions.yaml` — under `node_modules/@skene/design-system/`
from a consumer. It is the only contract that says what a *page* is made of.
`context.yaml` says which module to reach for; `layouts.yaml` says how one band
is laid out; neither says what a features page carries or in what order.

**Everything in it was read out of pages that were actually built** — every
route on the marketing site at one commit, 19 of the 20 of which compose
something from this package. Nothing was designed for the file. So it tells you
what has been done, not what is allowed, and every recipe cites the routes it
came from, with `__tests__/compositions.test.ts` recomputing every count in it
from those citations.

## Start from the spine, not from an archetype

Five modules recur across the whole corpus before any archetype applies. A page
that leaves one out should leave it out on purpose.

| module | in | of | is |
|---|---|---|---|
| `sections/artifact-shell` | 16 | 19 | the drawn product artifact — the default band |
| `sections/key-value-table` | 10 | 19 | the reference half, usually late |
| `sections/trust-panel` | 10 | 19 | the evidence band, late in every route that has it |
| `patterns/marketing` | 9 | 19 | furniture — nav, display heading, eyebrow; first where present |
| `sections/code` | 7 | 19 | where the page first names a field or a flag |

**The artifact is the default.** If the page you are building shows no product
artifact, that is a decision to make deliberately. Three routes in the corpus
have none, and their intersection is *empty* — there is no observed recipe for
an artifact-free page, only three unrelated instances of one.

## Then read your archetype, and read its confidence first

Ten archetypes. The `confidence` field is not decoration:

- `derived` — 3+ routes, a real intersection. Follow it.
- `pair` — 2 routes. An intersection of two is a coincidence until a third
  confirms it. Take the shared module, derive the rest from your claim.
- `single` — 1 route. Recorded, not generalised. These carry `observed` instead
  of `load_bearing`, because nothing can be shown to recur in one instance.

| archetype | confidence | what holds it up |
|---|---|---|
| `product-page` | derived (4) | `artifact-shell` — but which artifact varies; pick it for the claim |
| `use-case-page` | derived (3) | `artifact-shell` + `key-value-table`, the table closing |
| `developer-page` | pair (2) | five shared modules, the corpus's only `terminal-block` |
| `comparison-page` | pair (2) | `artifact-shell`; only one of the two uses `comparison-table` |
| `community-page` | pair (2) | `trust-panel` as proof, not decoration |
| `company-page` | pair (2) | closes on `recommendation-card`. Weakest grouping — do not treat as a template |
| `hub-page` | single (1) | argues by contrast and question, not artifact |
| `capability-deep-dive` | single (1) | one capability, its own panel and pipeline |
| `home-page` | single (1) | seventeen bands in one pass; the only record of five modules |
| `pricing-page` | single (1) | plans plus the table that separates them; the consumer's calibration page |

`load_bearing` means the module appears in **every** route of the archetype.
`optional` carries `in: 2, of: 4` — that is a count, not a recommendation.

## Order

The lists are **import order**, which tracks render order closely but is not
the DOM. Treat it as the shape of the page, not a spec for the markup.

Where order is load-bearing the file says so: `key-value-table` lands last or
near-last in all three use-case routes — it is the page's closing reference,
not its opening summary.

## Polarity between adjacent bands

Sections carry their own ground, and adjacent bands can flip. `terminal-block`
and `side-by-side-diff` are `applies-dark`; `artifact-shell` and `faq-band` are
`applies-light`; `bridge` is `applies-both`. The evaluator route flips polarity
between two adjacent bands on purpose. Check each module's `polarity` in
`context.yaml` before reordering, and see rule 2 in `machine/rules.yaml`.

## What has no recipe — stated, never invented

`not_covered` is part of the contract, and it is short: **`(landing)/alternatives/*`**,
the consumer's largest archetype at twenty routes, none of which import this
package (they compose three route-local components instead), plus everything
outside that one marketing site.

If your page is `(landing)/alternatives/*`, compose from `context.yaml` by
intent and say that you did — do not borrow a neighbouring archetype and
present it as the recipe.

**It used to be longer, and the two entries that left are worth one paragraph.**
v0.13.0 recorded the home and pricing routes here as importing nothing from this
package. Both imported heavily at the commit the file cites — seventeen modules
and nine — and they were the densest routes in the corpus. Six modules therefore
appeared nowhere in the file, two of them `sections/feature-row` (the marketing
card `render_marketing_cards_as_feature_row` in `machine/rules.yaml` mandates)
and `sections/final-cta` (the closer), so a page composed from the archetypes
came out with neither. Both routes are now archetypes of their own,
`home-page` and `pricing-page`, every denominator has been re-counted, and the
test file fails if a route is ever both cited and recorded as uncovered again.
`corpus.history` carries the whole record.

Carry one thing out of it: **`sections/feature-row` and `sections/final-cta`
each appear on exactly one route.** That is thin evidence, and it is thin for a
reason — the corpus is one site — not a signal that either is optional. The card
rule is a must-rule in `rules.yaml` regardless of this file, and a closing band
is the one thing the consumer's own spec says every page carries exactly once.
**Check for both before you call a page composed.**

## Before you add a band

Check `findings` in the same file. The live one: `comparison-table` appears
twice in the 19 composing routes, and on neither of the two routes whose job is
comparison — including the one named `/vs/`, which argues with findings instead.
**Before adding a comparison band, decide whether the argument is a table or a
finding.**

## Band spacing: read `layouts.yaml` `marketing`, not `shipped_here`

`machine/layouts.yaml` holds two surfaces. The first thing an agent hits under
`shipped_here` is `page_gutters`, `gap-4 px-4 py-6 sm:px-6 lg:px-8`, marked
`utilities_resolve_here: true` and described as the shipped contract. **It is
the dashboard page shell.** "Works anywhere" is a claim about whether the
utilities resolve, not about whether the numbers are right for your surface.

This package sets `--spacing: 0.2rem`, so a numeric Tailwind step is 80% of the
`--spacing-N` token with the same number. Measured, not inferred:

| | `page_gutters` | a marketing band |
|---|---|---|
| band vertical padding | `py-6` → **19.2px** | `py-[96px] md:py-[128px]` |
| split gap | `gap-4` → **12.8px** | `gap-[32px] lg:gap-[64px]` |

Five times and two-to-five times apart. Compose a marketing page on
`page_gutters` and every band collapses to a dashboard row.

**Take band geometry from section 5, `marketing` (`status: composed_here`).**
It carries the rhythm, the 5fr/7fr split, `ACTION_GAP`, the cream inset and the
ground-alternation rule, all measured off pages that ship. Nothing in this
package enforces any of it — it is the shape to land in, not an API — and it is
also why the literal px above are literal: `py-24` is 76.8px here, and tidying a
bracket value back onto the numeric scale IS the defect, not a cleanup. Four
modules have now been bitten by it; see `spacing_scale.warning` in the same
file.

## Where to go next

- Choosing or calling one module → the `skene-design-system` skill.
- Installing or configuring the package → `skene-design-system-setup`.
- Marketing band geometry, ground and split → `machine/layouts.yaml`,
  **section 5 `marketing`**. Read the section above first.
- Dashboard page shell, workspace templates, T-codes → the same file's
  `shipped_here`, `depicts_here` and `dashboard_only` blocks. Not a marketing
  band.
