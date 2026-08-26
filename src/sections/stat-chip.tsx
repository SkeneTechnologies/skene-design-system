import { cn } from '../lib/utils.js'

/**
 * The two small labels that recur beside headings: a fact, and a promise.
 *
 * They look nearly identical at a glance, and that is exactly why they are two
 * components rather than one with a `variant` prop. `StatChip` asserts something
 * that is true right now ("121 stars"); `MetaChip` marks something that is not
 * shipped yet ("Turnkey dollar-revenue view — ROADMAP"). A single component with
 * a flag makes the default the live reading, so a forgotten prop silently turns
 * a roadmap item into a claim about the product. Two names cannot be defaulted
 * into each other.
 *
 * Type uses the theme-aware `text.*` role. Both chips appear on the dark page
 * and on the cream `LightSectionCard`, and `chrome.text.*` is invariant by
 * definition — cream that cannot invert, i.e. invisible on cream.
 *
 * The border and fill are the harder half of the same problem: there is no
 * mode-aware line token. `chrome.line.subtle` is white at 12% (invisible on
 * cream) and `chrome.line.onLight` is black at 14% (invisible on the dark page),
 * so a chip that must survive both derives both edges from `currentColor` — which
 * already follows the `light` ancestor via the text role. One rule, both grounds,
 * no `onLight` prop for a caller to get wrong.
 *
 * The icon slot is a `ReactNode` rather than a name, because the live instances
 * are literal emoji in the copy (★, 🕐). It is `aria-hidden`: the value beside it
 * already says what it is, and "black star 121 stars" is noise.
 *
 * WHY A PILL AND NOT THE WINDOW CHIPS' RECTANGLE — docs/sections.md §2 point 3,
 * settled here rather than left open.
 *
 * The question was whether these should adopt the 10px mono uppercase geometry
 * the window chips share, so the cluster reads as one system. They should not,
 * and the dividing line is not size. It is what the chip contains.
 *
 * The window chips carry TOKENS: LIVE, HEALTHY, PRO. A token is short, has no
 * grammar, and is read as a symbol — mono uppercase at 10px is exactly right
 * for it, and the tracking is there to stop the caps closing up. These two
 * carry PROSE: "121 stars", "Turnkey dollar-revenue view". Setting a sentence
 * fragment in 10px mono caps costs real legibility and, worse, asserts a
 * register the words do not have — the same objection `TagChip`'s header makes
 * about uppercasing a table name, which is a lie about what the reader should
 * type.
 *
 * `MetaChip` is the proof, and it is why this is a finding rather than a
 * preference: it already draws BOTH treatments in one chip. The description
 * stays prose in the pill's own type; the state word — ROADMAP, BETA — is mono,
 * uppercased and tracked, because that half IS a token. One component, the line
 * drawn inside it, in the direction this note argues. Flattening the outer
 * shape to a rectangle would put the token treatment on the prose half and
 * leave the chip saying two things in one voice.
 *
 * So the geometry stays a pill, and the cluster's rule is content-shaped rather
 * than size-shaped: a token gets the rectangle, prose gets the pill. Recorded
 * in `__tests__/chip-cluster.test.ts`, where every row states what it carries,
 * because look-alike was never the question.
 *
 * The private `Pill` below stays parameterised anyway. The decision is a
 * decision, not a fact, and the next person to reopen it should find one place
 * to change rather than two.
 */

/**
 * The shared box. Private: `StatChip` and `MetaChip` stay two exports for the
 * reason the file header gives — a flag would let a roadmap marker default into
 * a live claim — but they were also two copies of one geometry, differing in a
 * gap, an ink role and two mix percentages. Those three are parameters now, so
 * `docs/sections.md` §2 point 3, which asks whether these should adopt the
 * window chips' rectangle, becomes a one-line change instead of two.
 */
function Pill({
  gap,
  ink,
  border,
  fill,
  icon,
  className,
  children,
}: {
  gap: string
  ink: string
  border: number
  fill: number
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-3 py-1 text-[12px] leading-none', gap, ink, className)}
      style={{
        // Both edges derive from currentColor, which already follows a `light`
        // ancestor — the trick that lets these survive both grounds with no
        // `onLight` prop. See the file header.
        borderColor: `color-mix(in oklab, currentColor ${border}%, transparent)`,
        background: `color-mix(in oklab, currentColor ${fill}%, transparent)`,
      }}
    >
      {icon ? (
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  )
}

export interface StatChipProps {
  /** Leading mark — an emoji or a small icon element. Announced to nobody. */
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function StatChip({ icon, className, children }: StatChipProps) {
  return (
    <Pill gap="gap-1.5" ink="text-text-muted-strong" border={26} fill={7} icon={icon} className={className}>
      {children}
    </Pill>
  )
}

export interface MetaChipProps {
  /** Leading mark — an emoji or a small icon element. Announced to nobody. */
  icon?: React.ReactNode
  /** The thing being described, in prose. */
  children: React.ReactNode
  /** The state word — ROADMAP, BETA, SOON. Rendered monospace and uppercased. */
  status: React.ReactNode
  className?: string
}

export function MetaChip({ icon, children, status, className }: MetaChipProps) {
  return (
    <Pill gap="gap-2.5" ink="text-text-muted" border={22} fill={6} icon={icon} className={className}>
      <span>{children}</span>
      {/* A real element, not a `│` in the copy: the divider has to track the
          chip's height, and a pipe glyph is whatever the font decides. */}
      <span
        aria-hidden
        className="h-[13px] w-px shrink-0"
        style={{ background: 'color-mix(in oklab, currentColor 30%, transparent)' }}
      />
      <span className="shrink-0 font-mono uppercase tracking-[0.07em] text-brand-peach">
        {status}
      </span>
    </Pill>
  )
}
