/**
 * The reserved status vocabulary, and the one map from it to tokens.
 *
 * `good | warn | danger` bound to `semantic.matcha / warningAmber / errorRed` is
 * the package's fixed triple: it means a MEASURED state, and it is why nothing
 * may use `brand.peach` for a fault — peach is the primary action colour, so a
 * peach fault reads as a call to action.
 *
 * It lived as three character-identical copies — `finding-card`, `score-ring`
 * and `journey-track` each declared the type and the map — plus a fourth in
 * `pr-review` under severity names. Four copies of a colour decision is four
 * places for one of them to be "improved", and the improvement would be
 * invisible until two artifacts on the same page disagreed about what amber
 * means.
 *
 * The per-module type aliases stay. `FindingStatus`, `ScoreRingStatus` and
 * `JourneyStepState` are public, and a component whose prop reads
 * `status: Status` tells a caller less than one that names the vocabulary it
 * belongs to.
 *
 * Values, not classes: an SVG stroke and an inline `color-mix` are not Tailwind
 * colour utilities, and every consumer of this map needs the custom property.
 */
export type Status = 'good' | 'warn' | 'danger';
export declare const STATUS_TOKEN: Record<Status, string>;
//# sourceMappingURL=status.d.ts.map