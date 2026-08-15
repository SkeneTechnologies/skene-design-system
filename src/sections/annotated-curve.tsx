import { cn } from '../lib/utils.js'

/**
 * The rising curve with monospace callouts pinned to points on it.
 *
 * Two layers, deliberately. The SVG draws the sweep and the node markers; the
 * callouts are plain HTML absolutely positioned over it. SVG `<text>` does not
 * wrap — every line break has to be authored as its own `<tspan>` at a
 * hand-chosen y — so a callout long enough to be a sentence either runs out of
 * the frame or gets re-broken by hand every time the copy changes. HTML text
 * wraps, selects, and finds. The curve is decoration and carries `aria-hidden`,
 * which leaves the annotations as the only thing in the accessibility tree, and
 * they are an ordered list because array order is the order they are read in —
 * absolute positioning moves them on screen, not in the DOM.
 *
 * The path is generated FROM the annotated points rather than authored beside
 * them. A hand-drawn path plus hand-placed dots drift apart the first time
 * either is edited; a Catmull-Rom spline passes exactly through every point it
 * is built from, so a node marker cannot end up floating off its own curve. It
 * can overshoot BETWEEN two points that are close in x and far apart in y —
 * that is the price of not shipping a control-point API, and the fix is to
 * spread the x values.
 *
 * A point with no `label` is an anchor: it shapes the sweep and renders
 * nothing. That is how the curve reaches the edges of the box without
 * extrapolating past the last node, because an invented tail is a tail the
 * author cannot see or steer.
 *
 * `aspect` is load-bearing, not a layout convenience. The viewBox height is
 * derived from it so the drawing scales uniformly. `preserveAspectRatio="none"`
 * would fit any box shape and is the obvious shortcut, but it scales x and y by
 * different factors and every node `<circle>` renders as an ellipse.
 *
 * `y` runs from the top, matching CSS `top` and SVG's own axis, so a rising
 * curve has DESCENDING y. One convention across both layers is what keeps a box
 * pinned to its node; two conventions is one sign error away from silently
 * mirroring the annotations against the curve.
 *
 * The boxes are opaque rather than tinted glass. They sit on points that are ON
 * the curve by construction, so the stroke always runs beneath them, and any
 * translucency puts a peach line through the middle of a monospace label. Their
 * surface and type use the mode-aware `surface.*` / `text.*` roles: this band
 * renders on light and dark grounds alike, and `chrome.*` is invariant — it
 * cannot invert, so it would render cream on cream. The flip side of being
 * mode-aware is that an always-dark band inside a light page has to carry
 * `dark`, the same rule `PlanCard featured` follows in the other direction.
 */

/** Curve colours, by token. A union rather than a free string so a hex literal
 *  cannot reach the stroke through the prop. */
export type CurveStrokeToken =
  | 'brand-peach'
  | 'brand-peach-deep'
  | 'accent-violet'
  | 'accent-blue'
  | 'semantic-matcha'

const STROKE_TOKEN: Record<CurveStrokeToken, string> = {
  'brand-peach': 'var(--color-brand-peach)',
  'brand-peach-deep': 'var(--color-brand-peach-deep)',
  'accent-violet': 'var(--color-accent-violet)',
  'accent-blue': 'var(--color-accent-blue)',
  'semantic-matcha': 'var(--color-semantic-matcha)',
}

/** Which side of its node the box sits on. Never centred on it — the box would
 *  cover the point it annotates. */
export type CurveLabelPlacement = 'above' | 'below' | 'left' | 'right'

/** Horizontal anchoring for `above` / `below`: which edge of the box lines up
 *  with the node. The escape hatch for a node near the frame edge, where a
 *  centred box would hang outside it. */
export type CurveLabelAlign = 'start' | 'center' | 'end'

export interface CurvePoint {
  /** 0-100 across the box, left to right. */
  x: number
  /** 0-100 down the box. 0 is the TOP, so a rising curve descends in y. */
  y: number
  /** Omit to make this a shaping anchor: no marker, no box, no list entry. */
  label?: React.ReactNode
  /** Default `above`. */
  place?: CurveLabelPlacement
  /** Default `center`. Ignored for `left` / `right`. */
  align?: CurveLabelAlign
  /** Per-callout override, usually a width. */
  className?: string
}

export interface AnnotatedCurveProps {
  /** Drawn in array order — deliberately not sorted by x, so the reading order
   *  of the callouts and the direction of the sweep can never disagree. */
  points: CurvePoint[]
  /** Default `brand-peach`. */
  stroke?: CurveStrokeToken
  /** width ÷ height of the plotting box. Default 2. */
  aspect?: number
  /** Gap in px between a node and its box. Default 14. */
  offset?: number
  className?: string
}

