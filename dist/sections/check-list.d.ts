/**
 * The rule-separated feature list with a peach check.
 *
 * The single highest-frequency thing on a Skene marketing page — six instances
 * on the homepage alone, across feature cards and every plan card — and it was
 * hand-written each time.
 *
 * Type uses the THEME-AWARE `text.*` role, not `chrome.text.*`. This list renders
 * on cream featured plan cards as well as dark ones, and `chrome.*` is invariant
 * by definition — cream text that can never invert, which on a cream card is
 * invisible. Only the mode-aware role follows a `light` ancestor.
 *
 * The separator is a top border per item rather than a divider element, so a
 * list of one still reads as part of the card rather than floating. The check is
 * a pseudo-element in the capture; here it is a real span, because a screen
 * reader announcing "tick" before every line is noise, and `aria-hidden` on a
 * `::before` is not expressible.
 */
export interface CheckListProps {
    /** `true` when the list sits on a cream/featured surface. */
    onLight?: boolean;
    /** Tightens padding and type for dense contexts like a plan card. */
    dense?: boolean;
    className?: string;
    children: React.ReactNode;
}
export declare function CheckList({ onLight, dense, className, children }: CheckListProps): import("react").JSX.Element;
export interface CheckItemProps {
    dense?: boolean;
    className?: string;
    children: React.ReactNode;
}
export declare function CheckItem({ dense, className, children }: CheckItemProps): import("react").JSX.Element;
//# sourceMappingURL=check-list.d.ts.map