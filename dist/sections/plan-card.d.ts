/**
 * Pricing: the grid and the tier card. The monthly/yearly switch is the only
 * interactive part and lives in `billing-toggle.tsx` so this file stays
 * server-renderable.
 *
 * `featured` inverts the card to cream on a dark page, and applies the `light`
 * class for the same reason `ProductWindow tone="light"` does — every mode-aware
 * token inside would otherwise resolve to its dark value against cream.
 *
 * Everything that must stay legible on BOTH card variants uses the theme-aware
 * `text.*` role. `chrome.text.*` is invariant — it cannot invert — so using it
 * here renders cream on cream and the label simply disappears.
 *
 * The captured demo proves the point by hand: its featured card overrides the
 * check mark to `#a86636`, a darker peach nobody would pick on a dark surface.
 * That override IS `brand.peach`'s light value (`#89684a`), discovered
 * empirically and pasted in one place. With the class, every token in the
 * subtree gets it and no per-element override is needed.
 */
export interface PlanGridProps {
    className?: string;
    children: React.ReactNode;
}
export declare function PlanGrid({ className, children }: PlanGridProps): import("react").JSX.Element;
export interface PlanCardProps {
    /** Tier marker — PRO, SCALE, ULTRA. */
    tier: React.ReactNode;
    /** Right of the tier marker, e.g. "Popular". */
    flag?: React.ReactNode;
    price: React.ReactNode;
    /** Billing unit, e.g. "/mo". */
    unit?: React.ReactNode;
    /** One line under the price. */
    summary?: React.ReactNode;
    /** Usually a `<CheckList dense onLight={featured}>`. */
    features?: React.ReactNode;
    /** Small labelled block pinned above the CTA. */
    bestFor?: {
        label: React.ReactNode;
        value: React.ReactNode;
    };
    action?: React.ReactNode;
    /** Fine print under the CTA. */
    footnote?: React.ReactNode;
    featured?: boolean;
    className?: string;
}
export declare function PlanCard({ tier, flag, price, unit, summary, features, bestFor, action, footnote, featured, className, }: PlanCardProps): import("react").JSX.Element;
//# sourceMappingURL=plan-card.d.ts.map