export interface IntegrationsHighlightProps {
    /** Texture behind the animation. Omit for the shipped `plugin.png`. */
    backgroundImage?: string;
    /** CTAs under the body copy. Pass `<Button>`s sized for a cream card. */
    actions?: React.ReactNode;
    className?: string;
}
/**
 * The homepage integrations band: cream copy column plus the four-card GSAP
 * animation. Ported from skene-marketing-website's `IntegrationsHighlight`.
 */
export declare function IntegrationsHighlight({ backgroundImage, actions, className, }: IntegrationsHighlightProps): import("react").JSX.Element;
//# sourceMappingURL=integrations-highlight.d.ts.map