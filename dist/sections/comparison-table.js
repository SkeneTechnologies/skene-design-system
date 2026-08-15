import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement } from 'react';
import { cn } from '../lib/utils.js';
/**
 * The capability comparison: one row per claim, one column per approach, with
 * ours picked out.
 *
 * ## The WRAPPER scrolls, not the table — and the min-width is the reason
 *
 * The table is `min-width: 820px` and the wrapper is what carries
 * `overflow-x: auto`. That pairing is the component. A comparison table exists
 * so a reader can hold one row in the eye and sweep it across three or four
 * columns; if the layout reflows below ~820px — stacking columns, wrapping cells
 * onto two lines, collapsing to cards — the columns stop being adjacent and the
 * table stops being comparable. It is then a list of facts about each product in
 * turn, which is the thing the reader came here NOT to do. So on a narrow
 * screen this keeps its shape and scrolls sideways: a comparison you have to
 * push is still a comparison. The wrapper is also `tabIndex={0}`, because a
 * region that only scrolls with a pointer is unreachable without one.
 *
 * The corollary: never put `min-w-*` on the wrapper or `overflow` on the table.
 * Swap those two and the page body scrolls horizontally instead of the panel.
 *
 * ## The featured column is marked in BOTH head and body
 *
 * `featuredIndex` washes the header cell AND every body cell down that column,
 * not just the header. Marking only the header loses the column the moment the
 * eye leaves the top of the table: by row four the reader is counting cells
 * across to work out which column they are in, and a comparison that has to be
 * counted has already failed. The wash is continuous so the column reads as one
 * object from the top of the table to the bottom, and the header additionally
 * turns peach so the identity of that object is stated once, in words.
 *
 * ## Why a real `<table>`
 *
 * This is tabular data: every cell means something only as the intersection of a
 * row and a column. Divs give a screen reader a pile of text in DOM order and
 * the association is gone. Column headers are `<th scope="col">`, the leading
 * cell of each row is a `<th scope="row">`, and `caption` is a real `<caption>`
 * so the table carries its own name rather than borrowing a heading that may
 * not be adjacent to it. `TableCheck`/`TableDash` are glyphs, so they carry an
 * `sr-only` word — a cell whose entire content is `aria-hidden` is an empty cell
 * to a reader, which reads as "no data" rather than "no".
 *
 * ## Tokens
 *
 * Nothing here uses `chrome.text.*`. This band renders on a dark page or inside
 * a cream one, and `chrome.*` is invariant by definition — it cannot follow a
 * `light` ancestor, so on cream it renders cream on cream. Type is the
 * theme-aware `text.*` role throughout, and the wash is `brand.peach`, which is
 * mode-aware and lands on its darker light value inside a cream band.
 *
 * This component paints no ground of its own, so it must NOT carry `light` or
 * `dark`: it inherits the polarity of the band it is dropped into, and claiming
 * one would be a lie in half its call sites. The one thing that cannot follow
 * from that is the hairline — on cream the right token is `chrome.line.onLight`,
 * on a dark ground `chrome.line.subtle`, and no mode-aware role covers the pair.
 * Hence `onLight`, resolved once into `--table-rule` on the wrapper and consumed
 * by every rule below it, the same shape `CheckList` uses for the same reason.
 *
 * No `use client`: props in, markup out. `featuredIndex` reaches the rows by
 * cloning rather than by context, because `createContext` would drag this whole
 * static table across the client boundary to pass one number.
 */
