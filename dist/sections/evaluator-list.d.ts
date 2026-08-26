import { type ArtFrameKind, type StatPillStatus } from './artifact-shell.js';
/**
 * The Evaluator index: every evaluation in a workspace, and whether the signals
 * it depends on have actually been found.
 *
 * This is the surface a reader lands on before any single evaluation is opened,
 * and the argument it carries is a count. Each row is a plan someone wrote, a
 * verdict on that plan, the metric it would produce, and how many of its
 * required signals were confirmed. A page of plans that all read `0 / n` says
 * something no prose on the same page can: the product refuses to call a plan
 * ready, and it says so on the index rather than three clicks in.
 *
 * ## Why this is a table when its sibling is not
 *
 * `EvaluatorVerify` renders the same product's Verify tab as a stack of grid
 * rows, because there every left-hand cell is three stacked things of three
 * different sizes and the "table" would be one cell containing a layout. Here
 * the opposite holds: four uniform columns, one value each, and a column of
 * counts the reader scans straight down. That is a table, so this composes
 * `DataTable` from `artifact-shell` — which already owns Skene Cloud's density
 * (36px header, 11px uppercase headings at 0.16em, 13px tabular-numeral cells)
 * and gets the `tabular-nums` that stops the `0 / 10` column jittering.
 *
 * ## The column set is fixed; only its words are props
 *
 * `columns` is an object of four labelled slots rather than an array, and the
 * entries carry the same four keys. That is deliberate. This component depicts
 * one real screen with one real column set, so the number and meaning of the
 * columns are structure — but every visible string in them is copy and belongs
 * to the consumer. An array plus a positional row tuple would let a caller ship
 * "Metric" over the confirmed counts and nothing would catch it. A caller who
 * wants a different table wants `DataTable` inside an `AppWindow`, which is two
 * exports away and is what this is built from.
 *
 * The verdict is a `{ status, label }` pair for the same reason `summary` is:
 * a default status would let a caller who supplied only the words ship a green
 * pill reading "verifying", and that failure is invisible in a diff.
 *
 * `StatPill` renders on `AppWindow`'s forced-`light` ground, where `bad` and
 * `warn` have no light-mode value yet — see `rules.yaml`
 * `known_gaps: light_mode_brand_palette`. The prototype darkened them through
 * `--status-*-text`; this package has no such token and inventing one is
 * `ask_first_when: a_token_value_would_change`. Reported, not papered over.
 *
 * All content is props. Nothing here knows what an evaluation is called, which
 * repository it belongs to, or how many of its signals arrived.
 */
export interface EvaluatorListColumns {
    /** Heading over the plan's own name. */
    name: React.ReactNode;
    /** Heading over the verdict pill. */
    check: React.ReactNode;
    /** Heading over the metric the plan would produce. */
    metric: React.ReactNode;
    /** Heading over the confirmed-signal count. */
    confirmed: React.ReactNode;
}
export interface EvaluationEntry {
    /**
     * The plan, in the hypothesis's own words. Sentence case and long on purpose —
     * this column is the reason the artifact reads as something a person wrote
     * rather than a row a tool generated, so it is not truncated and not
     * monospaced.
     */
    name: React.ReactNode;
    /** The verdict. Both halves together or neither; see the file header. */
    check: {
        status: StatPillStatus;
        label: React.ReactNode;
    };
    /** The metric this plan would produce once its signals exist. */
    metric?: React.ReactNode;
    /**
     * How many required signals were confirmed, as a fraction. Set monospace and
     * muted (`DataCell mono muted`) because it is evidence, not a headline — a
     * count that outweighed the plan beside it would turn the index into a
     * scoreboard, and the whole point is that none of these have a score yet.
     */
    confirmed?: React.ReactNode;
}
export interface EvaluatorListProps {
    /**
     * The breadcrumb. Passed straight to `AppWindow`, which styles `<b>` as the
     * current surface and everything else as its parent — so a caller writes
     * `<><b>Surface</b><span>/</span><span>repo</span></>` and gets the product's
     * own weights. Omitting both this and `summary` drops the bar entirely.
     */
    crumb?: React.ReactNode;
    /** The header pill: usually what the whole index adds up to. */
    summary?: {
        status: StatPillStatus;
        label: React.ReactNode;
    };
    columns: EvaluatorListColumns;
    evaluations: EvaluationEntry[];
    /**
     * The paragraph under the panel that says what the reader is looking at. A
     * `<code>` inside it is picked up and set in mono against `--foreground`.
     */
    note?: React.ReactNode;
    /**
     * Which texture backs the frame, or `false` for none.
     *
     * `jr` is the default because measurement artifacts sit on card1 across the
     * live site. `false` exists because framing is a page-composition decision
     * and some artifacts opt out; it is decided by looking, not by a width rule.
     */
    frame?: ArtFrameKind | false;
    /** Lands on the outermost element — the frame, or the window when unframed. */
    className?: string;
}
export declare function EvaluatorList({ crumb, summary, columns, evaluations, note, frame, className, }: EvaluatorListProps): import("react").JSX.Element;
export interface EvaluatorNoteProps {
    children: React.ReactNode;
    className?: string;
}
/**
 * The caption under the panel — the page's own voice about what was just shown.
 *
 * It sits OUTSIDE the panel on purpose. Inside, it would read as copy the
 * product wrote; outside, it is plainly the page explaining a depiction. These
 * artifacts are only worth anything if a reader can tell those two apart.
 *
 * `<code>` is styled by descendant selector rather than by a second component,
 * because the caller is writing a sentence and should be able to put an
 * identifier in it using the tag that means identifier. Same idiom as
 * `AppWindow`'s `<b>` in the breadcrumb.
 *
 * Exported, and it is the only piece of shared `.evl` chrome this file exports:
 * the same strip is currently inlined verbatim in `evaluator-verify.tsx` and
 * `evaluator-check.tsx` because all three were written at once. Whoever merges
 * these should point those two at this and delete their copies — one strip, one
 * definition — rather than leaving three that will drift.
 */
export declare function EvaluatorNote({ children, className }: EvaluatorNoteProps): import("react").JSX.Element;
//# sourceMappingURL=evaluator-list.d.ts.map