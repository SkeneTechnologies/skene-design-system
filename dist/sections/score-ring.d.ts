import { type Status } from '../lib/status.js';
/**
 * The audit score: a partial arc on a track, with the value inside it.
 *
 * It is the first thing a reader sees in the audit artifact, and it has one job
 * the number alone cannot do — say whether the number is a problem. "72" is
 * meaningless without a scale; the arc supplies the scale as geometry, so the
 * reader knows it is roughly three-quarters of the way round before reading a
 * digit.
 *
 * ## `status`, not a colour, and never peach
 *
 * A coverage score is a MEASURED state, so it binds the reserved vocabulary —
 * `good | warn | danger` to `semantic.matcha / warningAmber / errorRed` — the
 * same three `Finding` uses. The captured demo drew this ring in its own gold
 * accent, which this package does not carry as a status colour, and reaching for
 * `brand.peach` instead would be worse: peach is the primary ACTION colour, so a
 * peach fault reads as a call to action (ux-patterns 3).
 *
 * The default is `warn` rather than `good`, because the only place this shipped
 * reads "Coverage needs attention" at 72. A default of `good` would mean a
 * forgotten prop renders a failing score in the reassurance colour — the same
 * argument that keeps `StatChip` and `MetaChip` apart.
 *
 * ## Theme-aware, because it lives on a light panel
 *
 * The artifact it sits in is an `AppWindow`, which is light, but the same ring on
 * a dark marketing band is one prop away for a caller. So the digits take the
 * mode-aware `text.*` role and the track is mixed from `currentColor`, which
 * already follows a `light` ancestor — the trick `StatChip` uses to survive both
 * grounds without an `onLight` prop. The arc itself is a semantic token, and both
 * semantic values ship a light-surface variant.
 *
 * ## Why the arc is stroke-dash and not a conic gradient
 *
 * A conic gradient cannot round its own end caps, and the captured ring is round
 * on both ends. `strokeLinecap="round"` gets that for free, and a stroked circle
 * is also the only version that scales cleanly: everything here is in viewBox
 * units, so `size` moves one number.
 */
/** The reserved status vocabulary. Same three as `Finding`. */
export type ScoreRingStatus = Status;
export interface ScoreRingProps {
    /** The score. Clamped into `0..max`; a value outside that is a caller bug, not a design. */
    value: number;
    /** The scale. 100 in every shipped instance, and shown as the denominator. */
    max?: number;
    /** Measured state. See the file header for why this defaults to `warn`. */
    status?: ScoreRingStatus;
    /**
     * Rendered diameter in px. The ring is the only thing that scales — the digits
     * are sized from it, so a caller cannot end up with 11px type inside a 120px ring.
     */
    size?: number;
    /**
     * What the number MEANS, for assistive tech — "Coverage". The visible digits
     * are decorative duplicates of the label, which is why they are aria-hidden.
     */
    label: string;
    className?: string;
}
export declare function ScoreRing({ value, max, status, size, label, className, }: ScoreRingProps): import("react").JSX.Element;
//# sourceMappingURL=score-ring.d.ts.map