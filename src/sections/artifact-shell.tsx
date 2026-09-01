import { cn } from '../lib/utils.js'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table.js'

/**
 * The shell every artifact sits in: a textured field, a bordered frame, the
 * Skene Cloud window chrome, its status pill and its table.
 *
 * An "artifact" is a depiction of a real surface — a GitHub review, a shell, an
 * Events table — drawn rather than screenshotted so it can be redacted, typeset
 * and read at 390px. There are twenty-odd of them and they were all hand-built
 * from the same five parts. Extracting the five is what stops the twenty-first
 * inventing its own idea of a 36px header row.
 *
 * ## Two registers, and the shell has to serve both
 *
 * `ArtPanel` defaults to FIXED DARK: GitHub's border, the terminal bar, the
 * terminal ink. Those artifacts depict GitHub and an editor and a shell, not
 * Skene, and drawing them light is the lie. So they take `terminal.*` and
 * `terminal-chrome.*`, which are invariant by construction.
 *
 * `AppWindow` is the other register and carries the `light` class on purpose.
 * The real signed-in workspace is light — `bg-card` appears 127 times under
 * app/workspace/**, only the sidebar is dark — and these artifacts render on the
 * dark marketing page. Without `light` every themed token inside resolves to its
 * DARK value and the artifact stops depicting the product. This is the same
 * decision, for the same reason, that `ProductWindow` documents at length.
 *
 * ## Spacing: `p-4` is NOT `--spacing-4`
 *
 * The package sets `--spacing: 0.2rem`, so Tailwind's `p-4` is 12.8px, while
 * `tokens.css` separately defines `--spacing-4: 16px` as a plain custom
 * property. They differ by 25% and nothing warns. Every padding below was ported
 * from a `--spacing-N` token in artifacts.css, so it is written as the literal px
 * the token carries and can be diffed against that file line for line. Reaching
 * for the numerically-similar Tailwind step is the mistake this note exists to
 * prevent.
 *
 * Radii do line up: `--radius-gtm` is `--radius-xl` is `rounded-xl` (14px), and
 * `--radius-lg` is `rounded-lg` (10px).
 *
 * All content is props. Nothing here knows what any artifact says.
 */

/* ── ArtFrame ─────────────────────────────────────────────────────────────── */

/**
 * Which of the three site textures backs the frame.
 *
 * The pairing is the live site's, so a reader who knows www.skene.ai meets the
 * same backdrop behind the same kind of thing. It is a required prop rather than
 * a defaulted one because the pairing carries meaning: a schema panel that lands
 * on the GitHub texture is not a styling slip, it is a miscue.
 *
 *   gh  card2 — GitHub, PRs, editor chrome
 *   db  card3 — schema, connections, keys
 *   jr  card1 — journeys, funnels, measurement
 */
export type ArtFrameKind = 'gh' | 'db' | 'jr'

/**
 * Resolved against this module, never as `/img/card2_bg.webp`. A consumer
 * installing the package has no `public/img`, and a bare path would render as a
 * missing image in every app but the prototype it was written in. Same mechanism
 * as `SectionBackdrop`.
 */
const TEXTURE_URL: Record<ArtFrameKind, string> = {
  gh: new URL('../../assets/card2_bg.webp', import.meta.url).href,
  db: new URL('../../assets/card3_bg.webp', import.meta.url).href,
  jr: new URL('../../assets/card1_bg.webp', import.meta.url).href,
}

export interface ArtFrameProps {
  /** Which texture. See `ArtFrameKind` — the pairing is not decorative. */
  kind: ArtFrameKind
  /**
   * The card-row variant. Padding becomes a percentage and the frame gains
   * vertical room, so a short wide card in a grid track still reads as a panel
   * ON a field rather than a panel with a coloured border.
   */
  row?: boolean
  /**
   * How the field is drawn. `image` is the shipped raster and the default;
   * `css` is the same three fields as gradients, in `styles/effects.css`.
   *
   * The choice is a performance one and the comment above `.skene-field` in
   * that stylesheet carries the measurement. Short version: a raster on a frame
   * this size is normally the page's Largest Contentful Paint, and swapping it
   * for CSS moved LCP from 1534 ms to 640 ms on a test page by making the
   * heading the largest paint instead. Neither masking the image to its visible
   * band nor downscaling it achieves that; only not being an image does.
   *
   * It defaults to `image` because the two are not pixel-identical — the raster
   * is an ordered dither over a photographic wash and the CSS is a regular grid
   * over a linear one. Opt in where the frame is big enough to gate LCP.
   */
  field?: 'image' | 'css'
  className?: string
  children?: React.ReactNode
}

