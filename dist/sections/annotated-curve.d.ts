/**
 * The rising curve with monospace callouts pinned to points on it.
 *
 * Two layers, deliberately. The SVG draws the sweep and the node markers; the
 * callouts are plain HTML absolutely positioned over it. SVG `<text>` does not
 * wrap — every line break has to be authored as its own `<tspan>` at a
 * hand-chosen y — so a callout long enough to be a sentence either runs out of
 * the frame or gets re-broken by hand every time the copy changes. HTML text
 * wraps, selects, and finds. The curve is decoration and carries `aria-hidden`,
 * which leaves the annotations as the only thing in the accessibility tree, and
 * they are an ordered list because array order is the order they are read in —
 * absolute positioning moves them on screen, not in the DOM.
 *
 * The path is generated FROM the annotated points rather than authored beside
 * them. A hand-drawn path plus hand-placed dots drift apart the first time
 * either is edited; a Catmull-Rom spline passes exactly through every point it
 * is built from, so a node marker cannot end up floating off its own curve. It
 * can overshoot BETWEEN two points that are close in x and far apart in y —
 * that is the price of not shipping a control-point API, and the fix is to
 * spread the x values.
 *
 * A point with no `label` is an anchor: it shapes the sweep and renders
 * nothing. That is how the curve reaches the edges of the box without
 * extrapolating past the last node, because an invented tail is a tail the
 * author cannot see or steer.
 *
 * `aspect` is load-bearing, not a layout convenience. The viewBox height is
 * derived from it so the drawing scales uniformly. `preserveAspectRatio="none"`
 * would fit any box shape and is the obvious shortcut, but it scales x and y by
 * different factors and every node `<circle>` renders as an ellipse.
 *
 * `y` runs from the top, matching CSS `top` and SVG's own axis, so a rising
 * curve has DESCENDING y. One convention across both layers is what keeps a box
 * pinned to its node; two conventions is one sign error away from silently
 * mirroring the annotations against the curve.
 *
 * The boxes are opaque rather than tinted glass. They sit on points that are ON
 * the curve by construction, so the stroke always runs beneath them, and any
 * translucency puts a peach line through the middle of a monospace label. Their
 * surface and type use the mode-aware `surface.*` / `text.*` roles: this band
 * renders on light and dark grounds alike, and `chrome.*` is invariant — it
 * cannot invert, so it would render cream on cream. The flip side of being
 * mode-aware is that an always-dark band inside a light page has to carry
 * `dark`, the same rule `PlanCard featured` follows in the other direction.
 */
/** Curve colours, by token. A union rather than a free string so a hex literal
 *  cannot reach the stroke through the prop. */
export type CurveStrokeToken = 'brand-peach' | 'brand-peach-deep' | 'accent-violet' | 'accent-blue' | 'semantic-matcha';
/** Which side of its node the box sits on. Never centred on it — the box would
 *  cover the point it annotates. */
export type CurveLabelPlacement = 'above' | 'below' | 'left' | 'right';
/** Horizontal anchoring for `above` / `below`: which edge of the box lines up
 *  with the node. The escape hatch for a node near the frame edge, where a
 *  centred box would hang outside it. */
export type CurveLabelAlign = 'start' | 'center' | 'end';
export interface CurvePoint {
    /** 0-100 across the box, left to right. */
    x: number;
    /** 0-100 down the box. 0 is the TOP, so a rising curve descends in y. */
    y: number;
    /** Omit to make this a shaping anchor: no marker, no box, no list entry. */
    label?: React.ReactNode;
    /** Default `above`. */
    place?: CurveLabelPlacement;
    /** Default `center`. Ignored for `left` / `right`. */
    align?: CurveLabelAlign;
    /** Per-callout override, usually a width. */
    className?: string;
}
export interface AnnotatedCurveProps {
    /** Drawn in array order — deliberately not sorted by x, so the reading order
     *  of the callouts and the direction of the sweep can never disagree. */
    points: CurvePoint[];
    /** Default `brand-peach`. */
    stroke?: CurveStrokeToken;
    /** width ÷ height of the plotting box. Default 2. */
    aspect?: number;
    /** Gap in px between a node and its box. Default 14. */
    offset?: number;
    className?: string;
}
export declare function AnnotatedCurve({ points, stroke, aspect, offset, className, }: AnnotatedCurveProps): import("react").JSX.Element;
//# sourceMappingURL=annotated-curve.d.ts.map