---
"@skene/design-system": patch
---

`PillNavMobileMenu` gets a baseline, and the gallery gets its first iframe

`patterns/pill-nav-mobile-menu` is the consuming site's mobile navigation, which
every page of it carries, and it was `seen: []` — nothing in this repository had
ever rendered it, so every claim its contract makes was unproven.

It could not simply be added to `/components`. Every layer in the module carries
`md:hidden`, which is a VIEWPORT media query, and the visual suite runs at
1280x900: rendered inline, the toggle, the backdrop and the panel are all
`display: none`, so a case there captures an element with no box. That is not a
thin baseline, it is none. Nothing inside the page can change it either — a
container cannot narrow a media query, and overriding `md:hidden` from the call
site would hold geometry the component never produces, which is worse than
holding nothing.

A same-origin iframe has its own viewport. `docs-app/app/components/mobile-menu`
renders the open sheet, and the case embeds it at 390x760, where the module's own
breakpoint decides unchanged. That also settles the second half: the panel is
`fixed inset-0`, so what it fills IS the viewport, and a 1280-wide capture would
have been a baseline of a phone sheet stretched across a desktop.

The frame holds the open sheet on #141414, measured off the render rather than
read off the classes: the frosted bar over it at z-1050 against the panel and
backdrop at z-1040, which is the shipped z-order and the thing most likely to
break silently; the panel's top inset of 44.8px, which is `pt-14` at this
package's `--spacing: 0.2rem` rather than the 56 the class name suggests, and
which clears the frame's 43.69px bar by 1.1px; 19.2px of side padding; four link
rows at 24px type on 12.8px of vertical padding with a 1px white/10 hairline
between each and one under the last; the active link at rgb(254,192,137) against
white/90 for the rest; and the actions row at 19.2px padding and a 6.4px gap. Both toggle states
are in the bar, the same component twice at a 4px radius and 12px mono, because
the closed one is otherwise unreachable — the panel it belongs to is what covers
the screen.

Three things are deliberately NOT held, and the case says so: the transition
between states, because the module returns `null` when closed and there is no
intermediate DOM; the `document.body.style.overflow` lock, which is a side effect
with no pixels; and everything at 768 and up, where every layer is `display:
none` by design and correctly renders nothing.

The open state is a literal `true` rather than state a click has to reach. The
suite has no interaction step before its main capture, so a case that clicked its
way open would be capturing the end of a transition rather than a declared state,
and `onOpenChange` is a no-op because a link that closed the sheet mid-capture is
a flake, not a feature. `dark` is written explicitly on the route: the drawer is
invariant nav chrome with no light reading, so both mode sweeps produce identical
files, and that is the assertion rather than an accident.

Floor 87 → 88. Two unproven modules remain,
`sections/card-animation-integrations` and `sections/journey-signal-scene`, both
multi-state; `ui/sonner` stays uncovered on purpose.
