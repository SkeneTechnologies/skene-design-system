import { cn } from '../lib/utils.js'
import { Chip } from './chip.js'

/**
 * The framed product mock: a customer's dashboard rendered inside a marketing
 * section.
 *
 * It defaults to LIGHT on a dark page, which is the opposite of everything else
 * in this package and is the whole point — the section around it is Skene's
 * chrome, the thing in the frame is the customer's tool. Reversing that (a dark
 * window on a dark page) reads as a screenshot of Skene itself.
 *
 * This is why `chrome.line.onLight` exists: the window's internal rules are dark
 * hairlines on a cream fill, and the same alpha value has to work there as on
 * the dark grounds outside it.
 */

export type ProductWindowTone = 'light' | 'dark'

export interface ProductWindowProps {
  /** `light` (default) reads as the customer's product; `dark` as Skene's own. */
  tone?: ProductWindowTone
  /** Left side of the title bar. */
  title?: React.ReactNode
  /** Right side of the title bar — usually a `<WindowStatus>`. */
  status?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function ProductWindow({
  tone = 'light',
  title,
  status,
  className,
  children,
}: ProductWindowProps) {
  const dark = tone === 'dark'
  return (
    <div
      className={cn(
        'relative z-10 w-full max-w-[640px] overflow-hidden rounded-2xl border',
        dark
          ? 'border-chrome-line-subtle bg-chrome-surface-1 text-chrome-text-primary'
          : // `light` is load-bearing, not decoration. A light window is a light
            // context nested in a dark page, and every mode-aware token inside it
            // — semantic.matcha, errorRed, brand.peach — otherwise resolves to its
            // DARK value against a cream fill. matcha #d7f4ab on #faf1e9 is 1.16:1;
            // the class swaps it for the designed light value at 4.9:1.
            'light border-chrome-line-on-light bg-brand-light text-chrome-surface-1',
        className,
      )}
      style={{ boxShadow: 'var(--shadow-modal)' }}
    >
      {(title || status) && (
        <div
          className={cn(
            'flex min-h-[55px] items-center justify-between gap-3 border-b px-4 py-3 text-[13px] font-medium',
            dark ? 'border-chrome-line-subtle' : 'border-chrome-line-on-light',
          )}
        >
          <span>{title}</span>
          {status}
        </div>
      )}
      {children}
    </div>
  )
}

export interface WindowStatusProps {
  /**
   * `healthy` is the trap state — the dashboard reporting green while the data
   * under it is wrong. It is deliberately the calm colour, because the section
   * copy depends on the reader believing it before the findings contradict it.
   */
  tone?: 'healthy' | 'live'
  className?: string
  children: React.ReactNode
}

/**
 * A `Chip` with a narrower vocabulary. The name stays because callers read the
 * title bar's right-hand slot as a status, not as a chip, and the two tones here
 * are the only ones that mean anything in a window frame — `neutral` would be an
 * identity marker in a slot reserved for state.
 *
 * The `tracking` override is not styling taste. `WindowStatus` shipped and was
 * browser-verified at 0.05em while `PlanCard`'s tier chip shipped at 0.08em; the
 * shared `Chip` holds the tier chip's value, so without this line every window
 * status silently gained 60% more letter-spacing — about 5px across
 * "DASHBOARD: HEALTHY" at 10px uppercase mono. Reconciling the two is a visual
 * decision nobody has taken yet, so the difference is carried here explicitly
 * instead of being absorbed by the extraction. `cn` puts it after the base, and
 * a caller's own `tracking-*` still wins over it.
 */
export function WindowStatus({ tone = 'healthy', className, children }: WindowStatusProps) {
  return (
    <Chip tone={tone} className={cn('tracking-[0.05em]', className)}>
      {children}
    </Chip>
  )
}

/** The toolbar strip inside a dark window — filters, breadcrumbs, chips. */
export function WindowToolbar({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'flex min-h-[62px] items-center justify-between gap-3 border-b border-chrome-line-subtle px-5 py-3.5 text-chrome-text-muted-warm-strong',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function WindowChip({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn('rounded-md px-[9px] py-1.5 font-mono text-[11px] uppercase', className)}
      style={{
        border: '1px solid color-mix(in oklab, var(--color-semantic-matcha) 30%, transparent)',
        color: 'var(--color-semantic-matcha)',
      }}
    >
      {children}
    </span>
  )
}