/**
 * The dithered field an artifact floats on.
 *
 * Three things differ from the live site's `Container`, each on purpose:
 *
 *   - no `aspect-ratio`. The live depictions are square animations; these are
 *     real tables and reviews of wildly different heights, and forcing a square
 *     would either crop them or strand them in a void.
 *   - no border. The texture is bright enough to define its own edge, and this
 *     frame stands on the page ground rather than inside a card.
 *   - an opaque background COLOUR under the texture, so a frame whose image
 *     fails to load is still a surface and not a hole. `surface.deep-2` is the
 *     themed role, not `chrome.*`: this is page furniture and should invert with
 *     the page, and no text ever sits on it — every panel that lands here paints
 *     its own opaque ground, which is what terminates the contrast walk.
 *
 * The fixed padding is the visible texture and is set to land near the live
 * proportion rather than picked for looks: the live panel is 84–92% of a square
 * container, so ~4–8% of the width shows on each side. 48px on a 1216px frame is
 * 3.9%; 16px at 390px is 4.1%. Too little and the backdrop reads as a stray
 * border.
 *
 * `row` swaps that for 6% because padding alone does not give a card row the
 * live picture — the first attempt made exactly that mistake. A percentage holds
 * the proportion at every track width by construction instead of at three
 * breakpoints by arithmetic, and the min-height supplies the vertical room the
 * live square has so the texture is above and below the card and not only beside
 * it. min-height rather than aspect-ratio: a two-up row at 1440 is a 600px track,
 * and a true square there is a 600px tile carrying two lines of copy.
 *
 * Decorative: nothing here is announced, and the children own the frame.
 */
export function ArtFrame({
  kind,
  row = false,
  field = 'image',
  className,
  children,
}: ArtFrameProps) {
  const css = field === 'css'
  return (
    <div
      /*
        `data-field` is what `.skene-field` keys off, and it is set only on the
        CSS path so the attribute never appears without the class that reads it.
      */
      data-field={css ? kind : undefined}
      className={cn(
        'min-w-0 overflow-hidden rounded-xl bg-surface-deep-2',
        /*
          `bg-cover bg-center bg-no-repeat` belongs to the raster. The CSS field
          sets its own three-layer `background-size`, `-position` and `-repeat`,
          and leaving the utilities on would override the shorthand the class
          declares, which shows up as one enormous dot rather than a grid.
        */
        css ? 'skene-field' : 'bg-cover bg-center bg-no-repeat',
        row
          ? // The child stretches so a two-card row keeps equal heights; min-w-0
            // so a long line inside it wraps instead of widening the track.
            'flex min-h-[16rem] items-center p-[6%] md:min-h-[22rem] [&>*]:min-w-0 [&>*]:flex-auto'
          : 'p-[16px] md:p-[32px] lg:p-[48px]',
        className,
      )}
      style={css ? undefined : { backgroundImage: `url(${TEXTURE_URL[kind]})` }}
    >
      {children}
    </div>
  )
}

/* ── ArtPanel ─────────────────────────────────────────────────────────────── */

