import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { AppPanel, AppWindow } from './artifact-shell.js';
const STATE_COLOR = {
    ok: 'var(--color-semantic-matcha)',
    broken: 'var(--color-semantic-warning-amber)',
    // Themed, not `--color-text-muted`. The prototype's light register resolves
    // `--status-unknown` to `--muted-foreground`, and this artifact is always
    // light; using the themed role keeps it correct if it ever is not.
    unknown: 'var(--muted-foreground)',
};
/**
 * The hatch. 6px on, 6px at 22% — dense enough to read as a texture at 24px
 * tall and at 390px wide, coarse enough not to alias into a flat wash.
 *
 * `in oklab` rather than the prototype's `in srgb`, matching `finding-card`,
 * `stat-chip` and `comparison-table`. Mixing with `transparent` is alpha
 * scaling in either space, so the rendered result is identical.
 */
const BROKEN_HATCH = `repeating-linear-gradient(45deg, ${STATE_COLOR.broken} 0 6px, color-mix(in oklab, ${STATE_COLOR.broken} 22%, transparent) 6px 12px)`;
/**
 * One step: label, track, value.
 *
 * The track is `aria-hidden`. It encodes nothing the value cell beside it does
 * not already say in words, and a screen reader announcing a decorative div
 * between every label and its count makes the funnel harder to read, not easier.
 *
 * Below 640px the three columns collapse to one and the value moves back to the
 * left edge — a 180px label column plus an 84px value column cannot survive a
 * 390px viewport, and the prototype's own breakpoint (620px) exists for exactly
 * that. It is snapped to Tailwind's `sm` here: 640 stacks 20px sooner, which is
 * the safe direction, and the package has no 620 rung to reach for.
 */
export function FunnelRow({ label, note, value, state, fill, className }) {
    const unknown = state === 'unknown';
    return (_jsxs("div", { className: cn('grid min-w-0 grid-cols-[minmax(0,1fr)] items-center gap-[8px]', 'sm:grid-cols-[180px_minmax(0,1fr)_84px] sm:gap-[16px]', className), children: [_jsxs("div", { className: "min-w-0 text-[13px] text-foreground", children: [label, note ? (_jsx("small", { className: "mt-[2px] block font-mono text-[11px] text-muted-foreground", children: note })) : null] }), _jsx("div", { "aria-hidden": true, className: cn('h-[24px] min-w-0 overflow-hidden rounded-sm border', unknown ? 'border-dashed border-muted-foreground bg-transparent' : 'border-border bg-muted'), children: !unknown && fill !== undefined ? (_jsx("div", { className: "h-full rounded-sm", style: {
                        width: `${Math.max(0, Math.min(100, fill))}%`,
                        background: state === 'broken' ? BROKEN_HATCH : STATE_COLOR.ok,
                    } })) : null }), _jsx("div", { className: cn('font-mono text-[12px] tabular-nums text-left sm:text-right', unknown ? 'text-muted-foreground' : 'text-foreground'), children: value })] }));
}
/**
 * The complete artifact: an unbranded light window, one panel, a header strip
 * and the rows.
 *
 * Rows are children rather than a `steps` array because a step's label and its
 * value are copy, not data — one row's value is a formatted count and the next
 * one's is a sentence, and a data-shaped API would need a renderer prop to say
 * so. Same call `DataTable` makes.
 */
export function Funnel({ title, badge, meta, status = 'ok', children, className, }) {
    return (_jsx(AppWindow, { className: className, children: _jsxs(AppPanel, { children: [_jsxs("div", { className: "flex flex-wrap items-center gap-[12px] border-b border-border px-[16px] py-[12px] text-[14px] text-foreground", children: [_jsx("span", { "aria-hidden": true, className: "size-[8px] shrink-0 rounded-full", style: { background: STATE_COLOR[status] } }), _jsx("span", { children: title }), badge, meta ? (_jsx("span", { className: "ml-auto font-mono text-[11px] text-muted-foreground", children: meta })) : null] }), _jsx("div", { className: "flex min-w-0 flex-col gap-[12px] p-[16px]", children: children })] }) }));
}
