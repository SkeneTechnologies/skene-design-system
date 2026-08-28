---
"@skene/design-system": patch
---

`LogoRow` rendered at 80% of its own documented size. The module was written on
Tailwind's numeric spacing scale, and this package sets `--spacing: 0.2rem`, so
`min-h-14` measured 44.8px where the comment beside it says the wireframe's
56px is kept as the minimum. `gap-3.5` measured 11.2px against 14, and `mb-6` /
`mt-3.5` were off by the same fifth.

The four utilities become the literal px the wireframe draws — `min-h-[56px]`,
`gap-[14px]`, `mb-[24px]`, `mt-[14px]` — which is the convention
`artifact-shell`, `funnel` and `integration-rows` already document at length.
**This changes rendering:** slots grow 44.8 → 56px and the row gaps grow 11.2 →
14px. Visual baselines covering the proof strip need updating.
