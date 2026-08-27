'use client'

import { Children, isValidElement, useId, useMemo, useState } from 'react'
import { Slot } from '@radix-ui/react-slot'

import { cn } from '../lib/utils.js'
import { PILL_NAV_FROSTED_STYLE, PILL_NAV_POSITION } from './pill-nav-frosted.js'
import {
  PillNavMobileMenuLayers,
  PillNavMobileMenuToggle,
  type PillNavMobileLink,
} from './pill-nav-mobile-menu.js'

export interface PillNavProps {
  /** Brand mark. The package ships no logo, so pass one. */
  brand?: React.ReactNode
  /** Right-hand actions on desktop; repeated in the mobile drawer footer. */
  actions?: React.ReactNode
  className?: string
  /** `absolute` overlays hero media; `sticky` stays visible on scroll. Default `absolute`. */
  position?: 'absolute' | 'sticky'
  children: React.ReactNode
}

function collectMobileLinks(children: React.ReactNode): PillNavMobileLink[] {
  const links: PillNavMobileLink[] = []
  Children.forEach(children, (child) => {
    if (!isValidElement<{ href?: string; active?: boolean; children: React.ReactNode }>(child)) {
      return
    }
    const isPillNavLink =
      child.type === PillNavLink ||
      (typeof child.type === 'function' && child.type.name === 'PillNavLink')
    if (!isPillNavLink) return
    // `href` became optional with `asChild`, and the drawer is a list of
    // destinations: a trigger that opens a menu has none, so it is skipped
    // here rather than pushed in with `href: undefined` and rendered as a
    // dead row. An `asChild` link that SHOULD appear in the drawer passes
    // `href` on the PillNavLink as well as on its child.
    if (!child.props.href) return
    links.push({
      href: child.props.href,
      label: child.props.children,
      active: child.props.active,
    })
  })
  return links
}

/**
 * Floating pill navigation with a marketing-site mobile drawer below `md`.
 */
export function PillNav({
  brand,
  actions,
  className,
  position = 'absolute',
  children,
}: PillNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileLinks = useMemo(() => collectMobileLinks(children), [children])
  const panelId = useId()

  return (
    <>
      <div
        className={cn(
          PILL_NAV_POSITION[position],
          'pointer-events-none flex items-center justify-between gap-4 p-4 md:px-6',
          className,
        )}
      >
        {/* Desktop: frosted left pill with brand + inline links. */}
        <nav
          className={cn(
            'pointer-events-auto hidden shrink-0 flex-nowrap items-center gap-1 rounded-[4px] py-2 pl-4 pr-2 md:flex',
          )}
          style={PILL_NAV_FROSTED_STYLE}
        >
          {brand ? <span className="mr-2 flex shrink-0 items-center">{brand}</span> : null}
          <span className="flex flex-nowrap items-center gap-0.5">{children}</span>
        </nav>

        {/* Mobile: logo only, no frosted wrapper. */}
        {brand ? (
          <div className="pointer-events-auto relative z-[1050] flex shrink-0 items-center md:hidden">
            {brand}
          </div>
        ) : null}

        <PillNavMobileMenuToggle
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          panelId={panelId}
        />

        {actions ? (
          <div className="pointer-events-auto hidden shrink-0 items-center gap-1 md:flex">{actions}</div>
        ) : null}
      </div>

      <PillNavMobileMenuLayers
        links={mobileLinks}
        actions={actions}
        isOpen={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        panelId={panelId}
      />
    </>
  )
}

export interface PillNavLinkProps {
  /**
   * Where the item goes. Optional only because `asChild` exists: a menu
   * trigger occupies the same slot and has no destination. Pass it whenever
   * there is one, `asChild` or not — `PillNav` reads it to build the mobile
   * drawer, and an item without one does not appear there.
   */
  href?: string
  children: React.ReactNode
  className?: string
  active?: boolean
  /**
   * Render as the single child instead of an `<a>` — the same Slot mechanism
   * `ui/button` and `ui/card` use.
   *
   * Without it, anything that is not a plain anchor in this bar has to copy the
   * class string. skene-marketing-website does exactly that: its nav dropdown
   * trigger reproduces all seven utilities verbatim so the menu sits in the
   * same slot as the links either side of it, which means the bar's hover ink,
   * its active peach and its 4px radius now live in two places and drift on the
   * next change. A Radix `DropdownMenuTrigger`, a `next/link`, or a button
   * composes through this instead.
   *
   * `href` is not forwarded when `asChild` is set: the child owns its own
   * element, and an `href` landing on a `<button>` trigger is invalid markup.
   */
  asChild?: boolean
}

export function PillNavLink({
  href,
  children,
  className,
  active = false,
  asChild = false,
}: PillNavLinkProps) {
  const Comp = asChild ? Slot : 'a'
  return (
    <Comp
      {...(asChild ? {} : { href })}
      data-pill-nav-link=""
      className={cn(
        'rounded-[4px] px-4 py-1.5 text-sm tracking-[-0.01em] whitespace-nowrap shrink-0 transition-colors duration-150',
        active ? 'text-brand-peach' : 'text-white/90',
        'hover:bg-white/[0.06] hover:text-chrome-text-primary',
        className,
      )}
    >
      {children}
    </Comp>
  )
}
