/**
 * The person card for the about page: a name, a role, and optionally a
 * paragraph and a media slot.
 *
 * The media slot is optional and the card is designed for its absence, in the
 * same spirit as `LogoRow`'s empty slots: a small company's about page should
 * not need a photographer before it can name its people, and a card whose
 * layout collapses without an image forces the stock-photo placeholder this
 * package keeps refusing. With no `media`, the card is type on a bordered
 * panel and looks finished; with one, the media sits above the name in a
 * square frame that scales with the card, so a stack keeps one shape whether
 * every person has a photo or none do — and the frame only exists when the
 * media does, so an all-text grid carries no empty picture boxes.
 *
 * ## Semantics
 *
 * The card is an `<li>`, following `TrustFact`: the people on a team page are
 * a stack of peers, list semantics are what give a screen reader "3 of 5",
 * and `TeamGrid` is the `<ul>` around them. Inside it the name is a heading,
 * because a team page is scanned by name and that is what reaches the
 * outline; the level is a prop (`as`, default `h3`) on the assumption the
 * section above the grid owns the `h2`. The role is a plain block, not part
 * of the heading — "Teemu Kinos, founder" is two facts, and stuffing both
 * into the `<h3>` makes the outline read like a byline.
 *
 * ## Grounds
 *
 * `border`/`bg-card` and the theme-aware `text.*` roles throughout, so the
 * card follows a `light` ancestor onto cream with no `onLight` prop. Nothing
 * invariant: like `LogoRow`, this band has no fixed ground of its own.
 *
 * All content is props: no name, no role, no bio lives in here.
 * No `use client` — everything is props in, markup out.
 */
export interface TeamCardProps {
    /** The person's name. Rendered as a heading — see the file header. */
    name: React.ReactNode;
    /** What they do, stated flat — "Founder", "Engineering". */
    role: React.ReactNode;
    /**
     * Optional media — usually an `<img>`, but a slot rather than a `src`
     * because the caller owns the image component (Next's, a plain tag, an
     * illustration). Rendered in a square frame above the name; omitted, the
     * frame is omitted with it, and the card is deliberately complete without
     * one. `alt` is the caller's job: a portrait beside the printed name is
     * usually `alt=""`.
     */
    media?: React.ReactNode;
    /**
     * The heading element for the name. `h3` by default — the grid usually
     * sits under a section `h2`. Pass `h2` when the card stack IS the section.
     */
    as?: 'h2' | 'h3' | 'h4';
    /**
     * Body and links: a short bio paragraph, an anchor row, or both. Anchors
     * inside are styled here (underlined, brightening on hover) so a bare
     * `<a>` passed in is visible without call-site classes.
     */
    children?: React.ReactNode;
    className?: string;
}
export declare function TeamCard({ name, role, media, as: Heading, children, className }: TeamCardProps): import("react").JSX.Element;
export interface TeamGridProps {
    /**
     * `TeamCard`s, in order. They are `<li>`s — this slot renders inside a
     * `<ul>`, so pass cards, not arbitrary markup. Same contract as
     * `TrustPanel`'s facts slot.
     */
    children: React.ReactNode;
    className?: string;
}
export declare function TeamGrid({ children, className }: TeamGridProps): import("react").JSX.Element;
//# sourceMappingURL=team-card.d.ts.map