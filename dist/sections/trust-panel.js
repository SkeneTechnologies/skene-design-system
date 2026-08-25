import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { GlyphBadge } from './glyph-badge.js';
export function TrustFact({ icon, title, children, tone = 'tint', className }) {
    return (
    // An `<li>`, not an `<article>`: a one-line fact plus its qualifier is not a
    // self-contained, independently distributable composition, and it has no
    // accessible name to be one with. The facts are a stack of peers, so list
    // semantics are the true ones — they are what gives a screen reader "3 of 5".
    // Its parent in `TrustPanel` is the `<ul>`.
    //
    // The rule belongs to the item, not to a divider element, so it can never
    // render with nothing under it; `last:` drops it on the final fact, which is
    // why the stack must not be padded by a parent `gap` as well.
    _jsxs("li", { className: cn('grid grid-cols-[40px_1fr] items-start gap-x-4 border-b py-[22px] first:pt-0 last:border-b-0 last:pb-0', 
        // The rule follows `tone` — the on-light hairline is invariant chrome
        // and vanishes on a dark ground. See the prop.
        tone === 'muted' ? 'border-border' : 'border-chrome-line-on-light', className), children: [_jsx(GlyphBadge, { tone: tone, className: "col-start-1 row-start-1", children: icon }), _jsx("span", { className: "col-start-2 row-start-1 self-center text-[15px] font-medium leading-snug text-text-primary", children: title }), children ? (_jsx("p", { className: "col-start-2 row-start-2 mt-1.5 text-[13.5px] leading-relaxed text-text-muted", children: children })) : null] }));
}
export function TrustPanel({ eyebrow, title, lede, links, children, className }) {
    return (_jsxs("section", { className: cn(
        // `light` first, and never conditional — see the file header.
        'light grid overflow-hidden rounded-[var(--radius-lg)] border border-chrome-line-on-light bg-brand-light', 
        // The template follows the markup: two tracks only when the second one
        // is rendered. See the file header.
        children && 'md:grid-cols-[0.9fr_1.1fr]', className), children: [_jsxs("div", { className: "relative p-8 md:p-[58px]", children: [_jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0", style: {
                            background: 'radial-gradient(circle at 0% 100%, color-mix(in oklab, var(--color-brand-peach) 20%, transparent) 0%, transparent 65%)',
                        } }), _jsxs("div", { className: "relative", children: [eyebrow ? _jsx("div", { className: "mb-5", children: eyebrow }) : null, _jsx("h2", { className: "max-w-[440px] text-[clamp(1.9rem,2.8vw,2.75rem)] font-normal leading-[1.1] tracking-[-0.02em] text-text-primary", children: title }), lede ? (_jsx("p", { className: "mt-4 max-w-[430px] text-[15px] leading-relaxed text-text-muted", children: lede })) : null, links ? (
                            // Styling only — the anchors and their labels come from the caller.
                            _jsx("div", { className: "mt-[30px] flex flex-wrap items-center gap-x-7 gap-y-3 text-[14px] text-text-muted-strong [&_a:hover]:text-text-primary [&_a]:underline [&_a]:underline-offset-4", children: links })) : null] })] }), children ? (
            // `<ul>`, because the facts are a stack of peers and each `TrustFact` is
            // an `<li>`. It is this element rather than a wrapper inside it so the
            // list is not broken by `display: contents`, which several browsers
            // still strip list semantics from.
            _jsx("ul", { className: "p-8 md:p-11", style: {
                    // A deeper cream, not a grey — see the file header. Derived from the
                    // cream token so it stays a shade of this surface rather than a
                    // second material pinned to a hex.
                    background: 'color-mix(in oklab, var(--color-brand-light) 84%, var(--color-brand-bronze))',
                }, children: children })) : null] }));
}
