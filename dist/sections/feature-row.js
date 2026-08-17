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
    /**
     * Never: one column at every width, copy above the visual, inside the same
     * card. `reverse` is inert here — there is no second track to move to.
     *
     * This is the shape for a visual too wide to live in a half track at any
     * viewport, which is a real category rather than an escape hatch. Measured on
     * the second adopter: a five-stage LifecycleCanvas wants 998px, a FlowDiagram
     * 812px, a four-column evaluator table about 1000px. The widest split this
     * component offers hands the visual roughly 640-700px, so those clip at every
     * breakpoint — and they clip silently, because the panels scroll horizontally
     * inside `overflow-hidden` chrome with an overlay scrollbar. Nothing
     * announces it; a column simply ends mid-word.
     *
     * Empty strings and not an omitted key, so `SPLIT[splitAt]` stays total and
     * the render path needs no branch.
     */
    never: {
        grid: '',
        gridReverse: '',
        copyReverse: '',
        visualReverse: '',
    },
};
export function FeatureRow({ reverse = false, n, eyebrow, icon, title, lede, children, actions, visual, texture, textureSrc, sheen = true, splitAt = 'md', titleAs = 'h3', titleScale = 'row', className, }) {
    const Title = titleAs;
    // Whole class strings, never interpolated — Tailwind scans source text.
    const TITLE_SIZE = titleScale === 'section'
        ? 'text-[length:var(--font-size-marketing-xl)]'
        : 'text-[clamp(1.75rem,2.4vw,2.55rem)]';
    /*
      A row with nothing to show. See
      `documentation/20260817_feature_row_copy_only.md`.
  
      Derived rather than a prop, because there is exactly one sensible rendering
      for a row with no visual and no texture, so there is no decision left for a
      caller to make. This is the opposite call from `PlanCard`'s `featured`,
      which bundles three independent decisions behind one boolean; this bundles
      none.
  
      Three things follow, and each is the absence of something that only earns
      its place when a panel exists: no second cell (not an empty one), no
      `min-h-[600px]`, and no split grid class. The floor is the one worth
      spelling out — it exists to stop a product panel being cropped by a short
      copy column, and with no panel it produces exactly the dead air it was
      added to prevent.
  
      `splitAt` and `reverse` go inert here rather than erroring, so a consumer
      migrating a mixed set of bands does not have to strip props per band.
  
      Every one of the 31 live cards in skene-site passes a `visual`, so this is
      false for all of them and none of their markup moves.
    */
    const copyOnly = !visual && !texture && !textureSrc;
    return (_jsxs("div", { className: cn('grid overflow-hidden rounded-2xl border border-chrome-line-subtle bg-chrome-surface-1', !copyOnly && 'min-h-[600px]', !copyOnly && (reverse ? SPLIT[splitAt].gridReverse : SPLIT[splitAt].grid), className), children: [_jsxs("div", { className: cn('relative flex flex-col items-start px-12 pb-[46px] pt-[50px]', reverse && SPLIT[splitAt].copyReverse), children: [n ? (_jsx("span", { className: "absolute right-6 top-[22px] font-mono text-[11px] text-chrome-text-muted-warm", children: n })) : null, icon ? _jsx("div", { className: "mb-[54px]", children: icon }) : null, eyebrow ? _jsx("div", { className: "mb-[24px]", children: eyebrow }) : null, title ? (_jsx(Title, { className: cn('mb-4 max-w-[420px] leading-tight text-chrome-text-primary', TITLE_SIZE), children: title })) : null, lede ? (_jsx("p", { className: "mb-6 max-w-[470px] text-[14px] italic text-chrome-text-muted-warm", children: lede })) : null, children ? (
                    // Full-width, not max-w: a CheckList's rules run the width of the
                    // column on the live cards, and constraining them to the prose measure
                    // leaves the rules stopping short of the text they separate.
                    _jsx("div", { className: "mb-[26px] w-full text-chrome-text-muted-warm", children: children })) : null, actions ? _jsx("div", { className: "mt-auto", children: actions }) : null] }), copyOnly ? null : (_jsxs("div", { className: cn('relative grid min-w-0 place-items-center', reverse && SPLIT[splitAt].visualReverse), children: [texture || textureSrc ? (
                    // The field fills the cell and the mock floats on it — SectionBackdrop
                    // owns the inset, because it has to be a percentage of the track and
                    // this component does not know how wide that is.
                    _jsx(SectionBackdrop, { texture: texture, src: textureSrc, className: "h-full w-full", children: visual })) : (
                    // 34px when the card is SPLIT, 16px when it is stacked.
                    //
                    // The inset exists to separate the visual from the copy column beside
                    // it. Under `splitAt="never"` there is no column beside it — the copy
                    // is above — so 34px a side is 68px spent on nothing, and it is spent
                    // on exactly the artifacts that chose `never` because they were too
                    // wide to sit beside anything.
                    //
                    // Measured on the widest one, a five-stage `LifecycleCanvas` at 1440:
                    // the card hands the artifact 1092px and the scrolling strip ends up
                    // with 946 against the 998 it needs. The 146px between them is this
                    // 68px plus `ArtFrame`'s 96 and `AppPanel`'s 48. Those two are the
                    // artifact's own material and its app chrome; this one is layout for
                    // an arrangement that is not in use. Reclaiming it is the only 36px
                    // available without touching what the artifact IS.
                    //
                    // Not zero: the visual still needs to read as sitting ON the card
                    // rather than as the card's own edge, and 16px is the smallest gap
                    // that survives the 24px radius without the corner clipping the frame.
                    _jsx("div", { className: cn('grid w-full place-items-center', splitAt === 'never' ? 'p-[16px]' : 'p-[34px]'), children: visual })), sheen ? (_jsx("span", { "aria-hidden": true, className: "pointer-events-none absolute inset-0", style: {
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.10), transparent 60%)',
                        } })) : null] }))] }));
}
/** Vertical stack of rows at the section's rhythm. */
export function FeatureStack({ className, children, }) {
    return _jsx("div", { className: cn('grid gap-6', className), children: children });
}
