# Stories

Storybook for `@skene/design-system`. `npm run storybook`, then <http://localhost:6006>.

## What this is for, next to `docs-app`

Both exist and neither replaces the other. They answer different questions.

| | `docs-app` | Storybook |
|---|---|---|
| Unit | whole sections in composition | one component, one state |
| Props | fixed, as a page would use them | exposed as controls |
| Wired to | `machine/inventory.json`, the contract agents read | nothing; it is a gallery |
| Visual check | committed PNGs, byte-for-byte, pinned container, fails hard | Chromatic, hosted, a human accepts or rejects |

The rule for deciding where something goes: **if a case composes several
sections into a page, it belongs in `docs-app`. If it exists to show one prop's
variants, it belongs here.**

## Stories import through the public specifier

`@skene/design-system/sections/feature-row`, never `../src/sections/feature-row`.
That resolves to `dist/`, which means:

- **Run `npm run build` before you look at a source change**, or you are looking
  at the last build.
- A broken `exports` entry fails here, which is the point. A story that imported
  by relative path would render happily while the published entry point was
  broken, and that is the one failure a gallery must never hide.

## Coverage is a ratchet, not a gate

`npm run stories:check` (part of `npm run verify`). 12 of 74 modules have stories;
the other 62 are listed in `BACKLOG.json`.

- A component **not** in the backlog must have a story. New components cannot
  land without one.
- The backlog may only **shrink**. Writing a story for a listed module fails the
  check until the entry is removed (`npm run stories:check -- --write`).
- A backlog entry for a deleted module also fails, so the list cannot go stale.

The reason it is not "every component, starting now": a rule that fails on 62
files gets deleted, not satisfied. See the header of
`scripts/check-story-coverage.mjs`.

## The stories that are load-bearing

Most of these render a state that shipped a defect. They are baselines, so a
change to them is a question someone has to answer.

- **`feature-row` — Over-wide visual.** Pins the clipping that keeps a
  forced-light panel from reaching the copy column. Three utilities hold it and
  losing any one re-opens 1.00:1 invisible text.
- **`feature-row` — Sheen over a status pill.** The 10% wash that took a red
  status pill from 4.510:1 to 3.801 at 390. `sheen={false}` is the fix.
- **`light-section-card` — Steps missing onLight.** `chrome.*` is invariant and
  does not follow the `light` class. The step titles are the same colour as the
  cream panel and simply are not there.
- **`plan-card` — features as bare text.** A bare text node has no element, so
  it inherits the card's colour. Scored 1.13:1. Every `ReactNode` slot in this
  package has this failure mode.
- **`comparison-table` — At 390.** `sr-only` is `position:absolute` and escaped
  an unpositioned scroll container, scrolling the whole page sideways 320px.
- **`lifecycle-canvas` — Unpinned.** The other half of the first item: 998px of
  rail in a 570px track when the wrapper is not `w-full`.
- **`button` — Matrix.** Every variant at every size on both grounds, because a
  pixel harness reported the primary below floor at three different readings
  when it is 9.11:1 — each one a ground the glyph does not sit on. See the
  file header for which reading maps to which ground.

## Theme

The toolbar writes `light` or `dark` as a class on the wrapper. There is no
`prefers-color-scheme` in this package and adding one would break nesting. Any
component that can appear on cream wants both stories.
