'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Eyebrow } from '../patterns/marketing.js';
import { cn } from '../lib/utils.js';
export function FaqBand({ eyebrow, title, note, actions, children, multiple, className }) {
    const rows = (_jsx("div", { className: "border-b border-chrome-line-on-light", children: children }));
    return (_jsxs("section", { className: cn(
        // `light` first, never conditional — see the file header.
        'light grid gap-10 rounded-3xl bg-brand-light px-8 py-14 md:grid-cols-[0.85fr_1.15fr] md:px-12', className), children: [_jsxs("div", { children: [eyebrow ? (
                    // Was a hand-rolled copy that had DRIFTED: text-[10px] where
                    // --font-size-pill is 11px, and px-2.5 where every other copy uses
                    // px-2. Nothing could have caught it — three copies of one span, and
                    // the token was only ever a default. This is the same override Bridge
                    // uses, and it moves this chip by 1px of type and 1.6px of padding.
                    _jsx(Eyebrow, { className: "border-chrome-line-on-light text-text-muted", children: eyebrow })) : null, _jsx("h2", { className: cn('max-w-[420px] text-[clamp(1.9rem,2.8vw,2.75rem)] leading-[1.1] tracking-[-0.02em] text-text-primary', eyebrow && 'mt-5'), children: title }), note ? _jsx("p", { className: "mt-4 max-w-[380px] text-[14px] text-text-muted", children: note }) : null, actions ? (_jsx("div", { className: "mt-6 flex flex-wrap items-center gap-3", children: actions })) : null] }), multiple ? (_jsx(AccordionPrimitive.Root, { type: "multiple", children: rows })) : (_jsx(AccordionPrimitive.Root, { type: "single", collapsible: true, children: rows }))] }));
}
export function FaqRow({ question, children, className }) {
    // Radix needs a stable value per item and the caller has no reason to invent
    // one. useId is stable across server and client render, which a counter or a
    // slug of the question text would not be.
    const value = useId();
    return (_jsxs(AccordionPrimitive.Item, { value: value, className: cn('border-t border-chrome-line-on-light', className), children: [_jsx(AccordionPrimitive.Header, { className: "flex", children: _jsxs(AccordionPrimitive.Trigger, { className: "group flex flex-1 items-center justify-between gap-6 py-5 text-left text-[16px] font-medium text-text-primary outline-none focus-visible:underline", children: [question, _jsx("span", { "aria-hidden": true, className: "grid h-7 w-7 shrink-0 place-items-center rounded-full border border-chrome-line-on-light text-[13px] leading-none text-text-muted transition-transform duration-200 group-data-[state=open]:rotate-45", children: "+" })] }) }), _jsx(AccordionPrimitive.Content, { forceMount: true, className: "overflow-hidden data-[state=closed]:hidden", children: _jsx("div", { className: "max-w-[640px] pb-6 pr-12 text-[14px] leading-relaxed text-text-muted", children: children }) })] }));
}
