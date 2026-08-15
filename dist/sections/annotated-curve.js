import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
const STROKE_TOKEN = {
    'brand-peach': 'var(--color-brand-peach)',
    'brand-peach-deep': 'var(--color-brand-peach-deep)',
    'accent-violet': 'var(--color-accent-violet)',
    'accent-blue': 'var(--color-accent-blue)',
    'semantic-matcha': 'var(--color-semantic-matcha)',
};
const SMOOTHING = 0.85;
const clamp = (v) => Math.max(0, Math.min(100, v));
const round = (v) => Math.round(v * 100) / 100;
/**
 * Catmull-Rom through every point, converted to cubic béziers. The endpoints
 * are doubled rather than mirrored so the curve starts and ends flat instead of
 * kicking out at a tangent it was never given data for.
 */
function splinePath(pts) {
    if (pts.length < 2)
        return '';
    const at = (i) => pts[Math.max(0, Math.min(pts.length - 1, i))];
    let d = `M ${round(at(0).x)} ${round(at(0).y)}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = at(i - 1);
        const p1 = at(i);
        const p2 = at(i + 1);
        const p3 = at(i + 2);
        const c1x = p1.x + ((p2.x - p0.x) / 6) * SMOOTHING;
        const c1y = p1.y + ((p2.y - p0.y) / 6) * SMOOTHING;
        const c2x = p2.x - ((p3.x - p1.x) / 6) * SMOOTHING;
        const c2y = p2.y - ((p3.y - p1.y) / 6) * SMOOTHING;
        d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2.x)} ${round(p2.y)}`;
    }
    return d;
}
function boxTransform(place, align, offset) {
    const x = align === 'start' ? '0%' : align === 'end' ? '-100%' : '-50%';
    switch (place) {
        case 'below':
            return `translate(${x}, ${offset}px)`;
        case 'left':
            return `translate(calc(-100% - ${offset}px), -50%)`;
        case 'right':
            return `translate(${offset}px, -50%)`;
        default:
            return `translate(${x}, calc(-100% - ${offset}px))`;
    }
}
export function AnnotatedCurve({ points, stroke = 'brand-peach', aspect = 2, offset = 14, className, }) {
    const color = STROKE_TOKEN[stroke];
    // Derived from the stroke token, NOT from useId: this component is
    // server-renderable and a hook would drag a client boundary around it. Two
    // curves with the same stroke on one page emit the same id, which is safe
    // precisely because the definition is a pure function of that token — the
    // gradients are byte-identical, so whichever one wins is the right one.
    const gradientId = `skene-curve-${stroke}`;
    // The viewBox is 100 wide and however tall `aspect` makes it, so a point's x
    // is already in user units and its y only has to be rescaled once.
    const height = 100 / (aspect > 0 ? aspect : 2);
    const plotted = points.map((p) => ({ x: clamp(p.x), y: (clamp(p.y) / 100) * height }));
    const d = splinePath(plotted);
    return (_jsxs("div", { className: cn('relative w-full', className), style: { aspectRatio: `${aspect}` }, children: [_jsxs("svg", { "aria-hidden": true, focusable: "false", viewBox: `0 0 100 ${round(height)}`, preserveAspectRatio: "xMidYMid meet", 
                // overflow-visible: the halo on a node at x=0 would otherwise be sheared
                // in half by the viewport edge.
                className: "absolute inset-0 h-full w-full overflow-visible", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: gradientId, gradientUnits: "userSpaceOnUse", x1: "0", x2: "100", children: [_jsx("stop", { offset: "0%", stopColor: color, stopOpacity: 0.12 }), _jsx("stop", { offset: "55%", stopColor: color, stopOpacity: 0.75 }), _jsx("stop", { offset: "100%", stopColor: color, stopOpacity: 1 })] }) }), d ? (_jsx("path", { d: d, fill: "none", stroke: `url(#${gradientId})`, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", 
                        // Without this the line weight is multiplied by the container width,
                        // so the same curve is a hairline on mobile and a rope on desktop.
                        vectorEffect: "non-scaling-stroke" })) : null, plotted.map((p, i) => points[i]?.label == null ? null : (
                    // A ring, not a filled disc with a halo. The node marks WHERE ON THE
                    // LINE the callout is attached, and a filled dot of the same colour
                    // as the line reads as a thickening of the line itself. A ring
                    // punches the ground through the middle, so the marker and the path
                    // stay legible as two different things — which is what the live
                    // figure does.
                    _jsx("circle", { cx: p.x, cy: p.y, r: 1.6, fill: "var(--color-surface-0)", stroke: color, strokeWidth: 2, vectorEffect: "non-scaling-stroke" }, i)))] }), _jsx("ol", { className: "absolute inset-0 m-0 list-none p-0", children: points.map((p, i) => p.label == null ? null : (_jsx("li", { className: cn('absolute w-max max-w-[62%] rounded-2xl border border-surface-border bg-surface-1 px-3 py-2', 'font-mono text-[11px] uppercase leading-[1.45] tracking-[0.04em] text-text-primary', p.className), style: {
                        left: `${clamp(p.x)}%`,
                        top: `${clamp(p.y)}%`,
                        transform: boxTransform(p.place ?? 'above', p.align ?? 'center', offset),
                    }, children: p.label }, i))) })] }));
}
