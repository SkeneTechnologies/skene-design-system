import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { AppPanel, DataCell, DataRow, DataTable } from './artifact-shell.js';
/**
 * Inline `<code>` inside a cell. The prototype styles this globally as `td code`;
 * the package cannot ship a global element rule, so it is scoped to the cells of
 * this table.
 *
 * One deviation: the prototype's dark page paints code peach on `surface-2`,
 * which are dark-ladder tokens and would stay dark inside a `light` `AppWindow`.
 * These are the themed roles instead, so the same table reads correctly in both
 * polarities. It costs the peach.
 */
const CODE_IN_CELL = [
    '[&_code]:rounded-sm [&_code]:border [&_code]:border-border [&_code]:bg-muted',
    '[&_code]:px-[4px] [&_code]:py-[1px] [&_code]:font-mono [&_code]:text-[0.9em]',
    '[&_code]:text-foreground',
].join(' ');
export function KeyValueTable({ columns, rows, density = 'reference', headerless = false, className, }) {
    const reference = density === 'reference';
    if (headerless) {
        // The formatting below mirrors `DataCell` plus this file's reference-density
        // additions, cell for cell, so a headerless table beside a headed one at the
        // same density reads as the same table minus its header bar. The row rule is
        // `DataRow`'s 60% mix for the same reason.
        return (_jsx("dl", { className: cn('m-0 w-full', className), children: rows.map((row, r) => (_jsx("div", { className: cn('grid border-b last:border-b-0', row.className), style: {
                    gridTemplateColumns: `max-content repeat(${Math.max(1, columns.length - 1)}, minmax(0, 1fr))`,
                    borderColor: 'color-mix(in oklab, var(--border) 60%, transparent)',
                }, children: columns.map((column, c) => {
                    const Cell = c === 0 ? 'dt' : 'dd';
                    return (_jsx(Cell, { className: cn(CODE_IN_CELL, 'm-0 px-[12px] text-[13px] font-normal text-foreground', reference ? 'py-[12px] normal-nums' : 'py-[8px] tabular-nums', (column.mono ?? (reference && c === 0)) && 'font-mono', column.muted && 'text-[12px] text-muted-foreground', (column.nowrap ?? (reference && c === 0)) && 'whitespace-nowrap', column.strong && 'font-medium', column.className), children: row.cells[c] }, c));
                }) }, row.id ?? r))) }));
    }
    return (_jsx(DataTable, { columns: columns.map((column) => column.header), 
        // `DataTable` paints `bg-card` because the product's panel is a card. A
        // reference table sits on the marketing page's own panel and must let that
        // fill through; painting card over it is a visible seam, not a no-op.
        className: cn(reference && 'bg-transparent', className), children: rows.map((row, r) => (_jsx(DataRow, { 
            // No hover: nothing in a reference table is clickable, and a row that
            // lights up promises otherwise.
            className: cn(reference && 'hover:bg-transparent', row.className), children: columns.map((column, c) => (_jsx(DataCell, { mono: column.mono ?? (reference && c === 0), muted: column.muted, className: cn(CODE_IN_CELL, reference && 'py-[12px] align-top normal-nums', (column.nowrap ?? (reference && c === 0)) && 'whitespace-nowrap', column.strong && 'font-medium', column.className), children: row.cells[c] }, c))) }, row.id ?? r))) }));
}
/**
 * A redacted secret: a prefix, then a bullet run that ends.
 *
 * The run is FIXED and has no tail, and both halves of that are the point. Real
 * key UIs show the last four characters because that is how an operator tells two
 * keys apart — which makes those four characters the identifying part, and
 * showing them the leak this component exists to avoid. Deriving the bullet count
 * from a real key's length would leak it a second way, more quietly. So the
 * caller passes a count or takes 16, and a rendering of this can never be walked
 * back to a key.
 *
 * The bullets are `aria-hidden`. A screen reader announcing "bullet" sixteen times
 * is not conveying the redaction, it is reading the redaction aloud; the prefix
 * alone carries everything the run does.
 */
export function MaskedValue({ prefix, length = 16, className }) {
    return (_jsxs("span", { className: cn('whitespace-nowrap font-mono', className), children: [prefix, _jsx("span", { "aria-hidden": true, children: '•'.repeat(Math.max(0, length)) })] }));
}
/**
 * The paragraph above a table, in a panel of its own — the prototype's `.akw`.
 *
 * It is an `AppPanel` and not a bare `<p>` because in the surface being depicted
 * it genuinely is a second card: the product stacks a bordered advisory over the
 * bordered key list, and a note without the border reads as page copy that
 * happened to land inside the window. The 12px bottom margin is the gap to the
 * table; it is on the note rather than the table because a table may appear
 * without one.
 */
export function TableNote({ className, children }) {
    return (_jsx(AppPanel, { className: cn('mb-[12px] p-[12px] text-[12px] text-muted-foreground', className), children: children }));
}
/**
 * The neutral 11px mono tag.
 *
 * Distinct from `Chip`, deliberately, and the two should not be merged. `Chip` is
 * 10px uppercase and tracked, carries a `tone` and is a STATE — healthy, live, a
 * plan tier. This one carries no colour, no uppercasing and no tracking, and is
 * an identifier reproduced verbatim: `Secret`, a table name, an operand's role.
 * Uppercasing a table name is a lie about what the reader should type.
 *
 * The margin is the prototype's and is a run of chips wrapping in flow, not a
 * flex row — which is why it is `mr`/`mb` on the chip rather than a `gap` on a
 * parent that may not exist. In a cell holding exactly one chip that leaves 4px
 * under it; `className="m-0"` is the escape, and a flex parent should use it.
 *
 * `overflow-wrap: anywhere` rather than `break-words`: these hold identifiers
 * with no spaces to break at, and at 390px in a three-column table an unbroken
 * one is what widens the track.
 */
export function TagChip({ variant = 'outline', className, children }) {
    return (_jsx("span", { className: cn('mb-[4px] mr-[4px] inline-block max-w-full rounded-sm border px-[8px] py-[1px]', 'font-mono text-[11px] [overflow-wrap:anywhere]', variant === 'solid'
            ? 'border-foreground bg-foreground text-background'
            : 'border-border bg-muted text-muted-foreground', className), children: children }));
}
