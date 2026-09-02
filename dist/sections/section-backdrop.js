import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * `texture` names map onto the `data-field` values `.skene-field` keys off.
 *
 * Two vocabularies for the same three fields, and they are not merged here on
 * purpose: `BackdropTexture` is this component's public API and `ArtFrameKind`
 * is `artifact-shell`'s, both are load bearing for their own callers, and
 * renaming either to match the other would be a breaking change for a cosmetic
 * gain.
 */
const FIELD_FOR_TEXTURE = {
    journey: 'jr',
    github: 'gh',
    schema: 'db',
};
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
export function SectionBackdrop({ texture = 'journey', src, inset = 6, field = 'image', className, children, }) {
    const css = field === 'css';
    const url = src ?? TEXTURE_URL[texture];
    return (_jsx("div", { "data-field": css ? FIELD_FOR_TEXTURE[texture] : undefined, className: cn('relative isolate flex items-center overflow-hidden', css && 'skene-field', className), style: {
            padding: `${inset}%`,
            // The live container is square, so the texture surrounds the panel on
            // every side. Without vertical room it only shows left and right, which
            // is the border failure again in the other axis.
            minHeight: '22rem',
            /* The raster's three properties are omitted entirely on the CSS path.
               `.skene-field` declares its own multi-layer background-size, -position
               and -repeat, and an inline `background-size: cover` would override the
               shorthand and render one enormous dot instead of a grid. */
            ...(css
                ? null
                : {
                    backgroundImage: `url(${url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }),
        }, children: _jsx("div", { className: "relative w-full", style: { zIndex: 1 }, children: children }) }));
}
