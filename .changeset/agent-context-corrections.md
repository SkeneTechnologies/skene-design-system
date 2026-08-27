---
"@skene/design-system": minor
---

Four corrections to the machine-readable contracts, all of them about the
consumer this package could not see.

- `machine/rules.yaml` recorded `skene-marketing-website` as
  `installs: false`, with an assertion of zero `@skene/design-system` matches
  in its package.json, its lockfile and its source. That was measured against
  that repo's `main`; the work was on a branch. It installs 0.12.0 and imports
  the package on 222 statements across 33 files — more reach than any other
  consumer. An agent reading the file before working on that site concluded the
  design system did not apply to it. Same correction in README.md.
- `docs-app/app/decisions/inventory.json` now ships, exported as
  `@skene/design-system/inventory.json`. It was outside `files`, so every
  `seen:` in context.yaml was a pointer a consuming agent could not follow.
  Cost: +55KB packed.
- `machine/context.yaml` gains `props` and `accepts` for the whole `ui/*`
  layer, derived from `dist/*.d.ts` by a new `dtsContractOf()` in
  `scripts/build-context.mjs`. 30 of 30 ui modules previously shipped with no
  usable prop signature, on the layer `rules.yaml` tells an agent to reach for
  first. `build` now runs `context` after `tsc`.
- `machine/layouts.yaml` was dashboard-only and its own coverage pointer
  resolved to `present_here: false`. It gains a `marketing` block — band
  rhythm, ground alternation, the 5fr/7fr split, the cream inset, the gap
  constants — transcribed from the twenty pages that already obey it. The
  dashboard content moves under `dashboard:` unchanged.
