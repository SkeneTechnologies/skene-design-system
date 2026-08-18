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
export type Status = 'good' | 'warn' | 'danger'

export const STATUS_TOKEN: Record<Status, string> = {
  good: 'var(--color-semantic-matcha)',
  warn: 'var(--color-semantic-warning-amber)',
  danger: 'var(--color-semantic-error-red)',
}

/**
 * The same three states, as INK ON A TINT OF THEMSELVES.
 *
 * `STATUS_TOKEN` is the graphic colour: a rim, an SVG stroke, a fill, a dot.
 * Those values were derived to clear the contrast floor against the light
 * SURFACE ladder, and a label inside a tinted pill or tag does not sit on the
 * surface ladder — it sits on a warmer, slightly different ground made from its
 * own hue, where the derivation misses by 0.05 to 0.62.
 *
 * `artifact-shell` learned this in 0.5.1 and held the split privately as
 * `STATUS_GRAPHIC` / `STATUS_TEXT`. `finding-card` then shipped the identical
 * defect, which is what a private copy of a colour decision buys. It is one map
 * now, beside the one it is the counterpart to.
 *
 * The dark values are the base tokens unchanged, by derivation rather than by
 * omission: a dark tint is dark and the base already clears on it.
 *
 * These are derived for a tint in the 10–12% band. Above that the ground gets
 * lighter than anything they were measured against and they stop clearing —
 * measured at 18%, `errorRedOnTint` lands 4.49. A component using this map owes
 * a measurement of its own fill percentage, not an assumption.
 */
export const STATUS_TINT_TOKEN: Record<Status, string> = {
  good: 'var(--color-semantic-matcha-on-tint)',
  warn: 'var(--color-semantic-warning-amber-on-tint)',
  danger: 'var(--color-semantic-error-red-on-tint)',
}
