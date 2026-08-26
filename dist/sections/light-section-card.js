import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eyebrow } from '../patterns/marketing.js';
import { cn } from '../lib/utils.js';
export function LightSectionCard({ eyebrow, title, titleScale = 'display', lede, children, actions, visual, reverse = false, className, }) {
    const hasProof = Boolean(children || actions);
    return (_jsxs("section", { className: cn(
        // `light` first, and never conditional — see the file header.
        'light grid overflow-hidden rounded-3xl border border-chrome-line-on-light bg-brand-light', visual && (reverse ? 'md:grid-cols-[0.9fr_1.1fr]' : 'md:grid-cols-[1.1fr_0.9fr]'), className), children: [_jsxs("div", { className: cn('flex flex-col items-start px-8 pb-[46px] pt-[50px] md:px-12', reverse && visual && 'md:col-start-2 md:row-start-1'), children: [eyebrow ? (
                    // The same two overrides `FaqBand` writes for the same reason: the
                    // chip's default border and ink are invariant chrome, wrong on cream.
                    _jsx(Eyebrow, { className: "mb-5 border-chrome-line-on-light text-text-muted", children: eyebrow })) : null, _jsx("h2", { 
                        // SIZE FIRST. `cn` is twMerge and it puts font-size and line-height in
                        // one conflict group, so a `text-*` utility appearing AFTER
                        // `leading-[1.08]` deletes it. Verified against tailwind-merge
                        // directly: both branches below dropped the leading when they came
                        // second. Same defect as `FeatureRow`'s title, same fix.
                        className: cn(titleScale === 'section'
                            ? 'text-[length:var(--font-size-marketing-xl)]'
                            : 'text-[clamp(2rem,3.2vw,3.25rem)]', 'max-w-[520px] leading-[1.08] tracking-[-0.02em] text-text-primary'), children: title }), lede ? (_jsx("p", { className: "mt-4 max-w-[470px] text-[15px] italic text-text-muted", children: lede })) : null, hasProof ? (_jsxs("div", { className: "mt-7 w-full border-t pt-7", style: { borderTopColor: 'var(--color-chrome-line-on-light)' }, children: [children ? (
                            // Full width, not the prose measure: a CheckList's rules run the
                            // width of the column, and constraining them leaves each rule
                            // stopping short of the line it separates.
                            _jsx("div", { className: "w-full text-[15px] leading-relaxed text-text-muted-strong", children: children })) : null, actions ? (_jsx("div", { className: cn('flex flex-wrap items-center gap-3', children && 'mt-7'), children: actions })) : null] })) : null] }), visual ? (_jsx("div", { className: cn('relative grid min-w-0 place-items-center', reverse && 'md:col-start-1 md:row-start-1'), children: visual })) : null] }));
}
