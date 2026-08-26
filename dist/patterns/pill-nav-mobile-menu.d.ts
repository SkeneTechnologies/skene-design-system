export interface PillNavMobileLink {
    href: string;
    label: React.ReactNode;
    active?: boolean;
}
export interface PillNavMobileMenuToggleProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    panelId: string;
}
/** Menu/Close control. Must stay in the top bar, above the drawer layers. */
export declare function PillNavMobileMenuToggle({ isOpen, onOpenChange, panelId, }: PillNavMobileMenuToggleProps): import("react").JSX.Element;
export interface PillNavMobileMenuLayersProps {
    links: PillNavMobileLink[];
    actions?: React.ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    panelId: string;
}
/**
 * Overlay + panel rendered as siblings of the nav bar, not inside it — same
 * arrangement as skene-marketing-website Navigation. Keeps the bar (and Close)
 * above z-[1040] while the drawer sits underneath at z-[1040].
 */
export declare function PillNavMobileMenuLayers({ links, actions, isOpen, onOpenChange, panelId, }: PillNavMobileMenuLayersProps): import("react").JSX.Element | null;
export declare function usePillNavMobileMenuId(): string;
//# sourceMappingURL=pill-nav-mobile-menu.d.ts.map