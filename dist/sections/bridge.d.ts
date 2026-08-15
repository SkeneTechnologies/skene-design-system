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
    /** Section heading. `<Accent>` composes here — peach inverts correctly. */
    title: React.ReactNode;
    /** One centred paragraph under the heading. */
    lede?: React.ReactNode;
    /** The line under the cards. */
    caption?: React.ReactNode;
    /** `BridgeNode`s, in order. Arrows are inserted between them. */
    children: React.ReactNode;
    className?: string;
}
export declare function Bridge({ eyebrow, title, lede, caption, children, className }: BridgeProps): import("react").JSX.Element;
//# sourceMappingURL=bridge.d.ts.map