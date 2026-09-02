---
"@skene/design-system": minor
---

feat: a z-index scale, blur tokens, and the two glass Button variants

All three come from one place: `skene-marketing-website` is retiring the
styled-components system that its 97 `(landing)` routes render from, and
anything that system holds and this package does not has to land here first,
or the migration reimplements it in the consumer and forks the design system
by another name.

Most of what that system held is already here under different names, which is
worth writing down so nobody ports it twice. Its on-dark colour ladder
(`--color-text-on-dark-muted`, `--color-hover-on-dark`, `--color-overlay`,
`--color-background-dark`) is the `--color-chrome-*` family. Its
`--line-height-relaxed` is `--font-line-height-relaxed`. Its transition scale
is `--duration-*` and `--easing-*`, which have been here since before this
change. Its three textures and its accent lockup are byte-identical copies of
files already in `assets/`. None of that needed porting.

Three things did.

**`zIndex`, eight steps.** There was no z-index token of any kind here, so
every consumer that stacks anything picks a number. That is how
`skene-marketing-website` ended up with a sticky nav at a hardcoded `z-[1050]`
sitting at the same level this scale calls `modal`. The steps are transcribed
from the system being retired: base 1, dropdown 1000, sticky 1020, fixed 1030,
modalBackdrop 1040, modal 1050, popover 1060, tooltip 1070.

**`blur`, three steps.** `glass` 12px for a translucent control over artwork,
`chrome` 8px for a sticky bar over content, `panel` 50px for a dropdown
surface. Also transcribed. The `Button` variants below are the first caller,
and adding the token with them is the point: a hardcoded blur inside a
component is the same fork as a hardcoded colour.

**`Button` gains `glass` and `glass-dark`.** A translucent control that sits
ON artwork and reads through it, rather than on a surface. Nothing here
covered it, and the retiring CTA pairs a solid primary button with one of
these over a full-bleed texture. Alpha values are transcribed, not chosen.

Both variants carry a `supports-[not_(backdrop-filter:blur(0))]` fallback that
raises the background to an opaque-enough value where `backdrop-filter` is
unavailable. Without it the control degrades to an 0.08 alpha wash over
artwork, which is where the label stops being readable rather than merely
losing its frosting.

They reach the blur through `backdrop-blur-[var(--blur-glass)]` rather than a
named utility. The generated `@theme inline` block registers colours only, so a
blur token in `:root` produces no utility on its own, and hand-registering one
in `styles/index.css` would give the value two homes that can disagree.

**`assetUrls.pixelFieldSource`.** The full-resolution original of
`pixelField`: 3,012,190 bytes against 146,850. Both already existed, in two
repositories, with nothing connecting them, and the consumer was shipping the
large one whole into one page's closing CTA. It is kept here because deleting
it there would otherwise have destroyed the only copy. It is a re-encode
source and never something a page renders; `context-data.json` says so in its
`notFor`.

**Known limitation, not addressed here.** The type scale has no responsive
behaviour, and the system being retired does: its `--font-size-hero` is 67px,
42px and 32px across three widths, and `--font-size-lg` is 24px, 22px and
20px. The 67, 32, 24 and 20 rungs all exist here as flat tokens; the tablet
values do not, and adding 22px and 42px as two more flat steps would preserve
the numbers while losing the thing that made them work. Recorded rather than
guessed at, because fluid type is a scale decision, not a token addition.
