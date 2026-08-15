import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Children } from 'react';
import { cn } from '../lib/utils.js';
/**
 * The `lg` track list, keyed by how many link columns were passed.
 *
 * Whole class strings, never interpolated: Tailwind scans this file's source
 * text, so building the track list with a template literal would emit a class
 * name that no stylesheet contains, and — as always with a class that generates
 * nothing — would not warn. The footer would fall back to one column and look
 * like a different bug. `footer-columns.test.tsx` greps this file for the five
 * literals rather than trusting the rendered string, for exactly that reason.
 *
 * The brand keeps 1.7fr at every count. At four columns on the 1280px shell
 * that leaves it ~310px, which still holds the logo, its line of copy and the
 * social row; below that the `md` two-column layout has already taken over.
 */
const COLUMNS = {
    1: 'lg:grid-cols-[1.7fr_repeat(1,1fr)]',
    2: 'lg:grid-cols-[1.7fr_repeat(2,1fr)]',
    3: 'lg:grid-cols-[1.7fr_repeat(3,1fr)]',
    4: 'lg:grid-cols-[1.7fr_repeat(4,1fr)]',
    5: 'lg:grid-cols-[1.7fr_repeat(5,1fr)]',
};
/** Past five, the columns are narrower than their own link text. */
const MAX_COLUMNS = 5;
export function SiteFooter({ brand, wordmark, copyright, legal, className, children, }) {
    // `Children.toArray` and not `Children.count`: count includes `null`, so a
    // consumer rendering `{flag ? <FooterColumn/> : null}` would reserve a track
    // for a column that is not there. toArray drops null, undefined and booleans.
    const linkColumns = Math.min(Children.toArray(children).length, MAX_COLUMNS);
    return (_jsxs("footer", { className: cn('relative overflow-hidden border-t border-chrome-line-subtle bg-chrome-surface-deep-2 px-6 pb-8 pt-[68px] md:pt-[90px]', className), children: [_jsxs("div", { className: "relative z-10 mx-auto max-w-[1280px]", children: [_jsxs("div", { className: cn('grid gap-8 md:grid-cols-2 lg:gap-[60px]', COLUMNS[linkColumns]), children: [brand ? _jsx("div", { className: "col-span-full lg:col-span-1", children: brand }) : null, children] }), (copyright || legal) && (_jsxs("div", { className: "mt-[54px] flex flex-col justify-between gap-2 border-t border-chrome-line-subtle pt-[22px] text-[12px] text-chrome-text-muted-warm sm:flex-row md:mt-[82px]", children: [_jsx("span", { children: copyright }), _jsx("span", { children: legal })] }))] }), wordmark ? (_jsx("span", { "aria-hidden": true, className: "pointer-events-none absolute bottom-[-6vw] left-1/2 z-0 -translate-x-1/2 text-[29vw] font-semibold leading-[0.76] tracking-[-0.09em]", style: { color: 'rgba(255, 255, 255, 0.017)' }, children: wordmark })) : null] }));
}
export function FooterColumn({ title, className, children }) {
    return (_jsxs("nav", { className: cn('grid content-start gap-2.5', className), "aria-label": String(title), children: [_jsx("h2", { className: "mb-3 text-[12px] font-semibold text-chrome-text-primary", children: title }), children] }));
}
export function FooterLink({ href, className, children, }) {
    return (_jsx("a", { href: href, className: cn('text-[14px] text-chrome-text-muted-warm transition-colors hover:text-brand-peach', className), children: children }));
}
/** Circular icon links. Pass an svg or an icon component per child. */
export function SocialLinks({ className, children, }) {
    return _jsx("div", { className: cn('mt-6 flex gap-2.5', className), children: children });
}
export function SocialLink({ href, label, className, children, }) {
    return (_jsx("a", { href: href, "aria-label": label, className: cn('grid size-9 place-items-center rounded-full border border-chrome-line-strong text-chrome-text-muted-warm-strong transition-colors hover:text-brand-peach', className), children: children }));
}
