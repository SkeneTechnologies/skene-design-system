import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
function hairline(onLight) {
    return onLight ? 'var(--color-chrome-line-on-light)' : 'var(--color-chrome-line-subtle)';
}
function ringStyle(state, onLight) {
    if (state === 'done') {
        return {
            borderColor: 'color-mix(in oklab, var(--color-semantic-matcha) 55%, transparent)',
            background: 'color-mix(in oklab, var(--color-semantic-matcha) 12%, transparent)',
            color: 'var(--color-semantic-matcha)',
        };
    }
    if (state === 'active') {
        return {
            borderColor: 'var(--color-brand-peach)',
            background: 'color-mix(in oklab, var(--color-brand-peach) 14%, transparent)',
            color: 'var(--color-brand-peach)',
            // A halo rather than a thicker border: a 2px ring on the active step
            // alone would shift its label a pixel out of line with the others.
            boxShadow: '0 0 0 4px color-mix(in oklab, var(--color-brand-peach) 12%, transparent)',
        };
    }
    return { borderColor: hairline(onLight), background: 'transparent' };
}
export function PipelineStep({ label, state, icon, onLight = true, className }) {
    return (_jsxs("li", { "aria-current": state === 'active' ? 'step' : undefined, className: cn('flex min-w-0 items-center gap-3 sm:flex-col sm:gap-2.5 sm:text-center', 'sm:max-w-[160px] sm:flex-none', className), children: [_jsx("span", { "aria-hidden": true, className: cn('flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border text-[13px] leading-none', state === 'pending' && 'text-text-muted'), style: ringStyle(state, onLight), children: icon ??
                    (state === 'done' ? '✓' : _jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current" })) }), _jsx("span", { className: cn('text-[13px] leading-snug', state === 'active'
                    ? 'font-medium text-text-primary'
                    : state === 'done'
                        ? 'text-text-muted-strong'
                        : 'text-text-muted'), children: label })] }));
}
function PipelineConnector({ filled, onLight }) {
    return (_jsx("li", { "aria-hidden": true, className: cn(
        // Vertically: a 1px column indented to the centre of the 38px ring.
        'ml-[18px] h-4 w-px shrink-0', 
        // Horizontally: a 1px row pinned to that same centre, taking whatever
        // width is left between two steps.
        'sm:ml-0 sm:mt-[18px] sm:h-px sm:w-auto sm:min-w-[24px] sm:flex-1 sm:self-start'), style: { background: filled ? 'var(--color-semantic-matcha)' : hairline(onLight) } }));
}
export function PipelineStepper({ steps, title, subtitle, onLight = true, className, }) {
    const rows = [];
    steps.forEach((step, i) => {
        rows.push(_jsx(PipelineStep, { ...step, onLight: onLight }, `step-${i}`));
        if (i < steps.length - 1) {
            rows.push(_jsx(PipelineConnector, { filled: step.state === 'done', onLight: onLight }, `link-${i}`));
        }
    });
    return (_jsxs("div", { className: cn('p-[22px]', className), children: [title ? _jsx("p", { className: "text-[14px] text-text-primary", children: title }) : null, subtitle ? _jsx("p", { className: "mt-1 text-[12px] text-text-muted", children: subtitle }) : null, _jsx("ol", { className: cn('m-0 flex list-none flex-col items-stretch p-0 sm:flex-row sm:items-start sm:justify-between', title || subtitle ? 'mt-5' : ''), children: rows })] }));
}
