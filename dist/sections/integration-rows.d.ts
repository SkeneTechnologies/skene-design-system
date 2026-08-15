import { type StatPillStatus } from './artifact-shell.js';
/**
 * The integrations artifact: Skene Cloud's connections screen, drawn rather
 * than screenshotted.
 *
 * It is the surface where a reader sees what Skene is actually attached to — a
 * Supabase project, a repository, a branch — and, next to each one, whether it
 * is connected. That second half is the argument: an integration list whose
 * rows are all green says something different from one with a row that reads
 * "not assigned", and the whole artifact exists so a reader learns that this
 * product tells you which is which instead of failing quietly.
 *
 * It is drawn and not captured for a blunter reason than the other artifacts:
 * the live screen carries production project refs and a real repository name in
 * every row. There is nothing on it that survives a screenshot.
 *
 * ## Why rows and not a `DataTable`
 *
 * This is the one product surface in the set that is a list, not a table, and
 * porting it as a two-column table would be a mistake that only shows up at
 * 390px. A table column has one width for every row; here the left cell is a
 * name over a supporting line that is sometimes a sentence and sometimes a run
 * of identifier chips, and the right cell is a pill whose width is its word. So
 * it is a `minmax(0, 1fr) auto` grid per row, which lets the prose column
 * collapse to nothing and the pill keep its intrinsic width — the same
 * behaviour a table would need `table-layout` gymnastics to fake, and the
 * reason this artifact needs no horizontal scroll at any width.
 *
 * `<ul>` / `<li>` rather than divs, which the prototype could not express in a
 * static page it was hand-writing: four integrations are a stack of peers, and
 * a reader on a screen reader should be told there are four of them.
 *
 * ## The frame is NOT included, on purpose
 *
 * The prototype wraps this constant in the `db` texture, and a caller who wants
 * that picture writes it:
 *
 *     <ArtFrame kind="db"><IntegrationRows … /></ArtFrame>
 *
 * Framing is a placement decision, not a property of the artifact — the same
 * call `DiscoveryTable` documents at length. This constant appears at three
 * different widths in the prototype's own pages.
 *
 * ## Identifier chips are content, and the caller brings them
 *
 * Two of the four rows put their supporting line in the prototype's `.chip` —
 * `acme-production`, `acme/checkout`, `main`. That chip is already in the
 * package as `TagChip` (key-value-table.tsx), and `note` takes a node
 * specifically so a caller passes `<TagChip>` for an identifier and plain text
 * for a sentence. Baking the chip in here would put a border round every note,
 * including the ones that are prose; picking it by sniffing the node would be
 * worse. A `note` that is a bare unchipped identifier is the one thing that can
 * widen this row, which is why the name block is `wrap-anywhere` — the
 * prototype had no such rule because it controlled every string, and this
 * component controls none of them.
 *
 * ## Contrast, on a light panel — read this before shipping it
 *
 * `AppWindow` forces `light`, so every `StatPill` here resolves its semantic
 * colour against a cream card. `rules.yaml known_gaps:
 * light_mode_brand_palette` measures amber at 1.83:1 there against a 4.5:1
 * floor, and the artifact's whole point is the amber row. The prototype solved
 * it with `--status-warn-text`, a darkened light-surface variant this package
 * does not have; inventing one is `ask_first_when: a_token_value_would_change`,
 * so the pill ships on the untouched token and the gap is reported rather than
 * papered over.
 *
 * ## Spacing
 *
 * Read the header of `artifact-shell.tsx` before touching a padding here. The
 * package sets `--spacing: 0.2rem`, so Tailwind's `p-3` is 9.6px while the
 * prototype's `--spacing-3` is 12px. Every value below is the literal px the
 * prototype token carries, so it diffs against `artifacts.css` line for line.
 * `p-[12px]` is not a candidate for tidying into `p-3`.
 *
 * All content is props. Nothing here knows what a Skene integration connects
 * to, which project is assigned to which environment, or what "connected"
 * should be called in the reader's language.
 */
export interface Integration {
    /**
     * React key. Falls back to the row index, which is correct for an authored
     * artifact, but supply one if the rows are ever filtered or reordered.
     */
    id?: string;
    /** What is connected. The line a reader scans down. */
    name: React.ReactNode;
    /**
     * The supporting line under the name: a sentence about the connection, or a
     * run of `<TagChip>`s naming the project, repository and branch it is bound
     * to. Optional — a row whose name says everything does not need one.
     */
    note?: React.ReactNode;
    /**
     * Which of the three states the row is in. Colours the pill; omit it and the
     * row carries no pill at all.
     *
     * The artifact's own vocabulary maps onto this and is not a fourth state:
     * connected is `ok`, unassigned or degraded is `warn`, and a connection that
     * has broken is `bad`.
     */
    status?: StatPillStatus;
    /**
     * The word inside the pill. `status` is the colour, this is what the product
     * calls it — "connected", "assigned", "not assigned".
     */
    statusLabel?: React.ReactNode;
    /**
     * Anything further in the row's right-hand cluster, after the pill: the
     * "Connect" affordance a disconnected row would carry in the live product.
     * A row with neither this nor a `status` collapses to a single column rather
     * than reserving an empty track.
     */
    aside?: React.ReactNode;
    className?: string;
}
export interface IntegrationRowsProps {
    /** One row per connection, in the order they should be read. */
    rows: Integration[];
    /** The current surface, rendered bold as the leading breadcrumb segment. */
    title?: React.ReactNode;
    /** What the connections belong to — a workspace, repository or project. */
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
     * Colour of that pill. Defaults to `ok`, which is the opposite of
     * `DiscoveryTable`'s default and deliberate: a scan artifact exists because
     * it found something, whereas a connections list is a statement that the
     * plumbing is in place, with the exceptions called out row by row.
     */
    summaryStatus?: StatPillStatus;
    /** Anything further in the bar's right cluster — at most one button. */
    actions?: React.ReactNode;
    className?: string;
}
export declare function IntegrationRows({ rows, title, source, separator, summary, summaryStatus, actions, className, }: IntegrationRowsProps): import("react").JSX.Element;
//# sourceMappingURL=integration-rows.d.ts.map