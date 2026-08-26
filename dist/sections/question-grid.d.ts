/**
 * The question grid: a row of cards, each one a category tag over a question the
 * reader is already asking. Used as the "what you'll actually be able to answer"
 * band — the copy does the work, so the card is deliberately almost nothing.
 *
 * ## Why the card has no fill
 *
 * The captured card is a border, a radius and a corner glow. No opaque
 * background, on purpose, and that is worth protecting: a card with no fill
 * cannot change polarity relative to the band it sits in, so it needs neither
 * the `light` nor the `dark` class and cannot fall into the nested-inversion
 * trap that `Bridge` and `PlanCard` have to spend a paragraph on. Drop a flat
 * fill in here and the card acquires its own ground — at which point it DOES
 * need a polarity class, and every token inside it needs re-checking.
 *
 * Everything legible is therefore the theme-aware `text.*` role, never
 * `chrome.text.*`. The chrome roles are invariant and cannot follow a mode, so
 * they are correct only on a surface that is always dark; this card is whatever
 * the band under it is. The hairline is `surface.border` for the same reason —
 * it is mode-aware, where `chrome.line.subtle` (white at 12%) would be a
 * near-invisible smear on a cream band.
 *
 * ## The corner glow
 *
 * A RADIAL gradient anchored at the top-right corner, peach at ~9%, falling to
 * transparent about two-thirds of the way across. It is a glow off the corner,
 * not a tint of the card: run the stop out to 100% and it reads as a flat peach
 * wash, which is a different and much louder object. `brand.peach` is mode-aware
 * (#fec089 dark, #89684a light), so the same `color-mix` lands correctly on both
 * grounds without a per-mode override.
 *
 * ## The 58px under the tag
 *
 * That gap is the design, not slack. It pushes the question down the card so the
 * tag reads as a category label sitting at the TOP OF THE CARD rather than as a
 * kicker glued to the heading. Close it up and the tag stops labelling the card
 * and starts modifying the sentence — the same two elements, saying something
 * else. It is a fixed margin rather than `mt-auto` on the body because the cards
 * share a row height and an auto gap would let a two-line question in one card
 * shove that card's tag out of line with its neighbours'.
 *
 * The 14px radius is off the radius scale (`--radius-xl` is 12, `--radius-2xl`
 * is 16). It is carried literally from the capture rather than snapped, because
 * the value is on screen and signed off; reconciling it is a token decision, not
 * a decision for this file.
 *
 * No `use client`: props in, markup out.
 */
/**
 * Tailwind cannot see an interpolated class name, so the column counts are a
 * static map rather than `md:grid-cols-${columns}`. One column below `md`
 * (768px) in every case — three 270px cards side by side on a phone are three
 * unreadable slivers.
 */
declare const COLUMN_CLASS: {
    readonly 1: "grid-cols-1";
    readonly 2: "grid-cols-1 md:grid-cols-2";
    readonly 3: "grid-cols-1 md:grid-cols-3";
    readonly 4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
};
export interface QuestionGridProps {
    /** Cards per row from `md` up. Defaults to 3, the captured layout. */
    columns?: keyof typeof COLUMN_CLASS;
    className?: string;
    /** `QuestionCard`s. */
    children: React.ReactNode;
}
export declare function QuestionGrid({ columns, className, children }: QuestionGridProps): import("react").JSX.Element;
export interface QuestionCardProps {
    /** Category label at the top of the card, e.g. "ATTRIBUTION". Rendered mono/uppercase. */
    tag?: React.ReactNode;
    /** The question itself — one line, and the reason the card exists. */
    title: React.ReactNode;
    /** The answer, or how Skene gets to it. A sentence or two. */
    children?: React.ReactNode;
    className?: string;
}
export declare function QuestionCard({ tag, title, children, className }: QuestionCardProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=question-grid.d.ts.map