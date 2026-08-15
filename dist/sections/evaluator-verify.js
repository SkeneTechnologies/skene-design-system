import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { EvaluatorNote } from './evaluator-list.js';
import { TagChip } from './key-value-table.js';
import { cn } from '../lib/utils.js';
import { AppPanel, AppWindow, ArtFrame, StatPill, PanelCaption, } from './artifact-shell.js';
/**
 * The Evaluator's Verify tab: a list of the signals an evaluation needs, each
 * with a verdict.
 *
 * The product runs a verification and reports, requirement by requirement,
 * whether the signal was actually found in code or in runtime samples. That is
 * the whole argument of the surface — a plan is not launch-ready because someone
 * wrote it down; it is launch-ready when the signals it depends on exist — so the
 * component is a list of rows with a status held at the right, and nothing else.
 * There is no chart and no total, because a total lets the reader average away
 * the one missing property that silently drops an account off the list.
 *
 * ## One component, two cuts
 *
 * The prototype has two of these and they differ only in where they spend the
 * reader's attention: one expands a single event's five required fields and lets
 * the other events stand as one row each; the other lists three sibling events
 * and expands none of them. That is a content decision, not a layout one, which
 * is why `fields` hangs off a requirement rather than being a separate mode. A
 * caller chooses the cut by choosing which requirement gets fields.
 *
 * Fields NEST in the API and FLATTEN in the DOM. The prototype writes them as
 * sibling rows with an indent class, and keeping that flat would let a field row
 * exist with no event above it — a shape that means nothing, since a required
 * field is required *of* something. Nesting makes the relationship
 * unrepresentable-if-wrong; flattening on render keeps the single rule between
 * every pair of rows, and lets `last:border-b-0` drop the final rule for free
 * whether the list ends on an event or on one of its fields.
 *
 * ## Why the meta pills are not `Chip`
 *
 * "event" / "formula input" are drawn here rather than through `./chip.js`.
 * `Chip` is the marketing chip — 10px, 5px radius, three colour tones, and it is
 * browser-verified at that geometry on the plan cards and the window title bar.
 * This is the product's own meta pill: 11px mono, 6px radius, `bg-muted` inside
 * `border-border`, no tone vocabulary at all. Bending `Chip` to cover both would
 * have restyled two shipped surfaces to save a `<span>`. The same pill appears in
 * the Check tab, Lifecycle and MCP artifacts, so it probably wants to be one
 * exported component once those exist — that is a decision about the package's
 * public surface, not part of this port, so it stays local and unexported here.
 *
 * ## Two carried-over hazards
 *
 * Spacing is literal px throughout, for the reason `artifact-shell` documents at
 * length: `--spacing: 0.2rem` makes Tailwind's `p-3` 9.6px while the
 * `--spacing-3` this was ported from is 12px. Tidying `p-[12px]` into `p-3` is a
 * silent 20% shrink and nothing warns.
 *
 * `StatPill` renders on `AppWindow`'s forced-`light` ground, where `bad` and
 * `warn` are the two states with no light-mode value yet — see `rules.yaml`
 * `known_gaps: light_mode_brand_palette`. The prototype darkened them through
 * `--status-*-text`; this package has no such token and inventing one is
 * `ask_first_when: a_token_value_would_change`. Reported, not papered over.
 *
 * All content is props. Nothing here knows what a signal is called, which
 * repository it lives in, or why it is missing.
 */
/* ── the meta pill ────────────────────────────────────────────────────────── */
/**
 * Exported for `evaluator-panel.tsx` ONLY, which renders the same requirement
 * rows in its right-hand pane. It was unexported and copied there line-for-line
 * until 2026-08-13; two copies of a pill is two places for a padding value to
 * drift, and the copy is what this export removes.
 *
 * Not in the barrel and not a public part: a caller wanting a small tag reaches
 * for `TagChip`. See `docs/sections.md` §2 — this shape has five names already.
 *
 * `mt-[8px]` is the row's override of the pill's own margin, so a run of pills
 * clears the note above it and still wraps with a gap on both axes at 390px.
 */
export function MetaPill({ children }) {
    return _jsx(TagChip, { className: "mt-[8px]", children: children });
}
/**
 * Exported for `evaluator-panel.tsx` only, for the same reason `MetaPill` is.
 *
 * The grid is `minmax(0, 1fr) auto` rather than `1fr auto` so the left column can
 * actually shrink below its content — `1fr` floors at min-content, and an event
 * name like `quiet_customer_reactivated_within_30_days` is one unbreakable word.
 * With the floor removed, `[overflow-wrap:anywhere]` on the name does the rest,
 * which is what keeps this artifact off the page's horizontal scrollbar at 390px.
 *
 * The rule is 60% of `--border`, the same value `DataRow` uses: at this row
 * height a full-strength line turns a seven-row list into a grid and the header
 * rule above stops reading as the header rule.
 */
export function VerifyRow({ name, note, tags, status, verdict, field, }) {
    return (_jsxs("div", { className: cn('grid grid-cols-[minmax(0,1fr)_auto] items-start gap-[12px] border-b p-[12px] last:border-b-0', field && 'pl-[24px]'), style: { borderBottomColor: 'color-mix(in oklab, var(--border) 60%, transparent)' }, children: [_jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: cn('font-mono text-[13px] text-foreground [overflow-wrap:anywhere]', field && 'text-[12px] text-muted-foreground'), children: name }), note ? (_jsx("small", { className: "mt-[2px] block text-[12px] text-muted-foreground", children: note })) : null, tags?.map((tag, i) => _jsx(MetaPill, { children: tag }, i))] }), _jsx(StatPill, { status: status, children: verdict })] }));
}
export function EvaluatorVerify({ crumb, summary, title, subtitle, requirements, note, frame = 'jr', className, }) {
    const artifact = (_jsxs(AppWindow, { crumb: crumb, actions: summary ? _jsx(StatPill, { status: summary.status, children: summary.label }) : undefined, className: frame === false ? className : undefined, children: [_jsxs(AppPanel, { children: [_jsxs(PanelCaption, { children: [_jsx("span", { children: title }), subtitle ? _jsx("span", { className: "text-[11px] text-muted-foreground", children: subtitle }) : null] }), requirements.map((requirement, i) => (_jsxs(Fragment, { children: [_jsx(VerifyRow, { ...requirement }), requirement.fields?.map((f, j) => _jsx(VerifyRow, { ...f, field: true }, j))] }, i)))] }), note ? _jsx(EvaluatorNote, { children: note }) : null] }));
    if (frame === false)
        return artifact;
    return (_jsx(ArtFrame, { kind: frame, className: className, children: artifact }));
}
