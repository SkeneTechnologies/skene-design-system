'use client'

import {
  PILL_NAV_FROSTED_STYLE,
  PILL_NAV_POSITION,
} from '@skene/design-system/patterns/pill-nav-frosted'
import {
  PillNavMobileMenuLayers,
  PillNavMobileMenuToggle,
  usePillNavMobileMenuId,
} from '@skene/design-system/patterns/pill-nav-mobile-menu'
import { Button } from '@skene/design-system/ui/button'

/**
 * `patterns/pill-nav-mobile-menu`, open, at a phone viewport. Framed by
 * `pattern-pill-nav-mobile-menu` on /components and existing only for it.
 *
 * ## Why this is a route and not a `<Case>`
 *
 * Every layer in this module carries `md:hidden`, which is a VIEWPORT media
 * query, and the visual suite runs at 1280x900. In the gallery the toggle, the
 * backdrop and the panel are all `display: none`, so a case there captures an
 * element with no box — not a thin baseline, no baseline at all. Nothing inside
 * a page can change that: a container cannot narrow a media query, and
 * overriding `md:hidden` from the call site would produce a frame of geometry
 * the component never renders, which is worse than none.
 *
 * A same-origin iframe has its own viewport, so at 390px wide the module's own
 * breakpoint decides, unchanged, and the drawer really is the mobile drawer.
 * That is also the only honest way to hold the second half of the module: the
 * panel is `fixed inset-0`, so what it fills IS the viewport, and a capture at
 * 1280 would be a baseline of a phone sheet stretched across a desktop.
 *
 * ## What this page does NOT do
 *
 * It does not fake the open state. `isOpen` is passed as a literal `true`
 * rather than held in state, because there is nothing to toggle: the visual
 * suite has no interaction step before its main capture, and a case that
 * clicked its way open would be capturing a transition's end rather than a
 * declared state. `onOpenChange` is a no-op for the same reason — a link that
 * closed the sheet mid-capture is a flake, not a feature.
 *
 * Both toggle states sit in the bar: the same component twice, once
 * `isOpen`(Close and an X) and once not (Menu and a chevron). They are peers in
 * one frame rather than two captures because the pair is the affordance, and
 * the closed one is otherwise unreachable — the panel it belongs to is the
 * thing covering the screen.
 *
 * `dark` is written explicitly on the wrapper. The root layout sets no mode
 * class, so the iframe would otherwise take whatever `:root` defaults to, and
 * this drawer has no light reading to take: `#141414`, `white/10`, `white/90`
 * and the frosted `chrome.*` roles are invariant, and it is nav chrome that is
 * dark on every page of the consuming site. Both mode sweeps of the case are
 * therefore expected to produce identical files.
 */
export default function MobileMenuFramePage() {
  const panelId = usePillNavMobileMenuId()
  const links = [
    { href: '#product', label: 'Product', active: true },
    { href: '#pricing', label: 'Pricing' },
    { href: '#docs', label: 'Docs' },
    { href: '#blog', label: 'Blog' },
  ]

  return (
    <div className="dark relative min-h-screen bg-chrome-surface-darker">
      {/* The bar is `PILL_NAV_POSITION.absolute` and the module's own frosted
          wash, the same two constants `PillNav` uses, so the z-order under test
          is the shipped one: bar at 1050 over panel and backdrop at 1040. */}
      <div
        className={`${PILL_NAV_POSITION.absolute} flex items-center gap-3 px-4 py-3`}
        style={PILL_NAV_FROSTED_STYLE}
      >
        <span className="mr-auto text-[15px] font-medium text-chrome-text-primary">Skene</span>
        <PillNavMobileMenuToggle isOpen onOpenChange={() => {}} panelId={panelId} />
        <PillNavMobileMenuToggle isOpen={false} onOpenChange={() => {}} panelId={panelId} />
      </div>

      <PillNavMobileMenuLayers
        actions={
          <>
            <Button size="sm" variant="outline">
              Log In
            </Button>
            <Button size="sm">Start free</Button>
          </>
        }
        isOpen
        links={links}
        onOpenChange={() => {}}
        panelId={panelId}
      />
    </div>
  )
}
