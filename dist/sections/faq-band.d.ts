/**
 * The FAQ band: a heading column that stays put, and the questions beside it.
 *
 * Every other band of the captured pricing page already ships as a section; this
 * one was still hand-assembly in the app, on top of `ui/accordion`. What was
 * being re-written each time is not the disclosure behaviour — Radix does that —
 * but the band: the cream ground, the two-column split, the hairline between
 * every row, and the round toggle at the right edge.
 *
 * ## Why it does not use `ui/accordion`
 *
 * That primitive bakes a `ChevronDown` into its trigger, and this band's mark is
 * a round +/× at the far right. Wrapping the primitive would mean rendering its
 * chevron and hiding it, which leaves a component whose markup disagrees with
 * what is on screen. Radix itself is the shared dependency, already in this
 * package for the primitive, so composing it directly costs nothing and keeps
 * the keyboard and ARIA behaviour identical.
 *
 * ## One client module, deliberately
 *
 * Disclosure is state, so this file is `'use client'` in full. Rule 3 from the
 * Stage 4 stock-take: a client directive in a file with server-renderable
 * siblings drags the boundary around them too — which is the mistake
 * `billing-toggle.tsx` exists to avoid.
 *
 * ## `light`, and the reason it is not conditional
 *
 * The band is cream on a dark page, so the root carries `light` exactly as
 * `LightSectionCard` does. Without it `text.primary` resolves to #faf1e9 against
 * a #faf1e9 fill: not dim, absent. This band ships in one tone on purpose — a
 * `tone="dark"` prop would have to flip the class, and every FAQ on both surfaces
 * is the cream one.
 *
 * ## `type="single"` and collapsible
 *
 * The capture shows every answer open at once, but that is the screenshot of an
 * expanded state, not the resting one. One-at-a-time is the resting behaviour of
 * the live band; `collapsible` means the open row can be closed again rather than
 * trapping the reader with one answer permanently on screen. A caller who wants
 * many open passes `type="multiple"`.
 */
export interface FaqBandProps {
    /** Mono kicker over the heading — "FAQ". */
    eyebrow?: React.ReactNode;
    /** The heading, left column. */
    title: React.ReactNode;
    /** One line under the heading. The live band puts its "talk to us" link here. */
    note?: React.ReactNode;
    /**
     * CTA row under the note, in the heading column — the wireframes' head
     * button beside the questions. A slot rather than a label/href pair for the
     * reason `LightSectionCard` gives: this column is cream, so the caller
     * passes the button variant that survives the inversion (the near-black
     * primary, not the default peach). Renders under the title when `note` is
     * absent.
     */
    actions?: React.ReactNode;
    /** `FaqRow`s, in order. */
    children: React.ReactNode;
    /** Open many at once instead of one at a time. */
    multiple?: boolean;
    className?: string;
}
export declare function FaqBand({ eyebrow, title, note, actions, children, multiple, className }: FaqBandProps): import("react").JSX.Element;
export interface FaqRowProps {
    /** The question. */
    question: React.ReactNode;
    /** The answer. Prose — links compose. */
    children: React.ReactNode;
    className?: string;
}
export declare function FaqRow({ question, children, className }: FaqRowProps): import("react").JSX.Element;
//# sourceMappingURL=faq-band.d.ts.map