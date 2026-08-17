# `Code` — the inline identifier chip

**Status:** design, pre-implementation
**Raised by:** skene-site, which asked to "only use what is in Storybook" and cannot,
because this is the one mark six of its routes need and the package does not ship.
**Gap list reference:** `skene-site/docs/design-system-gaps.md` §1, the oldest open entry.

## The problem, counted

Six route files in `skene-site` declare this component and the declarations are
**byte-identical**, verified by comparing the emitted `className` string across all six:

```
rounded-sm border border-surface-border bg-surface-2 px-[4px] py-px
font-mono text-[length:var(--font-size-body)] text-brand-peach
```

`/evaluator` · `/resources/glossary` · `/use-cases/growth` ·
`/use-cases/customer-success` · `/community/open-source` · `/developers`

A seventh spelling exists as `PROSE_CODE` on `/product/security` — the same recipe as a
descendant selector on a wrapper, for prose where the author cannot reach each `<code>`.

So: one mark, two mechanisms, seven copies, on a site where an event name or a column
name appears in nearly every paragraph of body copy. This is the highest call-site count
on the gap list and has been since the list was written.

## What already exists, and why none of it fits

Checked before proposing anything new, because the brief was explicitly "do not reinvent":

| candidate | why not |
|---|---|
| `Chip` (`sections/chip.tsx`) | A standalone pill with tone variants, sized and padded to sit *beside* text. This mark sits *inside* a sentence at body size. Different object. |
| `TagChip` (`key-value-table.tsx`) | Scoped to table cells; carries the table's own padding assumptions. |
| `Badge` (`ui/badge.tsx`) | shadcn's status marker. Theme-neutral by construction; this needs brand ink. |
| `TerminalBlock`, `McpCode` | Block-level. This is inline. |

Nothing in the 74 Storybook modules renders an inline `<code>`. The absence is real.

## Design

Two exports, because the estate genuinely has two problems and collapsing them would
leave one with no answer:

- **`Code`** — a component, for markup the caller authors.
- **`PROSE_CODE`** — a descendant-selector class string, for prose the caller does not.

### Placement: `src/sections/`, not `src/ui/`

It carries `brand.peach` on `surface.2`. Every `ui/*` part in this package is
theme-neutral by construction, and a shadcn primitive hardcoding a brand hue would be
the wrong shape for the folder it sat in.

### `onLight`, and why it cannot be inheritance

This is the part worth getting right. `brand.peach` is **mode-aware** and resolves to
`#89684a` under `light`, which is legible on cream. `surface.2` is **not** — it stays a
dark fill. So a chip inside a `light` subtree would render brown ink on a near-black box
in the middle of a cream card, and nothing would warn.

`onLight` therefore swaps the fill and the hairline explicitly rather than relying on a
`light` ancestor. This is the same trap `CheckList` documents ("`chrome.*` is invariant by
definition — cream text that can never invert, which on a cream card is invisible") and
the same one that shipped `brand.peachDeep` at 2.51:1 earlier this month.

### Contrast, to be verified rather than asserted

Targets, both to be measured against real pixels before release:

- dark default, `brand.peach` on `surface.2` — expect ≈ 8.4:1
- `onLight`, `text.primary` on `chrome.surface.on-light` — expect ≈ 7.9:1

Both must clear 4.5, not 3.0: this mark is nearly always inside a sentence at body size,
so it is body text and takes the body floor.

## Verification

1. A story rendering both grounds and the prose variant, in both modes — the same case
   that would have caught the footer's hardcoded column count.
2. `npm run tokens:contrast` with both pairs added, measured not assumed.
3. In skene-site: replace all six local declarations plus `PROSE_CODE`, then confirm the
   word bag is empty in both directions and `pixel_contrast` still reports zero failures.
   Six identical components collapsing to one import should change no rendered pixel — if
   it does, the copies were not identical and that is the finding.

## Out of scope

`Callout`/`Advisory` (gap §4) and the dark `Button` variant are the next two entries on
the same list and are deliberately not bundled here. One component, one release, one
diff that can be read.
