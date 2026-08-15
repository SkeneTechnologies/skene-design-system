import { cn } from '../lib/utils.js'

/**
 * The closing band: full-bleed, centred, one heading and the actions.
 *
 * Appears twice on the live homepage and once per subpage, and every instance
 * had been rebuilt by hand.
 *
 * `pixel-bg.webp` is the default backdrop and ships with the package.
 *
 * It used to be a required prop, on the grounds that assets/README rejected the
 * file at 2.9 MB. That number was stale by twenty times — the optimised copy is
 * 143 KB — so the band defaulted to a bare gradient and every consumer had to
 * supply the texture to get the section the site actually has. Defaults should
 * produce the real thing.
 *
 * Pass `backdrop={false}` for the gradient alone, or a URL for your own.
 */

/** Resolved against this module, so a consumer gets a bundled URL from importing
 *  the package rather than having to copy the file into its own `public/`. */
const PIXEL_BG = new URL('../../assets/pixel-bg.webp', import.meta.url).href

export interface FinalCtaProps {
  /**
   * Backdrop image. Defaults to the shipped `pixel-bg.webp`; `false` renders the
   * gradient alone.
   */
  backdrop?: string | false
  /** Usually one or two `<Button>`s. */
  actions?: React.ReactNode
  /** Supporting line under the heading. */
  lede?: React.ReactNode
  /**
   * The kicker above the heading — usually an `<Eyebrow>`.
   *
   * A slot rather than a string, matching `TrustPanel`: this band is
   * always-dark, so the invariant `Eyebrow` is correct here as shipped, but the
   * caller still owns which component draws it.
   *
   * Added 2026-08-14, for the same reason: a band with an eyebrow could not
   * adopt this component without losing the line.
   */
  eyebrow?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function FinalCta({ backdrop, actions, lede, eyebrow, className, children }: FinalCtaProps) {
  const bg = backdrop === false ? undefined : (backdrop ?? PIXEL_BG)
  return (
    <section
      className={cn(
        'relative grid min-h-[560px] place-items-center overflow-hidden md:min-h-[610px]',
        className,
      )}
      style={{ background: 'var(--color-chrome-surface-deep)' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 scale-[1.03]"
        style={{
          // The gradient sits ON the image, not behind it: the texture is busy
          // and the heading is 5rem, so the copy needs its own ground.
          backgroundImage: bg
            ? `linear-gradient(180deg, rgba(20,20,20,0.2), rgba(10,10,10,0.74)), url(${bg})`
            : 'linear-gradient(180deg, rgba(20,20,20,0.2), rgba(10,10,10,0.74))',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: bg ? 'saturate(70%)' : undefined,
        }}
      />
      <div className="relative z-10 max-w-[940px] px-6 py-[90px] text-center">
        {/* Inside the same max-width and the same `text-center`, so the chip
            centres on the heading it belongs to rather than on the viewport.
            22px matches the heading's own `mb`, which is the band's rhythm. */}
        {eyebrow ? <div className="mb-[22px]">{eyebrow}</div> : null}
        <h2 className="mb-[22px] text-[clamp(2.75rem,5vw,5rem)] leading-[1.05] text-chrome-text-primary">
          {children}
        </h2>
        {lede ? (
          <p className="mx-auto max-w-[710px] text-[17px] text-chrome-text-muted-warm-strong">
            {lede}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-[34px] flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  )
}
