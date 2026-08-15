/**
 * The round disc a glyph sits in at the head of a row: a circle, a hairline, a
 * peach mark in the middle.
 *
 * It is the disc `TrustFact` has always drawn, lifted out so it is reachable
 * without the row around it. That is the whole reason it exists. `TrustFact` is
 * an `<li>` with a `border-b` rule, `grid-cols-[40px_1fr]`, `py-[22px]` and a
 * slot for a qualifying paragraph; skene-site's events list is three rows with
 * no rule between the disc and the copy, no body paragraph, and a city code
 * where the fact has a tick. Handing those rows a `TrustFact` would have
 * restyled a shipped section to make a local file shorter, so skene-site kept a
 * local `glyph-badge.tsx` instead and its own header said as much: "It is kept
 * because `TrustFact` draws a 38px circle and these are 32px."
 *
 * So the size moved down here rather than onto `TrustFact`. A `size` on the row
 * would have left the disc still welded inside it, which is the thing the three
 * remaining call sites cannot use.
 *
 * ## NOT `FeatureIcon`, and the difference is not the diameter
 *
 * `FeatureIcon` is the other round glyph holder in this package and it is a
 * different object: 44px (`size-11`), an accent-tinted border at 47% with a 7px
 * inset ring, tinted by an `accent` union of peach/violet/blue, and NOT
 * `aria-hidden` — it is the mark that carries a feature row's identity. This one
 * is `aria-hidden` unconditionally, because every glyph that has ever gone in it
 * is decoration beside a real title: a tick before "Every finding is
 * reviewable", a city code before an event name. Announcing "check mark" first
 * only delays the sentence. If your glyph is the content, it belongs somewhere
 * that will read it out.
 *
 * ## `tone` is about the GROUND, and there is no third one
 *
 * `tint` is `TrustFact`'s: `chrome.line.onLight` — the invariant dark hairline
 * designed for a cream fill — over a 12% peach wash. It is correct on cream and
 * effectively invisible on the dark page, which is the same caveat `TrustPanel`
 * documents about its own rules.
 *
 * `muted` is the themed pair, `border` over `bg-muted`, so it follows the page
 * polarity like the rest of a normal band. That is what the events rows use on
 * the dark site.
 *
 * Two, because two have call sites. A third belongs in this file the day
 * something renders it — the rule `Chip` states and this file inherits.
 *
 * ## `glyphSize`, and why the default is `undefined` rather than a number
 *
 * The disc's diameter and the glyph's type size are two numbers, and this
 * component owned only the first. The header used to call that deliberate — "a
 * tick and a three-letter city code do not want the same one" — which is true
 * about the DESIGN and was wrong about the API. skene-site adopted this
 * component exactly as documented and its events rows jumped from 13px to the
 * page's ambient 16px: a visible restyle of a shipped section, which is the one
 * outcome the extraction existed to avoid. A reviewer there read the docstring,
 * measured the restyle, and recommended REFUSING the component. The extraction
 * nearly failed on its own documentation.
 *
 * So `glyphSize` is a prop. It defaults to `undefined`, meaning "inherit", which
 * is what every existing caller already gets — `TrustFact`'s tick is unmoved,
 * and nothing rebaselines. What changes is that the requirement is now visible
 * in the type instead of discoverable by rendering it and noticing.
 *
 * Pass a number for px, or a string for anything else (`'var(--font-size-body)'`
 * is what skene-site's rows want). If you find yourself passing both a
 * `className` for the typeface and another for the size, that is the shape this
 * prop exists to remove.
 *
 * ## The trap: `size` is an inline style
 *
 * Width and height are written to `style`, following `ScoreRing`, so one number
 * moves both. That means a `size-*` or `h-*`/`w-*` utility passed through
 * `className` will NOT win against it — inline styles beat classes and `cn`
 * cannot merge across the two. Pass the number. `tint`'s wash is inline for the
 * same reason and has the same consequence: retint by adding a tone, not by
 * fighting it from the call site.
 */
export type GlyphBadgeTone = 'tint' | 'muted';
export interface GlyphBadgeProps {
    /** Which ground this sits on. See the file header — `tint` is cream-only. */
    tone?: GlyphBadgeTone;
    /**
     * Diameter in px. 38 is `TrustFact`'s and the default; 32 is the events-row
     * size that this component was extracted to serve. Nothing scales with it:
     * the glyph's type size is `glyphSize`, a separate number, because a tick and
     * a three-letter city code do not want the same one at the same diameter.
     */
    size?: number;
    /**
     * The glyph's type size. A number is px; a string is passed through, so
     * `'var(--font-size-body)'` works. Defaults to `undefined` — the glyph
     * inherits, which is what every caller got before this prop existed.
     *
     * Set it. Inheriting means the disc renders at whatever the surrounding page
     * happens to use, so the same component lands at 13px in one section and 16px
     * in another with nothing at the call site saying so. See the file header.
     */
    glyphSize?: number | string;
    /**
     * The glyph. Optional: the disc still renders, which is what keeps a stack of
     * rows aligned on their titles when only some of them have a mark. Pass the
     * character, never a named entity (`machine/rules.yaml`, `must_not:
     * html_entities_in_jsx`) — a prop is a string and nothing parses it as markup.
     */
    children?: React.ReactNode;
    /**
     * Merged last. `TrustFact` uses it for grid placement; the typeface is the
     * other honest use, since a city code wants `font-mono` and a tick does not.
     */
    className?: string;
}
export declare function GlyphBadge({ tone, size, glyphSize, children, className, }: GlyphBadgeProps): import("react").JSX.Element;
//# sourceMappingURL=glyph-badge.d.ts.map