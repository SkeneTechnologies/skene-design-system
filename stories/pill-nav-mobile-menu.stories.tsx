import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useId, useState } from 'react'

import {
  PillNavMobileMenuLayers,
  PillNavMobileMenuToggle,
} from '@skene/design-system/patterns/pill-nav-mobile-menu'

/**
 * `PillNavMobileMenu` — the mobile drawer `PillNav` renders below `md`: a
 * frosted Menu/Close toggle in the top bar, and an overlay + full-screen panel
 * mounted as SIBLINGS of the bar so Close stays above the drawer's z-[1040].
 *
 * This was the one module in the package with no story at all. Patterns are
 * excluded from the coverage ratchet, so its `seen: []` in the inventory was
 * structural, not a queue entry — nothing would ever have forced a baseline.
 * These stories close that gap.
 *
 * Every piece here is `md:hidden`, which a wrapper div cannot fake: it is a
 * media query on the real viewport. So each story pins the mobile viewport via
 * `globals`, the same way `comparison-table`'s narrow case does. On a desktop
 * canvas the stories would render nothing, correctly.
 */
const meta = {
  title: 'Patterns/PillNavMobileMenu',
  component: PillNavMobileMenuLayers,
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'mobile1' } },
} satisfies Meta<typeof PillNavMobileMenuLayers>

export default meta
type Story = StoryObj<typeof meta>

/** The marketing site's real top-level nav. No invented pages. */
const LINKS = [
  { href: '/product', label: 'Product' },
  { href: '/use-cases', label: 'Use cases' },
  { href: '/developers', label: 'Developers', active: true },
  { href: '/pricing', label: 'Pricing' },
  { href: '/resources', label: 'Resources' },
]

function MobileMenuDemo({ initialOpen }: { initialOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const panelId = useId()

  return (
    <div className="min-h-[520px]">
      <div className="flex items-center justify-end p-4">
        <PillNavMobileMenuToggle isOpen={isOpen} onOpenChange={setIsOpen} panelId={panelId} />
      </div>
      <PillNavMobileMenuLayers
        links={LINKS}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        panelId={panelId}
      />
    </div>
  )
}

/**
 * The resting state: the frosted Menu trigger alone in the bar, drawer
 * unmounted (`Layers` returns null while closed). Clicking it opens the real
 * drawer, so the open/close cycle is exercisable, not just pictured.
 */
export const Closed: Story = {
  render: () => <MobileMenuDemo initialOpen={false} />,
}

/**
 * The drawer open on first paint: dimmed overlay, full-screen panel, the link
 * list with its top hairlines (and the closing one on the last row), the
 * active route in peach, and Close pinned above the panel in the bar.
 */
export const Open: Story = {
  render: () => <MobileMenuDemo initialOpen={true} />,
}

/** The drawer's footer slot: actions rendered at the bottom of the panel. */
export const OpenWithActions: Story = {
  render: function OpenWithActionsStory() {
    const [isOpen, setIsOpen] = useState(true)
    const panelId = useId()

    return (
      <div className="min-h-[520px]">
        <div className="flex items-center justify-end p-4">
          <PillNavMobileMenuToggle isOpen={isOpen} onOpenChange={setIsOpen} panelId={panelId} />
        </div>
        <PillNavMobileMenuLayers
          links={LINKS}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          panelId={panelId}
          actions={
            <a
              href="/signup"
              className="flex-1 rounded-[4px] bg-brand-peach px-4 py-2.5 text-center text-sm font-medium text-[#0a0a0a]"
            >
              Get started
            </a>
          }
        />
      </div>
    )
  },
}
