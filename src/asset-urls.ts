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
  pixelFieldSource: new URL('../assets/pixel-bg-source.webp', import.meta.url).href,
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

  /** Homepage hero dither texture — feeds glass/refraction treatments. `hero-dither.png`. */
  heroDither: new URL('../assets/hero-dither.png', import.meta.url).href,

  /** Agent illustration, first of the set of three. `agent-1.svg`. */
  agentOne: new URL('../assets/agent-1.svg', import.meta.url).href,
  /** Agent illustration, second of three. `agent-2.svg`. */
  agentTwo: new URL('../assets/agent-2.svg', import.meta.url).href,
  /** Agent illustration, third of three. `agent-3.svg`. */
  agentThree: new URL('../assets/agent-3.svg', import.meta.url).href,

  /** The brand hero video. Pass to `DitheredMedia` via its `video` prop. */
  heroVideo: new URL('../assets/skene-hero.mp4', import.meta.url).href,
  /** The product demo video, for demo modals. `skene-demo.mp4`. */
  demoVideo: new URL('../assets/skene-demo.mp4', import.meta.url).href,
} as const

/**
 * Integration marks — third-party logos the marketing surfaces pair with
 * Skene artwork. Kept in their own map because they are someone else's brand:
 * render them at their delivered proportions, never recolour them.
 */
export const integrationMarkUrls = {
  /** Bolt mark. */
  bolt: new URL('../assets/integrations/bolt.svg', import.meta.url).href,
  /** Cursor mark. */
  cursor: new URL('../assets/integrations/cursor.svg', import.meta.url).href,
  /** GitHub mark. */
  github: new URL('../assets/integrations/github.svg', import.meta.url).href,
  /** Resend mark. */
  resend: new URL('../assets/integrations/resend.svg', import.meta.url).href,
  /** Supabase mark. */
  supabase: new URL('../assets/integrations/supabase.svg', import.meta.url).href,
  /** Terminal mark. */
  terminal: new URL('../assets/integrations/terminal.svg', import.meta.url).href,
  /** v0 mark. */
  v0: new URL('../assets/integrations/v0.svg', import.meta.url).href,
  /** Windsurf mark. */
  windsurf: new URL('../assets/integrations/windsurf.svg', import.meta.url).href,
} as const

export type IntegrationMarkName = keyof typeof integrationMarkUrls

export type AssetName = keyof typeof assetUrls
