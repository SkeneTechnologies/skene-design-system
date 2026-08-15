import { cn } from '../lib/utils.js'

/**
 * The two-column diff: what the coding agent wrote beside what the check
 * corrected.
 *
 * This is the one artifact that has to be read as CODE rather than looked at as
 * a picture of code, so three of its decisions are load-bearing in ways the
 * markup does not advertise.
 *
 * ## The ground is GitHub's, and it is chosen for the red
 *
 * The columns sit on `terminal-chrome.github.dark.bg` (#0d1117) rather than
 * `terminal.bg` (#1e1e1e), and that is a contrast decision, not a branding one.
 * `semantic.errorRed` on #1e1e1e measures 4.82:1 and drops under the 4.5 floor
 * once the del-line's own 8% tint is laid on top of it. On #0d1117 the same red
 * is 5.72:1 and the tinted line still holds 5.11:1. Moving this artifact onto
 * the editor ground to "match the terminal" silently fails the removed lines,
 * which are the half of the diff the reader is being asked to distrust.
 *
 * ## It carries `dark`, which the prototype did not need to
 *
 * The chrome tokens here are invariant, but `semantic.errorRed` and
 * `semantic.matcha` are mode-aware, and their LIGHT values are drawn for a light
 * ladder: #c44239 and #677552 land at 3.79:1 and 3.85:1 on #0d1117. The
 * prototype never met that case because its page is globally dark. A package
 * component can be dropped anywhere — a `light` dashboard panel, a cream
 * marketing band — and would then paint light-ladder ink on a permanently dark
 * ground. So the root declares itself a dark subtree, which is `must:
 * wrap_dark_subtrees_in_dark_class` applied to exactly the situation the rule
 * describes. Nothing inside needs to know.
 *
 * ## Indentation is data, so lines are an array and not children
 *
 * Everywhere else in this package a set of rows is `children` — `DataTable`
 * takes `DataRow`s because its cells are not uniform. Diff lines ARE uniform
 * (a kind and a run of text), and they are whitespace-significant, which flips
 * the trade. JSX strips leading whitespace at the start of a line, so
 * `<DiffLine>` with the code written as a child loses its indentation the first
 * time somebody reformats the call site, and the failure is invisible in review
 * because the source still looks indented. A `lines` array puts every line in a
 * string literal where the leading spaces survive by construction.
 *
 * All content is props. Nothing here knows what any diff says — which column is
 * wrong is expressed as `side`, never as copy.
 */

/* ── tokens ───────────────────────────────────────────────────────────────── */

export type DiffLineKind = 'ctx' | 'del' | 'add'

/** Which half of the change a column shows. `before` is the one being argued against. */
export type DiffSide = 'before' | 'after'

/**
 * The same two the findings use — removals are `semantic.errorRed`, additions
 * are `semantic.matcha` — so a reader who has already learned the page's colour
 * for "broken" meets it again here rather than a diff-viewer's own red.
 */
const DIFF_TOKEN = {
  del: 'var(--color-semantic-error-red)',
  add: 'var(--color-semantic-matcha)',
} as const

/**
 * Percentage of the line colour washed behind it. Matcha is a pale green and
 * red is a saturated one, so equal mixes do not read as equal weight; the two
 * points of difference make the added block sit at the same visual density as
 * the removed one.
 */
const DIFF_WASH = { del: 8, add: 10 } as const

/**
 * The header label takes the colour of the lines beneath it, and the binding is
 * to the SIDE rather than to a prop. A caller cannot label "what the agent
 * wrote" in matcha, because the column that is being corrected is structurally
 * the left one and a green heading over red lines is a miscue, not a theme.
 */
const SIDE_TOKEN: Record<DiffSide, string> = {
  before: DIFF_TOKEN.del,
  after: DIFF_TOKEN.add,
}

/* ── DiffLine ─────────────────────────────────────────────────────────────── */

export interface DiffLineProps {
  /** Defaults to `ctx` — unchanged code, which is most of any hunk. */
  kind?: DiffLineKind
  /**
   * Announced before the line for screen readers, since add/del is otherwise
   * carried only by colour and a wash. Generic English by default and props
   * precisely so a translated page can replace them, the same shape
   * `TableCheck` uses for the same reason.
   */
  addedLabel?: React.ReactNode
  removedLabel?: React.ReactNode
  /** The line, INCLUDING its leading indentation. Whitespace is preserved. */
  children?: React.ReactNode
  className?: string
}

/**
 * One line of a hunk.
 *
 * A block element per line rather than one `<pre>` with newlines, because the
 * add and del states are full-bleed row tints and a background on an inline run
 * stops at the end of the glyphs. That is also why the line does not set its own
 * width: it fills the `w-max` sizer inside the column's scroller, so a short
 * removed line stays tinted all the way across a hunk that is wider than the
 * viewport.
 *
 * It restates the mono family and 13px that the column already sets. Redundant
 * in place, deliberate out of it — a line lifted into a caller's own panel
 * should not silently become 16px body text.
 */
