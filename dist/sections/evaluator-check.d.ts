import { type StatPillStatus } from './artifact-shell.js';
/**
 * The evaluator's Check tab: a metric, the formula under it, one row per
 * operand, and the three result boxes the formula never got to fill.
 *
 * This is the artifact that has to survive being read as a picture of a real
 * screen, so the anatomy is the screen's and not a tidied version of it. A
 * metric name and its formula on the left, qualifying chips held right; then
 * each named operand with a dot, its chips, and its CURRENT/PREVIOUS figures
 * held right; then a row of result boxes. Nothing here reorders when the
 * numbers are missing — the boxes still render, and what they carry is the
 * caller's em rule. That is the whole argument the artifact exists to make: a
 * dashboard in this position draws a line, and this surface declines to.
 *
 * ## Why this is one component with content props and not a tree of slots
 *
 * The five regions are fixed. `.chk__hd` is always above the operands, the
 * operands are always above `.chk__res`, and an evaluator that put the result
 * boxes first would be a picture of a product that does not exist. So the
 * regions are props on `EvaluatorCheck` and only the repeating parts —
 * operands, figures, results, chips — are separate components. Every one of
 * them is `React.ReactNode`: the package ships no copy, and nothing in this
 * file knows what a metric is called or which repository it belongs to.
 *
 * ## It stops at the AppWindow, on purpose
 *
 * The prototype builds this constant as the window and wraps it in the textured
 * frame at a different call site (`frame("jr", EVAL_CHECK)`). The split is kept
 * because the pairing carries meaning — see `ArtFrameKind` — and a component
 * that silently chose its own backdrop would take that decision away from the
 * page. Callers write `<ArtFrame kind="jr"><EvaluatorCheck …/></ArtFrame>`.
 *
 * ## Spacing is literal px, and that is deliberate
 *
 * Same trap `artifact-shell.tsx` documents at length: the package sets
 * `--spacing: 0.2rem`, so `p-3` is 9.6px while the `--spacing-3` this was ported
 * from is 12px. Every padding and gap below is written as the px the source
 * token carries so it diffs against artifacts.css line for line. Do not tidy
 * them into the numerically-similar Tailwind step.
 *
 * ## Responsive
 *
 * There are no media queries here and there should not be. Both header rows
 * wrap, the operand row wraps its figures under its name, the formula and the
 * operand names are `wrap-anywhere` because an event name is one unbroken token
 * that will otherwise widen the artifact past 390px, and the result grid is
 * `auto-fit` at `minmax(min(140px,100%),1fr)` — the inner `min()` is what lets
 * a single box shrink below 140px instead of forcing a horizontal scrollbar on
 * the page body.
 */
export interface CheckChipProps {
    /**
     * The filled variant: the product's Numerator / Denominator marker. Inverted
     * rather than tinted — it names the operand's part in the formula, which is
     * structure, while the outline chips beside it are attributes (kind, source).
     * Two visual weights for two kinds of fact, which is why this is a boolean and
     * not a colour.
     */
    role?: boolean;
    className?: string;
    children: React.ReactNode;
}
/**
 * The product-surface chip: monospace, bordered, quiet, theme-following.
 *
 * Not the marketing `Chip` from `chip.tsx`, and the difference is not a near
 * miss worth reconciling. That one is 10px uppercase display type on the brand
 * palette and marks identity or state; this one is 11px lowercase mono on the
 * shadcn ladder and carries a machine-readable attribute — `event`,
 * `Telemetry events` — inside a depiction of the app. They live on opposite
 * sides of the marketing/product line the shell's header describes.
 *
 * It composes `ui/badge` rather than restating it, on the same reasoning
 * `DataTable` composes `ui/table`: the primitive already owns the shape
 * (inline-flex, `rounded-sm`, border) and what differs is density and voice —
 * mono at 11px and regular weight against 12px semibold sans. Overriding those
 * through `cn` leaves one badge in the package; copying it to change them is
 * `copy_a_primitive_into_an_app_to_tweak_it`.
 *
 * The prototype's `.chip` carries a `0 4px 4px 0` margin for inline flow and
 * then zeroes it in both places this artifact uses it. The margin is dropped
 * here and every container below supplies a flex `gap` instead, so a chip
 * cannot contribute a stray 4px to a row it was never measured in.
 *
 * KNOWN DUPLICATE, recorded rather than laundered: `key-value-table.tsx` ports
 * the same two CSS rules as `TagChip`, written in parallel with this. They
 * differ in exactly the way their two artifacts differ — that one keeps the
 * prototype's flow margin because its chips wrap inside a table cell with no
 * flex parent to carry a `gap`, and it draws a bare `<span>` rather than
 * composing `ui/badge`. Both are defensible; two of them shipping is not. One
 * of the two should win before the barrel goes out, and the loser should become
 * an alias, not a second opinion about an 11px mono tag.
 */
