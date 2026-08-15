import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * Resolved against this module rather than exported as bare paths, so a consumer
 * gets a bundler-processed URL from `import`-ing the package and does not have to
 * copy files into its own `public/`.
 */
const TEXTURE_URL = {
    journey: new URL('../../assets/card1_bg.webp', import.meta.url).href,
    github: new URL('../../assets/card2_bg.webp', import.meta.url).href,
    schema: new URL('../../assets/card3_bg.webp', import.meta.url).href,
};
export function SectionBackdrop({ texture = 'journey', src, inset = 6, className, children, }) {
    const url = src ?? TEXTURE_URL[texture];
    return (_jsx("div", { className: cn('relative isolate flex items-center overflow-hidden', className), style: {
            padding: `${inset}%`,
            // The live container is square, so the texture surrounds the panel on
            // every side. Without vertical room it only shows left and right, which
            // is the border failure again in the other axis.
            minHeight: '22rem',
            backgroundImage: `url(${url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }, children: _jsx("div", { className: "relative w-full", style: { zIndex: 1 }, children: children }) }));
}
