---
"@skene/design-system": minor
---

feat: `ArtFrame` can draw its halftone field in CSS instead of as a raster

**Why a second way to draw the same thing.** Largest Contentful Paint takes the
biggest painted element on the page, and a raster backdrop on a full-width frame
is almost always it. Measured 2026-09-01 with Lighthouse 13.4.1, mobile
emulation, one page and the same artwork three ways:

| field | LCP | LCP element |
| --- | --- | --- |
| image | 1534 ms | the frame |
| image masked to its visible band | 1509 ms | the frame |
| CSS | **640 ms** | the `<h1>` |

The middle row is the one worth writing down, because it is the fix everyone
reaches for first. Painting the artwork only in the ~30px band that actually
shows does not help: Chrome measures the element's painted box, not the part a
reader can see, so occluding ninety percent of it changes nothing. Downscaling
does not help either — the 0.05 bits-per-pixel threshold below which Chrome
ignores an image is computed from natural size, and `card1_bg` re-encoded to
900px still measures 0.55. Only not being an image works, and when it works LCP
falls to whatever text paints first.

On www.skene.ai the frames sit on the pricing, developers, evaluator and
product pages, where measured LCP is 4.5–5.6 s against a 3.6 s site median.

**What ships.** `field?: 'image' | 'css'` on `ArtFrame`, defaulting to `image`,
so every existing call site renders exactly as before. `styles/effects.css`
gains `.skene-field` with `data-field="jr|gh|db"`, the three washes as a
gradient under three offset dot grids, with the nine sampled colours named as
local custom properties rather than inlined — they are an approximation of a
piece of artwork, not palette roles, and naming them keeps the provenance
visible.

**What it is not.** It is not pixel-identical. The assets are an ordered dither
over a photographic wash; this is a regular grid over a linear one. At the band
an `ArtFrame` shows it reads as the same material, and side by side at full
bleed it is flatter and more even. The new `FieldsRasterVsCss` story renders the
pair for all three kinds so the difference is reviewable rather than described.
That is also why this is opt-in per call site: use it where the frame is big
enough to gate LCP, and keep the raster where the field itself is the point.
