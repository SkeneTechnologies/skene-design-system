import { cn } from '../lib/utils.js'
import { SectionBackdrop, type BackdropTexture } from './section-backdrop.js'

/**
 * The alternating feature row: copy on one side, a visual on the other, flipping
 * every other row.
 *
 * The flip is `reverse` rather than an index, because a stack that computes it
 * from position breaks the moment a row is inserted or reordered — and these
 * rows are content, so they get reordered.
 *
 * `accent.violet` and `accent.blue` exist for the icon here. Three rows need
 * telling apart at a glance and the package had nothing close: the nearest
 * `neon.*` category colour is ΔE 24+, far too saturated against a 16px stroke.
 */

export type FeatureAccent = 'peach' | 'violet' | 'blue'

const ACCENT_VAR: Record<FeatureAccent, string> = {
  peach: 'var(--color-brand-peach)',
  violet: 'var(--color-accent-violet)',
  blue: 'var(--color-accent-blue)',
}

export interface FeatureIconProps {
  accent?: FeatureAccent
  className?: string
  children: React.ReactNode
}

/**
 * The ringed icon. The inset shadow is a soft fill rather than a border so the
 * ring reads as lit from inside — a plain background makes it a button.
 */
export function FeatureIcon({ accent = 'peach', className, children }: FeatureIconProps) {
  const c = ACCENT_VAR[accent]
  return (
    <span
      className={cn('grid size-11 place-items-center rounded-full border', className)}
      style={{
        borderColor: `color-mix(in oklab, ${c} 47%, transparent)`,
        color: c,
        boxShadow: `inset 0 0 0 7px color-mix(in oklab, ${c} 6%, transparent)`,
      }}
    >
      {children}
    </span>
  )
}

/**
 * The breakpoint at which the band splits into two columns.
 *
 * `md` was hardcoded, and it is wrong for a band whose visual is a table that
 * scrolls: skene-site's drift table needs 480px and had 291px of scroller at
 * 900 and 216px at 768. They overrode it and hit the trap this table exists to
 * remove — only a later NAMED breakpoint outranks a `md:` utility. Both
 * arbitrary forms sort EARLIER in the emitted stylesheet, so `min-[1200px]`
 * lost above 1200 and `max-[1199px]` lost below it, each attempt leaving the
 * measurement byte-identical at 422px. That reads as "the override did nothing"
 * rather than "the override was outranked", and it cost them a debugging round
 * before they settled for `xl` when the band wanted 1200.
 *
 * Whole class strings, not interpolation: Tailwind scans source text, so
 * `${bp}:grid-cols-…` generates nothing at all.
 */
const SPLIT = {
  md: {
    grid: 'md:grid-cols-[0.9fr_1.1fr]',
    gridReverse: 'md:grid-cols-[1.1fr_0.9fr]',
    copyReverse: 'md:col-start-2 md:row-start-1',
    visualReverse: 'md:col-start-1 md:row-start-1',
  },
  lg: {
    grid: 'lg:grid-cols-[0.9fr_1.1fr]',
    gridReverse: 'lg:grid-cols-[1.1fr_0.9fr]',
    copyReverse: 'lg:col-start-2 lg:row-start-1',
    visualReverse: 'lg:col-start-1 lg:row-start-1',
  },
  xl: {
    grid: 'xl:grid-cols-[0.9fr_1.1fr]',
    gridReverse: 'xl:grid-cols-[1.1fr_0.9fr]',
    copyReverse: 'xl:col-start-2 xl:row-start-1',
    visualReverse: 'xl:col-start-1 xl:row-start-1',
  },
} as const

export type FeatureRowSplit = keyof typeof SPLIT

