---
"@skene/design-system": minor
---

Four additions asked for by `skene-marketing-website`, each replacing a
workaround it writes at multiple call sites.

- `Eyebrow` gains `onLight`. Its default border and ink are invariant
  `chrome.*` and do not follow a `light` ancestor, so on a cream panel the chip
  keeps its dark-page colours. Three modules in this package
  (`LightSectionCard`, `FaqBand`, `Bridge`) worked around that with the same
  two-utility `className` override, and the consumer writes it at fourteen more
  call sites. All three in-package sites now pass the prop; the rendering is
  identical.
- `PillNavLink` gains `asChild`, the Slot pattern `ui/button` and `ui/card`
  already use, so a menu trigger or a `next/link` composes the bar's slot
  instead of copying its seven-utility class string. `href` becomes optional
  and is not forwarded under `asChild`; an item without one is skipped when
  `PillNav` builds the mobile drawer.
- `TerminalBlockLine` gains `wrap`. The default still scrolls the line in
  place, which is right for a command a reader runs. `wrap` is for the line
  whose whole text is the point and cannot sit on one row at 390px: it cancels
  the nowrap, allows a break mid-token, and hangs the continuation under the
  command. The consumer writes those four utilities as a `display` override at
  three sites, which also puts markup between the reader and the paste for a
  reason that has nothing to do with what the line says.
- `FeatureRow`'s `n` is now `aria-hidden`, unconditionally. It is a corner
  marker, the heading beside it carries the whole accessible name, and no prop
  reached it — so a consumer could not fix it either. Measured from the
  accessibility tree on the live site: two `FeatureRow` benefits exposed a bare
  "01" and "03" while a hand-rolled "02" between them was correctly silent.
  `NumberedStep`'s numeral has always done this.