/** Faint enough to read as a tint on the ground, not as a second surface. */
const FEATURED_WASH = 'color-mix(in oklab, var(--color-brand-peach) 8%, transparent)';
/** 20px/22px from the capture. Every cell, head and body, shares it. */
const CELL = 'px-[22px] py-5 text-left align-middle';
export function ComparisonRow({ header, cells, featuredIndex, className }) {
    return (_jsxs("tr", { className: className, children: [_jsx("th", { scope: "row", 
                // 40% for the claim, 20% each for the answers: the row header is the
                // only cell carrying a sentence, and equal columns would wrap it while
                // leaving the check marks floating in space.
                className: cn(CELL, 'w-[40%] border-b border-r text-[14px] font-medium text-text-primary'), style: { borderColor: 'var(--table-rule)' }, children: header }), cells.map((cell, i) => {
                // `cells[i]` is column `i + 1`; column 0 is the row header. See
                // `featuredIndex` on ComparisonTable — one index space for both.
                const featured = featuredIndex === i + 1;
                const last = i === cells.length - 1;
                return (_jsx("td", { className: cn(CELL, 'w-[20%] border-b text-[14px] text-text-muted-strong', 
                    // The last column has no right rule; the wrapper's border is the
                    // edge there, and a second line beside it reads as a seam.
                    !last && 'border-r'), style: {
                        borderColor: 'var(--table-rule)',
                        background: featured ? FEATURED_WASH : undefined,
                    }, children: cell }, i));
            })] }));
}
export function ComparisonTable({ columns, featuredIndex, caption, children, onLight = false, className, }) {
    // toArray drops nulls and falses, so a conditionally rendered row cannot leave
    // a hole. An explicit `featuredIndex` on a row wins, so a caller can still
    // override one row without unpicking the table's.
    const rows = Children.toArray(children).map((child) => isValidElement(child)
        ? cloneElement(child, { featuredIndex: child.props.featuredIndex ?? featuredIndex })
        : child);
    return (_jsx("div", { 
        // tabIndex, because this is the scroll container — see the file header.
        tabIndex: 0, className: cn(
        // `relative`, and it is load-bearing rather than tidy. `TableCheck` and
        // `TableDash` each carry an `sr-only` label, which is Tailwind's
        // `position: absolute` recipe. An absolutely positioned descendant is
        // NOT clipped by an `overflow` ancestor unless that ancestor is its
        // containing block — so without this, every sr-only span in the table
        // positions against whatever distant ancestor happens to be positioned,
        // escapes the scroll container, and adds its offset to the PAGE's
        // horizontal extent. skene-site measured /pricing scrolling sideways by
        // 320px at 390 and fixed it with `relative` at the call site, which is
        // the package's bug being paid for in a consumer.
        'relative overflow-x-auto rounded-[14px] border', onLight
            ? '[--table-rule:var(--color-chrome-line-on-light)]'
            : '[--table-rule:var(--color-chrome-line-subtle)]', className), style: { borderColor: 'var(--table-rule)' }, children: _jsxs("table", { className: "w-full min-w-[820px] border-collapse", children: [caption ? (_jsx("caption", { className: "px-[22px] py-4 text-left text-[13px] text-text-muted [caption-side:bottom]", children: caption })) : null, _jsx("thead", { children: _jsx("tr", { children: columns.map((column, i) => {
                            const featured = featuredIndex === i;
                            const last = i === columns.length - 1;
                            return (_jsx("th", { scope: "col", className: cn(CELL, i === 0 ? 'w-[40%]' : 'w-[20%]', 'border-b font-mono text-[12px] font-normal uppercase tracking-[0.09em]', !last && 'border-r', 
                                // The head states the featured column in words as well as in
                                // wash; the body only has the wash to work with.
                                featured ? 'text-brand-peach' : 'text-text-primary'), style: {
                                    borderColor: 'var(--table-rule)',
                                    background: featured ? FEATURED_WASH : undefined,
                                }, children: column }, i));
                        }) }) }), _jsx("tbody", { className: "[&>tr:last-child>*]:border-b-0", children: rows })] }) }));
}
/** Yes, in `semantic.matcha` — the same "good" the findings use. */
export function TableCheck({ label = 'Yes', className }) {
    return (_jsxs("span", { className: cn('text-[15px] leading-none text-semantic-matcha', className), children: [_jsx("span", { "aria-hidden": true, children: "\u2713" }), _jsx("span", { className: "sr-only", children: label })] }));
}
/**
 * No. A dash, not a cross: the absent case is the majority of the table, and a
 * column of red crosses argues at a volume the copy does not. Its colour is
 * derived from the mode-aware `text.primary` rather than taken from a role,
 * because nothing in the scale is this faint — and derived from THAT token
 * specifically so it inverts with the band instead of vanishing on cream.
 */
export function TableDash({ label = 'No', className }) {
    return (_jsxs("span", { className: cn('text-[15px] leading-none', className), children: [_jsx("span", { "aria-hidden": true, style: { color: 'color-mix(in oklab, var(--color-text-primary) 30%, transparent)' }, children: "\u2014" }), _jsx("span", { className: "sr-only", children: label })] }));
}
