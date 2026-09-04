# Skene seed deck, September 2026

Thirteen slides at 1920x1080, as one static page. Open `index.html`.

- Arrow keys, PageUp/PageDown, Space, Home and End move between slides.
- `U` switches currency; `?currency=USD` opens in USD. Default is EUR.
- Print to PDF from Chrome: one page per slide, 1440x810pt (16:9), no margins.

## What it is built from

The page imports the package's own stylesheets, `../styles/tokens.css` and
`../styles/effects.css`, and every colour, size, radius, spacing and font family
in `deck.css` is one of those tokens. `<html class="dark">` is required: the
token file emits `:root, .light` after the base block, so a document with no
theme class resolves the light values.

A static page cannot import the package's React modules, so where a slide draws
something the package already owns, the markup mirrors that module's structure
and its colour decisions, and the class name says which one:

| class | module |
| --- | --- |
| `.aw-*` | `sections/artifact-shell` (AppWindow, AppPanel) |
| `.fnl-*` | `sections/funnel`, states `ok` / `broken` / `unknown` |
| `.ptab` | `sections/key-value-table`, reference density |
| `.chip` | `sections/chip`, `sections/stat-chip` |
| `.tc-*` | `sections/team-card` |

Package rule 2 applies to exactly one surface here: the activation funnel on
slide 3 is a light window on a dark page, so it carries `light` on its own root.

No chart library ships in the package, so the MRR bars (slide 7), the three
GitHub curves (slide 8) and the budget bar (slide 12) are SVG and flex drawn
with tokens.

## Money

Every money figure lives in the `MONEY` object at the top of `index.html`, with
an `EUR` and a `USD` variant, and reaches the page through `data-money`
attributes. The round and the budget stay in euros in both variants.

## Checks

```bash
cd tools && npm install          # playwright only
node render.mjs EUR              # 13 PNGs into ../shots, plus an overflow report
node contrast.mjs                # every text run against the package's floors
node copy-diff.mjs EUR --loose   # rendered text vs copy.txt
node pdf.mjs EUR                 # ../skene-seed-deck-EUR.pdf
```

`copy.txt` is the deck copy as delivered. `copy-diff.mjs` word-diffs the
rendered text against it; `--loose` folds the two differences a slide layout
legitimately makes to a running sentence (a word that becomes a label loses its
trailing punctuation, an eyebrow is set in caps) and folds nothing else.
