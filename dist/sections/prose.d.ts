import * as React from 'react';
/**
 * Long-form body copy: the container that styles the HTML inside it.
 *
 * The one module here that styles DESCENDANTS rather than rendering its own
 * markup, because its input is a document it did not author — MDX, a CMS body,
 * an array of sections rendered as plain tags. Every other section in this
 * package takes content as props; this one cannot, and pretending otherwise is
 * why consumers keep writing their own.
 *
 * ## Why this belongs here at all
 *
 * `skene-marketing-website` had TWO prose treatments for the same elements, in
 * two vocabularies that could not be compared without reading both:
 * `mdx-components.tsx` in Tailwind classes for docs and the blog, and
 * `core/ContentArea` in CSS custom properties for the glossary and series
 * pages. Nothing connected them and they disagreed. Typography is the most
 * shared thing a design system owns, and the type scale was already here; what
 * was missing was the object that applies it to a document.
 *
 * ## The scale is this package's, and the reconciliation is recorded
 *
 * The two local treatments agreed on three of four levels once mapped onto the
 * tokens: h1 at 30px (`--font-size-h1`), h3 at 18px, body at 14px. They
 * disagreed on h2, 24px against 20px, and the token settles it at 24
 * (`--font-size-h2`). A consumer adopting this moves that one level.
 *
 * ## No panel
 *
 * No border, no radius, no padding, no ground. The consumer this came from
 * welded its prose rules to a bordered card with a sidebar-docking variant, and
 * that is layout: where the column sits and what frames it are page decisions,
 * and the two pages using it framed it differently. This styles the words.
 */
export interface ProseProps extends React.ComponentProps<'div'> {
    /** Tightens the vertical rhythm for a dense column, e.g. a sidebar note. */
    density?: 'comfortable' | 'compact';
}
export declare function Prose({ density, className, children, ...props }: ProseProps): React.JSX.Element;
export default Prose;
//# sourceMappingURL=prose.d.ts.map