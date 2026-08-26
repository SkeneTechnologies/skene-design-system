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
export type ArtFrameKind = 'gh' | 'db' | 'jr';
export interface ArtFrameProps {
    /** Which texture. See `ArtFrameKind` — the pairing is not decorative. */
    kind: ArtFrameKind;
    /**
     * The card-row variant. Padding becomes a percentage and the frame gains
     * vertical room, so a short wide card in a grid track still reads as a panel
     * ON a field rather than a panel with a coloured border.
     */
    row?: boolean;
    className?: string;
    children?: React.ReactNode;
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
export declare function ArtFrame({ kind, row, className, children }: ArtFrameProps): import("react").JSX.Element;
export interface ArtPanelProps {
    /**
     * The header strip. Usually traffic lights and an `<ArtTitle>`. Omitted
     * entirely when absent — an empty 32px bar reads as a rendering bug.
     */
    bar?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
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
export declare function ArtPanel({ bar, className, children }: ArtPanelProps): import("react").JSX.Element;
export interface ArtTitleProps {
    className?: string;
    children: React.ReactNode;
}
/**
 * The label in an `ArtPanel` bar. Exists only to carry the gap that separates it
 * from the traffic lights — which is wider than the bar's own `gap` because the
 * lights are one object and the title is the next.
 */
export declare function ArtTitle({ className, children }: ArtTitleProps): import("react").JSX.Element;
export interface AppWindowProps {
    /**
     * The breadcrumb, left of the bar. Render the current surface as `<b>` and the
     * separator/parent as plain text — the styling for both is applied by
     * descendant selectors here, so a caller writes ordinary markup and gets the
     * product's own breadcrumb weights without importing two more components.
     */
    crumb?: React.ReactNode;
    /** The right-hand cluster — usually a `<StatPill>` and at most one button. */
    actions?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
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
export declare function AppWindow({ crumb, actions, className, children }: AppWindowProps): import("react").JSX.Element;
export interface ArtifactHeaderProps {
    /** The bold half of the crumb — usually the workspace or resource. */
    title?: React.ReactNode;
    /** The quiet half, after the separator. */
    source?: React.ReactNode;
    /** Between them. A node, because the live artifacts use a middot. */
    separator?: React.ReactNode;
    /** The pill's word, right-hand side of the bar. */
    summary?: React.ReactNode;
    summaryStatus?: StatPillStatus;
    /** Anything else in the bar, after the pill. */
    actions?: React.ReactNode;
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
export declare function artifactHeader({ title, source, separator, summary, summaryStatus, actions, }: ArtifactHeaderProps): {
    crumb?: React.ReactNode;
    bar?: React.ReactNode;
};
export interface PanelCaptionProps {
    className?: string;
    children: React.ReactNode;
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
export declare function PanelCaption({ className, children }: PanelCaptionProps): import("react").JSX.Element;
export interface AppPanelProps {
    className?: string;
    children?: React.ReactNode;
}
/**
 * The content card inside an `AppWindow` body — the shadcn Card recipe from
 * layouts.yaml, with no shadow (principles.md 16: flat panels take a border).
 *
 * It clips vertically and scrolls horizontally, which is the pairing that keeps
 * a wide table inside the artifact. Put the `min-w` on the table, never here, or
 * the page body scrolls instead of the panel.
 */
export declare function AppPanel({ className, children }: AppPanelProps): import("react").JSX.Element;
export type StatPillStatus = 'bad' | 'warn' | 'ok';
export interface StatPillProps {
    status: StatPillStatus;
    className?: string;
    children: React.ReactNode;
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
export declare function StatPill({ status, className, children }: StatPillProps): import("react").JSX.Element;
export interface DataTableProps {
    /** Column headings, left to right. Rendered as `<th scope="col">`. */
    columns: React.ReactNode[];
    /** `DataRow`s. */
    children: React.ReactNode;
    className?: string;
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
export declare function DataTable({ columns, children, className }: DataTableProps): import("react").JSX.Element;
export interface DataRowProps {
    /** `DataCell`s, one per column. */
    children: React.ReactNode;
    className?: string;
}
/**
 * One body row. The rule is 60% of `--border` — a full-strength line at this row
 * height turns a six-row table into a grid, and the header rule above it stops
 * reading as the header rule.
 */
export declare function DataRow({ children, className }: DataRowProps): import("react").JSX.Element;
export interface DataCellProps {
    /**
     * Monospace. For identifiers the reader is meant to match against their own
     * code — event names, file paths, table names.
     */
    mono?: boolean;
    /** Quieter and a step smaller. For the supporting half of a cell pair. */
    muted?: boolean;
    children?: React.ReactNode;
    className?: string;
}
/**
 * One body cell. `tabular-nums` is on by default and is not a nicety: these
 * tables are read by scanning a column of counts, and proportional digits make
 * the column jitter.
 */
export declare function DataCell({ mono, muted, children, className }: DataCellProps): import("react").JSX.Element;
//# sourceMappingURL=artifact-shell.d.ts.map