import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { STATUS_TOKEN } from '../lib/status.js';
import { cn } from '../lib/utils.js';
/** Geometry, in viewBox units. r is chosen so the stroke never clips the box. */
const R = 42;
const CIRCUMFERENCE = 2 * Math.PI * R;
export function ScoreRing({ value, max = 100, status = 'warn', size = 64, label, className, }) {
    const clamped = Math.max(0, Math.min(max, value));
    const fraction = max === 0 ? 0 : clamped / max;
    return (_jsxs("div", { role: "img", "aria-label": `${label}: ${clamped} out of ${max}`, className: cn('relative shrink-0', className), style: { width: size, height: size }, children: [_jsxs("svg", { viewBox: "0 0 100 100", className: "h-full w-full -rotate-90", "aria-hidden": true, focusable: "false", children: [_jsx("circle", { cx: "50", cy: "50", r: R, fill: "none", strokeWidth: "8", 
                        // Mixed from currentColor so the track follows a `light` ancestor.
                        // There is no mode-aware line token; `chrome.line.*` is one ground or
                        // the other and would vanish on the one it was not made for.
                        stroke: "color-mix(in oklab, currentColor 14%, transparent)" }), _jsx("circle", { cx: "50", cy: "50", r: R, fill: "none", strokeWidth: "8", strokeLinecap: "round", stroke: STATUS_TOKEN[status], strokeDasharray: CIRCUMFERENCE, strokeDashoffset: CIRCUMFERENCE * (1 - fraction) })] }), _jsxs("div", { "aria-hidden": true, 
                // Stacked, not side by side. Set on one baseline — which is what the
                // first version did — "72 /100" is wider than the ring's inner
                // diameter at every size, and the denominator hangs over the arc.
                // Everything inside is em-based off this, so one `size` moves all of it.
                className: "absolute inset-0 flex flex-col items-center justify-center leading-none", style: { fontSize: size * 0.3 }, children: [_jsx("strong", { className: "font-medium text-text-primary", children: clamped }), _jsxs("span", { className: "mt-[0.15em] font-mono text-[0.42em] text-text-muted", children: ["/", max] })] })] }));
}
