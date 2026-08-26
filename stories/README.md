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

`npm run stories:check` (part of `npm run verify`). **81 of 81 modules have
stories; `BACKLOG.json` is empty.** (81, not 89: `src/patterns` is deliberately
untracked — see `TRACKED` in the script.)

- A component **not** in the backlog must have a story. New components cannot
  land without one.
- The backlog may only **shrink**. Writing a story for a listed module fails the
  check until the entry is removed (`npm run stories:check -- --write`).
- A backlog entry for a deleted module also fails, so the list cannot go stale.

The mechanism stays even though the backlog is empty. It is what lets the next
person defer one component honestly — an entry, and a reason in the commit —
rather than the two things that happen when the only option is "write it now":
the story never gets written, or the check gets disabled. See the header of
`scripts/check-story-coverage.mjs`.

## Stories are rendered, not just built

`npm run stories:render` (needs `npm run storybook:build` and a running
Storybook) loads all 379 stories and fails on anything that throws, logs a
console error, or renders empty.

`storybook build` compiles stories; it does not run them. The gap is real: this
gate immediately caught `AgentCallout` wrapping `children` in its own `<p>`, so
a story passing a `<p>` produced invalid nesting that the browser repaired by
closing the outer paragraph early. Type-checked, bundled, wrong.

Its settle is worth not "simplifying": it waits for `#storybook-root` to have
content rather than sleeping. A fixed 220ms flagged 32 stories — exactly the
first two of every client component, because a cold lazy chunk renders later
than a warm one. All 32 were the harness's fault.

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

## The counts above are checked

`74 of 74` and `318 stories` were both true when they were written and neither
survived the seven modules and sixty-one stories that landed after. A number typed into prose is a
claim with no gate behind it, which is the same failure this directory's ratchet
exists to prevent one level down. `__tests__/docs-counts.test.ts` now reads the
three figures out of this file and out of `docs/sections.md` and compares them to
the source, so the next drift fails `npm test` instead of being read as fact.

## Theme

The toolbar writes `light` or `dark` as a class on the wrapper. There is no
`prefers-color-scheme` in this package and adding one would break nesting. Any
component that can appear on cream wants both stories.
