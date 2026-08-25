import { cn } from '../lib/utils.js'

/**
 * The 10px monospace chip.
 *
 * It exists because two components arrived at it independently. `PlanCard` wrote
 * its tier marker as an inline `<span>`; `ProductWindow` shipped `WindowStatus`
 * as a named component. Neither author saw the other's code, and the two specs
 * came out ALMOST the same — both `rounded-[5px]`, `font-mono`, `text-[10px]`,
 * `uppercase`, `px-[7px] py-1` — and then disagreed on exactly one value:
 * `WindowStatus` tracked at `0.05em`, the tier chip at `0.08em`. That is the
 * drift the extraction exists to stop, and it is also the reason the extraction
 * could not simply pick a winner: both values are on screen today and both were
 * signed off in the browser, so flattening them here would have been a silent
 * restyle of a verified component, not a refactor.
 *
 * `tone` carries colour and nothing else. The geometry is fixed — a chip that is
 * a different size in two places is two chips again — with tracking as the one
 * declared exception, held at the tier chip's `0.08em` here and overridden back
 * to `0.05em` by `WindowStatus`, where the override is documented at the call
 * site. Reconciling the two onto one value is a visual decision that needs a
 * fresh look at both surfaces; until someone takes it, the difference is
 * recorded rather than laundered. Only the three tones with a live call site are
 * here; a fourth belongs in this file the day something actually renders it.
 *
 * The base also adds `shrink-0`, which the inline tier chip did not have. That
 * is a real change to `PlanCard`'s row and it is deliberate: see the comment on
 * the class list below.
 *
 * `neutral` is the one tone allowed to use invariant `chrome.*` / `brand.light`:
 * its fill is near-black on BOTH the dark page and the featured cream card, so
 * there is no inversion for an invariant token to get wrong. `healthy` and
 * `live` derive their fill from a mode-aware token through `color-mix`, so they
 * follow a `light` ancestor down to the light value of matcha / violet rather
 * than laying a dark-mode tint on a cream fill.
 */

export type ChipTone = 'neutral' | 'healthy' | 'live' | 'danger' | 'outline'

export interface ChipProps {
  /**
   * `neutral` — near-black chip, cream type; an identity marker, not a state.
   * `healthy` — `semantic.matcha`. `live` — `accent.violet`.
   * `danger` — `semantic.errorRed`, for a breakage or defect marker; its ink
   * is the on-tint token, not the base red — see the note on the `TONES` row.
   * `outline` — no fill, an invariant hairline; for a marker on a surface that
   * already has a fill of its own.
   */
  tone?: ChipTone
  /**
   * Merged last, so a Tailwind utility here beats the base. The only class this
   * package overrides that way is `tracking-*`, from `WindowStatus`; anything
   * else is a caller changing the geometry the type exists to hold still.
   */
  className?: string
  children: React.ReactNode
}

/**
 * Colour lives in one table rather than in branches at the call site, so adding
 * a tone is a row and never a second opinion about the geometry.
 */
const TONES: Record<ChipTone, { className?: string; style?: React.CSSProperties }> = {
  neutral: { className: 'bg-chrome-surface-darker text-brand-light' },
  healthy: {
    style: {
      background: 'color-mix(in oklab, var(--color-semantic-matcha) 14%, transparent)',
      color: 'var(--color-semantic-matcha)',
    },
  },
  live: {
    style: {
      background: 'color-mix(in oklab, var(--color-accent-violet) 14%, transparent)',
      color: 'var(--color-accent-violet)',
    },
  },
  // Added 2026-08-25, by the file's own rule — the marketing pricing page was
  // rendering it as `tone="neutral"` retinted through `className`, i.e. the
  // inline fork this file exists to stop. Two deliberate deviations from the
  // `healthy`/`live` recipe, both learned elsewhere in the package:
  //
  //   - The ink is `error-red-on-tint`, not the base red. `StatPill` and
  //     `Finding` both shipped the base token on its own tint and measured
  //     below the 4.5:1 floor — a label inside a tint of its own hue does not
  //     sit on the surface ladder the base value was derived against
  //     (`src/lib/status.ts`, `STATUS_TINT_TOKEN`).
  //   - The tint is 12%, not 14%, because the on-tint tokens were measured for
  //     the 10–12% band and fail at 18% (4.49). 14% is unmeasured territory;
  //     12% is not.
  //
  // Both halves are mode-aware, so the chip follows a `light` ancestor down to
  // the light pair — correct inside a light `ProductWindow` title bar.
  danger: {
    style: {
      background: 'color-mix(in oklab, var(--color-semantic-error-red) 12%, transparent)',
      color: 'var(--color-semantic-error-red-on-tint)',
    },
  },
  // Added 2026-08-13, and the file header called it: "a fourth belongs in this
  // file the day something actually renders it." `AskWidget` had been rendering
  // it inline since the day it was written — the same base, a hairline and a
  // warm muted ink — in a file that does not import this one.
  outline: { className: 'border border-chrome-line-strong text-chrome-text-muted-warm' },
}

export function Chip({ tone = 'neutral', className, children }: ChipProps) {
  const { className: toneClassName, style } = TONES[tone]
  return (
    <span
      // shrink-0: every live instance sits in a flex row opposite a title that
      // can wrap. Without it the chip is what gives, and a squeezed chip reads
      // as a rendering bug rather than a label. `WindowStatus` already had it;
      // `PlanCard`'s tier chip did not, and gains it here — in that row the flag
      // ("Popular") is the item that should wrap, never the tier's identity.
      //
      // tracking-[0.08em] is the tier chip's value and the default for new call
      // sites. `WindowStatus` overrides it to 0.05em to keep its shipped
      // rendering; see this file's header.
      className={cn(
        'shrink-0 rounded-[5px] px-[7px] py-1 font-mono text-[10px] uppercase tracking-[0.08em]',
        toneClassName,
        className,
      )}
      style={style}
    >
      {children}
    </span>
  )
}
