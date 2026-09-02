/**
 * The halftone field a product mock sits on inside a feature row.
 *
 * These are the real textures from the site, not an approximation. An earlier
 * version of this file generated the field from tokens with CSS conic gradients,
 * on the reasoning that the artwork was page content and could not ship. That
 * was wrong twice over: the generated field read as a chunky checkerboard next
 * to the actual fine dot halftone, and the artwork is brand furniture rather
 * than content — the same argument that already lets `dither-subpage.webp` ship.
 *
 * Pairing follows the live site exactly, so a reader who knows it meets the same
 * backdrop behind the same kind of thing:
 *
 *   journey  card1 — journeys, funnels, measurement
 *   github   card2 — GitHub, PRs, editor chrome
 *   schema   card3 — schema, connections, keys
 *
 * Decorative throughout: aria-hidden, pointer-events-none, content lifted above.
 */
export type BackdropTexture = 'journey' | 'github' | 'schema';
export interface SectionBackdropProps {
    /** Which of the three site textures. Ignored when `src` is given. */
    texture?: BackdropTexture;
    /** Explicit texture URL, for a consumer with its own artwork. */
    src?: string;
    /**
     * How the field is drawn. `image` is the shipped raster and the default.
     *
     * ## This file already rejected a CSS field once, and that note stands
     *
     * The comment at the top of this module records that an earlier version
     * generated the field from tokens with conic gradients, and that it "read as
     * a chunky checkerboard next to the actual fine dot halftone". That was true
     * of that implementation and it is why this is opt-in with `image` as the
     * default rather than a swap.
     *
     * What is different now is the implementation, not the opinion.
     * `.skene-field` in `styles/effects.css` is a three-phase radial-gradient dot
     * grid over a linear wash, with the nine colours sampled from the assets
     * themselves, and it shipped in 0.17.0 for `ArtFrame` after the raster and
     * the CSS were rendered side by side and compared. It is still not
     * pixel-identical, and the `FieldsRasterVsCss` story exists so a reviewer
     * judges that rather than takes it on trust.
     *
     * ## Why a consumer would want it
     *
     * A raster backdrop on a full-width panel is a Largest Contentful Paint
     * candidate, and one the preload scanner cannot see: a `background-image` in
     * an inline style is not discovered until CSS has parsed and layout has run,
     * then it queues at Low priority. Measured on www.skene.ai 2026-09-02, that
     * discovery delay was 2,281 ms of a 3,454 ms LCP. A CSS field is not an
     * image, so it cannot be the largest paint and cannot be discovered late.
     *
     * `src` is ignored on the CSS path, since there is no URL to load.
     */
    field?: 'image' | 'css';
    /**
     * Inset of the panel from the field edge, as a percentage of width.
     *
     * A percentage, not a spacing step. The live panel is 84–92% of its container,
     * so ~4–8% each side, and a percentage holds that proportion at every track
     * width by construction. A fixed padding was tried first and turns the field
     * into a coloured BORDER on a short wide card instead of a backdrop.
     */
    inset?: number;
    className?: string;
    children?: React.ReactNode;
}
export declare function SectionBackdrop({ texture, src, inset, field, className, children, }: SectionBackdropProps): import("react").JSX.Element;
//# sourceMappingURL=section-backdrop.d.ts.map