---
"@skene/design-system": patch
---

LogoRow gets the visual case that would have caught its geometry defect

`grep -rn "logo-row\|LogoRow" docs-app/app` returned nothing. `LogoRow` had no
`data-visual` case on `/components`, so none of the 199 committed baselines
covered it, so it shipped every spacing value at 80% of the number its own
comments claimed — a documented 56px slot floor rendering at 44.8px, a
documented 14px gap rendering at 11.2px — and the per-component visual suite
reported green throughout. The defect was found by measuring the rendered strip
inside a consuming app, which is the one place this package's own gate should
never be the second-best instrument.

`section-logo-row` now exists and holds the geometry: the slot floor, the
inter-slot gap, and the margins above and below the strip. It renders on both
grounds in one frame, because this band declares none of its own and follows a
`light` ancestor onto cream. No logo sits in a slot: the empty slot is the
component's argument and the module header forbids a fabricated mark in a
story, a demo or sample data, so a case that filled one to look better would be
the first place that rule broke.

The suite's floor moves 81 → 82. That is the third time it has been raised for
this reason, so `docs/sections.md` now ranks the nine modules that still have no
case by how much of the estate they expose rather than only listing them —
`sections/code` first, at 7 of the 19 composing routes in
`machine/compositions.yaml` and the only spine member with no baseline.