export declare function CheckChip({ role, className, children }: CheckChipProps): import("react").JSX.Element;
export interface CheckFigureProps {
    /** The eyebrow — CURRENT, PREVIOUS. Uppercased by CSS, not by the caller. */
    label: React.ReactNode;
    /** The number, or the em rule that stands in for one. */
    value: React.ReactNode;
    className?: string;
}
/**
 * One right-aligned label-over-value pair inside an operand row.
 *
 * `tabular-nums` on the value, for the reason `DataCell` gives: these are read
 * by scanning a column, and proportional digits make the column jitter. The
 * value is mono and the label is sans — the label is prose about the figure, the
 * figure is data.
 */
export declare function CheckFigure({ label, value, className }: CheckFigureProps): import("react").JSX.Element;
export interface CheckOperandProps {
    /** The operand's identifier — monospace, and the thing the reader greps for. */
    name: React.ReactNode;
    /**
     * `<CheckChip>`s following the name: what kind of thing it is, its part in the
     * formula, where it is meant to come from.
     */
    chips?: React.ReactNode;
    /** The dot's state. Defaults to `warn`; see `DOT_TOKEN`. */
    tone?: StatPillStatus;
    /** `<CheckFigure>`s, held right. */
    figures?: React.ReactNode;
    className?: string;
}
/**
 * One operand of the formula: dot, name, chips, figures.
 *
 * The row is a wrapping flex rather than a two-column grid so that at 390px the
 * figures drop under the name instead of squeezing it — an event name is a
 * single unbreakable token and a grid track would either clip it or push the
 * page sideways.
 *
 * The dot is a real element and `aria-hidden`, matching `StatPill`: the
 * prototype draws it with `::before`, which is invisible to the pixel-contrast
 * harness's glyph diff and quietly skews the measurement of the whole artifact.
 * It says nothing the figures beside it do not already say.
 *
 * The rule under the row is 60% of `--border`, the same value `DataRow` uses, so
 * a stack of operands reads as a list and the full-strength rules above and
 * below it still read as the header and the footer.
 */
export declare function CheckOperand({ name, chips, tone, figures, className, }: CheckOperandProps): import("react").JSX.Element;
export interface CheckResultProps {
    /** CURRENT, PREVIOUS, CHANGE. */
    label: React.ReactNode;
    /** The computed value, or whatever the surface returns when it cannot compute. */
    value: React.ReactNode;
    className?: string;
}
/**
 * One result box. A card on a card — `bg-card` inside the panel — which is the
 * product's own recipe from layouts.yaml and reads correctly because the panel
 * it sits in is the flat one.
 *
 * `min-w-0` is load-bearing: without it a long value sets the grid track's
 * minimum and the auto-fit row stops collapsing at 390px.
 */
export declare function CheckResult({ label, value, className }: CheckResultProps): import("react").JSX.Element;
export interface EvaluatorCheckProps {
    /** The window breadcrumb. Current surface as `<b>`; see `AppWindow`. */
    crumb?: React.ReactNode;
    /** The window's right-hand cluster — usually a `<StatPill>`. */
    actions?: React.ReactNode;
    /** The panel header: what is being evaluated. */
    heading: React.ReactNode;
    /** The quieter half of that header — which tab, and the state of this window. */
    headingNote?: React.ReactNode;
    /** The metric's name, in prose. */
    metric: React.ReactNode;
    /** The metric's definition, monospace. */
    formula?: React.ReactNode;
    /** `<CheckChip>`s held right of the metric: target, window, anything qualifying. */
    qualifiers?: React.ReactNode;
    /** `<CheckOperand>`s, in formula order. */
    children?: React.ReactNode;
    /** `<CheckResult>`s. Rendered in a grid that collapses to one column. */
    results?: React.ReactNode;
    /**
     * The paragraph under the window. Outside the panel and inside the window,
     * where the prototype puts it — it is the page talking about the artifact, not
     * a caption the product renders.
     */
    note?: React.ReactNode;
    className?: string;
}
export declare function EvaluatorCheck({ crumb, actions, heading, headingNote, metric, formula, qualifiers, children, results, note, className, }: EvaluatorCheckProps): import("react").JSX.Element;
//# sourceMappingURL=evaluator-check.d.ts.map