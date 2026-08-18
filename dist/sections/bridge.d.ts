export interface BridgeNodeProps {
    /** Whose column this is — "GTM", "SKENE", "ENGINEERING". */
    label?: React.ReactNode;
    /**
     * The card's one line. On the outer cards this is the question that team is
     * actually asking, and it sets italic; on the `featured` card it is the answer
     * and sets upright. Punctuation and quote marks are content, so they come from
     * the caller — the component never adds them.
     */
    title?: React.ReactNode;
    /** Short lines under the rule. Fragments, not sentences — three is the shape. */
    items?: string[];
    /** Glyph above the label. On the live section only the middle card carries one. */
    icon?: React.ReactNode;
    /** The dark, raised middle card. See the file header: this is the argument. */
    featured?: boolean;
    className?: string;
}
export declare function BridgeNode({ label, title, items, icon, featured, className, }: BridgeNodeProps): import("react").JSX.Element;
export interface BridgeProps {
    /** The kicker above the heading, e.g. "THE PRODUCT". */
    eyebrow?: React.ReactNode;
    /**
     * Section heading. `<Accent>` composes here — peach inverts correctly.
     *
     * OPTIONAL, and that is the whole of ask q. It used to be required and it
     * used to render an `<h2>` unconditionally, which is right for the band this
     * was written as: a section of its own, under the page `<h1>`.
     *
     * It is wrong wherever the band is an ARTIFACT rather than a section.
     * skene-site put one inside a `FeatureRow` on `/developers`, where the row
     * already carries the section `<h2>`. Passing that row's heading printed the
     * same sentence twice — once as the section head, once inside its own visual
     * — and gave one `<section>` two `<h2>`s. The consumer worked around it by
     * inventing a second sentence for the artifact, which is fine there and is
     * not a general answer: an artifact with no title of its own has nothing to
     * pass.
     *
     * Omit it and nothing heading-shaped renders. The head block goes with it
     * when `eyebrow` and `lede` are absent too, so the cards do not end up under
     * an empty centred div and the gap it still owns.
     */
    title?: React.ReactNode;
    /**
     * The title's heading level. Spelled and defaulted like `FeatureRow.titleAs`,
     * so every caller that has a title keeps rendering the `<h2>` it renders
     * today. Set `h3` where the band is nested under a heading it does not own
     * but still needs a name of its own.
     *
     * Ignored when `title` is omitted, because there is then nothing to level.
     */
    titleAs?: 'h2' | 'h3';
    /** One centred paragraph under the heading. */
    lede?: React.ReactNode;
    /** The line under the cards. */
    caption?: React.ReactNode;
    /** `BridgeNode`s, in order. Arrows are inserted between them. */
    children: React.ReactNode;
    className?: string;
}
export declare function Bridge({ eyebrow, title, titleAs, lede, caption, children, className, }: BridgeProps): import("react").JSX.Element;
//# sourceMappingURL=bridge.d.ts.map