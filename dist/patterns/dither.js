import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * The single most recognisable Skene surface treatment.
 *
 * A dithered texture laid over photographic or video media with a blend mode,
 * under a gradient fade. It is on the homepage hero, every subpage header, and
 * the auth split panel — it is what makes a page read as Skene before a word is
 * read.
 *
 * Decorative, so aria-hidden and pointer-events-none. Sits at z-0; give the
 * content above it a positive z-index or render it after.
 */
export function DitherOverlay({ src, opacity = 0.8, blend = 'soft-light', className, }) {
    return (_jsx("img", { src: src, alt: "", "aria-hidden": "true", className: cn('pointer-events-none absolute inset-0 h-full w-full object-cover', className), style: { mixBlendMode: blend, opacity, zIndex: 0 } }));
}
/**
 * The full hero composition: media, dither, gradient fade, content.
 *
 * Four stacked layers is what the homepage actually does, and getting the order
 * or the blend mode wrong is why it is hard to reproduce by eye. Composed here
 * so a new app gets it right without reverse-engineering the marketing site.
 *
 * The package ships no video and only a small texture, so both are props. On a
 * page with neither, the gradient alone still reads as an intentional dark
 * section rather than a broken one.
 */
export function DitheredMedia({ video, image, dither, fadeTo = 'var(--color-chrome-surface-darker)', scrim = 0.56, poster, className, children, }) {
    return (_jsxs("div", { className: cn('relative isolate overflow-hidden bg-chrome-surface-darker', className), children: [video ? (_jsx("video", { "aria-hidden": "true", autoPlay: true, loop: true, muted: true, playsInline: true, 
                // `metadata` rather than `auto`: the hero video is decorative, and
                // preloading it competes with the content for bandwidth on first paint.
                preload: "metadata", poster: poster, className: "pointer-events-none absolute inset-0 h-full w-full object-cover", style: { zIndex: -1 }, children: _jsx("source", { src: video, type: "video/mp4" }) })) : image ? (_jsx("div", { "aria-hidden": "true", className: "absolute inset-0 bg-cover bg-center", style: { backgroundImage: `url(${image})`, zIndex: -1 } })) : null, dither ? _jsx(DitherOverlay, { src: dither }) : null, scrim > 0 ? (_jsx("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0", style: {
                    zIndex: 0,
                    background: `linear-gradient(180deg, rgb(0 0 0 / ${scrim * 0.83}) 0%, rgb(0 0 0 / ${scrim}) 40%,` +
                        ` rgb(0 0 0 / ${scrim}) 60%, rgb(0 0 0 / ${Math.min(1, scrim * 1.35)}) 100%)`,
                } })) : null, _jsx("div", { "aria-hidden": "true", className: "absolute inset-0", style: { zIndex: 0, background: `linear-gradient(to bottom, transparent 40%, ${fadeTo})` } }), _jsx("div", { className: "relative", style: { zIndex: 1 }, children: children })] }));
}
