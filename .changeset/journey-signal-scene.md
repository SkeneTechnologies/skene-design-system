---
"@skene/design-system": minor
---

`JourneySignalScene` — evidence, a traced journey step, and the PR review that
catches it breaking, in one animated composition.

Ported in from skene-marketing-website rather than authored fresh: it predates
the package's Tailwind port, was once rebuilt on this package's own primitives
(`MiniFunnel`, `AppPanel`, `DiffColumn`, `PrReview`), and the founder rejected
that version on sight and restored the styled-components original. It keeps
that original, documented as a deliberate exception to
`styled_components_for_new_features` in the file's own leading comment and in
`documentation/20260825_journey_signal_scene_design.md`.

`gsap` and `styled-components` become package dependencies (`@types/styled-components`
dev-only). Nothing else in the package uses either — the import is an island.

No props: content lives in named consts near the top of the source file. Three
responsive layouts switch on the container's own measured width, from a
three-panel row down to a hero-column-width layout down to a stacked phone
layout, all covered by the new Storybook stories.
