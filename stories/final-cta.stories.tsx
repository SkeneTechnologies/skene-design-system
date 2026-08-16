import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { FinalCta } from '@skene/design-system/sections/final-cta'
import { Button } from '@skene/design-system/ui/button'

/**
 * `FinalCta` — the closing band.
 *
 * `backdrop` defaults to `pixel-bg.webp`, resolved with `new URL(..., import.meta.url)`
 * so a consumer gets a bundled URL from the import rather than having to copy
 * the asset into its own `public/`. Pass a string to override it, or `false`
 * for the gradient alone. That is the interesting axis here and the reason the
 * three stories below differ.
 */
const meta = {
  title: 'Sections/FinalCta',
  component: FinalCta,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    backdrop: { control: 'text', description: 'Image URL, or false for the gradient alone.' },
  },
} satisfies Meta<typeof FinalCta>

export default meta
type Story = StoryObj<typeof meta>

const shared = {
  eyebrow: <span className="font-mono text-[11px] tracking-[0.08em] text-chrome-text-muted">GET STARTED</span>,
  children: 'Find out what you are not measuring.',
  lede: 'Scan one repository free. No SDK swap, no tag manager.',
  actions: (
    <>
      <Button>Start free</Button>
      <Button variant="outline">Talk to us</Button>
    </>
  ),
}

/** The shipped default — the bundled pixel backdrop. */
export const Default: Story = { args: shared }

/** Gradient alone. Text contrast is highest here, so it is the safe fallback. */
export const NoBackdrop: Story = { args: { ...shared, backdrop: false } }

/** One action, no lede — the compact shape smaller pages use. */
export const SingleAction: Story = {
  args: {
    children: 'Find out what you are not measuring.',
    actions: <Button>Start free</Button>,
  },
}