export interface ArtPanelProps {
  /**
   * The header strip. Usually traffic lights and an `<ArtTitle>`. Omitted
   * entirely when absent — an empty 32px bar reads as a rendering bug.
   */
  bar?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * The artifact frame itself: a bordered, rounded, clipped box with an optional
 * chrome bar.
 *
 * `overflow: hidden` is load-bearing rather than tidy. Everything that goes in
 * here — a diff, a code column, a table — scrolls sideways inside its own
 * element, and without the clip a wide row bleeds past the rounded corner and
 * pushes the page body's horizontal scrollbar instead.
 *
 * The default border and bar are the fixed-dark developer chrome, because that
 * is what an unqualified artifact is. `AppWindow` below is the light Skene Cloud
 * variant and does not go through here; the marketing `.art--panel` flavour
 * (`bg-surface-1`, `border-surface-border`) is one `className` away.
 */
export function ArtPanel({ bar, className, children }: ArtPanelProps) {
  return (
    <div
      className={cn(
        'min-w-0 max-w-full overflow-hidden rounded-xl border border-terminal-chrome-github-border',
        className,
      )}
    >
      {bar ? (
        <div className="flex min-h-[32px] items-center gap-[8px] border-b border-terminal-border bg-terminal-bar px-[12px] py-[8px] font-mono text-[13px] text-terminal-text">
          {bar}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export interface ArtTitleProps {
  className?: string
  children: React.ReactNode
}

/**
 * The label in an `ArtPanel` bar. Exists only to carry the gap that separates it
 * from the traffic lights — which is wider than the bar's own `gap` because the
 * lights are one object and the title is the next.
 */
export function ArtTitle({ className, children }: ArtTitleProps) {
  return <span className={cn('ml-[12px]', className)}>{children}</span>
}

/* ── AppWindow ────────────────────────────────────────────────────────────── */

export interface AppWindowProps {
  /**
   * The breadcrumb, left of the bar. Render the current surface as `<b>` and the
   * separator/parent as plain text — the styling for both is applied by
   * descendant selectors here, so a caller writes ordinary markup and gets the
   * product's own breadcrumb weights without importing two more components.
   */
  crumb?: React.ReactNode
  /** The right-hand cluster — usually a `<StatPill>` and at most one button. */
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * Skene Cloud's page chrome: breadcrumb, actions, body.
 *
 * Anatomy is copied from `DashboardPageShell`, not approximated — the padding
 * step at 640px, the breadcrumb's muted parent and medium current segment, the
 * right-held action cluster.
 *
 * It carries `light` unconditionally. See the file header: the product is light,
 * the page around it is dark, and an artifact that inherits the page's polarity
 * is a picture of a product that does not exist. If a consumer ever needs this
 * to follow the ambient theme — the dashboard rendering its own chrome inside
 * `.dark`, say — that wants a prop and a decision, not a `className` override,
 * because `cn` cannot unset a theme class.
 *
 * The bar is dropped whole when there is no crumb and no actions. That is not a
 * convenience: the funnel artifact is deliberately unbranded — product palette,
 * no product chrome — because no Skene surface renders a funnel and the chart is
 * the reader's own dashboard.
 */
export function AppWindow({ crumb, actions, className, children }: AppWindowProps) {
  return (
    <div
      className={cn(
        'light min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-background text-foreground',
        className,
      )}
    >
      {crumb || actions ? (
        <div className="flex flex-wrap items-center justify-between gap-[12px] px-[16px] pt-[16px] sm:px-[24px] sm:pt-[24px]">
          {crumb ? (
            <div // text-muted rather than muted-foreground. The shadcn slot measured 4.49
            // on this card against a 4.5 floor — a real miss, not a rounding one,
            // and it is a shared slot the dashboard also uses, so moving its value
            // to win 0.01 here would reach further than the problem. text.muted is
            // #525252 on light and clears comfortably.
            className="flex items-center gap-[8px] text-[14px] text-text-muted [&_b]:font-medium [&_b]:text-foreground">
              {crumb}
            </div>
          ) : (
            <span />
          )}
          {actions ? <div className="flex items-center gap-[8px]">{actions}</div> : null}
        </div>
      ) : null}
      <div className="p-[16px] sm:p-[24px]">{children}</div>
    </div>
  )
}

/* ── the two things every windowed artifact computes ──────────────────────── */

export interface ArtifactHeaderProps {
  /** The bold half of the crumb — usually the workspace or resource. */
  title?: React.ReactNode
  /** The quiet half, after the separator. */
  source?: React.ReactNode
  /** Between them. A node, because the live artifacts use a middot. */
  separator?: React.ReactNode
  /** The pill's word, right-hand side of the bar. */
  summary?: React.ReactNode
  summaryStatus?: StatPillStatus
  /** Anything else in the bar, after the pill. */
  actions?: React.ReactNode
}

/**
 * The crumb and the bar an `AppWindow` takes, built from the flat props an
 * artifact receives.
 *
 * Four artifacts computed these inline — `discovery-table`, `integration-rows`,
 * `lifecycle-canvas` and, in a variant, `evaluator-*` — with the same twenty
 * lines and the same explanatory comment each time. Byte-identical, verified
 * before this extraction, which is why it changes no pixels.
 *
 * Both halves are `undefined` when empty rather than an empty element, and that
 * is the load-bearing part: `AppWindow` drops its whole bar when neither is
 * present, and an empty flex row above the panel reads as a rendering fault
 * rather than as an absence.
 */
export function artifactHeader({
  title,
  source,
  separator,
  summary,
  // `bad`, matching what all three call sites defaulted to before this was
  // extracted: an artifact with a headline count exists because a scan found
  // something, and a clean scan passes `ok` and says so.
  summaryStatus = 'bad',
  actions,
}: ArtifactHeaderProps): { crumb?: React.ReactNode; bar?: React.ReactNode } {
  const crumb =
    title || source ? (
      <>
        {title ? <b>{title}</b> : null}
        {title && source ? <span>{separator}</span> : null}
        {source ? <span>{source}</span> : null}
      </>
    ) : undefined

  const bar =
    summary || actions ? (
      <>
        {summary ? <StatPill status={summaryStatus}>{summary}</StatPill> : null}
        {actions}
      </>
    ) : undefined

  return { crumb, bar }
}

export interface PanelCaptionProps {
  className?: string
  children: React.ReactNode
}

/**
 * The caption strip at the head of an `AppPanel` — a title on the left, a count
 * or a note on the right, over the panel's own hairline.
 *
 * Written out character-for-character in four files before this existed:
 * `mcp-block`, `evaluator-check`, `evaluator-verify` and `evaluator-panel`. All
 * four import from this module and none of them found it here, because it was
 * not here — `McpBlock` is this strip wrapped in an `AppPanel`, under a name
 * that hides the fact.
 *
 * `items-baseline`, not `items-center`: the right-hand side is usually smaller
 * type, and centring it makes the two look misaligned at 12px.
 */
export function PanelCaption({ className, children }: PanelCaptionProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-baseline justify-between gap-[12px] border-b border-border px-[12px] py-[8px] text-[12px] text-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface AppPanelProps {
  className?: string
  children?: React.ReactNode
}

/**
 * The content card inside an `AppWindow` body — the shadcn Card recipe from
 * layouts.yaml, with no shadow (principles.md 16: flat panels take a border).
 *
 * It clips vertically and scrolls horizontally, which is the pairing that keeps
 * a wide table inside the artifact. Put the `min-w` on the table, never here, or
 * the page body scrolls instead of the panel.
 */
export function AppPanel({ className, children }: AppPanelProps) {
  return (
    <div
      className={cn(
        'overflow-hidden overflow-x-auto rounded-lg border border-border bg-card text-card-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ── StatPill ─────────────────────────────────────────────────────────────── */

export type StatPillStatus = 'bad' | 'warn' | 'ok'

/**
 * The same three the dashboard uses, bound the same way `Finding` binds its
 * `good | warn | danger`. The vocabulary is fixed rather than free-form because a
 * marketing page and a product that disagree about what "broken" looks like teach
 * the reader the wrong colour.
 *
 * The prototype additionally darkened these for the light panel
 * (`--status-error-text` and friends). Those tokens do not exist in this package
 * and inventing them is `ask_first_when: a_token_value_would_change`, so the pill
 * ships on the untouched semantic tokens and the gap is reported rather than
 * papered over. See `known_gaps: light_mode_brand_palette`.
 */
/**
 * Two colours per status, not one, and this is the whole fix for the pills.
 *
 * GRAPHIC is the rim and the fill. TEXT is the label. They used to be the same
 * token, and on a light AppWindow card every label came in under the floor:
 * 3.98 for error-red, 4.26 matcha, 4.36 and 4.45 amber, all against 4.5:1,
 * measured off the rendered pill at 390, 768 and 1440 alike.
 *
 * The cause was subtler than the known_gaps table suggested. The light
 * variants of these tokens are real and were in use — the failing red WAS
 * #c44239, the light value. They were derived to clear 4.5:1 on the light
 * SURFACE ladder, and a pill does not sit on the surface ladder. It sits on a
 * 10% tint of its own graphic colour, a warmer and slightly different ground,
 * and the derivation missed it by 0.05 to 0.52.
 *
 * So the label takes a token derived against the ground it is actually on.
 * This is the split the prototype already had as --status-*-text against
 * --status-*-graphic; the package simply did not carry it across.
 */
const STATUS_GRAPHIC: Record<StatPillStatus, string> = {
  bad: 'var(--color-semantic-error-red)',
  warn: 'var(--color-semantic-warning-amber)',
  ok: 'var(--color-semantic-matcha)',
}

const STATUS_TEXT: Record<StatPillStatus, string> = {
  bad: 'var(--color-semantic-error-red-on-tint)',
  warn: 'var(--color-semantic-warning-amber-on-tint)',
  ok: 'var(--color-semantic-matcha-on-tint)',
}

/** `ok` is the calmer state, so its edge and fill sit a notch differently. */
const STATUS_MIX: Record<StatPillStatus, { border: number; fill: number }> = {
  bad: { border: 40, fill: 10 },
  warn: { border: 40, fill: 10 },
  ok: { border: 35, fill: 12 },
}

export interface StatPillProps {
  status: StatPillStatus
  className?: string
  children: React.ReactNode
}

/**
 * The status pill: a dot, a word, a tinted capsule.
 *
 * The dot is a real element, not a `::before`. The prototype draws it as a
 * pseudo-element filled with `currentColor` and that is invisible to the
 * pixel-contrast harness's glyph diff — it reads as a glyph pixel and quietly
 * skews the measurement of every artifact containing a pill. Rendering it keeps
 * the appearance (still `currentColor`, still 6px) and makes it a thing the
 * harness can see and exclude. It is `aria-hidden`: the word beside it already
 * says what it is.
 *
 * Every edge and fill is derived from the one status colour rather than picked,
 * so a caller cannot produce a red pill with an amber rim.
 */
export function StatPill({ status, className, children }: StatPillProps) {
  const graphic = STATUS_GRAPHIC[status]
  const text = STATUS_TEXT[status]
  const mix = STATUS_MIX[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[4px] whitespace-nowrap rounded-full border px-[8px] py-[4px] font-sans text-[11px] font-medium leading-none',
        className,
      )}
      style={{
        color: text,
        borderColor: `color-mix(in oklab, ${graphic} ${mix.border}%, transparent)`,
        background: `color-mix(in oklab, ${graphic} ${mix.fill}%, transparent)`,
      }}
    >
      {/* The dot takes the GRAPHIC colour, not currentColor. It is a 6px
          shape, not text, so it is not held to a text contrast floor, and
          keeping it undarkened preserves the pill's read at a glance. */}
      <span
        aria-hidden
        className="size-[6px] shrink-0 rounded-full"
        style={{ background: graphic }}
      />
      {children}
    </span>
  )
}

/* ── DataTable ────────────────────────────────────────────────────────────── */

export interface DataTableProps {
  /** Column headings, left to right. Rendered as `<th scope="col">`. */
  columns: React.ReactNode[]
  /** `DataRow`s. */
  children: React.ReactNode
  className?: string
}

/**
 * The product's table, at the product's density.
 *
 * This composes `@skene/design-system/ui/table` rather than restating it. That
 * primitive already owns the scroll container, the semantic element tree and the
 * last-row rule suppression; what it does not own is Skene Cloud's density, which
 * is materially tighter than shadcn's default — a 36px header against `h-10`,
 * 11px uppercase headings at 0.16em against 14px sentence case, 13px
 * tabular-numeral cells against `text-sm`. Copying the primitive to change those
 * numbers is `copy_a_primitive_into_an_app_to_tweak_it`; overriding them through
 * `cn` is the same edit with one table left in the package.
 *
 * The rule sits on the row, not the cell, which is where the prototype put it.
 * Identical rendering under `border-collapse`, and it lets `TableBody`'s own
 * `[&_tr:last-child]:border-0` drop the last rule for free instead of a second
 * selector doing it by hand.
 *
 * Rows are children rather than a `rows` array because the cells are not
 * uniform: an event name is monospace, a location is monospace and quiet, and a
 * status is a `StatPill`. A data-shaped API would have to grow a renderer prop
 * per column to say so.
 */
export function DataTable({ columns, children, className }: DataTableProps) {
  return (
    <Table className={cn('border-collapse bg-card', className)}>
      <TableHeader>
        <TableRow
          className="border-b hover:bg-transparent"
          style={{ borderColor: 'var(--border)' }}
        >
          {columns.map((column, i) => (
            <TableHead
              key={i}
              scope="col"
              className="h-[36px] px-[12px] align-middle font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground"
            >
              {column}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  )
}

export interface DataRowProps {
  /** `DataCell`s, one per column. */
  children: React.ReactNode
  className?: string
}

/**
 * One body row. The rule is 60% of `--border` — a full-strength line at this row
 * height turns a six-row table into a grid, and the header rule above it stops
 * reading as the header rule.
 */
export function DataRow({ children, className }: DataRowProps) {
  return (
    <TableRow
      className={cn('border-b hover:bg-muted', className)}
      style={{ borderColor: 'color-mix(in oklab, var(--border) 60%, transparent)' }}
    >
      {children}
    </TableRow>
  )
}

export interface DataCellProps {
  /**
   * Monospace. For identifiers the reader is meant to match against their own
   * code — event names, file paths, table names.
   */
  mono?: boolean
  /** Quieter and a step smaller. For the supporting half of a cell pair. */
  muted?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * One body cell. `tabular-nums` is on by default and is not a nicety: these
 * tables are read by scanning a column of counts, and proportional digits make
 * the column jitter.
 */
export function DataCell({ mono, muted, children, className }: DataCellProps) {
  return (
    <TableCell
      className={cn(
        'px-[12px] py-[8px] align-middle text-[13px] tabular-nums text-foreground',
        mono && 'font-mono',
        muted && 'text-[12px] text-muted-foreground',
        className,
      )}
    >
      {children}
    </TableCell>
  )
}
