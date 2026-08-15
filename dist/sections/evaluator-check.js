import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { Badge } from '../ui/badge.js';
import { AppPanel, AppWindow, PanelCaption } from './artifact-shell.js';
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
export function CheckChip({ role = false, className, children }) {
    return (_jsx(Badge, { variant: "outline", className: cn('max-w-full rounded-sm px-[8px] py-[1px] font-mono text-[11px] font-normal wrap-anywhere', role ? 'border-foreground bg-foreground text-background' : 'bg-muted', className), children: children }));
}
/* ── operands ─────────────────────────────────────────────────────────────── */
/**
 * Mirrors `StatPill`'s table, which is not exported. Kept as its own three lines
 * rather than reaching into the shell because the shell's copy is private on
 * purpose; the vocabulary is shared by importing the *type*, so a fourth status
 * cannot appear on a dot without appearing on a pill first.
 *
 * `warn` is the default because that is what the depicted screen shows: an
 * operand the evaluator has looked for and not found. The other two exist so a
 * caller with a healthy operand is not forced to draw it amber.
 */
const DOT_TOKEN = {
    bad: 'var(--color-semantic-error-red)',
    warn: 'var(--color-semantic-warning-amber)',
    ok: 'var(--color-semantic-matcha)',
};
/**
 * One right-aligned label-over-value pair inside an operand row.
 *
 * `tabular-nums` on the value, for the reason `DataCell` gives: these are read
 * by scanning a column, and proportional digits make the column jitter. The
 * value is mono and the label is sans — the label is prose about the figure, the
 * figure is data.
 */
export function CheckFigure({ label, value, className }) {
    return (_jsxs("div", { className: cn('text-right', className), children: [_jsx("span", { className: "block font-sans text-[11px] uppercase tracking-[0.16em] text-muted-foreground", children: label }), _jsx("b", { className: "font-mono text-[14px] font-medium tabular-nums text-foreground", children: value })] }));
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
export function CheckOperand({ name, chips, tone = 'warn', figures, className, }) {
    return (_jsxs("div", { className: cn('flex flex-wrap items-center justify-between gap-[12px] border-b p-[12px]', className), style: { borderColor: 'color-mix(in oklab, var(--border) 60%, transparent)' }, children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-[8px]", children: [_jsx("span", { "aria-hidden": true, className: "size-[8px] shrink-0 rounded-full", style: { background: DOT_TOKEN[tone] } }), _jsx("span", { className: "font-mono text-[13px] text-foreground wrap-anywhere", children: name }), chips] }), figures ? _jsx("div", { className: "flex gap-[24px]", children: figures }) : null] }));
}
/**
 * One result box. A card on a card — `bg-card` inside the panel — which is the
 * product's own recipe from layouts.yaml and reads correctly because the panel
 * it sits in is the flat one.
 *
 * `min-w-0` is load-bearing: without it a long value sets the grid track's
 * minimum and the auto-fit row stops collapsing at 390px.
 */
export function CheckResult({ label, value, className }) {
    return (_jsxs("div", { className: cn('min-w-0 rounded-sm border border-border bg-card p-[12px]', className), children: [_jsx("span", { className: "block text-[11px] uppercase tracking-[0.16em] text-muted-foreground", children: label }), _jsx("b", { className: "mt-[8px] block text-[14px] font-medium text-foreground", children: value })] }));
}
export function EvaluatorCheck({ crumb, actions, heading, headingNote, metric, formula, qualifiers, children, results, note, className, }) {
    return (_jsxs(AppWindow, { crumb: crumb, actions: actions, className: className, children: [_jsxs(AppPanel, { children: [_jsxs(PanelCaption, { children: [_jsx("span", { children: heading }), headingNote ? (_jsx("span", { className: "text-[11px] text-muted-foreground", children: headingNote })) : null] }), _jsxs("div", { className: "flex flex-wrap items-start justify-between gap-[12px] border-b border-border p-[12px]", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "text-[14px] text-foreground", children: metric }), formula ? (_jsx("div", { className: "mt-[2px] font-mono text-[12px] text-muted-foreground wrap-anywhere", children: formula })) : null] }), qualifiers ? _jsx("div", { className: "flex flex-wrap gap-[8px]", children: qualifiers }) : null] }), children, results ? (_jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(min(140px,100%),1fr))] gap-[12px] p-[12px]", children: results })) : null] }), note ? _jsx("div", { className: "mt-[12px] text-[12px] text-muted-foreground", children: note }) : null] }));
}
