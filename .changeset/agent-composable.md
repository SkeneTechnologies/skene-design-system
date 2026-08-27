---
"@skene/design-system": patch
---

Make the package composable by an agent, not just callable.

`machine/context.yaml` has always answered "what is FeatureRow for" — 89 modules
with full prop signatures. It never answered the question an agent actually
arrives with: "I have to build a features page, what goes in it and in what
order?"

- **`machine/compositions.yaml`** — page recipes derived from 19 routes that
  were really built (the cal.com-style wireframe branch of the marketing site),
  not from a taxonomy anyone liked the shape of. Eight archetypes, each citing
  its routes with their import lists inline, each splitting load-bearing (recurs
  in every instance) from optional (with counts). Two single-instance
  archetypes carry `observed` rather than `load_bearing`, because with n=1
  nothing can be shown to recur. Home and pricing are recorded in `not_covered`:
  both routes import no section from this package, so there is no observed
  recipe and inventing one would be the failure this file exists to prevent.

- **`intent` on every module, from a closed 20-tag vocabulary** declared at the
  top of `context.yaml`. The reverse index: you know what you are trying to do,
  the tag takes you to the candidates. 89 of 89 tagged, cap of three — the
  fourth tag is always the one that is only sort-of true.

- **`machine/layouts.yaml` restructured, nothing deleted.** Two different things
  had always lived in it and nothing in its structure said which was which: the
  layout scale this package ships, and skene-dashboard's contract, which it does
  not. Every block now carries a `status` — `shipped_here`, `unverified_here`,
  `depicts_here`, `dashboard_only` — so "can I build against this today?" is a
  field rather than something you infer from the header. The dashboard T-codes
  and their Figma anchors stay: the dashboard is going to consume this package.
  New `depicts_here` block names the modules that draw a dashboard-shaped
  surface for a marketing page, so "put a Skene dashboard visual on a landing
  page" resolves here instead of being reinvented.

Gated by `__tests__/compositions.test.ts` and six new cases in
`__tests__/context.test.ts`: every module a recipe names must exist in
`context.yaml`, every archetype must cite page files, no `load_bearing` may be
claimed from a single route, `not_covered` must be stated, every intent must be
declared, and no declared intent may go unused.

One correction to an earlier gate: `publishing.test.ts` asserted `.runlog/` did
not exist on disk, which turned `npm run verify` red for the whole duration of
any run that used one — guarding the work by breaking the check meant to guard
it. It now asserts the directory is not committed, which is the actual failure.
