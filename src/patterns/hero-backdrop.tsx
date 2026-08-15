import { cn } from '../lib/utils.js'

export interface HeroBackdropProps {
  /**
   * Backdrop asset. Left as a required-ish prop with no default on purpose:
   * the package ships no images.
   *
   * skene-marketing-website's version defaulted to `/img/subpage-bg.webp`, which
   * only works if the consumer happens to have that file at that path. A default
   * that silently 404s in a new app is worse than no default, because the
   * gradient still renders and the page looks intentional while the texture is
   * simply missing. Pass an image, or pass nothing and get the gradient alone.
   */
  image?: string
  /** Opacity of the backdrop image. Low by design; it is texture, not content. */
  imageOpacity?: number
  /** Where the gradient fades to. Defaults to the always-dark chrome floor. */
  fadeTo?: string
  className?: string
  children: React.ReactNode
}

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
export function HeroBackdrop({
  image,
  imageOpacity = 0.9,
  fadeTo = 'var(--color-chrome-surface-darker)',
  className,
  children,
}: HeroBackdropProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-chrome-surface-darker',
        className,
      )}
    >
      {image ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})`, opacity: imageOpacity }}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: `linear-gradient(to bottom, transparent, ${fadeTo})` }}
      />
      {children}
    </div>
  )
}
