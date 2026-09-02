---
"@skene/design-system": minor
---

feat: `SectionBackdrop` can draw its field in CSS, and `CardAnimationIntegrations` loads gsap lazily

Two changes, both closing findings from a Vercel performance audit of
www.skene.ai, and both the same shape as fixes that shipped in 0.17.0.

**`field` prop on `SectionBackdrop`.** Same API as `ArtFrame`'s: `'image' |
'css'`, defaulting to `image`, so every existing call site renders unchanged.
The CSS path reuses `.skene-field` from `styles/effects.css`, so there is no new
CSS, and `texture` maps onto the `data-field` values it already keys off
(`journey → jr`, `github → gh`, `schema → db`).

The module comment on this component records that an earlier attempt at a
generated field "read as a chunky checkerboard next to the actual fine dot
halftone". That note stands against that implementation and is why this is
opt-in rather than a swap. What changed is the implementation: `.skene-field` is
a three-phase radial-gradient dot grid over a linear wash with its nine colours
sampled from the assets, reviewed side by side against the raster when it
shipped for `ArtFrame`. The new `RasterVsCss` story renders the pair for all
three textures so the difference stays reviewable.

Why a consumer would want it: a raster backdrop on a full-width panel is a
Largest Contentful Paint candidate that the preload scanner cannot discover,
because a `background-image` in an inline style is not found until CSS has
parsed and layout has run, after which it queues at Low priority. Measured on
www.skene.ai on 2026-09-02, that discovery delay was 2,281 ms of a 3,454 ms LCP.
A CSS field is not an image, so it can be neither the largest paint nor
discovered late.

**gsap out of module scope in `CardAnimationIntegrations`.** It was imported at
module scope with `gsap.registerPlugin(ScrollTrigger)` beside it, which put gsap
in the component's client chunk and that chunk in the initial script list of
every page importing it: 45 KB gzipped on the two routes that render it, for an
animation below the fold behind a ScrollTrigger that does not fire until the
scene reaches 80% of the viewport. Both imports now happen inside the existing
effect.

The same change in the consuming app took its homepage initial JavaScript from
310,100 to 265,801 gzipped bytes. `next/dynamic` around the component does not
achieve this and was measured not to: without `ssr: false` the chunk stays in
the initial list, and `ssr: false` removes the server-rendered markup, which is
not acceptable for a component carrying copy.

The cards start hidden and the timeline is what reveals them, so a failed import
would leave the scene blank where a static import could not. The catch reveals
them.
