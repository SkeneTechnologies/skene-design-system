/**
 * The framed product mock: a customer's dashboard rendered inside a marketing
 * section.
 *
 * It defaults to LIGHT on a dark page, which is the opposite of everything else
 * in this package and is the whole point — the section around it is Skene's
 * chrome, the thing in the frame is the customer's tool. Reversing that (a dark
 * window on a dark page) reads as a screenshot of Skene itself.
 *
 * This is why `chrome.line.onLight` exists: the window's internal rules are dark
 * hairlines on a cream fill, and the same alpha value has to work there as on
 * the dark grounds outside it.
 */
export type ProductWindowTone = 'light' | 'dark';
export interface ProductWindowProps {
    /** `light` (default) reads as the customer's product; `dark` as Skene's own. */
    tone?: ProductWindowTone;
    /** Left side of the title bar. */
    title?: React.ReactNode;
    /** Right side of the title bar — usually a `<WindowStatus>`. */
    status?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}
export declare function ProductWindow({ tone, title, status, className, children, }: ProductWindowProps): import("react").JSX.Element;
export interface WindowStatusProps {
    /**
     * `healthy` is the trap state — the dashboard reporting green while the data
     * under it is wrong. It is deliberately the calm colour, because the section
     * copy depends on the reader believing it before the findings contradict it.
     */
    tone?: 'healthy' | 'live';
    className?: string;
    children: React.ReactNode;
}
/**
 * A `Chip` with a narrower vocabulary. The name stays because callers read the
 * title bar's right-hand slot as a status, not as a chip, and the two tones here
 * are the only ones that mean anything in a window frame — `neutral` would be an
 * identity marker in a slot reserved for state.
 *
 * The `tracking` override is not styling taste. `WindowStatus` shipped and was
 * browser-verified at 0.05em while `PlanCard`'s tier chip shipped at 0.08em; the
 * shared `Chip` holds the tier chip's value, so without this line every window
 * status silently gained 60% more letter-spacing — about 5px across
 * "DASHBOARD: HEALTHY" at 10px uppercase mono. Reconciling the two is a visual
 * decision nobody has taken yet, so the difference is carried here explicitly
 * instead of being absorbed by the extraction. `cn` puts it after the base, and
 * a caller's own `tracking-*` still wins over it.
 */
export declare function WindowStatus({ tone, className, children }: WindowStatusProps): import("react").JSX.Element;
/** The toolbar strip inside a dark window — filters, breadcrumbs, chips. */
export declare function WindowToolbar({ className, children, }: {
    className?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare function WindowChip({ className, children, }: {
    className?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
//# sourceMappingURL=product-window.d.ts.map