export interface FeatureRowProps {
  /** Mirrors the layout. Set it explicitly per row; don't derive it from index. */
  reverse?: boolean
  /** Monospace marker in the corner, e.g. "01". */
  n?: React.ReactNode
  icon?: React.ReactNode
  title: React.ReactNode
  /**
   * The italic line under the title. On the live cards this is the promise
   * ("Connect once. Skene adds the tracking you're missing") and the checklist
   * below it is the proof — different jobs, so it is its own slot rather than
   * the first paragraph of `children`.
   *
   * Named `lede` to match `LightSectionCard`: the two components split the same
   * promise/proof pair, and one concept under two names is drift that gets
   * copied.
   */
  lede?: React.ReactNode
  /** Body copy — usually a `<CheckList>`. */
  children?: React.ReactNode
  /** Pinned to the bottom of the copy column, so rows of differing height align. */
  actions?: React.ReactNode
  /** The right-hand panel — a ProductWindow, an image, anything. */
  visual?: React.ReactNode
  /** Halftone field behind the visual. Omit for a plain panel. */
  texture?: BackdropTexture
  /** Explicit texture URL, overriding `texture`. */
  textureSrc?: string
  /**
   * The 10% white gloss over the visual panel. On by default, which is what
   * every current caller renders.
   *
   * Turn it OFF when the panel carries type on a tint. It is 10% white over
   * whatever you put there, and that is enough to take a label under the WCAG
   * floor: measured at 3.801:1 / 3.896 / 4.230 across three viewports with it
   * on, against 4.510 with it off. See the comment at the sheen itself.
   */
  sheen?: boolean
  /**
   * Where the band splits into two columns. `md` (768) is the default and what
   * every current caller renders. Raise it when the visual is a table or any
   * panel that needs real width before the split is an improvement — below its
   * breakpoint the band is a single stacked column.
   *
   * A named breakpoint rather than a number, deliberately: an arbitrary variant
   * like `min-[1200px]` sorts EARLIER than `md:` in the emitted stylesheet and
   * silently loses to it. See the comment on the SPLIT table.
   */
  splitAt?: FeatureRowSplit
  className?: string
}

export function FeatureRow({
  reverse = false,
  n,
  icon,
  title,
  lede,
  children,
  actions,
  visual,
  texture,
  textureSrc,
  sheen = true,
  splitAt = 'md',
  className,
}: FeatureRowProps) {
  return (
    <div
      className={cn(
        'grid min-h-[600px] overflow-hidden rounded-2xl border border-chrome-line-subtle bg-chrome-surface-1',
        reverse ? SPLIT[splitAt].gridReverse : SPLIT[splitAt].grid,
        className,
      )}
    >
      <div
        className={cn(
          'relative flex flex-col items-start px-12 pb-[46px] pt-[50px]',
          reverse && SPLIT[splitAt].copyReverse,
        )}
      >
        {n ? (
          <span className="absolute right-6 top-[22px] font-mono text-[11px] text-chrome-text-muted-warm">
            {n}
          </span>
        ) : null}
        {icon ? <div className="mb-[54px]">{icon}</div> : null}
        <h3 className="mb-4 max-w-[420px] text-[clamp(1.75rem,2.4vw,2.55rem)] leading-tight text-chrome-text-primary">
          {title}
        </h3>
        {lede ? (
          <p className="mb-6 max-w-[470px] text-[14px] italic text-chrome-text-muted-warm">
            {lede}
          </p>
        ) : null}
        {children ? (
          // Full-width, not max-w: a CheckList's rules run the width of the
          // column on the live cards, and constraining them to the prose measure
          // leaves the rules stopping short of the text they separate.
          <div className="mb-[26px] w-full text-chrome-text-muted-warm">{children}</div>
        ) : null}
        {actions ? <div className="mt-auto">{actions}</div> : null}
      </div>

      <div
        className={cn(
          'relative grid min-w-0 place-items-center',
          reverse && SPLIT[splitAt].visualReverse,
        )}
      >
        {texture || textureSrc ? (
          // The field fills the cell and the mock floats on it — SectionBackdrop
          // owns the inset, because it has to be a percentage of the track and
          // this component does not know how wide that is.
          <SectionBackdrop texture={texture} src={textureSrc} className="h-full w-full">
            {visual}
          </SectionBackdrop>
        ) : (
          <div className="grid w-full place-items-center p-[34px]">{visual}</div>
        )}
        {/*
          The sheen. Sits above the visual but must never eat its clicks.

          Switchable because it is 10% white over WHATEVER the caller put in the
          visual panel, and 10% white is enough to take a label under the WCAG
          floor. skene-site measured its `PrReview` "changes requested" pill at
          3.801:1 at 390, 3.896 at 768 and 4.230 at 1440 with the sheen on,
          against 4.510 with it suppressed — sixteen below-floor readings created
          by adopting this component and nothing else, with a clean control on
          two routes that had not adopted it. Their workaround was
          `[&>div>span[aria-hidden]]:opacity-0`, child-scoped because a bare
          `span[aria-hidden]` matches seven to eleven nodes inside `PrReview`.
          A caller should not have to reach into this component's DOM to turn
          off a decoration.
        */}
        {sheen ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.10), transparent 60%)',
            }}
          />
        ) : null}
      </div>
    </div>
  )
}

/** Vertical stack of rows at the section's rhythm. */
export function FeatureStack({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('grid gap-6', className)}>{children}</div>
}
