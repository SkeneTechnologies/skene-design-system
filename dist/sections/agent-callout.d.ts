/**
 * The moment Skene speaks on the page: an avatar, the claim in bold, and the
 * evidence it rests on.
 *
 * Every other artifact in this package SHOWS something — a funnel, a table, a
 * release check. This one is the verdict drawn from what was shown, and it sits
 * directly under the artifact it is about. That adjacency is the whole reason it
 * is a framed block with its own fill rather than a paragraph: a bare sentence
 * under a chart reads as a caption, and a caption is not a claim.
 *
 * It shipped twice on the captured demo, which is what makes it a component: once
 * standing under the activation funnel with an eyebrow ("SKENE FOUND THE CAUSE"),
 * once nested inside a dark release window with no eyebrow and no evidence line.
 * The two differ only in which slots are filled.
 *
 * ## `chrome.*` is correct here, and this is the exception that proves the rule
 *
 * The invariant chrome tokens are wrong on anything that can inverte— they cannot
 * follow a `light` ancestor, so cream type lands on a cream fill. This block
 * paints its OWN near-black ground inside its own border, exactly like
 * `AskWidget`, so nothing under its type can flip. The moment someone gives it a
 * light variant, every `chrome.text.*` in here has to become the theme-aware
 * `text.*` role.
 *
 * ## The border is peach and the fill is peach-tinted, at 1/10 the strength
 *
 * Peach is the brand's voice, and this is the one block on the page that IS the
 * brand speaking, so the tint is doing semantic work rather than decoration. It
 * stays a tint: a solid peach panel here would outrank the artifact it is
 * commenting on, and `Finding`'s status colours — which mean a MEASURED state —
 * would then have to compete with it.
 *
 * ## The avatar is a slot
 *
 * The live instances render a peach disc with an "S" in it, but a caller with a
 * real avatar image should not have to fight a baked-in one. `avatar` takes a
 * node and the disc is drawn only when nothing is passed, so the default costs
 * nobody an import.
 */
export interface AgentCalloutProps {
    /**
     * The disc left of the copy. Defaults to a peach "S" — pass an `<img>` or an
     * icon to override. Decorative: the claim already says who is speaking.
     */
    avatar?: React.ReactNode;
    /** Mono kicker over the claim — "SKENE FOUND THE CAUSE". Absent on the nested instance. */
    eyebrow?: React.ReactNode;
    /** The claim. One sentence, in bold. This is the only required slot. */
    children: React.ReactNode;
    /**
     * What the claim rests on, under it. The live copy is dot-separated fragments —
     * "One broken signal · one missing signal" — and the separators are content.
     */
    evidence?: React.ReactNode;
    className?: string;
}
export declare function AgentCallout({ avatar, eyebrow, children, evidence, className }: AgentCalloutProps): import("react").JSX.Element;
//# sourceMappingURL=agent-callout.d.ts.map