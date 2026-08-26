export interface DitherOverlayProps {
    /** The dither/halftone texture. The package ships one at `skene/dither.webp`. */
    src: string;
    /** 0.8 on the live site. Lower for busier media. */
    opacity?: number;
    /**
     * `soft-light` is what makes this read as a print halftone rather than a
     * sticker: it lightens and darkens the layer beneath instead of covering it,
     * so the underlying photo or video still shows through with its own contrast.
     * `overlay` is harsher, `multiply` just dims. Change only deliberately.
     */
    blend?: 'soft-light' | 'overlay' | 'multiply' | 'screen';
    className?: string;
}
/**
 * The single most recognisable Skene surface treatment.
 *
 * A dithered texture laid over photographic or video media with a blend mode,
 * under a gradient fade. It is on the homepage hero, every subpage header, and
 * the auth split panel — it is what makes a page read as Skene before a word is
 * read.
 *
 * Decorative, so aria-hidden and pointer-events-none. Sits at z-0; give the
 * content above it a positive z-index or render it after.
 */
export declare function DitherOverlay({ src, opacity, blend, className, }: DitherOverlayProps): import("react").JSX.Element;
export interface DitheredMediaProps {
    /** Background video. Takes precedence over `image`. */
    video?: string;
    /** Background image, if there is no video. */
    image?: string;
    /** Dither texture laid over the media. */
    dither?: string;
    /** Where the bottom gradient fades to, so content below joins seamlessly. */
    fadeTo?: string;
    /**
     * Opacity of the black scrim between the media and the content, 0 to 1.
     *
     * Not decoration. Video is not a background you can measure once: a frame
     * that is dark when you look at it is bright four seconds later, and the
     * text does not move. The homepage hero measured 1.04:1 for peach display
     * type over a bright frame, against a 3.0 floor, at every viewport — while
     * a CSS-walking contrast checker reported the same page clean, because the
     * video is a SIBLING of the text and invisible to an ancestor walk.
     *
     * 0.56, not the live site's 0.48. Matching the live wash stop for stop still
     * left the 11px eyebrow at 4.37 to 4.49 against a 4.5 floor — it is the
     * smallest text on the page and it sits highest in the frame, where the
     * footage is brightest, which is the one place a gradient weighted toward
     * the foot helps least. 0.56 clears it with margin and the footage still
     * reads. Set 0 only for media you have measured against real pixels at
     * several points in its timeline.
     */
    scrim?: number;
    /**
     * Poster frame, shown before the video decodes and to anyone whose browser
     * declines to autoplay it. Without it those readers get the flat chrome
     * ground and the hero copy sits on nothing.
     */
    poster?: string;
    className?: string;
    children?: React.ReactNode;
}
/**
 * The full hero composition: media, dither, gradient fade, content.
 *
 * Four stacked layers is what the homepage actually does, and getting the order
 * or the blend mode wrong is why it is hard to reproduce by eye. Composed here
 * so a new app gets it right without reverse-engineering the marketing site.
 *
 * The package ships no video and only a small texture, so both are props. On a
 * page with neither, the gradient alone still reads as an intentional dark
 * section rather than a broken one.
 */
export declare function DitheredMedia({ video, image, dither, fadeTo, scrim, poster, className, children, }: DitheredMediaProps): import("react").JSX.Element;
//# sourceMappingURL=dither.d.ts.map