export function DiffLine({
  kind = 'ctx',
  addedLabel = 'Added',
  removedLabel = 'Removed',
  children,
  className,
}: DiffLineProps) {
  const tint = kind === 'ctx' ? null : { color: DIFF_TOKEN[kind], wash: DIFF_WASH[kind] }
  return (
    <div
      className={cn(
        'whitespace-pre px-[12px] py-[4px] font-mono text-[13px]',
        tint === null && 'text-terminal-chrome-github-text',
        className,
      )}
      style={
        tint
          ? {
              color: tint.color,
              background: `color-mix(in oklab, ${tint.color} ${tint.wash}%, transparent)`,
            }
          : undefined
      }
    >
      {kind === 'ctx' ? null : (
        <span className="sr-only">{kind === 'add' ? addedLabel : removedLabel}</span>
      )}
      {children}
    </div>
  )
}

/* ── DiffColumn ───────────────────────────────────────────────────────────── */

export interface DiffLineSpec {
  kind?: DiffLineKind
  /** The line, INCLUDING its leading indentation. */
  text: React.ReactNode
}

export interface DiffColumnProps {
  /**
   * `before` is the state being corrected and takes the red heading; `after`
   * takes the matcha one. The two are not interchangeable — see `SIDE_TOKEN`.
   */
  side: DiffSide
  /** The column heading. Set in the caller's own words; this package ships none. */
  label: React.ReactNode
  /** The hunk, top to bottom. See the file header on why this is data. */
  lines: DiffLineSpec[]
  addedLabel?: React.ReactNode
  removedLabel?: React.ReactNode
  className?: string
}

/**
 * One code column: a chrome heading and the hunk under it.
 *
 * The hunk is the scroll container, and it is the ONLY one. The prototype put
 * `overflow-x: auto` on every individual line as well, which does keep the page
 * from scrolling but gives a long hunk one scroller per row: pushing line two
 * sideways to finish reading a call leaves lines one and three where they were,
 * and code whose lines no longer line up has stopped being code. Here the column
 * scrolls as a body — one gesture, one focus stop, every line still in register.
 * The `w-max` sizer between the scroller and the lines is what buys that: it
 * takes the width of the widest line so the shorter ones, being blocks, stretch
 * to match instead of ending their tint at the fold.
 *
 * `tabIndex={0}` because a region that only scrolls with a pointer is
 * unreachable without one — the same reason `ComparisonTable`'s wrapper carries
 * it.
 */
export function DiffColumn({
  side,
  label,
  lines,
  addedLabel,
  removedLabel,
  className,
}: DiffColumnProps) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex min-h-[32px] items-center gap-[8px] border-b border-terminal-chrome-github-border bg-terminal-chrome-github-dark-surface px-[12px] py-[8px] font-mono text-[11px] uppercase tracking-[0.16em] text-terminal-chrome-github-text">
        <b className="font-medium" style={{ color: SIDE_TOKEN[side] }}>
          {label}
        </b>
      </div>
      <div
        tabIndex={0}
        className="overflow-x-auto py-[12px] font-mono text-[13px] text-terminal-chrome-github-text"
      >
        <div className="w-max min-w-full">
          {lines.map((line, i) => (
            <DiffLine
              key={i}
              kind={line.kind}
              addedLabel={addedLabel}
              removedLabel={removedLabel}
            >
              {line.text}
            </DiffLine>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── SideBySideDiff ───────────────────────────────────────────────────────── */

export interface SideBySideDiffProps {
  /** Two `DiffColumn`s, `before` then `after`. */
  children: React.ReactNode
  className?: string
}

/**
 * The pair of columns. Drop it straight into an `ArtPanel` — that component
 * already owns the rounded, clipped, GitHub-bordered frame and the title bar
 * this artifact wears in the prototype, so nothing of `.art` is restated here.
 *
 * Two equal `minmax(0, 1fr)` tracks that collapse to one below 821px. The
 * breakpoint is the prototype's 820px and not Tailwind's `md`, because it is
 * measured rather than chosen: two 13px mono columns stop holding a readable
 * run of code somewhere just under that, and moving the collapse down to 768
 * buys 52px of width at the cost of four characters per side. Below it the
 * columns stack and the divider becomes the rule between them, so a 390px
 * screen reads before-then-after down the page with no horizontal scroll of the
 * body — the diff loses its adjacency, which at that width it had already lost.
 *
 * The divider is an adjacent-sibling rule rather than a border on the column, so
 * a column standing on its own has no orphaned edge and the first one in the
 * stack has no rule above it.
 *
 * `dark` is on this element. See the file header: the ground is invariant but
 * the ink is not.
 */
export function SideBySideDiff({ children, className }: SideBySideDiffProps) {
  return (
    <div
      className={cn(
        'dark grid min-w-0 grid-cols-1 bg-terminal-chrome-github-dark-bg',
        '[&>*+*]:border-t [&>*+*]:border-terminal-chrome-github-border',
        'min-[821px]:grid-cols-2 min-[821px]:[&>*+*]:border-l min-[821px]:[&>*+*]:border-t-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
