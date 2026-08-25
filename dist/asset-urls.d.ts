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
};
export type AssetName = keyof typeof assetUrls;
//# sourceMappingURL=asset-urls.d.ts.map