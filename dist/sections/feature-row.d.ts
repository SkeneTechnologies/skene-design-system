import { type BackdropTexture } from './section-backdrop.js';
/**
 * The alternating feature row: copy on one side, a visual on the other, flipping
 * every other row.
 *
 * The flip is `reverse` rather than an index, because a stack that computes it
 * from position breaks the moment a row is inserted or reordered — and these
 * rows are content, so they get reordered.
 *
 * `accent.violet` and `accent.blue` exist for the icon here. Three rows need
 * telling apart at a glance and the package had nothing close: the nearest
 * `neon.*` category colour is ΔE 24+, far too saturated against a 16px stroke.
 */
export type FeatureAccent = 'peach' | 'violet' | 'blue';
export interface FeatureIconProps {
    accent?: FeatureAccent;
    className?: string;
    children: React.ReactNode;
}
/**
 * The ringed icon. The inset shadow is a soft fill rather than a border so the
 * ring reads as lit from inside — a plain background makes it a button.
 */
export declare function FeatureIcon({ accent, className, children }: FeatureIconProps): import("react").JSX.Element;
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
declare const SPLIT: {
    readonly md: {
        readonly grid: "md:grid-cols-[0.9fr_1.1fr]";
        readonly gridReverse: "md:grid-cols-[1.1fr_0.9fr]";
        readonly copyReverse: "md:col-start-2 md:row-start-1";
        readonly visualReverse: "md:col-start-1 md:row-start-1";
    };
    readonly lg: {
        readonly grid: "lg:grid-cols-[0.9fr_1.1fr]";
        readonly gridReverse: "lg:grid-cols-[1.1fr_0.9fr]";
        readonly copyReverse: "lg:col-start-2 lg:row-start-1";
        readonly visualReverse: "lg:col-start-1 lg:row-start-1";
    };
    readonly xl: {
        readonly grid: "xl:grid-cols-[0.9fr_1.1fr]";
        readonly gridReverse: "xl:grid-cols-[1.1fr_0.9fr]";
        readonly copyReverse: "xl:col-start-2 xl:row-start-1";
        readonly visualReverse: "xl:col-start-1 xl:row-start-1";
    };
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
    readonly never: {
        readonly grid: "";
        readonly gridReverse: "";
        readonly copyReverse: "";
        readonly visualReverse: "";
    };
};
export type FeatureRowSplit = keyof typeof SPLIT;
export interface FeatureRowProps {
    /** Mirrors the layout. Set it explicitly per row; don't derive it from index. */
    reverse?: boolean;
    /** Monospace marker in the corner, e.g. "01". */
    n?: React.ReactNode;
    /**
     * A label above the title, inside the copy column. Pass an `<Eyebrow>`.
     *
     * The homepage stack does not need one — three rows share a single eyebrow
     * and heading above the whole stack. Every other adopter is a lone row
     * standing in for a whole section, where the eyebrow is that section's own
     * and belongs with the heading it labels. Putting it above the card instead
     * splits the head across the card's edge.
     *
     * A slot rather than a string so this component does not have to import
     * `Eyebrow`, and so a caller can pass a link or a chip in its place.
     */
    eyebrow?: React.ReactNode;
    icon?: React.ReactNode;
    /**
     * Optional, because a row is sometimes only its visual.
     *
     * It was required, and the second adopter has four sections carrying an
     * eyebrow and no heading and one carrying no text at all. Supplying a string
     * to satisfy the type would mean writing marketing copy to satisfy a
     * component, which is the tail wagging the dog and, in that repository,
     * against its own rules. With no title the heading element is not rendered at
     * all rather than rendered empty: an empty `h2` is a heading to every outline
     * reader and to nothing else.
     */
    title?: React.ReactNode;
    /**
     * The italic line under the title. On the live cards this is the promise
     * ("Connect once. Skene adds the tracking you're missing") and the checklist
     * below it is the proof — different jobs, so it is its own slot rather than
     * the first paragraph of `children`.
     *
     * Named `lede` to match `LightSectionCard`: the two components split the same
     * promise/proof pair, and one concept under two names is drift that gets
     * copied.
     */
    lede?: React.ReactNode;
    /** Body copy — usually a `<CheckList>`. */
    children?: React.ReactNode;
    /** Pinned to the bottom of the copy column, so rows of differing height align. */
    actions?: React.ReactNode;
    /** The right-hand panel — a ProductWindow, an image, anything. */
    visual?: React.ReactNode;
    /** Halftone field behind the visual. Omit for a plain panel. */
    texture?: BackdropTexture;
    /** Explicit texture URL, overriding `texture`. */
    textureSrc?: string;
    /**
     * The 10% white gloss over the visual panel. On by default, which is what
     * every current caller renders.
     *
     * Turn it OFF when the panel carries type on a tint. It is 10% white over
     * whatever you put there, and that is enough to take a label under the WCAG
     * floor: measured at 3.801:1 / 3.896 / 4.230 across three viewports with it
     * on, against 4.510 with it off. See the comment at the sheen itself.
     */
    sheen?: boolean;
    /**
     * Where the band splits into two columns. `md` (768) is the default and what
     * every current caller renders. Raise it when the visual is a table or any
     * panel that needs real width before the split is an improvement — below its
     * breakpoint the band is a single stacked column.
     *
     * A named breakpoint rather than a number, deliberately: an arbitrary variant
     * like `min-[1200px]` sorts EARLIER than `md:` in the emitted stylesheet and
     * silently loses to it. See the comment on the SPLIT table.
     */
    splitAt?: FeatureRowSplit;
    /**
     * The title's heading level. `h3` is the default and what the homepage
     * renders: three rows sitting under the band's own `<h2>`.
     *
     * A lone row IS the section, so its title is that section's `<h2>` under the
     * page `<h1>`, and leaving it an `h3` skips a level — invisible on screen,
     * plainly wrong to anything reading the outline. Not derived from whether
     * `eyebrow` is set, because the two answer different questions and a rule
     * that guesses is a rule nobody can override when it guesses wrong.
     */
    titleAs?: 'h2' | 'h3';
    /**
     * Which type scale the title takes.
     *
     * `row` is `clamp(1.75rem, 2.4vw, 2.55rem)` — fluid, 28px to 40.8px — and is
     * what the homepage renders: three rows under one band heading, where the row
     * title is the largest thing in its own card and wants to breathe with the
     * viewport.
     *
     * `section` is a flat 32px, `--font-size-marketing-xl`, which is what
     * `DisplayHeading size="section"` emits. Use it when the row IS a section, so
     * its title sits at the same size as every other section heading on the page.
     *
     * THE DEFECT THIS CLOSES IS NOT A CONSTANT OFFSET. The two scales cross at a
     * 1333px viewport: above it the card heading is larger than its siblings,
     * below it smaller, and at 1024 it is 28px against their 32. Ten of the
     * nineteen adopting routes render both on one page, and `/product/how-it-works`
     * renders only the card scale — internally consistent and inconsistent with
     * the other eighteen. Measuring at one width makes this look like 2.56px of
     * nothing; measuring across the breakpoint is what shows it inverting.
     *
     * Default `row`, so no existing caller moves.
     */
    titleScale?: 'row' | 'section';
    className?: string;
}
export declare function FeatureRow({ reverse, n, eyebrow, icon, title, lede, children, actions, visual, texture, textureSrc, sheen, splitAt, titleAs, titleScale, className, }: FeatureRowProps): import("react").JSX.Element;
/** Vertical stack of rows at the section's rhythm. */
export declare function FeatureStack({ className, children, }: {
    className?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=feature-row.d.ts.map