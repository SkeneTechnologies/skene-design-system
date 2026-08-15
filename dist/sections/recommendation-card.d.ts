/**
 * The proposal: what Skene suggests doing next, and what makes it worth doing.
 *
 * `Finding` and this look alike and mean opposite things. A finding REPORTS —
 * it names a signal that is broken right now and binds the reserved
 * `good | warn | danger` vocabulary to say how badly. A recommendation PROPOSES —
 * nothing is wrong yet, and there is no measured state to colour. Giving this a
 * status would put an amber pill on a suggestion, and a reader who has learned
 * that amber means "a signal is drifting" would read the suggestion as a fault.
 *
 * So it carries no status colour at all. Its only tint is the panel it sits on,
 * which is why it can appear twice in one artifact without the artifact looking
 * like it has two warnings on it.
 *
 * ## Theme-aware, on the light panel it shipped on
 *
 * It appeared inside the light "Journey improvement" window, and the same block
 * belongs on a dark marketing band, so every colour is the mode-aware `text.*`
 * role and the fill and hairline mix from `currentColor`. There is no `onLight`
 * prop to forget.
 *
 * ## `meta` is a slot, and the chips in it are not `MetaChip`
 *
 * The live card ends with two qualifiers — "Expected insight: activation
 * blocker", "Evidence: 3 signals". `MetaChip` is the wrong shape for them: it
 * marks something NOT SHIPPED YET and puts a state word in mono at the end.
 * These are facts about the proposal. `TagChip` from `key-value-table` is the
 * closer part, and passing it in a slot keeps this card from owning a chip
 * vocabulary it does not define.
 */
export interface RecommendationCardProps {
    /** Mono kicker — "RECOMMENDED NEXT STEP". */
    eyebrow?: React.ReactNode;
    /** What to do, as a title. One line. */
    title: React.ReactNode;
    /** How to do it. A sentence or two, not a list. */
    children?: React.ReactNode;
    /** Qualifier chips, in a row under the body. `TagChip`s fit. */
    meta?: React.ReactNode;
    className?: string;
}
export declare function RecommendationCard({ eyebrow, title, children, meta, className, }: RecommendationCardProps): import("react").JSX.Element;
//# sourceMappingURL=recommendation-card.d.ts.map