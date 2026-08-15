import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { SectionBackdrop } from './section-backdrop.js';
const ACCENT_VAR = {
    peach: 'var(--color-brand-peach)',
    violet: 'var(--color-accent-violet)',
    blue: 'var(--color-accent-blue)',
};
/**
 * The ringed icon. The inset shadow is a soft fill rather than a border so the
 * ring reads as lit from inside — a plain background makes it a button.
 */
export function FeatureIcon({ accent = 'peach', className, children }) {
    const c = ACCENT_VAR[accent];
    return (_jsx("span", { className: cn('grid size-11 place-items-center rounded-full border', className), style: {
            borderColor: `color-mix(in oklab, ${c} 47%, transparent)`,
            color: c,
            boxShadow: `inset 0 0 0 7px color-mix(in oklab, ${c} 6%, transparent)`,
        }, children: children }));
}
/**
 * The breakpoint at which the band splits into two columns.
 *
 * `md` was hardcoded, and it is wrong for a band whose visual is a table that
 * scrolls: skene-site's drift table needs 480px and had 291px of scroller at
 * 900 and 216px at 768. They overrode it and hit the trap this table exists to
 * remove — only a later NAMED breakpoint outranks a `md:` utility. Both
 * arbitrary forms sort EARLIER in the emitted stylesheet, so `min-[1200px]`
 * lost above 1200 and `max-[1199px]` lost below it, each attempt leaving the
 * measurement byte-identical at 422px. That reads as "the override did nothing"
 * rather than "the override was outranked", and it cost them a debugging round
 * before they settled for `xl` when the band wanted 1200.
 *
 * Whole class strings, not interpolation: Tailwind scans source text, so
 * `${bp}:grid-cols-…` generates nothing at all.
 */
const SPLIT = {
    md: {
        grid: 'md:grid-cols-[0.9fr_1.1fr]',
        gridReverse: 'md:grid-cols-[1.1fr_0.9fr]',
        copyReverse: 'md:col-start-2 md:row-start-1',
        visualReverse: 'md:col-start-1 md:row-start-1',
    },
    lg: {
        grid: 'lg:grid-cols-[0.9fr_1.1fr]',
        gridReverse: 'lg:grid-cols-[1.1fr_0.9fr]',
        copyReverse: 'lg:col-start-2 lg:row-start-1',
        visualReverse: 'lg:col-start-1 lg:row-start-1',
    },
    xl: {
        grid: 'xl:grid-cols-[0.9fr_1.1fr]',
        gridReverse: 'xl:grid-cols-[1.1fr_0.9fr]',
        copyReverse: 'xl:col-start-2 xl:row-start-1',
        visualReverse: 'xl:col-start-1 xl:row-start-1',
    },
};
export function FeatureRow({ reverse = false, n, icon, title, lede, children, actions, visual, texture, textureSrc, sheen = true, splitAt = 'md', className, }) {
    return (_jsxs("div", { className: cn('grid min-h-[600px] overflow-hidden rounded-2xl border border-chrome-line-subtle bg-chrome-surface-1', reverse ? SPLIT[splitAt].gridReverse : SPLIT[splitAt].grid, className), children: [_jsxs("div", { className: cn('relative flex flex-col items-start px-12 pb-[46px] pt-[50px]', reverse && SPLIT[splitAt].copyReverse), children: [n ? (_jsx("span", { className: "absolute right-6 top-[22px] font-mono text-[11px] text-chrome-text-muted-warm", children: n })) : null, icon ? _jsx("div", { className: "mb-[54px]", children: icon }) : null, _jsx("h3", { className: "mb-4 max-w-[420px] text-[clamp(1.75rem,2.4vw,2.55rem)] leading-tight text-chrome-text-primary", children: title }), lede ? (_jsx("p", { className: "mb-6 max-w-[470px] text-[14px] italic text-chrome-text-muted-warm", children: lede })) : null, children ? (
                    // Full-width, not max-w: a CheckList's rules run the width of the
                    // column on the live cards, and constraining them to the prose measure
                    // leaves the rules stopping short of the text they separate.
                    _jsx("div", { className: "mb-[26px] w-full text-chrome-text-muted-warm", children: children })) : null, actions ? _jsx("div", { className: "mt-auto", children: actions }) : null] }), _jsxs("div", { className: cn('relative grid min-w-0 place-items-center', reverse && SPLIT[splitAt].visualReverse), children: [texture || textureSrc ? (
                    // The field fills the cell and the mock floats on it — SectionBackdrop
                    // owns the inset, because it has to be a percentage of the track and
                    // this component does not know how wide that is.
                    _jsx(SectionBackdrop, { texture: texture, src: textureSrc, className: "h-full w-full", children: visual })) : (_jsx("div", { className: "grid w-full place-items-center p-[34px]", children: visual })), sheen ? (_jsx("span", { "aria-hidden": true, className: "pointer-events-none absolute inset-0", style: {
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.10), transparent 60%)',
                        } })) : null] })] }));
}
/** Vertical stack of rows at the section's rhythm. */
export function FeatureStack({ className, children, }) {
    return _jsx("div", { className: cn('grid gap-6', className), children: children });
}
