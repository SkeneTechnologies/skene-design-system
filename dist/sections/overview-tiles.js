import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * The grid.
 *
 * `auto-fit` and not a column count, for the same reason `ValueCards` refuses
 * one: the number of tiles is the caller's and the grid must not encode it.
 *
 * The track floor is `minmax(min(160px, 100%), 1fr)` and the `min()` is the
 * whole reason this survives 390px. A bare `minmax(160px, 1fr)` sets a hard
 * 160px floor, so on any container narrower than that — a phone inside an
 * `ArtFrame`'s padding inside an `AppWindow`'s padding — the single column is
 * still 160px wide and the page scrolls sideways. `min(160px, 100%)` collapses
 * the floor to the container instead. This is the line that keeps the overflow
 * gate green; do not "simplify" it.
 */
export function OverviewTiles({ children, className }) {
    return (_jsx("div", { className: cn('grid gap-[12px] [grid-template-columns:repeat(auto-fit,minmax(min(160px,100%),1fr))]', className), children: children }));
}
/**
 * One tile.
 *
 * `min-w-0` is not defensive tidying: without it a grid item's automatic
 * minimum size is its content, so one long value would widen its own track past
 * `1fr` and take the page's horizontal scrollbar with it.
 *
 * `break-words` on the value is the one deviation from `artifacts.css`. The
 * prototype does not need it because it owns its copy and every value there has
 * a space to wrap at; this package ships no copy, so the guarantee cannot rest
 * on a caller passing a breakable string. It changes nothing about how the
 * prototype's own values render.
 *
 * Plain `span`/`div`/`small` rather than `dl`/`dt`/`dd`. The pairing is real,
 * but a description list would put the markup for one tile across two elements
 * that a `<div>` wrapper has to re-associate, and the caller composes tiles as
 * children — the semantic gain does not survive the ergonomics. The prototype's
 * element choice is kept so the two can be diffed.
 */
export function OverviewTile({ label, value, note, className }) {
    return (_jsxs("div", { className: cn('min-w-0 rounded-sm border border-border bg-card p-[12px]', className), children: [_jsx("span", { className: "mb-[8px] block font-mono text-[9px] uppercase tracking-[0.9px] text-muted-foreground", children: label }), _jsx("div", { className: "break-words text-[24px] leading-[1.15] text-foreground", children: value }), note ? (_jsx("small", { className: "mt-[4px] block text-[12px] text-muted-foreground", children: note })) : null] }));
}
