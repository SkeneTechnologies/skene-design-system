export interface FinalCtaProps {
    /**
     * Backdrop image. Defaults to the shipped `pixel-bg.webp`; `false` renders the
     * gradient alone.
     */
    backdrop?: string | false;
    /** Usually one or two `<Button>`s. */
    actions?: React.ReactNode;
    /** Supporting line under the heading. */
    lede?: React.ReactNode;
    /**
     * The kicker above the heading — usually an `<Eyebrow>`.
     *
     * A slot rather than a string, matching `TrustPanel`: this band is
     * always-dark, so the invariant `Eyebrow` is correct here as shipped, but the
     * caller still owns which component draws it.
     *
     * Added 2026-08-14, for the same reason: a band with an eyebrow could not
     * adopt this component without losing the line.
     */
    eyebrow?: React.ReactNode;
    className?: string;
    children: React.ReactNode;
}
export declare function FinalCta({ backdrop, actions, lede, eyebrow, className, children }: FinalCtaProps): import("react").JSX.Element;
//# sourceMappingURL=final-cta.d.ts.map