import * as React from 'react';
export interface NoticeBarProps extends React.ComponentProps<'aside'> {
    /**
     * The landmark role. `note` by default, which is what an advisory about the
     * page you are already on is.
     *
     * A prop rather than a constant because `Alert` gets this wrong in the other
     * direction: it hardcodes `role="alert"`, which is an ASSERTIVE live region.
     * A screen reader interrupts whatever it is saying to announce one. That is
     * right for "your payment failed" and wrong for "this page is from an earlier
     * version of the product", which is the case this component was built for.
     */
    role?: 'note' | 'status' | 'alert';
}
/**
 * A full-bleed advisory bar across the top of a page.
 *
 * NOT `Alert`, and the difference is structural rather than cosmetic. `Alert`
 * is an inset card with a title and a description that sits IN the content:
 * bordered on four sides, rounded, inside the page's measure. This spans the
 * viewport, sits ABOVE the content, carries one line, and separates itself with
 * a single hairline underneath. Neither can be expressed as a variant of the
 * other without one of them growing a prop that removes its own shape.
 *
 * `docs/design-system-gaps.md` in skene-marketing-website recorded the absence
 * twice, as gap 4 ("no callout or advisory primitive") and gap 5 ("`Alert` has
 * no `warning` variant and hardcodes `role='alert'`"). This closes the first
 * and sidesteps the second by taking `role` as a prop.
 *
 * Ported from that repository's `ArchiveBanner`, which is being retired: seven
 * of its route-group layouts render one to say the page below is from an
 * earlier version of the product.
 *
 * ## Translucent on purpose
 *
 * The ground is `rgba(255,255,255,0.04)` and the rule is
 * `--color-chrome-line-subtle`, both of which composite over whatever is behind
 * rather than covering it. Every page this sits on paints a textured header
 * beneath it, so an opaque fill would punch a flat rectangle through the
 * dither. That is why it does not reach for `--color-chrome-surface-*`, which
 * is the opaque family.
 *
 * The 0.04 is transcribed from what it replaces. It has no token here because
 * the package ships no alpha that low; `--color-chrome-line-subtle` at 0.12 is
 * the nearest and is a line colour, not a ground.
 */
export declare function NoticeBar({ role, className, children, ...props }: NoticeBarProps): React.JSX.Element;
export default NoticeBar;
//# sourceMappingURL=notice-bar.d.ts.map