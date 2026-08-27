---
name: skene-design-system-pages
description: "Use when assembling a WHOLE page or a multi-section band in a repository that depends on @skene/design-system — a features page, a use-case page, a developer page, a comparison or /vs/ page, a community, company, hub or landing page — and when deciding what sections a page should carry, in what order, or whether a band is missing. Triggers include: building a new marketing route, restructuring an existing page, asking which sections a page of this kind usually has, or reviewing a page for a band it should have and does not. Do NOT use for picking or writing a single component (that is skene-design-system) or for installing and configuring the package (that is skene-design-system-setup)."
---

# Composing a page with @skene/design-system

Read `machine/compositions.yaml` — under `node_modules/@skene/design-system/`
from a consumer. It is the only contract that says what a *page* is made of.
`context.yaml` says which module to reach for; `layouts.yaml` says how one band
is laid out; neither says what a features page carries or in what order.

**Everything in it was read out of pages that were actually built** — 19 routes
on the marketing site, at one commit. Nothing was designed for the file. So it
tells you what has been done, not what is allowed, and every recipe cites the
routes it came from.

## Start from the spine, not from an archetype

Five modules recur across the whole corpus before any archetype applies. A page
that leaves one out should leave it out on purpose.

| module | in | of | is |
|---|---|---|---|
| `sections/artifact-shell` | 14 | 17 | the drawn product artifact — the default band |
| `sections/key-value-table` | 9 | 17 | the reference half, usually late |
| `sections/trust-panel` | 8 | 17 | the evidence band, late in every route that has it |
| `patterns/marketing` | 7 | 17 | furniture — nav, display heading, eyebrow; first where present |
| `sections/code` | 7 | 17 | where the page first names a field or a flag |

**The artifact is the default.** If the page you are building shows no product
artifact, that is a decision to make deliberately. Three routes in the corpus
have none, and their intersection is *empty* — there is no observed recipe for
an artifact-free page, only three unrelated instances of one.

## Then read your archetype, and read its confidence first

Eight archetypes. The `confidence` field is not decoration:

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

`not_covered` is part of the contract. Three entries today, and **read
`corpus.correction` before you trust the first two**:

- **the home page** — recorded as importing nothing from this package.
  **Corrected 2026-08-27: that is false.** At the commit the file cites it
  imports seventeen modules and is the densest route in the corpus. It was
  dropped in error, so no archetype was derived with it in scope.
- **the pricing page** — recorded as importing nothing "despite the package
  shipping `PlanCard`". **Also false**: it imports nine modules and `PlanCard`
  is one of them. It is the consumer's own calibration page.
- **`(landing)/alternatives/*`** — the site's largest archetype, twenty routes,
  none importing this package. They compose route-local components instead.
  This entry stands.

Consequence you have to carry: six modules appear only on the two dropped
routes and therefore appear nowhere in this file — `patterns/dither`,
`sections/evaluator-list`, `sections/feature-row`, `sections/final-cta`,
`sections/plan-card`, `sections/question-grid`. Two of those are load-bearing
elsewhere in the package: `sections/feature-row` is what
`render_marketing_cards_as_feature_row` in `machine/rules.yaml` mandates for a
marketing card, and `sections/final-cta` is the closing band. **A page composed
from the archetypes alone will be missing both.** Add them from
`context.yaml` deliberately.

If your page is `(landing)/alternatives/*`, compose from `context.yaml` by
intent and say that you did — do not borrow a neighbouring archetype and
present it as the recipe.

## Before you add a band

Check `findings` in the same file. The live one: `comparison-table` appears
once in 19 routes, and not on the route named `/vs/` — that page argues with
findings instead. **Before adding a comparison band, decide whether the
argument is a table or a finding.**

## Where to go next

- Choosing or calling one module → the `skene-design-system` skill.
- Installing or configuring the package → `skene-design-system-setup`.
- Section order within one band, spacing and widths → `machine/layouts.yaml`.
