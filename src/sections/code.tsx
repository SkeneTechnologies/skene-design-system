import { cn } from '../lib/utils.js'

/**
 * The inline identifier chip: an event name, a column, a flag, a path.
 *
 * The most-duplicated thing in the estate and the oldest open entry on the gap
 * list. Six route files in skene-site declared this byte-for-byte identically —
 * verified by comparing the emitted class string across all six — and a seventh
 * spelling exists as `PROSE_CODE`, the same recipe as a descendant selector for
 * prose where the author cannot reach each `<code>`. One mark, two mechanisms,
 * seven copies, on a site where an event name appears in nearly every paragraph.
 *
 * See `documentation/20260817_code_component_design.md` for what was checked
 * before adding it: `Chip`, `TagChip`, `Badge`, `TerminalBlock` and `McpCode`
 * were each rejected for a stated reason, and nothing in the 74 gallery modules
 * renders an inline `<code>`.
 *
 * ## Why a section and not a `ui/` primitive
 *
 * It carries brand ink on a brand surface. Every `ui/*` part here is
 * theme-neutral by construction, and a shadcn primitive hardcoding a brand hue
 * would be the wrong shape for the folder it sat in.
 *
 * ## `onLight` cannot be inheritance, and this is the part that bites
 *
 * `brand.peach` is MODE-AWARE and resolves to #89684a under `light`, which is
 * legible on cream. `surface.2` is NOT — it stays a dark fill. So a chip inside
 * a `light` subtree renders brown ink on a near-black box in the middle of a
 * cream card, and nothing warns.
 *
 * `onLight` therefore swaps the fill and the hairline explicitly rather than
 * relying on a `light` ancestor. Same trap `CheckList` documents, and the same
 * one that shipped `brand.peachDeep` at 2.51:1 earlier this month.
 */

export interface CodeProps {
  children: React.ReactNode
  /** Set when the chip sits on a cream surface — a tonal band, a featured card. */
  onLight?: boolean
  className?: string
}

export function Code({ children, onLight, className }: CodeProps) {
  return (
    <code
      className={cn(
        'rounded-sm border px-[4px] py-px font-mono text-[length:var(--font-size-body)]',
        // EACH VARIANT CARRIES ITS OWN MODE CLASS, and the contrast gate is what
        // proved that necessary rather than tidy. Measured across both modes:
        //
        //   dark  brand.peach / surface.2      10.06:1   the default, as used
        //   light brand.peach / surface.2       4.30:1   below the 4.5 body floor
        //   light text.primary / brand.light   17.75:1   onLight, as used
        //   dark  text.primary / brand.light    1.00:1   invisible
        //
        // The two failing rows are each variant measured in the mode it is never
        // meant to render in — and "never meant to" is not a guarantee, it is a
        // hope about where a caller puts it. `onLight` outside a `light` subtree
        // is near-white ink on cream at 1.00:1, which is not low contrast, it is
        // the same colour.
        //
        // Pinning the mode makes each variant resolve its own tokens wherever it
        // lands, so the measured number is the rendered number. This is the
        // inverse of the `brand.peachDeep` failure: there an invariant token was
        // assumed to adapt; here mode-aware tokens are made deterministic.
        onLight
          ? 'light border-chrome-line-on-light bg-brand-light text-text-primary'
          : 'dark border-surface-border bg-surface-2 text-brand-peach',
        className,
      )}
    >
      {children}
    </code>
  )
}

/**
 * The same mark for prose the caller does not author element by element — MDX, a
 * table cell, a body rendered from a string.
 *
 * A descendant selector rather than a component, because there is no `<code>` to
 * wrap: apply it to the block that CONTAINS the prose. Kept as a second
 * mechanism deliberately rather than collapsed into the component — the two
 * solve different problems and merging them leaves one case with no answer.
 *
 * Whole class strings, never interpolated: Tailwind scans source text.
 */
export const PROSE_CODE =
  '[&_code]:rounded-sm [&_code]:border [&_code]:border-surface-border ' +
  '[&_code]:bg-surface-2 [&_code]:px-[4px] [&_code]:py-px [&_code]:font-mono ' +
  '[&_code]:text-[length:var(--font-size-body)] [&_code]:text-brand-peach'
