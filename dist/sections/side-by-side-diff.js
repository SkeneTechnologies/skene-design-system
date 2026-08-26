import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * The same two the findings use — removals are `semantic.errorRed`, additions
 * are `semantic.matcha` — so a reader who has already learned the page's colour
 * for "broken" meets it again here rather than a diff-viewer's own red.
 */
const DIFF_TOKEN = {
    del: 'var(--color-semantic-error-red)',
    add: 'var(--color-semantic-matcha)',
};
/**
 * Percentage of the line colour washed behind it. Matcha is a pale green and
 * red is a saturated one, so equal mixes do not read as equal weight; the two
 * points of difference make the added block sit at the same visual density as
 * the removed one.
 */
const DIFF_WASH = { del: 8, add: 10 };
/**
 * The header label takes the colour of the lines beneath it, and the binding is
 * to the SIDE rather than to a prop. A caller cannot label "what the agent
 * wrote" in matcha, because the column that is being corrected is structurally
 * the left one and a green heading over red lines is a miscue, not a theme.
 */
const SIDE_TOKEN = {
    before: DIFF_TOKEN.del,
    after: DIFF_TOKEN.add,
};
/**
 * One line of a hunk.
 *
 * A block element per line rather than one `<pre>` with newlines, because the
 * add and del states are full-bleed row tints and a background on an inline run
 * stops at the end of the glyphs. That is also why the line does not set its own
 * width: it fills the `w-max` sizer inside the column's scroller, so a short
 * removed line stays tinted all the way across a hunk that is wider than the
 * viewport.
 *
 * It restates the mono family and 13px that the column already sets. Redundant
 * in place, deliberate out of it — a line lifted into a caller's own panel
 * should not silently become 16px body text.
 */
export function DiffLine({ kind = 'ctx', addedLabel = 'Added', removedLabel = 'Removed', children, className, }) {
    const tint = kind === 'ctx' ? null : { color: DIFF_TOKEN[kind], wash: DIFF_WASH[kind] };
    return (_jsxs("div", { className: cn('whitespace-pre px-[12px] py-[4px] font-mono text-[13px]', tint === null && 'text-terminal-chrome-github-text', className), style: tint
            ? {
                color: tint.color,
                background: `color-mix(in oklab, ${tint.color} ${tint.wash}%, transparent)`,
            }
            : undefined, children: [kind === 'ctx' ? null : (_jsx("span", { className: "sr-only", children: kind === 'add' ? addedLabel : removedLabel })), children] }));
}
/**
 * One code column: a chrome heading and the hunk under it.
 *
 * The hunk is the scroll container, and it is the ONLY one. The prototype put
 * `overflow-x: auto` on every individual line as well, which does keep the page
 * from scrolling but gives a long hunk one scroller per row: pushing line two
 * sideways to finish reading a call leaves lines one and three where they were,
 * and code whose lines no longer line up has stopped being code. Here the column
 * scrolls as a body — one gesture, one focus stop, every line still in register.
 * The `w-max` sizer between the scroller and the lines is what buys that: it
 * takes the width of the widest line so the shorter ones, being blocks, stretch
 * to match instead of ending their tint at the fold.
 *
 * `tabIndex={0}` because a region that only scrolls with a pointer is
 * unreachable without one — the same reason `ComparisonTable`'s wrapper carries
 * it.
 */
export function DiffColumn({ side, label, lines, addedLabel, removedLabel, className, }) {
    return (_jsxs("div", { className: cn('min-w-0', className), children: [_jsx("div", { className: "flex min-h-[32px] items-center gap-[8px] border-b border-terminal-chrome-github-border bg-terminal-chrome-github-dark-surface px-[12px] py-[8px] font-mono text-[11px] uppercase tracking-[0.16em] text-terminal-chrome-github-text", children: _jsx("b", { className: "font-medium", style: { color: SIDE_TOKEN[side] }, children: label }) }), _jsx("div", { tabIndex: 0, className: "overflow-x-auto py-[12px] font-mono text-[13px] text-terminal-chrome-github-text", children: _jsx("div", { className: "w-max min-w-full", children: lines.map((line, i) => (_jsx(DiffLine, { kind: line.kind, addedLabel: addedLabel, removedLabel: removedLabel, children: line.text }, i))) }) })] }));
}
/**
 * The pair of columns. Drop it straight into an `ArtPanel` — that component
 * already owns the rounded, clipped, GitHub-bordered frame and the title bar
 * this artifact wears in the prototype, so nothing of `.art` is restated here.
 *
 * Two equal `minmax(0, 1fr)` tracks that collapse to one below 821px. The
 * breakpoint is the prototype's 820px and not Tailwind's `md`, because it is
 * measured rather than chosen: two 13px mono columns stop holding a readable
 * run of code somewhere just under that, and moving the collapse down to 768
 * buys 52px of width at the cost of four characters per side. Below it the
 * columns stack and the divider becomes the rule between them, so a 390px
 * screen reads before-then-after down the page with no horizontal scroll of the
 * body — the diff loses its adjacency, which at that width it had already lost.
 *
 * The divider is an adjacent-sibling rule rather than a border on the column, so
 * a column standing on its own has no orphaned edge and the first one in the
 * stack has no rule above it.
 *
 * `dark` is on this element. See the file header: the ground is invariant but
 * the ink is not.
 */
export function SideBySideDiff({ children, className }) {
    return (_jsx("div", { className: cn('dark grid min-w-0 grid-cols-1 bg-terminal-chrome-github-dark-bg', '[&>*+*]:border-t [&>*+*]:border-terminal-chrome-github-border', 'min-[821px]:grid-cols-2 min-[821px]:[&>*+*]:border-l min-[821px]:[&>*+*]:border-t-0', className), children: children }));
}
