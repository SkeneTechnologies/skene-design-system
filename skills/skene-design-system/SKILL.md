---
name: skene-design-system
description: "Use when building, restyling or reviewing ANY user interface in a repository that depends on @skene/design-system — before writing a component, not after. Triggers include: adding or changing a React component, a card, chip, badge, table, button, form control, modal, nav, window frame, status marker, metric, chart-like figure, textured background or any small label; picking a colour, spacing, radius or typographic value; and any request to make a page or section look a certain way. Use it especially when about to write a NEW component, because the thing usually already exists — the package has 90 modules and ten documented clusters where one visual object was drawn twice. Do NOT use for first-time installation or Tailwind @source configuration (that is skene-design-system-setup), for assembling a whole page from sections (that is skene-design-system-pages), or for UI work in a repo that does not depend on this package."
---

# Building UI with @skene/design-system

**Grep `machine/context.yaml` before you write a component.** 90 modules, and a
documented history of the same visual object being drawn twice by someone who
could not find the first — ten adjudicated clusters of it, plus an
eleventh found in the marketing site's twenty comparison pages, which
reimplemented `ComparisonTable` in 45 lines.

If you are about to write a card, a chip, a table, a framed window or a
textured field: it exists.

The contracts ship inside the package, so from a consumer they are under
`node_modules/@skene/design-system/`.

## Which layer do you want

| layer | is | example |
|---|---|---|
| `ui/` | a **control** | `Button`, `Table`, `Dialog` |
| `patterns/` | **page furniture** — a recurring treatment, not a whole band | `Eyebrow`, `PillNav`, `DitherOverlay` |
| `sections/` | a **whole band of a page**, carrying layout and an argument | `FeatureRow`, `PlanCard`, `FinalCta` |

Reaching for a section to render one small thing means you want a pattern or a
primitive. Composing four primitives and re-deriving a layout means the section
probably already exists.

## Read backwards, by intent

`context.yaml` answers "what is `FeatureRow` for". You usually arrive with the
inverse — "I need a band that contrasts two options". Every module carries
`intent` tags from this closed vocabulary; find your tag, then read only those
entries.

| tag | what you are doing |
|---|---|
| `open-a-page` | the band that starts a page — hero, full-bleed media |
| `navigate` | moving the reader elsewhere — nav, footer links, breadcrumbs |
| `brand-the-surface` | putting Skene itself on the page — mark, wordmark, lockup |
| `compare-options` | setting choices against each other so one wins |
| `explain-a-process` | ordered stages and what happens between them |
| `show-status` | the state a thing is in — ok/warn/broken, live/pending |
| `show-a-metric` | a number and what it is made of |
| `prove-a-claim` | evidence beside an assertion — facts, logos, proof list |
| `display-code` | literal machine text to read or copy |
| `frame-a-mock` | chrome around a product artifact so it reads as a tool |
| `collect-input` | taking something from the reader — field, control, toggle |
| `answer-a-question` | copy shaped as a question and its answer |
| `group-related-items` | a container or grid of N peers of one kind |
| `tabulate-data` | rows and columns of real data |
| `mark-a-label` | small type classifying what it sits beside — chip, badge |
| `texture-a-surface` | painting the Skene ground under other content |
| `reveal-on-demand` | present but hidden until asked — disclosure, accordion |
| `interrupt-the-reader` | takes over or demands an answer before continuing |
| `drive-an-action` | what the reader should do next — button, closing CTA |
| `pitch-a-capability` | a whole band arguing that Skene does something |

## Four fields that earn the read

- **`useFor`** — what it is for.
- **`alsoFor`** — what else it covers. Every claim cites a `via` naming the
  prop, default or export that makes it true; a test rejects one that cannot.
- **`notFor`** — the component you probably meant instead. 144 such edges.
- **`sameAs`** — a near-duplicate this is easy to confuse with. Enforced
  symmetric, so it reads the same from either side.

Each entry also carries full **prop signatures with types and defaults**, so
you can call the component without opening its source.

## Three fields that bite if you skip them

- **`polarity`** — whether the module puts a theme class on its own root. A
  light surface on a dark page without one resolves mode-aware tokens to their
  dark values against a light fill. That has shipped text at 1.08:1.
- **`seen`** — the gallery cases that have ever rendered it. **An empty list
  means nothing has ever rendered this module, so treat its claims as
  unproven.** ONE module is in that state and it is meant to be: `ui/sonner`,
  a toast host with no resting state to snapshot.
- **`overrides`** — what a caller can reach from outside. `style` means the
  module writes an inline style that beats any class you pass.

## Rules that are not negotiable

Full list in `machine/rules.yaml`; these three cause the most damage.

1. **`chrome.*` is invariant and cannot invert.** Use it only on surfaces that
   never flip. Anything on a surface that flips uses the theme-aware `text.*`.
2. **A light surface on a dark page needs the `light` class on its root.**
3. **Content is props.** No section hardcodes copy.

## Before adding a small label, read the chip cluster

Nine shapes, and it has drifted twice in a column nobody was tabulating —
`Badge`, `Eyebrow`, `StatChip`, `MetaChip`, `Chip`, `WindowStatus`,
`WindowChip`, `TagChip`, `CheckChip`. The rule is content-shaped: **a token
gets the rectangle, prose gets the pill.** `docs/sections.md` §2 carries the
table and `__tests__/chip-cluster.test.ts` pins every row.

## Where to go next

- Assembling a whole page → the `skene-design-system-pages` skill.
- Installing or configuring the package → `skene-design-system-setup`.
- Constraints on the module you picked → `machine/components.yaml`.
- Tokens and which role belongs on which surface → `machine/tokens.yaml`.
