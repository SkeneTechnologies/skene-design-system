import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { Chip } from './chip.js';
export function PlanGrid({ className, children }) {
    // items-stretch (the grid default, stated for the reader) rather than
    // items-start. This was items-start on the reasoning that a stretched row
    // would "fight" the featured card's translate. It does not: a translate is a
    // paint-time transform and never feeds back into layout, so the only thing
    // items-start bought was cards of unequal height whose tier chips, prices and
    // CTAs all landed on different lines — which is what the captured demo does
    // NOT do. There the two outer cards are exactly equal and the featured one
    // hangs past them at both ends, which is what a lift on an equal-height card
    // looks like.
    return (_jsx("div", { className: cn('mt-14 grid items-stretch gap-5 md:grid-cols-3', className), children: children }));
}
export function PlanCard({ tier, flag, price, unit, summary, features, bestFor, action, footnote, featured = false, className, }) {
    return (_jsxs("div", { className: cn('flex min-h-[420px] flex-col rounded-2xl border p-7', featured
            ? // See the file header: `light` is load-bearing, not a theme preference.
                'light border-brand-light bg-brand-light text-chrome-surface-1 md:-translate-y-3'
            : 'border-chrome-line-subtle bg-chrome-surface-1 text-text-primary', className), style: featured ? { boxShadow: 'var(--shadow-modal)' } : undefined, children: [_jsxs("div", { className: "flex min-h-[28px] items-center justify-between gap-3", children: [_jsx(Chip, { tone: "neutral", children: tier }), flag ? (_jsx("span", { className: "font-mono text-[11px] uppercase tracking-[0.05em] text-brand-peach", children: flag })) : null] }), _jsxs("div", { className: "mb-[18px] mt-7 flex items-baseline gap-1.5", children: [_jsx("strong", { className: "text-[clamp(2.55rem,4vw,4rem)] font-normal leading-none tracking-[-0.06em]", children: price }), unit ? _jsx("span", { className: "text-text-muted", children: unit }) : null] }), summary ? (_jsx("p", { className: "mb-7 text-[14px] text-text-muted", children: summary })) : null, features, bestFor ? (_jsxs("div", { className: "mb-6 mt-auto grid gap-[3px] border-t pt-5", style: {
                    borderTopColor: featured
                        ? 'var(--color-chrome-line-on-light)'
                        : 'var(--color-chrome-line-subtle)',
                }, children: [_jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.07em] text-text-muted", children: bestFor.label }), _jsx("strong", { className: "text-[13px] font-medium", children: bestFor.value })] })) : null, _jsx("div", { className: cn(bestFor ? '' : 'mt-auto'), children: action }), footnote ? (_jsx("small", { className: "mt-3 text-center text-[11px] text-text-muted", children: footnote })) : null] }));
}
