'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import { cn } from '../lib/utils.js';
import { Chip } from './chip.js';
export function AskWidget({ avatar, name, question, lede, placeholder, submitLabel, value, onValueChange, onSubmit, showAiBadge = true, aiBadgeLabel = 'AI', className, }) {
    // The question IS the field's label, so it is wired up as one rather than
    // duplicated into an aria-label — `question` is a ReactNode and may not
    // flatten to a usable string.
    const questionId = useId();
    return (_jsxs("div", { className: cn('w-full rounded-3xl border border-chrome-line-subtle bg-chrome-surface-1 p-7', className), children: [_jsxs("div", { className: "flex min-h-[32px] items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [avatar ? (_jsx("span", { className: "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-chrome-surface-2 text-[12px] text-chrome-text-primary", children: avatar })) : null, name ? (_jsx("span", { className: "text-[13px] font-medium text-chrome-text-primary", children: name })) : null] }), showAiBadge ? (_jsx(Chip, { tone: "outline", children: aiBadgeLabel })) : null] }), _jsx("h3", { id: questionId, className: "mt-6 text-[clamp(1.6rem,2.6vw,2.35rem)] font-normal leading-[1.12] tracking-[-0.04em] text-chrome-text-primary", children: question }), lede ? (_jsx("p", { className: "mt-3 max-w-[52ch] text-[14px] leading-[1.55] text-chrome-text-muted-warm", children: lede })) : null, _jsxs("form", { className: "mt-6", onSubmit: (event) => {
                    // Nothing here belongs in a URL and there is no server route to post
                    // to — the value goes straight to the consumer's handler.
                    event.preventDefault();
                    onSubmit?.(value);
                }, children: [_jsx("textarea", { "aria-labelledby": questionId, value: value, placeholder: placeholder, onChange: (event) => onValueChange(event.target.value), 
                        // resize-none, not for tidiness: a draggable corner on a box this
                        // quiet is the most prominent affordance in the block, and it competes
                        // with the submit.
                        className: "min-h-[104px] w-full resize-none rounded-2xl bg-chrome-surface-2 px-4 py-3.5 text-[14px] leading-[1.5] text-chrome-text-primary outline-none placeholder:text-chrome-text-muted focus-visible:ring-1 focus-visible:ring-chrome-line-strong" }), _jsx("div", { className: "mt-3.5 flex justify-end", children: _jsx("button", { type: "submit", 
                            // Hover dims the whole pair rather than swapping the fill for
                            // `primary-hover`: that token is a fixed cream, and against
                            // `brand.peach-text`'s LIGHT value (also cream) the label would
                            // disappear on hover in a light-mode page.
                            className: "rounded-full bg-brand-peach px-5 py-2.5 text-[13px] font-medium text-brand-peach-text transition-opacity duration-300 ease-in-out hover:opacity-90", children: submitLabel }) })] })] }));
}
