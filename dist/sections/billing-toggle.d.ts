/**
 * Monthly / yearly switch. Its own module on purpose.
 *
 * It is the only interactive part of the pricing section, and `'use client'` in
 * plan-card.tsx would draw the boundary around PlanCard too — which is pure
 * markup and should stay server-rendered. The barrel makes the same point about
 * the ui/ primitives: the directive belongs in the one file that needs it.
 */
export interface BillingToggleProps {
    /** `false` = monthly, `true` = yearly. */
    yearly: boolean;
    onChange: (yearly: boolean) => void;
    monthlyLabel?: React.ReactNode;
    yearlyLabel?: React.ReactNode;
    className?: string;
}
/**
 * Monthly / yearly switch.
 *
 * Both labels are clickable, not just the track. A 40px switch is a small target
 * and the words next to it are the obvious thing to press.
 */
export declare function BillingToggle({ yearly, onChange, monthlyLabel, yearlyLabel, className, }: BillingToggleProps): import("react").JSX.Element;
//# sourceMappingURL=billing-toggle.d.ts.map