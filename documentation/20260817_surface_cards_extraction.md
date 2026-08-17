# `SurfaceCards` — the four-ways-in card grid, extracted from skene-site

**Status:** design, pre-implementation
**Raised by:** skene-site, whose `audit-qa/FINALISATION.md` U3 records the decision. The
site's shape-based card guard (`__tests__/hand-rolled-cards.test.ts`) found one card built
from raw utilities that three name-based guards could not see, and it is this one.
**Direction of travel:** into the package, not out of it. The obvious conversion —
rewrite each card as a `FeatureRow` — was measured and rejected; see "Why not a
`FeatureRow`" below. It is not re-opened here.

## The problem, counted

One file: `skene-site/src/components/surface-cards.tsx`, 197 lines, one call site
(`src/app/page.tsx`, the home page's "four ways to plug Skene in" band). It renders a 2x2
grid of four `<article>` elements, each a border + fill + `p-[16px]` + radius, one of them
carrying `light` on `bg-brand-light`.

That is a marketing card assembled from utilities on the site's most important route. The
site's own rule is that it does not hand-roll what the design system should own, and the
component's header states the package has no equivalent. If that claim holds, the gap is in
the package and the fix is an extraction. This document is the check of that claim.

Measured before anything was moved, because the numbers decide whether an extraction is
even possible: each card is **223px wide with 16px of padding**, four of them in a 2x2 grid
across 458px of the band's 637.789px visual cell.

## What already exists, and why none of it fits

Every `sections/*` entry in `machine/context.yaml` was read. Eight are close enough to name;
the rest are artifacts (`PrReview`, `DiscoveryTable`, `LifecycleCanvas`, `EvaluatorPanel`,
…), primitives, or whole bands. The near ones:

| candidate | why not |
|---|---|
| **`SurfaceTiles` / `SurfaceTile` / `SurfaceDetail`** (`sections/surface-tiles.tsx`) | **The closest thing in the package, and the one that must be argued rather than waved off — it is the same subject, "the surfaces a product runs on", with the same cream-selected mechanism.** It is still a different object, for three measured reasons. (1) **Grid.** `SurfaceTiles` is `repeat(auto-fit, minmax(112px,1fr))` at an 8px gap, which in a 458px cell resolves **3+1**, not 2x2 — already recorded as a live regression in `skene-site/audit/inventory.json` against `11-visual-layer.md` §13.5, and already filed as a package ask ("`SurfaceTiles` must not use `auto-fit`; it wants 2-up then 4-up"). (2) **Padding.** `SurfaceTile` is `p-3.5` = 11.2px against this package's `--spacing: 0.2rem`. This grid is 16px. Adopting it moves every pixel the extraction exists to preserve. (3) **Information architecture, and this is the real one.** `SurfaceDetail` is a *sibling under the row* holding the detail for the *chosen* tile — one panel, one detail. The home band's whole argument is that all four details are in the document at once; the site header records that the sibling-panel shape shipped and was removed because it put every surface on the page twice, once as a tile and again as a `<dt>` chip repeating the tile's own title. Bending `SurfaceTiles` to hold four in-tile details would be a second layout inside the component whose two settings share no token — the same call `OverviewTiles` already made against `ValueCard`'s `density`. `SurfaceTiles` also stays in use on this site, unchanged, at `/product/features` and `/product/integrations`; the two components ship side by side. |
| `FeatureRow` (`sections/feature-row.tsx`) | Rejected on measurement in U3. Its copy column is `px-12 pt-[50px] pb-[46px]` — 38.4px each side, 96px on the block axis. In a 223x209px cell that padding is wider than the content and nearly half the height. A band component at band scale is not a 223px cell. It is also dark by construction (`bg-chrome-surface-1`, invariant `chrome.text.*`), and `docs/sections.md` records that collapsing `LightSectionCard` and `FeatureRow` behind a `tone` prop was **considered and refused**. This grid is the `visual` a `FeatureRow` already holds, not a nest of four more. |
| `LightSectionCard` | One cream card carrying a whole section's copy — heading, italic promise, ruled proof block. Always cream, one per band. Here three of the four cards are near-black and the cream one is a peer, not the band. Four `LightSectionCard`s would be four sections. |
| `ValueCards` / `ValueCard` | The nearest *grid*, and its own header says why not: it argues by **contrast**, N cost cards then one gain card, and "the tone difference IS the content". These four are peers — alternatives, not a sequence with a turn. `ValueCard` is also 28px padding at `minmax(240px,1fr)`, and it deliberately carries no polarity class, which is precisely the mechanism the cream cell needs. |
| `OverviewTiles` / `OverviewTile` | Caption, NUMBER, and what the number is made of, at 12px padding on `bg-card`; product furniture drawn light by an `AppWindow` ancestor. Its own header states nothing in it can be selected, because a metric tile being "chosen" is meaningless. No number here, and one card must be picked out. |
| `QuestionGrid` | Structurally tempting — a 1–4 column grid of near-empty cards with a tag over a line. It has **no fill by design**, and its header protects that: a card with no ground cannot change polarity, so it needs neither `light` nor `dark`. The cream cell is exactly the fill that would break it, and the 58px gap under the tag is a fixed part of that design. |
| `Bridge` / `BridgeNode` | Does have the inverted-card-in-a-row mechanism. But it is a whole cream `<section>`, not a card, and it interleaves arrows between nodes: a sequence. These four are unordered alternatives, and the arrows are the claim. |
| `ProductWindow`, `ArtifactShell`, `IntegrationRows` | Product chrome. `IntegrationRows` is the closest by subject — "what Skene is attached to, and whether each connection is live" — and it is a drawn Skene Cloud **screen** with status pills, inside an `AppWindow`. This band is marketing furniture over a texture and carries no product chrome. |
| `Chip`, `Code`, `StatChip`, `GlyphBadge` | Marks, not containers. `GlyphBadge` is used *inside* this component and stays that way. |

No module in the package renders a small-scale peer-card grid with one cell inverted. The
absence is real, and it is the one the site's header claimed.

## Design

An extraction, not a redesign. The component moves as it is, with three changes and no
fourth:

### 1. `next/image` becomes a plain `<img>`

The package has no Next dependency and will not gain one. `patterns/dither.tsx` and
`patterns/skene-mark.tsx` already ship raw `<img>`; `SectionBackdrop` and `ArtifactShell`
use CSS `background-image`. Either is house style.

The `<img>` keeps the exact box `next/image fill` produced — `absolute inset-0`, 100% x
100%, `object-cover`, `pointer-events-none`, `aria-hidden`, empty `alt` — so the layout is
unchanged and only the optimizer is lost. The alternative, a `texture` slot taking a
caller-supplied `ReactNode` so the site could keep passing `<Image>`, was rejected: it is a
second way to say what `texture` already says, which is the argument `FeatureRow`'s
`copyOnly` doc makes against a `copyOnly` prop.

### 2. `cn()` instead of the local array join

The site file joins class strings by hand. Every module in this package composes with
`cn()` from `lib/utils`, which is `twMerge` — and `twMerge` is exactly why `className`
overrides behave predictably here. This is the one place the extraction changes emitted
class *order*; it must not change the emitted *set*, and the site's rendered check is what
proves it.

### 3. The item type is `SurfaceCardItem`, not `Surface`

`Surface` is too generic for a barrel that already exports `SurfaceTile`, `SurfaceTiles`,
`SurfaceDetail` and `SurfaceAccent`. `SurfaceCardItem` follows `PipelineStepItem`,
`JourneyStepItem` and `LifecycleStageItem`. The site imports only `SurfaceCards`, so no call
site changes.

### Placement: `src/sections/`, not `src/ui/`

It carries `brand.light` and the `light` mechanism. Every `ui/*` part is theme-neutral by
construction.

### `featured` carries `light`, and the unselected cards carry `dark`

Both classes are load-bearing and both are kept verbatim from the site file. The cream card
needs `light` for the reason `SurfaceTile`, `ProductWindow tone="light"` and the featured
`PlanCard` all document — without it `text.primary` is #faf1e9 on a #faf1e9 fill, which has
shipped invisible in this package twice. The other three paint their own near-black ground
and carry `dark` for the reason `BridgeNode` documents: on an always-ink card, a mode-aware
token in a `light` ancestor keeps its light value against the fill.

Note this is a genuine difference from `SurfaceTile`, which omits `dark` on its unselected
tiles and reaches for the invariant `chrome.*` roles instead. Both are correct; they are two
answers to the same question and this one is the one that survives being dropped inside a
`LightSectionCard`.

### Two-across, never four

Kept, with the site's measurement in the comment: at four tracks in this band each tile is
139px, 32px of which is its own padding, and every one of the four titles wrapped —
"Command-line tool" became "Command-" / "line tool". This is the same finding as the filed
`SurfaceTiles` `auto-fit` ask, reached independently, and it is why `grid-cols-1
sm:grid-cols-2` is literal rather than `auto-fit`.

## Verification

1. A story per state that has shipped a defect, per the gallery rule — including **the
   featured cell on cream**, on the real `bg-brand-light` ground rather than a grey
   stand-in. That is the state most likely to break and the one no type check sees.
2. `npm run verify` green. Four contrast rows are RED and pre-existing (the `Code` chip x2,
   shadcn `destructive` x2) and are not this change's.
3. In skene-site, after adoption: the four cards must still measure **223px wide, 16px
   padding, 2x2, featured cream**, in the rendered HTML. An extraction that changes a pixel
   is not an extraction — the same bar the `Code` extraction was held to across seven call
   sites.
4. `agent:content` reports `changed: no`. Moving a component must move no word of copy.
5. The site's allowlist entry in `__tests__/hand-rolled-cards.test.ts` is deleted, not
   edited. The file it names is gone, and that test asserts every entry names a file that
   exists.

## Out of scope

The `SurfaceTiles` `auto-fit` ask stands, unbundled and unfixed, and so do asks (p) `titleAs`
on `NumberedStep`, (q) `Bridge`'s required title, and (r) `Finding`'s 3.88:1 tag. One
component, one release, one diff that can be read.
