/**
 * The activation funnel: a chart that reports healthy while the collection layer
 * under it is not.
 *
 * ## Why it has the product's palette and none of the product's chrome
 *
 * No Skene surface renders a funnel. This chart is the READER'S own dashboard —
 * Amplitude, Mixpanel, a Metabase card — which is the whole argument of both
 * pages that carry it: the number they already trust is the number that moved
 * for a reason that is not the one they think. So it is built on `AppWindow`
 * for the light product palette and given no `crumb` and no `actions`, which is
 * exactly the case `AppWindow` drops its whole bar for. Putting a Skene
 * breadcrumb on it would claim the funnel is a Skene screen and quietly break
 * the argument.
 *
 * ## Three step states, and only one of them is a bar
 *
 *   ok       a solid fill. The step is instrumented and the count is the count.
 *   broken   a 45° hatch, not a solid fill, so it reads as UNTRUSTWORTHY rather
 *            than merely low. A solid short bar says "few people did this"; the
 *            hatch says "this number is not measuring what you think".
 *   unknown  an empty DASHED track and no fill element at all. Not a zero bar —
 *            a zero would be a lie, and the value cell says "not measured"
 *            rather than "0" for the same reason.
 *
 * `broken` is amber, not peach. ux-patterns 3: amber is the warning colour and
 * peach is never used for one, because peach is the primary action colour in
 * this system and a peach fault reads as a call to action.
 *
 * ## Colour resolution, which is the part most likely to be edited wrongly
 *
 * Every state colour is the plain semantic token — `--color-semantic-matcha`
 * and `--color-semantic-warning-amber` — and NOT a hand-darkened mix. The
 * prototype had to write `color-mix(… 60%, #000)` because its own token layer
 * carried one value per colour; this package's `.light` block already ships the
 * light-surface values (matcha `#677552` at 4.95:1 on white, amber `#886a2f`,
 * which is within a hair of the prototype's 60%-black mix). `AppWindow` forces
 * `light`, so the tokens resolve to those values here with nothing added. The
 * one deliberate divergence: the prototype's light `ok` graphic is
 * `matcha-deep` (`#1a3300`, near-black), which would put a different green in
 * the bar than in the `ok` `StatPill` a caller passes as `badge`. One green.
 *
 * ## Spacing
 *
 * See the note at the top of `artifact-shell.tsx`: `--spacing: 0.2rem` makes
 * Tailwind's `p-4` 12.8px while `tokens.css` defines `--spacing-4: 16px`. Every
 * padding here is the literal px the prototype's token carries so it diffs
 * against artifacts.css line for line. Do not tidy them onto the numeric scale.
 *
 * All content is props. Nothing here knows what a Skene funnel step says — the
 * step names, the counts, the release that renamed the field and the "Last 28
 * days" are all the consumer's copy.
 */
/**
 * Whether a step is measured, measured wrongly, or not measured at all.
 *
 * A fixed vocabulary rather than a colour prop, for the same reason
 * `Finding` and `StatPill` fix theirs: a marketing page and a product that
 * disagree about what "broken" looks like teach the reader the wrong colour.
 */
export type FunnelStepState = 'ok' | 'broken' | 'unknown';
export interface FunnelRowProps {
    /** The step, as the reader's own analytics tool names it. */
    label: React.ReactNode;
    /**
     * The second line, monospace and quiet: what is known about the step's
     * instrumentation. This is where the argument lives — "field renamed in
     * release 184" is the whole point of the row above it.
     */
    note?: React.ReactNode;
    /**
     * The right-hand cell. A count for a measured step, a phrase for an unmeasured
     * one. Deliberately a `ReactNode` and not a number: the honest value for an
     * `unknown` step is words, not a digit.
     */
    value?: React.ReactNode;
    state: FunnelStepState;
    /**
     * Bar width as a percentage, 0-100. Ignored when `state` is `unknown` — that
     * state draws no fill by design. Omitting it on a measured step leaves a bare
     * solid track, which reads as a zero; pass a number.
     */
    fill?: number;
    className?: string;
}
/**
 * One step: label, track, value.
 *
 * The track is `aria-hidden`. It encodes nothing the value cell beside it does
 * not already say in words, and a screen reader announcing a decorative div
 * between every label and its count makes the funnel harder to read, not easier.
 *
 * Below 640px the three columns collapse to one and the value moves back to the
 * left edge — a 180px label column plus an 84px value column cannot survive a
 * 390px viewport, and the prototype's own breakpoint (620px) exists for exactly
 * that. It is snapped to Tailwind's `sm` here: 640 stacks 20px sooner, which is
 * the safe direction, and the package has no 620 rung to reach for.
 */
export declare function FunnelRow({ label, note, value, state, fill, className }: FunnelRowProps): import("react").JSX.Element;
export interface FunnelProps {
    /** The chart's name, as the reader's own tool labels it. */
    title: React.ReactNode;
    /**
     * The reassuring capsule at the top — the claim the rows are about to
     * contradict. Pass a `<StatPill status="ok">`; it is the same 11px
     * medium/35% edge/12% fill capsule the prototype drew by hand.
     */
    badge?: React.ReactNode;
    /** The right-held aside: the date window, the segment. Monospace and quiet. */
    meta?: React.ReactNode;
    /**
     * Colours the header dot. Defaults to `ok`, which is the trap state: the
     * frame reports green while the collection layer is not, and the reader has
     * to believe the green before the rows take it away.
     */
    status?: FunnelStepState;
    /** `FunnelRow`s. */
    children?: React.ReactNode;
    className?: string;
}
/**
 * The complete artifact: an unbranded light window, one panel, a header strip
 * and the rows.
 *
 * Rows are children rather than a `steps` array because a step's label and its
 * value are copy, not data — one row's value is a formatted count and the next
 * one's is a sentence, and a data-shaped API would need a renderer prop to say
 * so. Same call `DataTable` makes.
 */
export declare function Funnel({ title, badge, meta, status, children, className, }: FunnelProps): import("react").JSX.Element;
//# sourceMappingURL=funnel.d.ts.map