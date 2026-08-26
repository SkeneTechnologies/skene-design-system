import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment } from 'react';
import { cn } from '../lib/utils.js';
import { AppPanel, AppWindow, ArtFrame, DataCell, DataRow, DataTable, StatPill, PanelCaption, } from './artifact-shell.js';
import { EvaluatorNote, } from './evaluator-list.js';
import { VerifyRow, } from './evaluator-verify.js';
export function EvaluatorPanel({ crumb, summary, list, detail, note, split = false, activeIndex = 0, frame = 'jr', className, }) {
    // The detail panel is one recipe used by both layouts, so the two cannot
    // drift apart in what an opened evaluation looks like. Only its margin
    // differs: the stacked layout carries `.evl`'s 12px itself, the split
    // layout's grid gap supplies it.
    const detailPanel = (extraClassName) => (_jsxs(AppPanel, { className: extraClassName, children: [_jsxs(PanelCaption, { children: [_jsx("span", { children: detail.title }), detail.subtitle ? (_jsx("span", { className: "text-[11px] text-muted-foreground", children: detail.subtitle })) : null] }), detail.requirements.map((requirement, i) => (_jsxs(Fragment, { children: [_jsx(VerifyRow, { ...requirement }), requirement.fields?.map((f, j) => _jsx(VerifyRow, { ...f, field: true }, j))] }, i)))] }));
    const body = split ? (_jsxs("div", { className: "grid grid-cols-1 gap-[12px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]", children: [_jsxs(AppPanel, { className: "dark self-start", children: [_jsxs(PanelCaption, { children: [_jsx("span", { children: list.columns.name }), _jsx("span", { className: "text-[11px] text-muted-foreground", children: list.columns.confirmed })] }), _jsx("div", { className: "p-[8px]", children: list.evaluations.map((evaluation, i) => (_jsxs("div", { className: cn('flex items-baseline justify-between gap-[10px] rounded-lg px-[10px] py-[8px] text-[13px]', i === activeIndex ? 'bg-muted text-foreground' : 'text-muted-foreground'), children: [_jsx("span", { children: evaluation.name }), _jsx("span", { className: cn('shrink-0 font-mono text-[11px] tabular-nums', i === activeIndex ? 'text-brand-peach' : 'text-muted-foreground'), children: evaluation.confirmed })] }, i))) })] }), detailPanel()] })) : (_jsxs(_Fragment, { children: [_jsx(AppPanel, { children: _jsx(DataTable, { columns: [
                        list.columns.name,
                        list.columns.check,
                        list.columns.metric,
                        list.columns.confirmed,
                    ], children: list.evaluations.map((evaluation, i) => (_jsxs(DataRow, { children: [_jsx(DataCell, { children: evaluation.name }), _jsx(DataCell, { children: _jsx(StatPill, { status: evaluation.check.status, children: evaluation.check.label }) }), _jsx(DataCell, { children: evaluation.metric }), _jsx(DataCell, { mono: true, muted: true, children: evaluation.confirmed })] }, i))) }) }), detailPanel('mt-[12px]')] }));
    const artifact = (_jsxs(AppWindow, { crumb: crumb, actions: summary ? _jsx(StatPill, { status: summary.status, children: summary.label }) : undefined, className: frame === false ? className : undefined, children: [body, note ? _jsx(EvaluatorNote, { children: note }) : null] }));
    if (frame === false)
        return artifact;
    return (_jsx(ArtFrame, { kind: frame, className: className, children: artifact }));
}
