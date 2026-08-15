export interface StatChipProps {
    /** Leading mark — an emoji or a small icon element. Announced to nobody. */
    icon?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}
export declare function StatChip({ icon, className, children }: StatChipProps): import("react").JSX.Element;
export interface MetaChipProps {
    /** Leading mark — an emoji or a small icon element. Announced to nobody. */
    icon?: React.ReactNode;
    /** The thing being described, in prose. */
    children: React.ReactNode;
    /** The state word — ROADMAP, BETA, SOON. Rendered monospace and uppercased. */
    status: React.ReactNode;
    className?: string;
}
export declare function MetaChip({ icon, children, status, className }: MetaChipProps): import("react").JSX.Element;
//# sourceMappingURL=stat-chip.d.ts.map