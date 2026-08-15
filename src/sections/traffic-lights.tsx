import { cn } from '../lib/utils.js'

/**
 * The window furniture: three 10px dots, red then yellow then green.
 *
 * It exists because the recipe was written out five times — twice inside this
 * package, in `TerminalBlock`'s terminal bar and `PrReview`'s GitHub header, and
 * three more times outside it. Two skene-site routes
 * (`community/open-source`, `developers`) each declare a local `TrafficLights`
 * whose file comment says the same sentence: "the fix is upstream — export the
 * three spans from `@skene/design-system` and have all four call sites import
 * them." This is that export. Inventing the primitive app-side was
 * `ask_first_when: a_needed_primitive_or_pattern_does_not_exist`, which is why
 * those two files carried an apology instead of a component.
 *
 * ## NOT `patterns/Terminal`'s lights, and this does not replace them
 *
 * `patterns/terminal` draws the same three dots at the same 10px and does not
 * use this. Its lights are a `::before` on `.skene-terminal` in
 * `styles/effects.css`, painted with two box-shadows — unreachable from markup,
 * and unremovable through a `className`. That is precisely why a caller who
 * wants a light row anywhere else has had to hand-roll it: the only shipped copy
 * was welded into a frame that also brought an 8px radius and
 * `--shadow-terminal` with it.
 *
 * Which of the two terminals wins is the open decision recorded as `terminals`,
 * and this is not the change that settles it. Rewriting the CSS half would move
 * `pattern-terminal`'s baseline for a reason that has nothing to do with these
 * dots.
 *
 * ## The gap is the trap
 *
 * The two call sites in this package space the dots differently, and both
 * spacings shipped: `TerminalBlock` at 8px, `PrReview` at 12px because GitHub's
 * header is a step roomier than the terminal bar. 8px is the default here and
 * `PrReview` passes `gap-[12px]`, which `cn` resolves as a `gap` conflict so the
 * caller's value wins. That is the ONLY thing `className` is for on this
 * component. The colours are three invariant `terminal-chrome.traffic.*` tokens
 * and are deliberately not reachable from outside — a green "red" light is not a
 * variant, it is a bug with a prop in front of it.
 *
 * `TerminalBlock`'s dots used to be bare siblings of the bar's own flex row, so
 * the bar's `gap-[8px]` did the spacing. The wrapper below carries that same 8px
 * itself, which is why folding them in here moves nothing: three items at 8px
 * inside a 46px-wide wrapper occupy exactly the width the three loose items did,
 * and `ArtTitle`'s `ml-[12px]` still lands 20px from the green one.
 *
 * `aria-hidden` sits on the wrapper rather than on each dot, so the group is one
 * absence rather than three. These are furniture: they carry no state, and a
 * reader who is told "green" learns nothing about whether anything passed.
 */

export interface TrafficLightsProps {
  /**
   * Merged last. In practice the one utility worth passing is `gap-*` — see the
   * file header. Everything else lands on the wrapper, never on the dots.
   */
  className?: string
}

export function TrafficLights({ className }: TrafficLightsProps) {
  return (
    <span aria-hidden className={cn('flex shrink-0 items-center gap-[8px]', className)}>
      <span className="size-[10px] shrink-0 rounded-full bg-terminal-chrome-traffic-red" />
      <span className="size-[10px] shrink-0 rounded-full bg-terminal-chrome-traffic-yellow" />
      <span className="size-[10px] shrink-0 rounded-full bg-terminal-chrome-traffic-green" />
    </span>
  )
}
