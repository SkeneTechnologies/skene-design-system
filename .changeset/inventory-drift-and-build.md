---
"@skene/design-system": patch
---

Three silent-drift gaps closed, the chip cluster settled and gated, and the
build made incremental. No component renders differently: the only `src/` change
is a doc comment, and `dist` is byte-identical apart from it.

- `scripts/build-inventory.mjs` filtered on `.tsx`, so `patterns/pill-nav-frosted`
  — the package's only `.ts` module — was missing from
  `docs-app/app/decisions/inventory.json` entirely. The page whose premise is
  that it lists everything listed 88 of 89. It now takes both extensions, the
  way `build-context.mjs` always has. `counts` corrects to 89 modules, 266
  exports, patterns 7 → 8.

- `sameAs` in `machine/context.yaml` is the near-duplicate warning, and four
  pairs declared it in one direction only — so it helped whichever side you
  happened to open. `feature-row → glyph-badge`, `chip → stat-chip`,
  `surface-tiles → surface-cards` and `terminal → traffic-lights` now name each
  other, and `__tests__/context.test.ts` fails on a one-way declaration.
  `chip → stat-chip` was the one that mattered: it is the unfinished half of
  the chip decision in `docs/sections.md` §2, invisible from `chip`.

- `docs/sections.md` §2 settled. Point 2 (Badge stays product-side, Eyebrow
  stays the marketing kicker) was never pending work and is now gated rather
  than labelled. Point 3 resolved: `StatChip`/`MetaChip` keep the pill, because
  a token gets the rectangle and prose gets the pill — `MetaChip` already draws
  both treatments in one chip, and its state word is the half that is a token.
  The table also grew from the documented seven shapes to nine: `TagChip` and
  `CheckChip` are the same 11px mono tag written twice, recorded only in
  `evaluator-check.tsx`'s own header. Decided in favour of `TagChip`, which two
  of the three modules in that family already import; not applied, because it
  moves pixels and the baselines need the Playwright container.

- `__tests__/chip-cluster.test.ts` makes that table a test: every chip's radius,
  size, voice and tracking pinned against source, and every chip-shaped class
  literal in `src` either registered or named as an exception. The cluster
  drifted twice in a column nobody was tabulating; it can now only grow in the
  open.

- Three dependencies nothing used: `@radix-ui/react-label` (`ui/label.tsx` is a
  plain `<label>`), `@radix-ui/react-separator` (never had an importer), and
  `@types/styled-components@5` beside `styled-components@6`, which ships its own
  types. Gated in `package-contract`: every dependency must be imported from
  `src/` or named by a stylesheet, and every `@types/x` must match its target's
  major.

- `tsc` runs incrementally, so `npm run verify` is 7.0s warm against 10.3s.
  Output is unaffected — `dist` is byte-identical either way.

- Counts typed into prose are checked now, in `__tests__/docs-counts.test.ts`.
  `stories/README.md` claimed 74 of 74 modules and 318 stories against a real 81
  and 379; `docs/sections.md` claimed one module without a gallery case against
  a real ten. The README's `#semver:` range also documented `^0.11.0` resolving
  `v0.11.0` while the package was 0.12.0, which is the fourth time that line has
  gone stale and the reason `package-contract` was already red.
