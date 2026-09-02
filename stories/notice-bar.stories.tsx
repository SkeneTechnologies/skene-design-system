import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { NoticeBar } from '@skene/design-system/sections/notice-bar'

/**
 * The full-bleed advisory bar across the top of a page.
 *
 * Ported from `skene-marketing-website`'s `ArchiveBanner`, where seven
 * route-group layouts render one to say the page below is from an earlier
 * version of the product.
 *
 * It is deliberately NOT a variant of `Alert`. Alert is an inset card with a
 * title and a description that sits in the content, bordered on four sides and
 * inside the page's measure; this spans the viewport, sits above it, and
 * separates itself with one hairline. Neither becomes the other without growing
 * a prop that removes its own shape.
 */
const meta = {
  title: 'Sections/NoticeBar',
  component: NoticeBar,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    role: { control: 'inline-radio', options: ['note', 'status', 'alert'] },
  },
  args: {
    children: 'From an earlier version of Skene.',
  },
} satisfies Meta<typeof NoticeBar>

export default meta
type Story = StoryObj<typeof meta>

/** The case it was built for: an advisory about the page you are already on. */
export const Archived: Story = {}

/**
 * With the link the retired implementation carried. The anchor is the caller's,
 * so its colour and hover are a page decision rather than the bar's.
 */
export const WithLink: Story = {
  args: {
    children: (
      <span>
        From an earlier version of Skene.{' '}
        <a
          href="/product"
          className="whitespace-nowrap border-b border-transparent text-brand-peach hover:border-brand-peach"
        >
          See the current product →
        </a>
      </span>
    ),
  },
}

/**
 * `role="status"` for a polite live region: a screen reader announces it at the
 * next pause rather than interrupting.
 *
 * The role is a prop because `Alert` gets this wrong in the other direction. It
 * hardcodes `role="alert"`, which is assertive and interrupts whatever is being
 * read. That is right for "your payment failed" and wrong for "this page is
 * archived".
 */
export const PoliteStatus: Story = {
  args: { role: 'status', children: 'Reading a cached copy. Last updated 6 minutes ago.' },
}

/**
 * Over a textured ground, which is the reason the fill is translucent rather
 * than a `chrome.surface.*` token. Every page this sits on paints a dither
 * behind it; an opaque fill would punch a flat rectangle through it.
 */
export const OverTexture: Story = {
  decorators: [
    (Story) => (
      <div className="bg-[repeating-conic-gradient(#1b1b1b_0%_25%,#0e0e0e_0%_50%)] bg-[length:8px_8px] py-0">
        <Story />
      </div>
    ),
  ],
}
