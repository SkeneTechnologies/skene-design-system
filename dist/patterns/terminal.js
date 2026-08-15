import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * A terminal / code frame.
 *
 * Skene's product is a CLI and a GitHub check, so a terminal frame appears on
 * product pages, docs and onboarding across both apps. Having one here stops
 * each surface hand-rolling its own traffic lights.
 *
 * Colours come from `color.terminal.*` and `color.terminal-chrome.*`, which are
 * mode-invariant on purpose: a terminal that turns white in light mode stops
 * reading as a terminal. The chrome styling lives in styles/effects.css as
 * `.skene-terminal`, so the same frame is available to consumers who want the
 * look without importing a component.
 */
export function Terminal({ title, className, children }) {
    return (_jsxs("div", { className: cn('skene-terminal font-mono text-[12px]', className), children: [_jsx("div", { className: "skene-terminal-bar", children: title ? (_jsx("span", { className: "text-[11px] text-[var(--color-terminal-muted)]", children: title })) : null }), _jsx("div", { className: "p-3 leading-relaxed", children: children })] }));
}
export function TerminalLine({ prompt, className, children }) {
    return (_jsxs("div", { className: cn('whitespace-pre-wrap', className), children: [prompt ? (_jsx("span", { "aria-hidden": "true", className: "mr-2 text-[var(--color-brand-peach)]", children: "$" })) : null, children] }));
}
