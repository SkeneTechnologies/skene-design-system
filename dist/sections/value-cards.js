import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * The label colour is the only token that moves with `tone`. Both are mode-aware
 * roles, so each lands on its designed value in either polarity.
 */
const TONE_ACCENT = {
    cost: 'var(--color-semantic-error-red)',
    gain: 'var(--color-brand-peach)',
};
export function ValueCards({ children, className }) {
    return (
    // auto-fit, not a fixed column count: the argument is "N costs then one
    // gain" and N is the caller's, so the grid must not encode it. Stacked below
    // `md` so the sequence reads top to bottom, which is the order the contrast
    // depends on.
    _jsx("div", { className: cn('grid gap-4 md:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]', className), children: children }));
}
export function ValueCard({ label, title, tone = 'cost', children, className }) {
    const accent = TONE_ACCENT[tone];
    const gain = tone === 'gain';
    return (_jsxs("article", { className: cn('h-full rounded-[14px] border p-7', className), style: {
            // See the file header: mixed from the mode-aware text role, so the wash
            // and the rule stay near-invisible on a dark page AND on a cream one.
            borderColor: gain
                ? `color-mix(in oklab, ${accent} 34%, transparent)`
                : 'color-mix(in oklab, var(--color-text-primary) 14%, transparent)',
            backgroundColor: 'color-mix(in oklab, var(--color-text-primary) 1.8%, transparent)',
            // The gain's wash is directional on purpose — it enters from the left
            // edge and fades out, so the last card reads as arriving rather than as
            // one more tile. Layered over the base fill, not replacing it.
            backgroundImage: gain
                ? `linear-gradient(90deg, color-mix(in oklab, ${accent} 12%, transparent), transparent 62%)`
                : undefined,
        }, children: [label ? (_jsx("span", { className: "block font-mono text-[11px] uppercase tracking-[0.08em]", style: { color: accent }, children: label })) : null, _jsx("strong", { className: cn('block text-[1.25rem] font-normal leading-snug tracking-[-0.01em] text-text-primary', label && 'mt-3'), children: title }), children ? (_jsx("p", { className: "mt-2.5 text-[0.86rem] leading-relaxed text-text-muted", children: children })) : null] }));
}
