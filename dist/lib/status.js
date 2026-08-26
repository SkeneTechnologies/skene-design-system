export const STATUS_TOKEN = {
    good: 'var(--color-semantic-matcha)',
    warn: 'var(--color-semantic-warning-amber)',
    danger: 'var(--color-semantic-error-red)',
};
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
export const STATUS_TINT_TOKEN = {
    good: 'var(--color-semantic-matcha-on-tint)',
    warn: 'var(--color-semantic-warning-amber-on-tint)',
    danger: 'var(--color-semantic-error-red-on-tint)',
};
