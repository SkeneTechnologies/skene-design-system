export interface ComparisonRowProps {
    /** The claim being compared — rendered as the row's `<th scope="row">`. */
    header: React.ReactNode;
    /**
     * One entry per column AFTER the row header, in `columns` order. Usually a
     * `<TableCheck>`, a `<TableDash>`, or a few words.
     */
    cells: React.ReactNode[];
    /**
     * Index into the table's `columns`, injected by `ComparisonTable`. Set it by
     * hand only when rendering a row outside one.
     */
    featuredIndex?: number;
    className?: string;
}
export declare function ComparisonRow({ header, cells, featuredIndex, className }: ComparisonRowProps): import("react").JSX.Element;
export interface ComparisonTableProps {
    /**
     * Column headers, left to right, INCLUDING the leading row-header column —
     * usually an empty string or a word like "Capability". Each row's `cells`
     * therefore lines up with `columns.slice(1)`.
     */
    columns: React.ReactNode[];
    /**
     * Which column is ours, as an index into `columns` — so with
     * `columns={['', 'Analytics', 'Skene', 'By hand']}` it is `2`. Indexing the
     * same array the reader sees beats a second, offset index space that is off by
     * one at exactly the moment someone edits the header row.
     */
    featuredIndex?: number;
    /** Names the table. Rendered as a real `<caption>`, set below the rows. */
    caption?: React.ReactNode;
    /** `ComparisonRow`s, in order. */
    children: React.ReactNode;
    /** `true` when this sits on a cream band. Switches the hairline token only. */
    onLight?: boolean;
    className?: string;
}
export declare function ComparisonTable({ columns, featuredIndex, caption, children, onLight, className, }: ComparisonTableProps): import("react").JSX.Element;
export interface TableMarkerProps {
    /**
     * What the glyph means, for assistive tech only. The defaults are generic
     * English and are props precisely so a translated page can replace them —
     * a screen reader must not be left announcing an empty cell.
     */
    label?: React.ReactNode;
    className?: string;
}
/** Yes, in `semantic.matcha` — the same "good" the findings use. */
export declare function TableCheck({ label, className }: TableMarkerProps): import("react").JSX.Element;
/**
 * No. A dash, not a cross: the absent case is the majority of the table, and a
 * column of red crosses argues at a volume the copy does not. Its colour is
 * derived from the mode-aware `text.primary` rather than taken from a role,
 * because nothing in the scale is this faint — and derived from THAT token
 * specifically so it inverts with the band instead of vanishing on cream.
 */
export declare function TableDash({ label, className }: TableMarkerProps): import("react").JSX.Element;
//# sourceMappingURL=comparison-table.d.ts.map