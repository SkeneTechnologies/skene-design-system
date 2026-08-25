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

export const assetUrls = {
  /** Halftone field for journeys, funnels, measurement. `card1_bg.webp`. */
  journeyField: new URL('../assets/card1_bg.webp', import.meta.url).href,
  /** Halftone field for GitHub, PRs, editor chrome. `card2_bg.webp`. */
  githubField: new URL('../assets/card2_bg.webp', import.meta.url).href,
  /** Halftone field for schema, connections, keys. `card3_bg.webp`. */
  schemaField: new URL('../assets/card3_bg.webp', import.meta.url).href,
  /** Texture behind the integrations card animation. `plugin.png`. */
  integrationsField: new URL('../assets/plugin.png', import.meta.url).href,
  /** The closing-CTA backdrop. `pixel-bg.webp`. */
  pixelField: new URL('../assets/pixel-bg.webp', import.meta.url).href,
  /** The halftone laid over media, and the subpage header ground. */
  subpageDither: new URL('../assets/dither-subpage.webp', import.meta.url).href,

  /** Peach symbol on its own black tile — safe on any ground. */
  symbolBlock: new URL('../assets/skene-symbol-block.svg', import.meta.url).href,
  /** White symbol, no ground. */
  symbolOnDark: new URL('../assets/skene-symbol-on-dark.svg', import.meta.url).href,
  /** Black symbol, no ground. */
  symbolOnLight: new URL('../assets/skene-symbol-on-light.svg', import.meta.url).href,

  /** White lockup, 1016×260. */
  lockupOnDark: new URL('../assets/skene-lockup-on-dark.svg', import.meta.url).href,
  /** Black lockup, 1016×260. */
  lockupOnLight: new URL('../assets/skene-lockup-on-light.svg', import.meta.url).href,
  /** Peach symbol, white wordmark. Dark grounds only. */
  lockupAccent: new URL('../assets/skene-lockup-accent.svg', import.meta.url).href,
} as const

export type AssetName = keyof typeof assetUrls
