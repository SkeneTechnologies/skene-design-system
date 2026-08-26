import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
const MARK_URL = {
    block: new URL('../../assets/skene-symbol-block.svg', import.meta.url).href,
    onDark: new URL('../../assets/skene-symbol-on-dark.svg', import.meta.url).href,
    onLight: new URL('../../assets/skene-symbol-on-light.svg', import.meta.url).href,
};
export function SkeneMark({ tone = 'block', size = 28, radius = 8, alt, className }) {
    return (_jsx("img", { src: MARK_URL[tone], width: size, height: size, alt: alt ?? '', "aria-hidden": alt ? undefined : true, className: cn('inline-block shrink-0 select-none', className), style: {
            width: size,
            height: size,
            borderRadius: tone === 'block' ? radius : undefined,
        } }));
}
const LOCKUP_URL = {
    onDark: new URL('../../assets/skene-lockup-on-dark.svg', import.meta.url).href,
    onLight: new URL('../../assets/skene-lockup-on-light.svg', import.meta.url).href,
    accent: new URL('../../assets/skene-lockup-accent.svg', import.meta.url).href,
};
/** The artwork's own aspect, so `height` is the only number a caller passes. */
const LOCKUP_RATIO = 1016 / 260;
export function SkeneLockup({ tone = 'onDark', height = 26, alt = 'Skene', className, }) {
    return (_jsx("img", { src: LOCKUP_URL[tone], width: Math.round(height * LOCKUP_RATIO), height: height, alt: alt, "aria-hidden": alt ? undefined : true, className: cn('inline-block shrink-0 select-none', className), style: { height, width: 'auto' } }));
}
