import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * Colour lives in one table rather than in branches at the call site, so adding
 * a tone is a row and never a second opinion about the geometry.
 */
const TONES = {
    neutral: { className: 'bg-chrome-surface-darker text-brand-light' },
    healthy: {
        style: {
            background: 'color-mix(in oklab, var(--color-semantic-matcha) 14%, transparent)',
            color: 'var(--color-semantic-matcha)',
        },
    },
    live: {
        style: {
            background: 'color-mix(in oklab, var(--color-accent-violet) 14%, transparent)',
            color: 'var(--color-accent-violet)',
        },
    },
    // Added 2026-08-13, and the file header called it: "a fourth belongs in this
    // file the day something actually renders it." `AskWidget` had been rendering
    // it inline since the day it was written — the same base, a hairline and a
    // warm muted ink — in a file that does not import this one.
    outline: { className: 'border border-chrome-line-strong text-chrome-text-muted-warm' },
};
export function Chip({ tone = 'neutral', className, children }) {
    const { className: toneClassName, style } = TONES[tone];
    return (_jsx("span", { 
        // shrink-0: every live instance sits in a flex row opposite a title that
        // can wrap. Without it the chip is what gives, and a squeezed chip reads
        // as a rendering bug rather than a label. `WindowStatus` already had it;
        // `PlanCard`'s tier chip did not, and gains it here — in that row the flag
        // ("Popular") is the item that should wrap, never the tier's identity.
        //
        // tracking-[0.08em] is the tier chip's value and the default for new call
        // sites. `WindowStatus` overrides it to 0.05em to keep its shipped
        // rendering; see this file's header.
        className: cn('shrink-0 rounded-[5px] px-[7px] py-1 font-mono text-[10px] uppercase tracking-[0.08em]', toneClassName, className), style: style, children: children }));
}
