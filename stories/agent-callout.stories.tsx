import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { AgentCallout } from '@skene/design-system/sections/agent-callout'

/**
 * `AgentCallout` — a short aside in an agent's voice, with optional evidence
 * under it.
 *
 * The copy in these stories is example copy and is not canon. Anything that
 * ships in this slot states something about the product, so it goes through
 * `check-claims.sh` like any other page text.
 */
const meta = {
  title: 'Sections/AgentCallout',
  component: AgentCallout,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AgentCallout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    eyebrow: 'What an agent sees',
    children: (
      <p>
        The signup route fires nothing between the form submit and the redirect,
        so every funnel that starts here is missing its second step.
      </p>
    ),
  },
}

export const WithEvidence: Story = {
  args: {
    ...Default.args,
    evidence: (
      <code className="font-mono text-[12px]">app/(auth)/signup/page.tsx:88</code>
    ),
  },
}

export const WithAvatar: Story = {
  args: {
    ...WithEvidence.args,
    avatar: <span aria-hidden>◆</span>,
  },
}

/** No eyebrow, no evidence, no avatar — the smallest legal shape. */
export const BareQuote: Story = {
  args: { children: <p>One sentence, nothing around it.</p> },
}

/** Long body, to check the measure and the wrap. */
export const LongBody: Story = {
  args: {
    ...WithAvatar.args,
    children: (
      <>
        <p>
          Three of the six milestones on this journey have no binding at all, and
          two more are bound to events that stopped firing when the checkout
          route moved. The remaining one fires twice.
        </p>
        <p>
          None of this is visible in the dashboard, because a milestone with no
          binding renders as a zero rather than as a gap.
        </p>
      </>
    ),
  },
}
