import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import { AppPanel, AppWindow, ArtFrame, DataCell, DataRow, DataTable, StatPill, PanelCaption, } from './artifact-shell.js';
import { EvaluatorNote, } from './evaluator-list.js';
import { VerifyRow, } from './evaluator-verify.js';
export function EvaluatorPanel({ crumb, summary, list, detail, note, frame = 'jr', className, }) {
    const artifact = (_jsxs(AppWindow, { crumb: crumb, actions: summary ? _jsx(StatPill, { status: summary.status, children: summary.label }) : undefined, className: frame === false ? className : undefined, children: [_jsx(AppPanel, { children: _jsx(DataTable, { columns: [
                        list.columns.name,
                        list.columns.check,
                        list.columns.metric,
                        list.columns.confirmed,
                    ], children: list.evaluations.map((evaluation, i) => (_jsxs(DataRow, { children: [_jsx(DataCell, { children: evaluation.name }), _jsx(DataCell, { children: _jsx(StatPill, { status: evaluation.check.status, children: evaluation.check.label }) }), _jsx(DataCell, { children: evaluation.metric }), _jsx(DataCell, { mono: true, muted: true, children: evaluation.confirmed })] }, i))) }) }), _jsxs(AppPanel, { className: "mt-[12px]", children: [_jsxs(PanelCaption, { children: [_jsx("span", { children: detail.title }), detail.subtitle ? (_jsx("span", { className: "text-[11px] text-muted-foreground", children: detail.subtitle })) : null] }), detail.requirements.map((requirement, i) => (_jsxs(Fragment, { children: [_jsx(VerifyRow, { ...requirement }), requirement.fields?.map((f, j) => _jsx(VerifyRow, { ...f, field: true }, j))] }, i)))] }), note ? _jsx(EvaluatorNote, { children: note }) : null] }));
    if (frame === false)
        return artifact;
    return (_jsx(ArtFrame, { kind: frame, className: className, children: artifact }));
}
