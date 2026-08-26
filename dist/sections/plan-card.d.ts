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
    /**
     * Wrap the tier chip in a heading, so the card's name reaches the outline.
     *
     * Unset by default and unset is what the homepage renders: there the three
     * plan cards sit under a section heading that already names the row, and a
     * chip is the right weight for a preview.
     *
     * `/pricing` is the case this exists for. There the three tier names ARE the
     * page's structure — the prototype had them as `<h2>`s — and rendering them
     * as chips alone left that page's outline running `h1` straight to the
     * section headings with no heading naming a single tier. The chip is not the
     * problem: it is the right mark, it was just the ONLY mark. This wraps it
     * rather than replacing it, so nothing moves on screen and the outline gains
     * three entries it should always have had.
     */
    tierAs?: 'h2' | 'h3';
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
    /**
     * Which material the `featured` promotion uses. `light` — the default, and
     * what every existing caller renders — is the dark-page inversion: cream
     * fill, `light` class, lift and shadow. `dark` is the same promotion for a
     * CREAM ground: on a light panel the cream inversion is cream-on-cream, so
     * the card inverts the other way — the invariant near-black
     * `chrome.surface.1` fill with the `dark` class pinning every mode-aware
     * token in the subtree to its dark value, exactly the pinning the gallery
     * writes for a dark window inside a light card. Lift and `--shadow-modal`
     * are shared; only the material flips. Ignored when `featured` is off.
     *
     * When `featuredTone="dark"`, a nested `CheckList` wants its default (dark)
     * rendering, NOT `onLight` — the inverse of the cream card's requirement.
     */
    featuredTone?: 'light' | 'dark';
    className?: string;
}
export declare function PlanCard({ tier, tierAs, flag, price, unit, summary, features, bestFor, action, footnote, featured, featuredTone, className, }: PlanCardProps): import("react").JSX.Element;
//# sourceMappingURL=plan-card.d.ts.map