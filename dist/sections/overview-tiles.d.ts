/**
 * The workspace Overview: a row of small tiles, each a caption, one number and a
 * line of what the number is made of.
 *
 * This is the first screen of the signed-in product, so it is the artifact that
 * decides whether the reader believes the rest of them. It is drawn rather than
 * captured because the real screen carries a customer's repository name and
 * counts, and it is FOUR tiles of the same shape rather than four bespoke cards
 * because the argument the screen makes is that these numbers are commensurable
 * — coverage, evaluator states, integration status, lifecycle depth, all read in
 * one sweep. A tile that styled itself differently would read as the important
 * one.
 *
 * ## Not `StatChip`, and not `ValueCard`
 *
 * Both were checked first and neither is this.
 *
 * `StatChip` is an inline capsule of one line of text at 12px — it annotates a
 * heading, it has no value/label hierarchy and no ground of its own.
 *
 * `ValueCard` is closer and still wrong: it is the marketing band, 28px of
 * padding, a brand-toned kicker and a prose title on a wash mixed from
 * `text.primary`, sized so three of them fill a section at `minmax(240px, 1fr)`.
 * These tiles are product furniture — 12px of padding, a hairline, `bg-card`,
 * a numeral, `minmax(160px, 1fr)`. Giving `ValueCard` a `density` prop to cover
 * both would mean one component whose two settings share no token, which is two
 * components with extra steps.
 *
 * ## Surface role: themed, not chrome
 *
 * Every colour here is the shadcn themed set — `card`, `border`, `foreground`,
 * `muted-foreground` — because this depicts Skene Cloud, and Skene Cloud is
 * light. It is drawn light by the `light` class on its `AppWindow` ancestor, not
 * by anything in this file, which is what lets the same tiles render correctly
 * inside the dashboard's own `.dark` sidebar subtree if they ever need to.
 * Reaching for `chrome.*` here would pin them dark forever and stop them
 * depicting the product. See the `artifact-shell.tsx` header for the two
 * registers.
 *
 * ## Spacing
 *
 * Every padding, gap and margin is the literal px of the `--spacing-N` token it
 * came from, for the reason `artifact-shell.tsx` documents at length: the
 * package sets `--spacing: 0.2rem`, so Tailwind's `p-3` is 9.6px while
 * `--spacing-3` is 12px. `p-[12px]` is not a failure to tidy.
 *
 * Radii do line up: `--radius-sm` is 6px in both.
 *
 * All content is props. Nothing here knows what a Skene overview counts. The
 * status pill in the real screen's header ("8 without tracking") is not part of
 * a tile — it belongs to `AppWindow`'s `actions` slot as a `StatPill`.
 */
export interface OverviewTilesProps {
    /** `OverviewTile`s. */
    children: React.ReactNode;
    className?: string;
}
/**
 * The grid.
 *
 * `auto-fit` and not a column count, for the same reason `ValueCards` refuses
 * one: the number of tiles is the caller's and the grid must not encode it.
 *
 * The track floor is `minmax(min(160px, 100%), 1fr)` and the `min()` is the
 * whole reason this survives 390px. A bare `minmax(160px, 1fr)` sets a hard
 * 160px floor, so on any container narrower than that — a phone inside an
 * `ArtFrame`'s padding inside an `AppWindow`'s padding — the single column is
 * still 160px wide and the page scrolls sideways. `min(160px, 100%)` collapses
 * the floor to the container instead. This is the line that keeps the overflow
 * gate green; do not "simplify" it.
 */
export declare function OverviewTiles({ children, className }: OverviewTilesProps): import("react").JSX.Element;
export interface OverviewTileProps {
    /** The caption — what is being counted. Rendered mono, 9px, uppercased. */
    label: React.ReactNode;
    /**
     * The number. A count, a ratio like "2 / 1 / 0 / 0", or a word like "On" —
     * the tile does not care, which is why it is a `ReactNode` and not a number.
     */
    value: React.ReactNode;
    /** What the value is made of. Optional; a tile reads fine without it. */
    note?: React.ReactNode;
    className?: string;
}
/**
 * One tile.
 *
 * `min-w-0` is not defensive tidying: without it a grid item's automatic
 * minimum size is its content, so one long value would widen its own track past
 * `1fr` and take the page's horizontal scrollbar with it.
 *
 * `break-words` on the value is the one deviation from `artifacts.css`. The
 * prototype does not need it because it owns its copy and every value there has
 * a space to wrap at; this package ships no copy, so the guarantee cannot rest
 * on a caller passing a breakable string. It changes nothing about how the
 * prototype's own values render.
 *
 * Plain `span`/`div`/`small` rather than `dl`/`dt`/`dd`. The pairing is real,
 * but a description list would put the markup for one tile across two elements
 * that a `<div>` wrapper has to re-associate, and the caller composes tiles as
 * children — the semantic gain does not survive the ergonomics. The prototype's
 * element choice is kept so the two can be diffed.
 */
export declare function OverviewTile({ label, value, note, className }: OverviewTileProps): import("react").JSX.Element;
//# sourceMappingURL=overview-tiles.d.ts.map