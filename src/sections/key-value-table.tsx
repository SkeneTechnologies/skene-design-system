import { cn } from '../lib/utils.js'
import { AppPanel, DataCell, DataRow, DataTable } from './artifact-shell.js'

/**
 * The reference table: a fixed set of columns, a fixed set of rows, and nothing
 * to interact with.
 *
 * Four artifacts on the site are this thing wearing different column headings —
 * an API key list, a GitHub App permission scope list, a subprocessor list and
 * the CLI's `--provider` options. They were four hand-built tables, and the
 * fourth had already drifted: the first three are the prototype's `.ptab` and the
 * key list is its `.dtab`, which differ by 4px of vertical padding, a
 * `vertical-align`, a hover fill and `tabular-nums`. That is not four designs, it
 * is one design at two densities, so this is one component with a `density` prop
 * and the drift is now a value someone has to type rather than a value someone
 * forgets.
 *
 * ## Why `rows` is data here and `children` in `DataTable`
 *
 * `DataTable` takes rows as children on the stated grounds that its cells are not
 * uniform down a column — an event name is mono, a location is mono and quiet, a
 * status is a `StatPill`. In a reference table they ARE uniform down a column,
 * which is what makes it a reference table: the whole key column is a masked
 * value, the whole permission column is an identifier, the whole type column is a
 * chip. So the formatting is a property of the COLUMN and the content is a
 * property of the CELL, and separating them is what stops the tenth subprocessor
 * row being the one that forgot `mono`. Anything genuinely per-cell still goes in
 * the cell as a node — that is what `TagChip` and `MaskedValue` below are for.
 *
 * ## The first column is mono, and that is not a CSS accident
 *
 * The prototype says `.ptab td:first-child { font-family: mono; white-space:
 * nowrap }`, which looks like the kind of blunt selector you would decline to
 * port. It is not: the page's own notes enumerate exactly where mono is allowed
 * to appear and list "`.ptab`'s permission column" among them, because that
 * column holds things the reader is meant to match against their own config —
 * `Contents`, `anthropic`, a service they have a contract with. So `reference`
 * density defaults column 0 to mono and nowrap. It is a default and not a rule:
 * `mono: false` on the column turns it off, for the table where the first column
 * turns out to be prose.
 *
 * ## Spacing
 *
 * Read the header of `artifact-shell.tsx` before touching a padding here. The
 * package sets `--spacing: 0.2rem`, so Tailwind's `p-3` is 9.6px while the
 * prototype's `--spacing-3` is 12px. Every padding below is the literal px the
 * prototype token carries so it diffs against `artifacts.css` line for line.
 * `py-[12px]` is not a candidate for tidying into `py-3`.
 *
 * ## Overflow
 *
 * Nothing here sets a width or a `min-w`. `DataTable` composes `ui/table`, whose
 * container is `overflow-auto`, so a table wider than its parent scrolls inside
 * itself; the cells wrap, `align-top` keeps a three-line cell from centring
 * against a one-line neighbour, and only the first column refuses to wrap. That
 * combination is what holds 390px without the page body scrolling. A `min-w` on
 * this table would move the scrollbar to the body, which is the failure the gate
 * catches.
 *
 * ## `headerless`, and why it is a `<dl>` rather than hidden `<th>`s
 *
 * The kv-lists on the marketing wireframes — Cadence / Hourly, Window / 30 days
 * — have no column headings because the headings would only repeat what every
 * row already says. Two renderings were on the table:
 *
 *   1. Keep the `<table>` and visually hide the header row. Rejected twice
 *      over. `sr-only` is `position: absolute`, and this table's container is
 *      `ui/table`'s `overflow-auto` div, which is unpositioned — the exact
 *      combination that let `ComparisonTable`'s `sr-only` caption escape its
 *      scroll container and drag the page sideways 320px at 390. And even
 *      hidden correctly, the markup would still be a table whose headers exist
 *      only to satisfy the element — announced structure with no information
 *      in it.
 *   2. Render a `<dl>`. A headerless key/value list IS a description list:
 *      each first cell is the term, each remaining cell describes it. That is
 *      the semantics the wireframe was drawing, so it is the markup here —
 *      `<dt>` for column 0, one `<dd>` per further column, rows grouped in
 *      `<div>`s (valid inside `<dl>` since HTML 5.2, and what keeps a row
 *      styleable as a row).
 *
 * The column flags (`mono`, `muted`, `strong`, `nowrap`, `className`) apply
 * unchanged, `header` is simply not rendered, and the cells carry the same
 * paddings as the chosen `density` so a headerless table beside a headed one
 * keeps the same rhythm.
 *
 * All content is props. Nothing here knows what a permission grants or what a
 * subprocessor sees.
 */

