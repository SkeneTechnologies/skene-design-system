/**
 * Every shipped asset as a resolved URL string.
 *
 * The components already resolve their own artwork — `SectionBackdrop`,
 * `FinalCta`, `SkeneMark` all do `new URL('../../assets/…', import.meta.url)`
 * internally — so this module exists for the case those cannot cover: CSS
 * written outside JSX. `skene-marketing-website` styles its card animations with
 * styled-components, where the texture is interpolated into a template string
 * and there is no component to hand it to.
 *
 * The obvious alternative was for the consumer to import the file directly
 * (`import card1 from '@skene/design-system/assets/card1_bg.webp'`) and use
 * `card1.src`. That was tried first and shipped `url("undefined")` into three
 * live sections: Next's static-image transform, which is what makes an image
 * import an object with a `.src`, does not apply to a file imported out of
 * node_modules under Turbopack. What the consumer actually receives there is
 * bundler-dependent, and a value whose SHAPE depends on the bundler is not a
 * contract this package can offer.
 *
 * A string is. `new URL(..., import.meta.url)` is resolved by every bundler and
 * by Node, which is the same mechanism the components use and the reason they
 * were never affected.
 *
 * Names are what the asset IS, not what its file is called: a consumer choosing
 * between `card1_bg` and `card2_bg` has to know the pairing by heart, and the
 * pairing is exactly the thing `docs/sections.md` had to write down twice.
 */
export declare const assetUrls: {
    /** Halftone field for journeys, funnels, measurement. `card1_bg.webp`. */
    readonly journeyField: string;
    /** Halftone field for GitHub, PRs, editor chrome. `card2_bg.webp`. */
    readonly githubField: string;
    /** Halftone field for schema, connections, keys. `card3_bg.webp`. */
    readonly schemaField: string;
    /** Texture behind the integrations card animation. `plugin.png`. */
    readonly integrationsField: string;
    /** The closing-CTA backdrop. `pixel-bg.webp`. */
    readonly pixelField: string;
    /**
     * The same field at full resolution, 3,012,190 bytes against `pixelField`'s
     * 146,850.
     *
     * Both existed already and neither repository knew about the other: this one
     * was `skene-marketing-website/public/img/pixel-bg.webp`, shipped whole into
     * the closing CTA of `/product/architecture`. It is kept because it is the
     * larger original and deleting it from the consumer without keeping it
     * anywhere would have destroyed the only copy.
     *
     * DO NOT reach for this to paint a section. `pixelField` is the one a page
     * renders; twenty times the bytes buys nothing at the sizes a backdrop is
     * displayed at. This is here so a future re-encode has a source to work from.
     */
    readonly pixelFieldSource: string;
    /** The halftone laid over media, and the subpage header ground. */
    readonly subpageDither: string;
    /** Peach symbol on its own black tile — safe on any ground. */
    readonly symbolBlock: string;
    /** White symbol, no ground. */
    readonly symbolOnDark: string;
    /** Black symbol, no ground. */
    readonly symbolOnLight: string;
    /** White lockup, 1016×260. */
    readonly lockupOnDark: string;
    /** Black lockup, 1016×260. */
    readonly lockupOnLight: string;
    /** Peach symbol, white wordmark. Dark grounds only. */
    readonly lockupAccent: string;
    /** Homepage hero dither texture — feeds glass/refraction treatments. `hero-dither.png`. */
    readonly heroDither: string;
    /** Agent illustration, first of the set of three. `agent-1.svg`. */
    readonly agentOne: string;
    /** Agent illustration, second of three. `agent-2.svg`. */
    readonly agentTwo: string;
    /** Agent illustration, third of three. `agent-3.svg`. */
    readonly agentThree: string;
    /** The brand hero video. Pass to `DitheredMedia` via its `video` prop. */
    readonly heroVideo: string;
    /** The product demo video, for demo modals. `skene-demo.mp4`. */
    readonly demoVideo: string;
};
/**
 * Integration marks — third-party logos the marketing surfaces pair with
 * Skene artwork. Kept in their own map because they are someone else's brand:
 * render them at their delivered proportions, never recolour them.
 */
export declare const integrationMarkUrls: {
    /** Bolt mark. */
    readonly bolt: string;
    /** Cursor mark. */
    readonly cursor: string;
    /** GitHub mark. */
    readonly github: string;
    /** Resend mark. */
    readonly resend: string;
    /** Supabase mark. */
    readonly supabase: string;
    /** Terminal mark. */
    readonly terminal: string;
    /** v0 mark. */
    readonly v0: string;
    /** Windsurf mark. */
    readonly windsurf: string;
};
export type IntegrationMarkName = keyof typeof integrationMarkUrls;
export type AssetName = keyof typeof assetUrls;
//# sourceMappingURL=asset-urls.d.ts.map