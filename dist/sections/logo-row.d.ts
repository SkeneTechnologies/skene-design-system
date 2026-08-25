/**
 * The proof strip: a heading, a stat line, a row of logo slots, and a caption
 * that explains why the slots are empty.
 *
 * The empty slots are the point, not a placeholder for art that has not
 * arrived. The marketing wireframes ship this strip on roughly fifteen pages
 * with all five slots blank and the caption "These slots stay empty until an
 * account agrees to be named on-site." — the strip asserts that named proof is
 * a thing this company will only show with consent, and an outlined blank is
 * how that assertion looks. So a `LogoSlot` renders a child only when given
 * one, the default is nothing, and NO fabricated customer mark belongs in one,
 * ever — not in a story, not in a demo, not as "sample data". The customer
 * list lives in canon (`customers.md`); a slot gets a logo the day that file
 * gains the name.
 *
 * ## Why the slot row is `aria-hidden` only when empty
 *
 * The wireframes mark the whole `logo-row` `aria-hidden`, which is right for
 * the all-blank state: five empty outlined boxes say nothing a screen reader
 * should sit through, and the caption under them already tells the true story
 * in prose. But that attribute is correct BECAUSE the boxes are empty, so it
 * cannot be unconditional here — the day a slot holds a real logo, hiding the
 * row would hide the proof. The row therefore takes the wireframe's hint as a
 * prop, `decorative`, defaulting to true because empty is the shipping state;
 * a caller that fills a slot flips it and gives each filled slot a name.
 *
 * ## Grounds
 *
 * Every colour is a mode-aware role — `text.*` for type, `border`/`muted` for
 * the slot outline and fill, the same pair `GlyphBadge`'s `muted` tone uses —
 * so the strip follows a `light` ancestor onto cream without an `onLight`
 * prop. Nothing here touches invariant `chrome.*`: this band has no fixed
 * ground of its own, it sits on whatever the page gives it.
 *
 * ## Layout
 *
 * Five equal tracks by default, two below `sm` — the wireframe's breakpoint,
 * where five 1fr tracks on a 360px screen are slivers. `count` is a number
 * rather than "however many children", because the empty state has no
 * children and still needs its geometry; when children ARE passed they fill
 * slots left to right and the remainder stay blank, which keeps a
 * three-logo row honest about the two names it does not yet have.
 *
 * All content is props: no heading, no stat, no caption lives in here.
 * No `use client` — everything is props in, markup out.
 */
export interface LogoSlotProps {
    /**
     * The logo, when an account has agreed to be named. Optional, and the
     * default matters: an empty slot renders as an outlined blank, which is the
     * shipping state. Do not pass a placeholder mark to fill space — see the
     * file header.
     */
    children?: React.ReactNode;
    /**
     * Accessible name for a FILLED slot — the account's name, since a logo is
     * an image and this package does not know what the caller renders inside.
     * Ignored while the slot is empty: a blank has nothing to announce.
     */
    label?: string;
    className?: string;
}
export declare function LogoSlot({ children, label, className }: LogoSlotProps): import("react").JSX.Element;
export interface LogoRowProps {
    /** The claim above the strip, as a heading. */
    title?: React.ReactNode;
    /**
     * The stat line under the heading — the numbers that stand in for the
     * missing names ("10 paying teams", "$2,000 MRR"). A slot, not a string,
     * so the caller can bold the figures with `<strong>`.
     */
    stat?: React.ReactNode;
    /**
     * How many slots the strip declares. Defaults to 5, the wireframes' count.
     * Independent of `children`: fewer children than `count` leaves the rest
     * blank, which is the honest rendering. It is also the column count, so
     * keep it equal to the number of tracks you want on one line.
     */
    count?: number;
    /**
     * `LogoSlot`s for the accounts that have agreed to be named, in order.
     * Omit it — the default — and the strip renders `count` empty slots.
     */
    children?: React.ReactNode;
    /**
     * The line under the slots that says why they are empty. On every
     * wireframe this is "These slots stay empty until an account agrees to be
     * named on-site." — it is the strip's real copy, so it is a prop rather
     * than baked in, but a strip without it is just a row of unexplained
     * boxes. Pass it.
     */
    caption?: React.ReactNode;
    /**
     * Whether the slot row is decoration (`aria-hidden`). Defaults to true,
     * which is correct for the empty state — see the file header. A caller
     * that fills slots with real logos sets this false.
     */
    decorative?: boolean;
    className?: string;
}
export declare function LogoRow({ title, stat, count, children, caption, decorative, className, }: LogoRowProps): import("react").JSX.Element;
//# sourceMappingURL=logo-row.d.ts.map