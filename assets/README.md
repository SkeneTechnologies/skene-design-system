# assets

Deliberately almost empty.

`dither-subpage.webp` (77 KB) is the halftone texture the subpage headers use.
It ships because it is brand furniture rather than content, and because it is
small enough that every consumer paying for it is a fair trade for pages that
look right out of the box.

`card1_bg` / `card2_bg` / `card3_bg` (142–227 KB) are the halftone fields behind
feature-row visuals, and `pixel-bg.webp` (143 KB) is the closing-CTA backdrop.
Same argument: they are brand furniture, they recur on every marketing surface,
and `SectionBackdrop` is not reproducible without them. The alternative was
tried — generating the field from tokens with CSS gradients — and it reads as a
chunky checkerboard beside the real dot halftone. A texture is not a colour.

The pairing is fixed and follows the live site, so the same backdrop sits behind
the same kind of artifact: card1 journeys and measurement, card2 GitHub and
editor chrome, card3 schema and connections.

## The brand marks

Six SVGs, added 2026-08-13, and the only assets here that are not texture. They
ship for the opposite reason the textures do: not because they are expensive to
reproduce, but because they must not be reproduced at all. A ring, a letter "S"
or a redrawn glyph standing in for the symbol is the failure they prevent.

| file | is |
|---|---|
| `skene-symbol-block.svg` | peach symbol on its own black tile — safe on any ground |
| `skene-symbol-on-dark.svg` | white symbol, no ground |
| `skene-symbol-on-light.svg` | black symbol, no ground |
| `skene-lockup-on-dark.svg` | white symbol, white wordmark — the default |
| `skene-lockup-on-light.svg` | black symbol, black wordmark |
| `skene-lockup-accent.svg` | peach symbol, white wordmark. Dark grounds only |

Together they are 44 KB — all six cost less than the smallest texture here.

Reach for `SkeneMark` and `SkeneLockup` in `patterns/skene-mark` rather than the
files: they carry the tone choice and, more to the point, the sizing rule. The
symbol is square and takes one number; the lockup is 1016×260 and has to be
sized by height or it stops being a lockup. `assetUrls` in
`@skene/design-system/asset-urls` exposes all six as strings for CSS written
outside JSX.

Two provenance notes, because artwork that was derived rather than delivered
should say so. There was no black lockup in the brand folder — only the
1800×1800 square variants — so `skene-lockup-on-light.svg` is the white file
with its 61 fills swapped. And `skene-lockup-accent.svg` came from
skene-marketing-website's `public/img/skene-logo-accent.svg`, which `95fcb71`
then deleted there once it resolved through `assetUrls` — the same artwork, moved
to the one place that can hand it to both surfaces.

`skene-lockup-on-dark.svg` is byte-identical to that repo's
`public/img/skene-logo.svg`, and that one was deliberately **not** deleted. Three
call sites cite it as an absolute URL — `https://www.skene.ai/img/skene-logo.svg`
in the JSON-LD `Organization` blocks of `layout.tsx` and `contact/page.tsx`, plus
a `<img src="/img/skene-logo.svg">` in the Dublin deck. Structured data has to
name a URL that resolves for a crawler, which a path inside `node_modules` never
does. So the duplicate stands, and it is the one place a change to this file has
to be made twice.

Integration marks are **not** here yet.

Nothing else from skene-marketing-website's `public/` belongs here:

> The row for `pixel-bg.webp` used to sit in this table, rejected at 2.9 MB. The
> prototype's optimised copy is **143 KB** — twenty times smaller — so the only
> reason it was excluded no longer holds. Worth re-checking the rest against
> real numbers rather than the ones recorded here; `hero_dithering.png` is the
> obvious next candidate.

| asset | size | why not |
|---|---|---|
| `hero_dithering.png` | 502 KB | homepage-only, and a PNG where a WebP would do. |
| `skene_hero.mp4` | video | page content, not design system. |
| product screenshots | 32 MB total | content. |

Consumers pass their own via the `dither` and `video` props on `DitheredMedia`.

## How the live site serves these

Worth knowing, because it is not what you would guess: they are plain static
files in the marketing repo's `public/`, served by Vercel's CDN. Not Supabase.
The one remote asset in that repo is a conference video pulled from Supabase
storage on a single page.

They also bypass `next/image` entirely — `DitherOverlay` and `BgImage` are
`styled.img`, so no resizing, no format negotiation, no lazy loading. Live
headers confirm it: `hero_dithering.png` ships 514 KB as PNG and
`pixel-bg.webp` ships 3.0 MB, both unoptimised, on first paint.
