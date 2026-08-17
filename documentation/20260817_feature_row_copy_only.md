# `FeatureRow` without a visual

**Status:** shipped in v0.9.18 (`b7ba744`).
**Raised by:** skene-site, which was asked to make every section on every route the
same object and found that twenty-one of them could not be.

## The problem, counted

`skene-site` renders 29 `FeatureRow` cards across 13 routes. It also renders **21
copy-only bands** on 13 routes — an eyebrow and a heading beside two or three
paragraphs, no product surface — and those sit bare on the page ground.

Measured on `/developers`, which has five of each: a 600px bordered card, then a
hairline-ruled full-width row with roughly 200px of empty left track under the
heading, then another 600px card. Two visual systems alternating down one page.
The site cannot resolve this itself, because a `FeatureRow` with no `visual`
renders a 600px-tall card with an empty right half.

## What was tried first, and why it is wrong

Pass the prose to `visual`. The contract appears to allow it — `alsoFor` says the
slot takes "an unconstrained ReactNode, so an `<img>`, a `Terminal`, an
`AnnotatedCurve` or a chart all drop in" — and it builds, typechecks and renders a
card.

It is still wrong, and rendering it is what showed why. The visual track is
`grid place-items-center` wrapping a content-height `p-[34px]` cell, so the cell
is centred on the block axis. Against a two-line head that is top-aligned in the
adjacent column, three paragraphs land 174px lower than the heading they belong
to — measured at 1440 on `/developers` band 4, head at y=207 and first paragraph
at y=358. `self-start` on the passed node does not reach it: the node is a child
of the inner cell, and it is the *cell* that is centred.

That centring is correct for what the slot is for. A product window is an object
floating on a field and it should sit in the middle of its panel. Prose is not,
and the mismatch is the slot telling the caller it is the wrong slot.

## Design

One derived flag, three consequences:

```
copyOnly = !visual && !texture && !textureSrc
```

When `copyOnly`:

1. **No visual cell.** Not an empty one — the element is not rendered.
2. **No `min-h-[600px]`.** The floor exists to keep a product panel from being
   cropped by a short copy column. With no panel there is nothing to protect, and
   a two-paragraph band in a 600px card is the same dead air the change is meant
   to remove, moved inside a border.
3. **No split grid class.** `SPLIT[splitAt].grid` reserves a second track;
   omitting the class leaves the root's single column, so `splitAt` and `reverse`
   are both inert. They are not errors — a caller migrating a mixed set should not
   have to strip props per band — and the docstring says so.

Everything else is untouched. `eyebrow`, `title`, `lede`, `children` and `actions`
render in the same order in the same column with the same spacing.

### Why a derived flag and not a prop

A `copyOnly` prop would be a second way to say something the argument list already
says. There is exactly one rendering that makes sense for a row with no visual and
no texture, so the component can pick it. This is the opposite call from
`PlanCard`'s `featured` — that one bundles three independent decisions behind one
boolean and should be split; this one has no decision in it.

### Blast radius

Zero for existing callers. Every one of the 29 live cards passes a `visual`, so
`copyOnly` is false for all of them and every branch above is the current
behaviour. The change can only affect a call that renders wrong today.

## Verification

1. A story for the copy-only row beside a normal one, so the gallery shows the two
   shapes at the same width and a regression is visible rather than inferred.
2. The existing rendered gates in skene-site: 29 cards must measure byte-identical
   class strings and unchanged heights. A card that moves means `copyOnly` is
   leaking into the visual path.
3. In skene-site, after adoption: `agent:content` reports `changed: no`. Twenty-one
   bands changing shape must move no word of copy.
4. `pixel_contrast` and the overflow gate at 390 / 768 / 1440. The copy column
   goes from roughly half the card to all of it, which is a real reflow.

## Out of scope

`NumberedStep`'s missing `titleAs` is filed separately as ask (p) and is not
bundled here. One component, one release, one diff that can be read.
