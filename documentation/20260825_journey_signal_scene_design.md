# `JourneySignalScene` — porting the marketing site's evidence-to-PR-review demo

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
