import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { STATUS_TOKEN } from '../lib/status.js';
import { cn } from '../lib/utils.js';
export function Finding({ status, tag, title, note, onLight = true, className }) {
    const color = STATUS_TOKEN[status];
    return (_jsxs("div", { className: cn('grid grid-cols-[68px_1fr] items-start gap-x-3 rounded-[10px] border p-[13px]', onLight
            ? 'border-chrome-line-on-light bg-white text-chrome-surface-1'
            : 'border-chrome-line-subtle bg-chrome-surface-2 text-chrome-text-primary', className), children: [_jsx("span", { className: "row-span-2 w-fit self-start rounded px-[5px] py-[3px] font-mono text-[9px] uppercase tracking-[0.04em]", style: { background: `color-mix(in oklab, ${color} 18%, transparent)`, color }, children: tag }), _jsx("strong", { className: "text-[13px] font-medium", children: title }), note ? (_jsx("small", { className: cn('col-start-2 text-[11px]', onLight ? 'opacity-55' : 'text-chrome-text-muted-warm'), children: note })) : null] }));
}
/**
 * The big number. Deliberately `font-weight: 400` at 2.6rem — the captured demo
 * sets display numerals light and tight, and bolding them makes the page read
 * like a dashboard rather than an argument about one.
 */
export function MetricCard({ label, value, delta, trend = 'danger', className, children }) {
    return (_jsxs("div", { className: cn('p-[22px]', className), children: [_jsx("span", { className: "block text-[13px] opacity-70", children: label }), _jsx("strong", { className: "my-1.5 inline-block text-[2.6rem] font-normal leading-none tracking-[-0.05em]", children: value }), delta ? (_jsx("span", { className: "ml-2 text-[13px]", style: { color: STATUS_TOKEN[trend] }, children: delta })) : null, children] }));
}
/**
 * A bar sparkline with one bar called out.
 *
 * Not a chart: there are no axes, no scale, and the values are authored rather
 * than measured. It exists to make a shape legible at a glance inside a section,
 * which is why `highlight` is an index and not a threshold — the copy decides
 * which bar matters, not the data.
 */
export function Sparkline({ bars, highlight, className }) {
    return (_jsx("div", { className: cn('mt-6 flex h-[74px] items-end gap-[5px]', className), "aria-hidden": true, children: bars.map((h, i) => (_jsx("i", { className: "min-w-[6px] flex-1 rounded-t-[3px]", style: {
                height: `${Math.max(0, Math.min(100, h))}%`,
                background: i === highlight
                    ? 'var(--color-brand-peach)'
                    : 'color-mix(in oklab, var(--color-brand-peach) 32%, transparent)',
            } }, i))) }));
}
