import { cn } from '../lib/utils.js'

/**
 * The page furniture that makes a marketing surface read as Skene: the floating
 * pill nav, the eyebrow chip, the numbered step, the display heading.
 *
 * Each of these is on the live site and was previously reproducible only by
 * copying markup out of skene-marketing-website.
 */

export { PillNav, PillNavLink, type PillNavProps } from './pill-nav.js'

export interface EyebrowProps {
  className?: string
  children: React.ReactNode
}

/**
 * The bordered chip above a page heading ("HOW IT WORKS").
 *
 * Uses `font.tracking.eyebrow` (0.16em) and `font.size.pill`, which existed as
 * tokens with nothing rendering them.
 */
export function Eyebrow({ className, children }: EyebrowProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-sm border px-2 py-1 font-mono uppercase',
        'border-chrome-surface-border text-chrome-text-muted',
        className,
      )}
      style={{
        fontSize: 'var(--font-size-pill)',
        letterSpacing: 'var(--font-tracking-eyebrow)',
      }}
    >
      {children}
    </span>
  )
}

export interface DisplayHeadingProps {
  /** `hero` is the homepage size, `page` a subpage h1, `section` a section head. */
  size?: 'hero' | 'page' | 'section'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  children: React.ReactNode
}

const DISPLAY_SIZE = {
  hero: 'var(--font-size-marketing-hero)',
  page: 'var(--font-size-marketing-xxl)',
  section: 'var(--font-size-marketing-xl)',
} as const

/**
 * Marketing display type.
 *
 * The package's other scale is the dashboard's, which is UI-density-first and
 * stops at 52px; the live homepage h1 measures 67px. These sizes step down at
 * narrow widths via the media queries in styles/effects.css.
 *
 * Weight is 400 deliberately. Skene's display type is large and light, not
 * bold, which is most of why it reads the way it does.
 */
export function DisplayHeading({
  size = 'page',
  as: Tag = 'h1',
  className,
  children,
}: DisplayHeadingProps) {
  return (
    <Tag
      className={cn('font-normal text-chrome-text-primary', className)}
      style={{ fontSize: DISPLAY_SIZE[size], lineHeight: 'var(--font-line-height-tight)' }}
    >
      {children}
    </Tag>
  )
}

/** Peach emphasis inside a display heading. Flat colour, as the live site uses. */
export function Accent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn('text-brand-peach', className)}>{children}</span>
}

export interface NumberedStepProps {
  /** Rendered as given, so "01" keeps its leading zero. */
  n: string
  title: React.ReactNode
  /**
   * Set this on a cream ground — inside `LightSectionCard`, or any surface
   * carrying the `light` class. The default uses `chrome.text.*`, which is
   * invariant dark-mode type: correct on a dark band, and INVISIBLE on cream,
   * because `chrome.text.primary` and `LightSectionCard`'s fill are the same
   * `#faf1e9`. Same spelling and same default as `CheckList`'s.
   */
  onLight?: boolean
  /**
   * Weight of the body copy under the heading. `muted` is the default and is
   * right on a flat band.
   *
   * Use `primary` when the step sits ON MEDIA. Measured against the palest
   * pixel of a dithered field: the muted role needs a 0.88 black scrim to clear
   * 4.5:1, which is a wash opaque enough that the image it covers stops being
   * an image. The primary role clears at 0.50 and sits at 5.72:1 under 0.58,
   * where the field still reads. So a step over a photograph is not a scrim
   * problem, it is a role problem, and no amount of darkening fixes the wrong
   * role.
   */
  bodyTone?: 'muted' | 'primary'
  /**
   * The title's heading level. `h3` is the default and what
   * `/product/how-it-works` renders below its band heading: a stack of steps
   * sitting under the section's own `<h2>`.
   *
   * A band whose steps ARE the section has no `<h2>` above them, so an `h3`
   * there skips a level straight from the page `<h1>` — invisible on screen,
   * plainly wrong to anything reading the outline, and measured by skene-site
   * as the only heading-level skip across its 24 routes.
   *
   * Spelled and defaulted like `FeatureRow`'s, because three components
   * answering the same question should not answer it three ways. Not derived
   * from any other prop: a rule that guesses is a rule nobody can override when
   * it guesses wrong.
   */
  titleAs?: 'h2' | 'h3'
  className?: string
  children?: React.ReactNode
}

