import { cn } from '../lib/utils.js'

/**
 * The Skene symbol, as an element rather than a file path.
 *
 * Anywhere the product speaks for itself — the featured `Bridge` card, the
 * `AgentCallout` avatar, a nav lockup — the same mark belongs there, and until
 * now every one of those places drew its own stand-in: a ringed glyph in one, a
 * letter "S" in another. Two hand-drawn approximations of a brand mark is one
 * more than a design system should allow, and neither of them is the mark.
 *
 * ## Three files, picked by the ground it sits on
 *
 *   block     peach glyph on its own black tile. The default, and the only one
 *             that is safe on ANY ground, because it brings its own.
 *   onDark    white glyph, no background. For a dark surface that is already the
 *             right colour.
 *   onLight   black glyph, no background. For cream.
 *
 * `tone` names the GROUND, not the glyph colour — `onLight` is the black one.
 * Naming it after the ink is what makes a caller pick the invisible variant: the
 * white glyph and the light ground sound like they belong together, and they are
 * exactly the pair that renders nothing.
 *
 * There is no peach-on-transparent file, which is why `block` is the default
 * rather than the tinted one: peach is the brand colour and the temptation is to
 * recolour a mask, but the mark's counters are part of the artwork and a
 * `mask-image` recolour loses them.
 *
 * ## Why `<img>` and not an inline `<svg>`
 *
 * The artwork is ~90 rectangles. Inlining it puts that in every render of every
 * component that shows a mark, and none of it is ever styled — no
 * `currentColor`, no state. As a URL it is one request, cached, and resolved
 * against this module so a consumer gets a bundler-processed path without
 * copying files into its own `public/`. Same mechanism as `SectionBackdrop`'s
 * textures and `FinalCta`'s pixel field.
 *
 * Decorative by default: it appears beside the word "Skene" or above a card that
 * says SKENE, so an alt text of "Skene" is a duplicate announcement. Pass `alt`
 * where the mark is the ONLY thing naming the product — a bare nav lockup.
 */

export type SkeneMarkTone = 'block' | 'onDark' | 'onLight'

const MARK_URL: Record<SkeneMarkTone, string> = {
  block: new URL('../../assets/skene-symbol-block.svg', import.meta.url).href,
  onDark: new URL('../../assets/skene-symbol-on-dark.svg', import.meta.url).href,
  onLight: new URL('../../assets/skene-symbol-on-light.svg', import.meta.url).href,
}

export interface SkeneMarkProps {
  /** Which file. Names the ground, not the ink — see the file header. */
  tone?: SkeneMarkTone
  /** Rendered size in px, square. */
  size?: number
  /**
   * Corner radius in px, applied only to `block` — the other two have no fill to
   * round. Defaults to a rounded square rather than a circle: the artwork is a
   * square tile and a circle crops its corners.
   */
  radius?: number
  /** Announce it. Leave unset where the word "Skene" is already next to it. */
  alt?: string
  className?: string
}

export function SkeneMark({ tone = 'block', size = 28, radius = 8, alt, className }: SkeneMarkProps) {
  return (
    <img
      src={MARK_URL[tone]}
      width={size}
      height={size}
      alt={alt ?? ''}
      aria-hidden={alt ? undefined : true}
      className={cn('inline-block shrink-0 select-none', className)}
      style={{
        width: size,
        height: size,
        borderRadius: tone === 'block' ? radius : undefined,
      }}
    />
  )
}

/**
 * The horizontal lockup: the symbol and the wordmark, set as one object.
 *
 * A separate component from `SkeneMark` rather than a `variant` on it, because
 * the two have different geometry and different rules. The mark is square and
 * sized by one number; the lockup is 1016×260 and has to be sized by HEIGHT or
 * it stops being a lockup. A component that took `size` and silently meant
 * "width" in one mode and "height" in the other is a component that ships at
 * the wrong scale in whichever mode the caller thought about less.
 *
 * ## Three tones, and only one of them is an ink choice
 *
 *   onDark    white symbol, white wordmark. The default.
 *   onLight   black throughout, derived from the white file by swapping its 61
 *             fills. There was no black lockup in the brand folder — only the
 *             1800×1800 square variants — and a wordmark nobody can put on a
 *             cream band is a wordmark that gets re-drawn locally.
 *   accent    PEACH symbol, white wordmark. Dark grounds only, and the one tone
 *             that is not named after its ground: it is the marketing site's
 *             nav and footer treatment, where the peach symbol is the accent
 *             against otherwise white type. On a light ground its wordmark
 *             disappears, which is the whole reason the name says accent and
 *             not onLight.
 *
 * The marketing site's `public/img/skene-logo.svg` and `skene-logo-accent.svg`
 * are byte-identical to `onDark` and `accent`. They shipped there first; this
 * is the same artwork, moved to the place that can hand it to both surfaces.
 */

export type SkeneLockupTone = 'onDark' | 'onLight' | 'accent'

const LOCKUP_URL: Record<SkeneLockupTone, string> = {
  onDark: new URL('../../assets/skene-lockup-on-dark.svg', import.meta.url).href,
  onLight: new URL('../../assets/skene-lockup-on-light.svg', import.meta.url).href,
  accent: new URL('../../assets/skene-lockup-accent.svg', import.meta.url).href,
}

/** The artwork's own aspect, so `height` is the only number a caller passes. */
const LOCKUP_RATIO = 1016 / 260

export interface SkeneLockupProps {
  tone?: SkeneLockupTone
  /** Rendered height in px. Width follows the artwork's aspect. */
  height?: number
  /**
   * Announce it. Unlike the mark, the lockup usually IS the only thing naming
   * the product — a nav bar has no "Skene" beside it — so this defaults to
   * "Skene" rather than to empty. Pass `alt=""` where a heading already says it.
   */
  alt?: string
  className?: string
}

export function SkeneLockup({
  tone = 'onDark',
  height = 26,
  alt = 'Skene',
  className,
}: SkeneLockupProps) {
  return (
    <img
      src={LOCKUP_URL[tone]}
      width={Math.round(height * LOCKUP_RATIO)}
      height={height}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      className={cn('inline-block shrink-0 select-none', className)}
      style={{ height, width: 'auto' }}
    />
  )
}
