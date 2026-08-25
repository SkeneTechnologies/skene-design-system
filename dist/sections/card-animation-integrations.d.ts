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
export declare const INTEGRATION_ANIMATION_CARDS: IntegrationAnimationCard[];
export declare const INTEGRATION_ANIMATION_DETAILS: IntegrationAnimationDetail[];
export interface CardAnimationIntegrationsProps {
    /** Texture behind the scene. Defaults to the shipped `plugin.png`. */
    backgroundImage?: string;
    cards?: IntegrationAnimationCard[];
    details?: IntegrationAnimationDetail[];
    className?: string;
}
/**
 * Four integration cards on a textured field, cycling detail copy with GSAP.
 * Ported from skene-marketing-website's `CardAnimationIntegrations`.
 */
export declare function CardAnimationIntegrations({ backgroundImage, cards, details, className, }: CardAnimationIntegrationsProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=card-animation-integrations.d.ts.map