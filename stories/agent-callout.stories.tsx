import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { AgentCallout } from '@skene/design-system/sections/agent-callout'

/**
 * `AgentCallout` — a short aside in an agent's voice, with optional evidence
 * under it.
 *
 * ## `children` takes PHRASING content, not blocks
 *
 * The prop is typed `React.ReactNode`, which suggests anything is allowed. It is
 * not: the component wraps `children` in its own `<p>`, so passing a `<p>`
 * produces `<p>` inside `<p>` — invalid HTML that React reports as "cannot be a
 * descendant of", and which the browser silently repairs by CLOSING the outer
 * paragraph early. The result is markup that does not match the tree you wrote.
 *
 * So this slot holds a sentence, `<strong>`, `<code>`, a `<span>` — not
 * paragraphs, lists or divs. A callout that needs two paragraphs needs a second
 * callout, or a component change. The type cannot express this, which is why it
 * is written down here.
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
    children:
      'The signup route fires nothing between the form submit and the redirect, so every funnel that starts here is missing its second step.',
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
  args: { children: 'One sentence, nothing around it.' },
}

/** Inline markup, which is what the slot does accept. */
export const WithInlineMarkup: Story = {
  args: {
    eyebrow: 'What an agent sees',
    children: (
      <>
        <code>signup_started</code> fires <strong>nowhere</strong> on this route.
      </>
    ),
  },
}

/**
 * Long body, to check the measure and the wrap. One paragraph, because the slot
 * cannot hold two — see the file header.
 */
export const LongBody: Story = {
  args: {
    ...WithAvatar.args,
    children:
      'Three of the six milestones on this journey have no binding at all, and two more are bound to events that stopped firing when the checkout route moved. The remaining one fires twice. None of this is visible in the dashboard, because a milestone with no binding renders as a zero rather than as a gap.',
  },
}
