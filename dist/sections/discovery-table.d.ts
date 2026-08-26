import { type StatPillStatus } from './artifact-shell.js';
/**
 * The discovery artifact: Skene Cloud's Events table, drawn rather than
 * screenshotted.
 *
 * It is the one artifact that carries the product's actual claim in tabular
 * form — here is every event we found in your code, here is what changed about
 * it, here is where it lives, here is whether it still matches what you say you
 * measure. Four columns and a status per row is the whole argument, and the
 * shape is fixed because the argument is: a reader who has seen it once should
 * meet the same four columns in the same order on every page that carries it.
 *
 * ## Why this exists at all, when `DataTable` already exists
 *
 * `DataTable` is deliberately children-shaped: its cells are not uniform and a
 * `rows` array would have needed a renderer prop per column to say which ones
 * are monospace. This table's cells ARE uniform — event is always mono, the
 * location is always mono and quiet, the status is always a pill — so the
 * per-cell decision is made once here instead of at every call site. That is
 * the entire content of this file. Nothing below restyles a table, sets a
 * padding, or names a colour; every visual decision was taken in
 * `artifact-shell` and this composes it. If you find yourself adding a
 * `px-[12px]` here, the change belongs in the shell.
 *
 * ## The frame is NOT included, on purpose
 *
 * The prototype wraps this constant in the `db` texture, and a caller who wants
 * that picture writes it:
 *
 *     <ArtFrame kind="db"><DiscoveryTable … /></ArtFrame>
 *
 * Framing is a placement decision, not a property of the artifact. The
 * prototype proves it: the funnel — same light product register, same panel —
 * ships unframed in both its placements because a wide table on a square
 * halftone drawn for a card does not survive the crop. Baking `ArtFrame` in
 * would make the one arrangement that got looked at the only one reachable.
 *
 * ## Contrast, on a light panel — read this before shipping it
 *
 * `AppWindow` forces `light`, so every `StatPill` in the status column resolves
 * its semantic colour against a cream card. `rules.yaml known_gaps:
 * light_mode_brand_palette` measures amber at 1.83:1 and error-red at 3.31:1
 * there, against a 4.5:1 floor, and this component puts one of those on every
 * row. The prototype solved it with `--status-error-text` / `--status-warn-text`
 * — darkened light-surface variants that this package does not have. Inventing
 * them is `ask_first_when: a_token_value_would_change`, so the pills ship on the
 * untouched tokens and the gap is reported rather than papered over. The dot and
 * the rim were always the undarkened value, so only the label is affected.
 *
 * All content is props. Nothing here knows what a Skene event is called, which
 * repository it came from, or how many of them are unmapped.
 */
export interface DiscoveryColumns {
    /** Heading over the event names. */
    event: React.ReactNode;
    /** Heading over the kind of change — removed, renamed, moved. */
    type: React.ReactNode;
    /** Heading over the source location. */
    foundAt: React.ReactNode;
    /** Heading over the status pills. */
    status: React.ReactNode;
}
export interface DiscoveryEvent {
    /**
     * The event name. Monospace, because the reader is meant to match it against
     * a string in their own code.
     */
    event: React.ReactNode;
    /** What happened to it. Prose, in the reader's own words. */
    type: React.ReactNode;
    /**
     * Where it was found — file and line. Monospace and quiet: it is the
     * supporting half of the row, not something to scan down.
     */
    foundAt?: React.ReactNode;
    /** Which of the three states the row is in. Colours the pill. */
    status: StatPillStatus;
    /** The word inside the pill. `status` is the colour, this is the finding. */
    statusLabel: React.ReactNode;
}
export interface DiscoveryTableProps {
    /**
     * The four headings. An object rather than an array so a caller cannot
     * silently transpose two of them — the columns are fixed, only their wording
     * is the consumer's.
     */
    columns: DiscoveryColumns;
    /** One row per discovered event, in the order they should be read. */
    rows: DiscoveryEvent[];
    /** The current surface, rendered bold as the leading breadcrumb segment. */
    title?: React.ReactNode;
    /** What the scan was scoped to — a repository, workspace or project. */
    source?: React.ReactNode;
    /**
     * Breadcrumb separator. A glyph rather than a word, but still a prop: a
     * right-to-left page wants a different one.
     */
    separator?: React.ReactNode;
    /**
     * The headline count in the bar's pill — the one number the artifact is
     * making. Omit it and the pill disappears.
     */
    summary?: React.ReactNode;
    /**
     * Colour of that pill. Defaults to `bad` because the artifact exists to show
     * a scan that found something; a clean scan passes `ok` and says so.
     */
    summaryStatus?: StatPillStatus;
    /** Anything further in the bar's right cluster — at most one button. */
    actions?: React.ReactNode;
    className?: string;
}
export declare function DiscoveryTable({ columns, rows, title, source, separator, summary, summaryStatus, actions, className, }: DiscoveryTableProps): import("react").JSX.Element;
//# sourceMappingURL=discovery-table.d.ts.map