const SMOOTHING = 0.85

const clamp = (v: number) => Math.max(0, Math.min(100, v))
const round = (v: number) => Math.round(v * 100) / 100

/**
 * Catmull-Rom through every point, converted to cubic béziers. The endpoints
 * are doubled rather than mirrored so the curve starts and ends flat instead of
 * kicking out at a tangent it was never given data for.
 */
function splinePath(pts: Array<{ x: number; y: number }>): string {
  if (pts.length < 2) return ''
  const at = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))] as { x: number; y: number }

  let d = `M ${round(at(0).x)} ${round(at(0).y)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    const c1x = p1.x + ((p2.x - p0.x) / 6) * SMOOTHING
    const c1y = p1.y + ((p2.y - p0.y) / 6) * SMOOTHING
    const c2x = p2.x - ((p3.x - p1.x) / 6) * SMOOTHING
    const c2y = p2.y - ((p3.y - p1.y) / 6) * SMOOTHING
    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2.x)} ${round(p2.y)}`
  }
  return d
}

function boxTransform(place: CurveLabelPlacement, align: CurveLabelAlign, offset: number): string {
  const x = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%'
  switch (place) {
    case 'below':
      return `translate(${x}, ${offset}px)`
    case 'left':
      return `translate(calc(-100% - ${offset}px), -50%)`
    case 'right':
      return `translate(${offset}px, -50%)`
    default:
      return `translate(${x}, calc(-100% - ${offset}px))`
  }
}

export function AnnotatedCurve({
  points,
  stroke = 'brand-peach',
  aspect = 2,
  offset = 14,
  className,
}: AnnotatedCurveProps) {
  const color = STROKE_TOKEN[stroke]
  // Derived from the stroke token, NOT from useId: this component is
  // server-renderable and a hook would drag a client boundary around it. Two
  // curves with the same stroke on one page emit the same id, which is safe
  // precisely because the definition is a pure function of that token — the
  // gradients are byte-identical, so whichever one wins is the right one.
  const gradientId = `skene-curve-${stroke}`
  // The viewBox is 100 wide and however tall `aspect` makes it, so a point's x
  // is already in user units and its y only has to be rescaled once.
  const height = 100 / (aspect > 0 ? aspect : 2)
  const plotted = points.map((p) => ({ x: clamp(p.x), y: (clamp(p.y) / 100) * height }))
  const d = splinePath(plotted)

  return (
    <div className={cn('relative w-full', className)} style={{ aspectRatio: `${aspect}` }}>
      <svg
        aria-hidden
        focusable="false"
        viewBox={`0 0 100 ${round(height)}`}
        preserveAspectRatio="xMidYMid meet"
        // overflow-visible: the halo on a node at x=0 would otherwise be sheared
        // in half by the viewport edge.
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          {/* The stroke fades into the ground at its tail. The live curve does
              this and the flat version read as a diagonal rule: with a constant
              weight the eye finds no direction, and the whole point of the
              figure is that the line is GOING somewhere. userSpaceOnUse rather
              than the default objectBoundingBox, because a spline's bounding
              box changes with the data and the fade would move with it. */}
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0" x2="100">
            <stop offset="0%" stopColor={color} stopOpacity={0.12} />
            <stop offset="55%" stopColor={color} stopOpacity={0.75} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
        </defs>
        {d ? (
          <path
            d={d}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            // Without this the line weight is multiplied by the container width,
            // so the same curve is a hairline on mobile and a rope on desktop.
            vectorEffect="non-scaling-stroke"
          />
        ) : null}
        {plotted.map((p, i) =>
          points[i]?.label == null ? null : (
            // A ring, not a filled disc with a halo. The node marks WHERE ON THE
            // LINE the callout is attached, and a filled dot of the same colour
            // as the line reads as a thickening of the line itself. A ring
            // punches the ground through the middle, so the marker and the path
            // stay legible as two different things — which is what the live
            // figure does.
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={1.6}
              fill="var(--color-surface-0)"
              stroke={color}
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          ),
        )}
      </svg>

      <ol className="absolute inset-0 m-0 list-none p-0">
        {points.map((p, i) =>
          p.label == null ? null : (
            <li
              key={i}
              className={cn(
                'absolute w-max max-w-[62%] rounded-2xl border border-surface-border bg-surface-1 px-3 py-2',
                'font-mono text-[11px] uppercase leading-[1.45] tracking-[0.04em] text-text-primary',
                p.className,
              )}
              style={{
                left: `${clamp(p.x)}%`,
                top: `${clamp(p.y)}%`,
                transform: boxTransform(p.place ?? 'above', p.align ?? 'center', offset),
              }}
            >
              {p.label}
            </li>
          ),
        )}
      </ol>
    </div>
  )
}
