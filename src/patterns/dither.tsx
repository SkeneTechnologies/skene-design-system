import { cn } from '../lib/utils.js'

export interface DitherOverlayProps {
  /** The dither/halftone texture. The package ships one at `skene/dither.webp`. */
  src: string
  /** 0.8 on the live site. Lower for busier media. */
  opacity?: number
  /**
   * `soft-light` is what makes this read as a print halftone rather than a
   * sticker: it lightens and darkens the layer beneath instead of covering it,
   * so the underlying photo or video still shows through with its own contrast.
   * `overlay` is harsher, `multiply` just dims. Change only deliberately.
   */
  blend?: 'soft-light' | 'overlay' | 'multiply' | 'screen'
  className?: string
}

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
export function DitherOverlay({
  src,
  opacity = 0.8,
  blend = 'soft-light',
  className,
}: DitherOverlayProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full object-cover', className)}
      style={{ mixBlendMode: blend, opacity, zIndex: 0 }}
    />
  )
}

export interface DitheredMediaProps {
  /** Background video. Takes precedence over `image`. */
  video?: string
  /** Background image, if there is no video. */
  image?: string
  /** Dither texture laid over the media. */
  dither?: string
  /** Where the bottom gradient fades to, so content below joins seamlessly. */
  fadeTo?: string
  /**
   * Opacity of the black scrim between the media and the content, 0 to 1.
   *
   * Not decoration. Video is not a background you can measure once: a frame
   * that is dark when you look at it is bright four seconds later, and the
   * text does not move. The homepage hero measured 1.04:1 for peach display
   * type over a bright frame, against a 3.0 floor, at every viewport — while
   * a CSS-walking contrast checker reported the same page clean, because the
   * video is a SIBLING of the text and invisible to an ancestor walk.
   *
   * 0.56, not the live site's 0.48. Matching the live wash stop for stop still
   * left the 11px eyebrow at 4.37 to 4.49 against a 4.5 floor — it is the
   * smallest text on the page and it sits highest in the frame, where the
   * footage is brightest, which is the one place a gradient weighted toward
   * the foot helps least. 0.56 clears it with margin and the footage still
   * reads. Set 0 only for media you have measured against real pixels at
   * several points in its timeline.
   */
  scrim?: number
  /**
   * Poster frame, shown before the video decodes and to anyone whose browser
   * declines to autoplay it. Without it those readers get the flat chrome
   * ground and the hero copy sits on nothing.
   */
  poster?: string
  className?: string
  children?: React.ReactNode
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
export function DitheredMedia({
  video,
  image,
  dither,
  fadeTo = 'var(--color-chrome-surface-darker)',
  scrim = 0.56,
  poster,
  className,
  children,
}: DitheredMediaProps) {
  return (
    <div className={cn('relative isolate overflow-hidden bg-chrome-surface-darker', className)}>
      {video ? (
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          // `metadata` rather than `auto`: the hero video is decorative, and
          // preloading it competes with the content for bandwidth on first paint.
          preload="metadata"
          poster={poster}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: -1 }}
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : image ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})`, zIndex: -1 }}
        />
      ) : null}

      {dither ? <DitherOverlay src={dither} /> : null}

      {/*
        The scrim, between the media and the fade. Four stops rather than a
        flat fill, copied from the live site: heavier at the foot where the
        page joins, lighter across the middle where the footage does the work.
        A flat 48% would dim the whole frame to buy legibility only at the
        bottom.
      */}
      {scrim > 0 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 0,
            background:
              `linear-gradient(180deg, rgb(0 0 0 / ${scrim * 0.83}) 0%, rgb(0 0 0 / ${scrim}) 40%,` +
              ` rgb(0 0 0 / ${scrim}) 60%, rgb(0 0 0 / ${Math.min(1, scrim * 1.35)}) 100%)`,
          }}
        />
      ) : null}

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ zIndex: 0, background: `linear-gradient(to bottom, transparent 40%, ${fadeTo})` }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}
