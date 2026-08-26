import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { SkeneLockup } from '@skene/design-system/patterns/skene-mark'
import { PillNav, PillNavLink } from '@skene/design-system/patterns/pill-nav'

/**
 * The floating pill nav: frosted brand-and-links pill on the left, actions on
 * the right, and below `md` the drawer that `pill-nav-mobile-menu`'s own
 * stories exercise — so these stories stay on the desktop half.
 *
 * The nav positions itself (`absolute` overlays hero media, `sticky` follows
 * scroll), so every story gives it a dark positioned container tall enough to
 * show the frost doing its job over a non-uniform ground.
 */
const meta = {
  title: 'Patterns/PillNav',
  component: PillNav,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof PillNav>

export default meta
type Story = StoryObj<typeof meta>

/** The marketing site's real top-level nav. No invented pages. */
const links = (
  <>
    <PillNavLink href="/product">Product</PillNavLink>
    <PillNavLink href="/use-cases">Use cases</PillNavLink>
    <PillNavLink href="/developers" active>
      Developers
    </PillNavLink>
    <PillNavLink href="/pricing">Pricing</PillNavLink>
  </>
)

function Ground({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative min-h-[360px] overflow-hidden bg-chrome-surface-darker"
      style={{
        background:
          'linear-gradient(135deg, var(--color-chrome-surface-darker) 0%, #2b2018 55%, var(--color-chrome-surface-darker) 100%)',
      }}
    >
      {children}
    </div>
  )
}

/** `absolute`, the default: the pill overlaying a hero-shaped ground. */
export const Default: Story = {
  render: () => (
    <Ground>
      <PillNav brand={<SkeneLockup height={20} />}>{links}</PillNav>
    </Ground>
  ),
}

/** The right-hand action cluster, which the drawer repeats in its footer. */
export const WithActions: Story = {
  render: () => (
    <Ground>
      <PillNav
        brand={<SkeneLockup height={20} />}
        actions={
          <a
            href="/signup"
            className="rounded-[4px] bg-brand-peach px-4 py-1.5 text-sm font-medium text-[#0a0a0a]"
          >
            Start free
          </a>
        }
      >
        {links}
      </PillNav>
    </Ground>
  ),
}
