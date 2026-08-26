import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
export function Code({ children, onLight, className }) {
    return (_jsx("code", { className: cn('rounded-sm border px-[4px] py-px font-mono text-[length:var(--font-size-body)]', 
        // EACH VARIANT CARRIES ITS OWN MODE CLASS, and the contrast gate is what
        // proved that necessary rather than tidy. Measured across both modes:
        //
        //   dark  brand.peach / surface.2      10.06:1   the default, as used
        //   light brand.peach / surface.2       4.30:1   below the 4.5 body floor
        //   light text.primary / brand.light   17.75:1   onLight, as used
        //   dark  text.primary / brand.light    1.00:1   invisible
        //
        // The two failing rows are each variant measured in the mode it is never
        // meant to render in — and "never meant to" is not a guarantee, it is a
        // hope about where a caller puts it. `onLight` outside a `light` subtree
        // is near-white ink on cream at 1.00:1, which is not low contrast, it is
        // the same colour.
        //
        // Pinning the mode makes each variant resolve its own tokens wherever it
        // lands, so the measured number is the rendered number. This is the
        // inverse of the `brand.peachDeep` failure: there an invariant token was
        // assumed to adapt; here mode-aware tokens are made deterministic.
        onLight
            ? 'light border-chrome-line-on-light bg-brand-light text-text-primary'
            : 'dark border-surface-border bg-surface-2 text-brand-peach', className), children: children }));
}
/**
 * The same mark for prose the caller does not author element by element — MDX, a
 * table cell, a body rendered from a string.
 *
 * A descendant selector rather than a component, because there is no `<code>` to
 * wrap: apply it to the block that CONTAINS the prose. Kept as a second
 * mechanism deliberately rather than collapsed into the component — the two
 * solve different problems and merging them leaves one case with no answer.
 *
 * Whole class strings, never interpolated: Tailwind scans source text.
 */
export const PROSE_CODE = '[&_code]:rounded-sm [&_code]:border [&_code]:border-surface-border ' +
    '[&_code]:bg-surface-2 [&_code]:px-[4px] [&_code]:py-px [&_code]:font-mono ' +
    '[&_code]:text-[length:var(--font-size-body)] [&_code]:text-brand-peach';