/**
 * `reference` is the marketing-page table — roomy, top-aligned, no hover, no
 * tabular figures, because its cells are sentences of wildly different lengths
 * and there is no column of numbers to keep in register.
 *
 * `data` is the product's own table, and is `DataTable` untouched: tighter rows,
 * middle-aligned, a hover fill and tabular numerals, because it depicts a surface
 * where rows are scanned and one of them will be clicked.
 */
export type KeyValueDensity = 'reference' | 'data'

export interface KeyValueColumn {
  /** The heading. Rendered as `<th scope="col">` by `DataTable`. */
  header: React.ReactNode
  /**
   * Monospace this column. Defaults to `true` for column 0 at `reference`
   * density — see the file header. Pass `false` to opt out.
   */
  mono?: boolean
  /** Quieter and a step smaller: the supporting column, e.g. a masked value. */
  muted?: boolean
  /**
   * `font-medium`. The prototype's `.akn` — the name a reader scans for before
   * they read anything else in the row.
   */
  strong?: boolean
  /**
   * Refuse to wrap. Defaults to `true` for column 0 at `reference` density, for
   * the same reason `mono` does: a wrapped identifier stops being one.
   */
  nowrap?: boolean
  /** Merged last onto every cell in this column. */
  className?: string
}

export interface KeyValueRow {
  /**
   * React key. Falls back to the row index, which is correct here — these tables
   * are authored constants and do not reorder — but supply one if the rows are
   * ever filtered.
   */
  id?: string
  /** One node per column, in column order. A short row leaves empty cells. */
  cells: React.ReactNode[]
  className?: string
}

export interface KeyValueTableProps {
  columns: KeyValueColumn[]
  rows: KeyValueRow[]
  /** Defaults to `reference`; three of the four call sites are that. */
  density?: KeyValueDensity
  /**
   * Drop the header row and render the rows as a semantic `<dl>` — for the
   * settings readout whose headings would only repeat what every row says.
   * Column `header`s go unrendered (keep authoring them; they document the
   * columns), every other column flag applies unchanged. See the file header
   * for why this is a `<dl>` and not visually-hidden `<th>`s.
   */
  headerless?: boolean
  className?: string
}

/**
 * Inline `<code>` inside a cell. The prototype styles this globally as `td code`;
 * the package cannot ship a global element rule, so it is scoped to the cells of
 * this table.
 *
 * One deviation: the prototype's dark page paints code peach on `surface-2`,
 * which are dark-ladder tokens and would stay dark inside a `light` `AppWindow`.
 * These are the themed roles instead, so the same table reads correctly in both
 * polarities. It costs the peach.
 */
const CODE_IN_CELL = [
  '[&_code]:rounded-sm [&_code]:border [&_code]:border-border [&_code]:bg-muted',
  '[&_code]:px-[4px] [&_code]:py-[1px] [&_code]:font-mono [&_code]:text-[0.9em]',
  '[&_code]:text-foreground',
].join(' ')

export function KeyValueTable({
  columns,
  rows,
  density = 'reference',
  headerless = false,
  className,
}: KeyValueTableProps) {
  const reference = density === 'reference'

  if (headerless) {
    // The formatting below mirrors `DataCell` plus this file's reference-density
    // additions, cell for cell, so a headerless table beside a headed one at the
    // same density reads as the same table minus its header bar. The row rule is
    // `DataRow`'s 60% mix for the same reason.
    return (
      <dl className={cn('m-0 w-full', className)}>
        {rows.map((row, r) => (
          <div
            key={row.id ?? r}
            className={cn('grid border-b last:border-b-0', row.className)}
            style={{
              gridTemplateColumns: `max-content repeat(${Math.max(1, columns.length - 1)}, minmax(0, 1fr))`,
              borderColor: 'color-mix(in oklab, var(--border) 60%, transparent)',
            }}
          >
            {columns.map((column, c) => {
              const Cell = c === 0 ? 'dt' : 'dd'
              return (
                <Cell
                  key={c}
                  className={cn(
                    CODE_IN_CELL,
                    'm-0 px-[12px] text-[13px] font-normal text-foreground',
                    reference ? 'py-[12px] normal-nums' : 'py-[8px] tabular-nums',
                    (column.mono ?? (reference && c === 0)) && 'font-mono',
                    column.muted && 'text-[12px] text-muted-foreground',
                    (column.nowrap ?? (reference && c === 0)) && 'whitespace-nowrap',
                    column.strong && 'font-medium',
                    column.className,
                  )}
                >
                  {row.cells[c]}
                </Cell>
              )
            })}
          </div>
        ))}
      </dl>
    )
  }

  return (
    <DataTable
      columns={columns.map((column) => column.header)}
      // `DataTable` paints `bg-card` because the product's panel is a card. A
      // reference table sits on the marketing page's own panel and must let that
      // fill through; painting card over it is a visible seam, not a no-op.
      className={cn(reference && 'bg-transparent', className)}
    >
      {rows.map((row, r) => (
        <DataRow
          key={row.id ?? r}
          // No hover: nothing in a reference table is clickable, and a row that
          // lights up promises otherwise.
          className={cn(reference && 'hover:bg-transparent', row.className)}
        >
          {columns.map((column, c) => (
            <DataCell
              key={c}
              mono={column.mono ?? (reference && c === 0)}
              muted={column.muted}
              className={cn(
                CODE_IN_CELL,
                reference && 'py-[12px] align-top normal-nums',
                (column.nowrap ?? (reference && c === 0)) && 'whitespace-nowrap',
                column.strong && 'font-medium',
                column.className,
              )}
            >
              {row.cells[c]}
            </DataCell>
          ))}
        </DataRow>
      ))}
    </DataTable>
  )
}

