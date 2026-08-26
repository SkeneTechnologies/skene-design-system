import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../lib/utils.js';
/**
 * A dark hero strip with a textured backdrop fading into the page.
 *
 * The most recognisable Skene page treatment, and the one thing a new app most
 * needs in order to look like the rest of the estate rather than like stock
 * shadcn. Every public-site hero composes from this shape.
 *
 * Uses `chrome.*` rather than `surface.*` deliberately: a hero strip is fixed
 * dark chrome. It should not invert on a light page, any more than a terminal
 * should.
 *
 * The image is decorative, so its layer is aria-hidden and the children stay in
 * the natural reading order.
 *
 * ## The textured split header is a RECIPE, not an export
 *
 * The estate's split subpage header — eyebrow, `h1` and lede in a narrow
 * track, an artifact in the wide one, the dither strip behind both — is this
 * component wrapping a two-column grid:
 *
 *     <HeroBackdrop image={assetUrls.subpageDither} imageOpacity={0.72}>
 *       <section className="pb-[64px] pt-[128px]">
 *         <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-[32px] px-6
 *                         lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-[64px]">
 *           <div>…Eyebrow, DisplayHeading size="page" as="h1", lede, CTAs…</div>
 *           <div>…the artifact…</div>
 *         </div>
 *       </section>
 *     </HeroBackdrop>
 *
 * The reference implementation is skene-marketing-website's shared shell,
 * `src/components/site/page-shell.tsx` (its `flat-split` variant), which is
 * where changing the treatment changes every rebuilt hero at once. It stays a
 * recipe rather than becoming a package composition because every number in
 * that grid is a PAGE decision — the 5fr/7fr ratio, the 1200px wrap, the
 * vertical rhythm — and this package deliberately owns none of those. A
 * `HeroSplit` export would either hardcode one page's answers or grow a prop
 * for each, and either way the package would be carrying page layout, which is
 * the line it does not cross. It ships the ground (this component, the dither
 * asset in `assetUrls`) and the parts (`Eyebrow`, `DisplayHeading`); the grid
 * is the caller's.
 */
export function HeroBackdrop({ image, imageOpacity = 0.9, fadeTo = 'var(--color-chrome-surface-darker)', className, children, }) {
    return (_jsxs("div", { className: cn('relative isolate overflow-hidden bg-chrome-surface-darker', className), children: [image ? (_jsx("div", { "aria-hidden": "true", className: "absolute inset-0 -z-10 bg-cover bg-center", style: { backgroundImage: `url(${image})`, opacity: imageOpacity } })) : null, _jsx("div", { "aria-hidden": "true", className: "absolute inset-0 -z-10", style: { background: `linear-gradient(to bottom, transparent, ${fadeTo})` } }), children] }));
}
