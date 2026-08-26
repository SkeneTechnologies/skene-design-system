/**
 * Site footer: a brand column, link columns, a bottom bar, and the oversized
 * wordmark bleeding off the base of the page.
 *
 * The wordmark is the part worth keeping. It is 29vw at 1.7% opacity, clipped by
 * the footer's own overflow — close to invisible, which is the intent: it reads
 * as texture at a glance and only resolves into a word if you look. Rendering it
 * at a "sensible" size or opacity is the obvious change and it is wrong every
 * time.
 */
export interface SiteFooterProps {
    /** Left column: logo, a line of copy, social links. */
    brand?: React.ReactNode;
    /** Oversized watermark. Usually the company name. */
    wordmark?: React.ReactNode;
    /** Bottom-left, e.g. "© 2026 Skene. All rights reserved." */
    copyright?: React.ReactNode;
    /** Bottom-right, e.g. privacy/terms links. */
    legal?: React.ReactNode;
    className?: string;
    /** The `<FooterColumn>`s. */
    children: React.ReactNode;
}
export declare function SiteFooter({ brand, wordmark, copyright, legal, className, children, }: SiteFooterProps): import("react").JSX.Element;
export interface FooterColumnProps {
    title: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}
export declare function FooterColumn({ title, className, children }: FooterColumnProps): import("react").JSX.Element;
export declare function FooterLink({ href, className, children, }: {
    href: string;
    className?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
/** Circular icon links. Pass an svg or an icon component per child. */
export declare function SocialLinks({ className, children, }: {
    className?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
export declare function SocialLink({ href, label, className, children, }: {
    href: string;
    /** Required: the child is an icon, so the link has no accessible name without it. */
    label: string;
    className?: string;
    children: React.ReactNode;
}): import("react").JSX.Element;
//# sourceMappingURL=footer.d.ts.map