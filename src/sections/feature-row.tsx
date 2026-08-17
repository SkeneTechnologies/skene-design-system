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
  /**
   * Never: one column at every width, copy above the visual, inside the same
   * card. `reverse` is inert here — there is no second track to move to.
   *
   * This is the shape for a visual too wide to live in a half track at any
   * viewport, which is a real category rather than an escape hatch. Measured on
   * the second adopter: a five-stage LifecycleCanvas wants 998px, a FlowDiagram
   * 812px, a four-column evaluator table about 1000px. The widest split this
   * component offers hands the visual roughly 640-700px, so those clip at every
   * breakpoint — and they clip silently, because the panels scroll horizontally
   * inside `overflow-hidden` chrome with an overlay scrollbar. Nothing
   * announces it; a column simply ends mid-word.
   *
   * Empty strings and not an omitted key, so `SPLIT[splitAt]` stays total and
   * the render path needs no branch.
   */
  never: {
    grid: '',
    gridReverse: '',
    copyReverse: '',
    visualReverse: '',
  },
} as const

export type FeatureRowSplit = keyof typeof SPLIT

export interface FeatureRowProps {
  /** Mirrors the layout. Set it explicitly per row; don't derive it from index. */
  reverse?: boolean
  /** Monospace marker in the corner, e.g. "01". */
  n?: React.ReactNode
  /**
   * A label above the title, inside the copy column. Pass an `<Eyebrow>`.
   *
   * The homepage stack does not need one — three rows share a single eyebrow
   * and heading above the whole stack. Every other adopter is a lone row
   * standing in for a whole section, where the eyebrow is that section's own
   * and belongs with the heading it labels. Putting it above the card instead
   * splits the head across the card's edge.
   *
   * A slot rather than a string so this component does not have to import
   * `Eyebrow`, and so a caller can pass a link or a chip in its place.
   */
  eyebrow?: React.ReactNode
  icon?: React.ReactNode
  /**
   * Optional, because a row is sometimes only its visual.
   *
   * It was required, and the second adopter has four sections carrying an
   * eyebrow and no heading and one carrying no text at all. Supplying a string
   * to satisfy the type would mean writing marketing copy to satisfy a
   * component, which is the tail wagging the dog and, in that repository,
   * against its own rules. With no title the heading element is not rendered at
   * all rather than rendered empty: an empty `h2` is a heading to every outline
   * reader and to nothing else.
   */
  title?: React.ReactNode
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
  /**
   * The title's heading level. `h3` is the default and what the homepage
   * renders: three rows sitting under the band's own `<h2>`.
   *
   * A lone row IS the section, so its title is that section's `<h2>` under the
   * page `<h1>`, and leaving it an `h3` skips a level — invisible on screen,
   * plainly wrong to anything reading the outline. Not derived from whether
   * `eyebrow` is set, because the two answer different questions and a rule
   * that guesses is a rule nobody can override when it guesses wrong.
   */
  titleAs?: 'h2' | 'h3'
  /**
   * Which type scale the title takes.
   *
   * `row` is `clamp(1.75rem, 2.4vw, 2.55rem)` — fluid, 28px to 40.8px — and is
   * what the homepage renders: three rows under one band heading, where the row
   * title is the largest thing in its own card and wants to breathe with the
   * viewport.
   *
   * `section` is a flat 32px, `--font-size-marketing-xl`, which is what
   * `DisplayHeading size="section"` emits. Use it when the row IS a section, so
   * its title sits at the same size as every other section heading on the page.
   *
   * THE DEFECT THIS CLOSES IS NOT A CONSTANT OFFSET. The two scales cross at a
   * 1333px viewport: above it the card heading is larger than its siblings,
   * below it smaller, and at 1024 it is 28px against their 32. Ten of the
   * nineteen adopting routes render both on one page, and `/product/how-it-works`
   * renders only the card scale — internally consistent and inconsistent with
   * the other eighteen. Measuring at one width makes this look like 2.56px of
   * nothing; measuring across the breakpoint is what shows it inverting.
   *
   * `cell` is the third, added in 0.9.20 when `render_marketing_cards_as_feature_row`
   * made this component the grid cell too. A cell is not a band: skene-site's
   * cards carried `--font-size-card-title` (20px) and taking `row` would have
   * rendered them at 28-40.8px, so `/resources/glossary`'s eighteen terms would
   * each have had a heading larger than the section heading above them. The
   * token is the one those cards already used, so this is adopting a value
   * rather than inventing one.
   *
   * Default `row`, so no existing caller moves.
   */
  titleScale?: 'row' | 'section' | 'cell'
  className?: string
}

