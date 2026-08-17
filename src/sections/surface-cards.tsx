import { cn } from '../lib/utils.js'
import { GlyphBadge } from './glyph-badge.js'

/**
 * The four-ways-in grid: a small set of peer cards on a textured field, one of
 * them drawn cream, each carrying its own detail.
 *
 * Design record: `documentation/20260817_surface_cards_extraction.md`. Extracted
 * from `skene-site/src/components/surface-cards.tsx`, where it was the last
 * marketing card the site built out of raw utilities — a shape three name-based
 * guards could not see, because it had no name they knew.
 *
 * ## Not `SurfaceTiles`, and this is the one that has to be argued
 *
 * Same subject — "the surfaces a product runs on" — and the same cream-selected
 * mechanism. It is still a different object, on three measurements:
 *
 * 1. **Grid.** `SurfaceTiles` is `repeat(auto-fit, minmax(112px,1fr))`, which in
 *    a 458px cell resolves 3+1 rather than 2x2. This grid is literally two
 *    across, for the reason in the comment on it below.
 * 2. **Padding.** A `SurfaceTile` is `p-3.5` — 11.2px against this package's
 *    `--spacing: 0.2rem`. These cards are 16px, measured off what ships.
 * 3. **Where the detail lives, which is the real difference.** `SurfaceDetail`
 *    is a SIBLING under the row, holding the detail for the chosen tile: one
 *    panel, one detail, three surfaces unexplained until something changes the
 *    selection. Here every card carries its own, so all of them are in the
 *    document at once. That is not a preference — the sibling-panel shape
 *    shipped on the consuming site and was removed, because it put every surface
 *    on the page twice, once as a tile and again as a chip repeating the tile's
 *    own title.
 *
 * Both ship. Use `SurfaceTiles` for a row with a detail panel under it; use this
 * for a compact grid where each cell explains itself.
 *
 * ## `featured` carries `light`, the rest carry `dark`
 *
 * Both classes are load-bearing. The cream card needs `light` or every mode-aware
 * token in it keeps its dark value — `text.primary` resolves to #faf1e9 on a
 * #faf1e9 fill, which is not dim, it is absent, and it has shipped twice in this
 * package. The other cards paint their own near-black ground and carry `dark` for
 * the reason `BridgeNode` documents: an always-ink card inside a `light` ancestor
 * would otherwise take the light value of every token in its subtree.
 *
 * This is a real departure from `SurfaceTile`, which omits `dark` on its
 * unselected tiles and reaches for the invariant `chrome.*` roles instead. Both
 * are correct; this one is the one that survives being dropped inside a
 * `LightSectionCard`.
 *
 * ## The slots, and what belongs in each
 *
 * - **`title` / `context`** — what the surface IS and where it runs.
 * - **`detail`** — a sentence or two, in the card it describes.
 * - **`code`** — OPTIONAL, and an absent chip is not a hole in the design. A chip
 *   is the most quotable thing in the card and it reads as tested, so it takes a
 *   string the caller can point at a source for. The consuming site found three
 *   of the four live strings it was porting named commands and repositories that
 *   do not exist.
 * - **`icon`** — a glyph drawn inside `GlyphBadge`. A character is fine. Pass the
 *   character, never a named entity: JSX entity tables are per-compiler and
 *   `machine/rules.yaml` bans them outright.
 *
 * ## The texture is a plain `<img>`
 *
 * Not `next/image`: this package has no Next dependency and will not gain one,
 * and `patterns/dither.tsx` already ships a raw `<img>` for the same job. The box
 * is what `fill` produced — absolutely positioned, full bleed, `object-cover` —
 * so the layout is identical and only the optimizer is lost. Decorative
 * throughout: empty `alt`, `aria-hidden`, `pointer-events-none`.
 */

export interface SurfaceCardItem {
  /** Stable key. */
  id: string
  /** Glyph for the disc. A character, not an entity. */
  icon?: React.ReactNode
  /** What the surface is: "MCP server", "GitHub App". */
  title: React.ReactNode
  /** Where it runs, one short line. */
  context?: React.ReactNode
  /** A sentence or two. */
  detail: React.ReactNode
  /** A command or endpoint, and only if verifiable — see the file header. */
  code?: string
}

export interface SurfaceCardsProps {
  surfaces: SurfaceCardItem[]
  /** Index of the card drawn light. Defaults to the first. */
  featured?: number
  /** Texture behind the row, as a URL. Omit for a plain panel. */
  texture?: string
  className?: string
}

export function SurfaceCards({ surfaces, featured = 0, texture, className }: SurfaceCardsProps) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-xl bg-surface-deep-2 p-[24px]', className)}
    >
      {texture ? (
        <img
          src={texture}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {/* `relative` lifts the content off the texture without a z-index race,
          the same way `TrustPanel` lifts its copy off its glow. */}
      <div className="relative">
        {/* TWO ACROSS, NEVER FOUR, and never `auto-fit`.
            Measured in a tonal band's 640px visual column at 1440: four tracks
            gave each tile 139px, and 32px of that is the tile's own padding.
            Every one of the four titles wrapped to two lines — "Command-line
            tool" became "Command-" / "line tool" — and the context under it ran
            to three. Two tracks give 294px and every title fits on one line at
            every viewport this band is seen at. This is the same finding as the
            filed `SurfaceTiles` auto-fit ask, reached independently. */}
        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
          {surfaces.map((s, i) => (
            <article
              key={s.id}
              className={
                i === featured
                  ? 'light rounded-lg border border-chrome-line-on-light bg-brand-light p-[16px]'
                  : 'dark rounded-lg border border-chrome-surface-border bg-chrome-surface-1 p-[16px]'
              }
            >
              {s.icon ? (
                <GlyphBadge
                  tone={i === featured ? 'tint' : 'muted'}
                  size={32}
                  className="mb-[12px]"
                  glyphSize="var(--font-size-body)"
                >
                  {s.icon}
                </GlyphBadge>
              ) : null}
              <h3
                className="font-semibold text-text-primary"
                style={{ fontSize: 'var(--font-size-ui)' }}
              >
                {s.title}
              </h3>
              {s.context ? (
                <p
                  className="mt-[4px] text-text-muted"
                  style={{ fontSize: 'var(--font-size-body-sm)' }}
                >
                  {s.context}
                </p>
              ) : null}
              {/* The detail lives IN the card it describes. See the file header:
                  the second-list shape is what `SurfaceDetail` does, and it is
                  why that component is not this one. */}
              {s.detail ? (
                <p
                  className="mt-[10px] text-text-muted"
                  style={{ fontSize: 'var(--font-size-body)' }}
                >
                  {s.detail}
                </p>
              ) : null}
              {s.code ? (
                <code
                  className="mt-[10px] inline-block max-w-full rounded-md border px-[8px] py-[2px] font-mono text-text-primary [overflow-wrap:anywhere]"
                  style={{
                    fontSize: 'var(--font-size-body-sm)',
                    // Mixed from the card's own ink rather than named, because
                    // this hairline has to hold on both grounds — cream on the
                    // featured card, near-black on the other three — and no
                    // single line token is correct for both.
                    borderColor: 'color-mix(in oklab, currentColor 22%, transparent)',
                  }}
                >
                  {s.code}
                </code>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
