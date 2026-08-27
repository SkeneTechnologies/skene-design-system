export interface PillNavProps {
    /** Brand mark. The package ships no logo, so pass one. */
    brand?: React.ReactNode;
    /** Right-hand actions on desktop; repeated in the mobile drawer footer. */
    actions?: React.ReactNode;
    className?: string;
    /** `absolute` overlays hero media; `sticky` stays visible on scroll. Default `absolute`. */
    position?: 'absolute' | 'sticky';
    children: React.ReactNode;
}
/**
 * Floating pill navigation with a marketing-site mobile drawer below `md`.
 */
export declare function PillNav({ brand, actions, className, position, children, }: PillNavProps): import("react").JSX.Element;
export interface PillNavLinkProps {
    /**
     * Where the item goes. Optional only because `asChild` exists: a menu
     * trigger occupies the same slot and has no destination. Pass it whenever
     * there is one, `asChild` or not — `PillNav` reads it to build the mobile
     * drawer, and an item without one does not appear there.
     */
    href?: string;
    children: React.ReactNode;
    className?: string;
    active?: boolean;
    /**
     * Render as the single child instead of an `<a>` — the same Slot mechanism
     * `ui/button` and `ui/card` use.
     *
     * Without it, anything that is not a plain anchor in this bar has to copy the
     * class string. skene-marketing-website does exactly that: its nav dropdown
     * trigger reproduces all seven utilities verbatim so the menu sits in the
     * same slot as the links either side of it, which means the bar's hover ink,
     * its active peach and its 4px radius now live in two places and drift on the
     * next change. A Radix `DropdownMenuTrigger`, a `next/link`, or a button
     * composes through this instead.
     *
     * `href` is not forwarded when `asChild` is set: the child owns its own
     * element, and an `href` landing on a `<button>` trigger is invalid markup.
     */
    asChild?: boolean;
}
export declare function PillNavLink({ href, children, className, active, asChild, }: PillNavLinkProps): import("react").JSX.Element;
//# sourceMappingURL=pill-nav.d.ts.map