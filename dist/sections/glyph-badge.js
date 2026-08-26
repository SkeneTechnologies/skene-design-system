import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * Colour in one table rather than branches at the call site, so a tone is a row
 * and never a second opinion about the geometry. Same shape as `Chip`'s.
 */
const TONES = {
    tint: {
        className: 'border-chrome-line-on-light',
        style: { background: 'color-mix(in oklab, var(--color-brand-peach) 12%, transparent)' },
    },
    muted: { className: 'border-border bg-muted' },
};
export function GlyphBadge({ tone = 'tint', size = 38, glyphSize, children, className, }) {
    const { className: toneClassName, style } = TONES[tone];
    return (_jsx("span", { "aria-hidden": true, 
        // shrink-0, which the two originals did not carry: one sat in a grid track
        // where it was inert, the other in a flex row beside a title that wraps,
        // where the disc is what gives. A squeezed circle reads as a rendering
        // fault rather than a badge.
        className: cn('grid shrink-0 place-items-center rounded-full border text-brand-peach', toneClassName, className), style: { width: size, height: size, fontSize: glyphSize, ...style }, children: children }));
}
