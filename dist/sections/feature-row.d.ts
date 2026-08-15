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
};
export type FeatureRowSplit = keyof typeof SPLIT;
export interface FeatureRowProps {
    /** Mirrors the layout. Set it explicitly per row; don't derive it from index. */
    reverse?: boolean;
    /** Monospace marker in the corner, e.g. "01". */
    n?: React.ReactNode;
    icon?: React.ReactNode;
    title: React.ReactNode;
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
    className?: string;
}
export declare function FeatureRow({ reverse, n, icon, title, lede, children, actions, visual, texture, textureSrc, sheen, splitAt, className, }: FeatureRowProps): import("react").JSX.Element;
/** Vertical stack of rows at the section's rhythm. */
export declare function FeatureStack({ className, children, }: {
    className?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=feature-row.d.ts.map