/**
 * A numbered step: peach mono numeral beside a heading, body copy beneath.
 *
 * The backbone of /product/how-it-works and the pattern most likely to be
 * hand-rolled differently on each new page.
 */
/**
 * `onLight`, and why a documented workaround was not good enough.
 *
 * `chrome.text.primary` is `#faf1e9` — invariant by design, because chrome is
 * always dark. Put a `NumberedStep` inside `LightSectionCard`, whose fill is
 * also `#faf1e9`, and the heading is not dim: it is ABSENT. Nothing catches it.
 * The contrast gate scores token pairs, not compositions; the visual suite had
 * no case for that pairing; typecheck and lint cannot see a colour.
 *
 * 0.9.x documented the escape — `[&_h3]:text-text-primary [&>div]:text-text-muted`
 * — and shipped a gallery case using it. skene-site pushed back and was right:
 * a caller has to already know these roles are invariant in order to know the
 * override is needed, and the failure mode is invisible type rather than an
 * error. Documentation only helps the reader who already suspects the problem.
 *
 * So it is a prop, matching `CheckList`'s spelling exactly, because two
 * components asking the same question should not ask it two ways. Defaults to
 * `false`, which is the dark-band behaviour every current caller renders, so
 * nothing rebaselines.
 */
export function NumberedStep({
  n,
  title,
  onLight = false,
  bodyTone = 'muted',
  titleAs = 'h3',
  className,
  children,
}: NumberedStepProps) {
  const Title = titleAs
  return (
    <div className={cn('grid grid-cols-[auto_1fr] gap-x-4 gap-y-2', className)}>
      <span
        aria-hidden="true"
        className="font-mono text-brand-peach"
        style={{ fontSize: 'var(--font-size-card-title)' }}
      >
        {n}
      </span>
      <Title
        className={onLight ? 'text-text-primary' : 'text-chrome-text-primary'}
        style={{ fontSize: 'var(--font-size-marketing-xl)' }}
      >
        {title}
      </Title>
      {children ? (
        <div
          className={cn(
            'col-start-2 max-w-2xl text-[14px] leading-relaxed',
            onLight
              ? bodyTone === 'primary'
                ? 'text-text-primary'
                : 'text-text-muted'
              : bodyTone === 'primary'
                ? 'text-chrome-text-primary'
                : 'text-chrome-text-muted',
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export interface SplitAuthLayoutProps {
  /** The form column. Dark, narrow, centred. */
  form: React.ReactNode
  /** The showcase column. Textured, light, product imagery. */
  showcase: React.ReactNode
  /** Small reassurance row under the form ("Secure sign in", "Magic link auth"). */
  meta?: React.ReactNode
  className?: string
}

/**
 * The auth split: dark form on the left, textured showcase on the right.
 *
 * Worth having here specifically because /login and /signup are served by a
 * *third* repo at the same origin (see DECISIONS.md D3 in the marketing site),
 * so this layout currently exists somewhere neither app can see. Collapses to a
 * single column below `lg`, where the showcase is dropped rather than stacked.
 */
export function SplitAuthLayout({ form, showcase, meta, className }: SplitAuthLayoutProps) {
  return (
    <div className={cn('grid min-h-screen gap-4 p-4 lg:grid-cols-2', className)}>
      <div className="relative flex flex-col justify-center px-6">
        <div className="mx-auto w-full max-w-sm">{form}</div>
        {meta ? (
          <div className="mx-auto mt-10 flex w-full max-w-sm flex-wrap gap-4 text-[11px] text-chrome-text-muted">
            {meta}
          </div>
        ) : null}
      </div>
      <div className="relative hidden overflow-hidden rounded-xl lg:block">{showcase}</div>
    </div>
  )
}
