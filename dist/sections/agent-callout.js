import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { SkeneMark } from '../patterns/skene-mark.js';
export function AgentCallout({ avatar, eyebrow, children, evidence, className }) {
    return (_jsxs("div", { className: cn('flex items-start gap-3.5 rounded-2xl border px-4 py-3.5', className), style: {
            // Both edges derive from the same peach so a token change moves them
            // together. Written as color-mix rather than two hand-picked tints
            // because a hardcoded rgba would not follow `brand.peach` at all.
            borderColor: 'color-mix(in oklab, var(--color-brand-peach) 34%, transparent)',
            background: 'linear-gradient(180deg, color-mix(in oklab, var(--color-brand-peach) 9%, var(--color-chrome-surface-1)), var(--color-chrome-surface-1))',
        }, children: [avatar ? (_jsx("span", { "aria-hidden": true, className: "mt-0.5 grid size-7 shrink-0 place-items-center overflow-hidden rounded-lg", children: avatar })) : (
            // The real symbol, not a letter in a disc. The demo drew a peach circle
            // with an "S" in it because it had no access to the artwork; this
            // package ships the artwork, and every place the product speaks for
            // itself uses the same mark.
            _jsx(SkeneMark, { size: 28, radius: 10, className: "mt-0.5" })), _jsxs("div", { className: "min-w-0", children: [eyebrow ? (_jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.16em] text-brand-peach", children: eyebrow })) : null, _jsx("p", { className: cn('text-[14px] font-medium leading-snug text-chrome-text-primary', eyebrow && 'mt-1.5'), children: children }), evidence ? (_jsx("p", { className: "mt-1 text-[12px] leading-snug text-chrome-text-muted", children: evidence })) : null] })] }));
}
