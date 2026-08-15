import { cn } from '../lib/utils.js'

/**
 * The halftone field a product mock sits on inside a feature row.
 *
 * These are the real textures from the site, not an approximation. An earlier
 * version of this file generated the field from tokens with CSS conic gradients,
 * on the reasoning that the artwork was page content and could not ship. That
 * was wrong twice over: the generated field read as a chunky checkerboard next
 * to the actual fine dot halftone, and the artwork is brand furniture rather
 * than content — the same argument that already lets `dither-subpage.webp` ship.
 *
 * Pairing follows the live site exactly, so a reader who knows it meets the same
 * backdrop behind the same kind of thing:
 *
 *   journey  card1 — journeys, funnels, measurement
 *   github   card2 — GitHub, PRs, editor chrome
 *   schema   card3 — schema, connections, keys
 *
 * Decorative throughout: aria-hidden, pointer-events-none, content lifted above.
 */

export type BackdropTexture = 'journey' | 'github' | 'schema'

/**
 * Resolved against this module rather than exported as bare paths, so a consumer
 * gets a bundler-processed URL from `import`-ing the package and does not have to
 * copy files into its own `public/`.
 */
const TEXTURE_URL: Record<BackdropTexture, string> = {
  journey: new URL('../../assets/card1_bg.webp', import.meta.url).href,
  github: new URL('../../assets/card2_bg.webp', import.meta.url).href,
  schema: new URL('../../assets/card3_bg.webp', import.meta.url).href,
}

export interface SectionBackdropProps {
  /** Which of the three site textures. Ignored when `src` is given. */
  texture?: BackdropTexture
  /** Explicit texture URL, for a consumer with its own artwork. */
  src?: string
  /**
   * Inset of the panel from the field edge, as a percentage of width.
   *
   * A percentage, not a spacing step. The live panel is 84–92% of its container,
   * so ~4–8% each side, and a percentage holds that proportion at every track
   * width by construction. A fixed padding was tried first and turns the field
   * into a coloured BORDER on a short wide card instead of a backdrop.
   */
  inset?: number
  className?: string
  children?: React.ReactNode
}

export function SectionBackdrop({
  texture = 'journey',
  src,
  inset = 6,
  className,
  children,
}: SectionBackdropProps) {
  const url = src ?? TEXTURE_URL[texture]
  return (
    <div
      className={cn('relative isolate flex items-center overflow-hidden', className)}
      style={{
        padding: `${inset}%`,
        // The live container is square, so the texture surrounds the panel on
        // every side. Without vertical room it only shows left and right, which
        // is the border failure again in the other axis.
        minHeight: '22rem',
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative w-full" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
