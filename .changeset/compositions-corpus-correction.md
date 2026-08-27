---
"@skene/design-system": patch
---

compositions.yaml: record that the corpus dropped its two densest routes

`machine/compositions.yaml` states that `(site)/page.tsx` and
`(site)/pricing/page.tsx` "import no design-system section at all". Checked
against the commit the file itself cites (`b96b935` on
`skene-marketing-website@claude/calcom-style-wireframes-a64a8e`), that is false:
the home route imports seventeen modules and the pricing route nine, including
`sections/plan-card`, which the file names as absent.

The archetypes were therefore derived from 17 routes rather than 19, and every
`in: N, of: M` denominator is short by two. Six modules appear only on the two
dropped routes and so appear nowhere in the file — `patterns/dither`,
`sections/evaluator-list`, `sections/feature-row`, `sections/final-cta`,
`sections/plan-card`, `sections/question-grid`. Two of those are load-bearing:
`sections/feature-row` is what `render_marketing_cards_as_feature_row` in
`machine/rules.yaml` mandates for a marketing card, and `sections/final-cta` is
the closing band.

Recorded rather than re-derived: adding both routes changes every denominator
and the home route matches no existing archetype, which is a maintainer's call.
A `corpus.correction` block carries the re-measured numbers, both `not_covered`
entries are corrected in place, and `skills/skene-design-system-pages` no longer
repeats the claim without the correction beside it.

Also refreshes the `skene-marketing-website` entry in `machine/rules.yaml` and
the consumer paragraph in `README.md` to v0.13.0 line numbers and SHAs.
