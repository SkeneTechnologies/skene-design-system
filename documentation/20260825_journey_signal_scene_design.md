# `JourneySignalScene` — porting the marketing site's evidence-to-PR-review demo

> **2026-09-02.** The exception this document argues for is closed. The styled-components
> definitions were ported 1:1 to `styles/journey-signal-scene.css` and the gsap entry
> timeline became an `IntersectionObserver` and two CSS transitions, so neither library is a
> package dependency any more (issue #24). The composition, the three layouts, the connector
> paths and the reveal choreography are unchanged; that was the part the founder's rejection
> was about, and it is what the port was measured against. The rest of this document stands
> as the record of why the scene arrived the way it did.

**Status:** design, pre-implementation
**Raised by:** skene-marketing-website, which needed the same scene in a second placement
(a split hero, text left / scene right) and wants to reuse it in other locally-built
sessions without copy-pasting three source files by hand.

## The problem, counted

`JourneySignalScene` lives today at
`skene-marketing-website/src/components/core/JourneySignalScene/` as three files
(`index.tsx`, `styles.ts`, `data.ts`) plus a shared hook
(`src/components/core/CardAnimations/useContainerScale.ts`). It has exactly one consumer
in that repo (`src/app/(site)/page.tsx`, used twice: once inside `Bridge`, once in the
homepage's split hero) and zero consumers anywhere else. A second local project wants to
render the same scene and currently cannot without either vendoring the four files by hand
(and re-solving the same token/import wiring each time) or duplicating the component from
scratch.

## What already exists, and why none of it fits

Checked before proposing anything new:

| candidate | why not |
|---|---|
| `Bridge` + `BridgeNode` (`sections/bridge.tsx`) | The band this scene currently sits inside on the marketing site. Three peer cards in a row; this scene is one three-panel composition with its own internal state (a GTM/Engineering toggle), not three independent nodes. |
| `MiniFunnel`, `AppPanel`, `DiffColumn`, `PrReview` (rebuilding the scene from package primitives) | Tried once, in skene-marketing-website, specifically to avoid a styled-components carve-out. It "produced correct components and a dead band: two panels that swapped wholesale, no ambient context, no connectors, one fade on entry." The founder rejected the result on sight and restored the styled-components original. Re-attempting the same rebuild here would repeat a decision already made. |
| `EvaluatorPanel`, `FindingCard`, `Code` (this package's own code/finding surfaces) | Each solves one panel's problem (a finding, a code block) but not the three-panel composition, the per-viewport layout switch, or the entry choreography together. |

Nothing in the package composes evidence + a traced step + a PR review into one scene with
a shared reveal timeline. The absence is real, and the fastest correct path is porting the
working component rather than re-deriving its layout math and motion a third time.

## Design

### A documented exception to `styled_components_for_new_features`

This is new to the package, not new to the product — it is a straight port of a component
that already shipped, already read correctly to the founder once, and was already rejected
in Tailwind form once. `machine/rules.yaml`'s rule exists to stop *new* styled-components
adoption; treating a working port as new authorship and re-litigating the rebuild is the
wrong scope for this change. The exception is documented in the file's own leading comment,
not asserted only here, so anyone reading the source later has the same context without
tracing back to this doc.

Consequence: `gsap`, `styled-components`, and (dev-only) `@types/styled-components` become
package dependencies. Nothing else in the package uses any of the three, so the import is
an island — no other module's bundle size or behavior changes.

### One file, not four

Every module in `src/sections`, `src/patterns`, and `src/ui` is a single flat file, and
both `scripts/build-inventory.mjs` and `scripts/check-story-coverage.mjs` scan `src/`
subdirectories non-recursively for `.tsx` files. A subfolder (`journey-signal-scene/`) or a
sibling `.ts` file (`journey-signal-scene-data.ts`) is invisible to both scripts, not merely
unconventional — the component would build and typecheck fine and then silently not exist
as far as the package's own inventory and story-coverage ratchet are concerned.

So the four source files collapse into one: `src/sections/journey-signal-scene.tsx`. The
file keeps three clearly-delimited regions in the same order the original files implied
(content constants, styled-components definitions, the component itself) so the thing that
used to be "edit `data.ts` for different labels" is still true — it is a marked block near
the top of one file instead of a separate file.

The shared `useContainerScale` hook moves to `src/lib/use-container-scale.ts`, matching how
`utils.ts` already lives flat in `src/lib` with its own explicit `package.json` export entry
(there is no glob export for `lib/*`, so this needs the same explicit-entry treatment
`./utils` already gets).

### Import wiring

Internal imports move from the marketing site's path aliases to this package's own
conventions: `@skene/design-system/patterns/skene-mark` becomes a relative
`../patterns/skene-mark.js` (this file is now inside the same package), and the
marketing-site-only `@/styles/breakpoints` import — confirmed unused in the file, referenced
only in a stale comment — is dropped rather than ported.

### Export surface

New literal entries in `package.json`'s `exports` map (the flat-file location already
matches the existing `./sections/*` glob, so the file itself needs no special-casing there):

```json
"./lib/use-container-scale": {
  "types": "./dist/lib/use-container-scale.d.ts",
  "default": "./dist/lib/use-container-scale.js"
}
```

`JourneySignalScene` is consumed via `@skene/design-system/sections/journey-signal-scene`,
the same pattern every other section already uses — no change needed to the glob for that
one.

### Size, named rather than hidden

At roughly 950 lines combined, this is the largest file in `src/sections` by a wide margin
(the current largest, `artifact-shell.tsx`, is 595). That is a real outlier and is disclosed
here rather than split back into files the package's own tooling can't see. The size is
inherent to the component — three panels' worth of styled-components definitions, three
hand-placed responsive layouts, and a GSAP entry/reveal/auto-advance timeline — not
padding that a future pass should expect to trim.

## Verification

1. `tsc -p tsconfig.build.json` — confirms the file typechecks and emits to
   `dist/sections/journey-signal-scene.js`, matching the glob export.
2. `node scripts/build-inventory.mjs` and `node scripts/check-story-coverage.mjs` — confirms
   the module is now visible to both (it was not, from the subfolder attempt this doc
   replaces), and that a story exists so the "every module has one" ratchet stays at 100%.
3. A story rendering the scene at a few container widths (its three responsive layouts:
   WIDE ≥720px, MEDIUM 420-720px, COMPACT below that) and in both GTM/Engineering views.
4. Visual: light ground, both cards' text legible in both views, connectors touching real
   panel edges, the GTM/Engineering switch below the card rather than overlapping it —
   these are regressions already found and fixed once in skene-marketing-website, worth
   re-confirming survive the port rather than re-discovering here.

## Out of scope

- Converting the component to the package's Tailwind/CSS-variable convention. Already tried
  and reverted once; not re-attempted here or implied as follow-up work.
- A props API for the content block (currently hardcoded, not passed in). This port ships
  the same all-or-nothing content model the marketing site component has today; making the
  three panels' content configurable via props is a separate, larger design decision about
  the component's public API and is not bundled into a straight port.

---

## Known defects at 0.12.0

Filed 2026-08-27 by `skene-marketing-website`, which is still this component's
only consumer and which keeps a local fork rather than importing it. Every item
below was measured against that fork
(`src/components/core/JourneySignalScene/index.tsx`, where each correction is
annotated in place). None of them was recorded here, in the source, or in the
0.12.0 CHANGELOG entry before this section.

The reason they all shipped: **nothing in this repository consumed `MEDIUM`
before the marketing site's home hero did.** The story renders the scene at a
few widths; the gallery renders it once. Neither exercised the layout at the
width a hero column actually gives it.

### G1 — `WIDE_MIN: 720` sends tablets to the desktop layout

`journey-signal-scene.tsx:888`. At 768 a hero stacks and the scene takes the
full ~730px column, which is over 720, so WIDE fires and scales its 1100px
stage to 0.66 — panel body copy at **8.6px**. The tablet gets the desktop
layout and the desktop gets the phone one. The consumer runs 900, the width
where WIDE holds 0.82 or better; below it MEDIUM reads better at any size.

This one is pure geometry and does not depend on content, so it is true here
exactly as it is true there.

### G2 — `MEDIUM.left.w: 170` ellipsises both Evidence rows

`journey-signal-scene.tsx:874`. The panel's entire job is naming the file and
the table, and at 170 neither fits: this package's own labels are
`app/onboarding/route.ts` (23 characters after the `code` badge) and
`public.accounts`. The consumer runs 230, which clears its longer label with
16px to spare, and gives the 60 back from the centre card (382 → 322, which
still holds `skene.track(…, {` unwrapped).

Note the packaged label is three characters LONGER than the consumer's, so
this clips harder here than in the fork where it was found.

### G3 — `MEDIUM.h: 640` has no floor under the PR review panel

`journey-signal-scene.tsx:871`. `right` starts at y 300 and the Engineering
view runs its three panels much taller than the GTM view they were laid out
against (132 / 238 / 354 versus 132 / 192 / 216). The consumer measured 5px of
slack and moved to 690. Any copy change to that panel clips inside
`overflow-hidden` chrome, which is the silent kind of clipping.

Measured on the fork, whose PR panel copy differs from this one's; the
mechanism — a MEDIUM height laid out against the shorter of two views — is the
same either way.

### G4 — the reserved top strip is a PORTING hazard, not a defect here

**This was filed as a defect and it is not one in this package.** The consumer
reports the View control landing inside the centre card at MEDIUM, because its
`ToggleRow` is `position: absolute; top: 20; right: 24` of the STAGE while
`MEDIUM.center.y` is 24.

This component does not do that. `ViewSwitchRow` is flow layout below the stage
(`journey-signal-scene.tsx:445-449`) and its comment records why: the two views
render at different heights and an absolutely-positioned switch overlapped the
card's own footnote. So `center.y: 24` is safe here.

It is worth writing down anyway, because the fork moved the switch back onto
the stage and hit exactly the failure this file's comment predicts. If the
switch ever returns to an overlay, MEDIUM needs every box below y 48.

### C1 — the stage is light, deliberately, and a consumer cannot change it

`--color-background-darker: #ffffff`, and `softPulse` is ink rather than peach
because peach measures ~1.2:1 on cream. That is correct for the `Bridge` band
this was built for, and wrong for a near-black hero, which is what the
marketing site's approved wireframe draws. There is no tone prop, so the
consumer cannot ask for the other reading. Its fork carries both in a
`sceneTokens` block.

### C2 — the content is hardcoded, and it is the pre-swap set

`onboarding_started`, `public.accounts`, Signed up / Onboarding started /
Reached first value, and an `orders` ambient table. The consumer swapped to the
SaaS upgrade set on 2026-08-26 to match its wireframe and had no way to do that
from a call site: **this component takes no props at all**, which
`machine/context.yaml` now records as the only section with neither `props` nor
`accepts`.

"A props API for the content block" is listed in Out of scope above as "a
separate, larger design decision". That was a reasonable call for the port. It
is now the thing keeping a 506-line fork alive, so it is the decision to take.

### Why none of this is fixed in this commit

G1 to G3 change what the component renders, and the only surface that could
verify the change is the consumer that does not import it. C1 and C2 are the
API decision the port deliberately deferred. Both want a maintainer, not a
drive-by. What was missing was the record, and that is what this section is.
