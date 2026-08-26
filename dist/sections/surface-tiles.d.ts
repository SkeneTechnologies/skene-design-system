/**
 * The surfaces Skene runs on, as a row of tiles — and the panel that explains
 * whichever one is chosen.
 *
 * The band this belongs to already ships: `LightSectionCard` is the cream card
 * with the heading on one side and a visual slot on the other. What did not ship
 * is what goes IN that slot on the "four ways to plug Skene in" section — four
 * tiles floating on a dithered field, one of them picked out in cream, and a
 * detail panel under them.
 *
 * ## Not `OverviewTiles`
 *
 * Checked first, and it is a different object. An overview tile is a caption, a
 * NUMBER, and what the number is made of; it exists so four counts read as
 * commensurable. These tiles carry an icon, a name and a qualifying line, and
 * exactly one of them is selected. Adding a `selected` state to `OverviewTiles`
 * would mean a metric tile can be "chosen", which is meaningless.
 *
 * ## `selected` carries `light`, and that is the whole mechanism
 *
 * Three tiles are near-black and the chosen one is cream. On a cream tile every
 * mode-aware token must resolve to its LIGHT value, so the tile puts the `light`
 * class on itself — the same load-bearing class as `ProductWindow tone="light"`
 * and the featured `PlanCard`. Without it `text.primary` is #faf1e9 on a #faf1e9
 * fill, which shipped invisible twice in this package already.
 *
 * The unselected tiles paint their own near-black ground, so they take the
 * invariant `chrome.*` roles legitimately — an invariant token is only wrong
 * where the surface under it can flip.
 *
 * ## Selection is presentational here
 *
 * `selected` is a prop, not internal state, and no tile knows about its
 * siblings. The band that uses this is a marketing section whose "selected" tile
 * is an editorial choice, not a control; wiring `onSelect` in would make every
 * static instance carry dead interactivity, and a caller who wants a real picker
 * owns the state and passes the flag.
 *
 * ## `SurfaceDetail` is a sibling, not a child
 *
 * It sits UNDER the row and describes the selected tile. Nesting it inside the
 * tile would force the row to own selection state to know where to render it,
 * and would break the layout the moment the selected tile is not the last one.
 */
/** Icon tints. Same three names `FeatureIcon` uses, plus the neutral one these need. */
export type SurfaceAccent = 'peach' | 'violet' | 'blue' | 'neutral';
export interface SurfaceTilesProps {
    /** `SurfaceTile`s. Four is the shipped shape; the grid wraps at any count. */
    children: React.ReactNode;
    className?: string;
}
export declare function SurfaceTiles({ children, className }: SurfaceTilesProps): import("react").JSX.Element;
export interface SurfaceTileProps {
    /** The glyph, in its tinted square. A 16px lucide icon fits. */
    icon?: React.ReactNode;
    /** Tint for the icon square. */
    accent?: SurfaceAccent;
    /** What the surface is called — "MCP server". */
    name: React.ReactNode;
    /** The qualifier under it — "Runs on every PR". */
    note?: React.ReactNode;
    /** The cream one. See the file header: this flips the whole tile's token mode. */
    selected?: boolean;
    className?: string;
}
export declare function SurfaceTile({ icon, accent, name, note, selected, className, }: SurfaceTileProps): import("react").JSX.Element;
export interface SurfaceDetailProps {
    /** Which tile this is about, as a small pill — "Repo audit". */
    tag?: React.ReactNode;
    /** What that surface does. One or two sentences. */
    children: React.ReactNode;
    /** The command, if the surface has one. Rendered as a mono chip, not a terminal. */
    code?: React.ReactNode;
    className?: string;
}
export declare function SurfaceDetail({ tag, children, code, className }: SurfaceDetailProps): import("react").JSX.Element;
//# sourceMappingURL=surface-tiles.d.ts.map