import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils.js';
export function FlowDiagram({ children, note, className }) {
    return (_jsxs("div", { className: cn('min-w-0', className), children: [_jsx("ol", { className: "m-0 flex list-none items-stretch gap-[8px] overflow-x-auto p-0 pb-[8px]", children: children }), note ? (_jsx("p", { className: "mt-[12px] text-[12px] text-muted-foreground [&_code]:font-mono [&_code]:text-foreground", children: note })) : null] }));
}
/**
 * One stop on the path. A card, not a chip, because it carries two registers —
 * a human name and a machine identifier — and the second is the one that makes
 * the diagram checkable against the reader's own site.
 */
export function FlowNode({ label, detail, className }) {
    return (_jsxs("li", { className: cn('min-w-0 flex-none rounded-sm border border-border bg-card px-[12px] py-[8px]', className), children: [_jsx("b", { className: "block text-[13px] font-medium text-foreground", children: label }), detail ? (_jsx("span", { className: "block font-mono text-[11px] text-muted-foreground", children: detail })) : null] }));
}
/**
 * The link between two nodes: an arrow, a figure, and a quieter second line.
 *
 * `min-w-[54px]` is a floor, not a width. It keeps every arrow in a path the
 * same length regardless of whether its figure is "9%" or "100%", so the nodes
 * fall on an even rhythm and the eye reads the chain rather than the gaps.
 */
export function FlowEdge({ value, meta, className }) {
    return (_jsxs("li", { className: cn('flex min-w-[54px] flex-none flex-col items-center gap-px self-center font-mono text-[11px] text-muted-foreground', className), children: [_jsx(ArrowRight, { "aria-hidden": true, className: "size-[14px] shrink-0 text-brand-bronze" }), value ? _jsx("b", { className: "font-medium text-foreground", children: value }) : null, meta] }));
}
