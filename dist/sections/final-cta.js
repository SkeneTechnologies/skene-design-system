import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * The closing band: full-bleed, centred, one heading and the actions.
 *
 * Appears twice on the live homepage and once per subpage, and every instance
 * had been rebuilt by hand.
 *
 * `pixel-bg.webp` is the default backdrop and ships with the package.
 *
 * It used to be a required prop, on the grounds that assets/README rejected the
 * file at 2.9 MB. That number was stale by twenty times — the optimised copy is
 * 143 KB — so the band defaulted to a bare gradient and every consumer had to
 * supply the texture to get the section the site actually has. Defaults should
 * produce the real thing.
 *
 * Pass `backdrop={false}` for the gradient alone, or a URL for your own.
 */
/** Resolved against this module, so a consumer gets a bundled URL from importing
 *  the package rather than having to copy the file into its own `public/`. */
const PIXEL_BG = new URL('../../assets/pixel-bg.webp', import.meta.url).href;
export function FinalCta({ backdrop, actions, lede, eyebrow, className, children }) {
    const bg = backdrop === false ? undefined : (backdrop ?? PIXEL_BG);
    return (_jsxs("section", { className: cn('relative grid min-h-[560px] place-items-center overflow-hidden md:min-h-[610px]', className), style: { background: 'var(--color-chrome-surface-deep)' }, children: [_jsx("div", { "aria-hidden": true, className: "absolute inset-0 scale-[1.03]", style: {
                    // The gradient sits ON the image, not behind it: the texture is busy
                    // and the heading is 5rem, so the copy needs its own ground.
                    backgroundImage: bg
                        ? `linear-gradient(180deg, rgba(20,20,20,0.2), rgba(10,10,10,0.74)), url(${bg})`
                        : 'linear-gradient(180deg, rgba(20,20,20,0.2), rgba(10,10,10,0.74))',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    filter: bg ? 'saturate(70%)' : undefined,
                } }), _jsxs("div", { className: "relative z-10 max-w-[940px] px-6 py-[90px] text-center", children: [eyebrow ? _jsx("div", { className: "mb-[22px]", children: eyebrow }) : null, _jsx("h2", { className: "mb-[22px] text-[clamp(2.75rem,5vw,5rem)] leading-[1.05] text-chrome-text-primary", children: children }), lede ? (_jsx("p", { className: "mx-auto max-w-[710px] text-[17px] text-chrome-text-muted-warm-strong", children: lede })) : null, actions ? (_jsx("div", { className: "mt-[34px] flex flex-col flex-wrap justify-center gap-3 sm:flex-row", children: actions })) : null] })] }));
}
