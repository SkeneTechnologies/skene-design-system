import { cn } from '../lib/utils.js'
import { SkeneMark } from '../patterns/skene-mark.js'

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
  avatar?: React.ReactNode
  /** Mono kicker over the claim — "SKENE FOUND THE CAUSE". Absent on the nested instance. */
  eyebrow?: React.ReactNode
  /** The claim. One sentence, in bold. This is the only required slot. */
  children: React.ReactNode
  /**
   * What the claim rests on, under it. The live copy is dot-separated fragments —
   * "One broken signal · one missing signal" — and the separators are content.
   */
  evidence?: React.ReactNode
  className?: string
}

export function AgentCallout({ avatar, eyebrow, children, evidence, className }: AgentCalloutProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3.5 rounded-2xl border px-4 py-3.5',
        className,
      )}
      style={{
        // Both edges derive from the same peach so a token change moves them
        // together. Written as color-mix rather than two hand-picked tints
        // because a hardcoded rgba would not follow `brand.peach` at all.
        borderColor: 'color-mix(in oklab, var(--color-brand-peach) 34%, transparent)',
        background:
          'linear-gradient(180deg, color-mix(in oklab, var(--color-brand-peach) 9%, var(--color-chrome-surface-1)), var(--color-chrome-surface-1))',
      }}
    >
      {avatar ? (
        <span
          aria-hidden
          className="mt-0.5 grid size-7 shrink-0 place-items-center overflow-hidden rounded-lg"
        >
          {avatar}
        </span>
      ) : (
        // The real symbol, not a letter in a disc. The demo drew a peach circle
        // with an "S" in it because it had no access to the artwork; this
        // package ships the artwork, and every place the product speaks for
        // itself uses the same mark.
        <SkeneMark size={28} radius={10} className="mt-0.5" />
      )}

      <div className="min-w-0">
        {eyebrow ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brand-peach">
            {eyebrow}
          </p>
        ) : null}
        <p
          className={cn(
            'text-[14px] font-medium leading-snug text-chrome-text-primary',
            eyebrow && 'mt-1.5',
          )}
        >
          {children}
        </p>
        {evidence ? (
          <p className="mt-1 text-[12px] leading-snug text-chrome-text-muted">{evidence}</p>
        ) : null}
      </div>
    </div>
  )
}
