import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
export function LogoSlot({ children, label, className }) {
    return (_jsx("div", { "aria-label": children ? label : undefined, 
        // border/muted: the themed pair, so the outline survives both grounds —
        // the same choice GlyphBadge's `muted` tone documents. The wireframe's
        // 56px height is kept as the minimum rather than a fixed height so a
        // real logo with padding cannot overflow the box that was sized for
        // nothing.
        //
        // `min-h-[56px]`, not `min-h-14`. See the spacing note in the file
        // header: this module shipped at 80% of the size its own comment claims
        // because `--spacing: 0.2rem` makes step 14 measure 44.8px.
        className: cn('grid min-h-[56px] place-items-center rounded-[var(--radius-md)] border border-border bg-muted', className), children: children }));
}
export function LogoRow({ title, stat, count = 5, children, caption, decorative = true, className, }) {
    // Children fill slots left to right; the remainder render empty. The blanks
    // are appended here rather than asking callers to pad with them, because the
    // common case — no children at all — should be zero markup at the call site.
    const filled = Array.isArray(children) ? children.length : children != null ? 1 : 0;
    const blanks = Math.max(0, count - filled);
    return (_jsxs("section", { className: cn('mx-auto w-full', className), children: [title ? (_jsx("div", { className: "mx-auto mb-[24px] max-w-[640px] text-center", children: _jsx("h2", { className: "text-[clamp(1.4rem,2.2vw,1.8rem)] font-medium tracking-[-0.01em] text-text-primary", children: title }) })) : null, stat ? (
            // The figures are the caller's <strong>s; the base ink is muted so
            // they read as the emphasis without this component styling them.
            _jsx("p", { className: "mx-auto mb-[24px] max-w-[560px] text-center text-[14px] leading-relaxed text-text-muted-strong [&_strong]:font-medium [&_strong]:text-text-primary", children: stat })) : null, _jsxs("div", { "aria-hidden": decorative || undefined, className: "mx-auto grid max-w-[900px] grid-cols-2 gap-[14px] sm:grid-cols-[repeat(var(--logo-row-count),1fr)]", style: { '--logo-row-count': count }, children: [children, Array.from({ length: blanks }, (_, i) => (_jsx(LogoSlot, {}, i)))] }), caption ? (_jsx("p", { className: "mx-auto mt-[14px] max-w-[480px] text-center text-[12.5px] leading-[1.6] text-text-muted", children: caption })) : null] }));
}
