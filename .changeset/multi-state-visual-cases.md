---
"@skene/design-system": patch
---

The last two unproven modules get cases, and one of them reads 18 CSS custom
properties this package does not define

`sections/card-animation-integrations` and `sections/journey-signal-scene` were
the last two modules marked `seen: []`, meaning nothing in this repository had
ever rendered them, meaning every claim their contracts make was unproven. Both
are multi-state, so one frame proves one state: each gets TWO cases, at two
named states, with what is NOT held written into the case beside what is.

**`sections/card-animation-integrations`**, at two playheads on its own cycling
timeline. `ICON_STYLES` carries a `light` and a `dark` pair for each of four card
variants and only the active card takes the light one, so a single frame proves
one row of that table and cannot tell "card 0 is lit because the playhead is at
2.5s" from "card 0 is always lit". `section-card-animation-integrations` holds
t=2.5s (all four cards in and at rest, card 0 active, detail 0 in the panel, in
the stable window 1.56 → 3.76) and `-last` holds t=9.5s (card 3 active, detail 3,
inside the loop's final branch, which is written differently from the other three
and has no other cover). Not held by either: the entry stagger, the three swap
transitions, the closing fade, and details 1 and 2. A cycling timeline cannot be
covered by frames, only sampled by them, and two samples is where the sampling
starts proving the cycle moves.

**`sections/journey-signal-scene`**, at WIDE + GTM and MEDIUM + Engineering. It
picks one of three hand-placed layouts by measuring its own container and carries
a view toggle, so four combinations matter; the two held are the one the module
was designed against and the one where every filed defect shows. The two unheld
corners are named in the case rather than left to be found, and so is COMPACT,
which needs a container under 420 and therefore the iframe treatment
`pattern-pill-nav-mobile-menu` uses. The view is pinned by clicking the toggle
once on mount — the module's own documented handover, "for good the moment
someone reaches for the toggle themselves" — because otherwise it auto-advances
every 6s while on screen and the capture lands wherever the clock is.

**The defect that case found is the largest of this sweep.** The module reads 24
CSS custom properties and **18 of them are not defined anywhere in this
package**: every `--color-terminalChrome-*` it uses, plus `--color-text`,
`--color-text-dark`, `--color-text-light`, the three `--color-text-on-dark`
variants, `--color-accent-muted`, `--color-background-darker`,
`--color-border-on-dark`, `--color-chrome-accent` and `--color-chrome-muted`.
None carries a `var()` fallback, so each resolves to
invalid-at-computed-value-time: backgrounds go transparent, colours fall back to
`inherit`. The GTM view survives on inherited ink and two literals. The
Engineering view asks for `--color-terminalChrome-githubDarkBg` and
`--color-terminalChrome-githubDarkSurface`, gets transparent, then paints
`#ffffff` text on the white stage — measured as `background-color: rgba(0,0,0,0)`
with `color: rgb(255,255,255)` on both the centre card and the PR panel.

The two mode captures of that case are the proof and they DIFFER, which they
must not: the scene sits under an explicit `light` wrapper, so the page's mode
should reach nothing inside it. What reaches in is the fallback — `color` on an
undefined property resolves to `inherit`, so the panels take the gallery case's
own `text-foreground`, ink under the light sweep and near-white under the dark
one, and the Engineering view is legible in one baseline and almost absent in the
other. A component whose ink is decided by a page two levels up is the defect
stated as a picture.

The values exist in `design-tokens.json` under `terminalChrome` and reach
`src/tokens/index.ts`; the CSS generator never emits them under those names. It
survived because nothing was looking from either end: the module is a straight
port, its header says so, and the tokens came across while the definitions did
not — and the one app that renders this scene defines every missing name in its
own `globals.css` while running a FORK rather than importing this module. The
package's copy has no consumer, and `seen: []` meant this repository had not
rendered it either.

**Not fixed here, and deliberately so.** Eighteen undefined properties inside
1,214 lines of styled-components is a token decision — whether the generator
should emit `terminalChrome` or the module should move onto the roles that
already exist — and it needs its own commit. So does ask 12, the three geometry
defects the consuming site has filed against this module's MEDIUM layout
(`WIDE_MIN = 720` at :888, `MEDIUM.left.w = 170` at :874, `MEDIUM.h = 640` at
:871), all re-verified against v0.13.0 and all visible or measurable in the
`-medium` frame: the Evidence rows ellipsise at 170, and the PR panel runs ~330
of its 340 stage units, so the missing floor is real even though it has not
clipped yet. Both are baselined as they are, for the same reason: a fix lands as
a picture of what changed once a baseline exists, and as a list of names and a
promise before one does. The `-medium` frame is a regression floor and a filed
defect, not an endorsement, and it is expected to move twice.

`FrozenGsap` grew per-case playheads to make the first pair possible, matched by
selector rather than by a wrapper element so the cases that already have
baselines keep their DOM. It also grew a 100ms interval that never stops, and
that is not belt-and-braces: the first version watched for thirty frames and one
slow `components — light` run lost `section-card-animation-integrations` with no
actual image and no diff, which is what a live GSAP loop looks like from
`toHaveScreenshot`. The animated modules sit behind their own chunks, so on a
loaded worker they can build their timelines after the watcher has stopped
watching, and a timeline created after the last frame escapes the freeze
entirely. Two clean verify runs since.

Two prose gates were widened rather than satisfied by ungrammatical prose:
`__tests__/docs-counts.test.ts` now matches `modules?` and
`__tests__/skills.test.ts` matches `modules? (are|is)`, because the gated count
reached 1 and both patterns were written when it could only be plural. The number
still has to be the real one in both places, which is the whole gate.

Floor 88 → 92. `ui/sonner` is now the only module with no case, and it is meant
to be one: a toast host renders nothing until something calls it, so a case for
it would capture an empty portal.
