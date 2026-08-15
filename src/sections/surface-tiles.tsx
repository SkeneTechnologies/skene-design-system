import { cn } from '../lib/utils.js'

/**
 * The surfaces Skene runs on, as a row of tiles — and the panel that explains
 * whichever one is chosen.
 *
 * The band this belongs to already ships: `LightSectionCard` is the cream card
 * with the heading on one side and a visual slot on the other. What did not ship
 * is what goes IN that slot on the "four ways to plug Skene in" section — four
 * tiles floating on a dithered field, one of them picked out in cream, and a
 * detail panel under them.
 *
 * ## Not `OverviewTiles`
 *
 * Checked first, and it is a different object. An overview tile is a caption, a
 * NUMBER, and what the number is made of; it exists so four counts read as
 * commensurable. These tiles carry an icon, a name and a qualifying line, and
 * exactly one of them is selected. Adding a `selected` state to `OverviewTiles`
 * would mean a metric tile can be "chosen", which is meaningless.
 *
 * ## `selected` carries `light`, and that is the whole mechanism
 *
 * Three tiles are near-black and the chosen one is cream. On a cream tile every
 * mode-aware token must resolve to its LIGHT value, so the tile puts the `light`
 * class on itself — the same load-bearing class as `ProductWindow tone="light"`
 * and the featured `PlanCard`. Without it `text.primary` is #faf1e9 on a #faf1e9
 * fill, which shipped invisible twice in this package already.
 *
 * The unselected tiles paint their own near-black ground, so they take the
 * invariant `chrome.*` roles legitimately — an invariant token is only wrong
 * where the surface under it can flip.
 *
 * ## Selection is presentational here
 *
 * `selected` is a prop, not internal state, and no tile knows about its
 * siblings. The band that uses this is a marketing section whose "selected" tile
 * is an editorial choice, not a control; wiring `onSelect` in would make every
 * static instance carry dead interactivity, and a caller who wants a real picker
 * owns the state and passes the flag.
 *
 * ## `SurfaceDetail` is a sibling, not a child
 *
 * It sits UNDER the row and describes the selected tile. Nesting it inside the
 * tile would force the row to own selection state to know where to render it,
 * and would break the layout the moment the selected tile is not the last one.
 */

/** Icon tints. Same three names `FeatureIcon` uses, plus the neutral one these need. */
export type SurfaceAccent = 'peach' | 'violet' | 'blue' | 'neutral'

const ACCENT_VAR: Record<SurfaceAccent, string> = {
  peach: 'var(--color-brand-peach)',
  violet: 'var(--color-accent-violet)',
  blue: 'var(--color-accent-blue)',
  // Resolved per tile below, not here — see `neutralFor`.
  neutral: '',
}

/**
 * `neutral` is the tile's own type colour, and which token that is depends on
 * the tile rather than on the page.
 *
 * `currentColor` was the obvious answer and is wrong: an unselected tile paints
 * an invariant near-black fill, but `color` on it is inherited from whatever
 * encloses it. In the app's LIGHT mode that inherited colour is near-black too,
 * so the glyph rendered black on black and the GitHub tile lost its icon while
 * the other three — which pass a real accent — looked fine.
 */
const neutralFor = (selected?: boolean) =>
  selected ? 'var(--color-text-primary)' : 'var(--color-chrome-text-primary)'

export interface SurfaceTilesProps {
  /** `SurfaceTile`s. Four is the shipped shape; the grid wraps at any count. */
  children: React.ReactNode
  className?: string
}

export function SurfaceTiles({ children, className }: SurfaceTilesProps) {
  return (
    <div
      className={cn(
        // auto-fit rather than a fixed four columns: this row renders inside a
        // visual slot whose width is the caller's, and four fixed columns
        // overflow it at tablet width. The floor is the width at which a
        // two-word name still fits on one line.
        'grid grid-cols-[repeat(auto-fit,minmax(112px,1fr))] gap-2.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface SurfaceTileProps {
  /** The glyph, in its tinted square. A 16px lucide icon fits. */
  icon?: React.ReactNode
  /** Tint for the icon square. */
  accent?: SurfaceAccent
  /** What the surface is called — "MCP server". */
  name: React.ReactNode
  /** The qualifier under it — "Runs on every PR". */
  note?: React.ReactNode
  /** The cream one. See the file header: this flips the whole tile's token mode. */
  selected?: boolean
  className?: string
}

export function SurfaceTile({
  icon,
  accent = 'neutral',
  name,
  note,
  selected,
  className,
}: SurfaceTileProps) {
  const tint = accent === 'neutral' ? neutralFor(selected) : ACCENT_VAR[accent]

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-3 rounded-2xl border p-3.5',
        selected
          ? 'light border-chrome-line-on-light bg-brand-light'
          : 'border-chrome-line-subtle bg-chrome-surface-1',
        className,
      )}
    >
      {icon ? (
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-lg"
          style={{
            color: tint,
            background: `color-mix(in oklab, ${tint} 16%, transparent)`,
          }}
        >
          {icon}
        </span>
      ) : null}

      <div className="min-w-0">
        <p
          className={cn(
            'text-[14px] font-medium leading-snug wrap-anywhere',
            selected ? 'text-text-primary' : 'text-chrome-text-primary',
          )}
        >
          {name}
        </p>
        {note ? (
          <p
            className={cn(
              'mt-1 text-[12px] leading-snug',
              selected ? 'text-text-muted' : 'text-chrome-text-muted',
            )}
          >
            {note}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export interface SurfaceDetailProps {
  /** Which tile this is about, as a small pill — "Repo audit". */
  tag?: React.ReactNode
  /** What that surface does. One or two sentences. */
  children: React.ReactNode
  /** The command, if the surface has one. Rendered as a mono chip, not a terminal. */
  code?: React.ReactNode
  className?: string
}

export function SurfaceDetail({ tag, children, code, className }: SurfaceDetailProps) {
  return (
    <div
      className={cn(
        // `light` for the same reason the selected tile carries it: this panel is
        // a translucent cream over whatever the field behind it is.
        'light flex flex-wrap items-start gap-x-4 gap-y-2.5 rounded-2xl border border-chrome-line-on-light p-3.5',
        className,
      )}
      style={{
        // Translucent rather than solid: the dithered field behind it is the
        // reason this panel is on a photo at all, and a solid fill would punch
        // a rectangle out of it.
        background: 'color-mix(in oklab, var(--color-brand-light) 82%, transparent)',
      }}
    >
      {tag ? (
        <span
          className="rounded-full px-2.5 py-1 text-[12px] leading-none text-text-primary"
          style={{ background: 'color-mix(in oklab, var(--color-brand-peach) 30%, transparent)' }}
        >
          {tag}
        </span>
      ) : null}

      <div className="min-w-[12rem] flex-1">
        <p className="text-[13px] leading-relaxed text-text-muted-strong">{children}</p>
        {code ? (
          <code className="mt-2.5 inline-block rounded-md border border-chrome-line-on-light bg-brand-light px-2.5 py-1.5 font-mono text-[12px] text-text-primary">
            {code}
          </code>
        ) : null}
      </div>
    </div>
  )
}
