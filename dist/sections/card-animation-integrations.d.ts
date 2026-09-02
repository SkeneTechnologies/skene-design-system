import { type LucideIcon } from 'lucide-react';
type CardVariant = 'mcp' | 'gh' | 'api' | 'audit';
type BadgeVariant = 'purple' | 'gray' | 'teal' | 'amber';
export interface IntegrationAnimationCard {
    variant: CardVariant;
    icon: LucideIcon;
    title: string;
    context: string;
}
export interface IntegrationAnimationDetail {
    badge: string;
    badgeVariant: BadgeVariant;
    text: string;
    code: string;
}
/**
 * The PR surface is a GitHub App that posts reviews; nothing ships as an Actions workflow.
 * The marketing site corrected this on 2026-08-19 — keep the `gh` card and its
 * detail on the App, or the dead `uses: skene-ai/action@v1` claim regresses.
 */
export declare const INTEGRATION_ANIMATION_CARDS: IntegrationAnimationCard[];
export declare const INTEGRATION_ANIMATION_DETAILS: IntegrationAnimationDetail[];
export interface CardAnimationIntegrationsProps {
    /** Texture behind the scene. Defaults to the shipped `plugin.png`. */
    backgroundImage?: string;
    cards?: IntegrationAnimationCard[];
    details?: IntegrationAnimationDetail[];
    className?: string;
    /**
     * Hold one frame instead of cycling: every card in, detail `frame` up, and
     * nothing moving. For a gallery, a screenshot baseline or a print surface,
     * where a cycling scene is either a timeout or a lottery. The docs-app's two
     * cases use `0` and `3`, which are the frames its baselines held when the
     * playhead was gsap's.
     */
    frame?: number;
}
/**
 * Four integration cards on a textured field, cycling detail copy.
 * Ported from skene-marketing-website's `CardAnimationIntegrations`.
 */
export declare function CardAnimationIntegrations({ backgroundImage, cards, details, className, frame, }: CardAnimationIntegrationsProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=card-animation-integrations.d.ts.map