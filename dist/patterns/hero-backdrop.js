import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * A dark hero strip with a textured backdrop fading into the page.
 *
 * The most recognisable Skene page treatment, and the one thing a new app most
 * needs in order to look like the rest of the estate rather than like stock
 * shadcn. Every public-site hero composes from this shape.
 *
 * Uses `chrome.*` rather than `surface.*` deliberately: a hero strip is fixed
 * dark chrome. It should not invert on a light page, any more than a terminal
 * should.
 *
 * The image is decorative, so its layer is aria-hidden and the children stay in
 * the natural reading order.
 */
export function HeroBackdrop({ image, imageOpacity = 0.9, fadeTo = 'var(--color-chrome-surface-darker)', className, children, }) {
    return (_jsxs("div", { className: cn('relative isolate overflow-hidden bg-chrome-surface-darker', className), children: [image ? (_jsx("div", { "aria-hidden": "true", className: "absolute inset-0 -z-10 bg-cover bg-center", style: { backgroundImage: `url(${image})`, opacity: imageOpacity } })) : null, _jsx("div", { "aria-hidden": "true", className: "absolute inset-0 -z-10", style: { background: `linear-gradient(to bottom, transparent, ${fadeTo})` } }), children] }));
}
