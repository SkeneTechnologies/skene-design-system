---
"@skene/design-system": minor
---

The marketing build pass's component-contract asks, all additive; no existing prop's behaviour or default changes.

1. `JourneyTrack`: per-step `glyph` replaces the ring's 1-based number (✓ on a verified track); connectors keep deriving from the states.
2. `Chip`: `danger` member on `ChipTone` — 12% error-red tint under the on-tint ink, mode-aware on both halves.
3. `LightSectionCard`: `eyebrow` slot rendered through `Eyebrow` with the on-cream overrides applied inside the card.
4. `KeyValueTable`: `headerless` renders the rows as a semantic `<dl>` (column flags unchanged) instead of a table with hidden headers.
5. `ValueCard`: `neutral` member on `ValueTone` — a muted label, no cost/gain accent, for peer cards.
6. `PlanCard`: `featuredTone="dark"` — the featured promotion for a cream ground (near-black, `dark`-pinned subtree, same lift and shadow).
7. `HeroBackdrop`: the textured split header documented as a composition recipe (header comment + context.yaml), deliberately not an export.
8. `TrustFact`: `tone="muted"` swaps the invariant on-light rule and disc for their theme-following pair; the cream default is untouched.
9. `DiscoveryTable`: context.yaml `notFor` sharpened — three columns or fewer is `KeyValueTable`'s job; this is the fixed four-column discovery artifact.
10. `FaqBand`: `actions` slot in the heading column, under the note.
11. `INTEGRATION_ANIMATION_DETAILS`: the audit entry's dead `skene audit .` command and "instrumentation surface" phrase replaced with the real `uvx skene analyse-journey .` invocation and "tracking surface", matching the marketing homepage's now-unnecessary `AUDIT_DETAIL_FIX` override.
