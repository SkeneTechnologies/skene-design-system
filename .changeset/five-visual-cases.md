---
"@skene/design-system": patch
---

Five of the nine unproven modules get their first visual case, and one of them
was broken

`machine/context.yaml` marked nine modules `seen: []`, and its own header says
an empty list means nothing in this repository has ever rendered the module, so
treat its claims as unproven. None of the 201 committed baselines covered any of
them. That is not a coverage statistic. It is the same hole `LogoRow` fell
through: a module with no case has no baseline, the per-component suite compares
nothing to nothing and reports green, and the defect is found later by measuring
the rendered thing inside a consuming app — which is the one place a package's
own gate should never be the second-best instrument.

It happened again here, on the third of the five. `IntegrationsHighlight`
rendered `CardAnimationIntegrations` at **0x0**. `LightSectionCard`'s visual
column is `grid place-items-center`, so this module's wrapper was shrink-to-fit,
and the animation is `aspect-square w-full` over two absolutely-positioned
children and therefore has no intrinsic width at all. Measured in the gallery at
a 469px visual column: the wrapper resolved to 51x51, its own 25.6px padding
twice and nothing between, and the animation to 0x0. The band had shipped since
0.10.0 as a cream card with an empty right half, and its only defence was that
nothing had ever rendered it — the sole consumer calls
`CardAnimationIntegrations` directly, inside a wrapper of its own. **Fixed**,
with `w-full` on that wrapper, in the same commit as the case: a baseline of a
blank panel is precisely the failure this exercise exists to prevent.

The same case found a second defect, which is **not** fixed and is baselined
known-wrong deliberately. Inside that band's `light`, three of the four
animation cards render their title in invariant `chrome.text-primary`,
rgb(250,241,233), against `bg-surface-1`, which is mode-aware and resolves to
rgb(244,244,245) there — roughly 1.03:1, the trap `sections/code`'s own header
documents one level down. The consumer repairs it at its call site with two `!`
overrides mapping the chrome roles onto mode-aware ones. The fix belongs in
`card-animation-integrations`, where it can be reviewed as its own change; until
then the baseline holds a regression floor, not an endorsement.

The five cases and what each baseline holds:

- **`section-code`** — the biggest exposure on the list, at 7 of the 19
  composing routes in `machine/compositions.yaml`'s corpus, the fifth most-used
  module in the package and the only spine member with no baseline. The frame
  holds a MATCH, not a shape: every row is rendered twice, once under a dark
  ancestor and once under a cream one, and the two columns have to be identical
  pixels. `Code` is `polarity: applies-both` — each variant pins its own mode
  class so it resolves its own tokens wherever a caller drops it — and deleting
  either class moves exactly one column. The module header records the two
  readings that makes real: 4.30:1 for the default under `light`, and 1.00:1,
  the same colour, for `onLight` under `dark`. `PROSE_CODE` gets its own row,
  including inside the cream column, where a peach-on-near-black chip is what a
  caller actually gets.
- **`pattern-pill-nav-frosted`** — two constants and no component, which is why
  it lasted longest: `scripts/build-inventory.mjs` filtered on `.tsx` and
  dropped the package's only `.ts` module outright. The frame holds the wash
  composited over a halftone: `chrome.surface-0` at 60%, `blur(8px)
  saturate(180%)`, and a 14% `chrome.text-primary` hairline. Over a flat fill a
  blur radius is invisible and a saturate multiplier does nothing, so the
  artwork behind it is load-bearing. Both position constants render; sticky
  BEHAVIOUR is not held and no static frame can hold it.
- **`section-surface-cards`** — the ways-in grid, second on the exposure list
  and on the consumer's home and integrations routes. Holds two structural
  arguments: two tracks and never `auto-fit` (four tracks in a ~640px band give
  each card 139px and every two-word title wraps), and the `light` on the
  featured cell against `dark` on the rest, without which `text.primary`
  resolves to #faf1e9 on a #faf1e9 fill. The four `code` chips are taken
  verbatim from `INTEGRATION_ANIMATION_DETAILS`, whose source records what each
  was corrected from.
- **`section-team-card`** — three STATES of one entry, not three people: the
  module's claim is that the panel keeps one shape with a photo and without, and
  three different names would read as three people rather than as that. It also
  means nothing here fabricates a colleague. Holds the `--radius-lg` panel at
  24px, the square `--radius-md` media frame, the 17px name, the 11px mono role
  at 0.07em, and the underline-offset on an anchor passed through `children`,
  which the module styles and which had no other proof that it applies.
- **`section-integrations-highlight`** — the composition, which is all this
  module is: the cream card's split at `md`, the 1350px cap, and the copy stack
  beside a square visual. Its copy is literals in the source rather than props,
  so an upstream wording change lands here as a reflow and nowhere else.

Two of the five are GSAP-driven and could not hold a frame at all before this.
`FREEZE_CSS` and Playwright's `animations: 'disabled'` cover CSS animations,
transitions and the Web Animations API; they do not reach GSAP, which drives
inline styles off its own ticker. `docs-app/app/components/islands.tsx` now
ships `FrozenGsap`, which disables the ScrollTriggers without killing their
animations, then seeks every timeline from 0 with events live so the
`.call()`-driven active card actually resolves. Its header records why each of
those three details is load-bearing, and why `gsap` is imported there without
being declared as a docs-app dependency.

The suite's floor moves 82 → 87. Four modules still have no case:
`ui/sonner`, `patterns/pill-nav-mobile-menu`,
`sections/card-animation-integrations` and `sections/journey-signal-scene`.
`docs/sections.md` now says which of those is permanent — `sonner` is a toast
host with no resting state, and writing a case for it to reach zero would
capture an empty portal — and what the other three each still need.
