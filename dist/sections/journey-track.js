import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { STATUS_TOKEN } from '../lib/status.js';
import { cn } from '../lib/utils.js';
/**
 * The colour this step contributes to a connector touching it.
 *
 * `warn` fades to the mode-aware border grey instead of amber — see the file
 * header: an unmeasured step has no claim to make about the link.
 */
function connectorStop(state) {
    return state === 'warn' ? 'var(--color-surface-border)' : STATUS_TOKEN[state];
}
function ringStyle(state) {
    const color = STATUS_TOKEN[state];
    return {
        borderColor: `color-mix(in oklab, ${color} 55%, transparent)`,
        background: `color-mix(in oklab, ${color} 12%, transparent)`,
        color,
    };
}
export function JourneyStep({ label, note, state, index, className }) {
    return (_jsxs("li", { className: cn(
        // [34px 1fr] with the ring spanning both rows, so the label and its note
        // share one left edge and the ring hangs beside the pair rather than
        // sitting on the label's baseline.
        'grid min-w-0 grid-cols-[34px_1fr] items-start gap-x-3 gap-y-1', className), children: [_jsx("span", { "aria-hidden": true, className: "row-span-2 flex h-[34px] w-[34px] shrink-0 items-center justify-center self-start rounded-full border font-mono text-[12px] leading-none", style: ringStyle(state), children: index }), _jsx("strong", { className: "min-w-0 text-[14px] font-medium leading-snug text-text-primary", children: label }), note ? (_jsx("small", { className: "col-start-2 text-[11px] leading-snug", style: { color: STATUS_TOKEN[state] }, children: note })) : null] }));
}
function JourneyConnector({ from, to }) {
    return (_jsx("li", { "aria-hidden": true, className: cn(
        // The angle rides a custom property because a gradient's direction has to
        // change at the breakpoint and an inline style cannot hold a media query.
        // Stacked it runs top-to-bottom; from `md` up, left-to-right.
        '[--journey-connector-angle:180deg] md:[--journey-connector-angle:90deg]', 
        // Stacked: a 1px column, indented to the centre of the 34px ring.
        'ml-[17px] h-[22px] w-px shrink-0', 
        // Row: a 1px rule pinned to that same centre, shrinking from 86px.
        'md:ml-0 md:mt-[17px] md:h-px md:w-auto md:min-w-[24px] md:flex-[0_1_86px] md:self-start'), style: {
            background: `linear-gradient(var(--journey-connector-angle, 180deg), ${connectorStop(from)}, ${connectorStop(to)})`,
        } }));
}
export function JourneyTrack({ steps, title, subtitle, className }) {
    const row = [];
    steps.forEach((step, i) => {
        row.push(_jsx(JourneyStep, { ...step, index: step.glyph ?? i + 1 }, `step-${i}`));
        if (i < steps.length - 1) {
            row.push(_jsx(JourneyConnector, { from: step.state, to: steps[i + 1].state }, `link-${i}`));
        }
    });
    return (_jsxs("div", { className: cn('p-7', className), children: [title ? _jsx("p", { className: "text-[14px] text-text-primary", children: title }) : null, subtitle ? _jsx("p", { className: "mt-1 text-[12px] text-text-muted", children: subtitle }) : null, _jsx("ol", { className: cn('m-0 flex list-none flex-col items-stretch p-0', 'md:flex-row md:items-start md:justify-between', title || subtitle ? 'mt-5' : ''), children: row })] }));
}
/**
 * The small stacked readout that sits beside a `JourneyTrack`: label, figure,
 * and a track bar under each pair.
 *
 * Not a chart — no axis, no scale, and the widths are authored rather than
 * measured. It exists to make a drop-off legible at a glance, which is why the
 * bars are the only comparison offered and why they are `aria-hidden`: the
 * numbers are already in the row, so a reader announcing the bar would hear the
 * same fact twice with less precision.
 *
 * The fill width comes from a CSS variable rather than being set on `width`
 * directly. That is the seam: the figure is authored in one place, and a wrapper
 * can transition or override it — a bar that grows on scroll, a stage that
 * animates in — without this component owning any animation or any state.
 *
 * The fill is `brand.peach`, the same colour the sparkline's called-out bar
 * uses. These are quantities, not health, so they must not borrow the status
 * triple: a green bar next to a red one would read as a verdict the numbers are
 * not making.
 */
export function MiniFunnel({ rows, className }) {
    return (_jsx("ul", { className: cn('m-0 grid list-none gap-3.5 p-0', className), children: rows.map((row, i) => (_jsxs("li", { className: "grid gap-1.5", children: [_jsxs("div", { className: "flex items-baseline justify-between gap-3", children: [_jsx("span", { className: "min-w-0 text-[12px] text-text-muted", children: row.label }), _jsx("strong", { className: "shrink-0 font-mono text-[12px] font-medium text-text-primary", children: row.value })] }), _jsx("div", { "aria-hidden": true, className: "h-[5px] w-full overflow-hidden rounded-full bg-surface-2", style: { '--mini-funnel-fill': `${Math.max(0, Math.min(100, row.fill))}%` }, children: _jsx("i", { className: "block h-full rounded-full bg-brand-peach", style: { width: 'var(--mini-funnel-fill, 0%)' } }) })] }, i))) }));
}
