import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * Floating pill navigation.
 *
 * Sits over the hero rather than above it, so the media runs to the top of the
 * viewport. The translucent fill plus blur is what keeps the links legible over
 * arbitrary photography without a solid bar.
 */
export function PillNav({ brand, actions, className, children }) {
    return (_jsxs("div", { className: cn('absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 p-4', className), children: [_jsxs("nav", { className: "flex items-center gap-1 rounded-xl px-3 py-2 backdrop-blur-md", style: {
                    background: 'color-mix(in oklab, var(--color-chrome-surface-0) 55%, transparent)',
                    border: '1px solid color-mix(in oklab, var(--color-chrome-text-primary) 8%, transparent)',
                }, children: [brand ? _jsx("span", { className: "flex items-center gap-2 lg:mr-3", children: brand }) : null, _jsx("span", { className: "hidden items-center gap-1 lg:flex", children: children })] }), actions ? _jsx("div", { className: "flex items-center gap-2", children: actions }) : null] }));
}
export function PillNavLink({ href, children, className, }) {
    return (_jsx("a", { href: href, className: cn('rounded-lg px-3 py-1.5 text-[13px] text-chrome-text-primary/80 transition-colors', 'hover:bg-white/5 hover:text-chrome-text-primary', className), children: children }));
}
/**
 * The bordered chip above a page heading ("HOW IT WORKS").
 *
 * Uses `font.tracking.eyebrow` (0.16em) and `font.size.pill`, which existed as
 * tokens with nothing rendering them.
 */
export function Eyebrow({ className, children }) {
    return (_jsx("span", { className: cn('inline-block rounded-sm border px-2 py-1 font-mono uppercase', 'border-chrome-surface-border text-chrome-text-muted', className), style: {
            fontSize: 'var(--font-size-pill)',
            letterSpacing: 'var(--font-tracking-eyebrow)',
        }, children: children }));
}
const DISPLAY_SIZE = {
    hero: 'var(--font-size-marketing-hero)',
    page: 'var(--font-size-marketing-xxl)',
    section: 'var(--font-size-marketing-xl)',
};
/**
 * Marketing display type.
 *
 * The package's other scale is the dashboard's, which is UI-density-first and
 * stops at 52px; the live homepage h1 measures 67px. These sizes step down at
 * narrow widths via the media queries in styles/effects.css.
 *
 * Weight is 400 deliberately. Skene's display type is large and light, not
 * bold, which is most of why it reads the way it does.
 */
export function DisplayHeading({ size = 'page', as: Tag = 'h1', className, children, }) {
    return (_jsx(Tag, { className: cn('font-normal text-chrome-text-primary', className), style: { fontSize: DISPLAY_SIZE[size], lineHeight: 'var(--font-line-height-tight)' }, children: children }));
}
/** Peach emphasis inside a display heading. Flat colour, as the live site uses. */
export function Accent({ className, children }) {
    return _jsx("span", { className: cn('text-brand-peach', className), children: children });
}
/**
 * A numbered step: peach mono numeral beside a heading, body copy beneath.
 *
 * The backbone of /product/how-it-works and the pattern most likely to be
 * hand-rolled differently on each new page.
 */
/**
 * `onLight`, and why a documented workaround was not good enough.
 *
 * `chrome.text.primary` is `#faf1e9` — invariant by design, because chrome is
 * always dark. Put a `NumberedStep` inside `LightSectionCard`, whose fill is
 * also `#faf1e9`, and the heading is not dim: it is ABSENT. Nothing catches it.
 * The contrast gate scores token pairs, not compositions; the visual suite had
 * no case for that pairing; typecheck and lint cannot see a colour.
 *
 * 0.9.x documented the escape — `[&_h3]:text-text-primary [&>div]:text-text-muted`
 * — and shipped a gallery case using it. skene-site pushed back and was right:
 * a caller has to already know these roles are invariant in order to know the
 * override is needed, and the failure mode is invisible type rather than an
 * error. Documentation only helps the reader who already suspects the problem.
 *
 * So it is a prop, matching `CheckList`'s spelling exactly, because two
 * components asking the same question should not ask it two ways. Defaults to
 * `false`, which is the dark-band behaviour every current caller renders, so
 * nothing rebaselines.
 */
export function NumberedStep({ n, title, onLight = false, bodyTone = 'muted', className, children, }) {
    return (_jsxs("div", { className: cn('grid grid-cols-[auto_1fr] gap-x-4 gap-y-2', className), children: [_jsx("span", { "aria-hidden": "true", className: "font-mono text-brand-peach", style: { fontSize: 'var(--font-size-card-title)' }, children: n }), _jsx("h3", { className: onLight ? 'text-text-primary' : 'text-chrome-text-primary', style: { fontSize: 'var(--font-size-marketing-xl)' }, children: title }), children ? (_jsx("div", { className: cn('col-start-2 max-w-2xl text-[14px] leading-relaxed', onLight
                    ? bodyTone === 'primary'
                        ? 'text-text-primary'
                        : 'text-text-muted'
                    : bodyTone === 'primary'
                        ? 'text-chrome-text-primary'
                        : 'text-chrome-text-muted'), children: children })) : null] }));
}
/**
 * The auth split: dark form on the left, textured showcase on the right.
 *
 * Worth having here specifically because /login and /signup are served by a
 * *third* repo at the same origin (see DECISIONS.md D3 in the marketing site),
 * so this layout currently exists somewhere neither app can see. Collapses to a
 * single column below `lg`, where the showcase is dropped rather than stacked.
 */
export function SplitAuthLayout({ form, showcase, meta, className }) {
    return (_jsxs("div", { className: cn('grid min-h-screen gap-4 p-4 lg:grid-cols-2', className), children: [_jsxs("div", { className: "relative flex flex-col justify-center px-6", children: [_jsx("div", { className: "mx-auto w-full max-w-sm", children: form }), meta ? (_jsx("div", { className: "mx-auto mt-10 flex w-full max-w-sm flex-wrap gap-4 text-[11px] text-chrome-text-muted", children: meta })) : null] }), _jsx("div", { className: "relative hidden overflow-hidden rounded-xl lg:block", children: showcase })] }));
}
