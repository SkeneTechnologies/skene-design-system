/**
 * The inverted section: one cream card carrying a whole section's worth of copy
 * on a dark page.
 *
 * `light` on the root is load-bearing, not a theme preference. This is a light
 * context nested in a dark document, so without the class every mode-aware token
 * in the subtree keeps its DARK value against a cream fill — `semantic.matcha`
 * #d7f4ab on #faf1e9 is 1.16:1, and `text.primary` resolves to #faf1e9 on
 * #faf1e9, which is not dim, it is absent. Same reason `ProductWindow
 * tone="light"` and the featured `PlanCard` carry it.
 *
 * Which is also why no type in here uses `chrome.text.*`. Those are invariant by
 * definition — they cannot follow the class — so they are correct only on a
 * surface that is always dark, and this one never is. Everything legible uses the
 * theme-aware `text.*` role. The hairlines are the exception and are meant to be:
 * `chrome.line.onLight` is the dark rule designed for a cream fill.
 *
 * `actions` is a slot rather than a label/href pair because whatever goes in it
 * inherits the same inversion: `brand.peach` is #fec089 out on the dark page and
 * #89684a in here, so a default peach Button lands noticeably darker than the
 * caller aimed for. The live section sidesteps this with near-black buttons.
 * Both are one prop away and neither belongs baked into the card.
 *
 * The rule under the lede splits the same two jobs `FeatureRow` splits: heading
 * plus italic line are the promise, everything under the rule is the proof. It is
 * a top border on that lower block rather than a divider element, so it can never
 * render as a line with nothing beneath it.
 *
 * ## What you put in `children` has to survive the inversion
 *
 * The card carries `light`, so everything passed into it is on cream. Package
 * parts built from the theme-aware `text.*` roles follow the class and are safe
 * — `CheckList`, `Chip`, `Accent`. Parts built from the invariant
 * `chrome.text.*` roles cannot follow it: `chrome.text.primary` is `#faf1e9`,
 * which is this card's own fill, so the type is absent rather than dim and no
 * build step catches it.
 *
 * `NumberedStep` is the one that bites, because a stack of steps is the natural
 * thing to put under the rule. Until it takes the theme-aware roles, the caller
 * swaps two utilities:
 *
 *     <NumberedStep className="[&_h3]:text-text-primary [&>div]:text-text-muted" …>
 *
 * Its numeral needs nothing: `brand.peach` is mode-aware and resolves to
 * `#89684a` in here, the value derived for cream. Reported by the skene-site
 * session after adopting this card at home-s05; the gallery case
 * `light-section-card-steps` is that composition, overrides included, so the
 * baseline shows what a caller actually has to write.
 *
 * The visual column has no padding of its own. A photo panel is supposed to reach
 * the card's rounded edge — the root clips it — and a caller who wants it inset
 * can pad the node they pass.
 */
export interface LightSectionCardProps {
    /** Section heading, e.g. "Four ways to plug Skene in." */
    title: React.ReactNode;
    /**
     * Which type scale the title takes. `display` is this card's own fluid
     * `clamp(2rem, 3.2vw, 3.25rem)` and stays the default.
     *
     * `section` is a flat `--font-size-marketing-xl`, the same token
     * `DisplayHeading size="section"` emits, for a tonal band sitting among
     * ordinary section bands. This is the THIRD section-heading scale the estate
     * grew and the last one measured: `design-system-gaps.md` §2 already named it
     * — "a tonal band's heading is not on the same scale as the section headings
     * around it" — and closing `FeatureRow`'s in 0.9.15 is what left this one
     * alone on the page. Measured across two routes: 32.77px at 1024, 42.66 at
     * 1333, 46.08 at 1440, against a flat 32 on every band beside it.
     */
    titleScale?: 'display' | 'section';
    /** The italic line under the title — the promise, not the explanation. */
    lede?: React.ReactNode;
    /** Body copy under the rule. A `<CheckList onLight>` fits here. */
    children?: React.ReactNode;
    /**
     * Usually two `<Button>`s. See the file header: peach inverts inside this card,
     * so pass the variant you actually want rather than assuming the dark-page one.
     */
    actions?: React.ReactNode;
    /** The panel opposite the copy — an image, a `ProductWindow`, anything. */
    visual?: React.ReactNode;
    /** Mirrors the layout, putting the visual on the left. Set it per instance. */
    reverse?: boolean;
    className?: string;
}
export declare function LightSectionCard({ title, titleScale, lede, children, actions, visual, reverse, className, }: LightSectionCardProps): import("react").JSX.Element;
//# sourceMappingURL=light-section-card.d.ts.map