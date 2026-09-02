import * as React from 'react';
/**
 * The hub grid: a set of cards, each of which is a whole link into a section of
 * the site.
 *
 * Extracted from `skene-marketing-website`, where it existed TWICE under two
 * names that had no idea about each other. `core/ResourceCard` drew the five
 * cards on /resources; `core/PLGHub`'s `TopicCard` drew the cards on
 * /resources/playbooks and /product-led-growth. Their grounds are byte-identical
 * — same 1px hairline, same radius, same 24px padding, the same
 * `rgba(20,20,20,0.6)` fill lifting to 0.8 on hover with the border going to
 * peach — because one was copied from the other and neither knew.
 *
 * The copies had drifted in exactly one place, and it is the reason this is
 * worth having as a component rather than a convention: `TopicIcon` took its
 * colour as a prop, and the single call site passed the literal `#fac089`.
 * The brand peach is `#fec089`. One character, shipped, invisible to every gate
 * in that repository because a raw hex inside a styled-components prop is not a
 * Tailwind arbitrary value. The icon here takes no colour prop. There was one
 * colour in use and it was meant to be the brand's.
 *
 * ## Why the whole card is the link
 *
 * Both originals made the root an anchor rather than putting a link in the
 * footer, so the target is the card and not the six words at the bottom of it.
 * That is kept. `asChild` is here because the consumers are Next apps and
 * `next/link` has to BE the root element rather than sit inside it; this package
 * cannot import it. Without `asChild` a caller nests an anchor inside an anchor,
 * which is invalid and which no typechecker will tell them about.
 *
 * ## Translucent, like `NoticeBar`
 *
 * `rgba(20,20,20,0.6)` is transcribed and has no token. It is a near-black wash
 * that lets a textured page ground read through the card, and the package ships
 * no mode-aware surface token for "mostly opaque over whatever is behind me".
 * `--color-chrome-surface-*` is the opaque family and would flatten the dither
 * every page that uses this paints behind it.
 */
export interface HubCardsProps {
    children: React.ReactNode;
    className?: string;
}
export declare function HubCards({ children, className }: HubCardsProps): React.JSX.Element;
export interface HubCardProps extends Omit<React.ComponentProps<'a'>, 'title' | 'children'> {
    /** The mark in the corner. A lucide icon at 20px in both originals. */
    icon?: React.ReactNode;
    /** The card's heading. */
    title: React.ReactNode;
    /** One line under the heading. */
    description?: React.ReactNode;
    /**
     * The supporting lines between the description and the call to action.
     *
     * A slot rather than a `details: string[]`, because the two originals filled
     * this space differently: /resources listed three bullets, and the playbook
     * cards wrote a labelled line. An array prop would have served one and forced
     * the other back into a local copy, which is how there came to be two.
     */
    children?: React.ReactNode;
    /** The call to action. The arrow after it is the component's. */
    cta?: React.ReactNode;
    /** Render the root as the caller's element, for `next/link`. */
    asChild?: boolean;
}
export declare function HubCard({ icon, title, description, children, cta, asChild, className, ...props }: HubCardProps): React.JSX.Element;
//# sourceMappingURL=hub-cards.d.ts.map