import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
const ACCENT_VAR = {
    peach: 'var(--color-brand-peach)',
    violet: 'var(--color-accent-violet)',
    blue: 'var(--color-accent-blue)',
    // Resolved per tile below, not here — see `neutralFor`.
    neutral: '',
};
/**
 * `neutral` is the tile's own type colour, and which token that is depends on
 * the tile rather than on the page.
 *
 * `currentColor` was the obvious answer and is wrong: an unselected tile paints
 * an invariant near-black fill, but `color` on it is inherited from whatever
 * encloses it. In the app's LIGHT mode that inherited colour is near-black too,
 * so the glyph rendered black on black and the GitHub tile lost its icon while
 * the other three — which pass a real accent — looked fine.
 */
const neutralFor = (selected) => selected ? 'var(--color-text-primary)' : 'var(--color-chrome-text-primary)';
export function SurfaceTiles({ children, className }) {
    return (_jsx("div", { className: cn(
        // auto-fit rather than a fixed four columns: this row renders inside a
        // visual slot whose width is the caller's, and four fixed columns
        // overflow it at tablet width. The floor is the width at which a
        // two-word name still fits on one line.
        'grid grid-cols-[repeat(auto-fit,minmax(112px,1fr))] gap-2.5', className), children: children }));
}
export function SurfaceTile({ icon, accent = 'neutral', name, note, selected, className, }) {
    const tint = accent === 'neutral' ? neutralFor(selected) : ACCENT_VAR[accent];
    return (_jsxs("div", { className: cn('flex min-w-0 flex-col gap-3 rounded-2xl border p-3.5', selected
            ? 'light border-chrome-line-on-light bg-brand-light'
            : 'border-chrome-line-subtle bg-chrome-surface-1', className), children: [icon ? (_jsx("span", { "aria-hidden": true, className: "grid size-8 place-items-center rounded-lg", style: {
                    color: tint,
                    background: `color-mix(in oklab, ${tint} 16%, transparent)`,
                }, children: icon })) : null, _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: cn('text-[14px] font-medium leading-snug wrap-anywhere', selected ? 'text-text-primary' : 'text-chrome-text-primary'), children: name }), note ? (_jsx("p", { className: cn('mt-1 text-[12px] leading-snug', selected ? 'text-text-muted' : 'text-chrome-text-muted'), children: note })) : null] })] }));
}
export function SurfaceDetail({ tag, children, code, className }) {
    return (_jsxs("div", { className: cn(
        // `light` for the same reason the selected tile carries it: this panel is
        // a translucent cream over whatever the field behind it is.
        'light flex flex-wrap items-start gap-x-4 gap-y-2.5 rounded-2xl border border-chrome-line-on-light p-3.5', className), style: {
            // Translucent rather than solid: the dithered field behind it is the
            // reason this panel is on a photo at all, and a solid fill would punch
            // a rectangle out of it.
            background: 'color-mix(in oklab, var(--color-brand-light) 82%, transparent)',
        }, children: [tag ? (_jsx("span", { className: "rounded-full px-2.5 py-1 text-[12px] leading-none text-text-primary", style: { background: 'color-mix(in oklab, var(--color-brand-peach) 30%, transparent)' }, children: tag })) : null, _jsxs("div", { className: "min-w-[12rem] flex-1", children: [_jsx("p", { className: "text-[13px] leading-relaxed text-text-muted-strong", children: children }), code ? (_jsx("code", { className: "mt-2.5 inline-block rounded-md border border-chrome-line-on-light bg-brand-light px-2.5 py-1.5 font-mono text-[12px] text-text-primary", children: code })) : null] })] }));
}
