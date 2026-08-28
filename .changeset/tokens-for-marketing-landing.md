---
"@skene/design-system": minor
---

Twenty colour tokens the marketing site could not stop hardcoding, because
nothing here held the value.

`skene-marketing-website`'s `(landing)` tree carried 232 hardcoded hex colours.
159 of them had a token and have been replaced. The other 71 occurrences — 20
distinct values — had nowhere to go: the package modelled the family they belong
to and stopped one rung short of each. This adds the missing rungs. Every value
is exactly what the consumer already renders, so tokenising a call site is a
rename and not a repaint.

All twenty are `$value`, not `$modes`, and that is a decision rather than an
omission. They are two kinds of colour that have no light variant to declare:
fixed values imitating a third party's dark UI, and fixed neutrals on the
`chrome.*` ladder, which `machine/rules.yaml` defines as invariant-always-dark.
Giving any of them a mode map would claim a designed light value exists. None
does.

**`terminalChrome` — the rest of GitHub's dark palette (7).** The package had
`githubDarkBg`, `githubDarkSurface`, `githubBorder` and `githubText`, plus a
complete Primer *light* set. The dark set was missing everything a check run is
drawn with, so the PR mockup hardcoded it: `githubDarkMuted` (#8b949e),
`githubDarkRaised` (#21262d), `githubDarkAccentFg` (#58a6ff),
`githubDarkSuccessFg` (#3fb950), `githubDarkSuccessEmphasis` (#238636),
`githubDarkDangerFg` (#f85149), `githubDarkWarningFg` (#e3b341).

The `Dark` infix is load-bearing. `githubSuccessFg` and `githubDangerFg` are
Primer *light* values under unprefixed names, so an unprefixed dark sibling
would read as their pair and would not be one. Success also needs two tokens,
not one: `githubDarkSuccessFg` is the green text is written in and
`githubDarkSuccessEmphasis` is the green that sits under text. They are not
interchangeable and the consumer already used both.

**`chrome.surface` — eight neutral rungs (8).** `overlay` (#0f0f0f),
`hoverSubtle` (#111111), `band` (#161616), `card` (#1c1c1c), `hairline`
(#1f1f1f), `divider` (#232323), `row` (#252525), `hoverStrong` (#525252).
Named for the role each was observed doing rather than for its position, because
the existing ramp is already role-named (`deep`, `midGray`, `elevated`) and the
numeric rungs 0–3 are not value-ordered against them. `hoverSubtle`/`hoverStrong`
mirror `chrome.line.subtle`/`strong` — the same qualifier pair one group over.

`hairline` and `divider` are rules living in a `surface` group. That is
deliberate and written on both: `chrome.line.*` is alpha-only by design, because
those rules stack on four different grounds, whereas a rule inside a panel has
exactly one ground and does not need to composite.

`hoverStrong` (#525252) has a trap on it worth reading. That hex is already in
this file — as the **light** value of the mode-aware `color.text.muted`, which
resolves #8c8c8c in dark. A consumer that treats the two as the same token gets
a different colour than it drew, and the marketing site's tokenisation pass did
exactly that before it was caught.

**`chrome.text` — two greys (2).** `grayCool` (#9ca3af, Tailwind `gray-400`, the
inactive label in a tab or step row) and `caption` (#737373, the 9px uppercase
eyebrow ink).

`caption` is measured and it does not clear AA: 4.18:1 on `surface.0`, 3.78:1 on
`surface.1`, against a 4.5 body floor. Both numbers are on the token. It is
tokenised anyway because the consumer already ships that colour at every eyebrow
and a token is the only thing that can fix all of them at once; raising it is a
design call, not a token call. It is not added to the contrast gate's `PAIRS` —
the rest of `chrome.text` is not either — so the gate's coverage is unchanged
and the number lives where someone choosing the colour will read it.

**`brand` — three warm tones (3).** `peachLight` (#fdd4aa), `creamDim` (#ecdccf),
`bronzeDeep` (#5a4532).

Two carry a near-miss warning. `peachLight` is the exact value the shadcn
arbitration *rejected* for `--primary-hover` in favour of #ebdccf
(`legacy.peachHover`) — it is being added as ink, not as a reinstatement of that
decision, and the description says so. `creamDim` (#ecdccf) is one digit from
`legacy.peachHover` (#ebdccf) and is not the same colour.

**What this does not do.** The eight new `chrome.surface` rungs and the two
`chrome.text` greys are chrome-only; the mode-aware `color.surface.*` and
`color.text.*` ladders do not gain siblings, so the two key sets are no longer
identical. Adding them there would require inventing a light value for each,
which is the guess this change refuses to make. `__tests__/roles.test.ts` still
holds the invariant that matters — every mode-aware `surface.*` shares its dark
value with its `chrome` twin.

Token source version 2.7.0 → 2.8.0. `machine/rules.yaml` and `AGENTS.md` both
quoted a token figure in prose; the version reference is updated and the token
count, which read 331 against an actual 221, now reads the generator's own 241.
