/**
 * The trust panel: a cream card split in two — the claim on the left, the facts
 * that back it on the right.
 *
 * The split is the argument. Copy and links on one side, a stack of concrete,
 * checkable facts on the other, so the reassurance is not a paragraph asserting
 * itself but a paragraph next to its evidence. The evidence column is the wider
 * of the two (`0.9fr 1.1fr`) for the same reason: the facts are the payload.
 *
 * ## The nested inversion
 *
 * This is a CREAM panel on a dark page, so the root carries `light` for the same
 * reason `LightSectionCard`, `Bridge`, `ProductWindow tone="light"` and the
 * featured `PlanCard` do: without it every mode-aware token in the subtree keeps
 * its DARK value against a cream fill — `text.primary` resolves to #faf1e9 on
 * #faf1e9, which is not dim, it is absent. The class is unconditional, and it is
 * first in the class list so it reads as structure rather than decoration.
 *
 * Which is also why nothing here uses `chrome.text.*`. Those are invariant by
 * definition — they cannot follow the class — so they are correct only on a
 * surface that is always dark, and this one never is. Every piece of type uses
 * the theme-aware `text.*` role. The hairlines are the deliberate exception:
 * `chrome.line.onLight` is the dark rule designed for a cream fill, and no
 * mode-aware role covers it.
 *
 * ## Why the facts panel is a DEEPER CREAM and not a grey
 *
 * The captured design puts the facts on `#e6dbd1` — a second, lower tone of the
 * same cream. That choice is load-bearing and easy to lose in a rebuild, because
 * "slightly darker panel" reads to a developer as "grey", and `surface.1` is
 * right there. It is the wrong answer. A grey panel introduces a second material:
 * the card stops being one card with a shaded half and becomes two objects that
 * happen to touch, and the seam between them reads as a join rather than a fold.
 * A deeper cream reads as the same surface, shaded — one card, one paper, one
 * light source.
 *
 * So the tone is derived rather than pasted: `brand.light` mixed toward
 * `brand.bronze`, which lands within a couple of steps of the captured
 * `#e6dbd1` while staying, by construction, a shade of the cream token. Change
 * the cream and the shade follows it, which a hex could not do — and
 * `machine/rules.yaml` forbids the hex anyway (`must_not:
 * arbitrary_hex_in_classnames`, `must: use_tokens_over_literal_values`).
 *
 * ## The glow
 *
 * The peach bloom rises from the BOTTOM-LEFT corner and dies at 65%, so it warms
 * the corner the eye enters from and leaves the facts column clean. It is drawn
 * from `brand.peach` through `color-mix`, not from a literal. Note what `light`
 * does to it: inside this panel `brand.peach` resolves to its light value
 * (#89684a), not the dark-page #fec089 — and that IS the value designed to sit
 * on cream. The captured demo discovered it by hand and pasted a one-off
 * `#a86636` in this exact spot; through the token every instance gets it for
 * free. It is decoration for a mood the copy already sets, so it is `aria-hidden`
 * and behind the content rather than over it.
 *
 * ## Layout
 *
 * One column below `md` (768px), where the two-column split would give both
 * halves less room than either needs. The 58px padding goes with it — 58px of
 * inset on a 360px screen is a column of confetti — so it drops to a phone-sized
 * inset below `md` and takes the captured value from there up.
 *
 * The two-track template is conditional on `children` for the same reason
 * `LightSectionCard` conditions its tracks on `visual`: the facts column is a
 * slot, and a template that declares a track the markup never fills leaves the
 * copy crushed into `0.9fr` beside a blank `1.1fr` of cream — more than half the
 * card empty. No facts, one track.
 *
 * All content is props: no section copy, no link text, no fact lives in here.
 * No `use client` — everything is props in, markup out.
 */
export interface TrustFactProps {
    /**
     * Glyph for the 38px circle — a `GlyphBadge` at its defaults. Optional: the
     * circle still renders, keeping the title's left edge aligned across a stack
     * where only some facts have one. The disc is not resizable from here; a row
     * that wants a smaller one wants `GlyphBadge` directly, which is why it is a
     * separate export.
     */
    icon?: React.ReactNode;
    /** The fact itself, stated flat. This is the line a reader scans. */
    title: React.ReactNode;
    /** The qualifier under it — scope, limit, or how it is verified. */
    children?: React.ReactNode;
    className?: string;
}
export declare function TrustFact({ icon, title, children, className }: TrustFactProps): import("react").JSX.Element;
export interface TrustPanelProps {
    /**
     * The kicker above the heading — usually an `<Eyebrow>`.
     *
     * A slot, not a string, for the reason `links` gives: this band renders on
     * cream, where the invariant `chrome.*` colours `Eyebrow` ships with are
     * near-invisible, so the caller passes the chip with whatever override its
     * ground needs. See `Bridge`, which overrides exactly two utilities.
     *
     * Added 2026-08-14. Without it, adopting this component for a band that has
     * an eyebrow means dropping shipped copy — which is why two hand-rolled
     * bands on skene-site's homepage could not use it.
     */
    eyebrow?: React.ReactNode;
    /** The claim, as a heading. */
    title: React.ReactNode;
    /** One paragraph under it — the shape of the claim, not its proof. */
    lede?: React.ReactNode;
    /**
     * A wrapped row of anchors under the lede. A slot rather than a href list
     * because these are usually a mix of internal routes and external policy
     * links, and the caller owns which component renders each.
     */
    links?: React.ReactNode;
    /**
     * `TrustFact`s, in order. They draw their own separating rules, and they are
     * `<li>`s — this slot renders inside a `<ul>`, so pass facts, not arbitrary
     * markup. Omitting it collapses the panel to a single column.
     */
    children?: React.ReactNode;
    className?: string;
}
export declare function TrustPanel({ eyebrow, title, lede, links, children, className }: TrustPanelProps): import("react").JSX.Element;
//# sourceMappingURL=trust-panel.d.ts.map