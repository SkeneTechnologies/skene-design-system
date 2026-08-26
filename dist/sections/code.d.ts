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
    children: React.ReactNode;
    /** Set when the chip sits on a cream surface — a tonal band, a featured card. */
    onLight?: boolean;
    className?: string;
}
export declare function Code({ children, onLight, className }: CodeProps): import("react").JSX.Element;
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
export declare const PROSE_CODE: string;
//# sourceMappingURL=code.d.ts.map