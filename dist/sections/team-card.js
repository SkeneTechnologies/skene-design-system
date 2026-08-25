import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
export function TeamCard({ name, role, media, as: Heading = 'h3', children, className }) {
    return (
    // An `<li>`, not an `<article>` — see the file header. Its parent in
    // `TeamGrid` is the `<ul>`.
    _jsxs("li", { className: cn('flex flex-col rounded-[var(--radius-lg)] border border-border bg-card p-6', className), children: [media ? (
            // aspect-square, not a fixed height: the card's width is the grid's
            // to decide, and a frame that scales with it keeps every portrait in
            // a stack the same shape. The sizing rules on the child mean any
            // media the caller passes fills the frame without call-site styling.
            _jsx("div", { className: "mb-5 aspect-square overflow-hidden rounded-[var(--radius-md)] bg-muted [&>*]:h-full [&>*]:w-full [&>img]:object-cover", children: media })) : null, _jsx(Heading, { className: "text-[17px] font-medium leading-snug tracking-[-0.01em] text-text-primary", children: name }), _jsx("span", { className: "mt-1 font-mono text-[11px] uppercase tracking-[0.07em] text-text-muted-strong", children: role }), children ? (_jsx("div", { className: "mt-3.5 text-[13.5px] leading-relaxed text-text-muted [&_a:hover]:text-text-primary [&_a]:underline [&_a]:underline-offset-4", children: children })) : null] }));
}
export function TeamGrid({ children, className }) {
    // A `<ul>` for the reason `TrustPanel` gives: the element itself, not a
    // wrapper inside it, so the list is not broken by `display: contents`.
    return (_jsx("ul", { className: cn('grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3', className), children: children }));
}
