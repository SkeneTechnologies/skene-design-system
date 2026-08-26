import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
export function RecommendationCard({ eyebrow, title, children, meta, className, }) {
    return (_jsxs("article", { className: cn('rounded-xl border px-4 py-3.5 text-text-primary', className), style: {
            // Both derived from currentColor, which follows a `light` ancestor —
            // the same mechanism `StatChip` uses. A fixed token would be invisible
            // on one of the two grounds this card ships on.
            borderColor: 'color-mix(in oklab, currentColor 12%, transparent)',
            background: 'color-mix(in oklab, currentColor 4%, transparent)',
        }, children: [eyebrow ? (_jsx("p", { className: "font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted", children: eyebrow })) : null, _jsx("h4", { className: cn('text-[15px] font-medium leading-snug', eyebrow && 'mt-1.5'), children: title }), children ? (_jsx("p", { className: "mt-1.5 text-[13px] leading-relaxed text-text-muted", children: children })) : null, meta ? _jsx("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: meta }) : null] }));
}
