---
"@skene/design-system": minor
---

The remaining upstream ledger from the marketing build pass, closed in one
branch. Everything additive; no existing call site changes rendering.

- `Chip` gains `tone="warn"`, the amber companion to 0.11.0's `danger`. The
  homepage and features page were both retinting `tone="neutral"` through a
  shared `WARN_CHIP` className — base amber ink on a 15% tint, the on-tint miss
  `danger`'s note documents. The new tone is the corrected recipe: amber
  on-tint ink over a 12% fill, per `src/lib/status.ts`. New `Warn` story; the
  `AllTones`/`OnLight` matrices now render six tones.

- `EvaluatorPanel` gains `split?: boolean` and `activeIndex?: number` — the
  marketing wireframes' two-pane cut: the index in a dark left pane (the
  package's own `dark` subtree switch, nested inside the window's forced
  `light` the way the product nests its sidebar) with the open row picked out,
  the requirements in the cream right pane. The index renders name and
  confirmed count per row in this mode; the four-column table stays the
  stacked layout's. Stacks below `md`. New `Split` story; the default stacked
  rendering is untouched.

- `scripts/build-context.mjs` and `scripts/build-inventory.mjs` no longer
  truncate SCREAMING_SNAKE export names at the first underscore.
  `machine/context.yaml` and `docs-app/app/decisions/inventory.json` now list
  `PILL_NAV_FROSTED_STYLE` and `PILL_NAV_POSITION` (the second had vanished
  entirely — both truncated to `PILL` and the Set deduped them),
  `INTEGRATION_ANIMATION_CARDS`, and `PROSE_CODE`.

- Stories for the seven storyless patterns: dither, hero-backdrop, marketing,
  pill-nav, pill-nav-frosted, skene-mark, terminal. Every module in the
  package now has a story file.

- README and `styles/index.css` document the Turbopack `@source` gap: the
  bundler never scans the package stylesheet's own `@source`, so utilities
  only the package uses were absent and `LogoRow` rendered zero-height until
  the consuming app added
  `@source "../../node_modules/@skene/design-system/dist";` itself. The exact
  line, and why it is safe to add unconditionally, are now in both places.

- docs-app no longer quotes `skene audit`, a subcommand that does not exist:
  the three remaining spots (two SurfaceDetail cases, the terminal-block case)
  now carry the OSS CLI's real invocation, `uvx skene analyse-journey .`, and
  the terminal case's note states what the command actually reads and writes.
  Visual baselines rebaselined for the copy-bearing screens.
