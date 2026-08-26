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
export declare function PillNavLink({ href, children, className, active, }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    active?: boolean;
}): import("react").JSX.Element;
//# sourceMappingURL=pill-nav.d.ts.map