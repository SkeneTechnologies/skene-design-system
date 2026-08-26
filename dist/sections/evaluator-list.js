import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
import { AppPanel, AppWindow, ArtFrame, DataCell, DataRow, DataTable, StatPill, } from './artifact-shell.js';
export function EvaluatorList({ crumb, summary, columns, evaluations, note, frame = 'jr', className, }) {
    const artifact = (_jsxs(AppWindow, { crumb: crumb, actions: summary ? _jsx(StatPill, { status: summary.status, children: summary.label }) : undefined, className: frame === false ? className : undefined, children: [_jsx(AppPanel, { children: _jsx(DataTable, { columns: [columns.name, columns.check, columns.metric, columns.confirmed], children: evaluations.map((evaluation, i) => (_jsxs(DataRow, { children: [_jsx(DataCell, { children: evaluation.name }), _jsx(DataCell, { children: _jsx(StatPill, { status: evaluation.check.status, children: evaluation.check.label }) }), _jsx(DataCell, { children: evaluation.metric }), _jsx(DataCell, { mono: true, muted: true, children: evaluation.confirmed })] }, i))) }) }), note ? _jsx(EvaluatorNote, { children: note }) : null] }));
    if (frame === false)
        return artifact;
    return (_jsx(ArtFrame, { kind: frame, className: className, children: artifact }));
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
export function EvaluatorNote({ children, className }) {
    return (_jsx("div", { className: cn(
        // 12px is `--spacing-3`, written literally. `--spacing: 0.2rem` makes
        // Tailwind's `mt-3` 9.6px, so the numerically-similar step is a silent
        // 20% shrink; see the note at the top of `artifact-shell.tsx`.
        'mt-[12px] text-[12px] text-muted-foreground [&_code]:font-mono [&_code]:text-foreground [&_code]:wrap-anywhere', className), children: children }));
}
