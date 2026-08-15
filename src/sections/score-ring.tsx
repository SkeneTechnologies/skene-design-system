import { STATUS_TOKEN, type Status } from '../lib/status.js'
import { cn } from '../lib/utils.js'

/**
 * The audit score: a partial arc on a track, with the value inside it.
 *
 * It is the first thing a reader sees in the audit artifact, and it has one job
 * the number alone cannot do — say whether the number is a problem. "72" is
 * meaningless without a scale; the arc supplies the scale as geometry, so the
 * reader knows it is roughly three-quarters of the way round before reading a
 * digit.
 *
 * ## `status`, not a colour, and never peach
 *
 * A coverage score is a MEASURED state, so it binds the reserved vocabulary —
 * `good | warn | danger` to `semantic.matcha / warningAmber / errorRed` — the
 * same three `Finding` uses. The captured demo drew this ring in its own gold
 * accent, which this package does not carry as a status colour, and reaching for
 * `brand.peach` instead would be worse: peach is the primary ACTION colour, so a
 * peach fault reads as a call to action (ux-patterns 3).
 *
 * The default is `warn` rather than `good`, because the only place this shipped
 * reads "Coverage needs attention" at 72. A default of `good` would mean a
 * forgotten prop renders a failing score in the reassurance colour — the same
 * argument that keeps `StatChip` and `MetaChip` apart.
 *
 * ## Theme-aware, because it lives on a light panel
 *
 * The artifact it sits in is an `AppWindow`, which is light, but the same ring on
 * a dark marketing band is one prop away for a caller. So the digits take the
 * mode-aware `text.*` role and the track is mixed from `currentColor`, which
 * already follows a `light` ancestor — the trick `StatChip` uses to survive both
 * grounds without an `onLight` prop. The arc itself is a semantic token, and both
 * semantic values ship a light-surface variant.
 *
 * ## Why the arc is stroke-dash and not a conic gradient
 *
 * A conic gradient cannot round its own end caps, and the captured ring is round
 * on both ends. `strokeLinecap="round"` gets that for free, and a stroked circle
 * is also the only version that scales cleanly: everything here is in viewBox
 * units, so `size` moves one number.
 */

/** The reserved status vocabulary. Same three as `Finding`. */
export type ScoreRingStatus = Status

/** Geometry, in viewBox units. r is chosen so the stroke never clips the box. */
const R = 42
const CIRCUMFERENCE = 2 * Math.PI * R

export interface ScoreRingProps {
  /** The score. Clamped into `0..max`; a value outside that is a caller bug, not a design. */
  value: number
  /** The scale. 100 in every shipped instance, and shown as the denominator. */
  max?: number
  /** Measured state. See the file header for why this defaults to `warn`. */
  status?: ScoreRingStatus
  /**
   * Rendered diameter in px. The ring is the only thing that scales — the digits
   * are sized from it, so a caller cannot end up with 11px type inside a 120px ring.
   */
  size?: number
  /**
   * What the number MEANS, for assistive tech — "Coverage". The visible digits
   * are decorative duplicates of the label, which is why they are aria-hidden.
   */
  label: string
  className?: string
}

export function ScoreRing({
  value,
  max = 100,
  status = 'warn',
  size = 64,
  label,
  className,
}: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(max, value))
  const fraction = max === 0 ? 0 : clamped / max

  return (
    <div
      role="img"
      aria-label={`${label}: ${clamped} out of ${max}`}
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden focusable="false">
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          strokeWidth="8"
          // Mixed from currentColor so the track follows a `light` ancestor.
          // There is no mode-aware line token; `chrome.line.*` is one ground or
          // the other and would vanish on the one it was not made for.
          stroke="color-mix(in oklab, currentColor 14%, transparent)"
        />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={STATUS_TOKEN[status]}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        />
      </svg>

      <div
        aria-hidden
        // Stacked, not side by side. Set on one baseline — which is what the
        // first version did — "72 /100" is wider than the ring's inner
        // diameter at every size, and the denominator hangs over the arc.
        // Everything inside is em-based off this, so one `size` moves all of it.
        className="absolute inset-0 flex flex-col items-center justify-center leading-none"
        style={{ fontSize: size * 0.3 }}
      >
        <strong className="font-medium text-text-primary">{clamped}</strong>
        <span className="mt-[0.15em] font-mono text-[0.42em] text-text-muted">/{max}</span>
      </div>
    </div>
  )
}
