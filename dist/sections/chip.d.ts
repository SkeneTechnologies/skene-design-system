/**
 * The 10px monospace chip.
 *
 * It exists because two components arrived at it independently. `PlanCard` wrote
 * its tier marker as an inline `<span>`; `ProductWindow` shipped `WindowStatus`
 * as a named component. Neither author saw the other's code, and the two specs
 * came out ALMOST the same — both `rounded-[5px]`, `font-mono`, `text-[10px]`,
 * `uppercase`, `px-[7px] py-1` — and then disagreed on exactly one value:
 * `WindowStatus` tracked at `0.05em`, the tier chip at `0.08em`. That is the
 * drift the extraction exists to stop, and it is also the reason the extraction
 * could not simply pick a winner: both values are on screen today and both were
 * signed off in the browser, so flattening them here would have been a silent
 * restyle of a verified component, not a refactor.
 *
 * `tone` carries colour and nothing else. The geometry is fixed — a chip that is
 * a different size in two places is two chips again — with tracking as the one
 * declared exception, held at the tier chip's `0.08em` here and overridden back
 * to `0.05em` by `WindowStatus`, where the override is documented at the call
 * site. Reconciling the two onto one value is a visual decision that needs a
 * fresh look at both surfaces; until someone takes it, the difference is
 * recorded rather than laundered. Only the three tones with a live call site are
 * here; a fourth belongs in this file the day something actually renders it.
 *
 * The base also adds `shrink-0`, which the inline tier chip did not have. That
 * is a real change to `PlanCard`'s row and it is deliberate: see the comment on
 * the class list below.
 *
 * `neutral` is the one tone allowed to use invariant `chrome.*` / `brand.light`:
 * its fill is near-black on BOTH the dark page and the featured cream card, so
 * there is no inversion for an invariant token to get wrong. `healthy` and
 * `live` derive their fill from a mode-aware token through `color-mix`, so they
 * follow a `light` ancestor down to the light value of matcha / violet rather
 * than laying a dark-mode tint on a cream fill.
 */
export type ChipTone = 'neutral' | 'healthy' | 'live' | 'outline';
export interface ChipProps {
    /**
     * `neutral` — near-black chip, cream type; an identity marker, not a state.
     * `healthy` — `semantic.matcha`. `live` — `accent.violet`.
     * `outline` — no fill, an invariant hairline; for a marker on a surface that
     * already has a fill of its own.
     */
    tone?: ChipTone;
    /**
     * Merged last, so a Tailwind utility here beats the base. The only class this
     * package overrides that way is `tracking-*`, from `WindowStatus`; anything
     * else is a caller changing the geometry the type exists to hold still.
     */
    className?: string;
    children: React.ReactNode;
}
export declare function Chip({ tone, className, children }: ChipProps): import("react").JSX.Element;
//# sourceMappingURL=chip.d.ts.map