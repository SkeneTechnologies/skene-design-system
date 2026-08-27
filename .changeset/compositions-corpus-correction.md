---
"@skene/design-system": minor
---

compositions.yaml: re-derive the corpus that dropped its two densest routes

`machine/compositions.yaml` stated that `(site)/page.tsx` and
`(site)/pricing/page.tsx` "import no design-system section at all" and recorded
both under `not_covered`. Checked against the commit the file itself cites
(`b96b935` on `skene-marketing-website@claude/calcom-style-wireframes-a64a8e`),
that is false: the home route imports seventeen modules and the pricing route
nine, including `sections/plan-card`, which the entry named as absent.

So the archetypes were derived from 17 routes rather than 19 and every
`in: N, of: M` denominator was short by two. Worse than the counts: six modules
appear only on the two dropped routes and so appeared nowhere in the file —
`patterns/dither`, `sections/evaluator-list`, `sections/feature-row`,
`sections/final-cta`, `sections/plan-card`, `sections/question-grid`. Two of
those are load-bearing. `sections/feature-row` is what
`render_marketing_cards_as_feature_row` in `machine/rules.yaml` mandates for a
marketing card, and `sections/final-cta` is the closing band. An agent
following `skills/skene-design-system-pages` composed a page with neither.

Re-derived rather than annotated. Both routes were read at `b96b935` and added
as archetypes of their own — `home-page` and `pricing-page`, both `single`,
because neither matches an existing shape and one instance generalises to
nothing. The corpus is now 20 routes read, 19 composing, 40 modules seen; every
spine denominator, archetype `instances` and `optional` count is re-counted;
`not_covered` keeps only `(landing)/alternatives/*` and everything outside the
site. `corpus.history` carries the whole record rather than dropping it.

`__tests__/compositions.test.ts` is what makes this stick. It now recomputes
every number in the file from the `routes:` maps beside it — corpus counts,
spine `in`/`of`, per-archetype `instances` and `optional`, that a
`load_bearing` module really does appear in every cited route, and that no
module a cited route imports goes unnamed by its recipe. It also fails if a
route is ever both cited by an archetype and recorded as `not_covered`, which
is the shape the original defect took. The old assertion there was
`toMatch(/pricing/)`, and it passed *because* the false claim mentioned
pricing.

`skills/skene-design-system-pages`, `README.md` and the
`skene-marketing-website` entry in `machine/rules.yaml` follow the same numbers.