export function FeatureRow({
  reverse = false,
  n,
  eyebrow,
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
  titleAs = 'h3',
  titleScale = 'row',
  className,
}: FeatureRowProps) {
  const Title = titleAs
  // Whole class strings, never interpolated — Tailwind scans source text.
  // A lookup and not a ternary chain, so a fourth scale is one line and cannot
  // be added by nesting. Whole class strings, never interpolated.
  const TITLE_SIZE = {
    section: 'text-[length:var(--font-size-marketing-xl)]',
    cell: 'text-[length:var(--font-size-card-title)]',
    row: 'text-[clamp(1.75rem,2.4vw,2.55rem)]',
  }[titleScale]
  /*
    A row with nothing to show. See
    `documentation/20260817_feature_row_copy_only.md`.

    Derived rather than a prop, because there is exactly one sensible rendering
    for a row with no visual and no texture, so there is no decision left for a
    caller to make. This is the opposite call from `PlanCard`'s `featured`,
    which bundles three independent decisions behind one boolean; this bundles
    none.

    Three things follow, and each is the absence of something that only earns
    its place when a panel exists: no second cell (not an empty one), no
    `min-h-[600px]`, and no split grid class. The floor is the one worth
    spelling out — it exists to stop a product panel being cropped by a short
    copy column, and with no panel it produces exactly the dead air it was
    added to prevent.

    `splitAt` and `reverse` go inert here rather than erroring, so a consumer
    migrating a mixed set of bands does not have to strip props per band.

    Every one of the 29 live cards in skene-site passes a `visual`, so this is
    false for all of them and none of their markup moves.
  */
  const copyOnly = !visual && !texture && !textureSrc
  return (
    <div
      className={cn(
        'grid overflow-hidden rounded-2xl border border-chrome-line-subtle bg-chrome-surface-1',
        !copyOnly && 'min-h-[600px]',
        !copyOnly && (reverse ? SPLIT[splitAt].gridReverse : SPLIT[splitAt].grid),
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
        {/* 24px, the gap every eyebrow on a Skene page takes, and on the block
            BELOW it in every other component here. It is a wrapper and not a
            margin on the slot because `Eyebrow` is `inline-block`: its own
            bottom margin does not collapse, which is the defect that put one
            shipped page's section heads at 48px while its siblings sat at 24. */}
        {eyebrow ? <div className="mb-[24px]">{eyebrow}</div> : null}
        {title ? (
          <Title
            className={cn(
              'mb-4 max-w-[420px] leading-tight text-chrome-text-primary',
              TITLE_SIZE,
            )}
          >
            {title}
          </Title>
        ) : null}
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

      {copyOnly ? null : (
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
            // 34px when the card is SPLIT, 16px when it is stacked.
            //
            // The inset exists to separate the visual from the copy column beside
            // it. Under `splitAt="never"` there is no column beside it — the copy
            // is above — so 34px a side is 68px spent on nothing, and it is spent
            // on exactly the artifacts that chose `never` because they were too
            // wide to sit beside anything.
            //
            // Measured on the widest one, a five-stage `LifecycleCanvas` at 1440:
            // the card hands the artifact 1092px and the scrolling strip ends up
            // with 946 against the 998 it needs. The 146px between them is this
            // 68px plus `ArtFrame`'s 96 and `AppPanel`'s 48. Those two are the
            // artifact's own material and its app chrome; this one is layout for
            // an arrangement that is not in use. Reclaiming it is the only 36px
            // available without touching what the artifact IS.
            //
            // Not zero: the visual still needs to read as sitting ON the card
            // rather than as the card's own edge, and 16px is the smallest gap
            // that survives the 24px radius without the corner clipping the frame.
            <div
              className={cn(
                'grid w-full place-items-center',
                splitAt === 'never' ? 'p-[16px]' : 'p-[34px]',
              )}
            >
              {visual}
            </div>
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
      )}
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