/* ── MaskedValue ──────────────────────────────────────────────────────────── */

export interface MaskedValueProps {
  /**
   * The part that survives redaction — a scheme or scope marker, never the
   * value. Content, so it is a prop; the package does not know what your keys
   * are prefixed with.
   */
  prefix?: React.ReactNode
  /** How many bullets follow. Fixed, not derived from a real length. */
  length?: number
  className?: string
}

/**
 * A redacted secret: a prefix, then a bullet run that ends.
 *
 * The run is FIXED and has no tail, and both halves of that are the point. Real
 * key UIs show the last four characters because that is how an operator tells two
 * keys apart — which makes those four characters the identifying part, and
 * showing them the leak this component exists to avoid. Deriving the bullet count
 * from a real key's length would leak it a second way, more quietly. So the
 * caller passes a count or takes 16, and a rendering of this can never be walked
 * back to a key.
 *
 * The bullets are `aria-hidden`. A screen reader announcing "bullet" sixteen times
 * is not conveying the redaction, it is reading the redaction aloud; the prefix
 * alone carries everything the run does.
 */
export function MaskedValue({ prefix, length = 16, className }: MaskedValueProps) {
  return (
    <span className={cn('whitespace-nowrap font-mono', className)}>
      {prefix}
      <span aria-hidden>{'•'.repeat(Math.max(0, length))}</span>
    </span>
  )
}

/* ── TableNote ────────────────────────────────────────────────────────────── */

export interface TableNoteProps {
  className?: string
  children: React.ReactNode
}

/**
 * The paragraph above a table, in a panel of its own — the prototype's `.akw`.
 *
 * It is an `AppPanel` and not a bare `<p>` because in the surface being depicted
 * it genuinely is a second card: the product stacks a bordered advisory over the
 * bordered key list, and a note without the border reads as page copy that
 * happened to land inside the window. The 12px bottom margin is the gap to the
 * table; it is on the note rather than the table because a table may appear
 * without one.
 */
export function TableNote({ className, children }: TableNoteProps) {
  return (
    <AppPanel className={cn('mb-[12px] p-[12px] text-[12px] text-muted-foreground', className)}>
      {children}
    </AppPanel>
  )
}

/* ── TagChip ──────────────────────────────────────────────────────────────── */

export type TagChipVariant = 'outline' | 'solid'

export interface TagChipProps {
  /**
   * `outline` is the default and is a label — a type, a source, a bound table.
   * `solid` inverts to foreground-on-background and marks the one item in a set
   * that has a job, the prototype's `.chip--role`. Two solid chips beside each
   * other cancel the distinction out.
   */
  variant?: TagChipVariant
  className?: string
  children: React.ReactNode
}

/**
 * The neutral 11px mono tag.
 *
 * Distinct from `Chip`, deliberately, and the two should not be merged. `Chip` is
 * 10px uppercase and tracked, carries a `tone` and is a STATE — healthy, live, a
 * plan tier. This one carries no colour, no uppercasing and no tracking, and is
 * an identifier reproduced verbatim: `Secret`, a table name, an operand's role.
 * Uppercasing a table name is a lie about what the reader should type.
 *
 * The margin is the prototype's and is a run of chips wrapping in flow, not a
 * flex row — which is why it is `mr`/`mb` on the chip rather than a `gap` on a
 * parent that may not exist. In a cell holding exactly one chip that leaves 4px
 * under it; `className="m-0"` is the escape, and a flex parent should use it.
 *
 * `overflow-wrap: anywhere` rather than `break-words`: these hold identifiers
 * with no spaces to break at, and at 390px in a three-column table an unbroken
 * one is what widens the track.
 */
export function TagChip({ variant = 'outline', className, children }: TagChipProps) {
  return (
    <span
      className={cn(
        'mb-[4px] mr-[4px] inline-block max-w-full rounded-sm border px-[8px] py-[1px]',
        'font-mono text-[11px] [overflow-wrap:anywhere]',
        variant === 'solid'
          ? 'border-foreground bg-foreground text-background'
          : 'border-border bg-muted text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}
