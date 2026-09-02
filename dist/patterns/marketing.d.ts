/**
 * The page furniture that makes a marketing surface read as Skene: the floating
 * pill nav, the eyebrow chip, the numbered step, the display heading.
 *
 * Each of these is on the live site and was previously reproducible only by
 * copying markup out of skene-marketing-website.
 */
export { PillNav, PillNavLink, type PillNavProps, type PillNavLinkProps } from './pill-nav.js';
export interface EyebrowProps {
    /**
     * The chip is on a cream panel rather than the dark page.
     *
     * Its default border and ink are INVARIANT chrome tokens, which is right on
     * the dark ground and wrong on cream — they do not follow a `light`
     * ancestor, so the chip keeps its dark-page colours inside a cream card.
     * Three modules in this package already worked around that by writing the
     * same two-utility override at the call site
     * (`light-section-card.tsx`, `faq-band.tsx`, `bridge.tsx`), and
     * skene-marketing-website writes it at fourteen more. Fourteen call sites of
     * one recipe is what a prop is for.
     */
    onLight?: boolean;
    /**
     * `accent` draws the chip in brand peach, border and ink both, instead of the
     * muted chrome default.
     *
     * Ported from `skene-marketing-website`'s `SectionBadge`, which is being
     * retired: 74 call sites across its `(landing)` tree drew this chip in peach,
     * at the same 11px, and it was the only eyebrow that tree had. Migrating them
     * onto the muted default would have turned every section kicker on roughly a
     * hundred routes grey in the name of adopting the design system, which is a
     * visual change wearing a refactor's clothes. The tone is the visual, so the
     * tone becomes a prop.
     *
     * Full-opacity border, matching what it replaces. That component drew
     * `outline outline-1 outline-peach` against `#fec089`, which is this
     * package's `brand.peach` under another name.
     *
     * Wins over `onLight` when both are set. An accent chip is legible on either
     * ground, so there is nothing for `onLight` to correct.
     */
    tone?: 'muted' | 'accent';
    className?: string;
    children: React.ReactNode;
}
/**
 * The bordered chip above a page heading ("HOW IT WORKS").
 *
 * Uses `font.tracking.eyebrow` (0.16em) and `font.size.pill`, which existed as
 * tokens with nothing rendering them.
 */
export declare function Eyebrow({ onLight, tone, className, children, }: EyebrowProps): import("react").JSX.Element;
export interface DisplayHeadingProps {
    /** `hero` is the homepage size, `page` a subpage h1, `section` a section head. */
    size?: 'hero' | 'page' | 'section';
    as?: 'h1' | 'h2' | 'h3';
    className?: string;
    children: React.ReactNode;
}
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
export declare function DisplayHeading({ size, as: Tag, className, children, }: DisplayHeadingProps): import("react").JSX.Element;
/** Peach emphasis inside a display heading. Flat colour, as the live site uses. */
export declare function Accent({ className, children }: {
    className?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
export interface NumberedStepProps {
    /** Rendered as given, so "01" keeps its leading zero. */
    n: string;
    title: React.ReactNode;
    /**
     * Set this on a cream ground — inside `LightSectionCard`, or any surface
     * carrying the `light` class. The default uses `chrome.text.*`, which is
     * invariant dark-mode type: correct on a dark band, and INVISIBLE on cream,
     * because `chrome.text.primary` and `LightSectionCard`'s fill are the same
     * `#faf1e9`. Same spelling and same default as `CheckList`'s.
     */
    onLight?: boolean;
    /**
     * Weight of the body copy under the heading. `muted` is the default and is
     * right on a flat band.
     *
     * Use `primary` when the step sits ON MEDIA. Measured against the palest
     * pixel of a dithered field: the muted role needs a 0.88 black scrim to clear
     * 4.5:1, which is a wash opaque enough that the image it covers stops being
     * an image. The primary role clears at 0.50 and sits at 5.72:1 under 0.58,
     * where the field still reads. So a step over a photograph is not a scrim
     * problem, it is a role problem, and no amount of darkening fixes the wrong
     * role.
     */
    bodyTone?: 'muted' | 'primary';
    /**
     * The title's heading level. `h3` is the default and what
     * `/product/how-it-works` renders below its band heading: a stack of steps
     * sitting under the section's own `<h2>`.
     *
     * A band whose steps ARE the section has no `<h2>` above them, so an `h3`
     * there skips a level straight from the page `<h1>` — invisible on screen,
     * plainly wrong to anything reading the outline, and measured by skene-site
     * as the only heading-level skip across its 24 routes.
     *
     * Spelled and defaulted like `FeatureRow`'s, because three components
     * answering the same question should not answer it three ways. Not derived
     * from any other prop: a rule that guesses is a rule nobody can override when
     * it guesses wrong.
     */
    titleAs?: 'h2' | 'h3';
    className?: string;
    children?: React.ReactNode;
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
export declare function NumberedStep({ n, title, onLight, bodyTone, titleAs, className, children, }: NumberedStepProps): import("react").JSX.Element;
export interface SplitAuthLayoutProps {
    /** The form column. Dark, narrow, centred. */
    form: React.ReactNode;
    /** The showcase column. Textured, light, product imagery. */
    showcase: React.ReactNode;
    /** Small reassurance row under the form ("Secure sign in", "Magic link auth"). */
    meta?: React.ReactNode;
    className?: string;
}
/**
 * The auth split: dark form on the left, textured showcase on the right.
 *
 * Worth having here specifically because /login and /signup are served by a
 * *third* repo at the same origin (see DECISIONS.md D3 in the marketing site),
 * so this layout currently exists somewhere neither app can see. Collapses to a
 * single column below `lg`, where the showcase is dropped rather than stacked.
 */
export declare function SplitAuthLayout({ form, showcase, meta, className }: SplitAuthLayoutProps): import("react").JSX.Element;
//# sourceMappingURL=marketing.d.ts.map